# 📚 College Library Management System

A full-stack, role-based **College Library Management System** built with **React, Vite, Node.js, and Express**. The application manages a college library's book catalog, student accounts, borrowing and returns, overdue tracking, fines, notifications, and administrative operations through separate student and staff/admin workflows.

> **Project type:** Full-stack academic/portfolio project  
> **Frontend:** React + Vite  
> **Backend:** Node.js + Express REST API  
> **Data storage:** Local JSON file (`backend/data/library_data.json`)

---

## ✨ Overview

The system provides three role-based experiences:

- 👨‍💼 **Administrator** — manages library settings, students, catalog, reports, notifications, and system analytics.
- 👩‍💼 **Librarian / Staff** — handles daily book circulation, catalog operations, returns, and student records.
- 🎓 **Student** — browses the catalog, tracks borrowed books, monitors due dates and overdue fines, manages notifications, and views their profile.

Authentication is based on unique **College Registration Numbers**, with passwords securely hashed using `bcryptjs` and authenticated API requests protected with JWT.

---

## 🚀 Key Features

### 🔐 Authentication & Role-Based Access

- Student registration and login
- Administrator and librarian/staff accounts
- College Registration Number-based identity
- Password hashing with `bcryptjs`
- JWT-based authentication
- 7-day JWT session expiration
- Role-protected backend API routes
- Protected frontend routes
- Active/suspended student account control

### 📚 Book Catalog & Inventory

- Search books by:
  - Title
  - Author
  - ISBN
  - Publisher
  - Category
- Filter by category, author, and availability
- Book detail modal
- Shelf location tracking
- Total-copy and available-copy tracking
- Add books
- Edit book information
- Delete books when they have no active loans
- Automatic stock updates when books are issued or returned

### 🔄 Borrowing & Return Management

- Students can borrow available books
- Staff/Admin can issue books to students
- Automatic due-date calculation
- Configurable borrowing duration
- Return processing by Staff/Admin
- Automatic available-copy restoration
- Duplicate active-loan prevention
- Overdue detection
- Automatic overdue-day calculation
- Automatic fine calculation
- Borrowing history

### 💰 Fine & Overdue Management

- Default daily penalty: **Rs. 10/day**
- Default borrowing period: **14 days**
- Server-side overdue recalculation
- Overdue status tracking
- Late-day calculation
- Penalty calculation
- Outstanding penalty statistics

### 🔔 Notifications

- Book issue notifications
- Book return notifications
- New-book announcements
- Overdue-related notifications
- Student-specific notifications
- Campus-wide student broadcasts
- Staff/Admin notifications
- Read/unread notification tracking
- Mark one or all notifications as read

### 📊 Admin Dashboard

- Total books
- Available books
- Borrowed books
- Overdue books
- Registered students
- Today's issues
- Today's returns
- Outstanding penalties
- Circulation reports
- Category distribution
- Borrowing trends
- Student directory
- Student account activation/deactivation
- Library settings
- Notification broadcasts

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Motion
- Recharts

### Backend

- Node.js
- Express.js
- JWT (`jsonwebtoken`)
- `bcryptjs`
- CORS
- Dotenv
- Nodemon

### Data Storage

The current version uses a lightweight **JSON file-based data store**:

```text
backend/data/library_data.json
```

This keeps the project simple to run locally without requiring a separate database server.

---

## 🏗️ Project Architecture

```text
library-management-system/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── data/
│   │   └── library_data.json
│   └── src/
│       ├── db.js
│       ├── seed.js
│       ├── middleware/
│       │   └── auth.js
│       └── routes/
│           ├── authRoutes.js
│           ├── bookRoutes.js
│           ├── borrowRoutes.js
│           ├── notificationRoutes.js
│           └── adminRoutes.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── services/
        │   └── api.js
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── components/
        │   ├── common/
        │   └── layout/
        └── pages/
            ├── HomePage.jsx
            ├── BooksPage.jsx
            ├── AboutPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── student/
            └── admin/
```

---

## 👥 User Roles

| Role | Main Responsibilities |
|---|---|
| **Administrator** | Full system control, settings, students, reports, catalog and broadcasts |
| **Librarian / Staff** | Book circulation, returns, catalog management and student operations |
| **Student** | Catalog browsing, borrowing, loan history, notifications and profile |

