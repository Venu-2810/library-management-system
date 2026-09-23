import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PageTransition } from "../components/common/PageTransition";
import { Library, KeyRound, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collegeRegistrationNo, setCollegeRegistrationNo] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === "staff" || user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collegeRegistrationNo || !password) return;

    setSubmitting(true);
    const success = await login(collegeRegistrationNo, password);
    setSubmitting(false);

    if (success) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-slate-900 text-white items-center justify-center shadow-md">
            <Library className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Sign In to College Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your official College Registration Number to access your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  College Registration Number
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={collegeRegistrationNo}
                    onChange={(e) => setCollegeRegistrationNo(e.target.value.toUpperCase())}
                    placeholder="Enter Registration No."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? "Verifying Credentials..." : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              New college student?{" "}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Register with registration number →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};