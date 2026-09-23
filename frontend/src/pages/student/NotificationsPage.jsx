import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Info,
  Check
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const NotificationsPage = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch notifications";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifs();
  }, []);
  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications(
        (prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error updating notification";
      toast.error(msg);
    }
  };
  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error updating notifications";
      toast.error(msg);
    }
  };
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    return true;
  });
  return <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {
    /* Header */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Communications
              </span>
              {unreadCount > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {unreadCount} Unread
                </span>}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              Library Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Automated alerts for borrow transactions, due dates, overdue notices, and new catalog arrivals.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && <button
    type="button"
    onClick={handleMarkAllRead}
    className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200"
  >
                Mark all as read
              </button>}
          </div>
        </div>

        {
    /* Filters */
  }
        <div className="flex items-center gap-2">
          <button
    type="button"
    onClick={() => setFilter("ALL")}
    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === "ALL" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
            All ({notifications.length})
          </button>
          <button
    type="button"
    onClick={() => setFilter("UNREAD")}
    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === "UNREAD" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
            Unread ({unreadCount})
          </button>
        </div>

        {
    /* List */
  }
        {loading ? <div className="space-y-3">
            {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200 p-4 animate-pulse" />)}
          </div> : filteredNotifications.length === 0 ? <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No notifications</h3>
            <p className="text-xs text-slate-500">
              {filter === "UNREAD" ? "You have caught up with all library alerts." : "No alerts found in your notifications log."}
            </p>
          </div> : <div className="space-y-3">
            {filteredNotifications.map((notif) => {
    const isOverdue = notif.type === "BOOK_OVERDUE";
    const isBorrowed = notif.type === "BOOK_BORROWED";
    const isAdded = notif.type === "BOOK_ADDED";
    const isReturned = notif.type === "BOOK_RETURNED";
    return <motion.div
      key={notif._id}
      layout
      className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${!notif.isRead ? "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50" : "bg-slate-50/70 border-slate-200/70 text-slate-600"}`}
    >
                  <div className="flex items-start gap-3.5">
                    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isOverdue ? "bg-rose-100 text-rose-600" : isBorrowed ? "bg-indigo-100 text-indigo-600" : isReturned ? "bg-emerald-100 text-emerald-600" : isAdded ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-600"}`}
    >
                      {isOverdue && <AlertTriangle className="w-4 h-4" />}
                      {isBorrowed && <BookOpen className="w-4 h-4" />}
                      {isReturned && <CheckCircle2 className="w-4 h-4" />}
                      {isAdded && <Info className="w-4 h-4" />}
                      {!isOverdue && !isBorrowed && !isReturned && !isAdded && <Bell className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4
      className={`text-sm font-bold ${!notif.isRead ? "text-slate-900" : "text-slate-700"}`}
    >
                          {notif.title}
                        </h4>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                        {notif.message}
                      </p>
                      <span className="text-[11px] text-slate-400 block pt-0.5">
                        {new Date(notif.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
                      </span>
                    </div>
                  </div>

                  {!notif.isRead && <button
      type="button"
      onClick={() => handleMarkAsRead(notif._id)}
      title="Mark as read"
      className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg shrink-0 flex items-center gap-1 transition-colors"
    >
                      <Check className="w-3.5 h-3.5" />
                      Read
                    </button>}
                </motion.div>;
  })}
          </div>}
      </div>
    </PageTransition>;
};
export {
  NotificationsPage
};
