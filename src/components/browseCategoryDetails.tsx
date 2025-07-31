"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../components/Topbar";
import Footer from "../components/footer";
import {
  Heart,
  Facebook,
  Twitter,
  Instagram,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { books } from "../data/books";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../context/cartContext";

// --- SVG ICONS ---
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#d1d5db"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Book Card Component
const BookCard = ({ id, img, title, author, price }) => {
  const { addToCart } = useCart();
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace("£", "")) : price;

  const handleAddToCart = () => {
    addToCart({
      id,
      imageUrl: img,
      title,
      author,
      price: `£${numericPrice.toFixed(2)}`,
      quantity: 1,
    });
    toast.success(`${title} added to your basket!`);
  };

  return (
    <div className="group relative flex-shrink-0 w-[180px] text-left p-2">
      <div className="relative">
        <a href={`/browse/${id}`}>
          <img
            src={img}
            alt={title}
            className="w-full h-48 object-cover mb-2 rounded-md transition-transform duration-300 group-hover:scale-105"
          />
        </a>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <a href={`/browse/${id}`}>
            <button className="bg-white text-gray-900 px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-gray-200">
              QUICK VIEW
            </button>
          </a>
        </div>
      </div>
      <div className="p-2 flex flex-col items-start">
        <h3 className="font-semibold text-sm truncate mt-1">{title}</h3>
        <p className="text-gray-500 text-xs mb-1">{author}</p>
        <div className="flex items-center text-gray-300 mb-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={i < Math.round(4) ? "text-yellow-400" : "text-gray-300"}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <p className="text-lg font-bold text-gray-900">£{numericPrice.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="bg-red-600 text-white font-medium px-3 py-1 rounded-md text-xs w-full transition-colors hover:bg-red-700 mt-2"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

// BookShelf Component with Pagination
const BookShelf = ({ title, books }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const maxPages = 20;

  const totalPages = Math.min(Math.ceil(books.length / booksPerPage), maxPages);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = books.slice(startIndex, startIndex + booksPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <section className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-800">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {paginatedBooks.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            img={book.imageUrl}
            title={book.title}
            author={book.author}
            price={book.price}
          />
        ))}
      </div>
    </section>
  );
};

// --- Main Component ---
const BrowseCategoryDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const book = books.find((b) => b.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  if (!book) {
    return <div className="p-6 text-center text-gray-500">Book not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      imageUrl: book.imageUrl,
      title: book.title,
      author: book.author,
      price: `£${book.price.toFixed(2)}`,
      quantity: quantity,
    });
    toast.success(`${quantity} x ${book.title} added to your basket!`);
  };

  // This logic now uses the imported books from book.tsx
  const relatedProducts = books
    .filter((b) => b.genre === book.genre && b.id !== book.id)
    .slice(0, 10); // Increased slice to 10 for better pagination

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <TopBar />
      <main className="container mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-80 object-contain rounded-lg shadow-sm"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

            <div className="flex items-center mb-3 text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <a
                href="#reviews"
                className="ml-2 text-gray-500 hover:text-red-600 underline"
              >
                {book.reviews || 5} Reviews
              </a>
              <a
                href="#add-review"
                className="ml-2 text-gray-500 hover:text-red-600 underline"
              >
                Add Your Review
              </a>
            </div>

            <p className="text-xl font-bold text-gray-900 mb-3">
              £{book.price.toFixed(2)}
            </p>

            <div className="text-sm mb-3">
              <span className="text-green-600 font-semibold">IN STOCK</span>
              <span className="text-gray-500 ml-2">SKU: {book.sku || `BBW0${book.id}`}</span>
            </div>

            {book.description ? (
              <p className="text-gray-600 leading-relaxed mb-3">
                {book.description.substring(0, 150)}...
              </p>
            ) : (
              <p className="text-gray-400 italic mb-3">
                No description available for this book.
              </p>
            )}

            <div className="mb-3">
              <span className="font-semibold">Condition: </span>
              <span className="text-gray-700">{book.condition}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center">
                <span className="mr-2 font-semibold text-gray-700">Qty:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 py-1 text-base hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-10 text-center border-l border-r focus:outline-none py-1"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2 py-1 text-base hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-red-600 text-white font-bold px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <ShoppingCart size={16} />
                ADD TO BASKET
              </button>
            </div>

            <div className="flex items-center gap-6 mb-3">
              <button className="flex items-center text-gray-600 hover:text-red-600">
                <Heart size={18} className="mr-1" /> Add to Wish List
              </button>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold mr-2">Share</span>
                <div className="flex gap-2">
                  <a href="#" className="p-1 rounded-full border hover:bg-gray-100">
                    <Facebook size={14} />
                  </a>
                  <a href="#" className="p-1 rounded-full border hover:bg-gray-100">
                    <Twitter size={14} />
                  </a>
                  <a href="#" className="p-1 rounded-full border hover:bg-gray-100">
                    <Instagram size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border rounded-md">
          <div className="border-b bg-gray-50 rounded-t-md">
            <nav className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  activeTab === "details" ? "bg-white shadow" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  activeTab === "info" ? "bg-white shadow" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Additional Information
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  activeTab === "reviews" ? "bg-white shadow" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Reviews ({book.reviews || 5})
              </button>
            </nav>
          </div>
          <div className="p-4 text-gray-600 leading-relaxed">
            {activeTab === "details" && <p>{book.description}</p>}
            {activeTab === "info" && (
              <p>Additional information such as dimensions, weight, publisher, etc., would be displayed here.</p>
            )}
            {activeTab === "reviews" && <p>Customer reviews would be listed here.</p>}
          </div>
        </div>

        <BookShelf title="You may also like" books={relatedProducts} />
        <BookShelf title="Related Products" books={[...relatedProducts].reverse()} />
      </main>
      <Footer />
    </div>
  );
};

export default BrowseCategoryDetail;