import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  return <div
    aria-live="polite"
    aria-atomic="true"
    className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4"
  >
      <AnimatePresence>
        {toasts.map((toast) => {
    const isSuccess = toast.type === "success";
    const isError = toast.type === "error";
    return <motion.div
      key={toast.id}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.94 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${isSuccess ? "bg-emerald-950/90 text-emerald-100 border-emerald-800/60 shadow-emerald-950/20" : isError ? "bg-rose-950/90 text-rose-100 border-rose-800/60 shadow-rose-950/20" : "bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-950/20"}`}
    >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
              </div>
              <div className="flex-1 text-sm font-medium leading-snug">
                {toast.message}
              </div>
              <button
      type="button"
      onClick={() => removeToast(toast.id)}
      className="shrink-0 text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
      aria-label="Close notification"
    >
                <X className="w-4 h-4" />
              </button>
            </motion.div>;
  })}
      </AnimatePresence>
    </div>;
};
export {
  ToastContainer
};
