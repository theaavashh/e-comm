'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const Carpet = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  // Hardcoded food product data
  const hardcodedFoodProducts: Product[] = [
    {
      id: '1',
      name: 'Mixed Vegetable Achar',
      slug: 'mixed-vegetable-achar',
      description: 'A delicious blend of seasonal vegetables marinated in traditional Nepali spices.',
      shortDescription: 'Spicy mixed vegetable pickle',
      price: 4.99,
      comparePrice: 6.99,
      sku: 'ACH-001',
      quantity: 25,
      image: '/achar-layout.webp',
      images: ['/achar-layout.webp', '/achar-layout.webp'],
      category: {
        id: '1',
        name: 'Achar',
        slug: 'achar'
      },
      averageRating: 4.5,
      reviewCount: 12,
      variants: [],
      attributes: [],
      tags: ['achar', 'pickle', 'vegetarian']
    },
    {
      id: '2',
      name: 'Organic Green Tea',
      slug: 'organic-green-tea',
      description: 'Premium organic green tea leaves sourced from the highlands of Nepal.',
      shortDescription: 'Premium organic green tea',
      price: 8.99,
      comparePrice: 12.99,
      sku: 'TEA-002',
      quantity: 30,
      image: '/tea-layout.webp',
      images: ['/tea-layout.webp', '/tea-layout.webp'],
      category: {
        id: '2',
        name: 'Tea',
        slug: 'tea'
      },
      averageRating: 4.8,
      reviewCount: 18,
      variants: [],
      attributes: [],
      tags: ['tea', 'organic', 'green tea']
    },
    {
      id: '3',
      name: 'Traditional Nepali Thukpa Soup',
      slug: 'traditional-nepali-thukpa-soup',
      description: 'Authentic Nepali soup made with fresh vegetables and traditional spices.',
      shortDescription: 'Traditional Nepali soup',
      price: 5.99,
      comparePrice: 7.99,
      sku: 'TNP-003',
      quantity: 20,
      image: '/typical-layout.webp',
      images: ['/typical-layout.webp', '/typical-layout.webp'],
      category: {
        id: '3',
        name: 'Typical Nepali',
        slug: 'typical-nepali'
      },
      averageRating: 4.6,
      reviewCount: 15,
      variants: [],
      attributes: [],
      tags: ['nepali', 'soup', 'thukpa', 'traditional']
    },
    {
      id: '4',
      name: 'Special Chicken Masala',
      slug: 'special-chicken-masala',
      description: 'Rich and flavorful chicken masala with authentic Nepali spices.',
      shortDescription: 'Authentic chicken masala',
      price: 12.99,
      comparePrice: 15.99,
      sku: 'MAS-004',
      quantity: 15,
      image: '/masala-layout.webp',
      images: ['/masala-layout.webp', '/masala-layout.webp'],
      category: {
        id: '4',
        name: 'Special Masala',
        slug: 'special-masala'
      },
      averageRating: 4.9,
      reviewCount: 22,
      variants: [],
      attributes: [],
      tags: ['masala', 'chicken', 'spicy']
    },
    {
      id: '5',
      name: 'Momo Spice Mix',
      slug: 'momo-spice-mix',
      description: 'Traditional spice blend for making authentic Nepali momos.',
      shortDescription: 'Momo spice blend',
      price: 3.99,
      comparePrice: 5.99,
      sku: 'MAS-005',
      quantity: 40,
      image: '/masala-layout.webp',
      images: ['/masala-layout.webp', '/masala-layout.webp'],
      category: {
        id: '4',
        name: 'Special Masala',
        slug: 'special-masala'
      },
      averageRating: 4.7,
      reviewCount: 14,
      variants: [],
      attributes: [],
      tags: ['masala', 'momo', 'spice']
    },
    {
      id: '6',
      name: 'Himalayan Black Tea',
      slug: 'himalayan-black-tea',
      description: 'Premium black tea leaves grown in the pristine Himalayan region.',
      shortDescription: 'Premium Himalayan black tea',
      price: 9.99,
      comparePrice: 13.99,
      sku: 'TEA-006',
      quantity: 28,
      image: '/tea-layout.webp',
      images: ['/tea-layout.webp', '/tea-layout.webp'],
      category: {
        id: '2',
        name: 'Tea',
        slug: 'tea'
      },
      averageRating: 4.6,
      reviewCount: 16,
      variants: [],
      attributes: [],
      tags: ['tea', 'black tea', 'himalayan']
    },
    {
      id: '7',
      name: 'Mixed Non-Veg Achar',
      slug: 'mixed-non-veg-achar',
      description: 'Spicy pickle made with mixed non-vegetarian ingredients and traditional spices.',
      shortDescription: 'Spicy non-veg pickle',
      price: 6.99,
      comparePrice: 8.99,
      sku: 'ACH-007',
      quantity: 18,
      image: '/achar-layout.webp',
      images: ['/achar-layout.webp', '/achar-layout.webp'],
      category: {
        id: '1',
        name: 'Achar',
        slug: 'achar'
      },
      averageRating: 4.4,
      reviewCount: 10,
      variants: [],
      attributes: [],
      tags: ['achar', 'pickle', 'non-vegetarian']
    },
    {
      id: '8',
      name: 'Dal Bhat Spice Set',
      slug: 'dal-bhat-spice-set',
      description: 'Complete spice set for preparing traditional Nepali Dal Bhat.',
      shortDescription: 'Dal Bhat spice set',
      price: 14.99,
      comparePrice: 19.99,
      sku: 'MAS-008',
      quantity: 12,
      image: '/masala-layout.webp',
      images: ['/masala-layout.webp', '/masala-layout.webp'],
      category: {
        id: '4',
        name: 'Special Masala',
        slug: 'special-masala'
      },
      averageRating: 4.8,
      reviewCount: 19,
      variants: [],
      attributes: [],
      tags: ['masala', 'dal bhat', 'traditional']
    }
  ];

  const fetchFoodsProducts = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const response = await fetch(`${API_BASE_URL}/api/v1/products?category=foods&isActive=true&limit=20`);

      if (!response.ok) {
        throw new Error('Failed to fetch foods products');
      }

      const data = await response.json();

      if (data.success && data.data.products) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error('Error fetching foods products:', error);
      // Fallback to hardcoded if API fails
      setProducts(hardcodedFoodProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodsProducts();
  }, []);

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
            <p className="mt-4 text-gray-600">Loading foods...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 custom-font">Carpet</h2>
              <button
                onClick={() => router.push('/products/foods')}
                className="text-base md:text-lg text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                View More
              </button>
            </div>
            <p className="text-lg text-gray-600">Discover delicious and fresh food products</p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No food products available at the moment.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 gap-6"
          >
            {products.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer flex-shrink-0 w-[80%] sm:w-[50%] md:w-[40%] lg:w-[calc((100%-72px)/4)]"
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
                          ${new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(product.price)}
                        </span>
                        {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(Number(product.comparePrice))}
                          </span>
                        )}
                      </div>
                      {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)}% OFF
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
                        className="bg-[#EB6426] hover:bg-[#d65a1f] disabled:bg-gray-300 text-white py-2.5 px-6 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
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
        )}

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

export default Carpet;