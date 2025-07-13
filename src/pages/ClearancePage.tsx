import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from "lucide-react";
import TopBar from '../components/Topbar';
import Footer from '../components/footer';

// Book Card Component (reused with discount indicator)
const BookCard = ({ img, title, author, price, originalPrice, rating }) => (
  <div className="w-full max-w-xs text-center border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-lg">
    <img src={img} alt={title} className="w-full h-60 object-cover mb-3 rounded" />
    <h3 className="font-semibold text-sm truncate">{title}</h3>
    <p className="text-gray-500 text-xs mb-2">{author}</p>
    <div className="flex items-center justify-center text-yellow-400 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill={i < rating ? "currentColor" : "none"} />
      ))}
    </div>
    <div className="mb-3">
      <p className="text-blue-600 font-bold">{price}</p>
      <p className="text-gray-400 line-through text-xs">{originalPrice}</p>
    </div>
    <button className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-500 text-xs w-full transition-colors">
      ADD TO BASKET
    </button>
  </div>
);

// Main Clearance Page Component
const ClearancePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount');

  useEffect(() => {
    // Mock data (replace with API call in a real app)
    const mockBooks = [
      { img: 'https://placehold.co/192x240/FFFF00/000000?text=The+Hunting+Party', title: 'The Hunting Party', author: 'Lucy Foley', price: '£7.20', originalPrice: '£12.00', rating: 4 },
      { img: 'https://placehold.co/192x240/000000/FFFFFF?text=The+Girl+of+Ink', title: 'The Girl of Ink & Stars', author: 'Kiran Millwood Hargrave', price: '£5.99', originalPrice: '£9.99', rating: 5 },
      { img: 'https://placehold.co/192x240/FFA500/000000?text=The+Beast', title: 'The Beast of Buckingham Palace', author: 'David Walliams', price: '£6.90', originalPrice: '£11.50', rating: 4 },
      { img: 'https://placehold.co/192x240/800080/FFFFFF?text=Another+Book', title: 'Another Great Book', author: 'Jane Doe', price: '£8.99', originalPrice: '£14.99', rating: 3 },
      { img: 'https://placehold.co/192x240/FF4500/FFFFFF?text=Childrens+Story', title: 'The Magical Tree', author: 'A. A. Author', price: '£4.19', originalPrice: '£6.99', rating: 4 },
    ];
    setBooks(mockBooks);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const filteredBooks = books
    .filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const getDiscount = (book) => 1 - (parseFloat(book.price.replace('£', '')) / parseFloat(book.originalPrice.replace('£', '')));
      if (sortBy === 'price') return parseFloat(a.price.replace('£', '')) - parseFloat(b.price.replace('£', ''));
      if (sortBy === 'rating') return b.rating - a.rating;
      return getDiscount(b) - getDiscount(a); // Sort by discount percentage
    });

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-6">Clearance Books</h1>
          <p className="text-gray-600 mb-6">Grab these limited-time deals before they're gone!</p>
          
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="w-full sm:w-1/4">
              <select
                value={sortBy}
                onChange={handleSort}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="discount">Sort by Discount</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book, index) => (
                <BookCard key={index} {...book} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No clearance books found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClearancePage;