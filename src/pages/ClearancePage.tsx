import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Search, Gift, Book as BookIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TopBar from '../components/Topbar';
import Footer from '../components/footer';
import { fetchBooks, Book } from '../data/books';
import { useCart } from "../context/cartContext";

// --- Reusable Components ---

const StarRating = ({ rating, starSize = 16 }: { rating: number; starSize?: number }) => (
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

const BookCard = ({ book }: { book: Book & { originalPrice: number } }) => {
  const { addToCart } = useCart();
  const numericPrice = book.price;
  const numericOriginalPrice = book.originalPrice;
  const discount = Math.round(((numericOriginalPrice - numericPrice) / numericOriginalPrice) * 100);

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      img: book.imageUrl || "https://via.placeholder.com/150",
      title: book.title,
      author: book.author,
      price: `£${numericPrice.toFixed(2)}`,
      quantity: 1,
    });
    toast.success(`${book.title} added to your basket!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden transform hover:-translate-y-1">
      <div className="relative">
        <Link to={`/browse/${book.id}`} className="block">
          <img
            src={book.imageUrl || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-full h-40 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
          -{discount}%
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <Link to={`/browse/${book.id}`}>
            <button className="bg-white text-gray-900 px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-gray-200">
              QUICK VIEW
            </button>
          </Link>
        </div>
      </div>
      <div className="p-2 sm:p-4 flex flex-col flex-grow items-center text-center">
        <h4 className="font-semibold text-xs sm:text-sm text-gray-800 h-10 leading-5 mb-1 sm:mb-1 line-clamp-2">{book.title}</h4>
        <p className="text-xs text-gray-500 mb-1 sm:mb-2">{book.author}</p>
        <div className="mb-1 sm:mb-2">
          <StarRating rating={book.rating || 0} starSize={12} />
        </div>
        <div className="flex items-center gap-2 mt-auto mb-2 sm:mb-3">
          <p className="text-base sm:text-xl font-bold text-red-600">£{numericPrice.toFixed(2)}</p>
          <p className="text-gray-400 line-through text-xs sm:text-sm">£{numericOriginalPrice.toFixed(2)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white font-bold py-1 sm:py-2 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ADD TO BASKET
        </button>
      </div>
    </div>
  );
};

const QuizModal = ({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: (answers: string[]) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const questions = [
    {
      question: "Which genre do you enjoy most?",
      options: ["Fiction", "Non-Fiction", "Fantasy", "Mystery"],
    },
    {
      question: "How often do you read books?",
      options: ["Daily", "Weekly", "Monthly", "Rarely"],
    },
    {
      question: "What's your favorite book format?",
      options: ["Hardcover", "Paperback", "E-book", "Audiobook"],
    },
  ];

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(answers.concat(answer));
      setCurrentQuestion(0);
      setAnswers([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Book Lover's Quiz</h2>
        <p className="mb-4">{questions[currentQuestion].question}</p>
        <div className="grid grid-cols-2 gap-2">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SurveyModal = ({ isOpen, onClose, onComplete }: { isOpen: boolean; onClose: () => void; onComplete: (feedback: string) => void }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim()) {
      onComplete(feedback);
      setFeedback('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Tell Us About Your Reading!</h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your favorite book or reading experience..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={4}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const ClearancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [points, setPoints] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [clearanceBooks, setClearanceBooks] = useState<(Book & { originalPrice: number })[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BOOKS_PER_PAGE = 12;
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Fetch clearance books
  useEffect(() => {
    const fetchClearanceBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { books, total } = await fetchBooks({
          page: currentPage,
          limit: BOOKS_PER_PAGE,
          filters: { search: searchTerm || undefined },
          sort: sortBy === 'priceLowHigh' ? 'price' : sortBy === 'priceHighLow' ? 'price' : sortBy === 'rating' ? 'rating' : undefined,
          order: sortBy === 'priceHighLow' ? 'desc' : sortBy === 'rating' ? 'desc' : 'asc',
        });
        const booksWithDiscounts = books.map(book => ({
          ...book,
          originalPrice: book.price * (1 + (Math.random() * 0.5 + 0.2)), // Random discount 20–70%
        }));
        setClearanceBooks(booksWithDiscounts);
        setTotalBooks(total);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load clearance books. Please try again.");
        setIsLoading(false);
        console.error("❌ Failed to fetch clearance books:", err instanceof Error ? err.message : err);
      }
    };
    fetchClearanceBooks();
  }, [currentPage, searchTerm, sortBy]);

  const filteredAndSortedBooks = useMemo(() => {
    return clearanceBooks.sort((a, b) => {
      const getDiscount = (book: Book & { originalPrice: number }) => 1 - (book.price / book.originalPrice);
      if (sortBy === 'discount') return getDiscount(b) - getDiscount(a);
      return 0; // Other sorts handled by API
    });
  }, [clearanceBooks, sortBy]);

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
  const paginatedBooks = filteredAndSortedBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      if (gridRef.current) {
        gridRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleQuizComplete = (answers: string[]) => {
    setPoints(points + 50);
    setShowQuiz(false);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  const handleSurveyComplete = (feedback: string) => {
    setPoints(points + 30);
    setShowSurvey(false);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-8 py-16 text-center">
          <p className="text-gray-500 text-lg">Loading clearance books...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <TopBar />
        <div className="container mx-auto px-4 sm:px-8 py-16 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <TopBar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white text-center py-12 md:py-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Clearance Sale</h1>
          <p className="mt-4 text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
            Unbeatable prices on your next favorite book. Grab these limited-time deals before they're gone!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setShowQuiz(true)}
              className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
            >
              <BookIcon size={20} /> Take Our Quiz!
            </button>
            <button
              onClick={() => setShowSurvey(true)}
              className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
            >
              <Gift size={20} /> Share Your Feedback
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="discount">Sort by Best Discount</option>
              <option value="priceLowHigh">Sort by Price: Low to High</option>
              <option value="priceHighLow">Sort by Price: High to Low</option>
              <option value="rating">Sort by Highest Rating</option>
            </select>
          </div>

          <div className="mb-8 bg-yellow-100 p-4 rounded-lg flex items-center gap-2">
            <Gift size={24} className="text-yellow-600" />
            <p className="text-gray-800">
              Earn <strong>{points}</strong> points! Complete quizzes and surveys for a chance to win free books!
            </p>
          </div>

          {showReward && (
            <div className="mb-8 bg-green-100 p-4 rounded-lg flex items-center gap-2 animate-bounce">
              <Gift size={24} className="text-green-600" />
              <p className="text-gray-800">Congrats! You've earned points for a chance to win a free book!</p>
            </div>
          )}

          {paginatedBooks.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <h3 className="text-xl font-semibold">No Books Found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}

          {totalBooks > BOOKS_PER_PAGE && (
            <div className="flex justify-center items-center mt-10 space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-800 font-medium text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-full disabled:opacity-50 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>
      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
      <SurveyModal
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        onComplete={handleSurveyComplete}
      />
      <Footer />
    </div>
  );
};

export default ClearancePage;