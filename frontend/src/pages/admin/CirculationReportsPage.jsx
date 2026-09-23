import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Printer
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const PIE_COLORS = [
  "#4f46e5",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#64748b",
  "#14b8a6"
];
const CirculationReportsPage = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    api.getAdminStats().then((res) => {
      if (isMounted) {
        setStats(res.stats);
        setCharts(res.charts);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        toast.error("Failed to load circulation analytics data");
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const handlePrint = () => {
    window.print();
  };
  return <PageTransition>
      <div className="space-y-8 print:space-y-4">
        {
    /* Header */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 print:border-none">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Circulation Analytics & Department Reports
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Holistic statistics on campus-wide book circulation, stack utilization, and overdue compliance.
            </p>
          </div>

          <button
    type="button"
    onClick={handlePrint}
    className="print:hidden px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
  >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Official Report
          </button>
        </div>

        {
    /* METRICS ROW */
  }
        {stats && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Total Catalog Titles</span>
              <span className="text-2xl font-bold text-slate-900 mt-2 block">{stats.totalBooks}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Registered in collection</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Active Loans Issued</span>
              <span className="text-2xl font-bold text-indigo-600 mt-2 block">
                {stats.borrowedBooks}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Circulating on campus</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Today's Transactions</span>
              <span className="text-2xl font-bold text-emerald-700 mt-2 block">
                {stats.todayIssues + stats.todayReturns}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stats.todayIssues} issues · {stats.todayReturns} returns
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Overdue Fine Incurred</span>
              <span className="text-2xl font-bold text-rose-700 mt-2 block">
                Rs. {stats.outstandingPenalties}
              </span>
              <span className="text-[11px] text-rose-500 font-medium mt-1 block">
                {stats.overdueBooks} overdue volumes
              </span>
            </div>
          </div>}

        {
    /* CHARTS GRID */
  }
        {loading || !charts ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white rounded-3xl border border-slate-200 animate-pulse" />
            <div className="h-80 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {
    /* Chart 1: Issues vs Returns */
  }
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Circulation Volume (Issued vs Returned)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monthly checkout trends across all departments
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.issuesOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
    contentStyle={{
      backgroundColor: "#0f172a",
      border: "none",
      borderRadius: "12px",
      color: "#fff",
      fontSize: "12px"
    }}
  />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar dataKey="issued" name="Issued" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="returned" name="Returned" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {
    /* Chart 2: Category Distribution */
  }
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Academic Holdings Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Physical copies segmented by course-neutral disciplines
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <PieIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
    contentStyle={{
      backgroundColor: "#0f172a",
      border: "none",
      borderRadius: "12px",
      color: "#fff",
      fontSize: "12px"
    }}
  />
                    <Pie
    data={charts.categoryDistribution}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={80}
    innerRadius={45}
    paddingAngle={3}
  >
                      {charts.categoryDistribution.map((entry, index) => <Cell
    key={`cell-${index}`}
    fill={PIE_COLORS[index % PIE_COLORS.length]}
  />)}
                    </Pie>
                    <Legend
    wrapperStyle={{ fontSize: "10px", maxHeight: "70px", overflowY: "auto" }}
  />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {
    /* Chart 3: Overdue Trend */
  }
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Weekly Overdue Incidents
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tracking delinquent returns and penalty assessment
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.overdueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
    contentStyle={{
      backgroundColor: "#0f172a",
      border: "none",
      borderRadius: "12px",
      color: "#fff",
      fontSize: "12px"
    }}
  />
                    <Line
    type="monotone"
    dataKey="count"
    name="Overdue Books"
    stroke="#e11d48"
    strokeWidth={2.5}
    dot={{ r: 4, fill: "#e11d48" }}
  />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>}
      </div>
    </PageTransition>;
};
export {
  CirculationReportsPage
};
