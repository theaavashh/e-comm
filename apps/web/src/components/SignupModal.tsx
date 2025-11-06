'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Gift, ChevronDown } from 'lucide-react';
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#F0F2F5] rounded-2xl shadow-2xl max-w-5xl w-full pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side - Product Image/Visual */}
                <div className="hidden md:block bg-gradient-to-br from-[#0077b6] to-[#005f8f] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/food.png')] bg-cover bg-center opacity-20"></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                    <div className="bg-[#F0F2F5]/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                      <Gift className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-center custom-font">Special Offer</h3>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-semibold custom-font">Authentic Nepali Products</p>
                      <p className="text-sm opacity-90">Handcrafted with love from Nepal</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0F2F5]/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F0F2F5]/10 rounded-full -ml-12 -mb-12"></div>
                </div>

                {/* Right Side - Form */}
                <div className="relative p-8 md:p-12">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="inline-block bg-[#0077b6]/10 rounded-full p-3 mb-4">
                        <Gift className="w-8 h-8 text-[#0077b6]" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 custom-font mb-3">
                        UNLOCK UP TO 10% OFF
                      </h2>
                      <p className="text-lg text-gray-600 custom-font">
                        Get up to 10% off your first order
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          {/* Country Code Selector */}
                          <div className="relative" ref={dropdownRef}>
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="flex items-center gap-2 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0077b6] transition-colors bg-[#F0F2F5] hover:bg-gray-50 min-w-[140px] custom-font"
                            >
                              <span className="text-2xl">{selectedCountry.flag}</span>
                              <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                              {isDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute top-full left-0 mt-2 bg-[#F0F2F5] border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto w-[280px]"
                                >
                                  <div className="p-2">
                                    {countries.map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCountry(country);
                                          setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
                                          selectedCountry.code === country.code ? 'bg-[#0077b6]/10' : ''
                                        }`}
                                      >
                                        <span className="text-2xl">{country.flag}</span>
                                        <div className="flex-1 text-left">
                                          <div className="text-sm font-medium text-gray-900 custom-font">
                                            {country.name}
                                          </div>
                                          <div className="text-xs text-gray-500">{country.dialCode}</div>
                                        </div>
                                        {selectedCountry.code === country.code && (
                                          <svg className="w-5 h-5 text-[#0077b6]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
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
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Phone className="w-5 h-5 text-gray-400" />
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
                              placeholder="Enter phone number"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0077b6] transition-colors text-lg custom-font"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            We'll send you exclusive deals and updates
                          </p>
                          <span className="text-xs text-gray-400">
                            {selectedCountry.dialCode} {phone || '...'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed custom-font uppercase tracking-wide shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Signing up...
                          </span>
                        ) : (
                          'Sign Me Up!'
                        )}
                      </button>
                    </form>

                    {/* No Thanks Link */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={handleNoThanks}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors custom-font underline"
                      >
                        No, Thanks
                      </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>Secure</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span>Privacy Protected</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>No Spam</span>
                        </div>
                      </div>
                    </div>
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

