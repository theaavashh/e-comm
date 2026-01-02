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
          style={{ 
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            maxWidth: '100vw',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
          className="z-[10002] px-2 pb-2 pointer-events-none"
        >
          <div style={{ 
            width: '100%', 
            maxWidth: '100%', 
            overflow: 'hidden',
            boxSizing: 'border-box'
          }} className="pointer-events-auto">
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb',
              padding: '0.5rem',
              overflow: 'hidden',
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '100%'
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                {/* Cookie Icon and Content */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.375rem',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ 
                    backgroundColor: 'rgba(235, 100, 38, 0.1)',
                    borderRadius: '9999px',
                    padding: '0.25rem',
                    flexShrink: 0,
                    marginTop: '0.125rem'
                  }}>
                    <Cookie style={{ width: '0.875rem', height: '0.875rem', color: '#EB6426' }} />
                  </div>
                  <div style={{ 
                    flex: 1, 
                    minWidth: 0,
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}>
                    <h3 style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      color: '#111827', 
                      marginBottom: '0.125rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      We Value Your Privacy
                    </h3>
                    <p style={{ 
                      fontSize: '0.625rem', 
                      color: '#4b5563', 
                      lineHeight: '1.25',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      We use cookies to enhance your experience.{' '}
                      <Link href="/privacy-policy" style={{ 
                        color: '#EB6426', 
                        textDecoration: 'underline',
                        fontSize: '0.625rem'
                      }}>
                        Learn more
                      </Link>
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    style={{ 
                      color: '#9ca3af',
                      padding: '0.125rem',
                      flexShrink: 0
                    }}
                    aria-label="Close"
                  >
                    <X style={{ width: '0.75rem', height: '0.75rem' }} />
                  </button>
                </div>

                {/* Action Buttons - Stacked vertically on mobile */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.25rem', 
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={handleDecline}
                      style={{
                        flex: 1,
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.625rem',
                        fontWeight: '500',
                        color: '#374151',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAccept}
                      style={{
                        flex: 1,
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.625rem',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: '#EB6426',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}