import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/footer';
import TopBar from '../components/Topbar'; // ✅ Import TopBar

// --- SVG ICONS ---
const StarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.358-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
  </svg>
);
const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
  </svg>
);

// --- Mock Data ---
const specialOffers = [
  { rank: 1, title: 'The Night Circus', author: 'Erin Morgenstern', originalPrice: 19.99, discountPrice: 12.99, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1387124618l/9361589.jpg' },
  { rank: 2, title: 'Where the Crawdads Sing', author: 'Delia Owens', originalPrice: 17.5, discountPrice: 10.5, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383480l/36809135.jpg' },
  { rank: 3, title: 'Circe', author: 'Madeline Miller', originalPrice: 20.0, discountPrice: 14.99, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1508879575l/35959740.jpg' },
  { rank: 4, title: 'The Song of Achilles', author: 'Madeline Miller', originalPrice: 18.99, discountPrice: 11.99, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1357177534l/11250317.jpg' },
  { rank: 5, title: 'A Man Called Ove', author: 'Fredrik Backman', originalPrice: 16.99, discountPrice: 9.99, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1405259930l/18774964.jpg' },
];

// --- Component ---
const SpecialOffersPage = () => {
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

  return (
    <div className="bg-white font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <TopBar />

      <header className="text-white py-16 bg-[url('https://your-banner-image-url')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold">Special Offers</h1>
          <p className="text-lg mt-4">Explore our exclusive deals and save big on your favorite books!</p>
        </div>
      </header>

      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">
        {specialOffers.map((book, index) => (
          <div key={book.rank} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-lg shadow-md animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-4xl font-bold text-gray-300 w-16">#{book.rank}</span>
              <img src={book.imageUrl} alt={book.title} className="w-24 h-36 object-cover rounded-md ml-4" />
            </div>
            <div className="flex-1 sm:ml-8 text-center sm:text-left">
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
              <div className="flex justify-center sm:justify-start mt-2">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className="text-yellow-400 w-5 h-5" />)}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-8 text-center sm:text-right">
              <p className="text-2xl font-bold text-red-600">£{book.discountPrice.toFixed(2)}</p>
              <p className="text-gray-500 line-through">£{book.originalPrice.toFixed(2)}</p>
              <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Add to Cart</button>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default SpecialOffersPage;
