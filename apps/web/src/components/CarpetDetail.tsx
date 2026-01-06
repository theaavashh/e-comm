"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/contexts/LocationContext";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TbTruckDelivery } from "react-icons/tb";

interface ApiProduct {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number | string;
  comparePrice?: number | string | null;
  image?: string;
  images?: string[];
  brand?: { name: string } | null;
  averageRating?: number;
  reviewCount?: number;
  category: { slug: string };
}

export default function Statues() {
  const router = useRouter();
  const { selectedCountry } = useLocation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hardcoded carousel images using real carpet images
  const carouselImages = [
    { id: 1, image: "/carpet-layout.webp" },
    { id: 2, image: "/woven-layout.webp" },
    { id: 3, image: "/typical-layout.webp" },
  ];

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    const loadStatueProducts = async () => {
      try {
        setLoading(true);
        // Fetch statue products specifically from the statue category, limited to 10 items
        const res = await fetch(
          `${API_BASE_URL}/api/v1/products?category=statue&limit=10`,
        );
        console.log("Statue API response status:", res.status);
        const json = await res.json();
        console.log("Statue API response data:", json);
        const list: ApiProduct[] = json?.data?.products || [];
        setProducts(list);
      } catch (error) {
        console.error("Error loading statue products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadStatueProducts();
  }, []); // Removed selectedCountry from dependency to avoid repeated calls

  const mappedProducts = (products || []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category?.slug || "statue",
    subcategory: "puja-samagri",
    price: Number(p.price) || 0,
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    discount: p.comparePrice
      ? Math.max(
          0,
          Math.round(
            ((Number(p.comparePrice) - Number(p.price)) /
              Number(p.comparePrice)) *
              100,
          ),
        )
      : 0,
    rating: p.averageRating || 0,
    reviewCount: p.reviewCount || 0,
    image: p.image || p.images?.[0] || "/placeholder-image.jpg",
    images: p.images || [p.image || "/placeholder-image.jpg"], // Use all images or fallback to single image
    description: p.shortDescription || p.description || "",
    inStock: true,
    brand: p.brand?.name || "Unknown",
    tags: [],
    sku: "",
  }));

  const handleAddToCart = (product: any) => {
    console.log("Add to cart:", product);
    // Implement add to cart functionality - consistent with Ongoing Sales
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollCarouselLeft = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + carouselImages.length) % carouselImages.length,
    );
    // Reset auto-scroll timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
  };

  const scrollCarouselRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    // Reset auto-scroll timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);
  };

  return (
    <div className="bg-gray-50 py-8 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Auto-scrolling Carousel Section */}
        <div className="mb-12">
          {/* Carousel Container */}
          <div className="relative">
            {/* Auto-scrolling Carousel */}
            {loading ? (
              <div className="flex space-x-4 overflow-hidden p-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-white overflow-hidden animate-pulse"
                  >
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : carouselImages.length > 0 ? (
              <div className="relative overflow-hidden py-8">
                {/* Navigation Arrows */}
                <button
                  onClick={scrollCarouselLeft}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 hidden sm:block"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>

                <button
                  onClick={scrollCarouselRight}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 hidden sm:block"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Carousel Items */}
                <div className="flex justify-center items-center h-[300px] sm:h-[400px] md:h-[500px] w-full">
                  {carouselImages.map(
                    (product: { id: number; image: string }, index: number) => {
                      // Calculate the position of each product relative to the current index
                      const position =
                        (index - currentIndex + carouselImages.length) %
                        carouselImages.length;

                      // For a carousel showing 5 items, we want to show:
                      // - Far Previous item (smallest, left)
                      // - Previous item (smaller, left)
                      // - Current item (larger, center)
                      // - Next item (smaller, right)
                      // - Far Next item (smallest, right)

                      // Determine visibility and scaling
                      let transformClass = "";
                      let zIndex = "z-0";
                      let opacity = "opacity-100";
                      let scaleClass = "";

                      if (position === 0) {
                        // Far Previous item (smallest, left)
                        transformClass =
                          "-translate-x-[300px] sm:-translate-x-[600px] md:-translate-x-[800px]";
                        scaleClass = "scale-70 sm:scale-50";
                        zIndex = "z-0";
                      } else if (position === 1) {
                        // Previous item (smaller, left)
                        transformClass =
                          "-translate-x-[180px] sm:-translate-x-[400px] md:-translate-x-[500px]";
                        scaleClass = "scale-80 sm:scale-70";
                        zIndex = "z-5";
                      } else if (position === 2) {
                        // Current item (larger, center)
                        transformClass = "translate-x-0";
                        scaleClass = "scale-95 sm:scale-100";
                        zIndex = "z-10";
                      } else if (position === 3) {
                        // Next item (smaller, right)
                        transformClass =
                          "translate-x-[180px] sm:translate-x-[400px] md:translate-x-[500px]";
                        scaleClass = "scale-80 sm:scale-70";
                        zIndex = "z-5";
                      } else if (position === 4) {
                        // Far Next item (smallest, right)
                        transformClass =
                          "translate-x-[300px] sm:translate-x-[600px] md:translate-x-[800px]";
                        scaleClass = "scale-70 sm:scale-50";
                        zIndex = "z-0";
                      } else {
                        // Hidden items
                        transformClass = "translate-x-[1200px]";
                        scaleClass = "scale-0";
                        opacity = "opacity-0";
                      }

                      return (
                        <div
                          key={product.id}
                          className={`absolute transition-all duration-500 ease-in-out ${transformClass} ${scaleClass} ${opacity} ${zIndex}`}
                        >
                          <div className="w-[280px] sm:w-[400px] md:w-[600px] shadow-lg overflow-hidden h-full flex flex-col bg-white">
                            {/* Product Image Only */}
                            <div className="relative overflow-hidden h-full">
                              <img
                                src={product.image}
                                alt={`Carousel item ${product.id}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-inter">
                  No statues available
                </h3>
                <p className="text-gray-500 font-inter">
                  Check back later for new arrivals
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 mx-4 sm:mx-8 md:mx-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-inter">
            Religious Statues
          </h1>
          <p className="text-gray-600 mt-2 font-inter text-sm sm:text-base">
            Discover our collection of authentic religious statues and idols
          </p>
        </div>

        {/* Scrollable Product Row with Arrows */}
        <div className="relative mx-4 sm:mx-8 md:mx-16" id="statue-products">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute -left-3 sm:-left-5 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-70 hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute -right-3 sm:-right-5 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-70 hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {loading ? (
            <div
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-8"
            >
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 sm:w-60 bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-32 sm:h-48 bg-gray-200"></div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-full mt-3 sm:mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : mappedProducts.length > 0 ? (
            <div
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-8"
            >
              {mappedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() =>
                    router.push(`/products/${product.category}/${product.id}`)
                  }
                  className="flex-shrink-0 w-56 sm:w-64 md:w-72 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer group/card"
                >
                  {/* Product Image with zoom on hover and navigation */}
                  <ProductImageSlider images={product.images} />

                  {/* Price */}
                  <div className="mt-3 sm:mt-5 pl-4 sm:pl-6 text-xl sm:text-2xl">
                    <span className="text-[#EB6426] font-extrabold font-inter">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="mt-2 flex-grow px-4 sm:px-6">
                    <h3 className="text-black font-medium text-sm sm:text-md mb-1 line-clamp-2 font-inter group-hover/card:text-[#EB6426] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Add to Cart Button - consistent with Ongoing Sales */}
                  <button
                    className="bg-[#EB6426] text-white py-2 px-4 rounded-full text-sm sm:text-md font-medium transition-colors mt-3 flex items-center justify-center space-x-1 sm:space-x-2 font-inter mx-6 sm:mx-8 mb-6 sm:mb-8 hover:bg-[#d65215]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base">Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-inter">
                No statues found
              </h3>
              <p className="text-gray-500 font-inter">
                We couldn't find any statue products in this category.
              </p>
            </div>
          )}
        </div>

        {/* Free Delivery Banner */}
        <div className="mt-8 sm:mt-12 bg-[#262626] rounded-sm p-4 sm:p-6 text-center mx-4 sm:mx-6 md:mx-10">
          <div className="flex flex-col items-center justify-center md:flex-row md:justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-center">
              <TbTruckDelivery className="text-white w-6 h-6 sm:w-8 sm:h-8 mr-2" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-inter">
                Free Delivery Worldwide
              </h2>
            </div>
            <p className="text-white font-inter text-base sm:text-lg px-4 sm:px-0">
              Enjoy complimentary shipping on all products, no matter where you
              are in the world
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Image Slider Component with seamless transitions
function ProductImageSlider({ images }: { images: string[] }) {
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
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Auto-rotate when not hovered (or when hovered on large screens) with continuous flow
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Auto-rotate if:
    // - On small screens and not hovered, OR
    // - On large screens (auto-rotate even when hovered)
    const shouldAutoRotate =
      (!isLargeScreen && !isHovered) || (isLargeScreen && isHovered);

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
      <div className="relative group overflow-hidden">
        <img
          src="/placeholder-image.jpg"
          alt="Product placeholder"
          className="w-full h-48 sm:h-56 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className="relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image with seamless Framer Motion animations */}
      <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
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
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
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
