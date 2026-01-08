"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Truck } from "lucide-react";
import ScratchOffBanner from "@/components/ScratchOffBanner";
import { useCart } from "@/contexts/CartContext";

export default function OngoingSales() {
  const [ongoingSalesProducts, setOngoingSalesProducts] = useState<any[]>([]);
  const [ongoingSalesLoading, setOngoingSalesLoading] = useState(true);
  const router = useRouter();

  // Use global cart context
  const { addToCart: addToGlobalCart } = useCart();

  useEffect(() => {
    // Fetch ongoing sales products from API
    const fetchOngoingSales = async () => {
      try {
        setOngoingSalesLoading(true);
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4444";
        const response = await fetch(
          `${API_BASE_URL}/api/v1/products?limit=4&isActive=true&isOnSale=true`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.products) {
            setOngoingSalesProducts(data.data.products);
          }
        }
      } catch (error) {
        console.error("Failed to fetch ongoing sales products:", error);
      } finally {
        setOngoingSalesLoading(false);
      }
    };

    fetchOngoingSales();
  }, []);

  // Function to add product to cart
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToGlobalCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.thumbnail || "/image.png",
      },
      1,
    );
  };

  // Function to navigate to product detail page
  const handleProductClick = (product: any) => {
    router.push(`/products/${product.category.slug}/${product.slug}`);
  };

  // Don't render component if no products and not loading
  if (!ongoingSalesLoading && ongoingSalesProducts.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 px-1 md:px-16">
      <div className="max-w-8xl mx-auto pl-3 pr-3">
        <div className="flex flex-row items-center justify-between mb-5 mx-3">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 font-bricolage mb-2">
              Shop all Deals
            </h2>
            <p className="text-md md:text-xl text-gray-900">
              Upto 30% OFF on all products
            </p>
          </div>
          <div>
            <Link
              href="/products"
              className="inline-flex items-center underline text-sm md:text-md text-[#EB6426] transition-colors font-inter font-semibold group"
            >
              <span>View More</span>
            </Link>
          </div>
        </div>

        {ongoingSalesLoading ? (
          <div className="relative">
            <div
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
              id="ongoing-sales-container"
            >
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 bg-white shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Left Arrow */}
            <button
              className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hidden md:flex items-center justify-center z-10 border border-gray-200"
              onClick={() => {
                const container = document.getElementById(
                  "ongoing-sales-container",
                );
                if (container) {
                  container.scrollBy({ left: -200, behavior: "smooth" });
                }
              }}
              aria-label="Scroll Left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {/* Right Arrow */}
            <button
              className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hidden md:flex items-center justify-center z-10 border border-gray-200"
              onClick={() => {
                const container = document.getElementById(
                  "ongoing-sales-container",
                );
                if (container) {
                  container.scrollBy({ left: 200, behavior: "smooth" });
                }
              }}
              aria-label="Scroll Right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ) : ongoingSalesProducts.length > 0 ? (
          <div className="relative">
            <div
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
              id="ongoing-sales-container"
            >
              {/* Sales Product Cards */}
              {ongoingSalesProducts.map((product) => {
                const price = parseFloat(product.price?.toString() || "0");
                const comparePrice = product.comparePrice
                  ? parseFloat(product.comparePrice.toString())
                  : null;
                const discount =
                  comparePrice && comparePrice > price
                    ? Math.round(((comparePrice - price) / comparePrice) * 100)
                    : 0;
                const productImage =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : product.thumbnail || "/image.png";

                return (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-72 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Image Container */}
                    <div className="relative h-64 bg-white overflow-hidden">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/image.png";
                        }}
                      />
                      {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-[#EB6426] text-white px-2 py-1 rounded-full text-xs font-bold">
                          Save {discount}%
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ShoppingCart className="h-4 w-4 text-[#EB6426]" />
                      </div>
                    </div>

                    {/* Content - Price and Product Info */}
                    <div className="p-4 bg-white font-inter flex flex-col flex-grow">
                      {/* Free Delivery Tag */}

                      {/* Price and Save */}
                      <div className="mt-1 pt-1">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-extrabold text-[#EB6426] font-bricolage">
                            Now $
                            {new Intl.NumberFormat("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(price)}
                          </span>
                          {comparePrice && comparePrice > price && (
                            <span className="text-base text-black line-through ml-2 ">
                              $
                              {new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-xl font-inter pt-3 text-gray-900 mb-1 line-clamp-2  transition-colors duration-300 font-bricolage">
                        {product.name}
                      </h3>

                      {/* Add to Cart Button - Rounded */}
                      <div className="mt-3 ">
                        <button
                          className="w-full bg-[#EB6426] hover:bg-[#d65a1f] text-white py-2.5 px-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg font-bricolage"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                      <div className="flex justify-center mb-1 mt-3">
                        <Truck className="h-3.5 w-3.5 text-[#EB6426] mr-1" />
                        <span className="text-xs font-medium text-[#EB6426] font-bricolage">
                          WorldWide Free Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Left Arrow */}
            <button
              className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hidden md:flex items-center justify-center z-10 border border-gray-200"
              onClick={() => {
                const container = document.getElementById(
                  "ongoing-sales-container",
                );
                if (container) {
                  container.scrollBy({ left: -200, behavior: "smooth" });
                }
              }}
              aria-label="Scroll Left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {/* Right Arrow */}
            <button
              className="absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hidden md:flex items-center justify-center z-10 border border-gray-200"
              onClick={() => {
                const container = document.getElementById(
                  "ongoing-sales-container",
                );
                if (container) {
                  container.scrollBy({ left: 200, behavior: "smooth" });
                }
              }}
              aria-label="Scroll Right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
