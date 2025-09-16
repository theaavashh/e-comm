'use client';

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Edit,
  Trash2,
  Package,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MoreVertical,
  Copy,
  Archive,
  ArchiveRestore,
  Heart,
  Share2
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string;
  categoryId: string;
  tags: string[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
  stock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  isDigital?: boolean;
}

interface EnhancedProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Product['status']) => void;
  onDuplicate?: (product: Product) => void;
  onToggleFeatured?: (id: string) => void;
  onView?: (product: Product) => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = memo(({
  product,
  index,
  onEdit,
  onDelete,
  onStatusChange,
  onDuplicate,
  onToggleFeatured,
  onView
}) => {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'draft': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'archived': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50';
    if (stock < 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.images.length > 0 && !imageError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 border ${getStatusColor(product.status)}`}>
            {getStatusIcon(product.status)}
            <span className="capitalize">{product.status}</span>
          </span>
        </div>

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          </div>
        )}

        {/* Digital Badge */}
        {product.isDigital && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              Digital
            </span>
          </div>
        )}

        {/* Action Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showActions && (
              <motion.div
                className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {onView && (
                  <button
                    onClick={() => onView(product)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                )}
                <button
                  onClick={() => onEdit(product)}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                {onDuplicate && (
                  <button
                    onClick={() => onDuplicate(product)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </button>
                )}
                {onToggleFeatured && (
                  <button
                    onClick={() => onToggleFeatured(product.id)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {product.isFeatured ? 'Remove Featured' : 'Mark Featured'}
                  </button>
                )}
                <button
                  onClick={() => onStatusChange(product.id, product.status === 'archived' ? 'active' : 'archived')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  {product.status === 'archived' ? <ArchiveRestore className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
                  {product.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <Package className="w-4 h-4 mr-2 text-gray-400" />
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(product.stock)}`}>
              {product.stock} in stock
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            <span>{product.rating.toFixed(1)} ({product.reviews})</span>
          </div>
        </div>

        {/* Category and SKU */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Category:</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {product.category}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">SKU:</span>
            <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
              {product.sku}
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>Created {formatDate(product.createdAt)}</span>
          <span>Updated {formatDate(product.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
});

EnhancedProductCard.displayName = 'EnhancedProductCard';

export default EnhancedProductCard;
