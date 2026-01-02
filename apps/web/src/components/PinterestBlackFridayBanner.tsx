'use client';

import Link from 'next/link';

export default function PinterestBlackFridayBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-[#8B0000] to-[#000000] py-6 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-2 left-4 text-yellow-400 text-2xl">★</div>
        <div className="absolute top-2 right-4 text-yellow-400 text-2xl">★</div>
        <div className="absolute bottom-2 left-8 text-yellow-300 text-xl">✦</div>
        <div className="absolute bottom-2 right-8 text-yellow-300 text-xl">✦</div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side - Main Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-400 mb-2 tracking-wide font-inter">
              BLACK FRIDAY
            </h2>
            <p className="text-white text-xl md:text-2xl font-bold mb-1 tracking-wide font-inter">
              MEGA SALE
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-0.5 bg-yellow-400 flex-1"></div>
              <span className="text-yellow-400 font-bold text-lg">★</span>
              <div className="h-0.5 bg-yellow-400 flex-1"></div>
            </div>
          </div>
          
          {/* Center - Discount Badge */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center border-4 border-white shadow-2xl transform rotate-12">
                <div className="bg-black rounded-full w-28 h-28 md:w-36 md:h-36 flex flex-col items-center justify-center">
                  <span className="text-yellow-400 font-extrabold text-3xl md:text-4xl">70</span>
                  <span className="text-yellow-400 font-extrabold text-xl md:text-2xl">%</span>
                  <span className="text-white text-xs uppercase mt-1">OFF</span>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white font-bold text-xs">SALE</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Offer Details */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
            <p className="text-white text-lg md:text-xl font-bold mb-3 font-inter">
              OFFER ENDS IN
            </p>
            <div className="flex gap-2">
              <div className="bg-black border-2 border-yellow-400 rounded-lg w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center">
                <span className="text-yellow-400 text-lg md:text-xl font-bold">02</span>
                <span className="text-gray-300 text-xs">DAYS</span>
              </div>
              <div className="bg-black border-2 border-yellow-400 rounded-lg w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center">
                <span className="text-yellow-400 text-lg md:text-xl font-bold">15</span>
                <span className="text-gray-300 text-xs">HRS</span>
              </div>
              <div className="bg-black border-2 border-yellow-400 rounded-lg w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center">
                <span className="text-yellow-400 text-lg md:text-xl font-bold">30</span>
                <span className="text-gray-300 text-xs">MINS</span>
              </div>
            </div>
            <Link 
              href="/products?sale=true" 
              className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}