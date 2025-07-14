import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight, Search } from "lucide-react";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { books } from "../data/books";

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

// ✅ Modernized Book Card Component
const BookCard = ({ img, title, author, price, rating, id }) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace("£", "")) : price;
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden transform hover:-translate-y-1">
      <div className="relative">
        <Link to={`/browse/${id}`} className="block">
          <img
            src={img}
            alt={title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${id}`}>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-gray-200">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow items-center text-center">
        <h4 className="font-semibold text-sm text-gray-800 h-10 leading-5 mb-1 line-clamp-2">{title}</h4>
        <p className="text-xs text-gray-500 mb-2">{author}</p>
        <div className="mb-2">
          <StarRating rating={rating} />
        </div>
        <p className="text-xl font-bold text-gray-900 mt-auto mb-3">£{numericPrice.toFixed(2)}</p>
        <button
          onClick={() => alert(`${title} added to your basket!`)}
          className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};


// --- Main Popular Books Page Component ---
const PopularBooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // Default sort to rating for "Popular"
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKS_PER_PAGE = 16;

  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "priceLowHigh") return a.price - b.price;
        if (sortBy === "priceHighLow") return b.price - a.price;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return b.rating - a.rating; // Default to rating
      });
  }, [searchTerm, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredAndSortedBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <TopBar />
      <main className="flex-1">
        
        {/* ✅ Modern Hero Section */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white text-center py-12 md:py-16 px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find Your Next Favorite Book</h1>
            <p className="mt-4 text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">Browse our most popular and highly-rated titles, loved by readers like you.</p>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          {/* ✅ Styled Filter/Sort Controls */}
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

          {paginatedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  img={book.imageUrl}
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  rating={book.rating || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <h3 className="text-xl font-semibold">No Books Found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-10 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-800 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PopularBooksPage;