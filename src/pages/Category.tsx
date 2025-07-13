import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Star } from "lucide-react";
import Footer from "../components/footer";
import TopBar from "../components/Topbar";
import { books } from "../data/books"; // Import the 1 million books

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
const BookCard = ({ book }) => {
  return (
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
};

// Filter Sidebar with Campaign Ads
const FilterSidebar = ({ filters, setFilters }) => {
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
    };

    books.forEach((book) => {
      const mappedCategory = categories.includes(book.genre) ? book.genre : "Uncategorized";
      counts.category[mappedCategory] = (counts.category[mappedCategory] || 0) + 1;
      counts.condition[book.condition] = (counts.condition[book.condition] || 0) + 1;
      const priceIndex = priceRanges.findIndex(
        (range) => book.price >= range.min && (book.price <= range.max || range.max === Infinity)
      );
      if (priceIndex !== -1) {
        counts.price[priceIndex]++;
      }
    });

    return {
      category: Object.fromEntries(categories.map((cat) => [cat, counts.category[cat] || 0])),
      condition: Object.entries(counts.condition),
      price: priceRanges.map((range, i) => ({ ...range, count: counts.price[i] })),
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

  const renderFilterSection = (title, options, filterKey) => (
    <div className="mb-6">
      <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">{title}</h4>
      <ul className="space-y-2">
        {Object.entries(options).map(([value, count]) => (
          <li key={value} className="flex items-center">
            <input
              type="checkbox"
              id={`${filterKey}-${value}`}
              checked={filters[filterKey] === value}
              onChange={() => handleFilterClick(filterKey, value)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`${filterKey}-${value}`}
              className="ml-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              {value} <span className="text-gray-400">({count})</span>
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

  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5 pr-6">
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[calc(100vh-200px)]">
        <h3 className="font-bold text-xl text-gray-900 mb-6 border-b-2 border-red-100 pb-2">Filters & Offers</h3>

        <div className="mb-8">
          {renderFilterSection("Categories", filterOptions.category, "category")}
          {renderFilterSection("Condition", filterOptions.condition, "condition")}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Price Range</h4>
            <ul className="space-y-2">
              {filterOptions.price.map((range) => (
                <li key={range.label} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`price-${range.label}`}
                    checked={filters.priceMin === range.min && filters.priceMax === range.max}
                    onChange={() => handlePriceFilter(range)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`price-${range.label}`}
                    className="ml-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    {range.label} <span className="text-gray-400">({range.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setFilters({})}
            className="w-full bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-8">
          <h4 className="font-bold text-lg text-gray-900 mb-4">Special Offers</h4>
          {campaignAds.map((ad) => (
            <div
              key={ad.id}
              className="mb-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {ad.video ? (
                <video
                  className="w-full h-24 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
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
      </div>
    </aside>
  );
};

// --- Main Page Content ---
const CategoryMainContent = () => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Default items per page

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filters.category && book.genre !== filters.category) return false;
      if (filters.condition && book.condition !== filters.condition) return false;
      if (filters.priceMin != null && book.price < filters.priceMin) return false;
      if (filters.priceMax != null && (book.price > filters.priceMax || (filters.priceMax === Infinity && book.price < filters.priceMin)))
        return false;
      return true;
    });
  }, [filters]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
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
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <FilterSidebar filters={filters} setFilters={setFilters} />

        <div className="w-full lg:w-3/4">
          <div className="flex flex-wrap justify-between items-center border-b border-gray-200 py-3 mb-6">
            <div className="flex items-center space-x-3">
              <label htmlFor="sort-by" className="font-medium text-gray-700">Sort By:</label>
              <select
                id="sort-by"
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={(e) => {
                  // Add sorting logic here if needed
                }}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBooks.length)} of {filteredBooks.length}
            </div>
            <div className="flex items-center space-x-3">
              <label htmlFor="show" className="font-medium text-gray-700">Show:</label>
              <select
                id="show"
                value={itemsPerPage}
                onChange={(e) => {
                  const newItemsPerPage = parseInt(e.target.value);
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1); // Reset to first page on change
                }}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          {currentBooks.length === 0 && (
            <p className="text-center text-gray-500 py-6">No books match your filters.</p>
          )}

          {filteredBooks.length > itemsPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${currentPage === page ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-colors`}
                >
                  {page}
                </button>
              ))}
              {totalPages > visiblePages[visiblePages.length - 1] && <span className="text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ml-2"
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
  return (
    <div className="bg-gray-50 min-h-screen">
      <TopBar />
      <CategoryMainContent />
      <Footer />
    </div>
  );
};

export default CategoryBrowsePage;