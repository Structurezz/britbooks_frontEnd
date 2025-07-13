"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../components/Topbar';
import Footer from '../components/footer'; // ✅ Footer imported

// --- SVG ICON ---
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// --- MOCK DATA ---
const initialWishlistItems = [
  {
    id: 1,
    title: 'The Stardust Thief',
    author: 'Chelsea Abdullah',
    price: 18.99,
    imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1631541333l/58983556.jpg',
  },
  {
    id: 2,
    title: 'Lessons in Chemistry',
    author: 'Bonnie Garmus',
    price: 15.5,
    imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1634768234l/58065033.jpg',
  },
];

// --- Wishlist Component ---
const Wishlist = ({ wishlistItems, setWishlistItems }) => {
  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12 animate-on-scroll">
          <p className="text-base sm:text-lg text-gray-600">Your wishlist is empty.</p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Add books to your wishlist to keep track of titles you love!
          </p>
          <a
            href="/books"
            className="inline-block mt-4 sm:mt-6 bg-red-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
          >
            Browse Books
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-on-scroll">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex flex-col">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 sm:h-48 object-cover rounded-md mb-3 sm:mb-4"
              />
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg text-gray-800">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">by {item.author}</p>
                <p className="text-base sm:text-lg font-semibold text-red-600 mt-2">£{item.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mt-3 sm:mt-4">
                <button className="bg-gray-800 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base hover:bg-black transition-colors">
                  Add to Cart
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-red-600"
                >
                  <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
const MyWishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <TopBar />

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-16">
        <Wishlist wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} />
      </main>

      <Footer /> {/* ✅ Footer at bottom */}
    </div>
  );
};

export default MyWishlistPage;
