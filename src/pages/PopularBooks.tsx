import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import { books } from "../data/books"; // ✅ Using the 1 million book data source

// --- (BookCard and StarRating components remain the same) ---
const BookCard = ({ img, title, author, price, rating, id }) => {
  // Ensure price is a number before using toFixed
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace("£", "")) : price;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
      <div className="relative bg-gray-100 p-3 flex-shrink-0">
        <Link to={`/browse/${id}`} className="block">
          <img
            src={img}
            alt={title}
            className="w-full h-48 object-cover mx-auto transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${id}`}>
            <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-red-700">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow items-center text-center">
        <h4 className="font-semibold text-sm text-gray-800 h-10 leading-5 mb-2 line-clamp-2">{title}</h4>
        <p className="text-xs text-gray-500 mb-2">{author}</p>
        <div className="mb-2">
          <StarRating rating={rating} />
        </div>
        <p className="text-lg font-bold text-gray-900 mt-auto mb-3">£{numericPrice.toFixed(2)}</p>
        <button
          onClick={() => alert(`${title} added to your basket!`)}
          className="w-full bg-red-600 text-white font-medium py-1.5 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

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


// --- Main Popular Books Page Component ---
const PopularBooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  
  // ✅ State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKS_PER_PAGE = 24;

  // ✅ Memoize the expensive filtering and sorting operations
  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.title.localeCompare(b.title);
      });
  }, [searchTerm, sortBy]);

  // ✅ Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // ✅ Calculate total pages and the books for the current page
  const totalPages = Math.ceil(filteredAndSortedBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredAndSortedBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Popular Books</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          {paginatedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* ✅ Render only the paginated books */}
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
            <p className="text-center text-gray-500 py-6">No books found.</p>
          )}

          {/* ✅ Pagination Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-md disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md disabled:opacity-50"
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