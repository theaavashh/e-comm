'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Gift, ChevronDown, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CountryCode {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const countries: CountryCode[] = [
  { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩' },
  { name: 'Bhutan', code: 'BT', dialCode: '+975', flag: '🇧🇹' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
];

export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countries[0]); // Default to Nepal
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already dismissed the modal
    const hasSeenModal = localStorage.getItem('gharsamma-signup-modal-dismissed');
    
    // Show modal after a short delay if not dismissed
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember dismissal for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('gharsamma-signup-modal-dismissed', expiryDate.toISOString());
  };

  const handleNoThanks = () => {
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    // Remove any spaces or dashes for validation
    const cleanedPhone = phone.replace(/[\s-]/g, '');
    
    // Basic phone validation (at least 7 digits)
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Combine country code with phone number
      const fullPhoneNumber = `${selectedCountry.dialCode}${cleanedPhone}`;
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     phone: fullPhoneNumber,
      //     country: selectedCountry.code 
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Successfully signed up! You\'ll receive a discount code shortly.');
      handleClose();
      setPhone('');
    } catch (error) {
      toast.error('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-screen max-w-screen fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="w-screen max-w-screen fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-md shadow-2xl w-full max-w-md md:max-w-4xl pointer-events-auto overflow-hidden border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Visual Content */}
                <div className="bg-gradient-to-br from-[#EB6426] to-[#d65a1f] relative overflow-hidden hidden lg:block">
                  <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover bg-center opacity-10"></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-6"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        <Gift className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Exclusive Offers Await</h3>
                      <p className="text-sm opacity-90 max-w-xs mx-auto">
                        Join our community and unlock special discounts on authentic Nepali products
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid grid-cols-3 gap-2 w-full max-w-xs"
                    >
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
                          <CheckCircle className="w-4 h-4 mx-auto mb-1" />
                          <p className="text-xs font-medium">Benefit {item}</p>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="relative p-4 sm:p-6 md:p-8">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1.5 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="max-w-xs mx-auto">
                    {/* Header */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center mb-6"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EB6426]/10 mb-3">
                        <Gift className="w-6 h-6 text-[#EB6426]" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Unlock 10% Off Your First Order
                      </h2>
                      <p className="text-sm text-gray-600">
                        Be the first to know about new arrivals, special offers, and exclusive deals
                      </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form 
                      onSubmit={handleSubmit} 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex flex-col gap-2">
                          {/* Country Code Selector */}
                          <div className="relative" ref={dropdownRef}>
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6426] focus:border-transparent transition-all bg-white hover:bg-gray-50 min-w-[100px] shadow-sm"
                            >
                              <span className="text-lg">{selectedCountry.flag}</span>
                              <span className="font-medium text-gray-700 text-sm">{selectedCountry.dialCode}</span>
                              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                              {isDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[200px] overflow-y-auto w-[200px]"
                                >
                                  <div className="p-1">
                                    {countries.map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCountry(country);
                                          setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm ${
                                          selectedCountry.code === country.code ? 'bg-[#EB6426]/10' : ''
                                        }`}
                                      >
                                        <span className="text-lg">{country.flag}</span>
                                        <div className="flex-1 text-left">
                                          <div className="text-xs font-medium text-gray-900 truncate">
                                            {country.name}
                                          </div>
                                          <div className="text-xs text-gray-500">{country.dialCode}</div>
                                        </div>
                                        {selectedCountry.code === country.code && (
                                          <CheckCircle className="w-4 h-4 text-[#EB6426]" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Phone Input */}
                          <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              id="phone"
                              value={phone}
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/\D/g, '');
                                setPhone(value);
                              }}
                              placeholder="1234567890"
                              className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6426] focus:border-transparent transition-all text-sm shadow-sm"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            We'll send you exclusive deals and updates. Unsubscribe anytime.
                          </p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#EB6426] to-[#d65a1f] text-white py-2.5 rounded-lg font-bold text-sm hover:from-[#d65a1f] hover:to-[#c1501a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Signing up...
                          </span>
                        ) : (
                          'Get My Discount'
                        )}
                      </button>
                    </motion.form>

                    {/* No Thanks Link */}
                    <motion.div 
                      className="mt-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <button
                        onClick={handleNoThanks}
                        className="text-xs text-gray-500 hover:text-[#EB6426] transition-colors underline-offset-2 hover:underline"
                      >
                        No thanks, I'll shop without discounts
                      </button>
                    </motion.div>

                    {/* Trust Badge */}
                    <motion.div 
                      className="mt-6 pt-4 border-t border-gray-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-500">
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>Secure & Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span>Privacy Protected</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>No Spam Ever</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}