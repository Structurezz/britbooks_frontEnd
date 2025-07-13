
import { v4 as uuidv4 } from "uuid"; // For unique IDs if needed

// Base books array
const baseBooks = [
  {
    id: 1,
    title: "Bright Clock",
    author: "Roland Tate",
    price: 2.99,
    imageUrl: "https://imgv2-2-f.scribdassets.com/img/document/387004536/original/30b0510e93/1?v=1",
    releaseDate: "2023-05-15",
    genre: "Fiction",
    condition: "Excellent",
    description: "A captivating tale of time and destiny, weaving intricate narratives through a futuristic lens.",
    stock: 12,
    rating: 4.5,
    isbn: "978-1-234567-89-0",
    pages: 320,
  },
  {
    id: 2,
    title: "Winds of Dawn",
    author: "Bella Cantor",
    price: 4.99,
    imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1214860251i/1195101.jpg",
    releaseDate: "2022-11-20",
    genre: "Fantasy",
    condition: "Good",
    description: "An epic fantasy adventure exploring the rise of a young hero in a world of magic and mystery.",
    stock: 8,
    rating: 4.2,
    isbn: "978-0-987654-32-1",
    pages: 450,
  },
  {
    id: 3,
    title: "True Balance",
    author: "Ben Crofter",
    price: 3.99,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUecdyeggdMkOshCh880Rs_5cn5YVOQjyuig&s",
    releaseDate: "2023-01-30",
    genre: "Non-Fiction",
    condition: "Pristine",
    description: "A guide to achieving personal and professional balance through mindfulness and strategy.",
    stock: 20,
    rating: 4.8,
    isbn: "978-1-543210-98-7",
    pages: 280,
  },
  {
    id: 4,
    title: "Breaking Ties",
    author: "Colin Porter",
    price: 4.99,
    imageUrl: "https://m.media-amazon.com/images/I/81ztpdrPJuL._UF1000,1000_QL80_.jpg",
    releaseDate: "2021-08-25",
    genre: "Mystery",
    condition: "Good",
    description: "A gripping mystery novel unraveling secrets and betrayals in a small town.",
    stock: 5,
    rating: 4.0,
    isbn: "978-2-345678-90-1",
    pages: 360,
  },
  {
    id: 5,
    title: "Wild Corn Memory",
    author: "Sonia Carter",
    price: 4.99,
    imageUrl: "https://m.media-amazon.com/images/I/617R14LEQIL._AC_UF1000,1000_QL80_.jpg",
    releaseDate: "2023-08-01",
    genre: "Romance",
    condition: "Excellent",
    description: "A heartfelt romance exploring love and loss in rural America.",
    stock: 15,
    rating: 4.3,
    isbn: "978-3-456789-01-2",
    pages: 300,
  },
  {
    id: 6,
    title: "Silent Mirror",
    author: "Collin Cantor",
    price: 4.99,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:GcQQg-Zj-21bFSkVq5sS9odWKbrySD0jD-ELpA&s",
    releaseDate: "2023-09-10",
    genre: "Fiction",
    condition: "Good",
    description: "A reflective novel about identity and self-discovery in a fractured world.",
    stock: 10,
    rating: 4.1,
    isbn: "978-4-567890-12-3",
    pages: 340,
  },
  {
    id: 7,
    title: "Tales of Great Courage",
    author: "Conrad Dior",
    price: 3.99,
    imageUrl: "https://www.gutenberg.org/cache/epub/32438/pg32438.cover.medium.jpg",
    releaseDate: "2020-07-07",
    genre: "Historical",
    condition: "Standard",
    description: "A collection of historical stories celebrating bravery and sacrifice.",
    stock: 7,
    rating: 4.4,
    isbn: "978-5-678901-23-4",
    pages: 400,
  },
  {
    id: 8,
    title: "Hidden Fears",
    author: "Bella Cantor",
    price: 5.99,
    imageUrl: "https://m.media-amazon.com/images/I/81Pr1eWE-dL._UF1000,1000_QL80_.jpg",
    releaseDate: "2023-10-02",
    genre: "Thriller",
    condition: "Pristine",
    description: "A chilling thriller that delves into the depths of human fear and suspense.",
    stock: 3,
    rating: 4.7,
    isbn: "978-6-789012-34-5",
    pages: 380,
  },
  {
    id: 9,
    title: "Glowing Stone",
    author: "Vladimir Mooney",
    price: 4.99,
    imageUrl: "https://m.media-amazon.com/images/I/51vs137KzFL._AC_UF1000,1000_QL80_.jpg",
    releaseDate: "2022-03-12",
    genre: "Fantasy",
    condition: "Good",
    description: "A fantasy saga centered around a mystical stone with unimaginable power.",
    stock: 9,
    rating: 4.6,
    isbn: "978-7-890123-45-6",
    pages: 500,
  },
  {
    id: 10,
    title: "Soft Solution",
    author: "Paolo Harris",
    price: 3.99,
    imageUrl: "https://isbncoverdb.com/images/book-cover-soft-matter-physics-instructors-solution-manual-solutions.webp",
    releaseDate: "2023-11-05",
    genre: "Non-Fiction",
    condition: "Excellent",
    description: "An insightful exploration of problem-solving in physics and beyond.",
    stock: 18,
    rating: 4.9,
    isbn: "978-8-901234-56-7",
    pages: 260,
  },
  {
    id: 11,
    title: "Newest Arrivals",
    author: "Kael Flowers",
    price: 5.99,
    imageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1635768733i/34689759._UX160_.jpg",
    releaseDate: "2023-11-15",
    genre: "Fiction",
    condition: "Pristine",
    description: "A modern tale of discovery and new beginnings in an ever-changing world.",
    stock: 14,
    rating: 4.3,
    isbn: "978-9-012345-67-8",
    pages: 310,
  },
  {
    id: 12,
    title: "Brave Venture",
    author: "Sigmara Garnet",
    price: 6.99,
    imageUrl: "https://m.media-amazon.com/images/I/61lp-0XLC7L.jpg",
    releaseDate: "2023-04-18",
    genre: "Adventure",
    condition: "Good",
    description: "An exhilarating adventure story of exploration and courage.",
    stock: 6,
    rating: 4.5,
    isbn: "978-0-123456-78-9",
    pages: 420,
  },
  {
    id: 13,
    title: "Blue Moon",
    author: "Lee Child",
    price: 10.99,
    imageUrl: "https://placehold.co/192x240/0000FF/FFFFFF?text=Blue+Moon",
  },
  {
    id: 14,
    title: "Queenie",
    author: "Candice Carty-Williams",
    price: 8.99,
    imageUrl: "https://placehold.co/192x240/FFC0CB/000000?text=Queenie",
  },
  {
    id: 15,
    title: "Why is Snot Green?",
    author: "Glenn Murphy",
    price: 7.5,
    imageUrl: "https://placehold.co/192x240/32CD32/FFFFFF?text=Why+is+Snot+Green?",
  },
  {
    id: 16,
    title: "The Hunting Party",
    author: "Lucy Foley",
    price: 12.0,
    imageUrl: "https://placehold.co/192x240/FFFF00/000000?text=The+Hunting+Party",
  },
  {
    id: 17,
    title: "The Girl of Ink & Stars",
    author: "Kiran Millwood Hargrave",
    price: 9.99,
    imageUrl: "https://placehold.co/192x240/000000/FFFFFF?text=The+Girl+of+Ink",
  },
  {
    id: 18,
    title: "The Beast of Buckingham Palace",
    author: "David Walliams",
    price: 11.5,
    imageUrl: "https://placehold.co/192x240/FFA500/000000?text=The+Beast",
  },
  {
    id: 19,
    title: "Another Great Book",
    author: "Jane Doe",
    price: 14.99,
    imageUrl: "https://placehold.co/192x240/800080/FFFFFF?text=Another+Book",
  },
  {
    id: 20,
    title: "The Magical Tree",
    author: "A. A. Author",
    price: 6.99,
    imageUrl: "https://placehold.co/192x240/FF4500/FFFFFF?text=Childrens+Story",
  },
];

