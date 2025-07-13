import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import TopBar from "../components/Topbar";
import { Menu, X, SearchIcon, UserCircleIcon, ShoppingCartIcon } from "lucide-react";

// --- SVG ICONS ---
const StarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// --- MOCK DATA (Expanded to 100 books) ---
const baseBestsellers = [
  { id: 1, rank: 1, title: "The Lincoln Highway", author: "Amor Towles", price: 18.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1618525433l/57109339.jpg", rating: 4.2 },
  { id: 2, rank: 2, title: "Cloud Cuckoo Land", author: "Anthony Doerr", price: 15.50, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1618224971l/56783258.jpg", rating: 4.5 },
  { id: 3, rank: 3, title: "The Maid", author: "Nita Prose", price: 22.00, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1629302247l/55196813.jpg", rating: 4.3 },
  { id: 4, rank: 4, title: "Sea of Tranquility", author: "Emily St. John Mandel", price: 24.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1631633539l/58011116.jpg", rating: 4.6 },
  { id: 5, rank: 5, title: "The Paris Apartment", author: "Lucy Foley", price: 14.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1635529452l/58468993.jpg", rating: 4.4 },
];

// Generate 100 books by duplicating and modifying base data
const generateBestsellers = () => {
  const books = [];
  for (let i = 0; i < 20; i++) {
    baseBestsellers.forEach((book, index) => {
      books.push({
        id: i * 5 + index + 1,
        rank: i * 5 + index + 1,
        title: `${book.title} ${i + 1}`,
        author: book.author,
        price: book.price + (i * 0.5),
        imageUrl: book.imageUrl,
        rating: book.rating + (i * 0.1 % 1),
      });
    });
  }
  return books.slice(0, 100); // Ensure exactly 100 books
};

const bestsellers = generateBestsellers();

// --- Main Bestsellers Page Component ---
const BestsellersPage = () => {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjustable items per page

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = useMemo(() => bestsellers.slice(indexOfFirstItem, indexOfLastItem), [currentPage, bestsellers]);
  const totalPages = Math.ceil(bestsellers.length / itemsPerPage);

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
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1); }
      `}</style>

      <TopBar />

      <main>
        {/* Hero Section */}
        <header className="hero-section text-white py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center animate-on-scroll">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Bestsellers</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">Celebrating Britain’s Best Reads – Discover the top-selling books loved by the BritBooks community.</p>
          </div>
        </header>

        {/* Bestsellers Section */}
        <section className="py-8 sm:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 animate-on-scroll">This Week's Top 100</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden"
                >
                  <div className="relative bg-gray-100 p-2 flex-shrink-0">
                    <Link to={`/browse/${book.id}`} className="block">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-40 object-cover mx-auto transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <Link to={`/browse/${book.id}`}>
                        <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300 hover:bg-red-700">
                          QUICK VIEW
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-2 flex flex-col flex-grow items-center">
                    <h3 className="font-semibold text-base text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">by {book.author}</p>
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={i < Math.round(book.rating) ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-1">£{book.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="w-full bg-red-600 text-white font-medium py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Add to Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {bestsellers.length > itemsPerPage && (
              <div className="mt-4 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-colors`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > visiblePages[visiblePages.length - 1] && (
                  <span className="text-gray-500">...</span>
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                  disabled={currentPage === totalPages}
                >
                  Next
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