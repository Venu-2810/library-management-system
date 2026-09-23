import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageTransition } from "../../components/common/PageTransition";
import {
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Plus
} from "lucide-react";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const AdminDashboardPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, borrowsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllBorrows()
      ]);
      setStats(statsRes.stats);
      setRecentBorrows(borrowsRes.borrows.slice(0, 6));
    } catch (err) {
      toast.error("Failed to load admin circulation statistics");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);
  const overdueBorrows = recentBorrows.filter((b) => b.status === "OVERDUE");
  return <PageTransition>
      <div className="space-y-8">
        {
    /* Top Summary Bar */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Circulation Desk Overview
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time physical book inventory, active borrowing transactions, and overdue monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
    to="/admin/borrow-return"
    className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
              <RotateCcw className="w-4 h-4" />
              Issue / Return Desk
            </Link>

            <Link
    to="/admin/books"
    className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
  >
              <Plus className="w-4 h-4" />
              Add Book Title
            </Link>
          </div>
        </div>

        {
    /* 6-Card Stats Bento */
  }
        {loading || !stats ? <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />)}
          </div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {
    /* Total Titles */
  }
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Catalog Titles</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-2 block">
                {stats.totalBooks}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Distinct titles</span>
            </div>

            {
    /* Total Available Copies */
  }
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">On Shelf</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-2 block">
                {stats.availableBooks}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Available copies</span>
            </div>

            {
    /* In Circulation */
  }
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">In Circulation</span>
              <span className="text-2xl font-extrabold text-indigo-700 mt-2 block">
                {stats.borrowedBooks}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Active student loans</span>
            </div>

            {
    /* Overdue */
  }
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Overdue</span>
              <span className="text-2xl font-extrabold text-rose-600 mt-2 block">
                {stats.overdueBooks}
              </span>
              <span className="text-[11px] text-rose-500 font-medium mt-1 block">Past due date</span>
            </div>

            {
    /* Registered Students */
  }
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Students</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-2 block">
                {stats.registeredStudents}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Registered IDs</span>
            </div>

            {
    /* Outstanding Fines */
  }
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block">Accrued Fines</span>
              <span className="text-2xl font-extrabold text-rose-700 mt-2 block">
                Rs. {stats.outstandingPenalties}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Overdue fees</span>
            </div>
          </div>}

        {
    /* OVERDUE ALERTS TABLE (IF ANY) */
  }
        {overdueBorrows.length > 0 && <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Immediate Overdue Alert ({overdueBorrows.length})
                </h3>
              </div>
              <Link
    to="/admin/borrow-return"
    className="text-xs font-semibold text-rose-600 hover:text-rose-800"
  >
                Process returns →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="py-2.5 px-3">Student Reg No</th>
                    <th className="py-2.5 px-3">Book Title</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Overdue Fine</th>
                    <th className="py-2.5 px-3 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overdueBorrows.map((b) => <tr key={b._id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {b.studentRegistrationNo}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 max-w-xs truncate">
                        {b.bookTitle}
                      </td>
                      <td className="py-3 px-3 text-rose-600 font-semibold">
                        {new Date(b.dueDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-700">
                        Rs. {b.penaltyAmount}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
    to="/admin/borrow-return"
    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-[11px] inline-block"
  >
                          Collect & Return
                        </Link>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* RECENT CIRCULATION ACTIVITY */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Circulation Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest loan issues and returns processed across all academic departments
              </p>
            </div>
            <Link
    to="/admin/borrow-return"
    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
  >
              All circulation records <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Student Reg No</th>
                  <th className="py-3 px-3">Book Title</th>
                  <th className="py-3 px-3">ISBN</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBorrows.map((b) => <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {b.studentRegistrationNo}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-800 max-w-xs truncate">
                      {b.bookTitle}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {b.bookIsbn}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {new Date(b.issueDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  })}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {new Date(b.dueDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  })}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${b.status === "OVERDUE" ? "bg-rose-100 text-rose-800" : b.status === "RETURNED" ? "bg-slate-100 text-slate-700" : "bg-emerald-100 text-emerald-800"}`}
  >
                        {b.status}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>;
};
export {
  AdminDashboardPage
};
