import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Search,
  RotateCcw
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
const MyBooksPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [returningId, setReturningId] = useState(null);
  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBooks();
      setBorrows(res.borrows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch your borrowed books";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBorrows();
  }, []);
  const handleReturnRequest = async (borrow) => {
    try {
      setReturningId(borrow._id);
      const res = await api.returnBook(borrow._id);
      toast.success(res.message || "Book marked as returned successfully!");
      setBorrows(
        (prev) => prev.map((b) => b._id === borrow._id ? res.borrow : b)
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to return book";
      toast.error(msg);
    } finally {
      setReturningId(null);
    }
  };
  const filteredBorrows = borrows.filter((b) => {
    const matchesFilter = activeFilter === "ALL" || activeFilter === "ISSUED" && b.status === "ISSUED" || activeFilter === "OVERDUE" && b.status === "OVERDUE" || activeFilter === "RETURNED" && b.status === "RETURNED";
    const matchesSearch = b.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || b.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase()) || b.bookIsbn.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });
  const activeCount = borrows.filter((b) => b.status === "ISSUED").length;
  const overdueCount = borrows.filter((b) => b.status === "OVERDUE").length;
  const returnedCount = borrows.filter((b) => b.status === "RETURNED").length;
  const totalPenalties = borrows.filter((b) => b.status === "OVERDUE").reduce((acc, curr) => acc + (curr.penaltyAmount || 0), 0);
  return <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {
    /* Header */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Borrowing Records
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {user?.collegeRegistrationNo}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              My Borrowed Books
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review current physical loans, return status, and overdue fine records.
            </p>
          </div>

          <Link
    to="/books"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
  >
            <BookOpen className="w-4 h-4" />
            Borrow Another Book
          </Link>
        </div>

        {
    /* SUMMARY STATS BAR */
  }
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Active Loans</span>
            <span className="text-2xl font-bold text-slate-900">{activeCount}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Currently in possession</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Overdue Loans</span>
            <span className="text-2xl font-bold text-rose-600">{overdueCount}</span>
            <span className="text-[11px] text-rose-500 block mt-1">
              Accruing Rs. 10 / day fine
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Total Returned</span>
            <span className="text-2xl font-bold text-emerald-700">{returnedCount}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Completed loans</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">
              Unsettled Penalties
            </span>
            <span className="text-2xl font-bold text-rose-700">Rs. {totalPenalties}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Payable at desk</span>
          </div>
        </div>

        {
    /* OVERDUE NOTICE BANNER */
  }
        {overdueCount > 0 && <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 leading-relaxed">
              <strong>Notice:</strong> You have {overdueCount} book(s) past the 14-day borrowing window. A daily late fee of Rs. 10 is automatically calculated. Please return the physical copy to the Central Circulation Desk (Level 2) promptly.
            </div>
          </div>}

        {
    /* SEARCH & TABS */
  }
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {
    /* Filter Pills */
  }
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
    { key: "ALL", label: `All (${borrows.length})` },
    { key: "ISSUED", label: `Active (${activeCount})` },
    { key: "OVERDUE", label: `Overdue (${overdueCount})` },
    { key: "RETURNED", label: `Returned (${returnedCount})` }
  ].map((tab) => <button
    key={tab.key}
    type="button"
    onClick={() => setActiveFilter(tab.key)}
    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === tab.key ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
                  {tab.label}
                </button>)}
            </div>

            {
    /* Search Input */
  }
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Filter by title, author, ISBN..."
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
  />
            </div>
          </div>
        </div>

        {
    /* LOANS LIST */
  }
        {loading ? <div className="space-y-3">
            {[1, 2, 3].map((n) => <div key={n} className="h-32 bg-white rounded-2xl border border-slate-200 p-5 animate-pulse" />)}
          </div> : filteredBorrows.length === 0 ? <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No records found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery || activeFilter !== "ALL" ? "No borrowing transactions match your current search or filter criteria." : "You have not checked out any physical books yet. Explore the college library catalog."}
            </p>
            <Link
    to="/books"
    className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
  >
              Browse Catalog Now
            </Link>
          </div> : <div className="space-y-4">
            {filteredBorrows.map((borrow) => {
    const isOverdue = borrow.status === "OVERDUE";
    const isIssued = borrow.status === "ISSUED";
    const isReturned = borrow.status === "RETURNED";
    const issueDateFormatted = new Date(borrow.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const dueDateFormatted = new Date(borrow.dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    const returnDateFormatted = borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) : null;
    return <motion.div
      key={borrow._id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${isOverdue ? "border-rose-300 bg-rose-50/20" : "border-slate-200/80 hover:border-slate-300"}`}
    >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {
      /* Left Details */
    }
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${isOverdue ? "bg-rose-100 text-rose-800 border border-rose-200" : isReturned ? "bg-slate-100 text-slate-700 border border-slate-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}
    >
                          {borrow.status}
                        </span>
                        <span className="text-xs font-mono font-medium text-slate-400">
                          ISBN: {borrow.bookIsbn}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {borrow.bookTitle}
                      </h3>

                      <p className="text-xs text-slate-600 font-medium">
                        Authored by <span className="text-slate-800">{borrow.bookAuthor}</span>
                      </p>
                    </div>

                    {
      /* Middle Dates & Penalty */
    }
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px] font-medium">
                          Issue Date
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 block">
                          {issueDateFormatted}
                        </span>
                      </div>

                      <div
      className={`p-3 rounded-xl border ${isOverdue ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"}`}
    >
                        <span
      className={`block text-[10px] font-medium ${isOverdue ? "text-rose-600" : "text-slate-400"}`}
    >
                          Due Date
                        </span>
                        <span
      className={`font-semibold mt-0.5 block ${isOverdue ? "text-rose-700" : "text-slate-800"}`}
    >
                          {dueDateFormatted}
                        </span>
                      </div>

                      {isReturned ? <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
                          <span className="text-emerald-700 block text-[10px] font-medium">
                            Returned On
                          </span>
                          <span className="font-semibold text-emerald-900 mt-0.5 block">
                            {returnDateFormatted}
                          </span>
                        </div> : isOverdue ? <div className="bg-rose-100/70 p-3 rounded-xl border border-rose-200 col-span-2 sm:col-span-1">
                          <span className="text-rose-700 block text-[10px] font-semibold">
                            Penalty Accrued
                          </span>
                          <span className="text-sm font-extrabold text-rose-900 mt-0.5 block">
                            Rs. {borrow.penaltyAmount}
                          </span>
                          <span className="text-[10px] text-rose-600 font-medium block">
                            {borrow.lateDays} days overdue
                          </span>
                        </div> : <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                          <span className="text-slate-400 block text-[10px] font-medium">
                            Status
                          </span>
                          <span className="font-semibold text-emerald-700 mt-0.5 block">
                            Within Loan Window
                          </span>
                        </div>}
                    </div>

                    {
      /* Right Actions / Physical Desk Info */
    }
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                      {!isReturned && <button
      type="button"
      disabled={returningId === borrow._id}
      onClick={() => handleReturnRequest(borrow)}
      className="px-4 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-center border border-indigo-200 flex items-center justify-center gap-1.5 focus:outline-none"
    >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {returningId === borrow._id ? "Processing Return..." : "Return Book Online"}
                        </button>}

                      {isReturned && <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Return Checked & Closed</span>
                        </div>}

                      <span className="text-[10px] text-slate-400 text-center">
                        Desk: Main Academic Wing A
                      </span>
                    </div>
                  </div>
                </motion.div>;
  })}
          </div>}
      </div>
    </PageTransition>;
};
export {
  MyBooksPage
};
