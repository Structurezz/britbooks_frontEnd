import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import TopBar from "../components/Topbar";

// --- SVG ICONS ---
const StarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// --- Mock Data ---
const specialOffers = [
  { id: 1, title: "The Night Circus", author: "Erin Morgenstern", originalPrice: 19.99, discountPrice: 12.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1387124618l/9361589.jpg", rating: 4.2 },
  { id: 2, title: "Where the Crawdads Sing", author: "Delia Owens", originalPrice: 17.5, discountPrice: 10.5, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383480l/36809135.jpg", rating: 4.5 },
  { id: 3, title: "Circe", author: "Madeline Miller", originalPrice: 20.0, discountPrice: 14.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1508879575l/35959740.jpg", rating: 4.3 },
  { id: 4, title: "The Song of Achilles", author: "Madeline Miller", originalPrice: 18.99, discountPrice: 11.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1357177534l/11250317.jpg", rating: 4.6 },
  { id: 5, title: "A Man Called Ove", author: "Fredrik Backman", originalPrice: 16.99, discountPrice: 9.99, imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1405259930l/18774964.jpg", rating: 4.4 },
];

// --- Campaign Data ---
const campaignAds = [
  {
    id: 1,
    title: "Summer Sale - 20% Off!",
    description: "Get 20% off on all books this summer.",
    video: "https://media.istockphoto.com/id/1124580988/video/sale-discount-animation.mp4?s=mp4-640x640-is&k=20&c=2zkbq3ujo3KveLEviCLhbTiIH9C7fAaCpABvuZvHoek=", // Replace with your real video
    link: "/special-offers",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out the latest books added!",
    image: "https://via.placeholder.com/300x100?text=New+Arrivals",
    link: "/shop/new-arrivals",
  },
];

// --- Component ---
const SpecialOffersPage = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    alert(`${book.title} added to cart!`);
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <TopBar />

      <header className="relative text-white py-12 overflow-hidden">
  {/* Background video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
  >
    <source
      src="https://media.istockphoto.com/id/1310576990/fr/vid%C3%A9o/%C3%A9tiquette-3-jours-gauche-sur-fond-blanc-ic%C3%B4ne-plate-motion-graphics.mp4?s=mp4-640x640-is&k=20&c=ezUJb1sIa11feB4HwEFMnEPHHjvqcL5wqkyuhSp_6zQ="
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

  {/* Foreground content */}
  <div className="relative z-20 text-center">
    <h1 className="text-4xl font-bold">Special Offers</h1>
    <p className="text-md mt-3">Explore our exclusive deals and save big on your favorite books!</p>
  </div>
</header>


      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Campaign Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaigns & Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaignAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img src={ad.image} alt={ad.title} className="w-full h-24 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm">{ad.title}</h3>
                  <p className="text-xs text-gray-600">{ad.description}</p>
                  <Link to={ad.link} className="text-red-600 text-xs font-medium hover:underline mt-2 inline-block">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {specialOffers.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative bg-gray-100 p-3 flex-shrink-0">
                  <Link to={`/browse/${book.id}`} className="block">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Link to={`/browse/${book.id}`}>
                      <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-red-700">
                        QUICK VIEW
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow items-center">
                  <h3 className="font-semibold text-sm text-gray-800 h-12 leading-6 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">{book.author}</p>
                  <div className="mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={i < Math.round(book.rating) ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    £{book.discountPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 line-through mb-2">
                    £{book.originalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    ADD TO BASKET
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SpecialOffersPage;