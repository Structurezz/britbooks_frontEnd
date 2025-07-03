import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import { Menu, X } from 'lucide-react';

// --- SVG ICONS ---
const StarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const UserCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/>
  </svg>
);
const ShoppingCartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
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
const BookIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const SparkleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"></path>
  </svg>
);

// --- TopBar Component ---
const TopBar = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="h-auto sm:h-20 px-4 sm:px-8 border-b sticky top-0 bg-white z-20 flex items-center">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 py-4 sm:py-0 relative w-full">
      
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
        <div className="flex justify-between w-full sm:w-auto items-center">
          <Link to="/">
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-red-600 text-white font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-md">B</div>
              <span className="text-2xl sm:text-3xl font-bold">BritBooks</span>
            </div>
          </Link>
  
          {/* Hamburger button - only on mobile */}
          <button
            className="sm:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
  
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search books, authors, or genres..."
            className="pl-10 pr-4 py-2 border rounded-full w-full"
          />
        </div>
      </div>
  
      {/* DESKTOP NAV */}
      <div className="hidden sm:flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <Link to="/explore" className="text-gray-600 header-btn text-center sm:text-left">Explore</Link>
        <Link to="/login" className="text-gray-600 header-btn text-center sm:text-left">Login</Link>
        <Link to="/signup" className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold btn-hover-effect text-center sm:text-left w-full sm:w-auto">Sign Up</Link>
      </div>
    </div>
  
    {/* MOBILE MENU */}
    {menuOpen && (
      <div className="sm:hidden w-full border-t">
        <div className="flex flex-col space-y-2 py-4">
          <Link to="/explore" className="text-gray-600 text-center" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link to="/login" className="text-gray-600 text-center" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup" className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold text-center w-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </div>
      </div>
    )}
  </header>
  );
};

