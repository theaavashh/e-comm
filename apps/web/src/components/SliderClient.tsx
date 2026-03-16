'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

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

interface SliderClientProps {
  sliders: SliderImage[];
}

export default function SliderClient({ sliders }: SliderClientProps) {
  if (sliders.length === 0) {
    return (
      <div 
        className="relative w-full h-64 md:h-96 flex items-center justify-center bg-gray-100" 
        role="region"
        aria-label="Hero slider"
      >
        <p className="text-gray-500">No sliders available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full shadow-lg"
      role="region"
      aria-label="Hero slider"
    >
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
        loop={sliders.length > 1}
        speed={1500}
        className="w-full h-full"
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        }}
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id} className="w-full h-full">
            <Link 
              href={slider.internalLink || '#'} 
              className="block w-full h-full"
              aria-label={`Slide ${slider.id}`}
            >
              <Image
                src={slider.imageUrl}
                alt={`Slider ${slider.id}`}
                fill
                className="w-full h-full object-cover bg-center bg-no-repeat"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-slider.jpg';
                }}
              />
            </Link>
          </SwiperSlide>
        ))}
        
        {sliders.length > 1 && (
          <>
            <div 
              className="swiper-button-prev-custom absolute left- top-1/2 transform -translate-y-1/2 text-black bg-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 cursor-pointer z-10 hidden sm:block"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            
            <div 
              className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 cursor-pointer z-10 hidden sm:block"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </>
        )}
      </Swiper>

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
