import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, BookOpen, RotateCcw } from "lucide-react";
import { PageTransition } from "../components/common/PageTransition";
import { BookCard } from "../components/common/BookCard";
import { BookDetailModal } from "../components/common/BookDetailModal";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
const BooksPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("ALL");
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowingBookId, setBorrowingBookId] = useState(null);
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks({
        search: searchQuery,
        category: selectedCategory,
        availability: selectedAvailability !== "all" ? selectedAvailability : void 0,
        author: selectedAuthor
      });
      setBooks(res.books);
      if (res.categories) setCategories(res.categories);
      if (res.authors) setAuthors(res.authors);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch catalog";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedAvailability, selectedAuthor]);
  const handleBorrow = async (book) => {
    if (!user) {
      toast.info("Please log in with your college registration number to borrow physical books.");
      navigate("/login");
      return;
    }
    if (book.availableCopies <= 0) {
      toast.error("Book is currently unavailable. All copies are checked out.");
      return;
    }
    try {
      setBorrowingBookId(book._id);
      const res = await api.borrowBook(book._id);
      toast.success(res.message || "Book issued successfully! Added to your My Books.");
      setBooks(
        (prev) => prev.map(
          (b) => b._id === book._id ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b
        )
      );
      if (selectedBook && selectedBook._id === book._id) {
        setSelectedBook(
          (prev) => prev ? { ...prev, availableCopies: Math.max(0, prev.availableCopies - 1) } : null
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to complete borrow transaction";
      toast.error(msg);
    } finally {
      setBorrowingBookId(null);
    }
  };
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedAvailability("all");
    setSelectedAuthor("ALL");
  };
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "ALL" || selectedAvailability !== "all" || selectedAuthor !== "ALL";
  return <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {
    /* Header Title */
  }
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Central Repository
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {books.length} {books.length === 1 ? "Volume" : "Volumes"}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              Library Catalog & Stacks
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search physical volumes by title, author, ISBN, publisher, or shelf location.
            </p>
          </div>

          {user?.role === "student" && <button
    type="button"
    onClick={() => navigate("/my-books")}
    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors self-start md:self-auto border border-indigo-200"
  >
              <BookOpen className="w-4 h-4" />
              View My Borrowed Books
            </button>}
        </div>

        {
    /* Search & Filter Controls */
  }
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          {
    /* Main Search Input */
  }
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search across title, author, ISBN (e.g. 9780735211292), publisher, or category..."
    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
  />
            {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
  >
                Clear
              </button>}
          </div>

          {
    /* Filter Dropdowns Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
            {
    /* Category Filter */
  }
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
  >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => <option key={cat} value={cat}>
                    {cat}
                  </option>)}
              </select>
            </div>

            {
    /* Availability Filter */
  }
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Availability
              </label>
              <select
    value={selectedAvailability}
    onChange={(e) => setSelectedAvailability(e.target.value)}
    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
  >
                <option value="all">All Statuses</option>
                <option value="available">Available on Shelf Now</option>
                <option value="unavailable">In Circulation (Checked Out)</option>
              </select>
            </div>

            {
    /* Author Filter */
  }
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Author
              </label>
              <select
    value={selectedAuthor}
    onChange={(e) => setSelectedAuthor(e.target.value)}
    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
  >
                <option value="ALL">All Authors</option>
                {authors.map((auth) => <option key={auth} value={auth}>
                    {auth}
                  </option>)}
              </select>
            </div>

            {
    /* Reset Actions */
  }
            <div className="flex items-end">
              {hasActiveFilters && <button
    type="button"
    onClick={handleResetFilters}
    className="w-full py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
  >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>}
            </div>
          </div>
        </div>

        {
    /* Books Results Grid */
  }
        {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <div
    key={n}
    className="h-64 bg-white rounded-xl border border-slate-200/80 p-3.5 space-y-3 animate-pulse"
  >
                <div className="h-28 bg-slate-100 rounded-lg" />
                <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded" />
              </div>)}
          </div> : books.length === 0 ? (
    /* Empty State */
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No books found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No physical catalog volumes matched your query. Try broadening your keywords or clearing active filters.
            </p>
            {hasActiveFilters && <button
      type="button"
      onClick={handleResetFilters}
      className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
    >
                Clear all filters
              </button>}
          </div>
  ) : <motion.div
    layout
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
            {books.map((b) => <BookCard
    key={b._id}
    book={b}
    onSelect={setSelectedBook}
    onBorrow={handleBorrow}
    canBorrow={user ? user.role === "student" : true}
    borrowLoading={borrowingBookId === b._id}
  />)}
          </motion.div>}
      </div>

      <BookDetailModal
    book={selectedBook}
    isOpen={!!selectedBook}
    onClose={() => setSelectedBook(null)}
    onBorrow={handleBorrow}
    canBorrow={user ? user.role === "student" : true}
    borrowLoading={borrowingBookId === selectedBook?._id}
  />
    </PageTransition>;
};
export {
  BooksPage
};
