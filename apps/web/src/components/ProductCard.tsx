'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: number | string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  inStock: boolean;
  brand: string;
  tags: string[];
  sku: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export default function ProductCard({
  product,
  viewMode,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  className = ''
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use global cart context
  const { addToCart: addToGlobalCart } = useCart();

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product);
  };

  const handleAddToCart = () => {
    // Add to global cart context
    addToGlobalCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image
    }, 1);
    
    // Call the original onAddToCart callback if provided
    onAddToCart?.(product);
  };

  const handleQuickView = () => {
    onQuickView?.(product);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative w-56 h-56 flex-shrink-0">
          <div className="absolute top-2 left-2 bg-[#EB6426] backdrop-blur text-white text-xs px-2 py-1 rounded-full shadow">
            {product.discount}% OFF
          </div>
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-[#F0F2F5]/90 backdrop-blur text-gray-700 hover:bg-[#F0F2F5]'
            } ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <Link href={`/product/${product.id}`}>
            <div className="w-full h-full flex items-center justify-center cursor-pointer group overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>
          </Link>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-5">
          <div className="space-y-3">
          
            
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-[#EB6426] font-extrabold text-xl">${product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-gray-400 line-through text-sm">${product.comparePrice.toLocaleString()}</span>
              )}
            </div>


              <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-black text-lg leading-snug line-clamp-2  transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-[#EB6426] disabled:bg-gray-400 text-white px-5 py-3 rounded-full text-md font-medium transition-colors flex items-center justify-center mt-2"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.reviewCount || 0})</span>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            
           
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative w-full h-64 flex-shrink-0">
        <div className="absolute top-2 left-2 bg-[#EB6426] backdrop-blur text-white text-xs px-2 py-1 rounded-full shadow">
          {product.discount}% OFF
        </div>
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-[#F0F2F5]/90 backdrop-blur text-gray-700 hover:bg-[#F0F2F5]'
          } ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        <Link href={`/product/${product.id}`}>
          <div className="w-full h-full bg-gray-50 flex items-center justify-center cursor-pointer group overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          </div>
        </Link>
      </div>


       
      
      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">

           <div className="flex items-center space-x-2 mt-3 font-extrabold" >
            <span className="text-[#EB6426]  text-xl">$ {product.price.toLocaleString()}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-black line-through text-md font-medium">$ {product.comparePrice.toLocaleString()}</span>
            )}
          </div>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-black text-lg leading-snug line-clamp-2 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          
         
          
        

           <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-[#EB6426] disabled:bg-gray-400 text-white px-3 py-2 mt-5 rounded-full text-lg font-medium transition-colors flex items-center justify-center w-full mt-2"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            <span>Add to Cart</span>
          </button>
          
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">({product.reviewCount || 0})</span>
          </div>
        </div>
        
      

      </div>
    </motion.div>
  );
}
