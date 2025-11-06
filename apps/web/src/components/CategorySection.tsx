'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  children: Category[];
  _count: {
    products: number;
  };
}

interface CategoryResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Custom hooks
const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
        
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        
      const data: CategoryResponse = await response.json();
        
      if (data.success && data.data.categories) {
        setCategories(data.data.categories);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      console.error('Error fetching categories:', err);
      
      // If it's a 429 error, don't show error to user, just log it
      if (err instanceof Error && err.message.includes('429')) {
        console.warn('Rate limited, showing fallback UI');
        setError(null); // Don't show error state
        // Use empty categories array as fallback
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

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
          <div key={index} className="w-64 bg-white rounded-lg animate-pulse p-4">
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

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
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

const CategoryCard = ({ category }: { category: Category }) => (
  <Link
    href={`/products/${category.slug}`}
    className="w-64 hover:bg-[#F0F2F5] transition-all duration-500 ease-in-out cursor-pointer overflow-hidden group"
  >
    <div className="w-full flex flex-row items-center bg-white hover:bg-gray-50 transition-all duration-500 ease-in-out rounded-lg p-4">
      {/* Image Section - Left Side */}
      <div className="flex items-center justify-center">
        {category.image ? (
          <div className="w-20 h-20 transition-transform duration-500 flex items-center justify-center">
            <Image
              src={category.image}
              alt={category.name}
              width={80}
              height={80}
              className="w-full h-full object-contain"
              loading="lazy"
              quality={95}
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-gray-600 text-xl font-bold">
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
      </div>
    </div>
  </Link>
);


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
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [categories, checkScrollPosition]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
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
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-bold">Popular Categories For You</span>
          </h2>
          <p className="text-gray-600 font-medium text-lg md:text-lg lg:text-xl">Discover our curated collection</p>
        </div>
      </div>
      
      {/* Categories Horizontal Scroll with Arrows */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-[#F0F2F5] rounded-full p-1.5 md:p-2 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-[#F0F2F5] rounded-full p-1.5 md:p-2 shadow-lg hover:bg-gray-50 transition-colors"
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
            WebkitOverflowScrolling: 'touch',
          }}>
          <div className="flex space-x-4 sm:space-x-6 pb-4 ml-4 sm:ml-6 md:ml-10" style={{ minWidth: 'max-content' }}>
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