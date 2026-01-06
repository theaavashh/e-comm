'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Product Image Slider Component with seamless transitions
function ProductImageSlider({ images, productName }: { images: string[]; productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Check if screen is large enough for auto-scroll on hover
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg screen and above
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Auto-rotate when not hovered (or when hovered on large screens) with continuous flow
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Auto-rotate if:
    // - On small screens and not hovered, OR
    // - On large screens (auto-rotate even when hovered)
    const shouldAutoRotate = (!isLargeScreen && !isHovered) || (isLargeScreen && isHovered);

    if (shouldAutoRotate && images.length > 1) {
      // Set up a continuous rotation without waiting
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, isLargeScreen, currentIndex, images.length]);

  if (images.length === 0) {
    return (
      <div className="relative group overflow-hidden h-full w-full">
        <img
          src="/placeholder-image.jpg"
          alt={productName || "Product placeholder"}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>
    );
  }

  return (
    <div
      className="relative group overflow-hidden h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image with seamless Framer Motion animations */}
      <div className="w-full h-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${productName} image ${currentIndex + 1}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/carpet-layout.webp'; // fallback image
            }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Show on hover */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const Carpet = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();
  const { addToCart: addToGlobalCart } = useCart();

  useEffect(() => {
    const fetchCarpetProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444"}/api/v1/products?category=carpet&limit=8`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch carpet products');
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.products) {
          // Map API response to Product interface
          const apiProducts: Product[] = data.data.products.map((apiProduct: any) => {
            // Get price from currencyPrices array based on pricingCountry
            const currencyPrice = apiProduct.currencyPrices?.find(
              (cp: any) => cp.country === apiProduct.pricingCountry
            );
            
            return {
              id: apiProduct.id,
              name: apiProduct.name,
              slug: apiProduct.slug,
              description: apiProduct.description || '',
              shortDescription: apiProduct.shortDescription || apiProduct.description || '',
              price: currencyPrice ? Number(currencyPrice.price) : Number(apiProduct.price) || 0,
              comparePrice: currencyPrice && currencyPrice.comparePrice ? Number(currencyPrice.comparePrice) : apiProduct.comparePrice ? Number(apiProduct.comparePrice) : undefined,
              sku: apiProduct.sku || 'N/A',
              quantity: apiProduct.quantity || 0,
              image: apiProduct.image || apiProduct.images?.[0] || '/placeholder-image.jpg',
              images: apiProduct.images || [apiProduct.image || '/placeholder-image.jpg'],
              category: {
                id: apiProduct.category?.id || '1',
                name: apiProduct.category?.name || 'Carpet',
                slug: apiProduct.category?.slug || 'carpet'
              },
              averageRating: apiProduct.averageRating || 0,
              reviewCount: apiProduct.reviewCount || 0,
              variants: apiProduct.variants || [],
              brand: apiProduct.brand ? {
                id: apiProduct.brand.id,
                name: apiProduct.brand.name
              } : undefined,
              attributes: apiProduct.attributes || [],
              tags: apiProduct.tags || []
            };
          });
          
          setProducts(apiProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching carpet products:', error);
        // Set empty array on error to avoid showing old data
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarpetProducts();
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

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading carpets...</p>
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
                onClick={() => router.push('/products/carpet')}
                className="text-base md:text-lg text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                View More
              </button>
            </div>
            <p className="text-lg text-gray-600">Discover beautiful and high-quality carpets</p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No carpet products available at the moment.</p>
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
                  {/* Image Container with ProductImageSlider */}
                  <div className="relative h-48 md:h-64 bg-white overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <ProductImageSlider images={product.images} productName={product.name} />
                    ) : (
                      // Fallback when no image or image fails to load
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">No Image Available</p>
                        </div>
                      </div>
                    )}
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


      </div>
    </div>
  );
};

export default Carpet;