import ForYouClient from "./ForYouClient";
import ForYouSkeleton from "./ForYouSkeleton";
import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity: number;
  image: string;
  images: string[];
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
}

async function getForYouProducts(): Promise<Product[]> {
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(`${apiBaseUrl}/api/v1/products?limit=20`, {
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.products) {
        return data.data.products;
      }
    }
  } catch (error) {
    console.error("Error fetching for you products:", error);
  }

  return [];
}

export const metadata = {
  title: "For You - Personalized Recommendations | GharSamma",
  description:
    "Discover personalized product recommendations at GharSamma. Shop our curated collection of authentic Nepali products.",
  openGraph: {
    title: "For You - Personalized Recommendations | GharSamma",
    description: "Discover personalized product recommendations at GharSamma.",
    type: "website",
  },
};

export default async function ForYou() {
  const products = await getForYouProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <Suspense fallback={<ForYouSkeleton />}>
      <ForYouClient products={products} />
    </Suspense>
  );
}
