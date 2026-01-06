import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  internalLink?: string;
  isActive: boolean;
  parentId?: string;
  createdAt: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Custom hook that fetches categories from API
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get<CategoriesResponse>(
        `${API_BASE_URL}/api/v1/categories`,
      );

      if (response.data.success) {
        setCategories(response.data.data.categories);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
