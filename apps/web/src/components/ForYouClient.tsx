"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

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

interface ProductImageSliderProps {
  images: string[];
  name: string;
}

const ProductImageSlider = memo(function ProductImageSlider({ images, name }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="relative group overflow-hidden w-full h-full">
        <img
          src="/placeholder-image.jpg"
          alt={`${name} placeholder`}
          className="w-full h-full object-contain"
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
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${name} image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

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
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
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
});

interface ForYouClientProps {
  products: Product[];
}

const ForYouClient = memo(function ForYouClient({ products }: ForYouClientProps) {
  const router = useRouter();

  const handleProductClick = useCallback((product: Product) => {
    router.push(`/products/${product.category.slug}/${product.slug}`);
  }, [router]);

  // if (products.length === 0) {
  //   return null;
  // }

  return (
    <div 
      className="relative my-10 py-6" 
      role="region" 
      aria-label="For You - Personalized Recommendations"
    >
      <div className="max-w-7xl mx-0 sm:mx-6 md:mx-8 lg:mx-14 px-0 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-6 sm:mb-8 md:mb-12 w-full"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-2 font-bricolage px-4 sm:px-0">
            For You
          </h2>
          <p className="text-sm sm:text-base md:text-xl font-normal text-gray-600 max-w-9xl mx-auto px-4 sm:px-0">
            Discover personalized product recommendations just for you
          </p>
        </motion.div>

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
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
              role="article"
              aria-label={`Product: ${product.name}`}
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative h-52 md:h-64 bg-white overflow-hidden">
                  <ProductImageSlider images={product.images} name={product.name} />
                </div>

                <div className="p-3 sm:p-4 bg-white inter-font">
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg md:text-2xl font-extrabold text-[#EB6426] font-bricolage">
                        $
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(product.price)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs md:text-sm text-gray-500 line-through font-bricolage">
                          <sup className="text-[0.7em]">$</sup>
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <div>
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                          {Math.round(
                            ((product.comparePrice - product.price) / product.comparePrice) * 100
                          )}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 font-bricolage">
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

export default ForYouClient;
