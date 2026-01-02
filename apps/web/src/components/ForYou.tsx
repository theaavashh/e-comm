'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star, TrendingUp, ShoppingCart, Heart, Eye, Plus, Minus, Image, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

interface ApiProduct {
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
  variants?: Array<{
    id: string;
    name: string;
    value: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

interface ProductImageSliderProps {
  images: string[];
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-rotate when not hovered
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isHovered && images.length > 1) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, currentIndex, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative group overflow-hidden w-full h-full">
        <img 
          src="/placeholder-image.jpg" 
          alt="Product placeholder"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative group overflow-hidden w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image with seamless transitions */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Show on hover */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ForYouProps {
  className?: string;
}

const ForYou: React.FC<ForYouProps> = ({ className = '' }) => {
  const router = useRouter();
  const { selectedCountry } = useLocation();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get user country from context for pricing
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/products?limit=12&isActive=true&country=${encodeURIComponent(selectedCountry)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.data.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCountry]);

  const handleProductClick = (product: ApiProduct) => {
    // Navigate to product detail page
    router.push(`/products/${product.category.slug}/${product.slug}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Unable to load products</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products available</h3>
              <p className="text-sm">Check back later for personalized recommendations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 bg-white mt-10 pl-5 `}>
      <div className="max-w-7xl mx-0 sm:mx-6 md:mx-8 lg:mx-14 px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-6 sm:mb-8 md:mb-12 w-full"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-2 font-inter px-4 sm:px-0">For You</h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-9xl mx-auto px-4 sm:px-0">
            Discover personalized product recommendations just for you
          </p>
        </motion.div>

        {/* Products Grid - 4 columns, 12 products (3 rows) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-1 md:gap-4 w-full"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Image Container with ProductImageSlider */}
                <div className="relative h-32 sm:h-36 md:h-48 lg:h-64 bg-white overflow-hidden">
                  <ProductImageSlider images={product.images} />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 bg-white inter-font">
                  {/* Price */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg md:text-xl font-extrabold text-[#EB6426]">
                        $
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(product.price)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          <sup className="text-[0.7em]">$</sup>
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <div>
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                          {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Add to Cart Button - Centered and Rounded */}
                  {/* <div className="flex justify-center mb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, quantities[product.id] || 1);
                      }}
                      disabled={product.quantity === 0}
                      className="bg-[#EB6426] hover:bg-[#d65a1f] disabled:bg-gray-300 text-white py-2.5 px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {product.quantity === 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div> */}

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>


    </div>
  );
};

export default ForYou;