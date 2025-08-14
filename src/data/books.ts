import axios from "axios";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  genre: string; // Maps to API's `category`
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

export const fetchBooks = async ({ page, limit, sort, order, filters }: FetchBooksParams): Promise<{ books: Book[]; total: number }> => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      sort: sort || "createdAt",
      order: order || "desc",
    };

    // Map filters to API query parameters
    if (filters) {
      if (filters.genre) params.category = filters.genre; // API uses `category`
      if (filters.condition) params.condition = filters.condition;
      if (filters.priceMin != null) params.priceMin = filters.priceMin;
      if (filters.priceMax != null) params.priceMax = filters.priceMax;
      if (filters.rating != null) params.rating = filters.rating;
    }

    const response = await axios.get("https://britbooks-api-production.up.railway.app/api/market/admin/listings", {
      params,
    });

    const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/2166128139/vector/modern-annual-report-cover-book-business-template-design.jpg?s=612x612&w=0&k=20&c=-OtjHOz2K389qHnIo8mcUXCrGpKo3I0uJoICB2SSTik=";


    const books: Book[] = response.data.listings.map((listing: any) => ({
      id: listing._id,
      title: listing.title,
      author: listing.author,
      price: listing.price,
      imageUrl: listing.samplePageUrls?.[0] || FALLBACK_IMAGE,
      genre: listing.category, // Map API's `category` to `genre`
      condition: listing.condition,
      description: listing.description || "",
      stock: listing.stock,
      rating: listing.rating || 4.5, // Default rating if not provided
      isbn: listing.isbn,
      pages: listing.pages || 300, // Default if not provided
      releaseDate: listing.listedAt,
    }));

    return {
      books,
      total: response.data.meta?.count || 1000000, // Fallback to 1 million if count is missing
    };
  } catch (error) {
    console.error("❌ Error fetching books:", error instanceof Error ? error.message : error);
    throw new Error("Failed to fetch books");
  }
};

// New function to fetch unique categories
export const fetchCategories = async (): Promise<string[]> => {
  try {
    // Fetch a large sample to get diverse categories (e.g., 10,000 books)
    const response = await axios.get("https://britbooks-api-production.up.railway.app/api/market/admin/listings", {
      params: { page: 1, limit: 10000 }, // Large sample for diversity
    });

    const categories = Array.from(
      new Set(response.data.listings.map((listing: any) => listing.category).filter((cat: string) => cat))
    ).sort();

    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error instanceof Error ? error.message : error);
    // Fallback categories from the provided API response
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