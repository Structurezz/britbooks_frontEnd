import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import { Menu, X } from 'lucide-react';

// --- SVG ICONS ---
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
const HelpCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line>
  </svg>
);
const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
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

// --- Mock FAQ Data ---
const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Shipping within the UK typically takes 3-5 business days. International shipping may take 7-14 days, depending on the destination.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of purchase for unused books in original condition. Please contact support@britbooks.co.uk to initiate a return.',
  },
  {
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top right corner, fill in your details, and follow the prompts to create your BritBooks account.',
  },
  {
    question: 'Do you offer discounts for bulk orders?',
    answer: 'Yes, we offer discounts for bulk orders over 10 books. Contact our team at support@britbooks.co.uk for a quote.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you’ll receive a tracking link via email. You can also check order status in your account dashboard.',
  },
];

// --- FAQ Page Component ---
const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
        .bg-faq-gif { background-image: url('https://media.istockphoto.com/id/2046523630/video/social-media-speech-bubbles-4k-looped-background.mp4?s=mp4-640x640-is&k=20&c=BTL2LprDftWGBGYaSjprCJyrIBQgiiDcvskR4LoAOW8='); background-size: cover; background-position: center; }
        .accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .accordion-content.open { max-height: 200px; }
      `}</style>

      <TopBar />

      <main>
        {/* Hero Section */}
        <header className="bg-faq-gif bg-gray-100 pt-12 pb-16 relative">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
            <div className="text-center animate-on-scroll">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <HelpCircleIcon className="h-8 w-8 text-red-600 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-500">Frequently Asked Questions</h1>
              </div>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">Find answers to common questions about shopping with BritBooks. Need more help? Reach out to our team!</p>
            </div>
          </div>
        </header>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
  <div className="max-w-5xl mx-auto px-6 sm:px-8">
    <div className="mb-12 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900">Your Questions, Answered</h2>
      <p className="mt-2 text-lg text-gray-500">
        Find answers to the most common questions about BritBooks.
      </p>
    </div>

    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex justify-between items-center px-6 py-5 focus:outline-none"
          >
            <div className="flex items-center space-x-3">
              <HelpCircleIcon className="h-5 w-5 text-red-500" />
              <span className="text-md md:text-lg font-medium text-gray-800">{faq.question}</span>
            </div>
            <svg
              className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                openFAQ === index ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </button>

          {openFAQ === index && (
            <div className="px-6 pb-5 text-gray-600">
              <p className="text-sm md:text-base leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Contact Call-to-Action Section */}
        <section className="py-16 sm:py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Still Have Questions?</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Our support team is here to assist you with any inquiries. Reach out via email, phone, or our contact form.</p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  to="/contact"
                  className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold flex items-center space-x-2 hover:bg-red-700 transition-transform hover:scale-105"
                >
                  <MailIcon className="h-5 w-5" />
                  <span>Contact Us</span>
                </Link>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <a href="https://twitter.com" className="text-gray-600 hover:text-blue-400"><TwitterIcon className="h-6 w-6" /></a>
                <a href="https://facebook.com" className="text-gray-600 hover:text-blue-800"><FacebookIcon className="h-6 w-6" /></a>
                <a href="https://instagram.com" className="text-gray-600 hover:text-pink-500"><InstagramIcon className="h-6 w-6" /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;