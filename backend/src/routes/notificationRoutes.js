import { Router } from "express";
import { db } from "../db.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
const notificationRouter = Router();
notificationRouter.get("/", authenticateToken, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const data = db.getSnapshot();
    const regNo = req.user.collegeRegistrationNo.toUpperCase();
    const role = req.user.role;
    const userNotifs = data.notifications.filter((n) => {
      const rec = n.recipient.toUpperCase();
      if (rec === regNo) return true;
      if (role === "student" && rec === "ALL_STUDENTS") return true;
      if ((role === "staff" || role === "admin") && rec === "STAFF_ADMIN") return true;
      return false;
    });
    userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const unreadCount = userNotifs.filter((n) => !n.isRead).length;
    res.json({
      notifications: userNotifs,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Unable to fetch notifications." });
  }
});
notificationRouter.patch("/:id/read", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.updateSnapshot((snap) => {
      const idx = snap.notifications.findIndex((n) => n._id === id);
      if (idx !== -1) {
        snap.notifications[idx].isRead = true;
      }
    });
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Unable to update notification." });
  }
});
notificationRouter.post("/mark-all-read", authenticateToken, (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const regNo = req.user.collegeRegistrationNo.toUpperCase();
    const role = req.user.role;
    db.updateSnapshot((snap) => {
      snap.notifications.forEach((n) => {
        const rec = n.recipient.toUpperCase();
        if (rec === regNo || role === "student" && rec === "ALL_STUDENTS" || (role === "staff" || role === "admin") && rec === "STAFF_ADMIN") {
          n.isRead = true;
        }
      });
    });
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Unable to update notifications." });
  }
});
notificationRouter.post("/broadcast", authenticateToken, requireRole(["staff", "admin"]), (req, res) => {
  try {
    const { recipient, title, message, type } = req.body;
    if (!title || !message) {
      res.status(400).json({ message: "Title and message are required." });
      return;
    }
    const targetRecipient = recipient ? recipient.trim().toUpperCase() : "ALL_STUDENTS";
    const newNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipient: targetRecipient,
      type: type || "GENERAL",
      title: title.trim(),
      message: message.trim(),
      relatedBook: null,
      relatedBorrow: null,
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.updateSnapshot((snap) => {
      snap.notifications.push(newNotif);
    });
    res.status(201).json({ message: "Notification broadcasted successfully.", notification: newNotif });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    res.status(500).json({ message: "Failed to broadcast notification." });
  }
});
export {
  notificationRouter
};
