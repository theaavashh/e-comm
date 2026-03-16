"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { memo, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  thumbnail?: string;
  category: {
    slug: string;
  };
}

interface OngoingSalesClientProps {
  products: Product[];
}

const OngoingSalesClient = memo(function OngoingSalesClient({
  products,
}: OngoingSalesClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(
    (product: Product, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.thumbnail || "/image.png",
        },
        1,
      );
    },
    [addToCart],
  );

  const handleProductClick = useCallback(
    (product: Product) => {
      router.push(`/products/${product.category.slug}/${product.slug}`);
    },
    [router],
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="relative my-10 py-6  pb-2"
      role="region"
      aria-label="Ongoing Sales"
    >
      <div className="max-w-8xl mx-auto px-1 md:px-16">
        <div className="flex flex-row items-center justify-between mb-5 mx-3">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 font-bricolage mb-2 tracking-tight">
              Shop all Deals
            </h2>
            <p className="text-md md:text-xl text-gray-900 tracking-tight">
              Upto 30% OFF on all products
            </p>
          </div>
          <div>
            <a
              href="/products"
              className="inline-flex items-center underline text-sm md:text-md text-[#EB6426] transition-colors font-inter font-semibold group"
            >
              <span>View More</span>
            </a>
          </div>
        </div>

        <div className="relative">
          <div
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
            id="ongoing-sales-container"
          >
            {products.map((product) => {
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
                  role="article"
                  aria-label={`Sale: ${product.name}`}
                >
                  <div className="relative h-64 bg-white overflow-hidden">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
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

                  <div className="p-4 bg-white font-inter flex flex-col flex-grow">
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

                    <h3 className="text-xl font-inter pt-3 text-gray-900 mb-1 line-clamp-2 transition-colors duration-300 font-bricolage">
                      {product.name}
                    </h3>

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
      </div>
    </div>
  );
});

export default OngoingSalesClient;
