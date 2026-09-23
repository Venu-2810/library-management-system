import { useState, useEffect } from "react";
import {
  Send
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const AdminNotificationsPage = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recipientType, setRecipientType] = useState("ALL_STUDENTS");
  const [specificRegNo, setSpecificRegNo] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifType, setNotifType] = useState("GENERAL");
  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.notifications);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch notification history";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifs();
  }, []);
  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Subject and message body are required.");
      return;
    }
    if (recipientType === "SPECIFIC" && !specificRegNo.trim()) {
      toast.error("Please enter the target student registration number.");
      return;
    }
    const targetRecipient = recipientType === "SPECIFIC" ? specificRegNo.trim().toUpperCase() : recipientType;
    try {
      setSending(true);
      const res = await api.broadcastNotification({
        recipient: targetRecipient,
        title: title.trim(),
        message: message.trim(),
        type: notifType
      });
      toast.success(res.message || "Notification broadcasted successfully!");
      setTitle("");
      setMessage("");
      setSpecificRegNo("");
      fetchNotifs();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error sending notification";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };
  return <PageTransition>
      <div className="space-y-8">
        {
    /* Header */
  }
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Circulation Dispatch & Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official administrative notices, overdue recalls, or general stack announcements.
          </p>
        </div>

        {
    /* BROADCAST FORM */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Compose New Dispatch Notice
              </h3>
              <p className="text-xs text-slate-500">
                Messages appear instantly in the recipient's notification bell and student dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {
    /* Recipient Selector */
  }
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Target Audience *</label>
                <select
    value={recipientType}
    onChange={(e) => setRecipientType(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
                  <option value="ALL_STUDENTS">All Registered Students</option>
                  <option value="SPECIFIC">Single Student (by Reg No)</option>
                  <option value="STAFF_ADMIN">Circulation Staff & Admins</option>
                </select>
              </div>

              {
    /* Specific Student Input if selected */
  }
              {recipientType === "SPECIFIC" && <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Student Reg No *</label>
                  <input
    type="text"
    required
    value={specificRegNo}
    onChange={(e) => setSpecificRegNo(e.target.value)}
    placeholder="e.g. 2024CS01"
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
  />
                </div>}

              {
    /* Notification Category */
  }
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Notice Category *</label>
                <select
    value={notifType}
    onChange={(e) => setNotifType(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
                  <option value="GENERAL">General Announcement</option>
                  <option value="BOOK_OVERDUE">Overdue Return Recall</option>
                  <option value="BOOK_ADDED">New Acquisition Release</option>
                </select>
              </div>
            </div>

            {
    /* Title */
  }
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Notice Subject / Title *</label>
              <input
    type="text"
    required
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g. Extended Reading Room Hours for Semester End"
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>

            {
    /* Message Body */
  }
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Official Message *</label>
              <textarea
    required
    rows={3}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Provide complete circular details, desk timings, or policy reminders..."
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>

            <div className="flex justify-end pt-2">
              <button
    type="submit"
    disabled={sending || !title || !message}
    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
  >
                <Send className="w-3.5 h-3.5" />
                {sending ? "Broadcasting..." : "Broadcast Dispatch"}
              </button>
            </div>
          </form>
        </div>

        {
    /* RECENT NOTIFICATIONS LOG */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Dispatches & Alerts</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Central communication records archived by the circulation department
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Total Records: {notifications.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? <div className="py-8 text-center text-slate-400 text-xs">
                Loading notifications...
              </div> : notifications.length === 0 ? <div className="py-8 text-center text-slate-400 text-xs">
                No previous dispatches recorded.
              </div> : notifications.map((notif) => <div key={notif._id} className="py-4 flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold">
                        To: {notif.recipient}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                        {notif.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Sent on{" "}
                      {new Date(notif.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
    className={`text-[11px] font-semibold ${notif.isRead ? "text-slate-400" : "text-indigo-600"}`}
  >
                      {notif.isRead ? "Acknowledged" : "Delivered"}
                    </span>
                  </div>
                </div>)}
          </div>
        </div>
      </div>
    </PageTransition>;
};
export {
  AdminNotificationsPage
};
