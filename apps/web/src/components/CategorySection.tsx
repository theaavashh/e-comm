import CategorySectionClient from "./CategorySectionClient";
import CategorySectionSkeleton from "./CategorySectionSkeleton";
import { Suspense } from "react";

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

async function getCategories(): Promise<Category[]> {
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(
      `${apiBaseUrl}/api/v1/categories?limit=10&isActive=true`,
      { next: { revalidate: 300 } },
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data && data.data.categories) {
        return data.data.categories;
      }
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return [];
}

export default async function CategorySection() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<CategorySectionSkeleton />}>
      <CategorySectionClient categories={categories} />
    </Suspense>
  );
}
