import OngoingSalesClient from "./OngoingSalesClient";
import OngoingSalesSkeleton from "./OngoingSalesSkeleton";
import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  thumbnail?: string;
  category: {
    slug: string;
  };
}

async function getOngoingSalesProducts(): Promise<Product[]> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
    const response = await fetch(
      `${apiBaseUrl}/api/v1/products?limit=4&isActive=true&isOnSale=true`,
      { next: { revalidate: 60 } }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.products) {
        return data.data.products;
      }
    }
  } catch (error) {
    console.error("Error fetching ongoing sales:", error);
  }

  return [];
}

export default async function OngoingSales() {
  const products = await getOngoingSalesProducts();
  
  return (
    <Suspense fallback={<OngoingSalesSkeleton />}>
      <OngoingSalesClient products={products} />
    </Suspense>
  );
}
