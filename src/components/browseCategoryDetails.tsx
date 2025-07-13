"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { books } from '../data/books';
import TopBar from '../components/Topbar';
import Footer from '../components/footer';
import { Heart, Facebook, Twitter, Instagram, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BookCard = ({ id, img, title, author, price }) => (
  <div className="group relative flex-shrink-0 w-[190px] text-left p-2">
    <img src={img} alt={title} className="w-full h-64 object-cover mb-3 rounded-md border" />
    <h3 className="font-semibold text-sm truncate mt-2">{title}</h3>
    <p className="text-gray-500 text-xs mb-2">{author}</p>
    <div className="flex items-center text-gray-300 mb-2">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <p className="text-blue-600 font-bold">{price}</p>
    <button className="bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-md text-xs w-full transition-colors hover:bg-red-200 mt-3">
      ADD TO BASKET
    </button>
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
      <a href={`/browse/${id}`}>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
          QUICK VIEW
        </button>
      </a>
    </div>
  </div>
);

const BookShelf = ({ title, books }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
        <div className="flex space-x-2">
          <button onClick={() => scroll('left')} className="p-1 border rounded-md hover:bg-gray-100 text-gray-500"><ChevronLeft size={20} /></button>
          <button onClick={() => scroll('right')} className="p-1 border rounded-md hover:bg-gray-100 text-gray-500"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {books.map((book, index) => (
          <BookCard key={index} id={book.id} img={book.imageUrl} title={book.title} author={book.author} price={`£${book.price.toFixed(2)}`} />
        ))}
      </div>
    </section>
  );
};

const BrowseCategoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const book = books.find(b => b.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  if (!book) {
    return <div className="p-8 text-center text-gray-500">Book not found.</div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...book, quantity }));
    alert(`${quantity} x ${book.title} added to cart!`);
  };

  const relatedProducts = books.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 8);

  return (
    <div className="bg-white">
      <TopBar />
      <main className="container mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <img src={book.imageUrl} alt={`Cover of ${book.title}`} className="w-full h-auto object-contain border rounded-lg shadow-sm" />
            <div className="absolute top-2 left-2 bg-yellow-300 text-gray-800 text-xs font-bold p-2 rounded transform -rotate-3">
              COMPLETELY UPDATED!
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-md text-gray-600 mb-3">by {book.author}</p>

            <div className="flex items-center mb-4 text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <a href="#reviews" className="ml-3 text-gray-500 hover:text-blue-600 underline">{book.reviews || 5} Reviews</a>
              <a href="#add-review" className="ml-4 text-gray-500 hover:text-blue-600 underline">Add Your Review</a>
            </div>

            <p className="text-3xl font-bold text-red-600 mb-4">£{book.price.toFixed(2)}</p>

            <div className="text-sm mb-4">
              <span className="text-green-600 font-semibold">IN STOCK</span>
              <span className="text-gray-500 ml-4">SKU: {book.sku || `BBW0${book.id}`}</span>
            </div>

            {book.description ? (
  <p className="text-gray-600 leading-relaxed mb-4">
    {book.description.substring(0, 200)}...
  </p>
) : (
  <p className="text-gray-400 italic mb-4">No description available for this book.</p>
)}


            <div className="mb-6">
              <span className="font-semibold">Condition: </span>
              <span className="text-gray-700">{book.condition}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="mr-3 font-semibold text-gray-700">Qty:</span>
                <div className="flex items-center border rounded">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg hover:bg-gray-100">-</button>
                  <input type="text" value={quantity} readOnly className="w-12 text-center border-l border-r focus:outline-none" />
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-lg hover:bg-gray-100">+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} className="bg-red-500 text-white font-bold px-6 py-3 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2">
                <ShoppingCart size={18} />
                ADD TO BASKET
              </button>
            </div>

            <div className="flex items-center gap-8 mb-6">
              <button className="flex items-center text-gray-600 hover:text-red-500">
                <Heart size={20} className="mr-2" /> Add to Wish List
              </button>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-semibold mr-4">Share</span>
                <div className="flex gap-3">
                  <a href="#" className="p-2 rounded-full border hover:bg-gray-100"><Facebook size={16} /></a>
                  <a href="#" className="p-2 rounded-full border hover:bg-gray-100"><Twitter size={16} /></a>
                  <a href="#" className="p-2 rounded-full border hover:bg-gray-100"><Instagram size={16} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border rounded-md">
          <div className="border-b bg-gray-50 rounded-t-md">
            <nav className="flex space-x-1 p-1">
              <button onClick={() => setActiveTab('details')} className={`px-6 py-3 text-sm font-semibold rounded-md ${activeTab === 'details' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Details</button>
              <button onClick={() => setActiveTab('info')} className={`px-6 py-3 text-sm font-semibold rounded-md ${activeTab === 'info' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Additional Information</button>
              <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 text-sm font-semibold rounded-md ${activeTab === 'reviews' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>Reviews ({book.reviews || 5})</button>
            </nav>
          </div>
          <div className="p-6 text-gray-600 leading-relaxed">
            {activeTab === 'details' && <p>{book.description}</p>}
            {activeTab === 'info' && <p>Additional information such as dimensions, weight, publisher, etc., would be displayed here.</p>}
            {activeTab === 'reviews' && <p>Customer reviews would be listed here.</p>}
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
