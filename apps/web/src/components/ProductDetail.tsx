'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Share2, 
  ArrowLeft, 
  Minus, 
  Plus,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  inStock: boolean;
  brand: string;
  tags: string[];
  sku: string;
  specifications: {
    [key: string]: string;
  };
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ProductDetailProps {
  productId: string;
  category: string;
}

export default function ProductDetail({ productId, category }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct({
        id: productId,
        name: "Traditional Handicraft Wooden Bowl Set",
        category: category,
        subcategory: "Wooden",
        price: 2500,
        originalPrice: 3200,
        discount: 22,
        rating: 4.8,
        reviewCount: 124,
        images: [
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1506905925346-14b1e0dba749?w=600&h=600&fit=crop&crop=center"
        ],
        description: "Beautiful handcrafted wooden bowl set made by skilled Nepali artisans. Each piece is carefully carved from premium teak wood and finished with natural oils. Perfect for serving traditional Nepali dishes or as decorative pieces in your home. The set includes three different sizes to accommodate various serving needs.",
        inStock: true,
        brand: "Nepal Handicrafts",
        tags: ["handmade", "traditional", "wooden", "artisan"],
        sku: "NH-WB-001",
        specifications: {
          "Material": "Premium Teak Wood",
          "Dimensions": "Small: 15cm, Medium: 20cm, Large: 25cm",
          "Finish": "Natural Oil Finish",
          "Care Instructions": "Hand wash only, dry immediately",
          "Origin": "Nepal",
          "Weight": "2.5 kg"
        }
      });

      setReviews([
        {
          id: "1",
          userName: "Priya Sharma",
          rating: 5,
          comment: "Absolutely beautiful craftsmanship! The bowls are exactly as described and the quality is outstanding. Perfect for our traditional meals.",
          date: "2024-01-15",
          verified: true
        },
        {
          id: "2",
          userName: "Rajesh Kumar",
          rating: 4,
          comment: "Great product, very well made. The wood finish is smooth and the bowls are sturdy. Would definitely recommend!",
          date: "2024-01-10",
          verified: true
        },
        {
          id: "3",
          userName: "Anita Gurung",
          rating: 5,
          comment: "Love these bowls! They add such a traditional touch to our dining table. The craftsmanship is amazing.",
          date: "2024-01-08",
          verified: false
        }
      ]);

      setRelatedProducts([
        {
          id: "2",
          name: "Brass Puja Thali Set",
          category: "puja-samagri",
          subcategory: "Hindu",
          price: 1800,
          originalPrice: 2500,
          discount: 28,
          rating: 4.6,
          reviewCount: 89,
          images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center"],
          description: "Traditional brass puja thali set",
          inStock: true,
          brand: "Sacred Crafts",
          tags: ["brass", "puja", "traditional"],
          sku: "SC-PT-002",
          specifications: {}
        },
        {
          id: "3",
          name: "Handwoven Pashmina Shawl",
          category: "handicrafts",
          subcategory: "Pashmina",
          price: 8500,
          originalPrice: 12000,
          discount: 29,
          rating: 4.9,
          reviewCount: 156,
          images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=center"],
          description: "Premium handwoven pashmina shawl",
          inStock: true,
          brand: "Himalayan Crafts",
          tags: ["pashmina", "handwoven", "premium"],
          sku: "HC-PS-003",
          specifications: {}
        },
        {
          id: "4",
          name: "Traditional Singing Bowl",
          category: "gift-souvenir",
          subcategory: "Metal",
          price: 3200,
          originalPrice: 4500,
          discount: 29,
          rating: 4.7,
          reviewCount: 203,
          images: ["https://images.unsplash.com/photo-1506905925346-14b1e0dba749?w=300&h=300&fit=crop&crop=center"],
          description: "Authentic Tibetan singing bowl",
          inStock: true,
          brand: "Spiritual Sounds",
          tags: ["singing bowl", "meditation", "tibetan"],
          sku: "SS-SB-004",
          specifications: {}
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [productId, category]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', { product, quantity });
  };

  const handleBuyNow = () => {
    // Redirect to checkout page with product details
    const checkoutUrl = `/checkout?productId=${product.id}&quantity=${quantity}`;
    router.push(checkoutUrl);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div 
            className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg group cursor-zoom-in relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              }}
            />
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                  selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Name */}
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-green-600">
                NPR {product.price.toLocaleString()}
              </span>
              <span className="text-xl text-gray-400 line-through">
                NPR {product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                {product.discount}% OFF
              </span>
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{key}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">In Stock - Ready to ship</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Free delivery on orders above NPR 2,000</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">1 year warranty included</span>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">7 days return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        
        {/* Review Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on {product.reviewCount} reviews</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(reviews.filter(r => r.rating === rating).length / reviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {reviews.filter(r => r.rating === rating).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{review.userName}</h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <motion.div
              key={relatedProduct.id}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/products/${relatedProduct.category}/${relatedProduct.id}`)}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={relatedProduct.images[0]}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-600 font-bold">
                    NPR {relatedProduct.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    NPR {relatedProduct.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(relatedProduct.rating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({relatedProduct.reviewCount})</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
