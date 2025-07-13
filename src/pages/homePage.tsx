import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Footer from '../components/footer';
import TopBar from '../components/Topbar';
import { books as realBooks } from '../data/books';

// Convert real books to homepage format
const formattedRealBooks = realBooks.map(book => ({
  id: book.id,
  img: book.imageUrl,
  title: book.title,
  author: book.author,
  price: `£${book.price.toFixed(2)}`,
}));

// Only use real books
const bookData = formattedRealBooks;

// --- Reusable Components ---

// Book Card Component for the shelves
const BookCard = ({ id, img, title, author, price }) => (
  <div className="relative group flex-shrink-0 w-full max-w-[180px] text-center border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-lg">
    <img src={img} alt={title} className="w-full h-60 object-cover mb-3 rounded" />
    <h3 className="font-semibold text-sm truncate">{title}</h3>
    <p className="text-gray-500 text-xs mb-2">{author}</p>
    <div className="flex items-center justify-center text-yellow-400 mb-2">
      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
    </div>
    <p className="text-blue-600 font-bold mb-3">{price}</p>
    <button className="bg-red-400 text-white px-4 py-2 rounded-full hover:bg-red-500 text-xs w-full transition-colors">
      ADD TO BASKET
    </button>

    {/* Quick View Button */}
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
      <Link to={`/browse/${id}`}>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
          QUICK VIEW
        </button>
      </Link>
    </div>
  </div>
);

// Updated Book Shelf Component with Vertical Grid and Pagination
const BookShelf = ({ title, books: allBooks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjustable based on design

  const paginatedBooks = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return allBooks.slice(indexOfFirstItem, indexOfLastItem);
  }, [allBooks, currentPage]);

  const totalPages = Math.ceil(allBooks.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="py-6 sm:py-8 animate-on-scroll">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1 border rounded-md hover:bg-gray-100 text-gray-500 disabled:text-gray-300"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1 border rounded-md hover:bg-gray-100 text-gray-500 disabled:text-gray-300"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginatedBooks.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      </div>
      {paginatedBooks.length === 0 && (
        <p className="text-center text-gray-500 py-4">No books available.</p>
      )}
    </section>
  );
};

// --- Main Homepage Component ---

const Homepage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Mock Data
  const popularBooks = [...bookData].reverse();
  const bestSellers = bookData.slice(2, 8);
  const childrensBooks = bookData.slice(3, 9);
  const clearanceItems = bookData.slice(1, 7);
  const recentlyViewed = bookData.slice(0, 6);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="bg-white">
        <TopBar />
        
        <main className="container mx-auto px-4 sm:px-8">
          {/* Hero Section with Video Background */}
          <section className="relative text-white my-4 sm:my-8 py-12 sm:py-20 px-4 sm:px-12 rounded-lg overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            >
              <source
                src="https://media.istockphoto.com/id/1302273587/video/laptop-on-a-table-at-the-end-of-an-aisle-of-books-in-a-library.mp4?s=mp4-640x640-is&k=20&c=HERTtG3ibKF0poAWZ8NrgIPbph1408m0jYwVOhS8mIM="
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div className="relative z-10 text-center sm:text-left">
              <div className="animate-on-scroll">
                <h1 className="text-2xl sm:text-5xl font-bold leading-tight">
                  Best Used Book Platform <br className="block sm:hidden" /> in the UK
                </h1>
                <p className="text-gray-300 mt-2 text-sm sm:text-base">
                  Discover thousands of quality pre-owned books at unbeatable prices.
                </p>
              </div>
            </div>
          </section>

          {/* Welcome Section */}
          <div className="max-w-7xl mx-auto py-8 sm:py-16 px-4 sm:px-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-16">
            <div className="w-full sm:w-1/2 flex justify-center sm:justify-start">
              <img
                src="https://media.istockphoto.com/id/185266132/photo/portrait-of-a-cute-teenage-girl.jpg?s=612x612&w=0&k=20&c=7oyxKo75xTGO_k5v2zsCBeu7GWG-7eryUyyu42o8Ra0="
                alt="Woman Reading"
                className="w-full max-w-md sm:max-w-lg object-contain"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <h2 className="text-3xl sm:text-5xl font-light leading-tight mb-4 sm:mb-6">
                Welcome to <span className="font-bold text-blue-900">brit</span>
                <span className="font-bold text-red-600">books</span>
                <br className="block sm:hidden" />
                <span className="font-bold text-gray-900">online books</span> super store
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                the UK’s most trusted platform for high-quality secondhand books. Our mission is simple: to make reading more affordable, sustainable, and accessible to everyone. 
                Whether you’re a curious student hunting for academic texts, a parent looking for bedtime stories, or an avid reader building your personal library, we’ve got shelves filled just for you.
              </p>
            </div>
          </div>

          <div className="w-full mx-auto px-4 sm:px-8">
            {/* Book Shelves */}
            <BookShelf title="New Arrivals" books={bookData} />
            <BookShelf title="Popular Books" books={popularBooks} />
            <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Top 10 Best Sellers", image: "https://cdn-icons-png.flaticon.com/512/2331/2331970.png" },
                { title: "Order now and get 10% discount for limited time", image: "https://cdn-icons-png.flaticon.com/512/1042/1042306.png" },
                { title: "Special discount for students", image: "https://cdn-icons-png.flaticon.com/512/3036/3036996.png" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative h-48 sm:h-56 rounded-lg overflow-hidden text-white flex flex-col items-center justify-center text-center"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#00000088',
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="relative z-10 p-4">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{item.title}</h3>
                    <button className="bg-white text-black px-4 sm:px-6 py-2 rounded-full hover:bg-gray-200 transition text-sm sm:text-base">
                      SHOP NOW!
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <BookShelf title="Best Sellers" books={bestSellers} />
            <BookShelf title="Children's Books" books={childrensBooks} />
            <BookShelf title="Clearance Items" books={clearanceItems} />
            <BookShelf title="Recently Viewed" books={recentlyViewed} />
          </div>

          {/* Promotional Banners with Image Backgrounds */}
          <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "Free Shipping", subtitle: "Orders Over £100", image: "https://media.istockphoto.com/id/1309243817/vector/fast-delivery-truck-with-motion-lines-online-delivery-express-delivery-quick-move-fast.jpg?s=612x612&w=0&k=20&c=l2JlE6VQ4uRS6jABMS558puDgTyhEJW0bSiPhbBgXMc=" },
              { title: "Money Guarantee", subtitle: "30 Day Money Back Guarantee", image: "https://media.istockphoto.com/id/1129401378/photo/a-hand-with-protective-shield-containing-a-currency-unit-inside.jpg?s=612x612&w=0&k=20&c=R3Y_IIp64RvH7g7YmDDirCwiu3QbFRE1KDV8X-R1peo=" },
              { title: "Secure Payment", subtitle: "All Cards Accepted", image: "https://media.istockphoto.com/id/2078490118/photo/businessman-using-laptop-to-online-payment-banking-and-online-shopping-financial-transaction.jpg?s=612x612&w=0&k=20&c=1x2G24ANsWxG4YW6ZaoeFPEzjmKFE4ZlohVQSwbjGj8=" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative h-48 sm:h-56 rounded-lg overflow-hidden text-white flex items-center justify-center text-center"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10 p-4">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;