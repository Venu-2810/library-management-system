import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  BookOpen,
  Search,
  CalendarClock,
  Bell,
  ShieldCheck,
  Library,
  ArrowRight
} from "lucide-react";
import { PageTransition } from "../components/common/PageTransition";
import { api } from "../services/api";
import { BookCard } from "../components/common/BookCard";
import { BookDetailModal } from "../components/common/BookDetailModal";
import { useAuth } from "../context/AuthContext";
const HomePage = () => {
  const { user } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    api.getBooks().then((res) => {
      if (isMounted) {
        setFeaturedBooks(res.books.slice(0, 4));
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const features = [
    {
      icon: Search,
      title: "Easy Book Discovery",
      desc: "Search by title, author, ISBN, publisher, or category to find exactly what you need."
    },
    {
      icon: BookOpen,
      title: "Simple Borrowing",
      desc: "Request books in seconds and let library staff handle the physical issue seamlessly."
    },
    {
      icon: CalendarClock,
      title: "Due-Date Tracking",
      desc: "Always know when your books are due with clear issue and return date tracking."
    },
    {
      icon: Bell,
      title: "Notifications",
      desc: "Stay informed about new arrivals, due dates, overdue alerts, and return confirmations."
    },
    {
      icon: ShieldCheck,
      title: "Secure Student Access",
      desc: "Your college registration number is your key \u2014 no extra personal data required."
    },
    {
      icon: Library,
      title: "Organized Collection",
      desc: "A well-cataloged library with shelf locations and real-time availability for every title."
    }
  ];
  return <PageTransition>
      <div>
        {
    /* HERO SECTION */
  }
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          {
    /* Subtle grid pattern */
  }
          <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none"
    style={{
      backgroundImage: "radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)",
      backgroundSize: "40px 40px"
    }}
  />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="text-center max-w-3xl mx-auto">
              {
    /* Pill badge */
  }
              <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-6"
  >
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>College Library Management System</span>
              </motion.div>

              {
    /* Title */
  }
              <motion.h1
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.05 }}
    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]"
  >
                Your College Library,
                <br />
                <span className="text-slate-500">Connected.</span>
              </motion.h1>

              {
    /* Description */
  }
              <motion.p
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.12 }}
    className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
  >
                Discover books, manage borrowing, and stay updated with your college library — all in one clean, modern platform built for every student.
              </motion.p>

              {
    /* Action Buttons */
  }
              <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.18 }}
    className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
  >
                <Link
    to="/books"
    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all hover:shadow-lg w-full sm:w-auto justify-center"
  >
                  Explore Library
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {user ? <Link
    to={user.role === "student" ? "/dashboard" : "/admin"}
    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-medium border border-slate-200 hover:bg-slate-50 transition-all w-full sm:w-auto justify-center"
  >
                    Go to Dashboard
                  </Link> : <Link
    to="/login"
    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-medium border border-slate-200 hover:bg-slate-50 transition-all w-full sm:w-auto justify-center"
  >
                    Sign In
                  </Link>}
              </motion.div>
            </div>

            {
    /* Hero Image Card */
  }
            <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.3 }}
    className="mt-16 relative max-w-4xl mx-auto"
  >
              <div className="rounded-3xl border border-slate-100 bg-white shadow-xl overflow-hidden">
                <img
    src="https://media.base44.com/images/public/6ab1f16c42f412f4e0cdffca/47231cf6f_generated_image.png"
    alt="College library interior with warm natural lighting and wooden bookshelves"
    referrerPolicy="no-referrer"
    className="w-full h-[280px] sm:h-[360px] object-cover"
  />
              </div>
            </motion.div>
          </div>
        </section>

        {
    /* WHY USE THE LIBRARY SYSTEM SECTION */
  }
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
    className="text-center max-w-2xl mx-auto mb-14"
  >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Why use the library system?
              </h2>
              <p className="mt-4 text-slate-600">
                Everything you need to make the most of your college library, in one place.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feat, idx) => {
    const Icon = feat.icon;
    return <motion.div
      key={feat.title}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: idx * 0.06 }}
      className="bg-slate-50/60 rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
    >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="w-6 h-6 text-slate-700" strokeWidth={1.6} />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </motion.div>;
  })}
            </div>
          </div>
        </section>

        {
    /* FEATURED BOOKS SECTION */
  }
        <section className="py-20 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Featured in the Library
                </h2>
                <p className="mt-2 text-slate-600 text-sm">
                  Browse physical volumes across multiple disciplines available at the central stacks.
                </p>
              </div>
              <Link
    to="/books"
    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors"
  >
                View full catalog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => <div key={n} className="h-64 bg-white rounded-xl border border-slate-100 animate-pulse" />)}
              </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredBooks.map((b) => <BookCard
    key={b._id}
    book={b}
    onSelect={setSelectedBook}
    canBorrow={false}
  />)}
              </div>}
          </div>
        </section>

        {
    /* READY TO EXPLORE CALL TO ACTION */
  }
        <section className="py-20 bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
  >
              Ready to explore your library?
            </motion.h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Register with your college registration number and start borrowing today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
    to="/register"
    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all shadow-sm"
  >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
    to="/books"
    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 text-white font-medium hover:bg-slate-800 transition-all"
  >
                Browse Books
              </Link>
            </div>
          </div>
        </section>
      </div>

      <BookDetailModal
    book={selectedBook}
    isOpen={!!selectedBook}
    onClose={() => setSelectedBook(null)}
    canBorrow={false}
  />
    </PageTransition>;
};
export {
  HomePage
};
