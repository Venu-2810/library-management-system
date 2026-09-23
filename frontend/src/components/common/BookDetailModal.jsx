import { Modal } from "./Modal";
import { MapPin, CheckCircle2, AlertCircle, BookOpen, Layers } from "lucide-react";
const BookDetailModal = ({
  book,
  isOpen,
  onClose,
  onBorrow,
  canBorrow = true,
  borrowLoading = false
}) => {
  if (!book) return null;
  const isAvailable = book.availableCopies > 0;
  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={book.title}
    subtitle={`by ${book.author}`}
    maxWidth="max-w-lg"
  >
      <div className="space-y-4">
        {
    /* Banner & Top Metadata */
  }
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-28 h-32 shrink-0 bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-50 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center p-2.5 text-center">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center mb-1.5">
              <BookOpen className="w-5 h-5 text-slate-700" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Volume
            </span>
            <span className="text-[11px] font-mono text-slate-600 mt-0.5 truncate max-w-full">
              {book.shelf}
            </span>
          </div>

          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/70">
                <Layers className="w-3 h-3 text-slate-500" />
                {book.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {book.publicationYear}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 text-xs">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  Shelf {book.shelf}
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">ISBN</span>
                <span className="font-mono text-[11px] font-medium text-slate-800 block mt-0.5 truncate">
                  {book.isbn}
                </span>
              </div>
            </div>

            {
    /* Availability pill */
  }
            <div>
              {isAvailable ? <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{book.availableCopies}/{book.totalCopies}</strong> physical copies on shelf
                  </span>
                </div> : <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Currently Checked Out (0/{book.totalCopies})</span>
                </div>}
            </div>
          </div>
        </div>

        {
    /* Synopsis / Description */
  }
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Synopsis
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
            {book.description}
          </p>
        </div>

        {
    /* Physical circulation operational note */
  }
        <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-[11px] text-slate-600 leading-normal">
          <strong>Circulation Desk:</strong> Present your college registration ID to collect or check out this physical volume.
        </div>

        {
    /* Footer Actions */
  }
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
  >
            Close
          </button>

          {canBorrow && <button
    type="button"
    disabled={!isAvailable || borrowLoading}
    onClick={() => onBorrow && onBorrow(book)}
    className={`px-4 py-2 text-xs font-medium rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 ${isAvailable ? "bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-400" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
  >
              {borrowLoading ? "Processing..." : isAvailable ? "Borrow Volume" : "Unavailable"}
            </button>}
        </div>
      </div>
    </Modal>;
};
export {
  BookDetailModal
};
