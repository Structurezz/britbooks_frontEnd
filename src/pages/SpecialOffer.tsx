import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import TopBar from "../components/Topbar";
import { books as realBooks } from "../data/books";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../context/cartContext";

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

// --- Campaign Data ---
const campaignAds = [
  {
    id: 1,
    title: "Fiction Frenzy - 40% Off!",
    description: "Dive into gripping stories with massive discounts on fiction titles!",
    video: "https://media.istockphoto.com/id/1124580988/video/sale-discount-animation.mp4?s=mp4-640x640-is&k=20&c=2zkbq3ujo3KveLEviCLhbTiIH9C7fAaCpABvuZvHoek=",
    link: "/flash-fiction",
  },
  {
    id: 2,
    title: "Fantasy Blowout - 50% Off!",
    description: "Explore magical worlds with our biggest fantasy sale yet!",
    image: "https://cdn-icons-png.flaticon.com/512/2331/2331970.png",
    link: "/flash-fantasy",
  },
  {
    id: 3,
    title: "Non-Fiction Deals - 30% Off!",
    description: "Expand your mind with discounted non-fiction books for all readers!",
    image: "https://media.istockphoto.com/id/1309243817/vector/fast-delivery-truck-with-motion-lines-online-delivery-express-delivery-quick-move-fast.jpg?s=612x612&w=0&k=20&c=l2JlE6VQ4uRS6jABMS558puDgTyhEJW0bSiPhbBgXMc=",
    link: "/flash-nonfiction",
  },
  {
    id: 4,
    title: "Buy One, Get One Half Price!",
    description: "Mix and match any two books and get the second at half price!",
    image: "https://cdn-icons-png.flaticon.com/512/1042/1042306.png",
    link: "/bogo",
  },
  {
    id: 5,
    title: "Inclusive Reads Sale",
    description: "Celebrate diversity with 25% off books by authors from all backgrounds!",
    image: "https://media.istockphoto.com/id/185266132/photo/portrait-of-a-cute-teenage-girl.jpg?s=612x612&w=0&k=20&c=7oyxKo75xTGO_k5v2zsCBeu7GWG-7eryUyyu42o8Ra0=",
    link: "/inclusive-reads",
  },
  {
    id: 6,
    title: "Winter Clearance",
    description: "Clear our shelves with up to 60% off selected titles!",
    video: "https://media.istockphoto.com/id/1310576990/fr/vid%C3%A9o/%C3%A9tiquette-3-jours-gauche-sur-fond-blanc-ic%C3%B4ne-plate-motion-graphics.mp4?s=mp4-640x640-is&k=20&c=ezUJb1sIa11feB4HwEFMnEPHHjvqcL5wqkyuhSp_6zQ=",
    link: "/clearance",
  },
  {
    id: 7,
    title: "Kids’ Book Bonanza",
    description: "Fun reads for children at unbeatable prices—perfect for young adventurers!",
    image: "https://cdn-icons-png.flaticon.com/512/3036/3036996.png",
    link: "/kids",
  },
  {
    id: 8,
    title: "Refer-a-Friend Deal",
    description: "Invite a friend and both get 10% off your next purchase!",
    image: "https://media.istockphoto.com/id/2078490118/photo/businessman-using-laptop-to-online-payment-banking-and-online-shopping-financial-transaction.jpg?s=612x612&w=0&k=20&c=1x2G24ANsWxG4YW6ZaoeFPEzjmKFE4ZlohVQSwbjGj8=",
    link: "/refer-a-friend",
  },
];

