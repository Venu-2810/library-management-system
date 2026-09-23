import { Link } from "react-router-dom";
import { PageTransition } from "../components/common/PageTransition";
import { BookX, ArrowLeft } from "lucide-react";
const NotFoundPage = () => {
  return <PageTransition>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
          <BookX className="w-8 h-8 text-indigo-600" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
          Catalog Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Page or Shelf Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
          The requested library section or link does not exist in the institutional directory.
        </p>
        <Link
    to="/"
    className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
  >
          <ArrowLeft className="w-4 h-4" />
          Return to Library Home
        </Link>
      </div>
    </PageTransition>;
};
export {
  NotFoundPage
};
