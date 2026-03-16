"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "@/contexts/LocationContext";

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

interface BuildYourHomeData {
  carpets: Product[];
  statues: Product[];
}

function ProductImageSlider({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isHovered && images.length > 1) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, images.length]);

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
          />
        </AnimatePresence>
      </div>

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

export default function BuildYourHomeWith() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BuildYourHomeData>({ carpets: [], statues: [] });
  const [activeTab, setActiveTab] = useState<"carpets" | "statues">("carpets");
  const router = useRouter();
  const { addToCart: addToGlobalCart } = useCart();
  const { selectedCountry } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [carpetResponse, statueResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444"}/api/v1/products?subcategory=carpet&limit=8`,
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4444"}/api/v1/products?categories=statue&limit=8&country=${selectedCountry || "USA"}`,
          ),
        ]);

        const [carpetData, statueData] = await Promise.all([
          carpetResponse.json(),
          statueResponse.json(),
        ]);

        const mapProducts = (products: any[]): Product[] =>
          products.map((apiProduct: any) => {
            const currencyPrice = apiProduct.currencyPrices?.find(
              (cp: any) => cp.country === apiProduct.pricingCountry,
            );

            return {
              id: apiProduct.id,
              name: apiProduct.name,
              slug: apiProduct.slug,
              description: apiProduct.description || "",
              shortDescription: apiProduct.shortDescription || apiProduct.description || "",
              price: currencyPrice
                ? Number(currencyPrice.price)
                : Number(apiProduct.price) || 0,
              comparePrice:
                currencyPrice && currencyPrice.comparePrice
                  ? Number(currencyPrice.comparePrice)
                  : apiProduct.comparePrice
                    ? Number(apiProduct.comparePrice)
                    : undefined,
              sku: apiProduct.sku || "N/A",
              quantity: apiProduct.quantity || 0,
              image: apiProduct.image || apiProduct.images?.[0] || "/placeholder-image.jpg",
              images: apiProduct.images || [apiProduct.image || "/placeholder-image.jpg"],
              category: {
                id: apiProduct.category?.id || "1",
                name: apiProduct.category?.name || "Carpet",
                slug: apiProduct.category?.slug || "carpet",
              },
              averageRating: apiProduct.averageRating || 0,
              reviewCount: apiProduct.reviewCount || 0,
              variants: apiProduct.variants || [],
              brand: apiProduct.brand
                ? {
                    id: apiProduct.brand.id,
                    name: apiProduct.brand.name,
                  }
                : undefined,
              attributes: apiProduct.attributes || [],
              tags: apiProduct.tags || [],
            };
          });

        setData({
          carpets: carpetData.success && carpetData.data?.products 
            ? mapProducts(carpetData.data.products) 
            : [],
          statues: statueData.success && statueData.data?.products 
            ? mapProducts(statueData.data.products) 
            : [],
        });
      } catch (error) {
        console.error("Error fetching build your home products:", error);
        setData({ carpets: [], statues: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  const addToCart = (product: Product, quantity: number = 1) => {
    addToGlobalCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || "",
      },
      quantity,
    );
  };

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.category.slug}/${product.slug}`);
  };

  const products = activeTab === "carpets" ? data.carpets : data.statues;

  if (loading) {
    return (
      <div className="relative -mt-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mb-8 mx-auto"></div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-72 bg-gray-100 rounded-lg">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative -mt-8 pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 font-bricolage">
            Build your home with
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Transform your living space with our curated collection
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab("carpets")}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 font-bricolage ${
                activeTab === "carpets"
                  ? "bg-[#EB6426] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Carpet
            </button>
            <button
              onClick={() => setActiveTab("statues")}
              className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 font-bricolage ${
                activeTab === "statues"
                  ? "bg-[#EB6426] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Statue
            </button>
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {activeTab} products available at the moment.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
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
                      <ProductImageSlider
                        images={product.images}
                        productName={product.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <p className="text-sm text-gray-500">No Image Available</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 font-bricolage">
                        <span className="text-2xl font-bold text-[#EB6426]">
                          $
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(product.price)}
                        </span>
                        {product.comparePrice &&
                          Number(product.comparePrice) > Number(product.price) && (
                            <span className="text-sm text-gray-500 line-through">
                              $
                              {new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(Number(product.comparePrice))}
                            </span>
                          )}
                      </div>
                      {product.comparePrice &&
                        Number(product.comparePrice) > Number(product.price) && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium font-bricolage">
                            {Math.round(
                              ((Number(product.comparePrice) - Number(product.price)) /
                                Number(product.comparePrice)) *
                                100,
                            )}
                            % OFF
                          </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold font-bricolage text-gray-900 mb-2 line-clamp-2 group-hover:text-[#EB6426] transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Add to Cart Button */}
                    <div className="mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        disabled={product.quantity === 0}
                        className="bg-[#EB6426] hover:bg-[#d65a1f] disabled:bg-gray-300 text-white py-2.5 px-16 rounded-full text-lg font-medium transition-colors flex items-center justify-center space-x-2 font-bricolage w-full"
                      >
                        {product.quantity === 0 ? (
                          "Out of Stock"
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
                            className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? "fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
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
}
