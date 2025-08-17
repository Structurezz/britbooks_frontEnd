
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { fetchBooks, Book } from "../data/books";
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

const BookCard: React.FC<BookCardProps> = ({ book, rank }) => {
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
        <div className="mb-1">
          <StarRating rating={book.rating || 0} />
        </div>
        <p className="text-sm font-bold text-gray-900 mt-auto mb-2">
          £{numericPrice.toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white font-medium py-1 rounded-full hover:bg-red-700 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

// 📚 Browse by Category Component
const CategoryCard: React.FC<{ category: { id: string; name: string; imageUrl: string } }> = ({ category }) => {
  return (
    <Link to={`/category`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="relative">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
              EXPLORE
            </button>
          </div>
        </div>
        <div className="p-3 text-center">
          <h3 className="font-semibold text-sm text-gray-800">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

// 🏆 Main Bestsellers Page Component
const BestsellersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BOOKS_PER_PAGE = 100;

  // Sample categories (replace with actual data fetching if available)
  const categories = useMemo(
    () => [
      { id: "fiction", name: "Fiction", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4ebf0c?auto=format&fit=crop&w=300&q=80" },
      { id: "non-fiction", name: "Non-Fiction", imageUrl: "https://images.unsplash.com/photo-1589994965851-d2c3c984513a?auto=format&fit=crop&w=300&q=80" },
      { id: "mystery", name: "Mystery & Thriller", imageUrl: "https://images.unsplash.com/photo-1592497971838-4a8e8c759f27?auto=format&fit=crop&w=300&q=80" },
      { id: "sci-fi", name: "Science Fiction", imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80" },
      { id: "romance", name: "Romance", imageUrl: "https://images.unsplash.com/photo-1516972810927-801f7c4553c0?auto=format&fit=crop&w=300&q=80" },
    ],
    []
  );

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
        });
        setBooks(fetchedBooks);
        setTotalBooks(Math.min(total, 100000));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load bestsellers. Please try again.");
        setIsLoading(false);
        console.error("❌ Failed to fetch bestsellers:", err);
      }
    };
    fetchBestsellers();
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classNameList.add("fade-in-up");
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

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
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

  if (isLoading) {
    return (
      <div className="bg-gray-50 font-sans min-h-screen text-gray-800">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(BOOKS_PER_PAGE)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

        {/* Browse by Category Section */}
        <section className="py-6 sm:py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 animate-on-scroll">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-6 sm:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 animate-on-scroll">
              This Week's Top 100,000
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {isLoading ? (
                [...Array(BOOKS_PER_PAGE)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))
              ) : paginatedBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-6 col-span-full">No bestsellers available.</p>
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
