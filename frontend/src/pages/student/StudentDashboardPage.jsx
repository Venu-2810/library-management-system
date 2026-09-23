import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  AlertTriangle,
  Bell,
  ArrowRight,
  Clock,
  Layers
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [borrows, setBorrows] = useState([]);
  const [totalAvailableBooks, setTotalAvailableBooks] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        const [borrowRes, bookRes, notifRes] = await Promise.all([
          api.getMyBooks(),
          api.getBooks(),
          api.getNotifications()
        ]);
        if (isMounted) {
          setBorrows(borrowRes.borrows);
          const availableCount = bookRes.books.reduce((acc, b) => acc + b.availableCopies, 0);
          setTotalAvailableBooks(availableCount);
          setUnreadNotificationsCount(notifRes.unreadCount);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading student dashboard:", err);
        if (isMounted) setLoading(false);
      }
    };
    loadDashboardData();
  }, []);
  const activeLoans = borrows.filter((b) => b.status === "ISSUED");
  const overdueLoans = borrows.filter((b) => b.status === "OVERDUE");
  const now = /* @__PURE__ */ new Date();
  const dueSoonLoans = activeLoans.filter((b) => {
    const due = new Date(b.dueDate);
    const diffDays = (due.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  });
  const totalOutstandingPenalty = overdueLoans.reduce((sum, b) => sum + (b.penaltyAmount || 0), 0);
  return <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {
    /* Welcome Header */
  }
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Student Circulation Portal
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {user?.collegeRegistrationNo}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, Student
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track your active reading loans, upcoming due dates, and explore the campus physical collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
    to="/books"
    className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
              <BookOpen className="w-4 h-4" />
              Borrow New Book
            </Link>
            <Link
    to="/my-books"
    className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
  >
              My Books
            </Link>
          </div>
        </div>

        {
    /* OVERDUE ALERT BANNER IF APPLICABLE */
  }
        {overdueLoans.length > 0 && <div className="p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  You have {overdueLoans.length} overdue {overdueLoans.length === 1 ? "book" : "books"}
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Accumulated penalty: <strong>Rs. {totalOutstandingPenalty}</strong>. Please return physical copies to the circulation desk.
                </p>
              </div>
            </div>
            <Link
    to="/my-books"
    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shrink-0 text-center"
  >
              View Overdue Records
            </Link>
          </div>}

        {
    /* STATISTIC CARDS */
  }
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900 block">{activeLoans.length}</span>
            <span className="text-xs font-medium text-slate-500">My Active Loans</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-amber-600 block">{dueSoonLoans.length}</span>
            <span className="text-xs font-medium text-slate-500">Due Soon (≤ 3 days)</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-rose-600 block">{overdueLoans.length}</span>
            <span className="text-xs font-medium text-slate-500">Overdue Books</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-emerald-700 block">{totalAvailableBooks}</span>
            <span className="text-xs font-medium text-slate-500">Available Books</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-slate-900 block">
              {unreadNotificationsCount}
            </span>
            <span className="text-xs font-medium text-slate-500">Unread Notifications</span>
          </div>
        </div>

        {
    /* ACTIVE & RECENT BORROWS PREVIEW */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Current Borrowing Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical volumes currently issued to registration number {user?.collegeRegistrationNo}
              </p>
            </div>
            <Link
    to="/my-books"
    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
  >
              View all transactions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? <div className="space-y-3">
              {[1, 2].map((n) => <div key={n} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
            </div> : borrows.length === 0 ? <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                You haven't borrowed any books yet.
              </p>
              <p className="text-xs text-slate-500">
                Explore the catalog and select available physical copies to begin your reading session.
              </p>
              <Link
    to="/books"
    className="inline-block mt-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
  >
                Browse Catalog
              </Link>
            </div> : <div className="divide-y divide-slate-100">
              {borrows.slice(0, 4).map((b) => {
    const isOverdue = b.status === "OVERDUE";
    const isReturned = b.status === "RETURNED";
    return <div
      key={b._id}
      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{b.bookTitle}</h4>
                        <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isOverdue ? "bg-rose-100 text-rose-700" : isReturned ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-800"}`}
    >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        by {b.bookAuthor} · ISBN: {b.bookIsbn}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-600 self-start sm:self-auto">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Issued</span>
                        <span className="font-medium text-slate-700">
                          {new Date(b.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Due Date</span>
                        <span
      className={`font-semibold ${isOverdue ? "text-rose-600" : "text-slate-800"}`}
    >
                          {new Date(b.dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}
                        </span>
                      </div>

                      {isOverdue && <div>
                          <span className="text-rose-500 block text-[10px]">Penalty</span>
                          <span className="font-bold text-rose-700">Rs. {b.penaltyAmount}</span>
                        </div>}
                    </div>
                  </div>;
  })}
            </div>}
        </div>
      </div>
    </PageTransition>;
};
export {
  StudentDashboardPage
};