// --- Component ---
const SpecialOffersPage = () => {
  const { addToCart, cart } = useCart();
  const [fictionTimer, setFictionTimer] = useState(24 * 60 * 60); // 24 hours
  const [fantasyTimer, setFantasyTimer] = useState(12 * 60 * 60); // 12 hours
  const [nonFictionTimer, setNonFictionTimer] = useState(6 * 60 * 60); // 6 hours
  const [dealOfHour, setDealOfHour] = useState(null);

  // Filter books by genre for flash sales
  const fictionBooks = realBooks.filter(book => book.genre === "Fiction").slice(0, 6).map(book => ({
    ...book,
    originalPrice: book.price,
    discountPrice: book.price * 0.6, // 40% off
  }));
  const fantasyBooks = realBooks.filter(book => book.genre === "Fantasy").slice(0, 6).map(book => ({
    ...book,
    originalPrice: book.price,
    discountPrice: book.price * 0.5, // 50% off
  }));
  const nonFictionBooks = realBooks.filter(book => book.genre === "Non-Fiction").slice(0, 6).map(book => ({
    ...book,
    originalPrice: book.price,
    discountPrice: book.price * 0.7, // 30% off
  }));

  // Countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setFictionTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setFantasyTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setNonFictionTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Deal of the Hour
  useEffect(() => {
    const updateDeal = () => {
      const randomBook = realBooks[Math.floor(Math.random() * realBooks.length)];
      setDealOfHour({
        ...randomBook,
        originalPrice: randomBook.price,
        discountPrice: randomBook.price * 0.6, // 40% off
      });
    };
    updateDeal();
    const dealTimer = setInterval(updateDeal, 3600 * 1000); // Update hourly
    return () => clearInterval(dealTimer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddToCart = (book) => {
    addToCart({
      id: book.id,
      imageUrl: book.imageUrl,
      title: book.title,
      author: book.author,
      price: `£${book.discountPrice.toFixed(2)}`,
      quantity: 1,
    });
    toast.success(`${book.title} added to your basket!`);
  };

  // Free shipping quest progress
  const cartItemsCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);
  const questComplete = cartItemsCount >= 4;

  // Book Card Component
  const BookCard = ({ book, saleType }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="relative bg-gray-100 p-3 flex-shrink-0">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </Link>
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">{saleType}</div>
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
          className="w-full bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 animate-pulse"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <TopBar />

      <header className="relative text-white py-12 overflow-hidden">
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
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20 text-center">
          <h1 className="text-4xl font-bold">Mega Flash Sale Extravaganza</h1>
          <p className="text-md mt-3">Over a million books at unbeatable prices—shop now before time runs out!</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Deal of the Hour */}
        {dealOfHour && (
          <section className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal of the Hour</h2>
            <div className="bg-yellow-100 rounded-lg shadow-md p-6 animate-pulse">
              <h3 className="text-lg font-semibold">{dealOfHour.title}</h3>
              <p className="text-sm text-gray-600 mb-2">by {dealOfHour.author}</p>
              <p className="text-lg font-bold text-red-600">£{dealOfHour.discountPrice.toFixed(2)} <span className="text-sm text-gray-500 line-through">£{dealOfHour.originalPrice.toFixed(2)}</span></p>
              <button
                onClick={() => handleAddToCart(dealOfHour)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm font-medium animate-bounce"
              >
                Grab It Now!
              </button>
            </div>
          </section>
        )}

        {/* Free Shipping Quest */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Shipping Quest</h2>
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in-up">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {questComplete ? "Free Shipping Unlocked!" : "Add 4 Books for Free Shipping"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {questComplete
                ? "Awesome! You've added enough books to qualify for free shipping."
                : `Add ${4 - cartItemsCount} more book${4 - cartItemsCount > 1 ? "s" : ""} to unlock free shipping!`}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${questComplete ? "bg-green-600" : "bg-blue-600"}`}
                style={{ width: `${Math.min((cartItemsCount / 4) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Fiction Frenzy Flash Sale */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Fiction Frenzy - 40% Off (Ends in {formatTime(fictionTimer)})</h2>
          <div className="bg-red-600 text-white rounded-lg shadow-md p-4 mb-4 text-center animate-pulse">
            <p className="text-lg font-semibold">Hurry! Fiction sale ends soon!</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fictionBooks.map((book) => (
              <BookCard key={book.id} book={book} saleType="Fiction Frenzy" />
            ))}
          </div>
        </section>

        {/* Fantasy Blowout Flash Sale */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Fantasy Blowout - 50% Off (Ends in {formatTime(fantasyTimer)})</h2>
          <div className="bg-purple-600 text-white rounded-lg shadow-md p-4 mb-4 text-center animate-pulse">
            <p className="text-lg font-semibold">Grab these fantasy deals before they vanish!</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fantasyBooks.map((book) => (
              <BookCard key={book.id} book={book} saleType="Fantasy Blowout" />
            ))}
          </div>
        </section>

        {/* Non-Fiction Deals Flash Sale */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Fiction Deals - 30% Off (Ends in {formatTime(nonFictionTimer)})</h2>
          <div className="bg-blue-600 text-white rounded-lg shadow-md p-4 mb-4 text-center animate-pulse">
            <p className="text-lg font-semibold">Expand your knowledge with these deals!</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nonFictionBooks.map((book) => (
              <BookCard key={book.id} book={book} saleType="Non-Fiction Deals" />
            ))}
          </div>
        </section>

        {/* Campaigns & Promotions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More Exciting Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaignAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {ad.video ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-24 object-cover"
                  >
                    <source src={ad.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={ad.image} alt={ad.title} className="w-full h-24 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm">{ad.title}</h3>
                  <p className="text-xs text-gray-600">{ad.description}</p>
                  <Link to={ad.link} className="text-red-600 text-xs font-medium hover:underline mt-2 inline-block animate-pulse">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default SpecialOffersPage;