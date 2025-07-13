import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// --- (SVG ICONS: No changes) --- //
const SearchIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="11" cy="11" r="8"></circle> <line x1="21" y1="21" x2="16.65" y2="16.65"></line> </svg> );
const ShoppingCartIcon = (props) => (
  <svg
    {...props}
    className={`text-red-500 ${props.className || ''}`}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);
const MenuIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="3" y1="12" x2="21" y2="12"></line> <line x1="3" y1="6" x2="21" y2="6"></line> <line x1="3" y1="18" x2="21" y2="18"></line> </svg> );
const XIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg> );


// --- TOPBAR COMPONENT --- //
const TopBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // Add sticky, top-0, and z-50 to make the header stay in place
    <header className="shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-indigo-900 text-white px-4 py-1">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <span>{user ? `Welcome back, ${user.fullName}!` : 'sign in to explore more!'}</span>
          <nav className="flex space-x-4 md:space-x-6">
            {user ? (
              <>
                <Link to="/settings" className="hover:text-gray-300">My Account</Link>
                <Link to="/wishlist" className="hover:text-gray-300">Wishlist</Link>
                <button onClick={logout} className="hover:text-gray-300 focus:outline-none">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">Sign In</Link>
                <Link to="/signup" className="hover:text-gray-300">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white px-1 py-1">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center relative">
          
          {/* Logo */}
          <div className="absolute top-0 left-0 h-36 sm:h-40 z-10">
            <Link to="/" className="block w-auto h-full">
              <img
                src="/logobrit.png"
                alt="BritBooks Logo"
                className="h-full w-auto object-contain"
              />
            </Link>
          </div>
          
          {/* Spacer for top section */}
          <div className="h-24 w-44 sm:w-60 flex-shrink-0"></div>

          {/* Search */}
          <div className="w-full sm:max-w-lg mx-0 sm:mx-4 mt-2 sm:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search For Books"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="text-red-600 font-bold text-lg mt-2 sm:mt-0">
            📞 01234 567890
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-gray-200 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center h-12 sm:h-16">
          
          {/* Spacer for bottom section */}
          <div className="h-12 sm:h-16 w-44 sm:w-60 flex-shrink-0"></div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex flex-1 justify-between items-center font-medium text-gray-600">
            <div className="flex space-x-8">
              <Link to="/" className={`py-3 ${isActive('/') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> Home </Link>
              <Link to="/category" className={`py-3 ${isActive('/category') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> Shop by Category </Link>
              <Link to="/popular-books" className={`py-3 ${isActive('/popular-books') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> Popular Books </Link>
              <Link to="/new-arrivals" className={`py-3 ${isActive('/new-arrivals') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> New Arrivals </Link>
              <Link to="/bestsellers" className={`py-3 ${isActive('/bestsellers') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> Best Sellers </Link>
              <Link to="/clearance" className={`py-3 ${isActive('/clearance') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> Clearance </Link>
              <Link to="/help" className={`py-3 ${isActive('/help') ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}> Contact Us </Link>
            </div>
            <Link to="/checkout" className=" flex items-center space-x-2 text-gray-700">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
              <span>Cart 0 Items</span>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-4 py-4">
                <Link to="/" onClick={toggleMobileMenu}>Home</Link>
                <Link to="/category" onClick={toggleMobileMenu}>Shop by Category</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;