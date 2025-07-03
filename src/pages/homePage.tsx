import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import Footer from '../components/footer';
import { Menu, X } from 'lucide-react';

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

  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const [menuOpen, setMenuOpen] = React.useState(false);

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

        .book-image {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .book-image:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .btn-hover-effect {
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .btn-hover-effect:hover {
            transform: translateY(-2px);
        }
        
        .header-btn:hover {
            color: #EF4444; /* red-500 */
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

        <main className="container mx-auto mt-8 px-4 sm:px-8">
          <section className="relative text-white py-12 sm:py-20 px-6 sm:px-12 rounded-lg overflow-hidden">
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

            <div className="relative z-10 flex justify-between items-center">
              <div className="animate-on-scroll">
                <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
                  Best Used Book Platform <br /> in the UK
                </h1>
                <p className="text-gray-300 mt-2 text-sm sm:text-base">
                  Discover thousands of quality pre-owned books at unbeatable prices.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold">Browse Our Collection</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Interactive Category Browser</p>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <input type="radio" name="Browse" className="form-radio text-red-600" defaultChecked />
                  <span className="ml-2 text-gray-700 text-sm sm:text-base">New Arrivals</span>
                </div>
                <span className="text-gray-400 text-sm sm:text-base">Browse Categories</span>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="bg-red-600 text-white px-4 py-1 rounded-full text-sm btn-hover-effect">New Blogs</button>
              </div>
              <p className="text-gray-500 mt-4 text-sm sm:text-base">Discover Books You'll Love</p>
            </div>
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold">Trending Now</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <img src="https://images-eu.ssl-images-amazon.com/images/I/71WHWGojSJL._AC_UL375_SR375,375_.jpg" alt="Trending Book 1" className="rounded-md h-32 w-full object-cover book-image" />
                <img src="https://m.media-amazon.com/images/I/71QMhcKQZQL.AC_SX500.jpg" alt="Trending Book 2" className="rounded-md h-32 w-full object-cover book-image" />
                <img src="https://i.dailymail.co.uk/1s/2021/12/14/11/51770861-10308217-image-m-28_1639482905001.jpg" alt="Trending Book 3" className="rounded-md h-32 w-full object-cover book-image" />
                <img src="https://cdn.waterstones.com/override/v2/large/2928/3772/2928377277123.jpg" alt="Trending Book 4" className="rounded-md h-32 w-full object-cover book-image" />
              </div>
            </div>
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Personalized Recommendations</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Swipe or click to explore books picked just for you.</p>

              <div className="relative">
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full shadow-md p-2 z-10 hover:bg-opacity-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth pr-8"
                >
                  {[
                    "https://assets.aboutamazon.com/dims4/default/3e6fff9/2147483647/strip/true/crop/1400x1600+0+0/resize/650x743!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2F3f%2F61%2F58353e08472eba410341b8752a4b%2Famazon-uk-2024-top-ten-books-inlines-the-housemaid.jpg",
                    "https://images-eu.ssl-images-amazon.com/images/I/911UmVYIcBL._AC_UL375_SR375,375_.jpg",
                    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&q=80",
                    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&q=80",
                    "https://www.thestar.co.uk/jpim-static/image/2023/12/28/10/32/Chemistry.jpg?crop=3:2&trim=&width=800",
                    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80"
                  ].map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Book ${idx + 1}`}
                      className="rounded-md h-40 w-32 object-cover transition-transform duration-300 hover:scale-105 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <div className="animate-on-scroll">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Today's Hot Deals</h2>
                <div className="flex flex-wrap space-x-4 sm:space-x-8">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs sm:text-sm">EDITOR'S</p>
                    <p className="text-4xl sm:text-5xl font-bold">600</p>
                    <p className="text-gray-500 text-xs sm:text-sm">REALDOWN</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold text-red-500">+41%</p>
                    <p className="text-gray-500 text-xs sm:text-sm">OFF</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs sm:text-sm">CURATED</p>
                    <p className="text-4xl sm:text-5xl font-bold">250</p>
                    <p className="text-gray-500 text-xs sm:text-sm">REALDOWN</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold text-green-500">+20%</p>
                    <p className="text-gray-500 text-xs sm:text-sm">OFF</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-red-500 text-white p-6 sm:p-8 rounded-lg flex flex-col sm:flex-row justify-between items-center animate-on-scroll">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Shop Curated Collections</h3>
                <p className="mt-2 text-sm sm:text-base">Collections Curated for You</p>
                <button className="mt-4 bg-white text-red-500 px-6 py-2 rounded-md font-semibold btn-hover-effect">Start Shopping</button>
              </div>
              <div className="text-right mt-4 sm:mt-0">
                <p className="text-gray-200 text-sm sm:text-base">REALDOUN</p>
                <p className="text-5xl sm:text-6xl font-bold">050</p>
                <p className="text-gray-200 text-sm sm:text-base">OFF</p>
              </div>
              <div className="text-5xl sm:text-6xl font-bold pl-4 mt-2 sm:mt-0">65%</div>
            </div>
          </section>

          <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold">What Our Readers Say</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">E.g. Rare Books, First Editions, Signed Copies</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <img src="https://media.istockphoto.com/id/506897518/photo/smiling-male-bookseller-holding-books-in-library.jpg?s=612x612&w=0&k=20&c=ipm_-7nf66msI8s4VnKe4LZeQZ-W3flf0TPZoPkY0y0=" alt="Reader review 1" className="rounded-lg h-40 w-full object-cover book-image" />
                <img src="https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=300&q=80" alt="Reader review 2" className="rounded-lg h-40 w-full object-cover book-image" />
                <img src="https://media.istockphoto.com/id/2211225195/photo/browsing-pre-loved-books.jpg?s=612x612&w=0&k=20&c=OxkiBlrVt6a4G7gSiOhnLNuZ7HgvvEEmC7p3haxLWlo=" alt="Reader review 3" className="rounded-lg h-40 w-full object-cover book-image" />
                <img src="https://media.istockphoto.com/id/2171225195/photo/man-looking-at-books-at-store.jpg?s=612x612&w=0&k=20&c=V2UNRUPQLCsmeDPviNqr1WDFmoZqx1gR2Xne3z0Lc0E=" alt="Reader review 4" className="rounded-lg h-40 w-full object-cover book-image" />
              </div>
            </div>
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold">Spotlight on Genres</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <img src="https://media.istockphoto.com/id/2208312548/photo/family-time.jpg?s=612x612&w=0&k=20&c=rhHPSd776jJnTvW8oTsMfbl389_NG0v16Juu6iPFocw=" alt="Spotlight 1" className="rounded-lg h-32 w-full object-cover book-image" />
                  <p className="text-sm mt-2 font-semibold">BritBooks</p>
                  <p className="text-xs text-gray-500">Find Rare & Special Editions</p>
                </div>
                <div>
                  <img src="https://media.istockphoto.com/id/2166687011/photo/bookstore.jpg?s=612x612&w=0&k=20&c=88K0LwAVLDQT9h-xjO6QNCKLk7S1vPUZPAlU_HcOyHE=" alt="Spotlight 2" className="rounded-lg h-32 w-full object-cover book-image" />
                  <p className="text-sm mt-2 font-semibold">BritBooks</p>
                  <p className="text-xs text-gray-500">Browse Fiction, Non-Fiction, and More</p>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold">Gift the Joy of Reading</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <img src="https://media.istockphoto.com/id/1350671549/photo/close-up-of-books-tied-with-red-ribbon-with-senior-couple-in-the-background-on-christmas.jpg?s=612x612&w=0&k=20&c=A2POD6_Q-LfimgoQixrKGqHOoSkTk9z__fo5r6myjXM=" alt="Gift 1" className="rounded-lg h-32 w-full object-cover book-image" />
                  <p className="text-sm mt-2 font-semibold">BritBooks</p>
                  <p className="text-xs text-gray-500">Community</p>
                </div>
                <div>
                  <img src="https://media.istockphoto.com/id/1178595473/photo/a-pile-of-books.jpg?s=612x612&w=0&k=20&c=uTmIOHBTM6pFxVdJbk5eaL4Nt345Vl_oySYd8_BezCs=" alt="Gift 2" className="rounded-lg h-32 w-full object-cover book-image" />
                  <p className="text-sm mt-2 font-semibold">BritBooks</p>
                  <p className="text-xs text-gray-500">Joy of Reading</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 py-12 bg-gray-50 rounded-lg px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="animate-on-scroll">
              <h2 className="text-xl sm:text-2xl font-bold">Why Choose Us</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <img
                  src="https://media.istockphoto.com/id/2166687011/photo/cheerful-cute-afro-man-choosing-literature-to-read.jpg?s=612x612&w=0&k=20&c=tvI6fC3rKpceFdCo27lliN-Lubh5yeJ1YwczCxKho0Y="
                  alt="Why choose us 1"
                  className="rounded-lg h-40 w-full object-cover book-image"
                />
                <img
                  src="https://static01.nyt.com/images/2024/12/17/books/review/17BestBookCovers24-TOP-Sub04/17BestBookCovers24-TOP-Sub04-googleFourByThree.jpg"
                  alt="Why choose us 2"
                  className="rounded-lg h-40 w-full object-cover book-image"
                />
                <img
                  src="https://media.istockphoto.com/id/1805651010/photo/children-visiting-the-library.jpg?s=612x612&w=0&k=20&c=6A3PWXGcKp-v0qercMT5VF409W2kvyFUwPIpy5DadFI="
                  alt="Why choose us 3"
                  className="rounded-lg h-40 w-full object-cover book-image"
                />
              </div>
              <p className="text-gray-700 mt-6 leading-relaxed text-sm sm:text-base">
                BritBooks is the UK’s trusted hub for second-hand books, offering unbeatable prices, a vast handpicked collection, and service you can rely on. Whether you're a casual reader, a student on a budget, or a book collector, our platform was built with you in mind.
              </p>
              <p className="text-gray-700 mt-4 leading-relaxed text-sm sm:text-base">
                With fast UK-wide delivery, quality-checked books, and passionate support for literacy and sustainability, BritBooks continues to lead the way as the best used book retailer in Britain.
              </p>
            </div>

            <div className="animate-on-scroll bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h2 className="text-xl sm:text-2xl sm:text-3xl font-bold text-gray-900">How We Make Reading Greener</h2>
              <p className="text-gray-700 mt-4 leading-relaxed text-sm sm:text-base sm:text-lg">
                Every book you buy from BritBooks extends its life, reduces landfill waste, and prevents unnecessary printing.
                We actively support a circular economy, making reading not only more affordable — but also more sustainable.
              </p>
              <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base sm:text-lg">
                Join thousands of eco-conscious readers who are making a real difference, one page at a time.
              </p>
              <Link
                to="/explore"
                className="mt-6 inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 group"
              >
                Explore All Categories
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;