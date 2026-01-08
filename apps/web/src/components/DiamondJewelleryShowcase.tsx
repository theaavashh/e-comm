'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the Product interface
interface Product {
  id: number | string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  inStock: boolean;
  brand: string;
  tags: string[];
  sku: string;
}

export default function DiamondJewelleryShowcase() {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<Set<number | string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Hardcoded diamond jewellery products
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Diamond Solitaire Ring",
      category: "jewellery",
      subcategory: "ring",
      price: 25000,
      comparePrice: 30000,
      discount: 17,
      rating: 4.8,
      reviewCount: 24,
      image: "/ring1.webp",
      description: "Elegant solitaire diamond ring with 18k white gold setting",
      inStock: true,
      brand: "Sparkle Gems",
      tags: ["diamond", "ring", "engagement"],
      sku: "DR-001"
    },
    {
      id: 2,
      name: "Diamond Tennis Necklace",
      category: "jewellery",
      subcategory: "necklace",
      price: 45000,
      comparePrice: 50000,
      discount: 10,
      rating: 4.9,
      reviewCount: 18,
      image: "/necklace.webp",
      description: "Stunning tennis necklace with certified diamonds",
      inStock: true,
      brand: "Luxury Diamonds",
      tags: ["diamond", "necklace", "fine jewellery"],
      sku: "DN-002"
    },
    {
      id: 3,
      name: "Diamond Stud Earrings",
      category: "jewellery",
      subcategory: "earrings",
      price: 18000,
      comparePrice: 20000,
      discount: 10,
      rating: 4.7,
      reviewCount: 32,
      image: "/diamondtops.webp",
      description: "Classic stud earrings with round brilliant cut diamonds",
      inStock: true,
      brand: "Sparkle Gems",
      tags: ["diamond", "earrings", "everyday"],
      sku: "DE-003"
    },
    {
      id: 4,
      name: "Diamond Halo Ring",
      category: "jewellery",
      subcategory: "pendant",
      price: 32000,
      comparePrice: 35000,
      discount: 9,
      rating: 4.6,
      reviewCount: 15,
      image: "/ring2.webp",
      description: "Beautiful halo pendant with center stone surrounded by smaller diamonds",
      inStock: true,
      brand: "Royal Jewels",
      tags: ["diamond", "pendant", "luxury"],
      sku: "DP-004"
    }
  ]);

  // Simulate loading delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleWishlist = (productId: number | string) => {
    setWishlistItems(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.offsetWidth * 0.8;
      
      container.scrollTo({
        left: container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-4 sm:mx-6 lg:mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8 sm:mb-10 font-inter">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-bricolage">Most-Loved Diamond Picks</h2>
            <p className="mt-2 text-gray-600 text-base sm:text-lg md:text-xl">Where elegance meets everyday luxury</p>
          </div>
          <div className="relative">
            {/* Left Arrow */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </button>
            
            <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 sm:w-72 md:w-80 border border-gray-200 rounded-xl p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 sm:h-56 md:h-64 rounded-lg mb-3 sm:mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Arrow */}
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 hidden sm:block"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 bg-white">
      <div className="max-w-8xl mx-4 sm:mx-6 lg:mx-24 px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8 sm:mb-10 font-inter">
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 font-bricolage">Most-Loved Diamond Picks</h2>
          <p className="text-gray-600 text-base sm:text-lg ">Where elegance meets everyday luxury</p>
        </div>
        
        {products.length > 0 ? (
          <>
            <div className="relative">
              {/* Left Arrow - Hidden on mobile */}
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-4 sm:-left-5 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 hidden sm:block"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              </button>
              
              <div 
                ref={scrollContainerRef}
                className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 group"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {products.slice(0, 4).map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-64 sm:w-72 md:w-80 bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-56 sm:h-56 md:h-64 flex-shrink-0">
                      
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-200 bg-white/90 backdrop-blur text-gray-700 hover:bg-white"
                      >
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlistItems.has(product.id) ? 'fill-current text-red-500' : ''}`} />
                      </button>
                      <Link href={`/product/${product.id}`}>
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center cursor-pointer group overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                        </div>
                      </Link>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1 justify-center">
                       
                        
                       
                        <div className="text-center">
                          <Link href={`/product/${product.id}`}>
                           <h3 className="font-semibold text-[#EB6426] font-bricolage text-center text-lg sm:text-xl leading-snug line-clamp-2 transition-colors cursor-pointer">
                             {product.name}
                           </h3>

                           <h5 className='font-medium font-inter text-gray-800 text-base sm:text-lg pt-3 sm:pt-4 leading-snug line-clamp-2 transition-colors cursor-pointer'>{product.description}</h5>
                         </Link>
                        </div>
                      </div>
                      
                     
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Right Arrow - Hidden on mobile */}
              <button 
                onClick={() => scroll('right')}
                className="absolute -right-4 sm:-right-5 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 hidden sm:block"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              </button>
            </div>
            
          </>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              No diamond jewellery products available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}