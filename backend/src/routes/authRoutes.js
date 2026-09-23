import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { generateToken, authenticateToken } from "../middleware/auth.js";
const authRouter = Router();
authRouter.post("/register", async (req, res) => {
  try {
    const { collegeRegistrationNo, password, confirmPassword } = req.body;
    if (!collegeRegistrationNo || typeof collegeRegistrationNo !== "string") {
      res.status(400).json({ message: "College registration number is required." });
      return;
    }
    const regNo = collegeRegistrationNo.trim().toUpperCase();
    if (regNo.length < 3) {
      res.status(400).json({ message: "Please enter a valid college registration number." });
      return;
    }
    const isStaffOrAdminAttempt = regNo.startsWith("STAFF") || regNo.startsWith("ADMIN") || regNo.startsWith("LIB") || regNo.includes("ADMIN") || regNo.includes("STAFF") || regNo.includes("LIBRARIAN");
    if (isStaffOrAdminAttempt) {
      res.status(403).json({
        message: "Admin and Librarian accounts are strictly fixed with only one official designated registration number each (STAFF-ADMIN-001 for Administrator and STAFF-LIB-001 for Librarian). You cannot register admin or librarian registration numbers. Registration is exclusively for students."
      });
      return;
    }
    if (!password || typeof password !== "string") {
      res.status(400).json({ message: "Password is required." });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long." });
      return;
    }
    if (!confirmPassword || password !== confirmPassword) {
      res.status(400).json({ message: "Password and confirm password do not match." });
      return;
    }
    const data = db.getSnapshot();
    const existing = data.users.find(
      (u) => u.collegeRegistrationNo.toUpperCase() === regNo
    );
    if (existing) {
      res.status(409).json({ message: "This registration number is already registered." });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      collegeRegistrationNo: regNo,
      passwordHash,
      role: "student",
      active: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.updateSnapshot((snap) => {
      snap.users.push(newUser);
    });
    const token = generateToken({
      id: newUser._id,
      collegeRegistrationNo: newUser.collegeRegistrationNo,
      role: newUser.role
    });
    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: newUser._id,
        collegeRegistrationNo: newUser.collegeRegistrationNo,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Unable to process registration at this time." });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { collegeRegistrationNo, password } = req.body;
    if (!collegeRegistrationNo || !password) {
      res.status(400).json({ message: "Registration number and password are required." });
      return;
    }
    const regNo = collegeRegistrationNo.trim().toUpperCase();
    const data = db.getSnapshot();
    const user = data.users.find(
      (u) => u.collegeRegistrationNo.toUpperCase() === regNo
    );
    if (!user) {
      res.status(401).json({ message: "Invalid registration number or password." });
      return;
    }
    if (!user.active) {
      res.status(403).json({
        message: "Your account is deactivated. Please contact library administration."
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid registration number or password." });
      return;
    }
    const token = generateToken({
      id: user._id,
      collegeRegistrationNo: user.collegeRegistrationNo,
      role: user.role
    });
    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        collegeRegistrationNo: user.collegeRegistrationNo,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Unable to connect to server." });
  }
});
authRouter.get("/me", authenticateToken, (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const data = db.getSnapshot();
  const user = data.users.find((u) => u._id === req.user?.id);
  if (!user || !user.active) {
    res.status(401).json({ message: "User session no longer valid." });
    return;
  }
  res.json({
    user: {
      id: user._id,
      collegeRegistrationNo: user.collegeRegistrationNo,
      role: user.role
    }
  });
});
export {
  authRouter
};
