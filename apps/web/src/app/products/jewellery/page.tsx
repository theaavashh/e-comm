'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Filter, Grid, List, X, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the Product interface
interface Product {
  id: number | string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  inStock: boolean;
  brand: string;
  tags: string[];
  sku: string;
}

export default function JewelleryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<Set<number | string>>(new Set());

  // Hardcoded jewellery products
  useEffect(() => {
    const hardcodedProducts: Product[] = [
      {
        id: 1,
        name: "Diamond Solitaire Ring",
        category: "jewellery",
        subcategory: "ring",
        price: 25000,
        comparePrice: 30000,
        discount: 17,
        rating: 4.8,
        reviewCount: 24,
        image: "/diamond-ring.jpg",
        description: "Elegant solitaire diamond ring with 18k white gold setting",
        inStock: true,
        brand: "Sparkle Gems",
        tags: ["diamond", "ring", "engagement"],
        sku: "DR-001"
      },
      {
        id: 2,
        name: "Diamond Tennis Necklace",
        category: "jewellery",
        subcategory: "necklace",
        price: 45000,
        comparePrice: 50000,
        discount: 10,
        rating: 4.9,
        reviewCount: 18,
        image: "/diamond-necklace.jpg",
        description: "Stunning tennis necklace with certified diamonds",
        inStock: true,
        brand: "Luxury Diamonds",
        tags: ["diamond", "necklace", "fine jewellery"],
        sku: "DN-002"
      },
      {
        id: 3,
        name: "Gold Bangle Set",
        category: "jewellery",
        subcategory: "bangles",
        price: 12000,
        comparePrice: 15000,
        discount: 20,
        rating: 4.5,
        reviewCount: 32,
        image: "/gold-bangles.jpg",
        description: "Traditional gold bangle set with intricate designs",
        inStock: true,
        brand: "Heritage Gold",
        tags: ["gold", "bangles", "traditional"],
        sku: "GB-003"
      },
      {
        id: 4,
        name: "Silver Pendant Necklace",
        category: "jewellery",
        subcategory: "pendant",
        price: 3500,
        comparePrice: 5000,
        discount: 30,
        rating: 4.3,
        reviewCount: 15,
        image: "/silver-pendant.jpg",
        description: "Elegant silver pendant with semi-precious stones",
        inStock: true,
        brand: "Silver Craft",
        tags: ["silver", "pendant", "affordable"],
        sku: "SP-004"
      },
      {
        id: 5,
        name: "Diamond Stud Earrings",
        category: "jewellery",
        subcategory: "earrings",
        price: 18000,
        comparePrice: 20000,
        discount: 10,
        rating: 4.7,
        reviewCount: 32,
        image: "/diamond-earrings.jpg",
        description: "Classic stud earrings with round brilliant cut diamonds",
        inStock: true,
        brand: "Sparkle Gems",
        tags: ["diamond", "earrings", "everyday"],
        sku: "DE-005"
      },
      {
        id: 6,
        name: "Pearl Drop Earrings",
        category: "jewellery",
        subcategory: "earrings",
        price: 8000,
        comparePrice: 10000,
        discount: 20,
        rating: 4.4,
        reviewCount: 21,
        image: "/pearl-earrings.jpg",
        description: "Beautiful freshwater pearl drop earrings",
        inStock: true,
        brand: "Ocean Pearls",
        tags: ["pearl", "earrings", "elegant"],
        sku: "PE-006"
      },
      {
        id: 7,
        name: "Diamond Halo Pendant",
        category: "jewellery",
        subcategory: "pendant",
        price: 32000,
        comparePrice: 35000,
        discount: 9,
        rating: 4.6,
        reviewCount: 15,
        image: "/diamond-pendant.jpg",
        description: "Beautiful halo pendant with center stone surrounded by smaller diamonds",
        inStock: true,
        brand: "Royal Jewels",
        tags: ["diamond", "pendant", "luxury"],
        sku: "DP-007"
      },
      {
        id: 8,
        name: "Gold Chain Bracelet",
        category: "jewellery",
        subcategory: "bracelet",
        price: 15000,
        comparePrice: 18000,
        discount: 17,
        rating: 4.2,
        reviewCount: 19,
        image: "/gold-chain.jpg",
        description: "Delicate gold chain bracelet with lobster clasp",
        inStock: true,
        brand: "Heritage Gold",
        tags: ["gold", "bracelet", "minimalist"],
        sku: "GC-008"
      }
    ];
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setProducts(hardcodedProducts);
      setFilteredProducts(hardcodedProducts);
      
      // Set initial price range based on products
      if (hardcodedProducts.length > 0) {
        const prices = hardcodedProducts.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      }
      
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Get unique subcategories and brands for filters
  const subcategories = useMemo(() => {
    const uniqueSubcategories = Array.from(
      new Set(products.map(p => p.subcategory).filter(Boolean))
    );
    return uniqueSubcategories;
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(products.map(p => p.brand).filter(Boolean))
    );
    return uniqueBrands;
  }, [products]);

  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Filter by subcategories
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => 
        selectedSubcategories.includes(product.subcategory)
      );
    }
    
    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by rating
    if (minRating > 0) {
      result = result.filter(product => 
        product.rating >= minRating
      );
    }
    
    setFilteredProducts(result);
  }, [products, selectedSubcategories, selectedBrands, priceRange, minRating]);

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory) 
        : [...prev, subcategory]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const toggleWishlist = (productId: number | string) => {
    setWishlistItems(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setMinRating(0);
    
    // Reset price range to full range
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  };

  const hasActiveFilters = selectedSubcategories.length > 0 || 
                          selectedBrands.length > 0 || 
                          minRating > 0;

  // Render product card with the new design
  const renderProductCard = (product: Product) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col"
    >
      {/* Image Section */}
      <div className="relative w-full h-56 flex-shrink-0">
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-600/90 backdrop-blur text-white text-xs px-2 py-1 rounded-full shadow">
            {product.discount}% OFF
          </div>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 bg-[#F0F2F5]/90 backdrop-blur text-gray-700 hover:bg-[#F0F2F5] opacity-0 group-hover:opacity-100"
        >
          <Heart className={`w-4 h-4 ${wishlistItems.has(product.id) ? 'fill-current text-red-500' : ''}`} />
        </button>
        <Link href={`/product/${product.id}`}>
          <div className="w-full h-full bg-gray-50 flex items-center justify-center cursor-pointer group overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          </div>
        </Link>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          
          {/* Get Price Quote Button */}
          <button
            onClick={() => console.log('Get price quote for', product.name)}
            className="bg-[#EB6426] hover:bg-[#d0521d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full mx-auto"
          >
            Get Price Quote
          </button>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-center pt-4 mt-auto">
          <button
            onClick={() => console.log('Quick view for', product.name)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jewellery Collection</h1>
        <p className="text-gray-600">
          Discover our exquisite collection of jewellery crafted with precision and elegance.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar - hidden on mobile by default */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Subcategory filter */}
            {subcategories.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Type</h3>
                <div className="space-y-2">
                  {subcategories.map(subcategory => (
                    <div key={subcategory} className="flex items-center">
                      <input
                        id={`subcategory-${subcategory}`}
                        type="checkbox"
                        checked={selectedSubcategories.includes(subcategory)}
                        onChange={() => toggleSubcategory(subcategory)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`subcategory-${subcategory}`}
                        className="ml-3 text-sm text-gray-700 capitalize"
                      >
                        {subcategory}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand filter */}
            {brands.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`brand-${brand}`}
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price range filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NPR {priceRange[0].toLocaleString()}</span>
                  <span className="text-sm text-gray-600">NPR {priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
              <div className="flex items-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      minRating === rating 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <p className="text-sm text-gray-700">
                Showing {filteredProducts.length} products
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-gray-700 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-gray-700 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile filter overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Filters content would go here, but we'll keep it simple for now */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                    : 'space-y-6'
                }>
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={viewMode === 'list' ? 'w-full' : ''}>
                      {renderProductCard(product)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No jewellery products match your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}