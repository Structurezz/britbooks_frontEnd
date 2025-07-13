import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import TopBar from '../components/Topbar';
import BrowseCategoryDetail from '../components/BrowseCategoryDetail';

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// --- MOCK DATA (Updated with description field) ---
const books = [
  { id: 1, title: 'Bright Clock', author: 'Roland Tate', price: 2.99, imageUrl: 'https://imgv2-2-f.scribdassets.com/img/document/387004536/original/30b0510e93/1?v=1', releaseDate: '2023-05-15', genre: 'Fiction', condition: 'Excellent', description: 'A captivating tale of time and destiny, weaving intricate narratives through a futuristic lens.' },
  { id: 2, title: 'Winds of Dawn', author: 'Bella Cantor', price: 4.99, imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1214860251i/1195101.jpg', releaseDate: '2022-11-20', genre: 'Fantasy', condition: 'Good', description: 'An epic fantasy adventure exploring the rise of a young hero in a world of magic and mystery.' },
  { id: 3, title: 'True Balance', author: 'Ben Crofter', price: 3.99, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=0B2t0MxvPdy28a80cPhSNaQBfZgbOFgTHh5fo3g&s', releaseDate: '2023-01-30', genre: 'Non-Fiction', condition: 'Pristine', description: 'A guide to achieving personal and professional balance through mindfulness and strategy.' },
  { id: 4, title: 'Breaking Ties', author: 'Colin Porter', price: 4.99, imageUrl: 'https://m.media-amazon.com/images/I/81ztpdrPJuL._UF1000,1000_QL80_.jpg', releaseDate: '2021-08-25', genre: 'Mystery', condition: 'Good', description: 'A gripping mystery novel unraveling secrets and betrayals in a small town.' },
  { id: 5, title: 'Wild Corn Memory', author: 'Sonia Carter', price: 4.99, imageUrl: 'https://m.media-amazon.com/images/I/617R14LEQIL._AC_UF1000,1000_QL80_.jpg', releaseDate: '2023-08-01', genre: 'Romance', condition: 'Excellent', description: 'A heartfelt romance exploring love and loss in rural America.' },
  { id: 6, title: 'Silent Mirror', author: 'Collin Cantor', price: 4.99, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=0B2g-Zj-21bFSkVq5sS9odWKbrySD0jD-ELpA&s', releaseDate: '2023-09-10', genre: 'Fiction', condition: 'Good', description: 'A reflective novel about identity and self-discovery in a fractured world.' },
  { id: 7, title: 'Tales of Great Courage', author: 'Conrad Dior', price: 3.99, imageUrl: 'https://www.gutenberg.org/cache/epub/32438/pg32438.cover.medium.jpg', releaseDate: '2020-07-07', genre: 'Historical', condition: 'Standard', description: 'A collection of historical stories celebrating bravery and sacrifice.' },
  { id: 8, title: 'Hidden Fears', author: 'Bella Cantor', price: 5.99, imageUrl: 'https://m.media-amazon.com/images/I/81Pr1eWE-dL._UF1000,1000_QL80_.jpg', releaseDate: '2023-10-02', genre: 'Thriller', condition: 'Pristine', description: 'A chilling thriller that delves into the depths of human fear and suspense.' },
  { id: 9, title: 'Glowing Stone', author: 'Vladimir Mooney', price: 4.99, imageUrl: 'https://m.media-amazon.com/images/I/51vs137KzFL._AC_UF1000,1000_QL80_.jpg', releaseDate: '2022-03-12', genre: 'Fantasy', condition: 'Good', description: 'A fantasy saga centered around a mystical stone with unimaginable power.' },
  { id: 10, title: 'Soft Solution', author: 'Paolo Harris', price: 3.99, imageUrl: 'https://isbncoverdb.com/images/book-cover-soft-matter-physics-instructors-solution-manual-solutions.webp', releaseDate: '2023-11-05', genre: 'Non-Fiction', condition: 'Excellent', description: 'An insightful exploration of problem-solving in physics and beyond.' },
  { id: 11, title: 'Newest Arrivals', author: 'Kael Flowers', price: 5.99, imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1635768733i/34689759._UX160_.jpg', releaseDate: '2023-11-15', genre: 'Fiction', condition: 'Pristine', description: 'A modern tale of discovery and new beginnings in an ever-changing world.' },
  { id: 12, title: 'Brave Venture', author: 'Sigmara Garnet', price: 6.99, imageUrl: 'https://m.media-amazon.com/images/I/61lp-0XLC7L.jpg', releaseDate: '2023-04-18', genre: 'Adventure', condition: 'Good', description: 'An exhilarating adventure story of exploration and courage.' },
];

// --- Reusable BookCard Component ---
const BookCard = ({ book }: { book: typeof books[0] }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 transition-shadow duration-300 hover:shadow-lg cursor-pointer"
      onClick={() => navigate(`/browse/${book.id}`)}
    >
      <img src={book.imageUrl} alt={`Cover of ${book.title}`} className="w-full h-64 object-cover rounded-md mb-4" />
      <h4 className="text-md font-bold text-gray-800 truncate">{book.title}</h4>
      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
      <p className="text-lg font-bold text-red-600">£{book.price.toFixed(2)}</p>
      <p className="text-xs text-gray-500 mt-1">{book.genre} • {book.condition}</p>
    </div>
  );
};

// --- Filter Sidebar Component ---
const FilterSidebar = ({ filters, setFilters, isOpen, toggleSidebar }: { filters: any; setFilters: (filters: any) => void; isOpen: boolean; toggleSidebar: () => void }) => {
  const [openSections, setOpenSections] = useState({
    genre: true,
    author: true,
    condition: true,
    price: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const genres = Array.from(new Set(books.map(book => book.genre)));
  const authors = Array.from(new Set(books.map(book => book.author)));
  const conditions = ['Pristine', 'Excellent', 'Good', 'Standard'];

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-50 w-72 bg-white rounded-lg shadow-sm transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-72 max-h-[calc(100vh-2rem)] overflow-y-auto lg:h-fit lg:overflow-y-visible ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } lg:block`}
    >
      <div className="h-full flex flex-col">
        {/* Header (mobile close button) */}
        <div className="p-6 flex justify-between items-center mb-2 lg:hidden">
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          <button onClick={toggleSidebar} className="text-gray-500" aria-label="Close filter sidebar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 hidden lg:block">Filters</h2>
          <div className="pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('genre')}>
              Genre / Category {openSections.genre ? <ChevronUpIcon className="text-gray-500" /> : <ChevronDownIcon className="text-gray-500" />}
            </h3>
            {openSections.genre && (
              <div className="space-y-2">
                {genres.map(genre => (
                  <label key={genre} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.genres.includes(genre)}
                      onChange={() => {
                        setFilters({
                          ...filters,
                          genres: filters.genres.includes(genre) ? filters.genres.filter((g: string) => g !== genre) : [...filters.genres, genre],
                        });
                      }}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">{genre}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="py-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('author')}>
              Author {openSections.author ? <ChevronUpIcon className="text-gray-500" /> : <ChevronDownIcon className="text-gray-500" />}
            </h3>
            {openSections.author && (
              <div className="space-y-2">
                {authors.map(author => (
                  <label key={author} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.authors.includes(author)}
                      onChange={() => {
                        setFilters({
                          ...filters,
                          authors: filters.authors.includes(author) ? filters.authors.filter((a: string) => a !== author) : [...filters.authors, author],
                        });
                      }}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">{author}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="py-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('condition')}>
              Condition {openSections.condition ? <ChevronUpIcon className="text-gray-500" /> : <ChevronDownIcon className="text-gray-500" />}
            </h3>
            {openSections.condition && (
              <div className="space-y-2">
                {conditions.map((condition, index) => (
                  <label key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.conditions.includes(condition)}
                      onChange={() => {
                        setFilters({
                          ...filters,
                          conditions: filters.conditions.includes(condition) ? filters.conditions.filter((c: string) => c !== condition) : [...filters.conditions, condition],
                        });
                      }}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-1">
                      {[...Array(5 - index)].map((_, i) => (
                        <StarIcon key={i} className="text-yellow-400" />
                      ))}
                      {[...Array(index)].map((_, i) => (
                        <StarIcon key={i + 5 - index} className="text-gray-300" />
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="py-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('price')}>
              Price Range {openSections.price ? <ChevronUpIcon className="text-gray-500" /> : <ChevronDownIcon className="text-gray-500" />}
            </h3>
            {openSections.price && (
              <div>
                <div className="flex space-x-2 mb-4">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) || 0 })}
                    placeholder="Min"
                    className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) || 100 })}
                    placeholder="Max"
                    className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative h-1 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-1 bg-blue-600"
                    style={{
                      left: `${(filters.priceMin / 100) * 100}%`,
                      width: `${((filters.priceMax - filters.priceMin) / 100) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-blue-600 rounded-full cursor-pointer"
                    style={{ left: `${(filters.priceMin / 100) * 100}%` }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-blue-600 rounded-full cursor-pointer"
                    style={{ left: `${(filters.priceMax / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>£0</span>
                  <span>£100</span>
                </div>
              </div>
            )}
          </div>
          <div className="pt-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex justify-between items-center cursor-pointer" onClick={() => toggleSection('availability')}>
              Availability {openSections.availability ? <ChevronUpIcon className="text-gray-500" /> : <ChevronDownIcon className="text-gray-500" />}
            </h3>
            {openSections.availability && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={() => setFilters({ ...filters, inStock: !filters.inStock })}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">In Stock</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

// --- Main Content Area ---
const BritBooksMainContent = () => {
  const [sortOption, setSortOption] = useState('price-low-high');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genres: [] as string[],
    authors: [] as string[],
    conditions: [] as string[],
    priceMin: 0,
    priceMax: 10,
    inStock: true,
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const sortedBooks = useMemo(() => {
    let filtered = [...books];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.genres.length > 0) {
      filtered = filtered.filter(book => filters.genres.includes(book.genre));
    }
    if (filters.authors.length > 0) {
      filtered = filtered.filter(book => filters.authors.includes(book.author));
    }
    if (filters.conditions.length > 0) {
      filtered = filtered.filter(book => filters.conditions.includes(book.condition));
    }
    filtered = filtered.filter(book => book.price >= filters.priceMin && book.price <= filters.priceMax);
    if (filters.inStock) {
      filtered = filtered.filter(book => true); // Placeholder: assume all books are in stock
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      case 'price-low-high':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return filtered.sort((a, b) => b.price - a.price);
      case 'relevance':
      default:
        return filtered;
    }
  }, [sortOption, searchQuery, filters]);

  const sortOptions = [
    { key: 'relevance', label: 'Relevance' },
    { key: 'price-low-high', label: 'Price: Low to High' },
    { key: 'price-high-low', label: 'Price: High to Low' },
    { key: 'newest', label: 'Newest Arrivals' },
  ];

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-16 lg:pb-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Browse Books</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full sm:w-auto p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleFilterSidebar}
                  className="lg:hidden bg-blue-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm"
                >
                  Filters
                </button>
              </div>
            </div>
          </div>
          {sortedBooks.length === 0 ? (
            <p className="text-gray-500 text-center">No books found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {sortedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isOpen={isFilterSidebarOpen}
          toggleSidebar={toggleFilterSidebar}
        />
      </div>
    </main>
  );
};

// --- CategoryBrowsePage Component ---
const CategoryBrowsePage = () => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans flex-col">
      {/* Overlay for mobile when filter sidebar is open */}
      {isFilterSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <TopBar toggleFilterSidebar={toggleFilterSidebar} />
        <BritBooksMainContent />
        <Footer />
      </div>
    </div>
  );
};

export default CategoryBrowsePage;