// --- MOCK DATA ---
const newBooks = [
  { id: 1, title: 'The Stardust Thief', author: 'Chelsea Abdullah', price: 18.99, imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654091453i/61207057.jpg', releaseDate: '2024-06-25', genre: 'Fantasy' },
  { id: 2, title: 'Lessons in Chemistry', author: 'Bonnie Garmus', price: 15.50, imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1691150274i/58556596.jpg', releaseDate: '2024-06-22', genre: 'Fiction' },
  { id: 3, title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', price: 22.00, imageUrl: 'https://m.media-amazon.com/images/I/81bvjUdRCFL._UF1000,1000_QL80_.jpg', releaseDate: '2024-06-20', genre: 'Literary Fiction' },
  { id: 4, title: 'Nona the Ninth', author: 'Tamsyn Muir', price: 24.99, imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Nona_the_Ninth.jpg/250px-Nona_the_Ninth.jpg', releaseDate: '2024-06-18', genre: 'Science Fiction' },
];

const featuredBook = {
  id: 5,
  title: 'Babel: An Arcane History',
  author: 'R.F. Kuang',
  price: 25.99,
  imageUrl: 'https://thelastwordbookreview.com/wp-content/uploads/2023/01/cover.jpg',
  synopsis: 'A historical fantasy epic that grapples with student revolutions, colonial resistance, and the use of language and translation as the dominating tool of the British empire.',
  genre: 'Historical Fantasy',
  releaseDate: '2024-06-15'
};

// --- Why Shop Section Data ---
const whyShopPoints = [
  { title: 'Fresh Stories', description: 'Discover the latest books hot off the press.', icon: BookIcon },
  { title: 'Sustainable Reading', description: 'Support eco-friendly practices with pre-loved and new books.', icon: ShoppingCartIcon },
  { title: 'Curated Selection', description: 'Handpicked titles to spark your imagination.', icon: StarIcon },
];

// --- Main New Arrivals Page Component ---
const NewArrivalsPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const isRecentRelease = (releaseDate) => {
    const release = new Date(releaseDate);
    const today = new Date('2025-06-30'); // Current date for reference
    const diffDays = (today - release) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <div className="bg-gray-50 font-sans">
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
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        .animate-pulse { animation: pulse 1.5s infinite; }
        .header-btn:hover { transform: scale(1.05); }
        .btn-hover-effect:hover { transform: scale(1.05); }
        .bg-bookshelf-gif { background-image: url('https://media.istockphoto.com/id/1225112385/video/my-first-day-at-work.mp4?s=mp4-640x640-is&k=20&c=m5NHTSwoy92zDTeZ_QM8dSrKSaXV8d69sWwHlX73wvA='); background-size: cover; background-position: center; }
      `}</style>

      <TopBar />

      <main>
        {/* Hero Section */}
    <header className="relative bg-gray-900 pt-16 pb-20">
  {/* Background image + overlay */}
  <div className="absolute inset-0">
    <div className="bg-bookshelf-gif bg-cover bg-center w-full h-full"></div>
    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
  </div>

  {/* Content */}
  <div className="relative max-w-6xl mx-auto px-6 sm:px-8 text-center">
    <div className="flex justify-center items-center space-x-3 mb-6">
      <SparkleIcon className="h-10 w-10 text-red-500 animate-bounce" />
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-400">
        New Arrivals
      </h1>
    </div>
    <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
      Explore the newest additions to the BritBooks collection — fresh stories, new adventures, and timeless classics waiting for you.
    </p>
  </div>
</header>


        {/* Featured Book Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll relative">
                <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">New</div>
                <img src={featuredBook.imageUrl} alt={`Cover of ${featuredBook.title}`} className="rounded-lg shadow-2xl w-full max-w-md mx-auto hover:scale-105 transition-transform duration-300"/>
              </div>
              <div className="animate-on-scroll" style={{animationDelay: '150ms'}}>
                <h2 className="text-sm font-bold uppercase text-red-600 tracking-wider">Book of the Week</h2>
                <h3 className="mt-2 text-3xl md:text-4xl font-bold text-gray-800">{featuredBook.title}</h3>
                <p className="mt-2 text-lg text-gray-600">by {featuredBook.author}</p>
                <div className="flex items-center my-4">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400 animate-pulse" />)}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <BookIcon className="h-5 w-5" />
                    <span>{featuredBook.genre}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{featuredBook.releaseDate}</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 leading-relaxed">{featuredBook.synopsis}</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <p className="text-3xl font-bold text-gray-800">£{featuredBook.price.toFixed(2)}</p>
                  <Link to={`/book/${featuredBook.id}`} className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold text-center hover:bg-red-700 transition-transform hover:scale-105 flex items-center space-x-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>View Details</span>
                  </Link>
                </div>
                <div className="mt-4 flex space-x-4">
                  <Link to="#" className="text-gray-600 hover:text-blue-400"><TwitterIcon className="h-5 w-5" /></Link>
                  <Link to="#" className="text-gray-600 hover:text-blue-800"><FacebookIcon className="h-5 w-5" /></Link>
                  <Link to="#" className="text-gray-600 hover:text-pink-500"><InstagramIcon className="h-5 w-5" /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Shop New Arrivals Section */}
        <section className="py-16 sm:py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center animate-on-scroll mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Shop New Arrivals?</h2>
              <p className="mt-4 text-lg text-gray-600">Explore the benefits of diving into our latest collection.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyShopPoints.map((point, index) => (
                <div key={index} className="animate-on-scroll bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" style={{animationDelay: `${index * 100}ms`}}>
                  <point.icon className="h-10 w-10 text-red-600 mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-gray-800">{point.title}</h3>
                  <p className="mt-2 text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid of New Arrivals */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="animate-on-scroll mb-12">
              <h2 className="text-3xl font-bold text-gray-800">This Week's Releases</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newBooks.map((book, index) => (
                <div key={book.id} className="group animate-on-scroll relative" style={{animationDelay: `${index * 100}ms`}}>
                  {isRecentRelease(book.releaseDate) && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">New Release</div>
                  )}
                  <div className="overflow-hidden rounded-lg">
                    <img src={book.imageUrl} alt={book.title} className="w-full h-96 object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"/>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
                    <p className="text-md text-gray-600">{book.author}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <BookIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">{book.genre}</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-red-600">£{book.price.toFixed(2)}</p>
                    <Link to={`/book/${book.id}`} className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md font-semibold text-center hover:bg-black transition-colors flex items-center space-x-2 justify-center">
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-16 animate-on-scroll">
              <Link to="/explore" className="bg-gray-800 text-white px-8 py-3 rounded-md font-semibold text-center hover:bg-black transition-colors flex items-center justify-center mx-auto space-x-2">
                <BookIcon className="h-5 w-5" />
                <span>Browse All Books</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NewArrivalsPage;