'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star, TrendingUp, ShoppingCart, Heart, Eye, Plus, Minus, Image } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/contexts/LocationContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  quantity: number;
  image: string;
  images: string[];
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  variants?: Array<{
    id: string;
    name: string;
    value: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    value: string;
  };
}

interface ForYouProps {
  className?: string;
}

const ForYou: React.FC<ForYouProps> = ({ className = '' }) => {
  const router = useRouter();
  const { selectedCountry } = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Get user country from context for pricing
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/products?limit=16&isActive=true&include=brand&country=${encodeURIComponent(selectedCountry)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.data.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCountry]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { id: Date.now().toString(), product, quantity }]);
    }
    
    // Reset quantity for this product
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities({ ...quantities, [productId]: Math.max(1, quantity) });
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (product: Product) => {
    // Navigate to product detail page
    router.push(`/products/${product.category.slug}/${product.slug}`);
  };

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Unable to load products</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products available</h3>
              <p className="text-sm">Check back later for personalized recommendations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 bg-white mt-10 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 custom-font">For You</h2>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Discover personalized product recommendations just for you
          </p>
        </motion.div>

        {/* Products Grid - 4 columns, 12 products (3 rows) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
        >
          {products.slice(0, 12).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative h-48 md:h-64 bg-white overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        console.error('Image failed to load for product:', product.name);
                        e.currentTarget.style.display = 'none';
                        // Show fallback
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback when no image or image fails to load */}
                  <div 
                    className="w-full h-full bg-gray-50 flex items-center justify-center"
                    style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}
                  >
                    <div className="text-center">
                      <p className="text-sm text-gray-500">No Image Available</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-white custom-font">
                  {/* Price */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-semibold text-gray-900">
                        <sup className="text-[0.7em]">$</sup>
                        {new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(product.price)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          <sup className="text-[0.7em]">$</sup>
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Add to Cart Button - Rounded */}
                  <div className="mb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, quantities[product.id] || 1);
                      }}
                      disabled={product.quantity === 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2.5 px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
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

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
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
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>


        {/* Cart Summary */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-[#F0F2F5] rounded-2xl shadow-2xl p-4 border border-gray-200 z-50"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-full p-2">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
                <p className="text-xs text-gray-600">
                  {formatPrice(cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))}
                </p>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#F0F2F5] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                <button
                  onClick={closeProductModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Star className="h-24 w-24 text-purple-300" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
                      {selectedProduct.category.name}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By <span className="font-medium">{selectedProduct.brand?.name || selectedProduct.category?.name || 'Unknown Brand'}</span>
                    </p>
                    
                    {/* Gray Line */}
                    <div className="w-full h-px bg-gray-200 my-4"></div>
                    
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedProduct.averageRating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedProduct.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(selectedProduct.comparePrice)}
                      </span>
                    )}
                    {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((selectedProduct.comparePrice - selectedProduct.price) / selectedProduct.comparePrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(selectedProduct.id, (quantities[selectedProduct.id] || 1) - 1)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                        disabled={quantities[selectedProduct.id] <= 1}
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center text-lg font-semibold">
                        {quantities[selectedProduct.id] || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(selectedProduct.id, (quantities[selectedProduct.id] || 1) + 1)}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                        disabled={quantities[selectedProduct.id] >= selectedProduct.quantity}
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedProduct.quantity} available
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, quantities[selectedProduct.id] || 1);
                        closeProductModal();
                      }}
                      disabled={selectedProduct.quantity === 0}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>{selectedProduct.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                    <button
                      onClick={() => {
                        // Book now functionality
                        alert('Booking functionality coming soon!');
                      }}
                      disabled={selectedProduct.quantity === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ForYou;
