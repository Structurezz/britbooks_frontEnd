import React from 'react';
import { Link } from 'react-router-dom';

const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const UserCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
    <circle cx="12" cy="10" r="3" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const ShoppingCartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const TopBar = () => {
  return (
    <header className="bg-white py-3 px-4 sm:px-8 border-b sticky top-0 z-20">

      <div className="flex justify-between items-center">
        
        {/* Mobile search icon */}
        <button className="sm:hidden p-2">
          <SearchIcon className="h-6 w-6 text-gray-600" />
        </button>

        {/* Search input (hidden on mobile) */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
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

        {/* Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <UserCircleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 cursor-pointer" />

          <Link to="/checkout" className="relative flex items-center space-x-1 sm:space-x-2">
            <div className="relative">
              <ShoppingCartIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600" />
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                0
              </span>
            </div>
            {/* Hide text on small screens */}
            <span className="hidden sm:block text-sm">
              Cart <br /> 90 item
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
