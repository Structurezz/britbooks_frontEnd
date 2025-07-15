import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { books } from "../data/books";

// Star Rating Component
const StarRating = ({ rating, starSize = 16 }) => (
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

// Book Card Component
const BookCard = ({ book, rank }) => {
  const numericPrice = typeof book.price === 'string' ? parseFloat(book.price.replace("£", "")) : book.price;
  const isTopTen = rank <= 10;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden transform hover:-translate-y-1 relative border ${isTopTen ? 'border-yellow-400' : 'border-gray-200'} h-full`}>
      <div className="relative bg-gray-100 p-3 flex-shrink-0">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.img}
            alt={book.title}
            className="w-full h-48 object-cover mx-auto transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
          />
        </Link>
        <div className={`absolute top-0 left-0 text-white font-bold px-3 py-1 text-sm rounded-br-lg ${isTopTen ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}>
          #{rank}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${book.id}`}>
            <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-red-700">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow items-center text-center">
        <h4 className="font-semibold text-sm text-gray-800 h-10 leading-5 mb-2 line-clamp-2">{book.title}</h4>
        <p className="text-xs text-gray-500 mb-2">{book.author}</p>
        <div className="mb-2">
          <StarRating rating={book.rating} />
        </div>
        <p className="text-lg font-bold text-gray-900 mt-auto mb-3">£{numericPrice.toFixed(2)}</p>
        <button
          onClick={() => alert(`${book.title} added to your basket!`)}
          className="w-full bg-red-600 text-white font-medium py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

// Main Bestsellers Page Component
const BestsellersPage = () => {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKS_PER_PAGE = 12;

  // Select top 100 books by rating
  const bestsellers = useMemo(() => {
    return [...books]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 100)
      .map(book => ({
        id: book.id,
        img: book.imageUrl,
        title: book.title,
        author: book.author,
        price: book.price,
        rating: book.rating || 0,
      }));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(bestsellers.length / BOOKS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const indexOfLastItem = currentPage * BOOKS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - BOOKS_PER_PAGE;
    return bestsellers.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, bestsellers]);

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

  const handleAddToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    alert(`${book.title} added to your basket!`);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
 
  
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

  return (
    <div className="bg-gray-50 font-sans min-h-screen text-gray-800">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
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
      `}</style>

      <TopBar />

      <main>
        {/* Hero Section */}
        <header className="hero-section text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center animate-on-scroll">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Bestsellers</h1>
            <p className="text-base sm:text-xl max-w-3xl mx-auto text-gray-200">Celebrating Britain’s Best Reads – Discover the top-selling books loved by the BritBooks community.</p>
          </div>
        </header>

        {/* Bestsellers Section */}
        <section className="py-6 sm:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 animate-on-scroll">This Week's Top 100</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedBooks.map((book, index) => (
                <BookCard
                  key={book.id}
                  book={book}
                  rank={(currentPage - 1) * BOOKS_PER_PAGE + index + 1}
                />
              ))}
            </div>

            {/* Pagination */}
            {bestsellers.length > BOOKS_PER_PAGE && (
              <div className="mt-4 sm:mt-8 flex justify-center items-center space-x-3 sm:space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-gray-700 text-sm sm:text-base">
                  Page {currentPage} of {totalPages}
                </span>
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