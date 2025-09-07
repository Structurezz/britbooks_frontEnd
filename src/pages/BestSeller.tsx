
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Filter, Brain, Flame, PenTool, ChefHat, Palette, Laugh, Building, Award, Users, Zap, Book as BookIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { fetchBooks, fetchCategories, Book } from "../data/books";
import { useCart } from "../context/cartContext";

// ⭐ Star Rating Component
const StarRating = ({ rating, starSize = 12 }: { rating: number; starSize?: number }) => (
  <div className="flex items-center justify-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={starSize}
        className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
        fill={i < Math.round(rating) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

// 📚 Book Card Skeleton Component
const BookCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200 h-full animate-pulse">
    <div className="relative bg-gray-200 p-2 flex-shrink-0 h-48">
      <div className="absolute top-0 left-0 bg-gray-700 h-6 w-12 rounded-br-lg"></div>
    </div>
    <div className="p-3 flex flex-col flex-grow items-center text-center space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
      <div className="flex justify-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
      <div className="w-full h-6 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// 📚 Book Card Component
interface BookCardProps {
  book: Book;
  rank: number;
}

const BookCard: React.FC<BookCardProps> = React.memo(({ book, rank }) => {
  const { addToCart } = useCart();
  const numericPrice = book.price;
  const isTopTen = rank <= 10;

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      img: book.imageUrl || "https://via.placeholder.com/150",
      title: book.title,
      author: book.author,
      price: `£${numericPrice.toFixed(2)}`,
      quantity: 1,
    });
    toast.success(`${book.title} added to your basket!`);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden transform hover:-translate-y-1 relative border ${
        isTopTen ? "border-yellow-400" : "border-gray-200"
      } h-full`}
    >
      <div className="relative bg-gray-100 p-2 flex-shrink-0">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.imageUrl || "https://via.placeholder.com/150"}
            alt={book.title}
            loading="lazy"
            className="w-full h-48 object-cover mx-auto transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
          />
        </Link>
        <div
          className={`absolute top-0 left-0 text-white font-bold px-3 py-1 text-sm rounded-br-lg ${
            isTopTen ? "bg-yellow-400 text-black" : "bg-gray-700"
          }`}
        >
          #{rank}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${book.id}`}>
            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow items-center text-center">
        <h4 className="font-semibold text-xs text-gray-800 h-10 leading-5 mb-2 line-clamp-2">
          {book.title}
        </h4>
        <p className="text-xs text-gray-500 mb-1">{book.author}</p>
        <p className="text-xs text-gray-500 mb-1">{book.genre}</p>
        <div className="mb-1">
          <StarRating rating={book.rating || 0} />
        </div>
        <p className="text-sm font-bold text-gray-900 mt-auto mb-2">
          £{numericPrice.toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white font-medium py-1 rounded-full hover:bg-red-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={book.stock === 0}
        >
          {book.stock === 0 ? "OUT OF STOCK" : "ADD TO BASKET"}
        </button>
      </div>
    </div>
  );
});

