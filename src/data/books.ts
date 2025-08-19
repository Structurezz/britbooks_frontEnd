import axios from "axios";
import { MD5 } from "crypto-js"; // For generating unique seeds

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  genre: string;
  condition: string;
  description?: string;
  stock: number;
  rating?: number;
  isbn: string;
  pages?: number;
  releaseDate?: string;
}

interface FetchBooksParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
}

// Function to generate a unique placeholder image URL using Lorem Picsum
const generatePlaceholderImage = (book: { title: string; isbn: string; genre: string }): string => {
  // Create a hash from ISBN or title to use as a seed for Picsum
  const input = book.isbn || book.title;
  const hash = MD5(input).toString().slice(0, 8); // Use first 8 chars of MD5 hash

  // Map genre to a keyword (optional, for future customization if needed)
  const genreColors: Record<string, string> = {
    Mindfulness: "zen",
    Technology: "tech",
    Psychology: "psych",
    "Self-Help": "selfhelp",
    Mystery: "mystery",
    "Contemporary Fiction": "fiction",
    Drama: "drama",
    Biography: "bio",
    Leadership: "lead",
    "Asian Literature": "asianlit",
    Entrepreneurship: "entrepreneur",
    Poetry: "poetry",
    Humor: "humor",
    History: "history",
    Cookbooks: "cook",
    Art: "art",
    Comics: "comics",
    default: "default",
  };

  const genreKey = genreColors[book.genre] || genreColors.default;

  // Use Lorem Picsum with the hash as a seed for unique images
  return `https://picsum.photos/seed/${hash}-${genreKey}/300/450`;
};

export const fetchBooks = async ({ page, limit, sort, order, filters }: FetchBooksParams): Promise<{ books: Book[]; total: number }> => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      sort: sort || "createdAt",
      order: order || "desc",
    };

    if (filters) {
      if (filters.genre) params.category = filters.genre;
      if (filters.condition) params.condition = filters.condition;
      if (filters.priceMin != null) params.priceMin = filters.priceMin;
      if (filters.priceMax != null) params.priceMax = filters.priceMax;
      if (filters.rating != null) params.rating = filters.rating;
    }

    const response = await axios.get("https://britbooks-api-production.up.railway.app/api/market/admin/listings", {
      params,
    });

    const books: Book[] = response.data.listings.map((listing: any) => ({
      id: listing._id,
      title: listing.title,
      author: listing.author,
      price: listing.price,
      imageUrl: listing.samplePageUrls?.[0] || generatePlaceholderImage({
        title: listing.title,
        isbn: listing.isbn,
        genre: listing.category,
      }),
      genre: listing.category,
      condition: listing.condition,
      description: listing.description || "",
      stock: listing.stock,
      rating: listing.rating || 4.5,
      isbn: listing.isbn,
      pages: listing.pages || 300,
      releaseDate: listing.listedAt,
    }));

    return {
      books,
      total: response.data.meta?.count || 1000000,
    };
  } catch (error) {
    console.error("❌ Error fetching books:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch books");
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get("https://britbooks-api-production.up.railway.app/api/market/admin/listings", {
      params: { page: 1, limit: 30000 },
    });

    const categories = Array.from(
      new Set(response.data.listings.map((listing: any) => listing.category).filter((cat: string) => cat))
    ).sort();

    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error instanceof Error ? error.message : error);
    return [
      "Mindfulness",
      "Technology",
      "Psychology",
      "Self-Help",
      "Mystery",
      "Contemporary Fiction",
      "Drama",
      "Biography",
      "Leadership",
      "Asian Literature",
      "Entrepreneurship",
      "Poetry",
      "Humor",
      "History",
      "Cookbooks",
      "Art",
      "Comics",
    ].sort();
  }
};