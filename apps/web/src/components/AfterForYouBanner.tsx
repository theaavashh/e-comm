'use client';

import Link from 'next/link';

export default function AfterForYouBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#8B0000] to-[#000000] py-6 sm:py-8 px-4 sm:px-6 md:px-8 my-6 sm:my-8 rounded-2xl shadow-xl overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-yellow-400 text-xl sm:text-3xl">★</div>
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-yellow-400 text-xl sm:text-3xl">★</div>
        <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-8 text-yellow-300 text-lg sm:text-2xl">✦</div>
        <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-8 text-yellow-300 text-lg sm:text-2xl">✦</div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left Side - Main Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-400 mb-2 sm:mb-3 tracking-wide font-inter">
              SPECIAL OFFER
            </h2>
            <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 tracking-wide font-inter">
              FOR YOU
            </p>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
              <div className="h-0.5 bg-yellow-400 flex-1"></div>
              <span className="text-yellow-400 font-bold text-lg sm:text-xl">★</span>
              <div className="h-0.5 bg-yellow-400 flex-1"></div>
            </div>
          </div>
          
          {/* Center - Discount Badge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center border-2 sm:border-4 border-white shadow-2xl">
                <div className="bg-black rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 flex flex-col items-center justify-center">
                  <span className="text-yellow-400 font-extrabold text-3xl sm:text-4xl md:text-5xl">50</span>
                  <span className="text-yellow-400 font-extrabold text-xl sm:text-2xl md:text-3xl">%</span>
                  <span className="text-white text-xs sm:text-sm uppercase mt-1">OFF</span>
                </div>
              </div>
              <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-10 h-10 sm:w-14 sm:h-14 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">DEAL</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Offer Details */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
            <p className="text-white text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 font-inter">
              EXCLUSIVE COUPON
            </p>
            <div className="bg-black border-2 border-yellow-400 rounded-lg px-4 sm:px-6 py-2 sm:py-3 mb-3 sm:mb-4">
              <span className="text-yellow-400 font-extrabold text-xl sm:text-2xl md:text-3xl">SAVE50</span>
            </div>
            <Link 
              href="/products?sale=true" 
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wider"
            >
              Claim Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}