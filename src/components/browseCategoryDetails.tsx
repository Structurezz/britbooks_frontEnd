"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { books } from '../data/books';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

// StarIcon from CategoryBrowsePage.tsx
const StarIcon = ({ filled, half }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled || half ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-5 h-5 ${filled ? 'text-yellow-400' : half ? 'text-yellow-400' : 'text-gray-300'}`}
  >
    {half ? (
      <defs>
        <linearGradient id={`half-star-${Math.random()}`}>
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    ) : null}
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill={half ? `url(#half-star-${Math.random()})` : undefined}
    />
  </svg>
);

const BrowseCategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const book = books.find(book => book.id === Number(id));
  const [activeLink, setActiveLink] = useState('browse');

  useEffect(() => {
    console.log('ID from useParams:', id);
    console.log('Found book:', book);
  }, [id, book]);

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

  if (!book) {
    console.error('Book not found for ID:', id);
    return (
      <>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        `}</style>
        <div className="flex h-screen bg-gray-100 font-sans">
          <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
          <div className="flex-1 flex flex-col lg:ml-64">
            <Topbar />
            <div className="flex-1 p-8 flex items-center justify-center">
              <p className="text-gray-500 text-lg font-semibold">Book not found.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const fullStars = Math.floor(book.rating);
  const hasHalfStar = book.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const reviews = [
    { id: 1, author: 'Emma S.', rating: 5, comment: 'A brilliant read! Couldn’t put it down.', date: '15/06/2025' },
    { id: 2, author: 'James T.', rating: 4, comment: 'Really enjoyed the story, though the ending was unexpected.', date: '10/06/2025' },
  ];

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      imageUrl: book.imageUrl,
    }));
    alert(`${book.title} added to cart!`);
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Topbar />
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto animate-on-scroll">
              <button
                onClick={() => navigate('/category')}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back to Browse
              </button>
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-1/3">
                    <img
                      src={book.imageUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-96 object-cover rounded-lg shadow-md"
                      onError={() => console.error('Image failed to load:', book.imageUrl)}
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">{book.title}</h1>
                    <p className="text-lg text-gray-600 mb-3">by {book.author}</p>
                    <div className="flex items-center mb-3">
                      {[...Array(fullStars)].map((_, i) => (
                        <StarIcon key={`full-${i}`} filled />
                      ))}
                      {hasHalfStar && <StarIcon key="half" half />}
                      {[...Array(emptyStars)].map((_, i) => (
                        <StarIcon key={`empty-${i}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({book.rating.toFixed(1)})</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <p className="text-2xl font-bold text-red-600">£{book.price.toFixed(2)}</p>
                      <p className={`text-sm ${book.stock <= 5 ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                        {book.stock > 0 ? `${book.stock} units left` : 'Out of Stock'}
                      </p>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                        disabled={book.stock === 0}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                      >
                        Add to Wishlist
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">Genre</p>
                        <p className="text-gray-700">{book.genre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">Condition</p>
                        <p className="text-gray-700">{book.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">Release Date</p>
                        <p className="text-gray-700">{new Date(book.releaseDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">ISBN</p>
                        <p className="text-gray-700">{book.isbn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">Pages</p>
                        <p className="text-gray-700">{book.pages}</p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">About This Book</h2>
                      <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
                      {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map(review => (
                            <div key={review.id} className="border-t border-gray-200 pt-4">
                              <div className="flex items-center mb-2">
                                <p className="font-semibold text-gray-800">{review.author}</p>
                                <div className="flex ml-3">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <StarIcon key={i} filled />
                                  ))}
                                  {[...Array(5 - review.rating)].map((_, i) => (
                                    <StarIcon key={i} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseCategoryDetail;