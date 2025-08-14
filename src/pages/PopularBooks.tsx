import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { fetchBooks, Book } from "../data/books";
import { useCart } from "../context/cartContext";

// --- Reusable Components ---

const StarRating = ({ rating, starSize = 16 }) => (
  <div className="flex items-center justify-center">
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

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const numericPrice = book.price;

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
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden transform hover:-translate-y-1">
      <div className="relative">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.imageUrl || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${book.id}`}>
            <button className="bg-white text-gray-900 px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-gray-200">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-2 sm:p-4 flex flex-col flex-grow items-center text-center">
        <h4 className="font-semibold text-xs sm:text-sm text-gray-800 h-10 sm:h-10 leading-5 mb-1 sm:mb-2 line-clamp-2">{book.title}</h4>
        <p className="text-xs text-gray-500 mb-1 sm:mb-2">{book.author}</p>
        <div className="mb-1 sm:mb-2">
          <StarRating rating={book.rating || 0} starSize={12} />
        </div>
        <p className="text-base sm:text-xl font-bold text-gray-900 mt-auto mb-2 sm:mb-3">£{numericPrice.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white font-bold py-1 sm:py-2 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

// --- Lazy-Loaded Book Grid Component ---
const BookGrid = forwardRef(({ genre, books, currentPage, totalBooks, handlePageChange, isLoading }, ref) => {
  const totalPages = Math.min(Math.ceil(totalBooks / BOOKS_PER_PAGE), MAX_PAGES);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".book-card");
      cards.forEach((card) => observer.observe(card));
    }

    return () => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".book-card");
        cards.forEach((card) => observer.unobserve(card));
      }
    };
  }, [books]);

  return (
    <section ref={gridRef} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 fade-in-up">{genre}</h2>
      {isLoading ? (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">Loading {genre} books...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {books.map((book) => (
            <div key={book.id} className="book-card opacity-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <h3 className="text-lg font-semibold">No Books Found in {genre}</h3>
          <p>Try adjusting your search terms.</p>
        </div>
      )}
      {totalBooks > BOOKS_PER_PAGE && (
        <div className="mt-6 flex justify-center items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => handlePageChange(genre, currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 sm:p-3 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-800 font-medium text-sm sm:text-base sm:hidden">
            Page {currentPage} of {totalPages}
          </span>
          <div className="hidden sm:flex sm:space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const page = startPage + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(genre, page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="text-gray-500">...</span>
            )}
          </div>
          <button
            onClick={() => handlePageChange(genre, currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 sm:p-3 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
});

// --- Main Popular Books Page Component ---
const BOOKS_PER_PAGE = 20;
const MAX_PAGES = 503;

const PopularBooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [genres, setGenres] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState({});
  const [totalBooksByGenre, setTotalBooksByGenre] = useState({});
  const [currentPageByCategory, setCurrentPageByCategory] = useState({});
  const [loadingByGenre, setLoadingByGenre] = useState({});
  const [errorByGenre, setErrorByGenre] = useState({});
  const gridRef = useRef({});

  // Fetch genres on initial load
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { books: sampleBooks } = await fetchBooks({ page: 1, limit: 100 });
        const uniqueGenres = Array.from(new Set(sampleBooks.map(book => book.genre).filter(genre => genre))).sort();
        setGenres(uniqueGenres);
        setCurrentPageByCategory(uniqueGenres.reduce((acc, genre) => ({ ...acc, [genre]: 1 }), {}));
        setLoadingByGenre(uniqueGenres.reduce((acc, genre) => ({ ...acc, [genre]: true }), {}));
        setErrorByGenre(uniqueGenres.reduce((acc, genre) => ({ ...acc, [genre]: null }), {}));
      } catch (err) {
        setErrorByGenre({ general: "Failed to load genres. Please try again." });
        console.error("❌ Failed to fetch genres:", err instanceof Error ? err.message : err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch books for each genre independently
  useEffect(() => {
    const fetchBooksForGenre = async (genre) => {
      setLoadingByGenre((prev) => ({ ...prev, [genre]: true }));
      setErrorByGenre((prev) => ({ ...prev, [genre]: null }));
      try {
        const page = currentPageByCategory[genre] || 1;
        const { books, total } = await fetchBooks({
          page,
          limit: BOOKS_PER_PAGE,
          filters: { genre, search: searchTerm || undefined },
          sort: sortBy === "priceLowHigh" ? "price" : sortBy === "priceHighLow" ? "price" : sortBy,
          order: sortBy === "priceHighLow" ? "desc" : sortBy === "title" ? "asc" : "desc",
        });
        setBooksByGenre((prev) => ({ ...prev, [genre]: books }));
        setTotalBooksByGenre((prev) => ({ ...prev, [genre]: Math.min(total, MAX_PAGES * BOOKS_PER_PAGE) }));
        setLoadingByGenre((prev) => ({ ...prev, [genre]: false }));
      } catch (err) {
        setErrorByGenre((prev) => ({ ...prev, [genre]: `Failed to load ${genre} books. Please try again.` }));
        setLoadingByGenre((prev) => ({ ...prev, [genre]: false }));
        console.error(`❌ Failed to fetch books for ${genre}:`, err instanceof Error ? err.message : err);
      }
    };

    genres.forEach((genre) => {
      fetchBooksForGenre(genre);
    });
  }, [genres, currentPageByCategory, searchTerm, sortBy]);

  const handlePageChange = (genre, page) => {
    const totalBooksInGenre = totalBooksByGenre[genre] || 0;
    const totalPages = Math.min(Math.ceil(totalBooksInGenre / BOOKS_PER_PAGE), MAX_PAGES);
    if (page > 0 && page <= totalPages) {
      setCurrentPageByCategory((prev) => ({ ...prev, [genre]: page }));
      if (gridRef.current[genre]) {
        gridRef.current[genre].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (errorByGenre.general) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-8 py-16 text-center">
          <p className="text-red-500 text-lg">{errorByGenre.general}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <TopBar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white text-center py-12 md:py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find Your Next Favorite Book</h1>
          <p className="mt-4 text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Browse our most popular and highly-rated titles, loved by readers like you.
          </p>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search popular books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="rating">Sort by Highest Rating</option>
              <option value="title">Sort by Title</option>
              <option value="priceLowHigh">Sort by Price: Low to High</option>
              <option value="priceHighLow">Sort by Price: High to Low</option>
            </select>
          </div>

          {genres.length > 0 ? (
            genres.map((genre) => (
              <BookGrid
                key={genre}
                genre={genre}
                books={booksByGenre[genre] || []}
                currentPage={currentPageByCategory[genre] || 1}
                totalBooks={totalBooksByGenre[genre] || 0}
                handlePageChange={handlePageChange}
                isLoading={loadingByGenre[genre] || false}
                ref={(el) => (gridRef.current[genre] = el)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-16">
              <h3 className="text-xl font-semibold">No Genres Found</h3>
              <p>Please try again later.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PopularBooksPage;