import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./src/db.js";
import { runSeed } from "./src/seed.js";
import { authRouter } from "./src/routes/authRoutes.js";
import { bookRouter } from "./src/routes/bookRoutes.js";
import { borrowRouter } from "./src/routes/borrowRoutes.js";
import { notificationRouter } from "./src/routes/notificationRoutes.js";
import { adminRouter } from "./src/routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup for frontend client
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure seed data exists
const currentData = db.getSnapshot();
if (!currentData.users || currentData.users.length === 0) {
  console.log("No user records detected, running initial seed...");
  await runSeed();
}

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "College Library Management API",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
