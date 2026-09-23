import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "./components/common/ToastContainer";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AdminLayout } from "./components/layout/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { BooksPage } from "./pages/BooksPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudentDashboardPage } from "./pages/student/StudentDashboardPage";
import { MyBooksPage } from "./pages/student/MyBooksPage";
import { StudentProfilePage } from "./pages/student/StudentProfilePage";
import { NotificationsPage } from "./pages/student/NotificationsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { ManageBooksPage } from "./pages/admin/ManageBooksPage";
import { BorrowReturnPage } from "./pages/admin/BorrowReturnPage";
import { StudentsManagementPage } from "./pages/admin/StudentsManagementPage";
import { CirculationReportsPage } from "./pages/admin/CirculationReportsPage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";
import { LibrarySettingsPage } from "./pages/admin/LibrarySettingsPage";
const StudentRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "student") {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};
const PublicOnlyRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  if (user) {
    if (user.role === "student") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800">
      <Navbar />
      <div className="flex-1">{children}</div>
      {!isAdminRoute && <Footer />}
    </div>;
};
function App() {
  return <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer />
          <AppLayout>
            <Routes>
              {
    /* Public Routes */
  }
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/about" element={<AboutPage />} />

              {
    /* Guest Only Routes */
  }
              <Route
    path="/login"
    element={<PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>}
  />
              <Route
    path="/register"
    element={<PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>}
  />

              {
    /* Student Protected Routes */
  }
              <Route
    path="/dashboard"
    element={<StudentRoute>
                    <StudentDashboardPage />
                  </StudentRoute>}
  />
              <Route
    path="/my-books"
    element={<StudentRoute>
                    <MyBooksPage />
                  </StudentRoute>}
  />
              <Route
    path="/profile"
    element={<StudentRoute>
                    <StudentProfilePage />
                  </StudentRoute>}
  />
              <Route
    path="/notifications"
    element={<StudentRoute>
                    <NotificationsPage />
                  </StudentRoute>}
  />

              {
    /* Admin / Staff Protected Routes */
  }
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="books" element={<ManageBooksPage />} />
                <Route path="borrow-return" element={<BorrowReturnPage />} />
                <Route path="students" element={<StudentsManagementPage />} />
                <Route path="reports" element={<CirculationReportsPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="settings" element={<LibrarySettingsPage />} />
              </Route>

              {
    /* Catch-all redirect */
  }
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>;
}
export {
  App as default
};
