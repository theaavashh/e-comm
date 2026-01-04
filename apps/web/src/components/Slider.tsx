'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface SliderImage {
  id: string;
  imageUrl: string;
  internalLink: string;
  isActive: boolean;
  order: number;
}

export default function Slider() {
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sliders');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Filter active sliders and sort by order
          const activeSliders = (data.data.sliders || [])
            .filter((slider: SliderImage) => slider.isActive)
            .sort((a: SliderImage, b: SliderImage) => a.order - b.order);
          
          setSliders(activeSliders);
        } else {
          throw new Error(data.message || 'Failed to fetch sliders');
        }
      } catch (err) {
        console.error('Error fetching sliders:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="relative w-full h-full shadow-lg bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Show error state if there was an error
  if (error) {
    console.error('Slider error:', error);
    return (
      <div className="relative w-full h-full shadow-lg bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Failed to load slider</p>
          <p className="text-sm text-gray-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state if no active sliders
  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-full shadow-lg bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>No active sliders available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full shadow-lg ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={1500}
        className="w-full h-full"
        breakpoints={{
          // when window width is >= 640px
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        }}
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id} className="w-full h-full">
            <Link href={slider.internalLink || '#'} className="block w-full h-full">
              <img
                src={slider.imageUrl}
                alt={`Slider ${slider.id}`}
                className="w-full h-full object-cover bg-center bg-no-repeat"
              />
            </Link>
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation Buttons - Hidden on mobile, visible on tablet and above */}
        <div className="swiper-button-prev-custom absolute left- top-1/2 transform -translate-y-1/2  text-black bg-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 cursor-pointer z-10 hidden sm:block">
          <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        
        <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2  text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 cursor-pointer z-10 hidden sm:block">
          <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>

      {/* Custom CSS for pagination */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 1rem !important;
        }
        
        .swiper-pagination-bullet-custom {
          width: 10px !important;
          height: 10px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          margin: 0 3px !important;
          transition: all 0.3s ease !important;
        }
        
        @media (min-width: 768px) {
          .swiper-pagination-bullet-custom {
            width: 12px !important;
            height: 12px !important;
            margin: 0 4px !important;
          }
        }
        
        .swiper-pagination-bullet-active-custom {
          background: white !important;
          transform: scale(1.25) !important;
        }
        
        .swiper-button-prev-custom:after,
        .swiper-button-next-custom:after {
          display: none !important;
        }
        
        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          transform: translateY(-50%) scale(1.1) !important;
        }
      `}</style>
    </div>
  );
}