'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const cookieConsent = localStorage.getItem('gharsamma-cookie-consent');
    
    if (!cookieConsent) {
      // Show after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gharsamma-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('gharsamma-cookie-consent', 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Store a temporary dismissal (will show again after some time)
    localStorage.setItem('gharsamma-cookie-consent', 'dismissed');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[10002] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto pointer-events-auto">
            <div className="bg-[#F0F2F5] rounded-2xl shadow-2xl border-2 border-gray-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                {/* Cookie Icon and Content */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-[#0077b6]/10 rounded-full p-3 flex-shrink-0">
                    <Cookie className="w-6 h-6 md:w-8 md:h-8 text-[#0077b6]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 custom-font mb-2">
                      We Use Cookies
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed custom-font">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies.{' '}
                      <Link href="#" className="text-[#0077b6] hover:underline font-medium">
                        Learn more
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={handleDecline}
                    className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors custom-font"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium text-white bg-[#0077b6] rounded-lg hover:bg-[#005f8f] transition-colors custom-font"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

