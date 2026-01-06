'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Heart, ChevronRight, MapPin, ChevronDown, PackageSearch, X, Menu, Truck, Car, ShoppingBag, Home, ChevronUp, Smartphone, Minus, Plus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import TopBanner from './TopBanner';
import { useLocation } from '@/contexts/LocationContext';
import { useCart } from '@/contexts/CartContext';

interface NavItem {
  id: string;
  label: string;
  href: string;
  type: 'link' | 'dropdown';
  columns?: NavColumn[];
}

interface NavColumn {
  title: string;
  groups?: NavGroup[];
  items?: NavLink[];
}

interface NavGroup {
  title: string;
  items: NavLink[];
}

interface NavLink {
  label: string;
  href: string;
}

export default function GlobalHeader() {
  const pathname = usePathname();

  // Hide GlobalHeader on login page
  if (pathname === '/login') {
    return null;
  }

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
  const [isLocationLoadingState, setIsLocationLoadingState] = useState(true);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isTrackingOrder, setIsTrackingOrder] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isDeliverySectionExpanded, setIsDeliverySectionExpanded] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'shipping' | 'pickup' | 'delivery'>('delivery');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressStep, setAddressStep] = useState(1);
  const [addressFormData, setAddressFormData] = useState({
    country: '',
    state: '',
    postalCode: '',
    streetAddress: '',
    apartment: '',
    phoneNumber: ''
  });
  const [savedAddress, setSavedAddress] = useState<{
    country: string;
    state: string;
    postalCode: string;
    streetAddress: string;
    apartment: string;
    phoneNumber: string;
  } | null>(null);


  // Navigation State
  const [navigationItems, setNavigationItems] = useState<NavItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Hardcoded navigation items
  const hardcodedNavigationItems: NavItem[] = [
    
    {
      id: 'foods',
      label: 'Foods',
      href: '/products/foods',
      type: 'dropdown',
      columns: [
        {
          title: 'Achar Categories',
          items: [
            { label: 'Veg Achar', href: '/products/foods/achar/veg-achar' },
            { label: 'Non-Veg Achar', href: '/products/foods/achar/non-veg-achar' },
            { label: 'Mango Achar', href: '/products/foods/achar/mango-achar' },
            { label: 'Lemon Achar', href: '/products/foods/achar/lemon-achar' },
            { label: 'Mixed Achar', href: '/products/foods/achar/mixed-achar' },
          ]
        },
        {
          title: 'Snack Categories',
          items: [
            { label: 'Buff Snacks', href: '/products/foods/snacks/buff-snacks' },
            { label: 'Fish Snack', href: '/products/foods/snacks/fish-snack' },
            { label: 'Chicken Snack', href: '/products/foods/snacks/chicken-snack' },
            { label: 'Pork Snack', href: '/products/foods/snacks/pork-snack' },
            { label: 'Mutton Snack', href: '/products/foods/snacks/mutton-snack' },
          ]
        },
      ]
    },
    {
      id: 'statue',
      label: 'Statue',
      href: '/products/statue',
      type: 'dropdown',
      columns: [
        {
          title: 'Religious Statues',
          items: [
            { label: 'Ganesh Idol', href: '/products/statue/ganesh' },
            { label: 'Buddha Statue', href: '/products/statue/buddha' },
            { label: 'Shiva Idol', href: '/products/statue/shiva' },
            { label: 'Krishna Idol', href: '/products/statue/krishna' },
            { label: 'Durga Idol', href: '/products/statue/durga' },
          ]
        },
        
      ]
    },
    {
      id: 'carpet',
      label: 'Carpet',
      href: '/products/carpet',
      type: 'dropdown',
      columns: [
        {
          title: 'Carpet Types',
          items: [
            { label: 'Woven Carpets', href: '/products/carpet/woven' },
            { label: 'Pashmina Carpets', href: '/products/carpet/pashmina' },
            { label: 'Silk Carpets', href: '/products/carpet/silk' },
            { label: 'Persian Carpets', href: '/products/carpet/persian' },
            { label: 'Rug Carpets', href: '/products/carpet/rug' },
          ]
        },
        {
          title: 'Carpet Materials',
          items: [
            { label: 'Wool Carpets', href: '/products/carpet/wool' },
            { label: 'Cotton Carpets', href: '/products/carpet/cotton' },
            { label: 'Synthetic Carpets', href: '/products/carpet/synthetic' },
          ]
        }
      ]
    },
    {
      id: 'dress',
      label: 'Dress',
      href: '/products/dress',
      type: 'dropdown',
      columns: [
        {
          title: 'Traditional Dresses',
          items: [
            { label: 'Saree', href: '/products/dress/traditional/saree' },
            { label: 'Kurta', href: '/products/dress/traditional/kurta' },
            { label: 'Lehenga', href: '/products/dress/traditional/lehenga' },
            { label: 'Dhoti', href: '/products/dress/traditional/dhoti' },
            { label: 'Sherwani', href: '/products/dress/traditional/sherwani' },
          ]
        },
        {
          title: 'Modern Dresses',
          items: [
            { label: 'Western Wear', href: '/products/dress/modern/western' },
            { label: 'Casual Wear', href: '/products/dress/modern/casual' },
            { label: 'Formal Wear', href: '/products/dress/modern/formal' },
          ]
        }
      ]
    },
    {
      id: 'jewelry',
      label: 'Jewelry',
      href: '/products/jewelry',
      type: 'dropdown',
      columns: [
        {
          title: 'Metal Types',
          items: [
            { label: 'Gold Jewelry', href: '/products/jewelry/gold' },
            { label: 'Silver Jewelry', href: '/products/jewelry/silver' },
            { label: 'Platinum Jewelry', href: '/products/jewelry/platinum' },
            { label: 'Alloy Jewelry', href: '/products/jewelry/alloy' },
          ]
        },
        {
          title: 'Jewelry Types',
          items: [
            { label: 'Necklaces', href: '/products/jewelry/necklaces' },
            { label: 'Earrings', href: '/products/jewelry/earrings' },
            { label: 'Rings', href: '/products/jewelry/rings' },
            { label: 'Bracelets', href: '/products/jewelry/bracelets' },
            { label: 'Anklets', href: '/products/jewelry/anklets' },
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // Use hardcoded navigation items
    setNavigationItems(hardcodedNavigationItems);
  }, []);

  // Use cart context instead of local state
  const { cartItemCount, cartTotal, cartItems, updateQuantity, removeFromCart } = useCart();


  // Use LocationContext instead of local state
  const { selectedCountry, selectedCity, setSelectedCountry, setSelectedCity } = useLocation();
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

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRefMobile = useRef<HTMLDivElement>(null);
  const locationRefDesktop = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const deliverySectionRef = useRef<HTMLDivElement>(null);

  // Get user location with improved accuracy
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setIsLocationLoadingState(true);

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
                setSelectedCountry('Nepal');
              } else {
                setSelectedCity(city);
                setSelectedCountry('Nepal');
              }
            } catch {
              setSelectedCity(city);
              setSelectedCountry('Nepal');
            }
          } else {
            setSelectedCity(city);
            const finalCountry = country || 'Nepal';
            setSelectedCountry(finalCountry);
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
                    setSelectedCountry('Nepal');
                  } else {
                    setSelectedCity(data.city || 'Kathmandu');
                    setSelectedCountry('Nepal');
                  }
                } catch (error) {
                  setSelectedCity('Kathmandu');
                  setSelectedCountry('Nepal');
                } finally {
                  setIsLocationLoadingState(false);
                }
              },
              () => {
                setSelectedCity('Kathmandu');
                setSelectedCountry('Nepal');
                setIsLocationLoadingState(false);
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
        setIsLocationLoadingState(false);
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


    fetchSiteSettings();

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

  // Close location modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLocationModal) {
        const target = event.target as Node;
        const isMobile = locationRefMobile.current && locationRefMobile.current.contains(target);
        const isDesktop = locationRefDesktop.current && locationRefDesktop.current.contains(target);

        // Close if clicked outside both (on mobile or desktop)
        if (!isMobile && !isDesktop) {
          setShowLocationModal(false);
        }
      }
    };

    if (showLocationModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationModal]);

  // Close expandable delivery section when clicking outside
  useEffect(() => {
  }, [showLocationModal]);

  // Close expandable delivery section when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDeliverySectionExpanded) {
        const target = event.target as Node;
        const isMobile = locationRefMobile.current && locationRefMobile.current.contains(target);
        const isDesktop = locationRefDesktop.current && locationRefDesktop.current.contains(target);

        // Close if clicked outside both (on mobile or desktop)
        if (!isMobile && !isDesktop) {
          setIsDeliverySectionExpanded(false);
        }
      }
    };

    if (isDeliverySectionExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationModal]);

  // Close expandable delivery section when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deliverySectionRef.current && !deliverySectionRef.current.contains(event.target as Node)) {
        setIsDeliverySectionExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeliverySectionExpanded]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);


  return (
    <div className="w-full font-inter">
      {/* Top Promotional Banner - Dynamic */}
      <TopBanner />

      {/* Search Bar Section */}
      <div className="border-b" style={{ backgroundColor: '#EB6426', borderColor: '#d65a1f' }}>
        <div className="max-w-8xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-3 md:py-4">
          {/* Mobile: Logo and top actions */}
          <div className="flex lg:hidden items-center justify-between gap-2 mb-3 px-4">
            <Link href="/" className="flex items-center">
              {siteSettings.siteLogo ? (
                <img
                  src={siteSettings.siteLogo}
                  alt={siteSettings.siteName}
                  className="h-10 w-auto object-contain"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}
              <img
                src="/main.png"
                alt="GharSamma Logo"
                className="h-10 w-32 object-contain"
              />
            </Link>
            <div className="flex items-center gap-2">
              {/* Track Order */}
              <button
                onClick={() => setShowTrackOrderModal(true)}
                className="p-2 text-white rounded-lg hover:bg-orange-700 transition-colors flex-shrink-0"
                aria-label="Track Order"
              >
                <PackageSearch className="w-5 h-5" />
              </button>
              {/* Deliver to - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:flex relative" ref={locationRefDesktop}>
                <button
                  onClick={() => setIsDeliverySectionExpanded(!isDeliverySectionExpanded)}
                  className="flex items-start gap-2 text-white hover:bg-orange-700 rounded-lg p-2 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col items-start gap-0.5 flex-1">
                    <span className="text-xs font-extrabold text-white">Deliver to</span>
                    {!isLocationLoadingState ? (
                      savedAddress ? (
                        <span className="text-xs font-medium text-white truncate max-w-[100px]">
                          {savedAddress.streetAddress}, {savedAddress.state || savedAddress.country}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-white whitespace-nowrap truncate max-w-[80px]">{selectedCountry}</span>
                      )
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-white">Detecting...</span>
                      </div>
                    )}
                  </div>
                  {isDeliverySectionExpanded ? (
                    <ChevronUp className="w-3 h-3 text-white flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-white flex-shrink-0 mt-0.5" />
                  )}
                </button>

                {/* Expandable Content - Desktop (in mobile header area) */}
                <AnimatePresence>
                  {isDeliverySectionExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute top-full right-0 mt-2 w-80 overflow-hidden z-[250]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200">
                        {/* Add Address Card */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {savedAddress ? 'Delivery Address' : 'Add an address for shipping and delivery'}
                              </p>
                              {savedAddress ? (
                                <div className="text-xs text-gray-600 mb-3 space-y-1">
                                  <p>{savedAddress.streetAddress}{savedAddress.apartment ? `, ${savedAddress.apartment}` : ''}</p>
                                  <p>{savedAddress.state}{savedAddress.postalCode ? ` ${savedAddress.postalCode}` : ''}, {savedAddress.country}</p>
                                  <p>Phone: {savedAddress.phoneNumber}</p>
                                </div>
                              ) : (
                                !isLocationLoadingState ? (
                                  <p className="text-xs text-gray-600 mb-3">
                                    {selectedCity}, {selectedCountry}
                                  </p>
                                ) : (
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-gray-600">Detecting...</span>
                                  </div>
                                )
                              )}
                              <button
                                onClick={() => {
                                  setShowAddressModal(true);
                                  setAddressFormData(
                                    savedAddress || {
                                      country: selectedCountry || '',
                                      state: '',
                                      postalCode: '',
                                      streetAddress: '',
                                      apartment: '',
                                      phoneNumber: ''
                                    }
                                  );
                                }}
                                className="w-full bg-[#252C6A] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#1a2052] transition-colors"
                              >
                                {savedAddress ? 'Edit Address' : 'Add address'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Store Location Card */}
                        <div className="p-4">
                          <button
                            onClick={() => setIsDeliverySectionExpanded(false)}
                            className="w-full flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                          >
                            <Home className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {savedAddress ? `${savedAddress.state || savedAddress.country} Store` : `${selectedCity} Store`}
                              </p>
                              <p className="text-xs text-gray-600">
                                {savedAddress ? `${savedAddress.state || savedAddress.country}, ${savedAddress.country}` : `${selectedCity}, ${selectedCountry}`}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar - New Row */}
          <motion.div
            className="lg:hidden mb-3 space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={isMounted ? { duration: 0.3 } : { duration: 0 }}
          >
            <div className="mx-4 flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white rounded-lg hover:bg-orange-700 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        handleSearch(searchQuery);
                      }
                    }
                    if (e.key === 'Escape') {
                      setShowSearchResults(false);
                    }
                  }}
                  className="w-full text-base px-4 py-2.5 pr-12 border border-gray-200 rounded-full focus:outline-none bg-white text-black placeholder-gray-500"
                />
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-10 h-11 bg-[#f8f6f7] rounded-full"></div>
                <button className="absolute rounded-full -right-3 top-0.5 p-3 bg-white hover:bg-gray-200 transition-colors z-100">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Mobile Delivery Section - Expandable */}
            <div ref={locationRefMobile} className="lg:hidden mx-2 mt-2 w-full">
              {/* Header - Pickup or delivery? */}
              <button
                onClick={() => setIsDeliverySectionExpanded(!isDeliverySectionExpanded)}
                className="w-full flex items-center gap-1 text-white py-2 pl-2 pr-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                {/* Circular Icon */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>

                {/* Text Section */}
                <div className="flex items-center justify-between gap-2 flex-1 w-full">
                  <span className="text-lg font-extrabold text-white">Deliver to</span>
                  {!isLocationLoadingState ? (
                    savedAddress ? (
                      <span className="text-sm font-medium text-white truncate max-w-[200px]">
                        {savedAddress.streetAddress}, {savedAddress.state || savedAddress.postalCode || savedAddress.country}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-white">{selectedCity}, {selectedCountry}</span>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Detecting...</span>
                    </div>
                  )}
                </div>

                {/* Chevron Icon */}
                {isDeliverySectionExpanded ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                )}
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {isDeliverySectionExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white rounded-lg mt-2 shadow-lg">
                      {/* Add Address Card */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {savedAddress ? 'Delivery Address' : 'Add an address for shipping and delivery'}
                            </p>
                            {savedAddress ? (
                              <div className="text-xs text-gray-600 mb-3 space-y-1">
                                <p>{savedAddress.streetAddress}{savedAddress.apartment ? `, ${savedAddress.apartment}` : ''}</p>
                                <p>{savedAddress.state}{savedAddress.postalCode ? ` ${savedAddress.postalCode}` : ''}, {savedAddress.country}</p>
                                <p>Phone: {savedAddress.phoneNumber}</p>
                              </div>
                            ) : (
                              !isLocationLoadingState ? (
                                <p className="text-xs text-gray-600 mb-3">
                                  {selectedCity}, {selectedCountry}
                                </p>
                              ) : (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs text-gray-600">Detecting...</span>
                                </div>
                              )
                            )}
                            <button
                              onClick={() => {
                                setShowAddressModal(true);
                                setAddressFormData(
                                  savedAddress || {
                                    country: selectedCountry || '',
                                    state: '',
                                    postalCode: '',
                                    streetAddress: '',
                                    apartment: '',
                                    phoneNumber: ''
                                  }
                                );
                              }}
                              className="w-full bg-[#252C6A] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#1a2052] transition-colors"
                            >
                              {savedAddress ? 'Edit Address' : 'Add address'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Store Location Card */}
                      <div className="p-4">
                        <button
                          onClick={() => setIsDeliverySectionExpanded(false)}
                          className="w-full flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        >
                          <Home className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {savedAddress ? `${savedAddress.state || savedAddress.country} Store` : `${selectedCity} Store`}
                            </p>
                            <p className="text-xs text-gray-600">
                              {savedAddress ? `${savedAddress.state || savedAddress.country}, ${savedAddress.country}` : `${selectedCity}, ${selectedCountry}`}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="px-4 relative">
            {/* Mobile Menu Dropdown - Full Height Overlay */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {/* Menu Panel */}
                  <motion.div
                    className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 overflow-y-auto"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-[#EB6426] to-[#4a1f18]">
                      {/* Top Section - Logo, Track Order, Deliver to */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-white/20">
                        <Link href="/" className="flex items-center flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
                          {siteSettings.siteLogo ? (
                            <img
                              src={siteSettings.siteLogo}
                              alt={siteSettings.siteName}
                              className="h-10 w-auto object-contain"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.classList.remove('hidden');
                                }
                              }}
                            />
                          ) : null}
                          <img
                            src="/main.png"
                            alt="GharSamma Logo"
                            className="h-10 w-32 object-contain"
                          />
                        </Link>
                        <div className="flex items-center gap-2">
                          {/* Track Order */}
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setShowTrackOrderModal(true);
                            }}
                            className="p-2 text-white rounded-lg hover:bg-[#F0F2F5]/20 transition-colors flex-shrink-0"
                            aria-label="Track Order"
                          >
                            <PackageSearch className="w-5 h-5" />
                          </button>
                          {/* Deliver to */}
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setShowLocationModal(true);
                            }}
                            className="flex items-center gap-1.5 text-white hover:bg-[#F0F2F5]/20 rounded-lg p-2 transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-white/80">Deliver to</span>
                              <span className="text-sm font-semibold whitespace-nowrap truncate max-w-[100px]">
                                {selectedCity}
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                      {/* Title and Close Section */}
                      <div className="px-4 py-3 flex items-center justify-between">
                        <h2 className="text-white text-lg font-bold">
                          {activeDropdown
                            ? navigationItems.find(item => item.id === activeDropdown)?.label
                            : 'Menu'}
                        </h2>
                        <div className="flex items-center gap-2">
                          {activeDropdown && (
                            <button
                              onClick={() => setActiveDropdown(null)}
                              className="text-white hover:bg-[#F0F2F5]/20 p-2 rounded-lg transition-colors"
                            >
                              <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                          )}
                          <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-white hover:bg-[#F0F2F5]/20 p-2 rounded-lg transition-colors"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {!activeDropdown ? (
                        <motion.nav
                          key="main-menu"
                          className="flex flex-col font-extrabold text-black font-inter"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {navigationItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={isMounted ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                            >
                              {item.type === 'dropdown' ? (
                                <button
                                  onClick={() => setActiveDropdown(item.id)}
                                  className="transition-colors block py-3 px-6 hover:bg-gray-50 border-b border-gray-100 text-sm w-full text-left flex items-center justify-between"
                                >
                                  <span>{item.label}</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              ) : (
                                <Link
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="transition-colors block py-3 px-6 hover:bg-gray-50 border-b border-gray-100 text-sm"
                                >
                                  {item.label}
                                </Link>
                              )}
                            </motion.div>
                          ))}
                        </motion.nav>
                      ) : (
                        navigationItems.filter(i => i.id === activeDropdown).map(item => (
                          <motion.nav
                            key={item.id}
                            className="flex flex-col"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="bg-gray-100 px-4 py-2 flex items-center">
                              <button onClick={() => setActiveDropdown(null)} className="flex items-center text-sm font-bold text-gray-700">
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back
                              </button>
                            </div>
                            {item.columns?.map((column, idx) => (
                              <div key={idx} className="px-4 py-3 border-b border-gray-200">
                                <div className="font-semibold text-gray-800 text-lg mb-1">{column.title}</div>
                                {column.groups ? (
                                  column.groups.map((group, grpIdx) => (
                                    <div key={grpIdx} className="mb-3">
                                      <div className="text-gray-600 text-sm mb-2 font-medium">{group.title}</div>
                                      <div className="space-y-2 ml-2">
                                        {group.items.map((subItem, subIdx) => (
                                          <Link key={subIdx} href={subItem.href} className="block py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                            {subItem.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="space-y-2">
                                    {column.items?.map((subItem, subIdx) => (
                                      <Link key={subIdx} href={subItem.href} className="block py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                        {subItem.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </motion.nav>
                        ))
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              {
                siteSettings.siteLogo ? (
                  <img
                    src={siteSettings.siteLogo}
                    alt={siteSettings.siteName}
                    className="h-12 lg:h-14 xl:h-16 w-auto object-contain"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null
              }
              <img
                src="/main.png"
                alt="GharSamma Logo"
                className="h-12 lg:h-14 xl:h-16 w-40 object-contain"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="flex-1 flex justify-center max-w-md mx-8">
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-1 relative" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (searchQuery.trim()) {
                          handleSearch(searchQuery);
                        }
                      }
                      if (e.key === 'Escape') {
                        setShowSearchResults(false);
                      }
                    }}
                    className="w-full text-xl px-4 py-3 pr-12 border border-gray-200 rounded-full focus:outline-none bg-white text-black placeholder-black"
                  />
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-10 h-11 bg-[#f8f6f7] rounded-full"></div>
                  <button className="absolute rounded-full -right-3 top-1.5 p-3 bg-white hover:bg-gray-200 transition-colors z-100">
                    <Search className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#F0F2F5] rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                      {isSearching ? (
                        <div className="p-8 text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-500">Searching...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            Found {searchResults.length} products
                          </div>
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                setShowSearchResults(false);
                                setSearchQuery('');
                              }}
                            >
                              <img
                                src={product.images?.[0] || product.image || '/image.png'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                                <p className="text-xs text-gray-500">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No products found</p>
                          <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right Side - Deliver to, Track Order, Cart and Account Icons */}
            <div className="flex items-center space-x-6">
              {/* Deliver to Section - Desktop */}
              <div className="relative" ref={locationRefDesktop}>
                <button
                  onClick={() => setIsDeliverySectionExpanded(!isDeliverySectionExpanded)}
                  className="flex items-start gap-2 text-white hover:bg-orange-700 rounded-lg p-2 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col items-start gap-0.5 flex-1">
                    <span className="text-xs font-extrabold text-white">Deliver to</span>
                    {!isLocationLoadingState ? (
                      savedAddress ? (
                        <span className="text-sm font-medium text-white truncate max-w-[150px]">
                          {savedAddress.streetAddress}, {savedAddress.state || savedAddress.postalCode || savedAddress.country}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-white">{selectedCity}, {selectedCountry}</span>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Detecting...</span>
                      </div>
                    )}
                  </div>
                  {isDeliverySectionExpanded ? (
                    <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                </button>

                {/* Expandable Content - Desktop */}
                <AnimatePresence>
                  {isDeliverySectionExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute top-full right-0 mt-2 w-80 overflow-hidden z-[250]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-200">
                        {/* Add Address Card */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {savedAddress ? 'Delivery Address' : 'Add an address for shipping and delivery'}
                              </p>
                              {savedAddress ? (
                                <div className="text-xs text-gray-600 mb-3 space-y-1">
                                  <p>{savedAddress.streetAddress}{savedAddress.apartment ? `, ${savedAddress.apartment}` : ''}</p>
                                  <p>{savedAddress.state}{savedAddress.postalCode ? ` ${savedAddress.postalCode}` : ''}, {savedAddress.country}</p>
                                  <p>Phone: {savedAddress.phoneNumber}</p>
                                </div>
                              ) : (
                                !isLocationLoadingState ? (
                                  <p className="text-xs text-gray-600 mb-3">
                                    {selectedCity}, {selectedCountry}
                                  </p>
                                ) : (
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs text-gray-600">Detecting...</span>
                                  </div>
                                )
                              )}
                              <button
                                onClick={() => {
                                  setShowAddressModal(true);
                                  setAddressFormData(
                                    savedAddress || {
                                      country: selectedCountry || '',
                                      state: '',
                                      postalCode: '',
                                      streetAddress: '',
                                      apartment: '',
                                      phoneNumber: ''
                                    }
                                  );
                                }}
                                className="w-full bg-[#252C6A] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#1a2052] transition-colors"
                              >
                                {savedAddress ? 'Edit Address' : 'Add address'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Store Location Card */}
                        <div className="p-4">
                          <button
                            onClick={() => setIsDeliverySectionExpanded(false)}
                            className="w-full flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                          >
                            <Home className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {savedAddress ? `${savedAddress.state || savedAddress.country} Store` : `${selectedCity} Store`}
                              </p>
                              <p className="text-xs text-gray-600">
                                {savedAddress ? `${savedAddress.state || savedAddress.country}, ${savedAddress.country}` : `${selectedCity}, ${selectedCountry}`}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Track Order Icon */}
              <button
                onClick={() => setShowTrackOrderModal(true)
                }
                className="flex items-center space-x-2 p-2 text-white rounded-lg transition-colors group hover:bg-orange-700"
                style={{ color: 'white' }}
              >
                <PackageSearch className="w-6 h-6" />
                <span className="text-sm font-bold">Track Order</span>
              </button>

              {/* Account and Cart Icons */}
              <div className="flex items-center space-x-4">
                {/* Account Icon with Sign in text */}
                {/* Account Icon with Sign in text */}
                <Link
                  href="/login"
                  className="flex items-center gap-2 p-2 text-white rounded-lg transition-colors hover:bg-orange-700" style={{ color: 'white' }}
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-bold">Sign in</span>
                </Link>
                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative flex flex-col items-center p-2 text-white rounded-lg transition-colors hover:bg-orange-700"
                  style={{ color: 'white' }}
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-white font-bold mt-1">
                    <sup className="text-[0.7em]">$</sup>
                    {new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(cartTotal)}
                  </span>
                </Link>
              </div>
            </div>
          </div>



        </div>
      </div>

      {/* Category Navigation Bar - Responsive */}
      <div className="hidden md:block relative z-[200]" ref={categoryRef} style={{ backgroundColor: '#622A1F' }}>
        <div className="w-full px-6 py-2">
          <nav className="flex items-center justify-center overflow-x-auto">
            <div className="flex space-x-4 md:space-x-5 relative z-[200] text-sm font-extrabold text-white">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => item.type === 'dropdown' && setActiveDropdown(item.id)}
                  onMouseLeave={() => item.type === 'dropdown' && setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`transition-colors whitespace-nowrap block py-2 px-4 relative ${pathname?.startsWith(item.href) ? 'active-link' : ''}`}
                  >
                    <span className={pathname?.startsWith(item.href) ? 'text-white' : ''}>{item.label}</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white block"
                      initial={{ scaleX: pathname?.startsWith(item.href) ? 1 : 0 }}
                      animate={{ scaleX: pathname?.startsWith(item.href) ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </Link>

                  {item.type === 'dropdown' && (
                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="font-inter absolute top-full left-0 mt-2 bg-white rounded-sm shadow-2xl border border-gray-200 z-[9999] text-black font-normal"
                          style={{ width: 'max-content', maxWidth: '90vw', minWidth: '600px' }}
                        >
                          <div className="p-6">
                            <div className="flex gap-10">
                              {item.columns?.map((column, idx) => (
                                <div key={idx} className="flex-1 min-w-[200px]">
                                  <h3 className="text-gray-900 mb-4 text-base font-semibold border-b pb-2">{column.title}</h3>
                                  <div className="space-y-3">
                                    {column.groups ? (
                                      column.groups.map((group, grpIdx) => (
                                        <div key={grpIdx}>
                                          <h4 className="text-gray-700 text-sm mb-2 font-medium">{group.title}</h4>
                                          <div className="space-y-1 ml-2">
                                            {group.items.map((subItem, subIdx) => (
                                              <Link key={subIdx} href={subItem.href} className="block text-sm text-black hover:text-blue-600 py-1 transition-colors">
                                                {subItem.label}
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="space-y-1">
                                        {column.items?.map((subItem, subIdx) => (
                                          <Link key={subIdx} href={subItem.href} className="block text-sm text-black hover:text-blue-600 py-1 transition-colors">
                                            {subItem.label}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div >
  );
}

