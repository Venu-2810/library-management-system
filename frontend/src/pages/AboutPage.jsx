import { PageTransition } from "../components/common/PageTransition";
import {
  Library,
  Clock,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Calendar,
  MapPin
} from "lucide-react";

export const AboutPage = () => {
  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Library className="w-3.5 h-3.5" />
            <span>Collegiate Library Information</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            About the College Library
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            A comprehensive, course-neutral academic resource center dedicated to supporting study, research, and self-directed scholarly learning for all enrolled students.
          </p>
        </div>

        {/* Section 1: Physical Book Management Model */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Physical Volume Circulation & Record Management
              </h2>
              <span className="text-xs text-slate-500">Official Operational Policy</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            The College Library maintains physical holdings across diverse academic disciplines, including computer systems, philosophy, economics, cognitive psychology, world history, design thinking, and personal development. The online library platform acts as our authoritative digital catalog and circulation transaction record.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Borrowing Duration
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Standard physical book loan period is <strong>14 calendar days</strong> from the date of physical issue.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Overdue Penalty
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Books returned after the designated due date incur a fine of <strong>Rs. 10 per day</strong> overdue.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Registration ID
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your official <strong>College Registration Number</strong> serves as your exclusive academic identifier across all transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Library Hours & Stacks Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Operating Schedule</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-medium text-slate-800">Monday – Friday</span>
                <span className="text-slate-600">08:00 AM – 09:00 PM</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-medium text-slate-800">Saturday</span>
                <span className="text-slate-600">09:00 AM – 05:00 PM</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-medium text-slate-800">Sunday</span>
                <span className="text-rose-600 font-medium">Closed (Stack Maintenance)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-slate-800">Exam Preparation Weeks</span>
                <span className="text-emerald-700 font-semibold">Extended: 08:00 – 23:00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Campus Facilities</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span><strong>Central Circulation Desk:</strong> Level 2, Main Academic Wing A.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span><strong>Open Reference Stacks:</strong> Shelves A-1 through P-20 organized systematically.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span><strong>Quiet Reading Halls:</strong> 250 individual study cubicles with high-speed campus Wi-Fi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span><strong>Digital Catalog Terminals:</strong> Touchscreen stations for quick shelf lookups.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};