'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import TopBanner from './TopBanner';
import ProductCard from './ProductCard';
import AuthModal from './AuthModal';

export default function Homepage() {
  const { data: session, status } = useSession();
  const [selectedCity, setSelectedCity] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredMainCategory, setHoveredMainCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Sample product data
  const sampleProducts = [
    {
      id: 1,
      name: "Traditional Handicraft Wooden Bowl Set",
      category: "gift-souvenir",
      subcategory: "Wooden",
      price: 2500,
      originalPrice: 3200,
      discount: 22,
      rating: 4.8,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&crop=center",
      description: "Beautiful handcrafted wooden bowl set made by skilled Nepali artisans.",
      inStock: true,
      brand: "Nepal Handicrafts",
      tags: ["handmade", "traditional", "wooden"],
      sku: "NH-WB-001"
    },
    {
      id: 2,
      name: "Brass Puja Thali Set",
      category: "puja-samagri",
      subcategory: "Hindu",
      price: 1800,
      originalPrice: 2500,
      discount: 28,
      rating: 4.6,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center",
      description: "Traditional brass puja thali set for religious ceremonies.",
      inStock: true,
      brand: "Sacred Crafts",
      tags: ["brass", "puja", "traditional"],
      sku: "SC-PT-002"
    },
    {
      id: 3,
      name: "Handwoven Pashmina Shawl",
      category: "handicrafts",
      subcategory: "Pashmina",
      price: 8500,
      originalPrice: 12000,
      discount: 29,
      rating: 4.9,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&crop=center",
      description: "Premium handwoven pashmina shawl from the Himalayas.",
      inStock: true,
      brand: "Himalayan Crafts",
      tags: ["pashmina", "handwoven", "premium"],
      sku: "HC-PS-003"
    },
    {
      id: 4,
      name: "Traditional Singing Bowl",
      category: "gift-souvenir",
      subcategory: "Metal",
      price: 3200,
      originalPrice: 4500,
      discount: 29,
      rating: 4.7,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1506905925346-14b1e0dba749?w=400&h=400&fit=crop&crop=center",
      description: "Authentic Tibetan singing bowl for meditation and relaxation.",
      inStock: true,
      brand: "Spiritual Sounds",
      tags: ["singing bowl", "meditation", "tibetan"],
      sku: "SS-SB-004"
    }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setHoveredMainCategory(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Carousel data
  const carouselSlides = [
    {
      id: 1,
      title: "Traditional Crafts",
      subtitle: "Handcrafted with love",
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      bgColor: "from-blue-100 to-blue-200",
      iconBg: "bg-blue-300",
      iconColor: "text-blue-700"
    },
    {
      id: 2,
      title: "Puja Samagri",
      subtitle: "Sacred & Spiritual",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
      bgColor: "from-orange-100 to-orange-200",
      iconBg: "bg-orange-300",
      iconColor: "text-orange-700"
    },
    {
      id: 3,
      title: "Musical Instruments",
      subtitle: "Traditional Sounds",
      icon: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
      bgColor: "from-purple-100 to-purple-200",
      iconBg: "bg-purple-300",
      iconColor: "text-purple-700"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const categories = {
    'FOODS': {
      'ACHAR': ['Mixed Pickle', 'Mango Pickle', 'Lemon Pickle'],
      'TEA': ['Black Tea', 'Green Tea', 'Herbal Tea'],
      'TYPICAL NEPALI': ['Dal Bhat', 'Momos', 'Newari Cuisine'],
      'SPICES': ['Turmeric', 'Cumin', 'Coriander', 'Garam Masala']
    },
    'GIFT & SOUVENIR': {
      'METAL': ['Statue', 'Singing Bowl', 'Khukuri'],
      'WOODEN': ['Statue', 'Windows'],
      'STONE': ['Statue', 'Silauta Set'],
      'OTHERS': ['Rudrakshya Mala', 'Bodhi Chitta Mala']
    },
    'PUJA SAMAGRI': {
      'HINDU': ['Wooden Mandir Set', 'Puja Thali', 'Statue (Kalot)', 'Ghanti', 'Khadkulo', 'Rudrakshya', 'Sankha', 'Saligram'],
      'BUDDHIST': ['Bumba', 'Diyo', 'Statue Buddha', 'Hand Prayer Wheel'],
      'BOOKS': ['Sratha Book', 'Satya Narayan', 'Swosthani']
    },
    'NEPALI MUSICAL INSTRUMENT': {
      'INSTRUMENTS': ['As per list']
    },
    'HANDICRAFTS': {
      'CARPETS': [],
      'PASHMINA': [],
      'WOOVEN': []
    },
    'HERBS/NATURALS': {
      'YARSHAGUMBA': [],
      'SHILAJIT': []
    },
    'JEWELLERY': {
      'GOLD': [],
      'DIAMOND': []
    }
  };

  // Category scroll functions
  const scrollCategoriesNext = () => {
    const container = categoryScrollRef.current;
    if (container) {
      const cardWidth = 280; // min-w-[280px] = 280px
      const gap = 12; // space-x-3 = 12px
      const scrollAmount = cardWidth + gap; // Scroll one card at a time
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollCategoriesPrev = () => {
    const container = categoryScrollRef.current;
    if (container) {
      const cardWidth = 280; // min-w-[280px] = 280px
      const gap = 12; // space-x-3 = 12px
      const scrollAmount = cardWidth + gap; // Scroll one card at a time
      
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Promotional Banner - Dynamic */}
      <TopBanner />

      {/* Search Bar Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Search Icon */}
            <div className="flex items-center">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-6 h-6" />
              </button>
            </div>
            
            {/* Center - Logo */}
            <div className="flex-1 flex justify-center text-[#1D1D1D] text-4xl">
              <h3>GharSamma</h3>
            </div>
            
            {/* Right Side - Cart and Account Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-b border-gray-200 relative" ref={categoryRef}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-center space-x-8 overflow-x-auto relative">
            {Object.keys(categories).map((category) => (
              <div 
                key={category}
                className="relative"
                onMouseEnter={() => setHoveredMainCategory(category)}
                onMouseLeave={() => setHoveredMainCategory(null)}
              >
                <Link 
                  href={category === 'FOODS' ? '/foods' : '#'} 
                  className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors whitespace-nowrap block py-3 px-2"
                >
                  {category}
                </Link>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Dropdown Container - Row-based with Real Images */}
        {hoveredMainCategory && (
          <div className="border-t border-gray-200 shadow-lg bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex gap-12">
                {/* Left Column - Row-based Categories with Images */}
                <div className="w-1/2">
                  <div className="space-y-8 flex">
                    {/* Albums by Size */}
                    <div>
                      <h3 className="font-bold text-black text-sm uppercase tracking-wider mb-4">
                        ALBUMS BY SIZE
                      </h3>
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop&crop=center" 
                            alt="Large Album" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">LARGE ALBUMS</Link>
                        </div>
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&crop=center" 
                            alt="Small Album" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">SMALL ALBUMS</Link>
                        </div>
                      </div>
                    </div>

                    {/* Albums by Type */}
                    <div>
                      <h3 className="font-bold text-black text-sm uppercase tracking-wider mb-4">
                        ALBUMS BY TYPE
                      </h3>
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop&crop=center" 
                            alt="Wedding Album" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">WEDDING</Link>
                        </div>
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&h=100&fit=crop&crop=center" 
                            alt="Love Album" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">LOVE</Link>
                        </div>
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1506905925346-14b1e0dba749?w=100&h=100&fit=crop&crop=center" 
                            alt="Baby Album" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">BABY</Link>
                        </div>
                      </div>
                    </div>

                    {/* Album Accessories */}
                    <div>
                      <h3 className="font-bold text-black text-sm uppercase tracking-wider mb-4">
                        ALBUM ACCESSORIES
                      </h3>
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop&crop=center" 
                            alt="Photo Prints" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">PRINTS</Link>
                        </div>
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center" 
                            alt="Stickers" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">STICKERS</Link>
                        </div>
                        <div className="text-center">
                          <img 
                            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop&crop=center" 
                            alt="Photo Paper" 
                            className="w-16 h-16 object-cover rounded-lg mb-2"
                          />
                          <Link href="#" className="text-black text-xs hover:underline">PAPER</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column - Product Display with Real Images */}
                <div className="w-1/4">
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Books Stack */}
                      <div className="space-y-4">
                        <img 
                          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=80&fit=crop&crop=center" 
                          alt="Blue Book" 
                          className="h-8 w-16 object-cover rounded-sm"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=80&fit=crop&crop=center" 
                          alt="Blue Book 2" 
                          className="h-8 w-16 object-cover rounded-sm"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&h=80&fit=crop&crop=center" 
                          alt="Amber Book" 
                          className="h-8 w-20 object-cover rounded-sm"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=120&h=60&fit=crop&crop=center" 
                          alt="White Book" 
                          className="h-6 w-16 object-cover rounded-sm border"
                        />
                      </div>
                      
                      {/* Photo Album */}
                      <div className="space-y-4">
                        <img 
                          src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=80&h=96&fit=crop&crop=center" 
                          alt="Photo Album" 
                          className="h-24 w-20 object-cover rounded-sm"
                        />
                        <div className="bg-gray-200 h-4 w-16 rounded-sm"></div>
                        <div className="bg-gray-200 h-4 w-12 rounded-sm"></div>
                      </div>
                      
                      {/* Family & Friends Box */}
                      <div className="col-span-2">
                        <div className="bg-amber-100 h-12 w-32 rounded-sm flex items-center justify-center">
                          <span className="text-amber-800 text-xs font-medium">FAMILY & FRIENDS</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Featured Items with Real Images */}
                <div className="w-1/4">
                  <div className="space-y-6">
                    {/* Love Book */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=80&h=64&fit=crop&crop=center" 
                        alt="Love Book" 
                        className="h-16 w-20 object-cover rounded-sm mb-2"
                      />
                      <p className="text-xs text-gray-600">IS IN THE AIR</p>
                      <p className="text-xs text-gray-500">PRINTWORKS</p>
                    </div>

                    {/* Flowers */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <img 
                          src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=32&h=32&fit=crop&crop=center" 
                          alt="Pink Flower" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=32&h=32&fit=crop&crop=center" 
                          alt="Pink Flower" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <img 
                          src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=24&h=24&fit=crop&crop=center" 
                          alt="Small Pink Flower" 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=24&h=24&fit=crop&crop=center" 
                          alt="Small Pink Flower" 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section - Urban Company Style */}
      <div className="bg-white">
        <div className="flex min-h-[600px]">
          {/* Left Side - Image Carousel */}
          <div className="w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent z-10"></div>
            
            {/* Carousel Container */}
            <div className="relative h-full overflow-hidden">
              {/* Carousel Images */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-80">
                  {carouselSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentSlide
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95'
                      }`}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${slide.bgColor} rounded-full flex items-center justify-center shadow-2xl`}>
                        <div className="text-center">
                          <div className={`w-32 h-32 ${slide.iconBg} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                            <svg className={`w-16 h-16 ${slide.iconColor}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d={slide.icon}/>
                            </svg>
                          </div>
                          <h3 className="text-white text-xl font-bold">{slide.title}</h3>
                          <p className="text-white text-sm opacity-90">{slide.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                      </div>
              </div>
              
              {/* Carousel Dots */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white shadow-lg scale-110'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                    ))}
                  </div>
                </div>
              </div>

          {/* Right Side - Content */}
          <div className="w-3/5 bg-black flex items-center justify-center">
            <div className="max-w-lg px-12">
              {/* Brand Name */}
              <h1 className="text-white text-4xl font-bold mb-6 tracking-wide">
                GHARSAMMA
              </h1>
              
              {/* Main Headline */}
              <h2 className="text-white text-5xl font-bold mb-6 leading-tight">
                Quality home products, on demand
              </h2>
              
              {/* Description */}
              <p className="text-white text-xl mb-12 leading-relaxed">
                Experienced, hand-picked Artisans to serve you at your doorstep
              </p>
              
              {/* Service Selection Card */}
              <div className="bg-white rounded-lg p-6 shadow-2xl">
                <label className="block text-gray-700 text-sm font-medium mb-3">
                  Where do you need a service?
                </label>
                <div className="relative">
                  <select className="w-full p-4 border border-gray-300 rounded-lg text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select your city</option>
                    <option>Kathmandu</option>
                    <option>Pokhara</option>
                    <option>Lalitpur</option>
                    <option>Bhaktapur</option>
                    <option>Chitwan</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Section - Single Row Scrollable */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase ml-20">Explore our categories</h2>
            <div className="flex space-x-2">
              <button 
                onClick={scrollCategoriesPrev}
                className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button 
                onClick={scrollCategoriesNext}
                className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={categoryScrollRef}
              className="flex space-x-3 overflow-x-auto pb-4" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                      src="/foods.png"
                      alt="Foods" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Foods</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Fresh & Organic</p>
                  </div>
                </div>
              </div>
              {/* Gift & Souvenir Card */}
              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop&crop=center" 
                    alt="Gift & Souvenir" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Gift & Souvenir</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Memorable Gifts</p>
                  </div>
                </div>
              </div>

              {/* Puja Samagri Card */}
              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop&crop=center" 
                    alt="Puja Samagri" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Puja Samagri</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Sacred Items</p>
                  </div>
                </div>
              </div>

              {/* Handicrafts Card */}
              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=150&fit=crop&crop=center" 
                    alt="Handicrafts" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Handicrafts</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Handmade Art</p>
                  </div>
                </div>
              </div>

              {/* Musical Instruments Card */}
              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-14b1e0dba749?w=150&h=150&fit=crop&crop=center" 
                    alt="Musical Instruments" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Musical Instruments</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Traditional Music</p>
                  </div>
                </div>
              </div>

              {/* Herbs & Naturals Card */}
              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=150&h=150&fit=crop&crop=center" 
                    alt="Herbs & Naturals" 
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Herbs & Naturals</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Pure & Natural</p>
                  </div>
                </div>
              </div>

              {/* Jewellery Card */}
              <div className="hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[280px] flex-shrink-0 h-80 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=center" 
                    alt="Jewellery" 
                      className="w-32 h-32 object-contain"
                  />
                </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-gray-900 text-xl text-center">Jewellery</h3>
                    <p className="text-gray-500 text-sm text-center mt-1">Elegant & Precious</p>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Ingredients Banner */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <img 
              src="/Simple_Ingredients_D_12fbce96-a3b5-4ba9-b044-de6c3c5a561f.webp"
              alt="Simple Ingredients Banner"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>

      {/* For You Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For You</h2>
            <p className="text-gray-600 text-lg">Personalized recommendations just for you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop&crop=center" 
                  alt="Handcrafted Wooden Bowl"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Handcrafted Wooden Bowl</h3>
              <p className="text-gray-600 text-sm mb-3">Traditional Nepali craftsmanship</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 2,500</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center" 
                  alt="Organic Herbal Tea"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Organic Herbal Tea</h3>
              <p className="text-gray-600 text-sm mb-3">Pure Himalayan herbs</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 850</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                  </button>
                </div>
              </div>

            {/* Product 3 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center" 
                  alt="Silver Pendant"
                  className="w-full h-48 object-cover rounded-lg"
                />
                  </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Silver Pendant</h3>
              <p className="text-gray-600 text-sm mb-3">Handcrafted silver jewelry</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 4,200</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                  </button>
                </div>
              </div>

            {/* Product 4 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center" 
                  alt="Natural Honey"
                  className="w-full h-48 object-cover rounded-lg"
                />
            </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Natural Honey</h3>
              <p className="text-gray-600 text-sm mb-3">Pure mountain honey</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 1,200</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
          </div>
        </div>
      </div>

          <div className="text-center mt-12">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
              View All Recommendations
            </button>
            </div>
        </div>
          </div>
          
      {/* Foods Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Foods</h2>
            <p className="text-gray-600 text-lg">Fresh, organic, and delicious food items</p>
                    </div>
          
          <div className="flex gap-8">
            {/* Main Products Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Food Product 1 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
              <div className="mb-4">
                <img 
                  src="/foods.png" 
                  alt="Traditional Pickle"
                  className="w-full h-48 object-cover rounded-lg"
                />
                  </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Traditional Pickle</h3>
              <p className="text-gray-600 text-sm mb-3">Homemade with fresh ingredients</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 450</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                    </button>
                </div>
              </div>

            {/* Food Product 2 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center" 
                  alt="Organic Rice"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Organic Rice</h3>
              <p className="text-gray-600 text-sm mb-3">Premium quality basmati rice</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 1,800</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                  </button>
                    </div>
                  </div>

            {/* Food Product 3 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop&crop=center" 
                  alt="Dried Fruits Mix"
                  className="w-full h-48 object-cover rounded-lg"
                />
                    </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Dried Fruits Mix</h3>
              <p className="text-gray-600 text-sm mb-3">Healthy snack with mixed nuts</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 1,200</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                    </button>
                </div>
              </div>

            {/* Food Product 4 */}
            <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop&crop=center" 
                  alt="Spice Mix"
                  className="w-full h-48 object-cover rounded-lg"
                />
                  </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Spice Mix</h3>
              <p className="text-gray-600 text-sm mb-3">Traditional Nepali spice blend</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">NPR 650</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                  </button>
                    </div>
                  </div>
                    </div>

            {/* Right Sidebar - Food Categories */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Food Categories</h3>
                
                <div className="space-y-4">
                  {/* Achar Category */}
                  <div className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="/foods.png" 
                        alt="Achar" 
                        className="w-8 h-8 object-contain"
                      />
                  </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Achar</h4>
                      <p className="text-sm text-gray-600">Traditional Pickles</p>
                </div>
              </div>

                  {/* Tea Category */}
                  <div className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop&crop=center" 
                        alt="Tea" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Tea</h4>
                      <p className="text-sm text-gray-600">Herbal & Organic</p>
                  </div>
                    </div>

                  {/* Typical Nepali Category */}
                  <div className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center" 
                        alt="Typical Nepali" 
                        className="w-8 h-8 object-contain"
                      />
                  </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Typical Nepali</h4>
                      <p className="text-sm text-gray-600">Traditional Foods</p>
                </div>
              </div>

                  {/* Spices Category */}
                  <div className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop&crop=center" 
                        alt="Spices" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Spices</h4>
                      <p className="text-sm text-gray-600">Aromatic Blends</p>
                  </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Browse All Categories
                    </button>
                </div>
                  </div>
                </div>
              </div>

          <div className="text-center mt-12">
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
              View All Food Items
                  </button>
                    </div>
                  </div>
                    </div>

      {/* Gift & Souvenir Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Gift & Souvenir</h2>
            <p className="text-gray-600 text-lg">Perfect gifts and memorable souvenirs</p>
          </div>
          
          <div className="flex gap-8">
            {/* Main Products Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Gift Product 1 */}
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop&crop=center" 
                    alt="Handcrafted Wooden Box"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Handcrafted Wooden Box</h3>
                <p className="text-gray-600 text-sm mb-3">Traditional Nepali craftsmanship</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">NPR 3,200</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add to Cart
                    </button>
                  </div>
                </div>

              {/* Gift Product 2 */}
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center" 
                    alt="Traditional Thangka"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Traditional Thangka</h3>
                <p className="text-gray-600 text-sm mb-3">Sacred Buddhist art</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">NPR 8,500</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
              </div>
            </div>
            
              {/* Gift Product 3 */}
              <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center" 
                    alt="Silver Jewelry Set"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Silver Jewelry Set</h3>
                <p className="text-gray-600 text-sm mb-3">Elegant traditional design</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">NPR 12,000</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add to Cart
            </button>
          </div>
        </div>
      </div>

            {/* Right Sidebar - Gift Categories */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 sticky top-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Gift Categories</h3>
                
                <div className="space-y-4">
                  {/* Handicrafts Category */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop&crop=center" 
                        alt="Handicrafts" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Handicrafts</h4>
                      <p className="text-sm text-gray-600">Handmade Art</p>
                    </div>
          </div>
          
                  {/* Jewelry Category */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center" 
                        alt="Jewelry" 
                        className="w-8 h-8 object-contain"
                      />
                  </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Jewelry</h4>
                      <p className="text-sm text-gray-600">Elegant & Precious</p>
                </div>
                  </div>

                  {/* Souvenirs Category */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-14b1e0dba749?w=100&h=100&fit=crop&crop=center" 
                        alt="Souvenirs" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Souvenirs</h4>
                      <p className="text-sm text-gray-600">Memorable Keepsakes</p>
                  </div>
                </div>

                  {/* Traditional Items Category */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop&crop=center" 
                        alt="Traditional Items" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Traditional Items</h4>
                      <p className="text-sm text-gray-600">Cultural Heritage</p>
                    </div>
              </div>
            </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Browse All Gifts
                </button>
                  </div>
                </div>
                  </div>
                    </div>

          <div className="text-center mt-12">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
              View All Gift Items
                  </button>
                </div>
              </div>
            </div>

      {/* Best Deals Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Best Deals</h2>
            <p className="text-gray-500 text-lg mt-2">Discount</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Green Banner - Cashback Offer */}
            <div className="lg:col-span-2 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-green-800 text-sm font-medium mb-2">-Flat Sale 50%</div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">Cashback</h3>
                <p className="text-gray-700 text-lg mb-6">Offer starts from NPR 3,500</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Shop Now
                </button>
                  </div>
              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-20 transform translate-x-8 translate-y-8"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 bg-green-400 rounded-full opacity-30"></div>
                </div>

            {/* Right Column - Two Smaller Banners */}
            <div className="space-y-6">
              {/* Pink Banner - Puja Samagri */}
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Puja Samagri</h3>
                  <p className="text-gray-700 text-sm mb-4">Offer starts from NPR 3,500</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Shop Now
                  </button>
                  </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-pink-300 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-pink-400 rounded-full opacity-40"></div>
                    </div>

              {/* Purple Banner - Handicrafts */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Handicrafts</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-gray-700 text-sm">Up To</span>
                    <span className="text-3xl font-bold text-gray-900 ml-2">25%</span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Shop Now
                  </button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-300 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-purple-400 rounded-full opacity-40"></div>
              </div>
            </div>
                  </div>
                </div>
                  </div>

      {/* Flash Deals Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Flash Deals</h2>
              <p className="text-gray-600 text-lg mt-1">Up to 65% off</p>
                    </div>
            <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
                  </div>
          
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {sampleProducts.map((product) => (
                <div key={product.id} className="min-w-[280px] flex-shrink-0">
                  <ProductCard
                    product={product}
                    viewMode="grid"
                    onAddToCart={(product) => console.log('Add to cart:', product)}
                    onToggleWishlist={(product) => console.log('Toggle wishlist:', product)}
                    onQuickView={(product) => console.log('Quick view:', product)}
                  />
                    </div>
              ))}
            </div>
            
            {/* Scroll Arrow */}
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

      {/* Recommended for You Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
            <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                onAddToCart={(product) => console.log('Add to cart:', product)}
                onToggleWishlist={(product) => console.log('Toggle wishlist:', product)}
                onQuickView={(product) => console.log('Quick view:', product)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* For You Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">For You</h2>
            <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Product 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <div className="w-40 h-40 bg-orange-300 rounded-full flex items-center justify-center">
                    <span className="text-orange-700 font-bold text-lg">Gift</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Best Seller
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Handcrafted Gift Collection</h3>
                <p className="text-gray-600 text-sm mb-4">Beautiful traditional handicrafts perfect for gifting</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold text-xl">NPR 3,500</span>
                    <span className="text-gray-400 line-through text-sm">NPR 5,000</span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Product 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <div className="w-40 h-40 bg-green-300 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-bold text-lg">Herb</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Natural
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Herbal Collection</h3>
                <p className="text-gray-600 text-sm mb-4">100% natural herbs and traditional remedies</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold text-xl">NPR 2,800</span>
                    <span className="text-gray-400 line-through text-sm">NPR 4,200</span>
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Product 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <div className="w-40 h-40 bg-purple-300 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-lg">Music</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                  Traditional
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nepali Musical Instruments</h3>
                <p className="text-gray-600 text-sm mb-4">Authentic traditional instruments for music lovers</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold text-xl">NPR 6,500</span>
                    <span className="text-gray-400 line-through text-sm">NPR 9,000</span>
                  </div>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banners Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Left Banner - Gift & Souvenir */}
            <div className="lg:col-span-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-amber-800 text-sm font-medium mb-2">Traditional & Modern</div>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Gift & Souvenir Collection</h3>
                <p className="text-gray-700 text-lg mb-6">Handcrafted items in every style & design</p>
                <button className="bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors">
                  Shop Gift Collection
                </button>
              </div>
              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-300 rounded-full opacity-20 transform translate-x-10 translate-y-10"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-amber-400 rounded-full opacity-30"></div>
            </div>

            {/* Right Column - Two Banners */}
            <div className="space-y-6">
              {/* Top Right Banner - Puja Samagri */}
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-orange-800 text-sm font-medium mb-2">Spiritual & Sacred</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Puja Samagri</h3>
                  <p className="text-gray-700 text-sm mb-4">Essential items for worship</p>
                  <Link href="#" className="text-orange-800 hover:text-orange-900 font-medium text-sm">
                    Shop now →
                  </Link>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-orange-300 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
              </div>

              {/* Bottom Right Banner - Handicrafts */}
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-green-800 text-sm font-medium mb-2">Artisan Made</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Handicrafts</h3>
                  <p className="text-gray-700 text-sm mb-4">Traditional crafts & modern designs</p>
                  <Link href="#" className="text-green-800 hover:text-green-900 font-medium text-sm">
                    Shop now →
                  </Link>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-300 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Three Smaller Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Musical Instruments Banner */}
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-purple-800 text-sm font-medium mb-2">Traditional Sounds</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Musical Instruments</h3>
                <p className="text-gray-700 text-sm mb-4">From NPR 2,500</p>
                <Link href="#" className="text-purple-800 hover:text-purple-900 font-medium text-sm">
                  Shop now →
                </Link>
              </div>
              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-300 rounded-full opacity-20 transform translate-x-3 translate-y-3"></div>
            </div>

            {/* Herbs/Naturals Banner */}
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-teal-800 text-sm font-medium mb-2">Natural & Pure</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Herbs & Naturals</h3>
                <p className="text-gray-700 text-sm mb-4">From NPR 1,800</p>
                <Link href="#" className="text-teal-800 hover:text-teal-900 font-medium text-sm">
                  Shop now →
                </Link>
              </div>
              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-teal-300 rounded-full opacity-20 transform translate-x-3 translate-y-3"></div>
            </div>

            {/* Jewellery Banner */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-pink-800 text-sm font-medium mb-2">Elegant & Traditional</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Jewellery</h3>
                <p className="text-gray-700 text-sm mb-4">From NPR 3,500</p>
                <Link href="#" className="text-pink-800 hover:text-pink-900 font-medium text-sm">
                  Shop now →
                </Link>
              </div>
              {/* Decorative Elements */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-pink-300 rounded-full opacity-20 transform translate-x-3 translate-y-3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale & Deals Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Flash Sale & Promotional Images */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Flash Sale Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-green-600 text-sm font-medium mb-2">Limited Time</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Flash Sale!</h3>
                <p className="text-gray-700 text-lg mb-6">Get 25% off - Limited Time Offer!</p>
                
                {/* Countdown Timer */}
                <div className="mb-6">
                  <div className="flex space-x-4 justify-center">
                    <div className="text-center">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">04</div>
                        <div className="text-xs text-gray-500">Days</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">14</div>
                        <div className="text-xs text-gray-500">Hours</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">48</div>
                        <div className="text-xs text-gray-500">Minutes</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">18</div>
                        <div className="text-xs text-gray-500">Seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  Shop Now
                </button>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
            </div>

            {/* Promotional Images */}
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <div className="w-24 h-24 bg-amber-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-12 h-12 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Home Decor</h4>
                  <p className="text-gray-700">Transform your space with our collection</p>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-amber-300 rounded-full opacity-20 transform translate-x-4 translate-y-4"></div>
              </div>
              
              <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Quality Products</h4>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-300 rounded-full opacity-20 transform translate-x-3 translate-y-3"></div>
              </div>
            </div>
          </div>

          {/* Deals of the Day Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-green-600 text-sm font-medium mb-1">Today Deals</div>
                <h2 className="text-3xl font-bold text-gray-900">Deals of the Day</h2>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Discover amazing discounts on our handpicked selection of premium products. Limited time offers you won't want to miss!
              </p>
            </div>

            {/* Product Cards */}
            <div className="relative">
              <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                {/* Product Card 1 - Traditional Handicraft Bowl */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[320px] flex-shrink-0">
                  <div className="relative p-4">
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      20%
                    </div>
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <div className="w-32 h-32 bg-amber-100 rounded-lg flex items-center justify-center">
                        <span className="text-amber-600 font-bold text-sm">Handicraft</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 text-lg">Traditional Handicraft Bowl</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold text-xl">NPR 1,050</span>
                        <span className="text-gray-400 line-through text-sm">NPR 1,500</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          ★★★★★
                        </div>
                        <span className="text-gray-500 text-sm">5.0</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        Beautiful handcrafted wooden bowl made by skilled artisans. Perfect for serving traditional Nepali dishes.
                      </p>
                      <Link href="#" className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Card 2 - Brass Puja Set */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[320px] flex-shrink-0">
                  <div className="relative p-4">
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      20%
                    </div>
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <div className="w-32 h-32 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">Puja Set</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 text-lg">Brass Puja Set Steel</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold text-xl">NPR 800</span>
                        <span className="text-gray-400 line-through text-sm">NPR 1,000</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          ★★★★☆
                        </div>
                        <span className="text-gray-500 text-sm">4.9</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        Complete brass puja set with traditional design. Essential for religious ceremonies and daily worship.
                      </p>
                      <Link href="#" className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Card 3 - Musical Instrument */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[320px] flex-shrink-0">
                  <div className="relative p-4">
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      15%
                    </div>
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <div className="w-32 h-32 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">Instrument</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 text-lg">Traditional Sarangi</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold text-xl">NPR 4,250</span>
                        <span className="text-gray-400 line-through text-sm">NPR 5,000</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          ★★★★★
                        </div>
                        <span className="text-gray-500 text-sm">4.8</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        Authentic Nepali sarangi handcrafted by master artisans. Perfect for traditional music and cultural performances.
                      </p>
                      <Link href="#" className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Card 4 - Herbal Collection */}
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[320px] flex-shrink-0">
                  <div className="relative p-4">
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      25%
                    </div>
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <div className="w-32 h-32 bg-teal-100 rounded-lg flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-sm">Herbs</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 text-lg">Premium Herbal Collection</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold text-xl">NPR 1,350</span>
                        <span className="text-gray-400 line-through text-sm">NPR 1,800</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          ★★★★★
                        </div>
                        <span className="text-gray-500 text-sm">4.9</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        Natural herbs and traditional remedies. 100% organic and sourced from the Himalayas for maximum potency.
                      </p>
                      <Link href="#" className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Arrow */}
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
