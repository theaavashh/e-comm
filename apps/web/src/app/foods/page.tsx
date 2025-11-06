'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Users, ShoppingCart, Heart, X } from 'lucide-react';
import { VegAcharContent, NonVegAcharContent, AllAcharContent } from '@/components/AcharComponents';
import Navbar from '@/components/Navbar';
import CategoryShowcaseFirstRow from '@/components/CategoryShowcaseFirstRow';
import CategoryShowcaseSecondRow from '@/components/CategoryShowcaseSecondRow';

const foodCategories = [
  { id: 1, name: 'Achar', icon: '🥒', count: '12 items' },
  { id: 2, name: 'Tea', icon: '🍵', count: '8 items' },
  { id: 3, name: 'Typical Nepali', icon: '🍛', count: '15 items' },
  { id: 4, name: 'Spices', icon: '🌶️', count: '20 items' },
  { id: 5, name: 'Snacks', icon: '🍿', count: '10 items' },
  { id: 6, name: 'Beverages', icon: '🥤', count: '6 items' },
];


interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku: string;
  quantity: number;
  image: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  variants: any[];
  brand?: {
    id: string;
    name: string;
  };
  attributes: any[];
  tags?: string[];
}

export default function FoodsPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAcharModal, setShowAcharModal] = useState(false);
  const [showVegAcharModal, setShowVegAcharModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedAcharType, setSelectedAcharType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedLocation, setSelectedLocation] = useState('Kathmandu, Nepal');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showPlacemarkInput, setShowPlacemarkInput] = useState(false);
  const [placemark, setPlacemark] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Fetch recommended food products
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products?category=foods&limit=8`;
        console.log('Fetching from API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch recommended products: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.success && data.data.products) {
          console.log('Products found:', data.data.products.length);
          setRecommendedProducts(data.data.products);
        } else {
          console.log('No products found in response');
          setRecommendedProducts([]);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        setRecommendedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  // Fetch products for selected category
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory === 0) {
        setProducts([]);
        return;
      }

      try {
        setProductsLoading(true);
        const categoryName = foodCategories.find(c => c.id === selectedCategory)?.name.toLowerCase();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products?category=foods&subcategory=${categoryName}`;
        
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.data.products) {
            setProducts(data.data.products);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Handle category click
  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    if (categoryName === 'Achar') {
      setShowAcharModal(true);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // Handle Achar subcategory selection
  const handleAcharSubcategory = (subcategory: string) => {
    setShowAcharModal(false);
    if (subcategory === 'Veg Achar') {
      setSelectedCategory(1); // Keep Achar selected
      setSelectedAcharType('veg');
    } else if (subcategory === 'Non-Veg Achar') {
      setSelectedCategory(1); // Keep Achar selected
      setSelectedAcharType('non-veg');
    } else {
      setSelectedCategory(1); // Keep Achar selected
      setSelectedAcharType('all');
      // You can add additional logic here to filter products by subcategory
      console.log('Selected Achar subcategory:', subcategory);
    }
  };

  // Handle Veg Achar subcategory selection
  const handleVegAcharSubcategory = (subcategory: string) => {
    setSelectedCategory(1); // Keep Achar selected
    setShowVegAcharModal(false);
    // You can add additional logic here to filter products by specific veg achar type
    console.log('Selected Veg Achar subcategory:', subcategory);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <header className="bg-[#F0F2F5] border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">Gharsamma Foods</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowLocationModal(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{selectedLocation}</span>
            </button>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'Food'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* First Row - Category Showcase */}
      <CategoryShowcaseFirstRow />

      {/* Foods Component - Sidebar and Products */}
      <div className="flex">
        {/* Left Sidebar - Categories */}
        <div className="w-[40vw] bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What are you looking for?</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {foodCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-[#F0F2F5] border border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className={`text-sm font-medium text-gray-900 ${
                  selectedCategory === category.id ? 'text-purple-700' : ''
                }`}>{category.name}</div>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">4.8 Service Rating*</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">12M+ Customers Globally*</span>
            </div>
          </div>
        </div>

        {/* Right Section - Product Display */}
        <div className="flex-1 p-6 bg-[#F0F2F5]">
          {selectedCategory === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a category to view products</h2>
              <p className="text-gray-600">Choose from the categories on the left to explore our food products</p>
            </div>
          ) : (
            <div className="py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {foodCategories.find(c => c.id === selectedCategory)?.name || 'Products'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {products.length > 0 ? `${products.length} items` : foodCategories.find(c => c.id === selectedCategory)?.count || '0 items'} available
                  </p>
                </div>
              </div>

              {productsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No products found in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#F0F2F5] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
                    >
                      <div className="relative h-64 bg-[#F0F2F5] overflow-hidden">
                        <Image
                          src={product.image || product.images?.[0] || '/api/placeholder/300/200'}
                          alt={product.name}
                          fill={true}
                          className="object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/api/placeholder/300/200';
                          }}
                        />
                      </div>
                      <div className="p-4 bg-[#F0F2F5]">
                        {/* Product Name */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {product.name}
                        </h3>
                        
                        {/* Gray Line */}
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">
                              NPR {product.price.toLocaleString()}
                            </span>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                NPR {product.comparePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {product.comparePrice && product.comparePrice > product.price && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          disabled={product.quantity === 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          {product.quantity === 0 ? (
                            'Out of Stock'
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
          </div>

      {/* Second Row - Additional Categories */}
      <CategoryShowcaseSecondRow />

      {/* Recommendation for you section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommendation for you</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked food products just for you
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading recommendations...</p>
            </div>
          ) : recommendedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No food products available at the moment.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#F0F2F5] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                <div className="relative h-64 bg-[#F0F2F5] overflow-hidden">
                  <Image
                      src={product.image || product.images?.[0] || '/api/placeholder/300/200'}
                      alt={product.name}
                      fill={true}
                      className="object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/300/200';
                      }}
                    />
                  </div>
                  <div className="p-4 bg-[#F0F2F5]">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    
                    {/* Gray Line */}
                    <div className="w-full h-px bg-gray-200 mb-3"></div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          NPR {product.price.toLocaleString()}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            NPR {product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      disabled={product.quantity === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {product.quantity === 0 ? (
                        'Out of Stock'
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Achar Components Section */}
      {selectedCategory === 1 && selectedAcharType === 'veg' && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <VegAcharContent />
          </div>
        </div>
      )}

      {selectedCategory === 1 && selectedAcharType === 'non-veg' && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NonVegAcharContent />
          </div>
        </div>
      )}

      {selectedCategory === 1 && selectedAcharType === 'all' && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AllAcharContent setSelectedAcharType={setSelectedAcharType} />
          </div>
        </div>
      )}

      {/* Achar Subcategory Modal */}
      <AnimatePresence>
        {showAcharModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-[#F0F2F5] rounded-xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4 
              }}
            >
              <motion.h3 
                className="text-2xl font-bold text-gray-900 mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Choose Achar Type
              </motion.h3>
              
              <div className="space-y-4">
                <motion.button
                  onClick={() => handleAcharSubcategory('Veg Achar')}
                  className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl mb-2"
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      🥬
                    </motion.div>
                    <div className="text-lg font-semibold text-green-800">Veg Achar</div>
                    <div className="text-sm text-green-600">Vegetarian pickle varieties</div>
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => handleAcharSubcategory('Non-veg Achar')}
                  className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl mb-2"
                      whileHover={{ rotate: -10 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      🥩
                    </motion.div>
                    <div className="text-lg font-semibold text-red-800">Non-veg Achar</div>
                    <div className="text-sm text-red-600">Non-vegetarian pickle varieties</div>
                </div>
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setShowAcharModal(false)}
                className="w-full mt-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Veg Achar Subcategory Modal */}
      <AnimatePresence>
        {showVegAcharModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-[#F0F2F5] rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4 
              }}
            >
              <motion.h3 
                className="text-2xl font-bold text-gray-900 mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Choose Veg Achar Type
              </motion.h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Mix', icon: '🥗', description: 'Mixed vegetable pickle' },
                  { name: 'Radish', icon: '🥕', description: 'Radish pickle' },
                  { name: 'Mushroom', icon: '🍄', description: 'Mushroom pickle' },
                  { name: 'Gundruk', icon: '🥬', description: 'Fermented leafy greens' },
                  { name: 'Timur Chop (Powder)', icon: '🌶️', description: 'Timur powder pickle' },
                  { name: 'Timur Chop (Oily)', icon: '🫒', description: 'Oily timur pickle' }
                ].map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleVegAcharSubcategory(item.name)}
                    className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.3 + (index * 0.1), 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 2,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="text-2xl mb-2"
                        whileHover={{ 
                          rotate: [0, -10, 10, 0],
                          scale: 1.2
                        }}
                        transition={{ 
                          duration: 0.5,
                          type: "spring",
                          stiffness: 300
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      <div className="text-lg font-semibold text-green-800 mb-1">{item.name}</div>
                      <div className="text-sm text-green-600">{item.description}</div>
                    </div>
                  </motion.button>
            ))}
          </div>

              <motion.div 
                className="flex gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <motion.button
                  onClick={() => {
                    setShowVegAcharModal(false);
                    setShowAcharModal(true);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={() => setShowVegAcharModal(false)}
                  className="flex-1 py-3 bg-red-200 text-red-700 rounded-lg hover:bg-red-300 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Selection Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-[#F0F2F5] rounded-2xl p-8 max-w-lg w-full mx-4 relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-[#F0F2F5] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-gray-600" />
              </motion.button>

              {/* Header */}
              <motion.h3 
                className="text-2xl font-bold text-gray-900 mb-6 text-center pr-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                What are you looking for?
              </motion.h3>
              
              {/* Search Input */}
              <motion.div 
                className="relative mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="relative">
                  <ArrowLeft className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for your location/society/apartment"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && locationSearchQuery.trim()) {
                        setShowPlacemarkInput(true);
                      }
                    }}
                  />
                  {locationSearchQuery.trim() && (
                    <motion.button
                      onClick={() => setShowPlacemarkInput(true)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Search
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Placemark Input */}
              {showPlacemarkInput && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a placemark (e.g., Near BigMart, Near Hospital)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g., Near BigMart"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                      value={placemark}
                      onChange={(e) => setPlacemark(e.target.value)}
                    />
                    <motion.button
                      onClick={() => {
                        const finalLocation = locationSearchQuery + (placemark ? ` (${placemark})` : '');
                        setSelectedLocation(finalLocation);
                        setShowLocationModal(false);
                        setShowPlacemarkInput(false);
                        setLocationSearchQuery('');
                        setPlacemark('');
                      }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Use Current Location */}
              <motion.button
                onClick={() => {
                  // Simulate getting current location
                  setSelectedLocation('Current Location');
                  setShowLocationModal(false);
                  setShowPlacemarkInput(false);
                  setLocationSearchQuery('');
                  setPlacemark('');
                }}
                className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-purple-50 transition-colors duration-200 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-purple-600 rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-6 h-6 border border-purple-600 rounded-full opacity-30"></div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 border border-purple-600 rounded-full opacity-20"></div>
                  </div>
                </div>
                <span className="text-purple-600 font-medium group-hover:text-purple-700">Use current location</span>
              </motion.button>

              {/* Recent Locations */}
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Locations</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Kathmandu, Nepal', area: 'Kathmandu Valley' },
                    { name: 'Pokhara, Nepal', area: 'Gandaki Province' },
                    { name: 'Lalitpur, Nepal', area: 'Kathmandu Valley' },
                    { name: 'Bhaktapur, Nepal', area: 'Kathmandu Valley' }
                  ].map((location, index) => (
                    <motion.button
                      key={location.name}
                      onClick={() => {
                        setSelectedLocation(location.name);
                        setShowLocationModal(false);
                        setShowPlacemarkInput(false);
                        setLocationSearchQuery('');
                        setPlacemark('');
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        selectedLocation === location.name
                          ? 'bg-purple-100 border border-purple-300'
                          : 'hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.area}</div>
                        </div>
                        {selectedLocation === location.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                              className="w-1.5 h-1.5 bg-[#F0F2F5] rounded-full"
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
              ))}
            </div>
              </motion.div>

              {/* Powered by Google */}
              <motion.div 
                className="flex items-center justify-center mt-8 pt-4 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <span className="text-xs text-gray-500 mr-2">Powered by</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
          </div>
                  <span className="text-xs font-semibold text-gray-700">Google</span>
        </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
