'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Urbanist } from 'next/font/google';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400','500','600','700'] });
import { Search, ShoppingCart, User, Heart, ChevronRight, MapPin, ChevronDown, PackageSearch, X, Menu, Globe, CreditCard, Truck, Headphones } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import AuthModal from './AuthModal';
import BrandSection from './BrandSection';
import CategorySection from './CategorySection';
import CarouselCategory from './CarouselCategory';
import ForYou from './ForYou';
import Foods from './Foods';
import Dress from './Dress';
import Slider from './Slider';
import CategoryShowcase from './CategoryShowcase';
import OngoingSales from './OngoingSales';
import SignupModal from './SignupModal';
import Statues from './Statues';
import AfterForYouBanner from './AfterForYouBanner';
import DiamondJewelleryShowcase from './DiamondJewelleryShowcase';
import Carpet from './Carpet';

export default function Homepage() {
  // Helper function to format price safely
  const formatPrice = (price: any): string => {
    const numPrice = typeof price === 'number' ? price : typeof price === 'string' ? parseFloat(price) : 0;
    const validPrice = isNaN(numPrice) ? 0 : numPrice;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(validPrice);
  };

  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [userLocation, setUserLocation] = useState<string>('Detecting location...');
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isTrackingOrder, setIsTrackingOrder] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');
  const [selectedCountry, setSelectedCountry] = useState('Nepal');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'GharSamma',
    siteLogo: '',
    siteFavicon: ''
  });
  const [specialOffersMedia, setSpecialOffersMedia] = useState<any[]>([]);
  const [promotionalBanners, setPromotionalBanners] = useState<any[]>([]);
  const [showFoodsDropdown, setShowFoodsDropdown] = useState(false);
  const [showDressDropdown, setShowDressDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
                setSelectedCity(preciseData.city);
                setSelectedCountry(region || 'Nepal');
              } else {
                setSelectedCity(city);
                setSelectedCountry(region || 'Nepal');
              }
            } catch {
              setSelectedCity(city);
              setSelectedCountry(region || 'Nepal');
            }
          } else {
            setSelectedCity(city);
            setSelectedCountry(region || 'Nepal');
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
                    setSelectedCity(data.city);
                    setSelectedCountry(data.principalSubdivision);
                  } else {
                    setSelectedCity(data.city || 'Kathmandu');
                    setSelectedCountry(data.principalSubdivision || 'Nepal');
                  }
                } catch (error) {
                  setSelectedCity('Kathmandu');
                  setSelectedCountry('Nepal');
                } finally {
                  setIsLocationLoading(false);
                }
              },
              () => {
                setSelectedCity('Kathmandu');
                setSelectedCountry('Nepal');
                setIsLocationLoading(false);
              }
            );
            return; // Don't set loading to false here as geolocation is async
          } else {
            setSelectedCity('Kathmandu');
            setSelectedCountry('Nepal');
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setSelectedCity('Kathmandu');
        setSelectedCountry('Nepal');
      } finally {
        setIsLocationLoading(false);
      }
    };

    getUserLocation();
  }, []);


  // Set mounted state after initial render to prevent animations on page load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch site settings (logo, favicon, siteName)
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/configuration/public/site-settings`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSiteSettings(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
        // Keep default values
      }
    };

    const fetchSpecialOffersMedia = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/media?linkTo=special-offers`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSpecialOffersMedia(data.data.mediaItems || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch special offers media:', error);
      }
    };

    const fetchPromotionalBanners = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/media?linkTo=home&active=true`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPromotionalBanners(data.data.mediaItems || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch promotional banners:', error);
      }
    };

    fetchSiteSettings();
    fetchSpecialOffersMedia();
    fetchPromotionalBanners();
  }, []);

  // Update favicon when site settings change
  useEffect(() => {
    if (siteSettings.siteFavicon) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = siteSettings.siteFavicon;
      } else {
        // Create a new link element if it doesn't exist
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = siteSettings.siteFavicon;
        document.head.appendChild(newLink);
      }
    }
  }, [siteSettings.siteFavicon]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Track Order function
  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      alert('Please enter an order number');
      return;
    }

    setIsTrackingOrder(true);
    setTrackingResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const response = await fetch(`${apiUrl}/api/v1/orders/${orderNumber}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setTrackingResult(data.data.order);
      } else {
        setTrackingResult({ error: 'Order not found. Please check your order number.' });
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setTrackingResult({ error: 'Unable to track order. Please try again later.' });
    } finally {
      setIsTrackingOrder(false);
    }
  };

  // Search function with debounce
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const response = await fetch(`${apiUrl}/api/v1/products?search=${encodeURIComponent(query)}&limit=8`);
      const data = await response.json();

      if (response.ok && data.success) {
        setSearchResults(data.data.products || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search handler
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);




  return (
    <div className="min-h-screen ">
     
      {/* Hero Section - Column Layout */}
            <div>
        <div className="w-[100vw] md:w-[95vw]">
          {/* Top Section - Slider */}
          <div className="h-48 sm:h-64 md:h-80 lg:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden mr-6 ml-3 sm:mx-4 md:mx-6 my-2 md:my-6 rounded-lg">
            <Slider />
          </div>
              </div>
            </div>

    

      {/* Ongoing Sales Section */}
      <OngoingSales />

     
            

        {/* Category Section - Dynamic from API */}
      <CategorySection />
      {/* <CarouselCategory /> */}
      {/* For You Section */}

     
      <ForYou />
     

   
      
      {/* Category Showcase Section */}
      <CategoryShowcase />
      
      <Foods />

      <Carpet />

      {/* Promotional Banner Section */}
      {promotionalBanners.length > 0 ? (
        <div className="bg-white bg-red-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {promotionalBanners.slice(0, 1).map((banner) => (
              <Link 
                key={banner.id} 
                href={banner.internalLink || '/special-offers'} 
                className="block group"
              >
                <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={banner.mediaUrl}
                    alt={banner.linkTo || 'Promotional Banner'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to a gradient if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className += ' bg-gradient-to-r from-blue-600 to-purple-600';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
                    <div className="px-6 md:px-12 text-white">
                      <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 custom-font">
                        Exclusive Offers
                      </h3>
                      <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90 custom-font">
                        Discover amazing deals and special promotions
                      </p>
                      <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors custom-font text-sm md:text-base">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white pb-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/special-offers" className="block group">
              <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 md:px-12 text-white">
                    <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 custom-font">
                      Exclusive Offers
                    </h3>
                    <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90 custom-font">
                      Discover amazing deals and special promotions
                    </p>
                    <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors custom-font text-sm md:text-base">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
      
      <Dress />

      <Statues/>

      <DiamondJewelleryShowcase />

      
      {/* Bento Grid Section */}
      {/* <div className="py-2 pt-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Large Featured Image - Spans 2 columns and 2 rows */}
            {/* <div className="md:col-span-2 md:row-span-2 rounded-md  overflow-hidden  relative group min-h-[400px] md:min-h-[800px]">
              <Image
                src="/grid1.jpeg"
                alt="Featured Collection"
                fill
                className="object-contain  transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
             
             
            </div>
             */}
            {/* Small Card 1 */}
            {/* <div className="rounded-md overflow-hidden relative group min-h-[600px]">
              <Image
                src="/grid2.jpeg"
                alt="New Arrivals"
                fill
                className="object-contain transition-transform duration-300"
              />
             
              
            </div> */}
            
            {/* Small Card 2 */}
            {/* <div className="rounded-md overflow-hidden shadow-lg relative group min-h-[200px]"> */}
              {/* <Image
                src="/grid3.jpeg"
                alt="Special Offers"
                fill
                className="object-contain transition-transform duration-300"
              />
              
              
            </div> */}

            {/* Medium Card - Spans 2 columns */}
            {/* <div className="md:col-span-2 rounded-md overflow-hidden shadow-lg relative group min-h-[400px]">
              <Image
                src="/banner.jpg"
                alt="Seasonal Collection"
                fill
                className="object-cover transition-transform duration-300"
              />
            
               
            
            </div>
          </div>
        </div> */}
      {/* </div> */} 

      {/* Signup Discount Modal */}
      <SignupModal />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Track Order Modal */}
      {showTrackOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F0F2F5] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-[#F0F2F5] z-10">
              <h2 className="text-2xl font-bold text-gray-900 custom-font">Track Your Order</h2>
              <button 
                onClick={() => {
                  setShowTrackOrderModal(false);
                  setOrderNumber('');
                  setTrackingResult(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                  Enter Your Order Number
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g., ORD-123456"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] custom-font text-lg text-black"
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  />
                  <button
                    onClick={handleTrackOrder}
                    disabled={isTrackingOrder}
                    className="px-6 py-3 bg-[#0077b6] text-white rounded-lg hover:bg-[#005f8f] transition-colors font-medium custom-font disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTrackingOrder ? 'Tracking...' : 'Track Order'}
                  </button>
                </div>
              </div>

              {/* Tracking Results */}
              {trackingResult && (
                <div className="mt-6">
                  {trackingResult.error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 custom-font">{trackingResult.error}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 custom-font">Order Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-600 custom-font">Order Number</p>
                          <p className="text-lg font-semibold text-gray-900 custom-font">{trackingResult.orderNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 custom-font">Status</p>
                          <p className="text-lg font-semibold text-[#0077b6] custom-font capitalize">{trackingResult.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 custom-font">Order Date</p>
                          <p className="text-lg font-semibold text-gray-900 custom-font">
                            {new Date(trackingResult.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 custom-font">Total Amount</p>
                          <p className="text-lg font-semibold text-gray-900 custom-font">${trackingResult.totalAmount}</p>
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3 custom-font">Order Timeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900 custom-font">Order Placed</p>
                              <p className="text-sm text-gray-600 custom-font">{new Date(trackingResult.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          {trackingResult.status !== 'pending' && (
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900 custom-font">Order Confirmed</p>
                                <p className="text-sm text-gray-600 custom-font">Processing your order...</p>
                              </div>
                            </div>
                          )}
                          {['shipped', 'delivered'].includes(trackingResult.status) && (
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-[#0077b6] rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900 custom-font">Shipped</p>
                                <p className="text-sm text-gray-600 custom-font">On its way to you...</p>
                              </div>
                            </div>
                          )}
                          {trackingResult.status === 'delivered' && (
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900 custom-font">Delivered</p>
                                <p className="text-sm text-gray-600 custom-font">Your order has been delivered!</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F0F2F5] rounded-xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 custom-font">Select Location</h2>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    Select Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] text-black custom-font text-lg"
                  >
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    Select City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] text-black custom-font text-lg"
                  >
                    {selectedCountry === 'Nepal' && (
                      <>
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Pokhara">Pokhara</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Chitwan">Chitwan</option>
                        <option value="Butwal">Butwal</option>
                        <option value="Biratnagar">Biratnagar</option>
                        <option value="Dharan">Dharan</option>
                        <option value="Birgunj">Birgunj</option>
                        <option value="Hetauda">Hetauda</option>
                      </>
                    )}
                    {selectedCountry === 'India' && (
                      <>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                      </>
                    )}
                    {selectedCountry === 'Bangladesh' && (
                      <>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                      </>
                    )}
                    {selectedCountry === 'Bhutan' && (
                      <>
                        <option value="Thimphu">Thimphu</option>
                        <option value="Phuentsholing">Phuentsholing</option>
                      </>
                    )}
                    {selectedCountry === 'Sri Lanka' && (
                      <>
                        <option value="Colombo">Colombo</option>
                        <option value="Kandy">Kandy</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="w-full px-6 py-3 bg-[#0077b6] text-white rounded-lg hover:bg-[#005f8f] transition-colors font-medium custom-font"
                >
                  Save Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
