"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBaseUrl } from "@/utils/api";

interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TopBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const apiUrl = getApiBaseUrl();
        console.log("Fetching banners from:", `${apiUrl}/api/v1/banners`);

        const response = await fetch(`${apiUrl}/api/v1/banners`);
        console.log("Banner API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Banner API data:", data);
          console.log("Banners array:", data.data);
          console.log("Banners length:", data.data?.length);
          setBanners(data.data || []);
        } else {
          console.error("Failed to fetch banners:", response.status);
          setBanners([]);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };

    fetchBanners();
  }, []);

  // Rotate through active banners
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Auto scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Don't render if no banners
  if (banners.length === 0) {
    console.log("No banners found, not showing banner");
    return null;
  }

  if (banners.length === 0) {
    console.log("No banners found, showing default");
    // Show a default banner for testing
    return (
      <div className="border-b border-gray-800 bg-[#262626]">
        <div className="max-w-9xl mx-auto px-3 md:px-6 py-1 md:py-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm font-inter">
          <div className="flex-grow flex justify-center">
            <div className="text-white font-semibold font-inter text-center text-lg md:text-xl">
              Default Banner - No API Banners Found
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

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="border-b border-gray-800 bg-[#262626]">
      <div className="max-w-9xl mx-auto px-3 md:px-6 py-1 md:py-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm font-inter">
        {/* Centered banner content */}
        <div className="flex-grow flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="text-white font-semibold font-inter text-center text-lg md:text-xl"
              dangerouslySetInnerHTML={{ __html: currentBanner.title }}
            />
          </AnimatePresence>
        </div>

        {/* Right side - Service links (hidden on mobile) */}
        <div className="hidden lg:flex items-center text-lg font-inter font-semibold">
          <Link
            href="/help"
            className="flex items-center space-x-2 text-white hover:opacity-80"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Help & Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
