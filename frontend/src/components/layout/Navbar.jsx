import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  RotateCcw,
  Users,
  Settings,
  ShieldCheck,
  Check
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    let isMounted = true;
    const fetchNotifs = async () => {
      try {
        const res = await api.getNotifications();
        if (isMounted) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount);
        }
      } catch {
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15e3);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, location.pathname]);
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.markNotificationAsRead(id);
      setNotifications(
        (prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };
  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };
  const isStaffOrAdmin = user?.role === "staff" || user?.role === "admin";
  return <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {
    /* Logo & Header Title */
  }
          <Link
    to={user ? isStaffOrAdmin ? "/admin" : "/dashboard" : "/"}
    className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-lg p-1"
  >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-[15px]">
              College Library
            </span>
          </Link>

          {
    /* Desktop Navigation */
  }
          <nav className="hidden md:flex items-center gap-1">
            {!user ? <>
                <Link
    to="/"
    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
  >
                  Home
                </Link>
                <Link
    to="/books"
    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/books" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
  >
                  Books
                </Link>
                <Link
    to="/about"
    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/about" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
  >
                  About
                </Link>
                <div className="h-4 w-px bg-slate-200 mx-1.5" />
                <Link
    to="/login"
    className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
  >
                  Sign In
                </Link>
                <Link
    to="/register"
    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
  >
                  Create Account
                </Link>
              </> : isStaffOrAdmin ? (
    /* Admin/Staff Navigation */
    <>
                <Link
      to="/admin"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/admin" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
      to="/admin/books"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith("/admin/books") ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  <BookOpen className="w-4 h-4" />
                  Books
                </Link>
                <Link
      to="/admin/borrow-return"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith("/admin/borrow-return") ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  <RotateCcw className="w-4 h-4" />
                  Circulation
                </Link>
                <Link
      to="/admin/students"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith("/admin/students") ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  <Users className="w-4 h-4" />
                  Students
                </Link>
                {user.role === "admin" && <Link
      to="/admin/settings"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith("/admin/settings") ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>}
              </>
  ) : (
    /* Student Navigation */
    <>
                <Link
      to="/dashboard"
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/dashboard" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  Dashboard
                </Link>
                <Link
      to="/books"
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/books" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  Books
                </Link>
                <Link
      to="/my-books"
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/my-books" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  My Books
                </Link>
                <Link
      to="/profile"
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/profile" ? "text-slate-900 bg-slate-100 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
    >
                  Profile
                </Link>
              </>
  )}

            {
    /* Notification Bell & Dropdown for Logged In */
  }
            {user && <div className="relative ml-2" ref={notifRef}>
                <button
    type="button"
    onClick={() => setNotifDropdownOpen((prev) => !prev)}
    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
    aria-label="Notifications"
  >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>}
                </button>

                <AnimatePresence>
                  {notifDropdownOpen && <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 8, scale: 0.95 }}
    transition={{ duration: 0.18 }}
    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
  >
                      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                          {unreadCount > 0 && <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>}
                        </div>
                        {unreadCount > 0 && <button
    type="button"
    onClick={handleMarkAllRead}
    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
  >
                            Mark all read
                          </button>}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">
                            You're all caught up.
                          </div> : notifications.slice(0, 6).map((notif) => <div
    key={notif._id}
    className={`p-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? "bg-indigo-50/40" : ""}`}
  >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-xs font-bold text-slate-800 block">
                                    {notif.title}
                                  </span>
                                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                                    {new Date(notif.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  })}
                                  </span>
                                </div>
                                {!notif.isRead && <button
    type="button"
    onClick={(e) => handleMarkAsRead(notif._id, e)}
    title="Mark as read"
    className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>}
                              </div>
                            </div>)}
                      </div>

                      <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                        <Link
    to={isStaffOrAdmin ? "/admin/notifications" : "/notifications"}
    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 block py-1"
  >
                          View all notifications →
                        </Link>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </div>}

            {
    /* User Chip & Logout */
  }
            {user && <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200/60 text-xs">
                  {isStaffOrAdmin ? <ShieldCheck className="w-4 h-4 text-indigo-600" /> : <User className="w-4 h-4 text-slate-600" />}
                  <div className="text-left">
                    <span className="font-bold text-slate-800 block leading-tight font-mono">
                      {user.collegeRegistrationNo}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
    type="button"
    onClick={() => {
      logout();
      navigate("/login");
    }}
    title="Logout"
    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus:outline-none"
    aria-label="Logout"
  >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>}
          </nav>

          {
    /* Mobile Menu Button */
  }
          <div className="flex items-center gap-2 md:hidden">
            {user && <Link
    to={isStaffOrAdmin ? "/admin/notifications" : "/notifications"}
    className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl"
    aria-label="Notifications"
  >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-rose-600 rounded-full">
                    {unreadCount}
                  </span>}
              </Link>}

            <button
    type="button"
    onClick={() => setMobileMenuOpen((prev) => !prev)}
    className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
    aria-label="Toggle navigation menu"
  >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {
    /* Mobile Menu Drawer */
  }
      <AnimatePresence>
        {mobileMenuOpen && <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3"
  >
            {user && <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs text-slate-500 block">Logged in as:</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {user.collegeRegistrationNo}
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-100 text-indigo-700 uppercase">
                  {user.role}
                </span>
              </div>}

            <div className="flex flex-col space-y-1">
              {!user ? <>
                  <Link
    to="/"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    Home
                  </Link>
                  <Link
    to="/books"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    Books
                  </Link>
                  <Link
    to="/about"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    About
                  </Link>
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Link
    to="/login"
    className="text-center py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl"
  >
                      Login
                    </Link>
                    <Link
    to="/register"
    className="text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
  >
                      Register
                    </Link>
                  </div>
                </> : isStaffOrAdmin ? <>
                  <Link
    to="/admin"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                  </Link>
                  <Link
    to="/admin/books"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
  >
                    <BookOpen className="w-4 h-4" /> Manage Books
                  </Link>
                  <Link
    to="/admin/borrow-return"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
  >
                    <RotateCcw className="w-4 h-4" /> Borrow & Return
                  </Link>
                  <Link
    to="/admin/students"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
  >
                    <Users className="w-4 h-4" /> Students
                  </Link>
                  <Link
    to="/admin/notifications"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
  >
                    <Bell className="w-4 h-4" /> Notifications
                  </Link>
                  {user.role === "admin" && <Link
    to="/admin/settings"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
  >
                      <Settings className="w-4 h-4" /> Library Settings
                    </Link>}
                  <div className="pt-2">
                    <button
    type="button"
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className="w-full text-center py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl flex items-center justify-center gap-2"
  >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </> : <>
                  <Link
    to="/dashboard"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    Dashboard
                  </Link>
                  <Link
    to="/books"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    Books
                  </Link>
                  <Link
    to="/my-books"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    My Books
                  </Link>
                  <Link
    to="/notifications"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    Notifications
                  </Link>
                  <Link
    to="/profile"
    className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
  >
                    Profile
                  </Link>
                  <div className="pt-2">
                    <button
    type="button"
    onClick={() => {
      logout();
      navigate("/login");
    }}
    className="w-full text-center py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl flex items-center justify-center gap-2"
  >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
};
export {
  Navbar
};
