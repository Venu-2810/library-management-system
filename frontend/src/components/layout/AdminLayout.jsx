import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  RotateCcw,
  Users,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-600">Verifying staff credentials...</span>
        </div>
      </div>;
  }
  if (!user || user.role !== "staff" && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/books", label: "Manage Books", icon: BookOpen },
    { to: "/admin/borrow-return", label: "Borrow & Return", icon: RotateCcw },
    { to: "/admin/students", label: "Students", icon: Users },
    { to: "/admin/reports", label: "Circulation Reports", icon: BarChart3 },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    ...user.role === "admin" ? [{ to: "/admin/settings", label: "Settings", icon: Settings }] : []
  ];
  return <div className="min-h-screen bg-slate-50/70 pb-16">
      {
    /* Admin Top Banner */
  }
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Staff & Administration Portal
                  </h1>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Circulation desk management, physical loans, inventory, and policy enforcement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-slate-300 self-start sm:self-auto">
              <span className="text-slate-500">STAFF ID:</span>
              <span className="font-bold text-white">{user.collegeRegistrationNo}</span>
            </div>
          </div>

          {
    /* Admin Navigation Pills */
  }
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {navItems.map((item) => {
    const Icon = item.icon;
    return <NavLink
      key={item.to}
      to={item.to}
      end={item.exact}
      className={({ isActive }) => `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
    >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>;
  })}
          </div>
        </div>
      </div>

      {
    /* Main Outlet */
  }
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Outlet />
      </main>
    </div>;
};
export {
  AdminLayout
};