// Function to generate a large number of books
const generateMillionBooks = () => {
  const genres = [
    "Fiction",
    "Fantasy",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Thriller",
    "Historical",
    "Adventure",
  ];
  const conditions = ["Excellent", "Good", "Pristine", "Standard"];
  const baseCount = 50_000; // Generate 50,000 sets of 20 books to reach ~1M
  const booksArray = [];

  for (let i = 0; i < baseCount; i++) {
    baseBooks.forEach((book, index) => {
      const newId = i * 20 + index + 1;
      const suffix = ` ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26)}`; // Unique suffix (e.g., A0, B1, etc.)
      const newBook = {
        id: newId,
        title: `${book.title}${suffix}`,
        author: `${book.author?.split(" ")[0] ?? "Author"} ${book.author?.split(" ")[1]?.[0] ?? "A"}${Math.floor(Math.random() * 100)}`,
        price: parseFloat((book.price + (Math.random() * 5 - 2.5)).toFixed(2)), // ±2.5 variation
      
        imageUrl: book.imageUrl,
        
        // Safely generate releaseDate
        releaseDate: (() => {
          const baseDate = book.releaseDate ? new Date(book.releaseDate) : new Date("2023-01-01");
          baseDate.setFullYear(baseDate.getFullYear() - Math.floor(Math.random() * 5));
          return baseDate.toISOString().split("T")[0];
        })(),
      
        genre: genres[Math.floor(Math.random() * genres.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        description: book.description ?? "No description available.",
        stock: Math.floor(Math.random() * 20) + 1,
        rating: parseFloat((Math.random() * 1 + 3.5).toFixed(1)),
        isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        pages: book.pages ? Math.floor(book.pages + (Math.random() * 100 - 50)) : Math.floor(Math.random() * 500 + 100),
      };
      
      booksArray.push(newBook);
    });
  }

  return booksArray;
};

// Export the million books
export const books = generateMillionBooks();