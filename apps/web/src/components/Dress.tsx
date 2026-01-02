'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

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

const Dress = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [promotionalBanner, setPromotionalBanner] = useState<any>(null);
  const router = useRouter();
  
  // Use global cart context
  const { cartItems: cart, addToCart: addToGlobalCart } = useCart();

  // Hardcoded dress products
  const hardcodedProducts: Product[] = [
    {
      id: '1',
      name: 'Elegant Silk Sari',
      slug: 'elegant-silk-sari',
      description: 'Beautiful silk sari with traditional embroidery',
      shortDescription: 'Traditional silk sari',
      price: 89.99,
      comparePrice: 120.99,
      sku: 'SAR-001',
      quantity: 15,
      image: '/sari.webp',
      images: ['/sari.webp', '/sari.webp'],
      category: {
        id: '1',
        name: 'Sari',
        slug: 'sari'
      },
      averageRating: 4.8,
      reviewCount: 24,
      variants: [],
      brand: {
        id: '1',
        name: 'Traditional Wear'
      },
      attributes: [],
      tags: ['silk', 'traditional', 'wedding']
    },
    {
      id: '2',
      name: 'Designer Lehenga',
      slug: 'designer-lehenga',
      description: 'Stunning designer lehenga for special occasions',
      shortDescription: 'Designer lehenga',
      price: 149.99,
      comparePrice: 199.99,
      sku: 'LEH-002',
      quantity: 8,
      image: '/lehenga.webp',
      images: ['/lehenga.webp', '/lehenga.webp'],
      category: {
        id: '2',
        name: 'Lehenga',
        slug: 'lehenga'
      },
      averageRating: 4.9,
      reviewCount: 18,
      variants: [],
      brand: {
        id: '2',
        name: 'Royal Collections'
      },
      attributes: [],
      tags: ['lehenga', 'bridal', 'designer']
    },
    {
      id: '3',
      name: 'Cocktail Gown',
      slug: 'cocktail-gown',
      description: 'Elegant cocktail gown for evening parties',
      shortDescription: 'Evening cocktail gown',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'GOW-003',
      quantity: 12,
      image: '/dress3.jpg',
      images: ['/dress3.jpg', '/dress3-alt.jpg'],
      category: {
        id: '3',
        name: 'Gown',
        slug: 'gown'
      },
      averageRating: 4.6,
      reviewCount: 32,
      variants: [],
      brand: {
        id: '3',
        name: 'Modern Fashion'
      },
      attributes: [],
      tags: ['gown', 'cocktail', 'evening']
    },
    {
      id: '4',
      name: 'Cultural Traditional Dress',
      slug: 'cultural-traditional-dress',
      description: 'Authentic cultural dress representing heritage',
      shortDescription: 'Cultural heritage dress',
      price: 69.99,
      comparePrice: 89.99,
      sku: 'CUL-004',
      quantity: 20,
      image: '/dress4.jpg',
      images: ['/dress4.jpg', '/dress4-alt.jpg'],
      category: {
        id: '4',
        name: 'Cultural',
        slug: 'cultural'
      },
      averageRating: 4.7,
      reviewCount: 15,
      variants: [],
      brand: {
        id: '4',
        name: 'Heritage Wear'
      },
      attributes: [],
      tags: ['cultural', 'traditional', 'heritage']
    },
    {
      id: '5',
      name: 'Anarkali Suit',
      slug: 'anarkali-suit',
      description: 'Classic Anarkali suit with intricate work',
      shortDescription: 'Anarkali ethnic suit',
      price: 99.99,
      comparePrice: 129.99,
      sku: 'ANA-005',
      quantity: 10,
      image: '/kurta.webp',
      images: ['/dress5.jpg', '/dress5-alt.jpg'],
      category: {
        id: '1',
        name: 'Sari',
        slug: 'sari'
      },
      averageRating: 4.5,
      reviewCount: 22,
      variants: [],
      brand: {
        id: '1',
        name: 'Traditional Wear'
      },
      attributes: [],
      tags: ['anarkali', 'suit', 'ethnic']
    },
    {
      id: '6',
      name: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      description: 'Luxurious Banarasi silk saree with gold zari',
      shortDescription: 'Banarasi silk saree',
      price: 129.99,
      comparePrice: 159.99,
      sku: 'SAR-006',
      quantity: 5,
      image: '/saree2.webp',
      images: ['/saree2.webp', '/saree2-alt.webp'],
      category: {
        id: '1',
        name: 'Sari',
        slug: 'sari'
      },
      averageRating: 4.9,
      reviewCount: 31,
      variants: [],
      brand: {
        id: '5',
        name: 'Banarasi Weaves'
      },
      attributes: [],
      tags: ['silk', 'banarasi', 'luxury']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(hardcodedProducts);
      setFilteredProducts(hardcodedProducts);
      setLoading(false);
    }, 500);
  }, []);

  // Format price helper
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    // Add to global cart context
    addToGlobalCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || ''
    }, quantity);
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

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
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
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Side - Promotional Banner */}
          <div className="relative md:col-span-1">
            <Link 
              href={promotionalBanner?.internalLink || '/products/dress'} 
              className="block group"
            >
              <div className="relative h-[700px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                {/* {promotionalBanner?.mediaUrl ? (
                  <img
                    src={promotionalBanner.mediaUrl}
                    alt="Dress Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                )} */}
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  {/* Top Text */}
                  <div className="text-left">
                    <p className="text-sm md:text-base font-medium text-purple-900 mb-2 custom-font">
                      Minis, midis & maxis
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-900 leading-tight custom-font">
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
                        <p className="text-2xl md:text-3xl font-bold text-purple-900 custom-font">
                          ${getLowestPrice().toFixed(0)}
                        </p>
                      </div>
                    )}

                    {/* Shop All Button */}
                    <button className="px-4 py-2 bg-white border-2 border-purple-900 rounded-full text-purple-900 font-semibold hover:bg-purple-900 hover:text-white transition-colors duration-300 custom-font text-sm">
                      Shop all
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Middle and Right Side - Product Showcase */}
          <div className="md:col-span-2 flex flex-col">
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
                <div className="flex gap-2">
                  {filteredProducts.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="group cursor-pointer flex-shrink-0 w-[450px] md:w-[450px] lg:w-[500px]"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="bg-white rounded-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative h-[350px] md:h-[450px] lg:h-[500px] bg-white overflow-hidden">
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
                        <div className="p-6 bg-white custom-font">
                          {/* Price */}
                          <div className="mb-2">
                            {product.comparePrice && Number(product.comparePrice) > Number(product.price) ? (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-extrabold text-[#EB6426]">
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
                          <h3 className="text-lg font-medium text-black line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {product.brand?.name ? `${product.brand.name} ` : ''}
                            {product.name}
                          </h3>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={product.quantity <= 0}
                            className="mt-3 bg-[#EB6426] hover:bg-[#d65a1f] disabled:bg-gray-400 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center w-full"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            <span>Add to Cart</span>
                          </button>
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