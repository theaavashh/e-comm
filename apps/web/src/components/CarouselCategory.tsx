'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MediaItem {
  id: string;
  linkTo: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  internalLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  success: boolean;
  data: {
    mediaItems: MediaItem[];
  };
}

export default function CarouselCategory() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchActiveMediaItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/media?active=true`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`Failed to fetch media items: ${response.status}`);
        }
        
        const data: MediaResponse = await response.json();
        console.log('Fetched media items:', data.data?.mediaItems);
        
        if (!data.success || !data.data?.mediaItems) {
          console.warn('Invalid response structure:', data);
          setMediaItems([]);
          return;
        }
        
        // Filter to only show media items that link to categories
        const categoryMediaItems = (data.data.mediaItems || []).filter((item: MediaItem) => {
          // Only show items that link to categories
          return item.internalLink?.startsWith('/products/') || item.linkTo === 'category';
        });
        
        setMediaItems(categoryMediaItems);
      } catch (error) {
        console.error('Error fetching media items:', error);
        setError(error instanceof Error ? error.message : 'Failed to load media items');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMediaItems();
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      console.log('Scroll Event Fired!', {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScroll,
        mediaItemsLength: mediaItems.length,
        hasOverflow: scrollWidth > clientWidth,
        progress: maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      });
      
      if (maxScroll > 0) {
        const progress = (scrollLeft / maxScroll) * 100;
        const clampedProgress = Math.min(100, Math.max(0, progress));
        console.log('Setting progress to:', clampedProgress);
        setScrollProgress(clampedProgress);
      } else {
        console.log('No scrollable content - maxScroll is 0 or negative');
        setScrollProgress(0);
      }
    };

    // Add scroll event listener with passive: false to ensure it works
    scrollContainer.addEventListener('scroll', handleScroll, { passive: false });
    
    // Recalculate on resize
    const handleResize = () => {
      setTimeout(handleScroll, 100);
    };
    window.addEventListener('resize', handleResize);
    
    // Multiple attempts to ensure content is rendered
    setTimeout(handleScroll, 100);
    setTimeout(handleScroll, 500);
    setTimeout(handleScroll, 1000);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [mediaItems.length]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Skeleton */}
          <div className="mb-12 mx-20 mt-10">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-80 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
          
          {/* Media Items Skeleton */}
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-6 pb-4 ml-10">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-80 h-64 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    console.log('No media items found');
    return null;
  }

  return (
    <div className="py-10 bg-[#F0F2F5]">
      <div className="max-w-8xl mx-auto px-6">
      
        
        {/* All Media Items Row */}
        <div 
          ref={scrollContainerRef}
          className="w-full h-[500px] md:h-[600px] lg:h-[800px] overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowY: 'hidden'
          }}
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const scrollWidth = e.currentTarget.scrollWidth;
            const clientWidth = e.currentTarget.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            
            if (maxScroll > 0) {
              const progress = (scrollLeft / maxScroll) * 100;
              const clampedProgress = Math.min(100, Math.max(0, progress));
              setScrollProgress(clampedProgress);
            } else {
              setScrollProgress(0);
            }
          }}
        >
          <div className="flex space-x-6 pb-4 ml-5 gap-10 min-w-max h-full items-center">
            {mediaItems.map((item) => {
              // Ensure only category links are used
              const linkHref = item.internalLink?.startsWith('/products/') 
                ? item.internalLink 
                : '#';
              
              return (
                  <Link
                key={item.id}
                href={linkHref}
                className="flex-shrink-0 cursor-pointer h-full max-h-full"
              >
                <div className="relative w-[90vw] max-w-4xl h-full max-h-full bg-gray-100 hover:bg-[#F0F2F5] transition-all duration-500 ease-in-out rounded-lg overflow-hidden transform hover:scale-105">
                  {item.mediaType === 'IMAGE' ? (
                        <Image
                      src={item.mediaUrl}
                      alt={item.linkTo.replace('-', ' ')}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover overflow-hidden"
                      loading="lazy"
                      quality={100}
                      sizes="(max-width: 768px) 80vw, 700px"
                        />
                      ) : (
                        <video
                      src={item.mediaUrl}
                          className="w-full h-full object-cover overflow-hidden"
                          muted
                          loop
                          playsInline
                    />
                  )}
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex justify-center mt-8">
          <div className="w-[40vw] relative">
            <div className="w-full h-2 bg-gray-200 rounded-full mx-3"></div>
            <div 
              className="absolute top-0 h-2 w-6 bg-[#0077b6] rounded-lg"
              style={{ 
                left: `${Math.min(100, Math.max(0, scrollProgress))}%`,
                transform: 'translateX(-50%)',
                transition: 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}
