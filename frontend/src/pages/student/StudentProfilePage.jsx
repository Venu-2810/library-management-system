import { useState, useEffect } from "react";
import {
  User,
  Library
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
const StudentProfilePage = () => {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    api.getMyBooks().then((res) => {
      if (isMounted) {
        setBorrows(res.borrows);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const totalBorrowed = borrows.length;
  const activeLoans = borrows.filter((b) => b.status === "ISSUED").length;
  const overdueLoans = borrows.filter((b) => b.status === "OVERDUE").length;
  const returnedLoans = borrows.filter((b) => b.status === "RETURNED").length;
  const totalPenalties = borrows.filter((b) => b.status === "OVERDUE").reduce((acc, curr) => acc + (curr.penaltyAmount || 0), 0);
  return <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {
    /* Header */
  }
        <div className="border-b border-slate-200/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Student Account
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Student Profile & Academic Record
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Central registry records and circulation summary associated with your registration number.
          </p>
        </div>

        {
    /* PROFILE CARD */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                <User className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">
                  College Registration Number
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {user?.collegeRegistrationNo}
                </h2>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Student Account
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">System Role:</span>
                <span className="font-semibold text-slate-800 uppercase">{user?.role}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Circulation Access:</span>
                <span className="font-semibold text-emerald-700">Full Privilege</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Campus Stacks:</span>
                <span className="font-semibold text-slate-800">Academic Wing A</span>
              </div>
            </div>
          </div>
        </div>

        {
    /* BORROWING METRICS CARD */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900">
            Circulation Activity History
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Total Issued</span>
              <span className="text-2xl font-bold text-slate-900 block mt-1">
                {loading ? "..." : totalBorrowed}
              </span>
              <span className="text-[10px] text-slate-400">All-time checkouts</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Currently Active</span>
              <span className="text-2xl font-bold text-indigo-600 block mt-1">
                {loading ? "..." : activeLoans}
              </span>
              <span className="text-[10px] text-slate-400">14-day loan status</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Overdue Count</span>
              <span className="text-2xl font-bold text-rose-600 block mt-1">
                {loading ? "..." : overdueLoans}
              </span>
              <span className="text-[10px] text-slate-400">Past due date</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Total Fines</span>
              <span className="text-2xl font-bold text-rose-700 block mt-1">
                Rs. {loading ? "0" : totalPenalties}
              </span>
              <span className="text-[10px] text-slate-400">Overdue fees accrued</span>
            </div>
          </div>
        </div>

        {
    /* OFFICIAL LIBRARY GUIDELINES */
  }
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Library className="w-5 h-5" />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Library Regulations & Borrowing Policy
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-white block">14-Day Lending Cycle</span>
              <p className="text-slate-400 leading-relaxed">
                Standard volumes may be retained for up to 14 days. Renewal can be requested prior to due date if no pending reservations exist.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-white block">Rs. 10 Daily Penalty</span>
              <p className="text-slate-400 leading-relaxed">
                Late returns incur an automatic fine of Rs. 10 per day. Outstanding fees must be settled at the central circulation desk.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-white block">Registration ID Requirement</span>
              <p className="text-slate-400 leading-relaxed">
                Present your official College Registration Number whenever checking out physical materials or resolving returns at the desk.
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <span className="font-bold text-white block">Care of Physical Holdings</span>
              <p className="text-slate-400 leading-relaxed">
                Highlighting, margin writing, or tearing of pages is strictly prohibited. Damaged or lost volumes must be replaced by the student.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>;
};
export {
  StudentProfilePage
};