// 🛠️ Category Filter Widget Component
const CategoryFilterWidget: React.FC<{
  categories: { id: string; name: string; imageUrl: string }[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}> = ({ categories, selectedCategory, setSelectedCategory }) => {
  // Map categories to icons
  const categoryIcons: Record<string, React.ComponentType<{ size: number; className: string }>> = {
    Mindfulness: Zap,
    Technology: Zap,
    Psychology: Brain,
    "Self-Help": Users,
    Mystery: BookIcon,
    "Contemporary Fiction": BookIcon,
    Drama: BookIcon,
    Biography: Award,
    Leadership: Users,
    "Asian Literature": BookIcon,
    Entrepreneurship: Flame,
    Poetry: PenTool,
    Humor: Laugh,
    History: Building,
    Cookbooks: ChefHat,
    Art: Palette,
    Comics: BookIcon,
  };

  return (
    <div className="relative flex items-center gap-3 bg-white rounded-xl shadow-sm p-3 border border-gray-100 transition-all duration-300 hover:shadow-md">
      <Filter size={20} className="text-red-500" />
      <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">
        Filter by Category
      </label>
      <select
        id="categoryFilter"
        value={selectedCategory || ""}
        onChange={(e) => setSelectedCategory(e.target.value || null)}
        className="appearance-none bg-gradient-to-r from-red-50 to-red-100 text-gray-800 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-red-200 transition-all duration-300 cursor-pointer pr-10"
      >
        <option value="" className="flex items-center">
          <BookIcon size={16} className="inline mr-2 text-gray-500" />
          All Categories
        </option>
        {categories.map((category) => {
          const Icon = categoryIcons[category.name] || BookIcon;
          return (
            <option key={category.id} value={category.name} className="flex items-center">
              <Icon size={16} className="inline mr-2 text-gray-500" />
              {category.name}
            </option>
          );
        })}
      </select>
      <div className="absolute right-5 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// 🏆 Main Bestsellers Page Component
const BestsellersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(600000); // 600,000 books for 600 pages with 100 per page
  const [categories, setCategories] = useState<{ id: string; name: string; imageUrl: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BOOKS_PER_PAGE = 105; // 100 books per page as requested

  useEffect(() => {
    const fetchBestsellers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { books: fetchedBooks, total } = await fetchBooks({
          page: currentPage,
          limit: BOOKS_PER_PAGE,
          sort: "rating",
          order: "desc",
          filters: selectedCategory ? { genre: selectedCategory } : undefined,
        });
        setBooks(fetchedBooks);
        // Note: Using static totalBooks (600,000) as per request, ignoring API response total
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load bestsellers. Please try again.");
        setIsLoading(false);
        console.error("❌ Failed to fetch bestsellers:", err);
      }
    };
    fetchBestsellers();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        const categoryObjects = fetchedCategories.map((name, index) => ({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          imageUrl: `https://picsum.photos/seed/category-${index}/300/200`,
        }));
        setCategories(categoryObjects);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
        setCategories([]);
      }
    };
    fetchCategoryData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE); // 600 pages
  const paginatedBooks = useMemo(() => books, [books]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const visiblePages = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <div className="bg-gray-50 font-sans min-h-screen text-gray-800">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans min-h-screen text-gray-800">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
        .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .hero-section {
          background-image: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(35, 39, 47, 0.7));
          z-index: 1;
        }
        .hero-section > * {
          position: relative;
          z-index: 2;
        }
        .pagination-button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          color: #374151;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        .pagination-button:hover:not(:disabled) {
          background-color: #f3f4f6;
        }
        .pagination-button.active {
          background-color: #dc2626;
          color: white;
          border-color: #dc2626;
        }
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <TopBar />

      <main>
        {/* Hero Section */}
        <header className="hero-section text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center animate-on-scroll">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Bestsellers</h1>
            <p className="text-base sm:text-xl max-w-3xl mx-auto text-gray-200">
              Celebrating Britain’s Best Reads – Discover the top-selling books loved by the BritBooks community.
            </p>
          </div>
        </header>

        {/* Bestsellers Section */}
        <section className="py-6 sm:py-10 bg-gradient-to-b from-white to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 animate-on-scroll">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Star size={24} className="text-yellow-400" />
                This Week's Top Bestsellers
                {selectedCategory && (
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    in {selectedCategory}
                  </span>
                )}
              </h2>
              <CategoryFilterWidget
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
            <div className="grid grid-cols-7 gap-4">
              {isLoading ? (
                [...Array(BOOKS_PER_PAGE)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))
              ) : paginatedBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-6 col-span-7">
                  No bestsellers available{selectedCategory ? ` in ${selectedCategory}` : ""}.
                </p>
              ) : (
                paginatedBooks.map((book, index) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    rank={(currentPage - 1) * BOOKS_PER_PAGE + index + 1}
                  />
                ))
              )}
            </div>
            {totalBooks > BOOKS_PER_PAGE && (
              <div className="mt-4 sm:mt-8 flex justify-center items-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
                <button
                  onClick={() => handlePageChange(1)}
                  className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">First Page</span>
                  <ChevronLeft size={20} className="rotate-180" />
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-button ${currentPage === page ? "active" : ""}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Last Page</span>
                  <ChevronRight size={20} />
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BestsellersPage;
