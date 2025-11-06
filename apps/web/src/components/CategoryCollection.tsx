'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Star } from 'lucide-react';

interface MediaItem {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  linkTo?: string;
  internalLink?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CategoryCollectionProps {
  className?: string;
}

const CategoryCollection: React.FC<CategoryCollectionProps> = ({ className = '' }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/media?active=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch media items');
        }
        
        const data = await response.json();
        // Filter to only show media items that link to categories
        const categoryMediaItems = (data.data.mediaItems || []).filter((item: MediaItem) => {
          // Only show items that link to categories
          return item.internalLink?.startsWith('/products/') || item.linkTo === 'category';
        });
        setMediaItems(categoryMediaItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching media items:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch media items');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, []);

  // Define color schemes for different categories
  const getCategoryColors = (index: number) => {
    const colorSchemes = [
      {
        bg: 'from-amber-100 to-amber-200',
        text: 'text-amber-800',
        link: 'text-amber-800 hover:text-amber-900',
        button: 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      },
      {
        bg: 'from-orange-100 to-orange-200',
        text: 'text-orange-800',
        link: 'text-orange-800 hover:text-orange-900',
        button: 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      },
      {
        bg: 'from-green-100 to-green-200',
        text: 'text-green-800',
        link: 'text-green-800 hover:text-green-900',
        button: 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      },
      {
        bg: 'from-purple-100 to-purple-200',
        text: 'text-purple-800',
        link: 'text-purple-800 hover:text-purple-900',
        button: 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      },
      {
        bg: 'from-teal-100 to-teal-200',
        text: 'text-teal-800',
        link: 'text-teal-800 hover:text-teal-900',
        button: 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      },
      {
        bg: 'from-pink-100 to-pink-200',
        text: 'text-pink-800',
        link: 'text-pink-800 hover:text-pink-900',
        button: 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
      }
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  // Generate category themes and descriptions based on category name
  const getCategoryTheme = (categoryName: string) => {
    const themes = {
      'gifts': 'Traditional & Modern',
      'souvenirs': 'Traditional & Modern',
      'puja': 'Spiritual & Sacred',
      'samagri': 'Spiritual & Sacred',
      'handicrafts': 'Artisan Made',
      'crafts': 'Artisan Made',
      'musical': 'Traditional Sounds',
      'instruments': 'Traditional Sounds',
      'herbs': 'Natural & Pure',
      'naturals': 'Natural & Pure',
      'jewellery': 'Elegant & Traditional',
      'jewelry': 'Elegant & Traditional'
    };
    
    const lowerName = categoryName.toLowerCase();
    for (const [key, theme] of Object.entries(themes)) {
      if (lowerName.includes(key)) {
        return theme;
      }
    }
    return 'Premium Collection';
  };

  const getCategoryDescription = (categoryName: string) => {
    const descriptions = {
      'gifts': 'Handcrafted items in every style & design',
      'souvenirs': 'Handcrafted items in every style & design',
      'puja': 'Essential items for worship',
      'samagri': 'Essential items for worship',
      'handicrafts': 'Traditional crafts & modern designs',
      'crafts': 'Traditional crafts & modern designs',
      'musical': 'Authentic instruments for every occasion',
      'instruments': 'Authentic instruments for every occasion',
      'herbs': 'Pure and natural products',
      'naturals': 'Pure and natural products',
      'jewellery': 'Elegant pieces for special moments',
      'jewelry': 'Elegant pieces for special moments'
    };
    
    const lowerName = categoryName.toLowerCase();
    for (const [key, description] of Object.entries(descriptions)) {
      if (lowerName.includes(key)) {
        return description;
      }
    }
    return 'Discover our curated collection';
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
      <div className={`py-16 bg-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl p-8 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-64 mb-6"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 bg-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Unable to load categories</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className={`py-16 bg-gray-100 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No media items available</h3>
              <p className="text-sm">Check back later for media updates</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Take first 6 media items for the grid
  const displayMediaItems = mediaItems.slice(0, 6);

  return (
    <div className={`py-16 bg-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayMediaItems.map((mediaItem, index) => {
            const isLarge = index === 0; // First media item gets large block
            
            return (
              <motion.div
                key={mediaItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`rounded-2xl overflow-hidden group cursor-pointer ${
                  isLarge ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <Link href={
                  // Ensure only category links are used
                  mediaItem.internalLink?.startsWith('/products/') 
                    ? mediaItem.internalLink 
                    : mediaItem.category 
                      ? `/products/${mediaItem.category.slug}`
                      : '#'
                }>
                  <div className="relative">
                    {mediaItem.mediaType === 'IMAGE' ? (
                      <Image
                        src={mediaItem.mediaUrl}
                        alt={`Media ${index + 1}`}
                        width={isLarge ? 800 : 400}
                        height={isLarge ? 600 : 300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">No Image</div>`;
                          }
                        }}
                      />
                    ) : (
                      <video
                        src={mediaItem.mediaUrl}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryCollection;
