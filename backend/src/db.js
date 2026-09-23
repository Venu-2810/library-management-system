import fs from "fs";
import path from "path";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "library_data.json");
const defaultSettings = {
  dailyPenalty: 10,
  borrowDurationDays: 14,
  libraryName: "Central College Library",
  notificationPreferences: {
    overdueAlerts: true,
    borrowConfirmation: true,
    newBookBroadcast: true
  },
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      users: [],
      books: [],
      borrows: [],
      notifications: [],
      settings: defaultSettings
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.settings) parsed.settings = defaultSettings;
    if (!parsed.users) parsed.users = [];
    if (!parsed.books) parsed.books = [];
    if (!parsed.borrows) parsed.borrows = [];
    if (!parsed.notifications) parsed.notifications = [];
    return parsed;
  } catch (err) {
    console.error("Error reading library data file, initializing empty schema:", err);
    const initialData = {
      users: [],
      books: [],
      borrows: [],
      notifications: [],
      settings: defaultSettings
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
}
function saveDataFile(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}
const db = {
  getSnapshot() {
    return ensureDataFile();
  },
  updateSnapshot(updater) {
    const data = ensureDataFile();
    updater(data);
    saveDataFile(data);
    return data;
  },
  // Recalculate overdue loans and penalties dynamically based on current date
  recomputeOverdues() {
    const now = /* @__PURE__ */ new Date();
    this.updateSnapshot((data) => {
      const dailyPenalty = data.settings?.dailyPenalty ?? 10;
      data.borrows.forEach((b) => {
        if (b.status === "ISSUED" || b.status === "OVERDUE") {
          const due = new Date(b.dueDate);
          if (now > due) {
            const diffTime = now.getTime() - due.getTime();
            const lateDays = Math.max(1, Math.ceil(diffTime / (1e3 * 60 * 60 * 24)));
            b.status = "OVERDUE";
            b.lateDays = lateDays;
            b.penaltyAmount = lateDays * dailyPenalty;
          }
        }
      });
    });
  }
};
export {
  db
};
