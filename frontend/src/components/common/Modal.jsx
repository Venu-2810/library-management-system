import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-xl"
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);
  return <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {
    /* Backdrop */
  }
          <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
  />

          {
    /* Modal Card */
  }
          <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: 8 }}
    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10`}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
            {
    /* Header */
  }
            <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 id="modal-title" className="text-xl font-semibold text-slate-900 tracking-tight">
                  {title}
                </h3>
                {subtitle && <p className="mt-1 text-sm text-slate-500 font-normal">
                    {subtitle}
                  </p>}
              </div>
              <button
    type="button"
    onClick={onClose}
    className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
    aria-label="Close modal"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            {
    /* Body */
  }
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export {
  Modal
};
