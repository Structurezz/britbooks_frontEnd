import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Star, X, Filter, ShoppingBag, Eye, Tag, MessageCircle, Truck } from "lucide-react";
import Footer from "../components/footer"; 
import TopBar from "../components/Topbar"; 
import { books } from "../data/books";

// --- CSS for Animations ---
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
  .animate-slideDown { animation: slideDown 0.5s ease-out forwards; }
  .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
`;

// Inject CSS into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

// --- Reusable Components ---

// Star Rating Component
const StarRating = ({ rating, starSize = 16 }) => (
  <div className="flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={starSize}
        className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
        fill={i < Math.round(rating) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

// Book Card Component
const BookCard = ({ book }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
    <div className="relative bg-gray-100 p-4 flex-shrink-0">
      <Link to={`/browse/${book.id}`} className="block">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-48 object-cover mx-auto transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
        />
      </Link>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
        <Link to={`/browse/${book.id}`}>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-red-700">
            QUICK VIEW
          </button>
        </Link>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow items-center">
      <h4 className="font-semibold text-sm text-gray-800 h-12 leading-6 mb-2 line-clamp-2">{book.title}</h4>
      <p className="text-xs text-gray-500 mb-2">{book.author}</p>
      <div className="mb-2">
        <StarRating rating={book.rating} />
      </div>
      <p className="text-lg font-bold text-gray-900 mt-auto mb-3">£{book.price.toFixed(2)}</p>
      <button
        onClick={() => alert(`${book.title} added to your basket!`)}
        className="w-full bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        ADD TO BASKET
      </button>
    </div>
  </div>
);

// Live Purchase Updates Component
const LivePurchaseUpdates = ({ updates }) => (
  <div className="mt-6 border-t pt-4 border-gray-200 opacity-0 animate-fadeIn">
    <h4 className="flex items-center text-lg font-bold text-gray-800 mb-5">
      <ShoppingBag className="mr-2.5 h-5 w-5 text-indigo-500" />
      Live Purchase Updates
    </h4>
    <div className="space-y-3">
      {updates.map((update) => (
        <div
          key={update.id}
          className="flex items-center gap-4 rounded-xl bg-white/60 p-3 shadow-subtle backdrop-blur-sm"
          style={{ animation: "fade-in-up 0.6s ease-out forwards" }}
        >
          <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2">
            <Truck className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{update.units} units</span> of{" "}
            <span className="font-medium text-gray-800">"{update.book}"</span> shipped to{" "}
            <span className="font-medium text-indigo-500">{update.location}</span>
            <span className="ml-2 text-xs text-gray-400">{update.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Filter Sidebar Component
const FilterSidebar = ({ filters, setFilters, isOpen, setIsOpen, setSortBy }) => {
  const priceRanges = [
    { label: "Under £2.99", min: 0, max: 2.99 },
    { label: "£3.00 - £5.99", min: 3, max: 5.99 },
    { label: "£6.00 - £8.99", min: 6, max: 8.99 },
    { label: "£9.00 - £11.99", min: 9, max: 11.99 },
    { label: "£12.00+", min: 12, max: Infinity },
  ];

  const categories = [
    "Fiction",
    "Nonfiction",
    "Children's Books",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Biography",
    "History",
    "Self-Help",
    "Thriller",
    "Poetry",
  ];

  const filterOptions = useMemo(() => {
    const counts = {
      category: {},
      condition: {},
      price: priceRanges.map(() => 0),
      rating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    books.forEach((book) => {
      // Map known category or fallback
      const mappedCategory = categories.includes(book.genre) ? book.genre : "Uncategorized";
      counts.category[mappedCategory] = (counts.category[mappedCategory] || 0) + 1;
    
      // Count condition
      const bookCondition = book.condition || "Unknown";
      counts.condition[bookCondition] = (counts.condition[bookCondition] || 0) + 1;
    
      // Count price range
      const price = typeof book.price === "number" ? book.price : 0;
      const priceIndex = priceRanges.findIndex(
        (range) => price >= range.min && price <= range.max
      );
      if (priceIndex !== -1) {
        counts.price[priceIndex]++;
      }
    
      // Count floored rating
      const rating = typeof book.rating === "number" ? Math.floor(book.rating) : 0;
      counts.rating[rating] = (counts.rating[rating] || 0) + 1;
    });

    return {
      category: Object.fromEntries(categories.map((cat) => [cat, counts.category[cat] || 0])),
      condition: Object.entries(counts.condition),
      price: priceRanges.map((range, i) => ({ ...range, count: counts.price[i] })),
      rating: Object.fromEntries(Object.entries(counts.rating).map(([key, value]) => [parseInt(key), value])),
    };
  }, []);

  const handleFilterClick = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: prev[filterType] === value ? null : value }));
  };

  const handlePriceFilter = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceMin: prev.priceMin === range.min ? null : range.min,
      priceMax: prev.priceMax === range.max ? null : range.max,
    }));
  };

  const handleRatingFilter = (rating) => {
    setFilters((prev) => ({ ...prev, rating: prev.rating === rating ? null : rating }));
  };

  const renderFilterSection = (title, options, filterKey, Icon) => (
    <div className="mb-6 opacity-0 animate-fadeIn">
      <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide flex items-center">
        <Icon className="mr-2 h-4 w-4 text-red-600" /> {title}
      </h4>
      <ul className="space-y-2">
        {Object.entries(options).map(([value, count]) => (
          <li key={value} className="flex items-center">
            <input
              type="checkbox"
              id={`${filterKey}-${value}`}
              checked={filters[filterKey] === parseInt(value) || filters[filterKey] === value}
              onChange={() => {
                if (filterKey === "rating") handleRatingFilter(parseInt(value));
                else handleFilterClick(filterKey, value);
              }}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
            />
            <label
              htmlFor={`${filterKey}-${value}`}
              className="ml-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
            >
              {filterKey === "rating" ? `${value} Stars` : value} <span className="text-gray-400">({count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );

  const campaignAds = [
    {
      id: 1,
      title: "Summer Sale - 20% Off!",
      description: "Get 20% off on all books this summer.",
      video: "https://media.istockphoto.com/id/1124580988/video/sale-discount-animation.mp4?s=mp4-640x640-is&k=20&c=2zkbq3ujo3KveLEviCLhbTiIH9C7fAaCpABvuZvHoek=",
      link: "/special-offers",
    },
    {
      id: 2,
      title: "New Arrivals",
      description: "Check out the latest books added!",
      image: "https://media.istockphoto.com/id/1351440387/fr/vectoriel/m%C3%A9gaphone-avec-banni%C3%A8re-de-bulle-vocale-whats-new-haut-parleur-label-pour-les-affaires-le.jpg?s=612x612&w=0&k=20&c=urnToNM6GlNy8rDyHl8-7uNFWKBzQs16uSxteDXvhi4=",
      link: "/new-arrivals",
    },
  ];

  const recentlyViewed = [
    { id: 1, title: "The Great Gatsby", image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1650033243i/41733839.jpg" },
    { id: 2, title: "1984", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWvX2esDaX_a0_vN_EXQXccu-ZEKCTiQeEPQ&s" },
  ];

  const topDeals = [
    { id: 1, title: "50% Off Mystery Books", link: "/deals/mystery" },
    { id: 2, title: "Buy 2 Get 1 Free", link: "/deals/buy2get1" },
  ];

  const customerReview = {
    text: "Amazing selection and fast shipping! Highly recommend!",
    author: "John D.",
    rating: 4.5,
  };

  const allPurchaseUpdates = useMemo(
    () => [
      { id: 1, book: "The Great Gatsby", units: 30, location: "Tokyo", time: "10:40 AM" },
      { id: 2, book: "1984", units: 15, location: "London", time: "10:38 AM" },
      { id: 3, book: "Dune", units: 25, location: "New York", time: "10:35 AM" },
      { id: 4, book: "Harry Potter", units: 40, location: "Sydney", time: "10:32 AM" },
      { id: 5, book: "The Hobbit", units: 12, location: "Paris", time: "10:30 AM" },
      { id: 6, book: "Project Hail Mary", units: 22, location: "Lagos", time: "10:28 AM" },
    ],
    []
  );

  const [feedUpdates, setFeedUpdates] = useState(allPurchaseUpdates.slice(0, 4));
  const nextUpdateIndex = useRef(4);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFeedUpdates((currentFeed) => {
        const nextUpdate = allPurchaseUpdates[nextUpdateIndex.current % allPurchaseUpdates.length];
        nextUpdateIndex.current += 1;
        return [{ ...nextUpdate, id: Date.now() }, ...currentFeed.slice(0, 3)];
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, [allPurchaseUpdates]);

  useEffect(() => {
    const sections = document.querySelectorAll(".animate-fadeIn");
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = "1";
      }, index * 200);
    });
  }, [isOpen]);

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-red-600 text-white font-medium py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-red-700 transform hover:scale-105"
        >
          <Filter size={20} />
          Filters & Offers
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b animate-slideDown">
            <h3 className="font-bold text-xl text-gray-900">Filters & Offers</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 transition-transform hover:rotate-90">
              <X size={24} className="text-gray-700" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-grow">
            <div className="mb-8">
              {renderFilterSection("Categories", filterOptions.category, "category", Filter)}
              {renderFilterSection("Condition", filterOptions.condition, "condition", Filter)}
              <div className="mb-6 opacity-0 animate-fadeIn">
                <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-red-600" /> Price Range
                </h4>
                <ul className="space-y-2">
                  {filterOptions.price.map((range) => (
                    <li key={range.label} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`price-${range.label}`}
                        checked={filters.priceMin === range.min && filters.priceMax === range.max}
                        onChange={() => handlePriceFilter(range)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                      />
                      <label
                        htmlFor={`price-${range.label}`}
                        className="ml-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
                      >
                        {range.label} <span className="text-gray-400">({range.count})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              {renderFilterSection("Rating", filterOptions.rating, "rating", Star)}
              <div className="mb-6 opacity-0 animate-fadeIn">
                <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-red-600" /> Sort By
                </h4>
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 hover:bg-gray-100"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              <button
                onClick={() => setFilters({})}
                className="w-full bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
              >
                Clear Filters
              </button>
            </div>

            <div className="mt-8 opacity-0 animate-fadeIn">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5 text-red-600" /> Special Offers
              </h4>
              {campaignAds.map((ad) => (
                <div
                  key={ad.id}
                  className="mb-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {ad.video ? (
                    <video className="w-full h-24 object-cover" autoPlay loop muted playsInline>
                      <source src={ad.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={ad.image} alt={ad.title} className="w-full h-24 object-cover" />
                  )}
                  <div className="p-3">
                    <h5 className="font-semibold text-gray-800 text-sm">{ad.title}</h5>
                    <p className="text-xs text-gray-600">{ad.description}</p>
                    <Link to={ad.link} className="text-red-600 text-xs font-medium hover:underline mt-1 inline-block">
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <LivePurchaseUpdates updates={feedUpdates} />

            <div className="mt-8 opacity-0 animate-fadeIn">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Eye className="mr-2 h-5 w-5 text-red-600" /> Recently Viewed
              </h4>
              {recentlyViewed.map((book) => (
                <div key={book.id} className="flex items-center mb-4 transition-all duration-300 hover:bg-gray-100 p-2 rounded">
                  <img src={book.image} alt={book.title} className="w-12 h-12 object-cover rounded" />
                  <div className="ml-2">
                    <Link to={`/browse/${book.id}`} className="text-sm text-gray-800 hover:text-red-600">
                      {book.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 opacity-0 animate-fadeIn">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5 text-red-600" /> Top Deals
              </h4>
              {topDeals.map((deal) => (
                <Link
                  key={deal.id}
                  to={deal.link}
                  className="block mb-2 text-sm text-red-600 hover:underline transition-colors duration-200"
                >
                  {deal.title}
                </Link>
              ))}
            </div>

            <div className="mt-8 opacity-0 animate-fadeIn">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-red-600" /> Customer Reviews
              </h4>
              <div className="bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                <p className="text-sm text-gray-600">{customerReview.text}</p>
                <p className="text-xs text-gray-500 mt-1">- {customerReview.author}</p>
                <div className="mt-1">
                  <StarRating rating={customerReview.rating} starSize={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 pr-6">
        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl shadow-lg flex flex-col h-[calc(100vh-300px)] animate-slideIn">
          <h3 className="font-bold text-xl text-gray-900 mb-4 border-b pb-2 border-red-100">Filters & Offers</h3>
          <div className="overflow-y-auto pr-2 flex-grow">
            {renderFilterSection("Categories", filterOptions.category, "category", Filter)}
            {renderFilterSection("Condition", filterOptions.condition, "condition", Filter)}
            <div className="mb-6 opacity-0 animate-fadeIn">
              <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide flex items-center">
                <Filter className="mr-2 h-4 w-4 text-red-600" /> Price Range
              </h4>
              <ul className="space-y-2">
                {filterOptions.price.map((range) => (
                  <li key={range.label} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`price-${range.label}`}
                      checked={filters.priceMin === range.min && filters.priceMax === range.max}
                      onChange={() => handlePriceFilter(range)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                    />
                    <label
                      htmlFor={`price-${range.label}`}
                      className="ml-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
                    >
                      {range.label} <span className="text-gray-400">({range.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {renderFilterSection("Rating", filterOptions.rating, "rating", Star)}
            <div className="mb-6 opacity-0 animate-fadeIn">
              <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide flex items-center">
                <Filter className="mr-2 h-4 w-4 text-red-600" /> Sort By
              </h4>
              <select
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 hover:bg-gray-100"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <button
              onClick={() => setFilters({})}
              className="w-full bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
            >
              Clear Filters
            </button>
          </div>

          <div className="mt-6 border-t pt-4 border-gray-200 opacity-0 animate-fadeIn">
            <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Tag className="mr-2 h-5 w-5 text-red-600" /> Special Offers
            </h4>
            {campaignAds.map((ad) => (
              <div
                key={ad.id}
                className="mb-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {ad.video ? (
                  <video className="w-full h-24 object-cover" autoPlay loop muted playsInline>
                    <source src={ad.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={ad.image} alt={ad.title} className="w-full h-24 object-cover" />
                )}
                <div className="p-3">
                  <h5 className="font-semibold text-gray-800 text-sm">{ad.title}</h5>
                  <p className="text-xs text-gray-600">{ad.description}</p>
                  <Link to={ad.link} className="text-red-600 text-xs font-medium hover:underline mt-1 inline-block">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <LivePurchaseUpdates updates={feedUpdates} />

          <div className="mt-6 border-t pt-4 border-gray-200 opacity-0 animate-fadeIn">
            <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Eye className="mr-2 h-5 w-5 text-red-600" /> Recently Viewed
            </h4>
            {recentlyViewed.map((book) => (
              <div key={book.id} className="flex items-center mb-4 transition-all duration-300 hover:bg-gray-100 p-2 rounded">
                <img src={book.image} alt={book.title} className="w-12 h-12 object-cover rounded" />
                <div className="ml-2">
                  <Link to={`/browse/${book.id}`} className="text-sm text-gray-800 hover:text-red-600">
                    {book.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 border-gray-200 opacity-0 animate-fadeIn">
            <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Tag className="mr-2 h-5 w-5 text-red-600" /> Top Deals
            </h4>
            {topDeals.map((deal) => (
              <Link
                key={deal.id}
                to={deal.link}
                className="block mb-2 text-sm text-red-600 hover:underline transition-colors duration-200"
              >
                {deal.title}
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 border-gray-200 opacity-0 animate-fadeIn">
            <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-red-600" /> Customer Reviews
            </h4>
            <div className="bg-white p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
              <p className="text-sm text-gray-600">{customerReview.text}</p>
              <p className="text-xs text-gray-500 mt-1">- {customerReview.author}</p>
              <div className="mt-1">
                <StarRating rating={customerReview.rating} starSize={12} />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Main Page Content ---
const CategoryMainContent = ({ sortBy, setSortBy }) => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(40);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const gridRef = useRef(null); // Reference to the book grid container

  const filteredBooks = useMemo(() => {
    let filtered = books.filter((book) => {
      if (filters.category && book.genre !== filters.category) return false;
      if (filters.condition && book.condition !== filters.condition) return false;
      if (filters.priceMin != null && book.price < filters.priceMin) return false;
      if (filters.priceMax != null && (book.price > filters.priceMax || (filters.priceMax === Infinity && book.price < filters.priceMin)))
        return false;
      if (filters.rating != null && Math.floor(book.rating) !== filters.rating) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to the top of the book grid
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const visiblePages = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages, itemsPerPage]);

  return (
    <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          setSortBy={setSortBy}
        />

        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-center border-b border-gray-200 py-3 mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <label htmlFor="sort-by" className="font-medium text-gray-700 text-sm">
                Sort By:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 hover:bg-gray-100"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBooks.length)} of {filteredBooks.length}
            </div>
            <div className="flex items-center space-x-3">
              <label htmlFor="show" className="font-medium text-gray-700 text-sm">
                Show:
              </label>
              <select
                id="show"
                value={itemsPerPage}
                onChange={(e) => {
                  const newItemsPerPage = parseInt(e.target.value);
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                  // Scroll to the top of the book grid
                  if (gridRef.current) {
                    gridRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 hover:bg-gray-100"
              >
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="80">80</option>
              </select>
            </div>
          </div>

          <div ref={gridRef} className="h-[calc(100vh-300px)] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {currentBooks.length === 0 && (
              <p className="text-center text-gray-500 py-6">No books match your filters.</p>
            )}
          </div>

          {filteredBooks.length > itemsPerPage && (
            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-3 sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 text-sm"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-500 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105 text-sm"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Load More
              </button>
            </div>
          )}
          {filteredBooks.length > itemsPerPage && (
            <div className="mt-4 sm:mt-6 hidden sm:flex flex-wrap justify-center items-center gap-2 sm:gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    currentPage === page ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-all duration-300 transform hover:scale-105`}
                >
                  {page}
                </button>
              ))}
              {totalPages > visiblePages[visiblePages.length - 1] && <span className="text-gray-500 text-sm">...</span>}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-300 transform hover:scale-105"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const CategoryBrowsePage = () => {
  const [sortBy, setSortBy] = useState("relevance");

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopBar />
      <CategoryMainContent sortBy={sortBy} setSortBy={setSortBy} />
      <Footer />
    </div>
  );
};

export default CategoryBrowsePage;