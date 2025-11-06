'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Star } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface OurBrandsProps {
  className?: string;
}

const OurBrands: React.FC<OurBrandsProps> = ({ className = '' }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/brands`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        
        const data = await response.json();
        setBrands(data.data.brands || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className={`py-16 bg-[#F0F2F5] ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-80"></div>
            </div>
          </div>
          
          {/* Brands Skeleton */}
          <div className="overflow-hidden">
            <div className="flex space-x-8 pb-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 bg-[#F0F2F5] ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Building2 className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Unable to load brands</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className={`py-16 bg-[#F0F2F5] ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No brands available</h3>
              <p className="text-sm">Check back later for brand updates</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 bg-[#F0F2F5] ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 custom-font">Our Brands</h2>
          <p className="text-xl text-gray-600 custom-font">
            Discover trusted brands and their products
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              className="flex-shrink-0 w-32 h-32"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <Link
                  href={brand.website || `/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block w-full h-full"
                >
                  <div className="w-full h-full bg-gray-50 hover:bg-gray-100 transition-colors duration-300 rounded-lg flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 group overflow-hidden">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex flex-col items-center justify-center text-center p-2">
                                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                  <span class="text-blue-600 font-bold text-lg">${brand.name.charAt(0)}</span>
                                </div>
                                <span class="text-xs font-medium text-gray-700 leading-tight">${brand.name}</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-blue-600 font-bold text-lg">{brand.name.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-700 leading-tight">{brand.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OurBrands;
