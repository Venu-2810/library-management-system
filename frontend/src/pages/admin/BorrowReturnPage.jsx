import { useState, useEffect } from "react";
import {
  RotateCcw,
  BookOpen,
  User,
  Search,
  Check
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const BorrowReturnPage = () => {
  const toast = useToast();
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueStudentReg, setIssueStudentReg] = useState("");
  const [issueBookId, setIssueBookId] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingReturnId, setProcessingReturnId] = useState(null);
  const loadData = async () => {
    try {
      setLoading(true);
      const [borrowsRes, booksRes] = await Promise.all([
        api.getAllBorrows(),
        api.getBooks()
      ]);
      setBorrows(borrowsRes.borrows);
      setBooks(booksRes.books);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error fetching circulation data";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!issueStudentReg.trim() || !issueBookId) {
      toast.error("Both student registration number and book title are required.");
      return;
    }
    try {
      setIssuing(true);
      const res = await api.borrowBook(issueBookId, issueStudentReg.trim().toUpperCase());
      toast.success(`Book successfully issued to ${issueStudentReg.toUpperCase()}!`);
      setIssueStudentReg("");
      setIssueBookId("");
      loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to issue book";
      toast.error(msg);
    } finally {
      setIssuing(false);
    }
  };
  const handleReturnBook = async (borrowId, studentReg, title) => {
    try {
      setProcessingReturnId(borrowId);
      const res = await api.returnBook(borrowId);
      toast.success(`Book "${title}" checked in and returned by ${studentReg}!`);
      loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Return failed";
      toast.error(msg);
    } finally {
      setProcessingReturnId(null);
    }
  };
  const filteredBorrows = borrows.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || statusFilter === "ISSUED" && b.status === "ISSUED" || statusFilter === "OVERDUE" && b.status === "OVERDUE" || statusFilter === "RETURNED" && b.status === "RETURNED";
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || b.studentRegistrationNo.toLowerCase().includes(q) || b.bookTitle.toLowerCase().includes(q) || b.bookAuthor.toLowerCase().includes(q) || b.bookIsbn.includes(q);
    return matchesStatus && matchesSearch;
  });
  const availableBooks = books.filter((b) => b.availableCopies > 0);
  const selectedBookToIssue = books.find((b) => b._id === issueBookId);
  return <PageTransition>
      <div className="space-y-8">
        {
    /* Page Header */
  }
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Circulation Desk: Borrow & Return Counter
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Physical material checkout, return processing, real-time fine calculation, and loan status audits.
          </p>
        </div>

        {
    /* ISSUE COUNTER WIDGET */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Issue Physical Book to Student</h3>
              <p className="text-xs text-slate-500">
                Lending period: 14 days standard duration. Verify student registration ID at counter.
              </p>
            </div>
          </div>

          <form onSubmit={handleIssueBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Student Registration No *
              </label>
              <input
    type="text"
    required
    value={issueStudentReg}
    onChange={(e) => setIssueStudentReg(e.target.value)}
    placeholder="e.g. 2024CS01, 2023EC14..."
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
  />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Select Physical Book Title *
              </label>
              <select
    required
    value={issueBookId}
    onChange={(e) => setIssueBookId(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
                <option value="">-- Choose available volume --</option>
                {availableBooks.map((b) => <option key={b._id} value={b._id}>
                    {b.title} (Available: {b.availableCopies} | Shelf: {b.shelf})
                  </option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
    type="submit"
    disabled={issuing || !issueBookId || !issueStudentReg}
    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
  >
                <Check className="w-4 h-4" />
                {issuing ? "Issuing Volume..." : "Issue Physical Copy (14 Days)"}
              </button>
            </div>
          </form>

          {selectedBookToIssue && <div className="mt-4 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
              <div className="flex items-center gap-3">
                <span className="font-bold">{selectedBookToIssue.title}</span>
                <span className="text-indigo-600">by {selectedBookToIssue.author}</span>
                <span className="font-mono text-indigo-500 text-[11px]">
                  ISBN: {selectedBookToIssue.isbn}
                </span>
              </div>
              <div className="font-semibold text-indigo-700">
                Shelf: {selectedBookToIssue.shelf} · {selectedBookToIssue.availableCopies} left
              </div>
            </div>}
        </div>

        {
    /* TRANSACTIONS REPOSITORY */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Central Circulation Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited list of current issues, historical returns, and overdue penalty receipts
              </p>
            </div>

            {
    /* Quick stats pills */
  }
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl font-medium">
                Total: {borrows.length}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium">
                Active: {borrows.filter((b) => b.status === "ISSUED").length}
              </span>
              <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold">
                Overdue: {borrows.filter((b) => b.status === "OVERDUE").length}
              </span>
            </div>
          </div>

          {
    /* Search & Tabs */
  }
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
    { key: "ALL", label: "All Records" },
    { key: "ISSUED", label: "Active Loans" },
    { key: "OVERDUE", label: "Overdue Fines" },
    { key: "RETURNED", label: "Completed Returns" }
  ].map((tab) => <button
    key={tab.key}
    type="button"
    onClick={() => setStatusFilter(tab.key)}
    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === tab.key ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
                  {tab.label}
                </button>)}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search student reg no, title, ISBN..."
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
  />
            </div>
          </div>

          {
    /* Table */
  }
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-3">Student Reg No</th>
                  <th className="py-3 px-3">Book Title & ISBN</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Late Penalty</th>
                  <th className="py-3 px-3 text-right">Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Loading circulation transactions...
                    </td>
                  </tr> : filteredBorrows.length === 0 ? <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No circulation records match current filter.
                    </td>
                  </tr> : filteredBorrows.map((b) => {
    const isOverdue = b.status === "OVERDUE";
    const isReturned = b.status === "RETURNED";
    return <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                          {b.studentRegistrationNo}
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block truncate">
                              {b.bookTitle}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              {b.bookIsbn}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600">
                          {new Date(b.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 font-medium">
                          <span className={isOverdue ? "text-rose-600 font-bold" : ""}>
                            {new Date(b.dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOverdue ? "bg-rose-100 text-rose-800" : isReturned ? "bg-slate-100 text-slate-700" : "bg-emerald-100 text-emerald-800"}`}
    >
                            {b.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          {isOverdue ? <span className="font-bold text-rose-700">
                              Rs. {b.penaltyAmount} ({b.lateDays}d)
                            </span> : <span className="text-slate-400">—</span>}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          {!isReturned ? <button
      type="button"
      disabled={processingReturnId === b._id}
      onClick={() => handleReturnBook(b._id, b.studentRegistrationNo, b.bookTitle)}
      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-xs transition-colors border border-indigo-200"
    >
                              {processingReturnId === b._id ? "Checking in..." : "Process Return"}
                            </button> : <span className="text-slate-400 text-xs">Returned</span>}
                        </td>
                      </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>;
};
export {
  BorrowReturnPage
};
