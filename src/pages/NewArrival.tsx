
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import TopBar from "../components/Topbar";
import { Star, BookOpen, Star as StarIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { fetchBooks, Book } from "../data/books";
import { useCart } from "../context/cartContext";

// --- SVG ICONS ---
const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
  </svg>
);
const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
  </svg>
);
const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.358-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
  </svg>
);

// --- Reusable Components ---

// Star Rating Component
const StarRating = ({ rating, starSize = 16 }: { rating: number; starSize?: number }) => (
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

// Book Card Skeleton Component
const BookCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-md flex flex-col overflow-hidden animate-pulse">
    <div className="relative bg-gray-200 p-2 sm:p-3 flex-shrink-0 h-40 sm:h-48"></div>
    <div className="p-2 sm:p-3 flex flex-col flex-grow items-center space-y-2">
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
      <div className="flex justify-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
        ))}
      </div>
      <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
      <div className="w-full h-6 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

// Book Card Component
const BookCard = ({ book }: { book: Book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      img: book.imageUrl || "https://via.placeholder.com/150",
      title: book.title,
      author: book.author,
      price: `£${book.price.toFixed(2)}`,
      quantity: 1,
    });
    toast.success(`${book.title} added to your basket!`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
      <div className="relative bg-gray-100 p-2 sm:p-3 flex-shrink-0">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.imageUrl || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-full h-40 sm:h-48 object-cover mx-auto transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${book.id}`}>
            <button className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-red-700">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-grow items-center">
        <h4 className="font-semibold text-xs sm:text-sm text-gray-800 h-10 sm:h-12 leading-5 sm:leading-6 mb-1 sm:mb-2 line-clamp-2">{book.title}</h4>
        <p className="text-xs text-gray-500 mb-1 sm:mb-2">{book.author}</p>
        <div className="mb-1 sm:mb-2">
          <StarRating rating={book.rating || 0} starSize={12} />
        </div>
        <p className="text-base sm:text-lg font-bold text-gray-900 mt-auto mb-2 sm:mb-3">£{book.price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white font-medium py-1 sm:py-1.5 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

// --- Why Shop Section Data ---
const whyShopPoints = [
  { title: "Fresh Stories", description: "Discover the latest books hot off the press.", icon: BookOpen },
  { title: "Sustainable Reading", description: "Support eco-friendly practices with pre-loved and new books.", icon: StarIcon },
  { title: "Curated Selection", description: "Handpicked titles to spark your imagination.", icon: StarIcon },
];

// --- Main New Arrivals Page Component ---
const NewArrivalsPage = () => {
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [books, setBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch main books (120 to match original)
        const { books: mainBooks, total } = await fetchBooks({
          page: currentPage,
          limit: itemsPerPage,
          sort: "createdAt",
          order: "desc",
        });
        setBooks(mainBooks);
        setTotalBooks(total);

        // Fetch featured books (top 5 newest)
        const { books: featured } = await fetchBooks({
          page: 1,
          limit: 5,
          sort: "createdAt",
          order: "desc",
        });
        setFeaturedBooks(featured);

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load new arrivals. Please try again.");
        setIsLoading(false);
        console.error("❌ Failed to fetch new arrivals:", err instanceof Error ? err.message : err);
      }
    };
    fetchNewArrivals();
  }, [currentPage, itemsPerPage]);

  // Pagination logic
  const totalPages = Math.ceil(totalBooks / itemsPerPage);
  const currentBooks = useMemo(() => books, [books]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: "smooth" });
      }
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
      <div className="bg-gray-50 min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(12)].map((_, i) => (
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
      <div className="bg-gray-50 min-h-screen">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-8 py-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .header-btn:hover { transform: scale(1.05); }
        .btn-hover-effect:hover { transform: scale(1.05); }
        .hero-section {
          background-image: url('https://media.istockphoto.com/id/1225112385/video/my-first-day-at-work.mp4?s=mp4-640x640-is&k=20&c=m5NHTSwoy92zDTeZ_QM8dSrKSaXV8d69sWwHlX73wvA=');
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
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1); }
      `}</style>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <TopBar />

      <main>
        {/* Hero Section */}
        <header className="hero-section text-white py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center animate-on-scroll">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <StarIcon className="h-8 w-8 text-red-500 animate-bounce" />
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-400">
                New Arrivals
              </h1>
            </div>
            <p className="text-base md:text-lg max-w-xl mx-auto text-gray-200">Explore the newest additions to the BritBooks collection — fresh stories, new adventures, and timeless classics waiting for you.</p>
          </div>
        </header>

        {/* Featured Book Section */}
        <section className="py-8 sm:py-10 bg-white">
          <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 animate-on-scroll">Featured Books</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 animate-on-scroll">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))
              ) : featuredBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-6 col-span-full">No featured books available.</p>
              ) : (
                featuredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <Link to={`/browse/${book.id}`}>
                        <img
                          src={book.imageUrl || "https://via.placeholder.com/150"}
                          alt={book.title}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                      </Link>
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        New
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <Link to={`/browse/${book.id}`}>
                          <button className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-red-700">
                            QUICK VIEW
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className="p-2 sm:p-4 flex flex-col items-center">
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-800 h-10 sm:h-12 leading-5 sm:leading-5 mb-1 text-center line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1 sm:mb-2 text-center">{book.author}</p>
                      <div className="mb-1 sm:mb-2">
                        <StarRating rating={book.rating || 0} starSize={12} />
                      </div>
                      <p className="text-base sm:text-lg font-bold text-gray-900 mb-1">£{book.price.toFixed(2)}</p>
                      <button
                        onClick={() => {
                          addToCart({
                            id: book.id,
                            img: book.imageUrl || "https://via.placeholder.com/150",
                            title: book.title,
                            author: book.author,
                            price: `£${book.price.toFixed(2)}`,
                            quantity: 1,
                          });
                          toast.success(`${book.title} added to your basket!`);
                        }}
                        className="w-full bg-red-600 text-white font-medium py-1 sm:py-2 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        ADD TO BASKET
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Why Shop New Arrivals Section */}
        <section className="py-8 sm:py-10 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center animate-on-scroll mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Why Shop New Arrivals?</h2>
              <p className="mt-1 text-base text-gray-600">Explore the benefits of diving into our latest collection.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {whyShopPoints.map((point, index) => (
                <div key={index} className="animate-on-scroll bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <point.icon className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-800">{point.title}</h3>
                  <p className="mt-1 text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid of New Arrivals */}
        <section className="py-8 sm:py-10 bg-white" ref={gridRef}>
          <div className="container mx-auto px-4 sm:px-8">
            <div className="flex flex-wrap justify-between items-center border-b border-gray-200 py-3 mb-6">
              <div className="flex items-center space-x-3">
                <label htmlFor="sort-by" className="font-medium text-gray-700">Sort By:</label>
                <select
                  id="sort-by"
                  className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks}
              </div>
              <div className="flex items-center space-x-3">
                <label htmlFor="show" className="font-medium text-gray-700">Show:</label>
                <select
                  id="show"
                  className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => {
                    const newItemsPerPage = parseInt(e.target.value);
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                    if (gridRef.current) {
                      gridRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {isLoading ? (
                [...Array(itemsPerPage)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))
              ) : currentBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-6 col-span-full">No new arrivals available.</p>
              ) : (
                currentBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))
              )}
            </div>
            {totalBooks > itemsPerPage && (
              <div className="mt-6 flex justify-center items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors text-sm sm:text-base"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-gray-500 text-sm sm:text-base sm:hidden">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="hidden sm:flex sm:space-x-2">
                  {visiblePages.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${currentPage === page ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-colors`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > visiblePages[visiblePages.length - 1] && (
                    <span className="text-gray-500">...</span>
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors text-sm sm:text-base"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base ml-2"
                >
                  Load More
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

export default NewArrivalsPage;
