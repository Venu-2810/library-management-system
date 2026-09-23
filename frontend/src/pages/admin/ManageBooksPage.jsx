import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MapPin,
  AlertCircle
} from "lucide-react";
import { PageTransition } from "../../components/common/PageTransition";
import { Modal } from "../../components/common/Modal";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";
const ManageBooksPage = () => {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    publicationYear: (/* @__PURE__ */ new Date()).getFullYear(),
    isbn: "",
    category: "Computer Science & IT",
    totalCopies: 5,
    shelf: "A1-01",
    description: ""
  });
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks({
        search: search.trim() || void 0,
        category: selectedCategory || void 0
      });
      setBooks(res.books);
      setCategories(res.categories);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch catalog books";
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
  }, [search, selectedCategory]);
  const handleOpenAdd = () => {
    setFormData({
      title: "",
      author: "",
      publisher: "",
      publicationYear: (/* @__PURE__ */ new Date()).getFullYear(),
      isbn: `978-${Math.floor(1e9 + Math.random() * 9e9)}`,
      category: categories[0] || "Computer Science & IT",
      totalCopies: 5,
      shelf: "A1-01",
      description: ""
    });
    setIsAddModalOpen(true);
  };
  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher || "",
      publicationYear: book.publicationYear || (/* @__PURE__ */ new Date()).getFullYear(),
      isbn: book.isbn,
      category: book.category,
      totalCopies: book.totalCopies,
      shelf: book.shelf,
      description: book.description || ""
    });
  };
  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn) {
      toast.error("Title, author, and ISBN are required.");
      return;
    }
    try {
      setSubmitting(true);
      if (editingBook) {
        const res = await api.updateBook(editingBook._id, {
          ...formData,
          totalCopies: Number(formData.totalCopies),
          publicationYear: Number(formData.publicationYear)
        });
        toast.success("Book record updated successfully!");
        setEditingBook(null);
      } else {
        const res = await api.addBook({
          ...formData,
          totalCopies: Number(formData.totalCopies),
          availableCopies: Number(formData.totalCopies),
          publicationYear: Number(formData.publicationYear)
        });
        toast.success("New book title added to catalog!");
        setIsAddModalOpen(false);
      }
      fetchBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error saving book";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    try {
      setSubmitting(true);
      await api.deleteBook(deletingBook._id);
      toast.success(`"${deletingBook.title}" removed from catalog.`);
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error deleting book";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  const defaultCategoryList = [
    "Computer Science & IT",
    "Electronics & Electrical Engineering",
    "Mechanical Engineering",
    "Civil & Environmental Engineering",
    "Business & Management Studies",
    "Physics & Applied Sciences",
    "Chemistry & Materials Science",
    "English Language & Literature",
    "Economics & Social Sciences"
  ];
  const availableCategories = Array.from(/* @__PURE__ */ new Set([...categories, ...defaultCategoryList]));
  return <PageTransition>
      <div className="space-y-6">
        {
    /* Header Bar */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Manage Book Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new inventory, edit call numbers, reassign shelf stacks, or adjust physical copies.
            </p>
          </div>

          <button
    type="button"
    onClick={handleOpenAdd}
    className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
  >
            <Plus className="w-4 h-4" />
            Add New Book Title
          </button>
        </div>

        {
    /* Filters and Search */
  }
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by title, author, or ISBN..."
    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
  />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
              <option value="">All Academic Disciplines</option>
              {availableCategories.map((c) => <option key={c} value={c}>
                  {c}
                </option>)}
            </select>
          </div>
        </div>

        {
    /* Books Table */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Title & Author</th>
                  <th className="py-3 px-4">Academic Category</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Shelf Stacks</th>
                  <th className="py-3 px-4 text-center">Available / Total</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading catalog records...
                    </td>
                  </tr> : books.length === 0 ? <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No books found matching criteria.
                    </td>
                  </tr> : books.map((book) => {
    const isLowStock = book.availableCopies === 0;
    return <tr key={book._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5 max-w-xs">
                            <span className="font-bold text-slate-900 block truncate">
                              {book.title}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate">
                              by {book.author} · {book.publicationYear}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                            {book.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {book.isbn}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-800">{book.shelf}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
      className={`font-bold text-sm ${isLowStock ? "text-rose-600" : "text-emerald-700"}`}
    >
                            {book.availableCopies}
                          </span>
                          <span className="text-slate-400 font-medium"> / {book.totalCopies}</span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
      type="button"
      onClick={() => handleOpenEdit(book)}
      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
      title="Edit book details"
    >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
      type="button"
      onClick={() => setDeletingBook(book)}
      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
      title="Delete book"
    >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>

        {
    /* ADD / EDIT BOOK MODAL */
  }
        <Modal
    isOpen={isAddModalOpen || editingBook !== null}
    onClose={() => {
      setIsAddModalOpen(false);
      setEditingBook(null);
    }}
    title={editingBook ? "Edit Book Record" : "Add New Book to Collection"}
    maxWidth="max-w-xl"
  >
          <form onSubmit={handleSaveBook} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Book Title *</label>
              <input
    type="text"
    required
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    placeholder="e.g. Operating Systems: Three Easy Pieces"
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Author *</label>
                <input
    type="text"
    required
    value={formData.author}
    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
    placeholder="e.g. Remzi Arpaci-Dusseau"
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Publisher</label>
                <input
    type="text"
    value={formData.publisher}
    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
    placeholder="e.g. MIT Press"
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Publication Year</label>
                <input
    type="number"
    value={formData.publicationYear}
    onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Total Copies *</label>
                <input
    type="number"
    min={1}
    required
    value={formData.totalCopies}
    onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700">Shelf Stack *</label>
                <input
    type="text"
    required
    value={formData.shelf}
    onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
    placeholder="e.g. A3-14"
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">ISBN *</label>
                <input
    type="text"
    required
    value={formData.isbn}
    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
    placeholder="e.g. 978-0131103627"
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Academic Category *</label>
                <select
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
                  {availableCategories.map((c) => <option key={c} value={c}>
                      {c}
                    </option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Description / Synopsis</label>
              <textarea
    rows={3}
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    placeholder="Brief summary of syllabus coverage and academic focus..."
    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
    type="button"
    onClick={() => {
      setIsAddModalOpen(false);
      setEditingBook(null);
    }}
    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
  >
                Cancel
              </button>
              <button
    type="submit"
    disabled={submitting}
    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
  >
                {submitting ? "Saving..." : editingBook ? "Update Record" : "Add to Collection"}
              </button>
            </div>
          </form>
        </Modal>

        {
    /* DELETE CONFIRMATION MODAL */
  }
        <Modal
    isOpen={deletingBook !== null}
    onClose={() => setDeletingBook(null)}
    title="Confirm Book Removal"
    maxWidth="max-w-md"
  >
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 leading-relaxed">
                Are you sure you want to remove <strong>{deletingBook?.title}</strong> (ISBN: {deletingBook?.isbn}) from the central college catalog? Active loans must be closed first.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
    type="button"
    onClick={() => setDeletingBook(null)}
    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
  >
                Cancel
              </button>
              <button
    type="button"
    disabled={submitting}
    onClick={handleDeleteBook}
    className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
  >
                {submitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>;
};
export {
  ManageBooksPage
};
