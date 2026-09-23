import { Link } from "react-router-dom";
import { Clock, MapPin, Shield, BookOpen } from "lucide-react";
const Footer = () => {
  return <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {
    /* Col 1: Identity */
  }
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                College Library
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your college library, connected. Providing open access to core academic texts, general scholarship, and research resources for all collegiate students.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Academic Building A, Level 2</span>
            </div>
          </div>

          {
    /* Col 2: Library Hours & Circulation */
  }
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Circulation Desk
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-300 font-medium">Mon – Fri: 08:00 – 21:00</span>
                  <span className="block text-slate-500">Saturday: 09:00 – 17:00</span>
                  <span className="block text-slate-500">Sunday: Closed for maintenance</span>
                </div>
              </div>
              <p className="text-slate-400 pt-1">
                Standard borrowing window is 14 days per physical volume. Overdue daily penalty is Rs. 10.
              </p>
            </div>
          </div>

          {
    /* Col 3: Navigation */
  }
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/books" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Library Policies & Guidelines
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {
    /* Col 4: Physical Book Record Policy */
  }
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Physical Desk Service
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Books are physical volumes managed on campus shelves. Carry your college registration number to the circulation desk for loan issuance and physical returns.
            </p>
            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-2 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official College Library Records System</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} College Library Administration. All student records protected.</p>
          <div className="flex items-center gap-6">
            <span>Course-Neutral Academic Repository</span>
            <span>Automated Due Date & Overdue Tracking</span>
          </div>
        </div>
      </div>
    </footer>;
};
export {
  Footer
};
