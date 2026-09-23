import { Router } from "express";
import { db } from "../db.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
const borrowRouter = Router();
borrowRouter.get("/my-books", authenticateToken, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    db.recomputeOverdues();
    const data = db.getSnapshot();
    const studentRegNo = req.user.collegeRegistrationNo.toUpperCase();
    const userBorrows = data.borrows.filter((b) => b.studentRegistrationNo.toUpperCase() === studentRegNo).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ borrows: userBorrows });
  } catch (error) {
    console.error("Error fetching student books:", error);
    res.status(500).json({ message: "Unable to fetch your borrowed books." });
  }
});
borrowRouter.get("/all", authenticateToken, requireRole(["staff", "admin"]), (req, res) => {
  try {
    db.recomputeOverdues();
    const { status, search } = req.query;
    const data = db.getSnapshot();
    let borrows = [...data.borrows];
    if (status && typeof status === "string" && status !== "ALL") {
      borrows = borrows.filter((b) => b.status.toUpperCase() === status.trim().toUpperCase());
    }
    if (search && typeof search === "string") {
      const q = search.trim().toLowerCase();
      borrows = borrows.filter(
        (b) => b.studentRegistrationNo.toLowerCase().includes(q) || b.bookTitle.toLowerCase().includes(q) || b.bookIsbn.toLowerCase().includes(q) || b.bookAuthor.toLowerCase().includes(q)
      );
    }
    borrows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ borrows, total: borrows.length });
  } catch (error) {
    console.error("Error fetching all borrows:", error);
    res.status(500).json({ message: "Unable to fetch borrowing records." });
  }
});
borrowRouter.post("/request", authenticateToken, (req, res) => {
  try {
    const { bookId, studentRegistrationNo } = req.body;
    if (!bookId) {
      res.status(400).json({ message: "Book ID is required." });
      return;
    }
    db.recomputeOverdues();
    const data = db.getSnapshot();
    let targetRegNo;
    if (req.user?.role === "staff" || req.user?.role === "admin") {
      if (!studentRegistrationNo) {
        res.status(400).json({ message: "Student registration number is required for staff issue." });
        return;
      }
      targetRegNo = studentRegistrationNo.trim().toUpperCase();
    } else {
      targetRegNo = req.user.collegeRegistrationNo.toUpperCase();
    }
    const studentUser = data.users.find(
      (u) => u.collegeRegistrationNo.toUpperCase() === targetRegNo
    );
    if (!studentUser) {
      res.status(404).json({ message: `Student registration ${targetRegNo} was not found.` });
      return;
    }
    if (!studentUser.active) {
      res.status(403).json({ message: "Student account is deactivated. Cannot issue books." });
      return;
    }
    const bookIndex = data.books.findIndex((b) => b._id === bookId);
    if (bookIndex === -1) {
      res.status(404).json({ message: "Book not found in library catalog." });
      return;
    }
    const book = data.books[bookIndex];
    if (book.availableCopies <= 0) {
      res.status(400).json({ message: "Book is currently unavailable. All copies are in circulation." });
      return;
    }
    const alreadyBorrowed = data.borrows.some(
      (b) => b.studentRegistrationNo.toUpperCase() === targetRegNo && b.book === bookId && (b.status === "ISSUED" || b.status === "OVERDUE")
    );
    if (alreadyBorrowed) {
      res.status(400).json({
        message: "Student already has an active or overdue copy of this book."
      });
      return;
    }
    const now = /* @__PURE__ */ new Date();
    const borrowDurationDays = data.settings?.borrowDurationDays ?? 14;
    const dueDate = new Date(now.getTime() + borrowDurationDays * 24 * 60 * 60 * 1e3);
    const newBorrow = {
      _id: `brw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      student: studentUser._id,
      studentRegistrationNo: targetRegNo,
      book: book._id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookIsbn: book.isbn,
      issueDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      status: "ISSUED",
      lateDays: 0,
      penaltyAmount: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    const formattedIssue = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const formattedDue = dueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const staffNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}_s`,
      recipient: "STAFF_ADMIN",
      type: "BOOK_BORROWED",
      title: "NEW BOOK BORROWED",
      message: `Student: ${targetRegNo} | Book: "${book.title}" | Issue Date: ${formattedIssue} | Due Date: ${formattedDue}`,
      relatedBook: book._id,
      relatedBorrow: newBorrow._id,
      isRead: false,
      createdAt: now.toISOString()
    };
    const studentNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}_u`,
      recipient: targetRegNo,
      type: "BOOK_BORROWED",
      title: "BOOK ISSUED",
      message: `You have successfully borrowed "${book.title}". Please return by ${formattedDue} to avoid penalties.`,
      relatedBook: book._id,
      relatedBorrow: newBorrow._id,
      isRead: false,
      createdAt: now.toISOString()
    };
    db.updateSnapshot((snap) => {
      snap.books[bookIndex].availableCopies = Math.max(0, snap.books[bookIndex].availableCopies - 1);
      snap.books[bookIndex].updatedAt = now.toISOString();
      snap.borrows.unshift(newBorrow);
      snap.notifications.unshift(staffNotif);
      snap.notifications.unshift(studentNotif);
    });
    res.status(201).json({
      message: "Book issued successfully.",
      borrow: newBorrow
    });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({ message: "Unable to process book borrowing request." });
  }
});
borrowRouter.post("/:id/return", authenticateToken, requireRole(["staff", "admin"]), (req, res) => {
  try {
    const { id } = req.params;
    const data = db.getSnapshot();
    const borrowIndex = data.borrows.findIndex((b) => b._id === id);
    if (borrowIndex === -1) {
      res.status(404).json({ message: "Borrowing transaction not found." });
      return;
    }
    const borrow = data.borrows[borrowIndex];
    if (borrow.status === "RETURNED") {
      res.status(400).json({ message: "This book has already been marked as returned." });
      return;
    }
    const now = /* @__PURE__ */ new Date();
    const dueDate = new Date(borrow.dueDate);
    const dailyPenalty = data.settings?.dailyPenalty ?? 10;
    let lateDays = 0;
    let penaltyAmount = 0;
    if (now > dueDate) {
      const diffMs = now.getTime() - dueDate.getTime();
      lateDays = Math.max(1, Math.ceil(diffMs / (1e3 * 60 * 60 * 24)));
      penaltyAmount = lateDays * dailyPenalty;
    }
    const formattedReturn = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const returnNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}_r`,
      recipient: borrow.studentRegistrationNo,
      type: "BOOK_RETURNED",
      title: "BOOK RETURNED",
      message: `"${borrow.bookTitle}" has been marked as returned on ${formattedReturn}.${penaltyAmount > 0 ? ` Outstanding penalty: Rs. ${penaltyAmount} (${lateDays} days late).` : " Thank you for returning on time!"}`,
      relatedBook: borrow.book,
      relatedBorrow: borrow._id,
      isRead: false,
      createdAt: now.toISOString()
    };
    db.updateSnapshot((snap) => {
      const bookIdx = snap.books.findIndex((b) => b._id === borrow.book);
      if (bookIdx !== -1) {
        snap.books[bookIdx].availableCopies = Math.min(
          snap.books[bookIdx].totalCopies,
          snap.books[bookIdx].availableCopies + 1
        );
        snap.books[bookIdx].updatedAt = now.toISOString();
      }
      snap.borrows[borrowIndex] = {
        ...borrow,
        returnDate: now.toISOString(),
        status: "RETURNED",
        lateDays,
        penaltyAmount,
        updatedAt: now.toISOString()
      };
      snap.notifications.unshift(returnNotif);
    });
    res.json({
      message: "Book returned successfully.",
      borrow: {
        ...borrow,
        returnDate: now.toISOString(),
        status: "RETURNED",
        lateDays,
        penaltyAmount
      }
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Unable to process book return." });
  }
});
export {
  borrowRouter
};
