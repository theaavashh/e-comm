'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface Banner {
  id: string;
  title: string; // Rich text content
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TopBanner() {
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active banner from API
  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/banners`);
        
        if (response.ok) {
          const data = await response.json();
          const banners = data.data || [];
          // Find the active banner (only one should be active)
          const active = banners.find((banner: Banner) => banner.isActive);
          setActiveBanner(active || null);
        } else {
          console.error('Failed to fetch banners');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveBanner();
  }, []);

  // Don't render if loading or no active banner
  if (isLoading || !activeBanner) {
    return null;
  }

  return (
    <div className="border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-sm">
        {/* Left side - Banner content */}
        <div className="flex items-center space-x-4">
          <div 
            className="text-black font-medium"
            dangerouslySetInnerHTML={{ __html: activeBanner.title }}
          />
        </div>
        
        {/* Right side - Service links (keep existing) */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-2 text-black hover:opacity-80">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Customer service</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-black hover:opacity-80">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Find our store</span>
          </a>
        </div>
      </div>
    </div>
  );
}
