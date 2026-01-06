"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

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

// Components
const LoadingState = () => (
  <div className="w-full px-4 py-8">
    {/* Header Skeleton */}
    <div className="mb-8 md:mb-12 mx-4 sm:mx-8 md:mx-12 lg:mx-20 mt-6 md:mt-10">
      <div className="animate-pulse">
        <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-48 sm:w-64 md:w-80 mb-4"></div>
        <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded w-32 sm:w-48 md:w-64"></div>
      </div>
    </div>

    {/* Categories Skeleton */}
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-4 sm:space-x-6 pb-4 ml-4 sm:ml-6 md:ml-10">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-64 bg-white rounded-lg animate-pulse p-4"
          >
            <div className="flex flex-row items-center">
              {/* Image Skeleton - Left */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>

              {/* Text Skeleton - Right */}
              <div className="flex-1 ml-4">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="w-full px-4 py-8">
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="text-red-500 text-xl">{error}</div>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="w-full px-4 py-8">
    <div className="flex items-center justify-center h-96">
      <div className="text-gray-500 text-xl">No categories available</div>
    </div>
  </div>
);

const CategoryCard = ({ category }: { category: any }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper to get full image URL
  const getFullImageUrl = (imagePath: string): string => {
    if (!imagePath) return "";

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If it's a relative path (local upload), construct full URL
    if (imagePath.startsWith("/uploads/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    // If it's just a relative path without /uploads/, assume it's an upload
    return `${API_BASE_URL}/uploads${imagePath}`;
  };

  return (
    <Link
      href={`/products/${category.slug}`}
      className="w-64 bg-[#F0F2F5] transition-all duration-500 ease-in-out cursor-pointer overflow-hidden group"
    >
      <div className="w-full flex flex-row items-center bg-[#F1F2F2] transition-all duration-500 ease-in-out rounded-lg p-4">
        {/* Image Section - Left Side */}
        <div className="flex items-center justify-center">
          {category.image ? (
            <div className="w-20 h-20 transition-transform duration-500 flex items-center justify-center">
              <Image
                src={getFullImageUrl(category.image)}
                alt={category.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                loading="lazy"
                quality={95}
                onError={(e) => {
                  e.currentTarget.src = "/image.png"; // Fallback to placeholder
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-gray-600 text-xl font-bold font-mono">
                {category.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 ml-4">
          <h3 className="font-semibold text-black text-lg uppercase pr-3">
            {category.name}
          </h3>
          {category._count?.products && (
            <p className="text-gray-600 text-sm">
              {category._count.products} products
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Main Component
export default function CategorySection() {
  const { categories, loading, error, refetch } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Early returns
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (categories.length === 0) return <EmptyState />;

  return (
    <div className="w-full px-4 py-4 bg-white my-4 mt-8 md:mt-16 relative">
      {/* Header */}
      <div className="mb-6 md:mb-8 mx-4 sm:mx-8 md:mx-12 lg:mx-20 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
          <h2 className="custom-font">
            <span className="text-xl sm:text-3xl text-black font-inter font-bold">
              Shop More By Category
            </span>
          </h2>
          <p className="text-gray-600 font-medium text-sm md:text-lg lg:text-xl font-inter">
            Discover our curated collection
          </p>
        </div>
      </div>

      {/* Categories Horizontal Scroll with Arrows */}
      <div className="relative mx-4 sm:mx-8 md:mx-16">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:-left-8 top-10 -translate-y-1/2 z-10 p-1.5 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-2 md:-right-8 top-10 -translate-y-1/2 z-10 p-1.5 md:p-2 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
          </button>
        )}

        {/* Categories Horizontal Scroll */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            className="flex space-x-4 sm:space-x-6 pb-4 ml-2 sm:ml-4 md:ml-10"
            style={{ minWidth: "max-content" }}
          >
            {categories.map((category) => (
              <div key={category.id} className="snap-start flex-shrink-0">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
