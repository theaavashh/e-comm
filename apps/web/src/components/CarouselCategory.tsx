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

export default function CarouselCategory() {
  // Hardcoded banner data
  const hardcodedBanners: MediaItem[] = [
    {
      id: 'banner-1',
      linkTo: 'category',
      mediaType: 'IMAGE',
      mediaUrl: '/banners.jpeg',
      internalLink: '/products/foods',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'banner-2',
      linkTo: 'category',
      mediaType: 'IMAGE',
      mediaUrl: '/banners.jpeg',
      internalLink: '/products/dress',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'banner-3',
      linkTo: 'category',
      mediaType: 'IMAGE',
      mediaUrl: '/banners.jpeg',
      internalLink: '/products/statue',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set hardcoded banners on component mount
  useEffect(() => {
    // No API call needed - using hardcoded banners
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
      
      if (maxScroll > 0) {
        const progress = (scrollLeft / maxScroll) * 100;
        const clampedProgress = Math.min(100, Math.max(0, progress));
        setScrollProgress(clampedProgress);
      } else {
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
  }, []);


  return (
    <div className="py-1">
      <div className="max-w-9xl mx-auto ">
      
        
        {/* All Media Items Row */}
        <div 
          ref={scrollContainerRef}
          className="w-full h-[500px] md:h-[500px] lg:h-[800px] overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth "
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
          <div className="flex space-x-6  ml-5 gap-5 min-w-max min-h-full items-center bg-red-500">
            {hardcodedBanners.map((item: MediaItem) => {
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
                <div className="relative w-[90vw] max-w-8xl h-full max-h-full transition-all duration-500 ease-in-out rounded-lg overflow-hidden transform ">
                  {item.mediaType === 'IMAGE' ? (
                        <Image
                      src={item.mediaUrl}
                      alt={item.linkTo.replace('-', ' ')}
                      width={1200}
                      height={1000}
                      className="w-full h-[100vh] object-cover overflow-hidden"
                      loading="lazy"
                      quality={100}
                      
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
