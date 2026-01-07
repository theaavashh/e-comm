"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  averageRating: number;
  reviewCount: number;
  shortDescription?: string;
  tags?: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

const NonVegAchar: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchNonVegAcharProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/products?categories=foods&limit=20`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (data.success && data.data.products) {
          // Filter for non-veg achar products (you can adjust this filter based on your data structure)
          const nonVegAcharProducts = data.data.products.filter(
            (product: Product) =>
              product.name.toLowerCase().includes("non-veg") ||
              product.name.toLowerCase().includes("meat") ||
              product.name.toLowerCase().includes("chicken") ||
              product.name.toLowerCase().includes("fish") ||
              product.tags?.some((tag: string) =>
                tag.toLowerCase().includes("non-veg"),
              ),
          );
          setProducts(nonVegAcharProducts);
        }
      } catch (error) {
        console.error("Error fetching non-veg achar products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNonVegAcharProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600 text-lg">
              Loading Non-Veg Achar products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 custom-font">
            Non-Veg Achar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our premium collection of non-vegetarian pickles made with
            quality meats and traditional spices
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Non-Veg Achar Available
            </h3>
            <p className="text-gray-600">
              We're working on adding more delicious non-veg achar products.
              Check back soon!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#F0F2F5] rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative h-64">
                  <Image
                    src={
                      product.image ||
                      product.images?.[0] ||
                      "/api/placeholder/300/200"
                    }
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/300/200";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-[#F0F2F5] rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <button className="absolute top-4 left-4 bg-[#F0F2F5] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-xs text-red-600 font-medium mb-2">
                    {product.category.name}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        NPR {product.price.toLocaleString()}
                      </span>
                      {product.comparePrice &&
                        product.comparePrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            NPR {product.comparePrice.toLocaleString()}
                          </span>
                        )}
                    </div>
                    {product.comparePrice &&
                      product.comparePrice > product.price && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          {Math.round(
                            ((product.comparePrice - product.price) /
                              product.comparePrice) *
                              100,
                          )}
                          % off
                        </span>
                      )}
                  </div>
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#F0F2F5] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 bg-[#F0F2F5] rounded-full p-2 shadow-lg z-10"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative h-64">
                    <Image
                      src={
                        selectedProduct.image ||
                        selectedProduct.images?.[0] ||
                        "/api/placeholder/600/300"
                      }
                      alt={selectedProduct.name}
                      fill
                      className="object-contain rounded-t-xl"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-red-600 font-medium mb-2">
                      {selectedProduct.category.name}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {selectedProduct.shortDescription}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-bold text-gray-900">
                          NPR {selectedProduct.price.toLocaleString()}
                        </span>
                        {selectedProduct.comparePrice &&
                          selectedProduct.comparePrice >
                            selectedProduct.price && (
                            <span className="text-lg text-gray-400 line-through">
                              NPR{" "}
                              {selectedProduct.comparePrice.toLocaleString()}
                            </span>
                          )}
                      </div>
                      {selectedProduct.comparePrice &&
                        selectedProduct.comparePrice >
                          selectedProduct.price && (
                          <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                            {Math.round(
                              ((selectedProduct.comparePrice -
                                selectedProduct.price) /
                                selectedProduct.comparePrice) *
                                100,
                            )}
                            % off
                          </span>
                        )}
                    </div>
                    <button className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-lg">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NonVegAchar;
