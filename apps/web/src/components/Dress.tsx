'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Dress = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [promotionalBanner, setPromotionalBanner] = useState<any>(null);
  const router = useRouter();

  // Filter categories
  const filterCategories = [
    { id: 'all', name: 'All' },
    { id: 'sari', name: 'Sari' },
    { id: 'lehenga', name: 'Lehenga' },
    { id: 'gown', name: 'Gown' },
    { id: 'cultural', name: 'Cultural' }
  ];

  // Fetch dress products and promotional banner
  useEffect(() => {
    const fetchDressProducts = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/products?category=dress&isActive=true&limit=20`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dress products');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.products) {
          setProducts(data.data.products);
          setFilteredProducts(data.data.products);
        }
      } catch (error) {
        console.error('Error fetching dress products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchPromotionalBanner = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(`${API_BASE_URL}/api/v1/media?linkTo=dress&active=true`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.mediaItems && data.data.mediaItems.length > 0) {
            setPromotionalBanner(data.data.mediaItems[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch promotional banner:', error);
      }
    };

    fetchDressProducts();
    fetchPromotionalBanner();
  }, []);

  // Filter products based on active filter
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        const productName = product.name.toLowerCase();
        const productTags = product.tags?.map((tag: string) => tag.toLowerCase()) || [];
        const productDescription = product.description?.toLowerCase() || '';
        
        switch (activeFilter) {
          case 'Sari':
            return productName.includes('sari') || 
                   productTags.some((tag: string) => tag.includes('sari')) ||
                   productDescription.includes('sari');
          case 'Lehenga':
            return productName.includes('lehenga') || 
                   productTags.some((tag: string) => tag.includes('lehenga')) ||
                   productDescription.includes('lehenga');
          case 'Gown':
            return productName.includes('gown') || 
                   productTags.some((tag: string) => tag.includes('gown')) ||
                   productDescription.includes('gown');
          case 'Cultural':
            return productName.includes('cultural') || 
                   productTags.some((tag: string) => tag.includes('cultural')) ||
                   productDescription.includes('cultural') ||
                   productName.includes('traditional');
          default:
            return true;
        }
      });
      setFilteredProducts(filtered);
    }
  }, [activeFilter, products]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || product.image || ''
      }]);
    }
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.category.slug}/${product.slug}`);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dresses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get lowest price from products
  const getLowestPrice = () => {
    if (filteredProducts.length === 0) return 0;
    const prices = filteredProducts.map(p => Number(p.price));
    return Math.min(...prices);
  };

  return (
    <div className="py-16 bg-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Side - Promotional Banner */}
          <div className="relative">
            <Link 
              href={promotionalBanner?.internalLink || '/products/dress'} 
              className="block group"
            >
              <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                {promotionalBanner?.mediaUrl ? (
                  <img
                    src={promotionalBanner.mediaUrl}
                    alt="Dress Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                )}
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 lg:p-10">
                  {/* Top Text */}
                  <div className="text-left">
                    <p className="text-sm md:text-base font-medium text-purple-900 mb-2 custom-font">
                      Minis, midis & maxis
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight custom-font">
                      Chic fall
                      <br />
                      dresses
                    </h2>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-end justify-between">
                    {/* Price Indicator */}
                    {filteredProducts.length > 0 && (
                      <div className="text-left">
                        <p className="text-sm text-purple-900 font-medium mb-1 custom-font">From</p>
                        <p className="text-3xl md:text-4xl font-bold text-purple-900 custom-font">
                          ${getLowestPrice().toFixed(0)}
                        </p>
                      </div>
                    )}

                    {/* Shop All Button */}
                    <button className="px-6 py-3 bg-white border-2 border-purple-900 rounded-full text-purple-900 font-semibold hover:bg-purple-900 hover:text-white transition-colors duration-300 custom-font text-sm md:text-base">
                      Shop all
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side - Product Showcase */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 custom-font">
                Styles for every invite
              </h2>
              <Link
                href="/products/dress"
                className="text-base md:text-lg text-gray-900 hover:text-gray-600 transition-colors duration-200 font-medium flex items-center gap-1 custom-font"
              >
                View all
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Products Carousel */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No dress products available at the moment.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
                <div className="flex gap-4">
                  {filteredProducts.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="group cursor-pointer flex-shrink-0 w-[280px] md:w-[320px]"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative h-[350px] md:h-[400px] bg-white overflow-hidden">
                          {/* Heart Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to wishlist functionality
                            }}
                            className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          >
                            <Heart className="h-5 w-5 text-gray-600" />
                          </button>

                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                              onError={(e) => {
                                console.error('Image failed to load for product:', product.name);
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback */}
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
                          <div className="mb-2">
                            {product.comparePrice && Number(product.comparePrice) > Number(product.price) ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-green-600">
                                  Now ${new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(product.price)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ${new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }).format(Number(product.comparePrice))}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-semibold text-gray-900">
                                ${new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(product.price)}
                              </span>
                            )}
                          </div>

                          {/* Product Name/Brand */}
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {product.brand?.name ? `${product.brand.name} ` : ''}
                            {product.name}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-[#F0F2F5] rounded-lg shadow-lg p-4 border border-gray-200 z-50"
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                {cart.reduce((total, item) => total + item.quantity, 0)} items
              </span>
              <span className="text-sm text-gray-500">
                ({formatPrice(cart.reduce((total, item) => total + (item.price * item.quantity), 0))})
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dress;

