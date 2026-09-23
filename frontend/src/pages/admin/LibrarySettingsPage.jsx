import { useState, useEffect } from "react";
import {
  Save,
  Library,
  Bell,
  RotateCcw
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const LibrarySettingsPage = () => {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let isMounted = true;
    api.getAdminSettings().then((res) => {
      if (isMounted) {
        setSettings(res.settings);
        setLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        toast.error("Failed to load library settings");
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      const res = await api.updateAdminSettings(settings);
      toast.success(res.message || "Circulation policies updated successfully!");
      setSettings(res.settings);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error updating settings";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };
  if (loading || !settings) {
    return <div className="p-8 text-center text-slate-400 text-xs">
        Loading system circulation settings...
      </div>;
  }
  return <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8">
        {
    /* Header */
  }
        <div className="border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              System Administration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Admin Only
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Library Circulation Policies & Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure lending durations, daily penalty assessment, and automated system alerts.
          </p>
        </div>

        {
    /* SETTINGS FORM */
  }
        <form onSubmit={handleSave} className="space-y-6">
          {
    /* General Information */
  }
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Library className="w-5 h-5 text-indigo-600" />
              <h3>Institution Identity</h3>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Official Library Name</label>
              <input
    type="text"
    required
    value={settings.libraryName}
    onChange={(e) => setSettings({ ...settings, libraryName: e.target.value })}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>
          </div>

          {
    /* Lending Rules */
  }
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <RotateCcw className="w-5 h-5 text-indigo-600" />
              <h3>Circulation & Lending Rules</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Standard Loan Duration (Days)
                </label>
                <div className="relative">
                  <input
    type="number"
    min={1}
    max={60}
    required
    value={settings.borrowDurationDays}
    onChange={(e) => setSettings({
      ...settings,
      borrowDurationDays: Number(e.target.value)
    })}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    days
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Default lending window granted when a physical book is checked out to a student.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Daily Overdue Penalty Rate (Rs.)
                </label>
                <div className="relative">
                  <input
    type="number"
    min={0}
    max={500}
    required
    value={settings.dailyPenalty}
    onChange={(e) => setSettings({
      ...settings,
      dailyPenalty: Number(e.target.value)
    })}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    Rs. / day
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automatic fee levied per day for every physical copy overdue past the return due date.
                </p>
              </div>
            </div>
          </div>

          {
    /* Automated Alerts Preferences */
  }
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3>Notification Dispatch Preferences</h3>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Automated Overdue Alerts
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Automatically generate in-app alerts when a loan crosses its due date
                  </span>
                </div>
                <input
    type="checkbox"
    checked={settings.notificationPreferences?.overdueAlerts ?? true}
    onChange={(e) => setSettings({
      ...settings,
      notificationPreferences: {
        overdueAlerts: e.target.checked,
        borrowConfirmation: settings.notificationPreferences?.borrowConfirmation ?? true,
        newBookBroadcast: settings.notificationPreferences?.newBookBroadcast ?? true
      }
    })}
    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
  />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Checkout & Return Confirmations
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Dispatch digital transaction receipts to students when books are issued or returned
                  </span>
                </div>
                <input
    type="checkbox"
    checked={settings.notificationPreferences?.borrowConfirmation ?? true}
    onChange={(e) => setSettings({
      ...settings,
      notificationPreferences: {
        overdueAlerts: settings.notificationPreferences?.overdueAlerts ?? true,
        borrowConfirmation: e.target.checked,
        newBookBroadcast: settings.notificationPreferences?.newBookBroadcast ?? true
      }
    })}
    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
  />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    New Catalog Arrival Broadcasts
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Notify all registered campus students when new titles are added to stacks
                  </span>
                </div>
                <input
    type="checkbox"
    checked={settings.notificationPreferences?.newBookBroadcast ?? true}
    onChange={(e) => setSettings({
      ...settings,
      notificationPreferences: {
        overdueAlerts: settings.notificationPreferences?.overdueAlerts ?? true,
        borrowConfirmation: settings.notificationPreferences?.borrowConfirmation ?? true,
        newBookBroadcast: e.target.checked
      }
    })}
    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
  />
              </label>
            </div>
          </div>

          {
    /* Submit Button */
  }
          <div className="flex justify-end">
            <button
    type="submit"
    disabled={saving}
    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
  >
              <Save className="w-4 h-4" />
              {saving ? "Saving System Policies..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>;
};
export {
  LibrarySettingsPage
};
