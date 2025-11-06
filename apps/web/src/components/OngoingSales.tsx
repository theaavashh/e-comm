'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

export default function OngoingSales() {
  const [ongoingSalesProducts, setOngoingSalesProducts] = useState<any[]>([]);
  const [ongoingSalesLoading, setOngoingSalesLoading] = useState(true);

  useEffect(() => {
    const fetchOngoingSales = async () => {
      try {
        setOngoingSalesLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/products?limit=4&isActive=true&isOnSale=true`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.products) {
            setOngoingSalesProducts(data.data.products);
          }
        }
      } catch (error) {
        console.error('Failed to fetch ongoing sales products:', error);
      } finally {
        setOngoingSalesLoading(false);
      }
    };

    fetchOngoingSales();
  }, []);

  // Don't render component if no products and not loading
  if (!ongoingSalesLoading && ongoingSalesProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 custom-font">Flash Sales</h2>
              <button className="text-sm md:text-base text-blue-600 hover:text-blue-800 transition-colors custom-font font-medium -mr-4 md:mr-2">
                Shop More
              </button>
            </div>
            <p className="text-gray-600 custom-font">Upto 40% Off - Shop now and save!</p>
          </div>
        </div>
        
        {ongoingSalesLoading ? (
          <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 gap-3 lg:grid lg:grid-cols-4 lg:overflow-visible lg:gap-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse flex-shrink-0 w-[70%] lg:w-full">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : ongoingSalesProducts.length > 0 ? (
          <div className="flex overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 gap-3 lg:grid lg:grid-cols-4 lg:overflow-visible lg:gap-3">
            {/* Sales Product Cards */}
            {ongoingSalesProducts.map((product, index) => {
              const price = parseFloat(product.price?.toString() || '0');
              const comparePrice = product.comparePrice ? parseFloat(product.comparePrice.toString()) : null;
              const discount = comparePrice && comparePrice > price 
                ? Math.round(((comparePrice - price) / comparePrice) * 100) 
                : 0;
              const productImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : product.thumbnail || '/image.png';
              
              return (
                <Link 
                  key={product.id} 
                  href={`/products/${product.category?.slug || 'all'}/${product.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group flex-shrink-0 w-[70%] lg:w-full flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-48 md:h-64 bg-white overflow-hidden">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/image.png';
                      }}
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Content - Price and Product Info */}
                  <div className="p-4 bg-white custom-font">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-semibold text-gray-900">
                          <sup className="text-[0.7em]">$</sup>
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(price)}
                        </span>
                        {comparePrice && comparePrice > price && (
                          <span className="text-sm text-gray-500 line-through">
                            <sup className="text-[0.7em]">$</sup>
                            {new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(comparePrice)}
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Add to Cart Button - Rounded */}
                    <div className="mb-2">
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add to cart functionality can be added here
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>

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
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}


