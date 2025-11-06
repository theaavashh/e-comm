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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
        console.log('Fetching sliders from:', `${apiUrl}/api/v1/sliders`);
        const response = await fetch(`${apiUrl}/api/v1/sliders`);
        const data = await response.json();
        
        console.log('Slider API response:', data);
        
        if (data.success && data.data) {
          // Handle both response formats: data.data.sliders or data.data
          const slidersData = data.data.sliders || data.data;
          console.log('Sliders data:', slidersData);
          
          // Filter only active sliders and sort by order
          const activeSliders = slidersData
            .filter((slider: SliderImage) => slider.isActive)
            .sort((a: SliderImage, b: SliderImage) => a.order - b.order);
          
          console.log('Active sliders:', activeSliders);
          setSliders(activeSliders);
        } else {
          console.log('No slider data found or API error');
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
        // Set empty array on error so component doesn't disappear
        setSliders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-hidden shadow-lg bg-black">
        {/* Skeleton Loader */}
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
      </div>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full shadow-lg bg-black">
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
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id} className="w-full h-full">
            <Link href={slider.internalLink || '#'} className="block w-full h-full">
              <img
                src={slider.imageUrl}
                alt={`Slider ${slider.id}`}
                className="w-full h-full object-cover"
                onLoad={() => console.log('Image loaded:', slider.imageUrl)}
                onError={(e) => {
                  console.error('Image failed to load:', slider.imageUrl);
                  console.error('Error details:', e);
                }}
              />
            </Link>
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 cursor-pointer z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        
        <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 cursor-pointer z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
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
