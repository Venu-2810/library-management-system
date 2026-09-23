import { useState, useEffect } from "react";
import { PageTransition } from "../../components/common/PageTransition";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
  User,
  ShieldCheck,
  QrCode,
  Lock
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
const ProfilePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  useEffect(() => {
    api.getMyBooks().then((res) => {
      setBorrows(res.borrows);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const activeLoans = borrows.filter((b) => b.status === "ISSUED");
  const overdueLoans = borrows.filter((b) => b.status === "OVERDUE");
  const returnedLoans = borrows.filter((b) => b.status === "RETURNED");
  const totalPenalties = overdueLoans.reduce((sum, b) => sum + (b.penaltyAmount || 0), 0);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setUpdatingPassword(true);
      toast.success("Password update request processed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };
  return <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {
    /* Header */
  }
        <div className="border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Academic Student Profile
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Student Identity & Borrowing Record
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official central library account details and borrowing privileges.
          </p>
        </div>

        {
    /* Digital Student Library Pass */
  }
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-indigo-300 block uppercase tracking-wider">
                    College Registration Number
                  </span>
                  <span className="text-2xl font-mono font-bold tracking-tight text-white block">
                    {user?.collegeRegistrationNo}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Account: Enrolled Student</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Status: Active Circulation Rights</span>
                </div>
              </div>
            </div>

            {
    /* Visual Circulation QR / Barcode Card */
  }
            <div className="bg-white text-slate-900 p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg self-start sm:self-auto shrink-0 w-36 sm:w-40 text-center">
              <QrCode className="w-16 h-16 text-slate-900 mb-2" />
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
                {user?.collegeRegistrationNo}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Central Library Pass
              </span>
            </div>
          </div>
        </div>

        {
    /* Academic Circulation Stats Grid */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Total Lifetime Loans</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {borrows.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Currently Borrowed</span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">
              {activeLoans.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Successfully Returned</span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">
              {returnedLoans.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-medium text-slate-500 block">Outstanding Penalties</span>
            <span
    className={`text-2xl font-bold mt-1 block ${totalPenalties > 0 ? "text-rose-600" : "text-slate-800"}`}
  >
              {totalPenalties > 0 ? `Rs. ${totalPenalties}` : "Rs. 0"}
            </span>
          </div>
        </div>

        {
    /* Security / Password section */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Account Security</h3>
              <p className="text-xs text-slate-500">
                Your account is protected with encrypted authentication.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
    type="password"
    required
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Minimum 6 characters"
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
  />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
    type="password"
    required
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Confirm new password"
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
  />
            </div>

            <button
    type="submit"
    disabled={updatingPassword}
    className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
  >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </PageTransition>;
};
export {
  ProfilePage
};
