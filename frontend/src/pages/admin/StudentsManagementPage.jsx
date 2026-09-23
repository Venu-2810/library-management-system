import { useState, useEffect } from "react";
import {
  Search,
  Eye
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { Modal } from "../../components/common/Modal";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const StudentsManagementPage = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminStudents();
      setStudents(res.students);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch registered students";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);
  const handleToggleStatus = async (student) => {
    try {
      setTogglingId(student.id);
      const res = await api.toggleStudentStatus(student.id, !student.active);
      toast.success(
        `Registration ${student.collegeRegistrationNo} is now ${res.active ? "Active" : "Suspended"}.`
      );
      setStudents(
        (prev) => prev.map((s) => s.id === student.id ? { ...s, active: res.active } : s)
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error updating student account status";
      toast.error(msg);
    } finally {
      setTogglingId(null);
    }
  };
  const filteredStudents = students.filter(
    (s) => s.collegeRegistrationNo.toLowerCase().includes(search.toLowerCase().trim())
  );
  const totalRegistered = students.length;
  const totalActiveLoans = students.reduce((sum, s) => sum + s.activeLoans, 0);
  const studentsWithOverdue = students.filter((s) => s.overdueBooks > 0).length;
  return <PageTransition>
      <div className="space-y-8">
        {
    /* Header */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Registered Student Accounts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage student circulation privileges, monitor active loans, and audit historical checkouts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-xs">
              Total Students: {totalRegistered}
            </span>
            <span className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 rounded-xl">
              With Overdues: {studentsWithOverdue}
            </span>
          </div>
        </div>

        {
    /* Search Bar */
  }
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by College Registration No..."
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
  />
          </div>
        </div>

        {
    /* Students Table */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">College Reg No</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-center">Active Loans</th>
                  <th className="py-3 px-4 text-center">Overdue Books</th>
                  <th className="py-3 px-4 text-center">Lifetime Borrows</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading registered students...
                    </td>
                  </tr> : filteredStudents.length === 0 ? <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No student records found matching "{search}".
                    </td>
                  </tr> : filteredStudents.map((student) => {
    const hasOverdue = student.overdueBooks > 0;
    return <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                          {student.collegeRegistrationNo}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${student.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
    >
                            {student.active ? "Active Privilege" : "Circulation Suspended"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-slate-800 text-sm">
                            {student.activeLoans}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {hasOverdue ? <span className="inline-block px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-xs">
                              {student.overdueBooks}
                            </span> : <span className="text-slate-400 font-medium">0</span>}
                        </td>

                        <td className="py-3.5 px-4 text-center text-slate-600 font-medium">
                          {student.totalBorrowed}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
      type="button"
      onClick={() => setSelectedStudent(student)}
      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
    >
                              <Eye className="w-3.5 h-3.5" />
                              History
                            </button>

                            <button
      type="button"
      disabled={togglingId === student.id}
      onClick={() => handleToggleStatus(student)}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${student.active ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"}`}
    >
                              {togglingId === student.id ? "Updating..." : student.active ? "Suspend" : "Restore"}
                            </button>
                          </div>
                        </td>
                      </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>

        {
    /* STUDENT HISTORY MODAL */
  }
        <Modal
    isOpen={selectedStudent !== null}
    onClose={() => setSelectedStudent(null)}
    title={`Circulation History: ${selectedStudent?.collegeRegistrationNo}`}
    maxWidth="max-w-2xl"
  >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px]">Active Loans</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedStudent?.activeLoans}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Overdue Books</span>
                <span className="font-bold text-rose-600 text-sm">
                  {selectedStudent?.overdueBooks}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Lifetime Checkouts</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedStudent?.totalBorrowed}
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {!selectedStudent?.borrowHistory || selectedStudent.borrowHistory.length === 0 ? <div className="text-center py-8 text-slate-400 text-xs">
                  No previous checkouts recorded for this student ID.
                </div> : selectedStudent.borrowHistory.map((b) => <div
    key={b._id}
    className="p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between text-xs gap-4"
  >
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-slate-900">{b.bookTitle}</h5>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        ISBN: {b.bookIsbn} · by {b.bookAuthor}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5 shrink-0">
                      <span
    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${b.status === "OVERDUE" ? "bg-rose-100 text-rose-700" : b.status === "RETURNED" ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-800"}`}
  >
                        {b.status}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Due: {new Date(b.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                  </div>)}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
    type="button"
    onClick={() => setSelectedStudent(null)}
    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
  >
                Close Record
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>;
};
export {
  StudentsManagementPage
};
