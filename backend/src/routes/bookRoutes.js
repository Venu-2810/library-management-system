import { Router } from "express";
import { db } from "../db.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
const bookRouter = Router();
bookRouter.get("/", (req, res) => {
  try {
    const { search, category, availability, author } = req.query;
    const data = db.getSnapshot();
    let books = [...data.books];
    if (search && typeof search === "string") {
      const q = search.trim().toLowerCase();
      books = books.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q) || b.publisher.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
      );
    }
    if (category && typeof category === "string" && category !== "ALL") {
      books = books.filter(
        (b) => b.category.toLowerCase() === category.trim().toLowerCase()
      );
    }
    if (author && typeof author === "string" && author !== "ALL") {
      books = books.filter(
        (b) => b.author.toLowerCase() === author.trim().toLowerCase()
      );
    }
    if (availability && typeof availability === "string") {
      if (availability === "available") {
        books = books.filter((b) => b.availableCopies > 0);
      } else if (availability === "unavailable") {
        books = books.filter((b) => b.availableCopies <= 0);
      }
    }
    books.sort((a, b) => a.title.localeCompare(b.title));
    const categories = Array.from(new Set(data.books.map((b) => b.category))).sort();
    const authors = Array.from(new Set(data.books.map((b) => b.author))).sort();
    res.json({
      books,
      total: books.length,
      categories,
      authors
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Unable to fetch books catalog." });
  }
});
bookRouter.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = db.getSnapshot();
    const book = data.books.find((b) => b._id === id);
    if (!book) {
      res.status(404).json({ message: "Book not found." });
      return;
    }
    res.json({ book });
  } catch (error) {
    console.error("Error fetching book detail:", error);
    res.status(500).json({ message: "Unable to fetch book details." });
  }
});
bookRouter.post("/", authenticateToken, requireRole(["staff", "admin"]), (req, res) => {
  try {
    const {
      title,
      author,
      publisher,
      publicationYear,
      isbn,
      category,
      description,
      totalCopies,
      shelf,
      coverImage
    } = req.body;
    if (!title || !author || !isbn || !category) {
      res.status(400).json({ message: "Title, author, ISBN, and category are required." });
      return;
    }
    const copies = Math.max(1, parseInt(totalCopies, 10) || 1);
    const pubYear = parseInt(publicationYear, 10) || (/* @__PURE__ */ new Date()).getFullYear();
    const newBookId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newBook = {
      _id: newBookId,
      title: title.trim(),
      author: author.trim(),
      publisher: publisher ? publisher.trim() : "College Academic Press",
      publicationYear: pubYear,
      isbn: isbn.trim(),
      category: category.trim(),
      description: description ? description.trim() : "A comprehensive college reference text.",
      totalCopies: copies,
      availableCopies: copies,
      shelf: shelf ? shelf.trim().toUpperCase() : "A-01",
      coverImage: coverImage && coverImage.trim() ? coverImage.trim() : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const newNotification = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      recipient: "ALL_STUDENTS",
      type: "BOOK_ADDED",
      title: "NEW BOOK ADDED",
      message: `"${newBook.title}" by ${newBook.author} has been added to the college library collection.`,
      relatedBook: newBook._id,
      relatedBorrow: null,
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.updateSnapshot((data) => {
      data.books.push(newBook);
      data.notifications.unshift(newNotification);
    });
    res.status(201).json({
      message: "Book added successfully.",
      book: newBook
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Unable to add book." });
  }
});
bookRouter.put("/:id", authenticateToken, requireRole(["staff", "admin"]), (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      publisher,
      publicationYear,
      isbn,
      category,
      description,
      totalCopies,
      shelf,
      coverImage
    } = req.body;
    const data = db.getSnapshot();
    const bookIndex = data.books.findIndex((b) => b._id === id);
    if (bookIndex === -1) {
      res.status(404).json({ message: "Book not found." });
      return;
    }
    const currentBook = data.books[bookIndex];
    const newTotal = totalCopies !== void 0 ? Math.max(1, parseInt(totalCopies, 10)) : currentBook.totalCopies;
    const borrowedCopies = currentBook.totalCopies - currentBook.availableCopies;
    if (newTotal < borrowedCopies) {
      res.status(400).json({
        message: `Cannot reduce total copies below currently borrowed count (${borrowedCopies} copies currently issued).`
      });
      return;
    }
    const newAvailable = Math.max(0, newTotal - borrowedCopies);
    const updatedBook = {
      ...currentBook,
      title: title !== void 0 ? title.trim() : currentBook.title,
      author: author !== void 0 ? author.trim() : currentBook.author,
      publisher: publisher !== void 0 ? publisher.trim() : currentBook.publisher,
      publicationYear: publicationYear !== void 0 ? parseInt(publicationYear, 10) : currentBook.publicationYear,
      isbn: isbn !== void 0 ? isbn.trim() : currentBook.isbn,
      category: category !== void 0 ? category.trim() : currentBook.category,
      description: description !== void 0 ? description.trim() : currentBook.description,
      totalCopies: newTotal,
      availableCopies: newAvailable,
      shelf: shelf !== void 0 ? shelf.trim().toUpperCase() : currentBook.shelf,
      coverImage: coverImage !== void 0 && coverImage.trim() ? coverImage.trim() : currentBook.coverImage,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.updateSnapshot((snap) => {
      snap.books[bookIndex] = updatedBook;
    });
    res.json({
      message: "Book updated successfully.",
      book: updatedBook
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Unable to update book." });
  }
});
bookRouter.delete("/:id", authenticateToken, requireRole(["staff", "admin"]), (req, res) => {
  try {
    const { id } = req.params;
    const data = db.getSnapshot();
    const book = data.books.find((b) => b._id === id);
    if (!book) {
      res.status(404).json({ message: "Book not found." });
      return;
    }
    const hasActiveBorrow = data.borrows.some(
      (brw) => brw.book === id && (brw.status === "ISSUED" || brw.status === "OVERDUE")
    );
    if (hasActiveBorrow) {
      res.status(400).json({
        message: "Cannot delete book with active issued or overdue loans. Process returns first."
      });
      return;
    }
    db.updateSnapshot((snap) => {
      snap.books = snap.books.filter((b) => b._id !== id);
    });
    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Unable to delete book." });
  }
});
export {
  bookRouter
};
