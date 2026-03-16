"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  id: string;
  title: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TopBannerClientProps {
  banners: Banner[];
}

export default function TopBannerClient({ banners }: TopBannerClientProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const activeBanners = banners.filter(b => b.isActive);

  useEffect(() => {
    if (activeBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (activeBanners.length === 0) {
    return (
      <div 
        className="border-b border-gray-800 bg-[#262626]" 
        role="banner"
        aria-label="Promotional banner"
      >
        <div className="max-w-9xl mx-auto px-3 md:px-6 py-1 md:py-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm font-inter">
          <div className="flex-grow flex justify-center">
            <div className="text-white font-semibold font-inter text-center text-lg md:text-xl">
              Free Shipping on Orders Above $100
            </div>
          </div>
          <div className="hidden lg:flex items-center text-lg font-inter font-semibold">
            <Link
              href="/help"
              className="flex items-center space-x-2 text-white hover:opacity-80"
            >
              <span>Help & Support</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = activeBanners[currentBannerIndex];

  const BannerContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBanner.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-white font-semibold font-inter text-center text-lg md:text-xl"
        dangerouslySetInnerHTML={{ __html: currentBanner.title }}
      />
    </AnimatePresence>
  );

  return (
    <div 
      className="border-b border-gray-800 bg-[#262626]" 
      role="banner"
      aria-label="Promotional banner"
    >
      <div className="max-w-9xl mx-auto px-3 md:px-6 py-1 md:py-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm font-inter">
        <div className="flex-grow flex justify-center">
          {currentBanner.link ? (
            <a 
              href={currentBanner.link}
              className="text-white font-semibold font-inter text-center text-lg md:text-xl hover:opacity-80 transition-opacity"
              dangerouslySetInnerHTML={{ __html: currentBanner.title }}
            />
          ) : (
            <BannerContent />
          )}
        </div>

        <div className="hidden lg:flex items-center text-lg font-inter font-semibold">
          <Link
            href="/help"
            className="flex items-center space-x-2 text-white hover:opacity-80"
          >
            <span>Help & Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