---

## 🧭 Application Routes

### Public Routes

| Route | Description |
|---|---|
| `/` | Library home page |
| `/books` | Searchable book catalog |
| `/about` | Library information and rules |
| `/login` | User login |
| `/register` | Student registration |

### Student Routes

| Route | Description |
|---|---|
| `/dashboard` | Student dashboard |
| `/my-books` | Borrowing history and active loans |
| `/profile` | Student profile |
| `/notifications` | Student notifications |

### Staff / Admin Routes

| Route | Description |
|---|---|
| `/admin` | Admin/staff dashboard |
| `/admin/books` | Manage book catalog |
| `/admin/borrow-return` | Borrow and return desk |
| `/admin/students` | Student directory |
| `/admin/reports` | Circulation reports |
| `/admin/notifications` | Library broadcasts |
| `/admin/settings` | Library settings |

---

## ⚙️ Local Setup

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- Git installed

### 1. Clone the repository

```bash
git clone https://github.com/Venu-2810/library-management-system.git
cd library-management-system
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

> Never commit the real `.env` file to GitHub.

### 3. Start the backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the Express backend on port `5000`.

---

## 🔑 Demo Accounts

The seed script creates demo accounts for local development.

| Role | Registration Number | Password |
|---|---|---|
| Administrator | `STAFF-ADMIN-001` | `Admin@123` |
| Librarian / Staff | `STAFF-LIB-001` | `Staff@123` |
| Student | `STUDENT-001` | `Student@123` |

> These credentials are for **local development/demo purposes only**. Do not use them for a production deployment.

---

## 🔒 Security Notes

- Passwords are stored as `bcryptjs` hashes rather than plain text.
- JWTs are used for authenticated API requests.
- JWTs expire after 7 days.
- Backend endpoints use role-based authorization.
- `.env` is excluded from Git through `.gitignore`.
- Only `.env.example` should be committed as a configuration template.
- Do not place database credentials, production secrets, or real user passwords in the repository.

---

## 🗃️ Data Model

The local data store maintains the following main collections:

```text
users
books
borrows
notifications
settings
```

The data is persisted in:

```text
backend/data/library_data.json
```

The backend automatically creates the data file if it does not exist and seeds initial demo data when no users are present.

---

## 🔌 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Books

```text
GET    /api/books
GET    /api/books/:id
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
```

### Borrowing

```text
GET  /api/borrow/my-books
GET  /api/borrow/all
POST /api/borrow/request
POST /api/borrow/:id/return
```

### Notifications

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
POST  /api/notifications/mark-all-read
POST  /api/notifications/broadcast
```

### Administration

```text
GET   /api/admin/stats
GET   /api/admin/students
PATCH /api/admin/students/:id/status
GET   /api/admin/settings
PUT   /api/admin/settings
```

---

## 🧪 Development Notes

This project is designed primarily as a **college academic and portfolio project**.

The current version uses local JSON persistence rather than a production database. For a production deployment, the data layer can be replaced with MongoDB, PostgreSQL, MySQL, or another database without changing the overall frontend/backend separation.

---

## 🔮 Future Improvements

- MongoDB/PostgreSQL database integration
- Cloud deployment
- Email/SMS reminders
- Book renewal workflow
- Book reservation/waitlist
- QR/barcode scanning
- PDF circulation reports
- Automated scheduled overdue notifications
- Fine payment tracking
- Automated database backups
- Production-grade environment configuration

---

## 📸 Screenshots

Add screenshots of the following pages here when available:

- Home page
- Book catalog
- Login page
- Student dashboard
- My Books
- Admin dashboard
- Borrow/Return desk
- Manage Books
- Circulation Reports

Example:

```md
![Home Page](screenshots/home.png)
![Book Catalog](screenshots/books.png)
![Student Dashboard](screenshots/student-dashboard.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 📄 License

This project is currently intended for educational and portfolio use.

---

## 👤 Author

**Venu**

GitHub: [Venu-2810](https://github.com/Venu-2810)

---

⭐ If you find this project useful, consider giving the repository a star.
