# College Library Management System

This project is separated into clean **Frontend (`.jsx`)** and **Backend (`.js` Express)** directories.

---

## 📁 Project Architecture

```
exported_project/
├── backend/                  # Node.js + Express API
│   ├── server.js             # Main server entry (port 5000)
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── db.js             # JSON/File database engine
│       ├── seed.js           # Initial database seeder
│       ├── middleware/
│       │   └── auth.js       # JWT auth & role protection
│       └── routes/
│           ├── authRoutes.js         # Student/Admin/Staff auth
│           ├── bookRoutes.js         # Book catalog CRUD
│           ├── borrowRoutes.js       # Issue/return/renew physical loans
│           ├── notificationRoutes.js # Real-time alerts
│           └── adminRoutes.js        # Reports, stats, student management
│
└── frontend/                 # Vite + React (JSX) + Tailwind CSS
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # Routes & navigation
        ├── index.css         # Tailwind styles
        ├── services/
        │   └── api.js        # API service layer
        ├── context/
        │   ├── AuthContext.jsx   # Authentication context
        │   └── ToastContext.jsx  # Notification toast system
        ├── components/
        │   ├── common/
        │   │   ├── BookCard.jsx          # Compact book display card
        │   │   ├── BookDetailModal.jsx   # Book detail view modal
        │   │   ├── Modal.jsx             # Modal dialog component
        │   │   ├── PageTransition.jsx    # Smooth page transitions
        │   │   ├── ProtectedRoute.jsx    # Role-based route guard
        │   │   └── ToastContainer.jsx    # In-app toasts
        │   └── layout/
        │       ├── Navbar.jsx            # Header & role badges
        │       ├── Footer.jsx            # Academic footer
        │       └── AdminLayout.jsx       # Staff & admin navigation
        └── pages/
            ├── HomePage.jsx              # Landing & featured volumes
            ├── BooksPage.jsx             # Full searchable catalog
            ├── LoginPage.jsx             # Sign in with auto-fill buttons
            ├── RegisterPage.jsx          # Student registration
            ├── AboutPage.jsx             # Library rules & guide
            ├── NotFoundPage.jsx          # 404 page
            ├── student/
            │   ├── StudentDashboardPage.jsx
            │   ├── MyBooksPage.jsx
            │   ├── NotificationsPage.jsx
            │   └── StudentProfilePage.jsx
            └── admin/
                ├── AdminDashboardPage.jsx
                ├── ManageBooksPage.jsx
                ├── BorrowReturnPage.jsx
                ├── StudentsManagementPage.jsx
                ├── CirculationReportsPage.jsx
                ├── AdminNotificationsPage.jsx
                └── LibrarySettingsPage.jsx
```

---

## 🚀 Running the Project

### 1. Run the Backend (Terminal 1)
```bash
cd backend
npm install
npm run seed     # optional, automatically seeds on first start
npm run dev      # starts server on http://localhost:5000
```

### 2. Run the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev      # starts Vite dev server on http://localhost:5173
```

---

## 🔑 Default Credentials

- **Admin Account**:
  - Registration No: `STAFF-ADMIN-001`
  - Password: `Admin@123`
- **Librarian Account**:
  - Registration No: `STAFF-LIB-001`
  - Password: `Staff@123`
- **Student Account**:
  - Registration No: `STUDENT-001`
  - Password: `Student@123`
