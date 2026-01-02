'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, MapPin, ChevronDown, Menu, X, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const { data: session, status } = useSession();
  const [userLocation, setUserLocation] = useState<string>('Detecting location...');
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('Nepal');
  const locationRef = useRef<HTMLDivElement>(null);

  // Load saved country preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('selectedCountry');
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    }
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationModalOpen(false);
      }
    };

    if (isLocationModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationModalOpen]);

  // Get user location with improved accuracy
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setIsLocationLoading(true);
        
        // Try multiple IP geolocation services for better accuracy
        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.ipgeolocation.io/ipgeo?apiKey=free'
        ];
        
        let locationData = null;
        
        for (const service of services) {
          try {
            const response = await fetch(service);
            const data = await response.json();
            
            // Check if we got valid location data
            if (data.city && (data.region || data.state)) {
              locationData = data;
              break;
            }
          } catch (serviceError) {
            console.log(`Service ${service} failed, trying next...`);
            continue;
          }
        }
        
        if (locationData) {
          // Try to get more specific location details
          const city = locationData.city;
          const region = locationData.region || locationData.state;
          const country = locationData.country_name || locationData.country;
          
          // For Nepal, try to get more specific location
          if (country === 'Nepal' || country === 'NP') {
            // Try to get more precise location using a different service
            try {
              const preciseResponse = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
              const preciseData = await preciseResponse.json();
              
              if (preciseData.city && preciseData.principalSubdivision) {
                setUserLocation(`${preciseData.city}, ${preciseData.principalSubdivision}`);
              } else {
                setUserLocation(`${city}, ${region}`);
              }
            } catch {
              setUserLocation(`${city}, ${region}`);
            }
          } else {
            setUserLocation(`${city}, ${region}`);
          }
        } else {
          // Fallback to browser geolocation for more accuracy
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                  );
                  const data = await response.json();
                  
                  if (data.city && data.principalSubdivision) {
                    setUserLocation(`${data.city}, ${data.principalSubdivision}`);
                  } else {
                    setUserLocation('Location detected');
                  }
                } catch (error) {
                  setUserLocation('Location detected');
                }
              },
              () => {
                setUserLocation('Location detected');
              }
            );
          } else {
            setUserLocation('Location detected');
          }
        }
      } catch (error) {
        setUserLocation('Location detected');
      } finally {
        setIsLocationLoading(false);
      }
    };

    getUserLocation();
  }, []);

  return (
    <div>
      {/* Top Section - Logo/Menu (Mobile) or Search/Location/Track (Desktop) */}
      <div className="bg-[#622A1F] border-b border-[#1a2052]">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 md:py-4">
          {/* Mobile: Logo and Menu Row */}
          <div className="flex flex-col md:hidden gap-2 mb-0">
            <div className="flex items-center justify-between gap-2">
              <Link href="/" className="flex-shrink-0">
                <h3 className="text-white text-lg font-bold font-inter hover:text-gray-200 transition-colors">
                  GharSamma
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white hover:bg-[#F0F2F5]/10 rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white hover:bg-[#F0F2F5]/10 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
            
            {/* Mobile Search Bar in same container */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full text-xs px-3 py-1.5 pr-10 border border-gray-200 rounded-lg focus:outline-none bg-[#F0F2F5] text-black placeholder-gray-500 font-inter"
              />
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1.5 bg-[#F0F2F5] hover:bg-gray-50 transition-colors rounded-full">
                <Search className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
            
            {/* Mobile Deliver to Section */}
            <div 
              ref={locationRef}
              className="flex items-center gap-1.5 text-white cursor-pointer relative"
              onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
            >
              <MapPin className="w-4 h-4 text-white" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/80 font-inter">Deliver to</span>
                <div className="flex items-center gap-1">
                  {isLocationLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-white">Detecting...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-white font-inter whitespace-nowrap">{userLocation}</span>
                      <ChevronDown className={`w-3 h-3 text-white transition-transform ${isLocationModalOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </div>
              </div>
              
              {/* Location Modal - Mobile */}
              <AnimatePresence>
                {isLocationModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-yellow-400 rounded-lg shadow-2xl border border-[#1a2052] z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold font-inter">Selectsss Location</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLocationModalOpen(false);
                        }}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2 font-inter">Country</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 font-inter"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Nepal">Nepal</option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLocationModalOpen(false);
                        // Save location preference
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('selectedCountry', selectedCountry);
                        }
                      }}
                      className="w-full mt-4 bg-white text-[#252C6A] py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors font-inter"
                    >
                      Save
                    </button>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Center - Search Bar */}
            <div className="flex-1 flex justify-center max-w-2xl">
              <div className="flex items-center w-full">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full text-sm md:text-base lg:text-lg px-4 lg:px-5 py-2.5 lg:py-3 pr-12 lg:pr-14 border border-gray-200 rounded-2xl focus:outline-none bg-white text-black placeholder-gray-500 font-inter"
                  />
                  <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 lg:p-2 bg-white hover:bg-gray-50 transition-colors rounded-full">
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Deliver to Section */}
            <div 
              ref={locationRef}
              className="hidden lg:flex items-center gap-2 text-white flex-shrink-0 cursor-pointer relative"
              onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
            >
              <MapPin className="w-5 h-5 text-white" />
              <div className="flex flex-col">
                <span className="text-xs text-white/80 font-inter">Deliver to</span>
                <div className="flex items-center gap-1">
                  {isLocationLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-white">Detecting...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-white font-inter whitespace-nowrap">{userLocation}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform ${isLocationModalOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </div>
              </div>
              
              {/* Location Modal - Desktop */}
              <AnimatePresence>
                {isLocationModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-[#252C6A] rounded-lg shadow-2xl border border-[#1a2052] z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold font-inter">Select Location</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLocationModalOpen(false);
                          }}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2 font-inter">Country</label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 font-inter"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="Nepal">Nepal</option>
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLocationModalOpen(false);
                          // Save location preference
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('selectedCountry', selectedCountry);
                          }
                        }}
                        className="w-full mt-4 bg-white text-[#252C6A] py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors font-inter"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Track Order */}
            <button className="hidden lg:flex items-center gap-2 text-white hover:text-white/80 transition-colors flex-shrink-0">
              <div className="flex flex-col items-center">
                <PackageSearch className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white font-inter mt-0.5">Track Order</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-b border-gray-200 bg-[#622A1F] relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3">
          {/* Desktop Navigation (Full Labels) */}
          <nav className="hidden xl:flex items-center justify-center gap-4 lg:gap-6 overflow-x-auto relative font-inter text-base lg:text-lg font-extrabold text-white">
            <Link 
              href="/foods" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              FOODS
            </Link>
            <Link 
              href="/products/gift-souvenir" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              GIFT & SOUVENIR
            </Link>
            <Link 
              href="/products/puja-samagri" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              PUJA SAMAGRI
            </Link>
            <Link 
              href="/products/handicrafts" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              HANDICRAFTS
            </Link>
            <Link 
              href="/products/musical-instruments" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              MUSICAL INSTRUMENTS
            </Link>
            <Link 
              href="/products/herbs-naturals" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              HERBS & NATURALS
            </Link>
            <Link 
              href="/products/jewellery" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              JEWELLERY
            </Link>
          </nav>

          {/* Tablet/Medium Desktop Navigation (Abbreviated) */}
          <nav className="hidden md:flex xl:hidden items-center gap-3 lg:gap-4 overflow-x-auto relative font-inter text-sm lg:text-base font-extrabold text-white">
            <Link 
              href="/foods" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              FOODS
            </Link>
            <Link 
              href="/products/gift-souvenir" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              GIFTS
            </Link>
            <Link 
              href="/products/puja-samagri" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              PUJA
            </Link>
            <Link 
              href="/products/handicrafts" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              HANDICRAFTS
            </Link>
            <Link 
              href="/products/musical-instruments" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              MUSICAL
            </Link>
            <Link 
              href="/products/herbs-naturals" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              HERBS
            </Link>
            <Link 
              href="/products/jewellery" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              JEWELLERY
            </Link>
            <Link 
              href="/about" 
              className="transition-colors whitespace-nowrap block py-2 px-1 hover:text-gray-200"
            >
              ABOUT
            </Link>
          </nav>

          {/* Mobile Menu (Dropdown) */}
          <AnimatePresence mode="wait">
            {isMobileMenuOpen && (
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <motion.div
                  initial={{ 
                    opacity: 0, 
                    height: 0,
                    scale: 0.95,
                    y: -10,
                  }}
                  animate={{ 
                    opacity: 1, 
                    height: 'auto',
                    scale: 1,
                    y: 0,
                  }}
                  exit={{ 
                    opacity: 0, 
                    height: 0,
                    scale: 0.95,
                    y: -10,
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }}
                  className="md:hidden absolute left-0 right-0 top-full bg-[#622A1F] border-b border-gray-200 shadow-2xl z-50 overflow-hidden"
                  style={{
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <motion.nav
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    delay: 0.1
                  }}
                  className="flex flex-col font-inter font-extrabold text-white"
                >
                  {[
                    { href: '/foods', label: 'FOODS' },
                    { href: '/products/gift-souvenir', label: 'GIFT & SOUVENIR' },
                    { href: '/products/puja-samagri', label: 'PUJA SAMAGRI' },
                    { href: '/products/handicrafts', label: 'HANDICRAFTS' },
                    { href: '/products/musical-instruments', label: 'MUSICAL INSTRUMENTS' },
                    { href: '/products/herbs-naturals', label: 'HERBS & NATURALS' },
                    { href: '/products/jewellery', label: 'JEWELLERY' },
                    { href: '/about', label: 'ABOUT' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ 
                        opacity: 0, 
                        x: -30,
                        rotateX: -15,
                        scale: 0.9
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        rotateX: 0,
                        scale: 1
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: -30,
                        rotateX: -15,
                        scale: 0.9
                      }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                        delay: 0.05 + (index * 0.06),
                      }}
                      whileHover={{ 
                        x: 8,
                        scale: 1.02,
                        transition: { 
                          type: 'spring',
                          stiffness: 400,
                          damping: 20
                        }
                      }}
                      whileTap={{ 
                        scale: 0.98,
                        x: 4
                      }}
                    >
                      <Link 
                        href={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="relative block py-3 px-4 hover:bg-orange-600 border-b border-orange-700 text-sm overflow-hidden group"
                      >
                        <motion.span
                          className="relative z-10"
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {item.label}
                        </motion.span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
              </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}



