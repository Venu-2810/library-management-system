import { motion } from "motion/react";
import { BookOpen, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
const BookCard = ({
  book,
  onSelect,
  onBorrow,
  canBorrow = true,
  borrowLoading = false
}) => {
  const isAvailable = book.availableCopies > 0;
  return <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.18 }}
    className="group flex flex-col bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all overflow-hidden"
  >
      {
    /* Visual Header with Common Book Icon - Compact Height */
  }
      <div className="relative h-28 w-full bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
        {
    /* Subtle decorative background pattern */
  }
        <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
      backgroundSize: "16px 16px"
    }}
  />

        {
    /* Common Book Icon emblem */
  }
        <div className="relative z-10 w-11 h-11 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center group-hover:scale-105 group-hover:border-slate-300 transition-all duration-200">
          <BookOpen className="w-5 h-5 text-slate-700" strokeWidth={1.75} />
        </div>

        {
    /* Shelf Badge */
  }
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/95 text-slate-700 shadow-xs border border-slate-200/60 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-slate-500" />
            Shelf {book.shelf}
          </span>
        </div>

        {
    /* Category Pill */
  }
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-white shadow-xs">
            {book.category}
          </span>
        </div>
      </div>

      {
    /* Content - Compact Padding & Hierarchy */
  }
      <div className="flex flex-col flex-1 p-3.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-0.5">
          <span className="truncate max-w-[65%]">{book.publisher}</span>
          <span>{book.publicationYear}</span>
        </div>

        <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
          {book.title}
        </h4>

        <p className="text-xs text-slate-600 font-medium mt-0.5 mb-1.5 line-clamp-1">
          by {book.author}
        </p>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 flex-1">
          {book.description}
        </p>

        {
    /* Availability & Actions */
  }
        <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500 text-[11px]">Copies:</span>
            <span className="flex items-center gap-1">
              {isAvailable ? <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {book.availableCopies}/{book.totalCopies} Available
                </span> : <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-medium">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  Checked Out
                </span>}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            <button
    type="button"
    onClick={() => onSelect(book)}
    className="w-full py-1.5 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center focus:outline-none focus:ring-2 focus:ring-slate-300"
  >
              Details
            </button>

            {canBorrow && <button
    type="button"
    disabled={!isAvailable || borrowLoading}
    onClick={() => onBorrow && onBorrow(book)}
    className={`w-full py-1.5 px-2.5 text-xs font-medium rounded-lg transition-all text-center focus:outline-none focus:ring-2 ${isAvailable ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus:ring-slate-400" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
  >
                {borrowLoading ? "Wait..." : isAvailable ? "Borrow" : "Unavailable"}
              </button>}
          </div>
        </div>
      </div>
    </motion.div>;
};
export {
  BookCard
};
