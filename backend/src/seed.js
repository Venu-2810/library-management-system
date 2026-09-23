import bcrypt from "bcryptjs";
import { db } from "./db.js";
async function runSeed() {
  console.log("Seeding College Library database...");
  const passwordHashAdmin = await bcrypt.hash("Admin@123", 10);
  const passwordHashStaff = await bcrypt.hash("Staff@123", 10);
  const passwordHashStudent = await bcrypt.hash("Student@123", 10);
  const users = [
    {
      _id: "usr_admin_001",
      collegeRegistrationNo: "STAFF-ADMIN-001",
      passwordHash: passwordHashAdmin,
      role: "admin",
      active: true,
      createdAt: (/* @__PURE__ */ new Date("2026-08-01T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-01T09:00:00Z")).toISOString()
    },
    {
      _id: "usr_staff_001",
      collegeRegistrationNo: "STAFF-LIB-001",
      passwordHash: passwordHashStaff,
      role: "staff",
      active: true,
      createdAt: (/* @__PURE__ */ new Date("2026-08-05T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-05T09:00:00Z")).toISOString()
    },
    {
      _id: "usr_student_001",
      collegeRegistrationNo: "STUDENT-001",
      passwordHash: passwordHashStudent,
      role: "student",
      active: true,
      createdAt: (/* @__PURE__ */ new Date("2026-08-10T10:30:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-10T10:30:00Z")).toISOString()
    },
    {
      _id: "usr_student_002",
      collegeRegistrationNo: "STUDENT-002",
      passwordHash: passwordHashStudent,
      role: "student",
      active: true,
      createdAt: (/* @__PURE__ */ new Date("2026-08-12T11:15:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-12T11:15:00Z")).toISOString()
    },
    {
      _id: "usr_student_003",
      collegeRegistrationNo: "STUDENT-003",
      passwordHash: passwordHashStudent,
      role: "student",
      active: true,
      createdAt: (/* @__PURE__ */ new Date("2026-08-15T14:20:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-15T14:20:00Z")).toISOString()
    }
  ];
  const books = [
    {
      _id: "bk_001",
      title: "Atomic Habits",
      author: "James Clear",
      publisher: "Avery Publishing",
      publicationYear: 2018,
      isbn: "9780735211292",
      category: "Personal Development",
      description: "An easy and proven way to build good habits and break bad ones through incremental system improvements.",
      totalCopies: 6,
      availableCopies: 5,
      shelf: "A-12",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-01T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-01T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_002",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      publisher: "O'Reilly Media",
      publicationYear: 2017,
      isbn: "9781449373320",
      category: "Computer Systems",
      description: "The definitive guide to the architecture, storage engines, distributed consensus, and reliability principles behind modern software systems.",
      totalCopies: 5,
      availableCopies: 4,
      shelf: "C-04",
      coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-01T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-01T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_003",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      publisher: "Harper",
      publicationYear: 2014,
      isbn: "9780062316097",
      category: "World History",
      description: "Explores how biology and history have defined us and enhanced our understanding of what it means to be human.",
      totalCopies: 4,
      availableCopies: 3,
      shelf: "H-07",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-01T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-01T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_004",
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      publisher: "Farrar, Straus and Giroux",
      publicationYear: 2011,
      isbn: "9780374275631",
      category: "Psychology & Cognitive Science",
      description: "A masterpiece on cognitive psychology, decision making, intuitive heuristics, and deliberate reasoning.",
      totalCopies: 4,
      availableCopies: 4,
      shelf: "P-11",
      coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-02T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-02T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_005",
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      publisher: "Addison-Wesley Professional",
      publicationYear: 2019,
      isbn: "9780135957059",
      category: "Computer Systems",
      description: "Timeless engineering craftsmanship, career guidance, and practical techniques to write resilient code.",
      totalCopies: 3,
      availableCopies: 3,
      shelf: "C-08",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-03T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-03T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_006",
      title: "Deep Work: Rules for Focused Success in a Distracted World",
      author: "Cal Newport",
      publisher: "Grand Central Publishing",
      publicationYear: 2016,
      isbn: "9781455586691",
      category: "Personal Development",
      description: "A foundational guide on cultivating cognitive focus, eliminating fragmented attention, and generating deep value.",
      totalCopies: 5,
      availableCopies: 5,
      shelf: "A-15",
      coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-04T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-04T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_007",
      title: "The Design of Everyday Things",
      author: "Don Norman",
      publisher: "Basic Books",
      publicationYear: 2013,
      isbn: "9780465050659",
      category: "Design Thinking",
      description: "The fundamental guide to human-centered design, usability affordances, feedback loops, and cognitive empathy in product creation.",
      totalCopies: 4,
      availableCopies: 4,
      shelf: "D-02",
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-05T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-05T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_008",
      title: "Principles of Economics",
      author: "N. Gregory Mankiw",
      publisher: "Cengage Learning",
      publicationYear: 2020,
      isbn: "9780357038314",
      category: "Economics & Business",
      description: "Comprehensive college primer explaining market mechanics, microeconomic decisions, trade incentives, and macroeconomic policy.",
      totalCopies: 6,
      availableCopies: 6,
      shelf: "E-03",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-06T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-06T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_009",
      title: "Clean Architecture: A Craftsman\u2019s Guide to Software Structure",
      author: "Robert C. Martin",
      publisher: "Prentice Hall",
      publicationYear: 2017,
      isbn: "9780134494166",
      category: "Computer Systems",
      description: "Universal rules of software architecture to maximize developer productivity and maintain system independence across decades.",
      totalCopies: 4,
      availableCopies: 4,
      shelf: "C-09",
      coverImage: "https://images.unsplash.com/photo-1507842229451-7f01be7fe7ab?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-07T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-07T10:00:00Z")).toISOString()
    },
    {
      _id: "bk_010",
      title: "Man\u2019s Search for Meaning",
      author: "Viktor E. Frankl",
      publisher: "Beacon Press",
      publicationYear: 2006,
      isbn: "9780807014295",
      category: "Philosophy & Ethics",
      description: "A profound exploration of resilience, human purpose, and logotherapy born from harrowing historical experience.",
      totalCopies: 3,
      availableCopies: 3,
      shelf: "P-03",
      coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      createdAt: (/* @__PURE__ */ new Date("2026-08-08T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-08-08T10:00:00Z")).toISOString()
    }
  ];
  const now = /* @__PURE__ */ new Date();
  const issueDateActive = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1e3).toISOString();
  const dueDateActive = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1e3).toISOString();
  const issueDateOverdue = new Date(now.getTime() - 18 * 24 * 60 * 60 * 1e3).toISOString();
  const dueDateOverdue = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1e3).toISOString();
  const issueDateReturned = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString();
  const dueDateReturned = new Date(now.getTime() - 16 * 24 * 60 * 60 * 1e3).toISOString();
  const returnDateDone = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1e3).toISOString();
  const borrows = [
    {
      _id: "brw_001",
      student: "usr_student_001",
      studentRegistrationNo: "STUDENT-001",
      book: "bk_001",
      bookTitle: "Atomic Habits",
      bookAuthor: "James Clear",
      bookIsbn: "9780735211292",
      issueDate: issueDateActive,
      dueDate: dueDateActive,
      returnDate: null,
      status: "ISSUED",
      lateDays: 0,
      penaltyAmount: 0,
      createdAt: issueDateActive,
      updatedAt: issueDateActive
    },
    {
      _id: "brw_002",
      student: "usr_student_001",
      studentRegistrationNo: "STUDENT-001",
      book: "bk_003",
      bookTitle: "Sapiens: A Brief History of Humankind",
      bookAuthor: "Yuval Noah Harari",
      bookIsbn: "9780062316097",
      issueDate: issueDateOverdue,
      dueDate: dueDateOverdue,
      returnDate: null,
      status: "OVERDUE",
      lateDays: 4,
      penaltyAmount: 40,
      createdAt: issueDateOverdue,
      updatedAt: now.toISOString()
    },
    {
      _id: "brw_003",
      student: "usr_student_002",
      studentRegistrationNo: "STUDENT-002",
      book: "bk_002",
      bookTitle: "Designing Data-Intensive Applications",
      bookAuthor: "Martin Kleppmann",
      bookIsbn: "9781449373320",
      issueDate: issueDateActive,
      dueDate: dueDateActive,
      returnDate: null,
      status: "ISSUED",
      lateDays: 0,
      penaltyAmount: 0,
      createdAt: issueDateActive,
      updatedAt: issueDateActive
    },
    {
      _id: "brw_004",
      student: "usr_student_002",
      studentRegistrationNo: "STUDENT-002",
      book: "bk_006",
      bookTitle: "Deep Work: Rules for Focused Success in a Distracted World",
      bookAuthor: "Cal Newport",
      bookIsbn: "9781455586691",
      issueDate: issueDateReturned,
      dueDate: dueDateReturned,
      returnDate: returnDateDone,
      status: "RETURNED",
      lateDays: 0,
      penaltyAmount: 0,
      createdAt: issueDateReturned,
      updatedAt: returnDateDone
    }
  ];
  const notifications = [
    {
      _id: "notif_001",
      recipient: "ALL_STUDENTS",
      type: "BOOK_ADDED",
      title: "NEW BOOK ADDED",
      message: '"Atomic Habits" has been added to the college library collection.',
      relatedBook: "bk_001",
      relatedBorrow: null,
      isRead: false,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      _id: "notif_002",
      recipient: "STUDENT-001",
      type: "BOOK_OVERDUE",
      title: "BOOK OVERDUE",
      message: '"Sapiens: A Brief History of Humankind" is overdue. Please return the book to the library counter.',
      relatedBook: "bk_003",
      relatedBorrow: "brw_002",
      isRead: false,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      _id: "notif_003",
      recipient: "STAFF_ADMIN",
      type: "BOOK_BORROWED",
      title: "NEW BOOK BORROWED",
      message: 'Student STUDENT-001 borrowed "Atomic Habits". Due date generated.',
      relatedBook: "bk_001",
      relatedBorrow: "brw_001",
      isRead: false,
      createdAt: issueDateActive
    },
    {
      _id: "notif_004",
      recipient: "STAFF_ADMIN",
      type: "BOOK_OVERDUE",
      title: "OVERDUE BOOK ALERT",
      message: 'Student STUDENT-001 has overdue book "Sapiens: A Brief History of Humankind" (4 days overdue, penalty Rs. 40).',
      relatedBook: "bk_003",
      relatedBorrow: "brw_002",
      isRead: false,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1e3).toISOString()
    }
  ];
  const settings = {
    dailyPenalty: 10,
    borrowDurationDays: 14,
    libraryName: "Central College Library",
    notificationPreferences: {
      overdueAlerts: true,
      borrowConfirmation: true,
      newBookBroadcast: true
    },
    updatedAt: now.toISOString()
  };
  db.updateSnapshot((data) => {
    data.users = users;
    data.books = books;
    data.borrows = borrows;
    data.notifications = notifications;
    data.settings = settings;
  });
  console.log("Database seeded successfully with users, books, loans, and notifications.");
}
if (process.argv[1] && (process.argv[1].endsWith("seed.js") || process.argv[1].endsWith("seed.ts"))) {
  runSeed().catch((err) => {
    console.error("Failed to run seed script:", err);
    process.exit(1);
  });
}
export {
  runSeed
};
