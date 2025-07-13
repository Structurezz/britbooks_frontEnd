import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star } from 'lucide-react';

import Footer from '../components/footer';
import TopBar from '../components/Topbar';
import { books } from '../data/books'; // Make sure this path is correct

// --- Reusable Components ---

// Star Rating Component
const StarRating = ({ rating, starSize = 16 }) => (
  <div className="flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={starSize}
        className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
        fill={i < Math.round(rating) ? 'currentColor' : 'none'}
      />
    ))}
  </div>
);

// New Book Card Component to match the design
const BookCard = ({ book }) => {
  return (
    <div className="bg-white text-center border border-gray-200 group flex flex-col">
      <div className="relative bg-gray-100 p-4 flex-shrink-0">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-64 object-cover mx-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={() => alert(`Showing quick view for ${book.title}`)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 bg-black bg-opacity-75 text-white text-xs font-bold py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          QUICK VIEW
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow items-center">
        <h4 className="font-semibold text-sm text-gray-800 h-10 leading-5 mb-1">{book.title}</h4>
        <p className="text-xs text-gray-500 mb-2">{book.author}</p>
        <div className="mb-2">
            <StarRating rating={book.rating} />
        </div>
        <p className="text-lg font-bold text-gray-800 mt-auto mb-3">£{book.price.toFixed(2)}</p>
        <button
          onClick={() => alert('Added to basket!')}
          className="w-full bg-red-500 text-white font-bold py-2 hover:bg-red-600 transition-colors text-sm"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

// Rebuilt Filter Sidebar to match the design
const FilterSidebar = ({ filters, setFilters }) => {
  const priceRanges = [
    { label: 'Less than £2.99', min: 0, max: 2.99 },
    { label: '£3.00 - £5.99', min: 3, max: 5.99 },
    { label: '£6.00 - £8.99', min: 6, max: 8.99 },
    { label: '£9.00 - £11.99', min: 9, max: 11.99 },
    { label: '£12.00 - £14.99', min: 12, max: 14.99 },
  ];

  const filterOptions = useMemo(() => {
    const counts = {
      coverType: {},
      condition: {},
      ageRange: {},
      price: priceRanges.map(() => 0),
    };

    books.forEach(book => {
      // @ts-ignore
      counts.coverType[book.coverType] = (counts.coverType[book.coverType] || 0) + 1;
      // @ts-ignore
      counts.condition[book.condition] = (counts.condition[book.condition] || 0) + 1;
      // @ts-ignore
      counts.ageRange[book.ageRange] = (counts.ageRange[book.ageRange] || 0) + 1;
      
      const priceIndex = priceRanges.findIndex(range => book.price >= range.min && book.price <= range.max);
      if (priceIndex !== -1) {
        counts.price[priceIndex]++;
      }
    });

    return {
      coverType: Object.entries(counts.coverType),
      condition: Object.entries(counts.condition),
      ageRange: Object.entries(counts.ageRange),
      price: priceRanges.map((range, i) => ({ ...range, count: counts.price[i] })),
    };
  }, []);

  const handleFilterClick = (filterType, value) => {
     setFilters(prev => ({ ...prev, [filterType]: prev[filterType] === value ? null : value }));
  };
    
  const handlePriceFilter = (range) => {
      setFilters(prev => ({
          ...prev,
          priceMin: prev.priceMin === range.min ? null : range.min,
          priceMax: prev.priceMax === range.max ? null : range.max,
      }))
  }

  const renderFilterSection = (title, options, filterKey) => (
    <div className="mb-6">
      <h4 className="font-semibold mb-2 text-sm">{title}</h4>
      <ul className="space-y-1 text-sm">
        {options.map(([value, count]) => (
          <li key={value}>
            <button
              onClick={() => handleFilterClick(filterKey, value)}
              className={`hover:text-red-500 text-left w-full ${filters[filterKey] === value ? 'font-bold text-red-500' : ''}`}
            >
              {value} <span className="text-gray-400">({count})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5 pr-8">
      <div className="bg-gray-50 p-6">
        <h3 className="font-bold text-lg mb-4">Shopping Options</h3>
        {renderFilterSection('Cover type', filterOptions.coverType, 'coverType')}
        {renderFilterSection('Conditions', filterOptions.condition, 'condition')}
        {renderFilterSection('Age Ranges', filterOptions.ageRange, 'ageRange')}

        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm">Price range</h4>
          <ul className="space-y-1 text-sm">
            {filterOptions.price.map(range => (
                <li key={range.label}>
                    <button onClick={() => handlePriceFilter(range)} className={`hover:text-red-500 text-left w-full ${filters.priceMin === range.min ? 'font-bold text-red-500' : ''}`}>
                       {range.label} <span className="text-gray-400">({range.count})</span>
                    </button>
                </li>
            ))}
          </ul>
        </div>
        
        <button onClick={() => setFilters({})} className="mt-4 w-full bg-gray-200 text-gray-700 font-bold py-2 hover:bg-gray-300 text-xs">
          CLEAR FILTERS
        </button>
      </div>
    </aside>
  );
};


// --- MAIN PAGE CONTENT --- //
const CategoryMainContent = () => {
  const [filters, setFilters] = useState({});

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
        // @ts-ignore
      if (filters.coverType && book.coverType !== filters.coverType) return false;
        // @ts-ignore
      if (filters.condition && book.condition !== filters.condition) return false;
        // @ts-ignore
      if (filters.ageRange && book.ageRange !== filters.ageRange) return false;
        // @ts-ignore
      if (filters.priceMin != null && book.price < filters.priceMin) return false;
        // @ts-ignore
      if (filters.priceMax != null && book.price > filters.priceMax) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col lg:flex-row">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        
        <div className="w-full lg:w-3/4 xl:w-4/5 mt-8 lg:mt-0">
          <div className="flex flex-wrap justify-between items-center border-t border-b py-2 mb-6 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <label htmlFor="sort-by" className="font-semibold">Short By:</label>
              <select id="sort-by" className="border-gray-300 rounded-sm py-1 pl-1 pr-6 focus:ring-0 focus:border-gray-400 text-sm">
                <option>Name</option>
                <option>Price</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              1-{Math.min(20, filteredBooks.length)} of {filteredBooks.length}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <label htmlFor="show" className="font-semibold">Show:</label>
              <select id="show" className="border-gray-300 rounded-sm py-1 pl-1 pr-6 focus:ring-0 focus:border-gray-400 text-sm">
                <option>20</option>
                <option>40</option>
              </select>
            </div>
             <div className="flex items-center space-x-1 text-sm">
              <span className="font-bold">1</span>
              <button className="text-gray-600 hover:text-black">2</button>
              <button className="text-gray-600 hover:text-black">3</button>
              <button className="text-gray-600 hover:text-black">{'>'}</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT --- //
const CategoryBrowsePage = () => {
  return (
    <div className="bg-white">
      <TopBar />
      <CategoryMainContent />
      <Footer />
    </div>
  );
};

export default CategoryBrowsePage;