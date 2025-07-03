import React from 'react';

import { Link } from 'react-router-dom';

// --- SVG ICONS ---
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

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    
                    {/* Logo and About Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-red-600 font-bold text-xl w-10 h-10 flex items-center justify-center rounded-md">B</div>
                            <span className="text-2xl font-bold">BritBooks</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            BritBooks is your premier destination for discovering quality used books. We believe in the power of stories to connect us and the importance of sustainability. Every book you buy gets a new life.
                        </p>
                    </div>

                    {/* Link Columns */}
                    <div>
                        <h3 className="font-semibold mb-4">Shop</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/explore" className="text-gray-400 hover:text-white hover:underline">Browse by Category</Link></li>
                            <li><Link to="/new-arrivals" className="text-gray-400 hover:text-white hover:underline">New Arrivals</Link></li>
                            <li><Link to="/bestsellers" className="text-gray-400 hover:text-white hover:underline">Bestsellers</Link></li>
                            <li><Link to="/special-offers" className="text-gray-400 hover:text-white hover:underline">Special Offers</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-4">About Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="text-gray-400 hover:text-white hover:underline">Our Story</Link></li>
                            <li><Link to="/sustainability" className="text-gray-400 hover:text-white hover:underline">Sustainability</Link></li>
                            <li><Link to="/careers" className="text-gray-400 hover:text-white hover:underline">Careers</Link></li>
                            <li><Link to="/press" className="text-gray-400 hover:text-white hover:underline">Press</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Help</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/contact" className="text-gray-400 hover:text-white hover:underline">Contact Us</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white hover:underline">FAQ</Link></li>
                            <li><Link to="/shipping-returns" className="text-gray-400 hover:text-white hover:underline">Shipping & Returns</Link></li>
                            <li><Link to="/account" className="text-gray-400 hover:text-white hover:underline">My Account</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter and Social Section */}
                <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h3 className="font-semibold">Join Our Newsletter</h3>
                        <p className="text-sm text-gray-400">Get the latest on new arrivals, deals, and more.</p>
                    </div>
                    <form className="flex w-full md:w-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full md:w-80 px-4 py-2 text-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button type="submit" className="bg-red-600 text-white px-6 py-2 font-semibold rounded-r-md hover:bg-red-700 transition-colors">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-900">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="text-gray-400 mb-4 md:mb-0">&copy; {new Date().getFullYear()} BritBooks Ltd. All Rights Reserved.</p>
                    <div className="flex items-center space-x-6">
                        <div className="flex space-x-4">
                            <Link to="#" className="text-gray-400 hover:text-white"><TwitterIcon className="h-5 w-5" /></Link>
                            <Link to="#" className="text-gray-400 hover:text-white"><FacebookIcon className="h-5 w-5" /></Link>
                            <Link to="#" className="text-gray-400 hover:text-white"><InstagramIcon className="h-5 w-5" /></Link>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/privacy" className="text-gray-400 hover:text-white hover:underline">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-400 hover:text-white hover:underline">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
