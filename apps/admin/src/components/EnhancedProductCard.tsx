"use client";

import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
  Share2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string | { id: string; name: string; slug: string };
  categoryId: string;
  tags: string[];
  images: string[];
  isActive: boolean;
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
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isDigital?: boolean;
}

interface EnhancedProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: boolean) => void;
  onDuplicate?: (product: Product) => void;
  onToggleFeatured?: (id: string) => void;
  onView?: (product: Product) => void;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = memo(
  ({
    product,
    index,
    onEdit,
    onDelete,
    onStatusChange,
    onDuplicate,
    onToggleFeatured,
    onView,
  }) => {
    const [showActions, setShowActions] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getStatusColor = (isActive: boolean) => {
      return isActive
        ? "text-green-600 bg-green-50 border-green-200"
        : "text-gray-600 bg-gray-50 border-gray-200";
    };

    const getStatusIcon = (isActive: boolean) => {
      return isActive ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Archive className="w-4 h-4" />
      );
    };

    const getStockColor = (stock: number) => {
      if (stock === 0) return "text-red-600 bg-red-50";
      if (stock < 10) return "text-yellow-600 bg-yellow-50";
      return "text-green-600 bg-green-50";
    };

    const formatPrice = (price: number) => {
      return `NPR ${price.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return (
      <motion.tr
        className="bg-white hover:bg-gray-50 border-b border-gray-200 transition-all duration-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        whileHover={{ backgroundColor: "#f9fafb" }}
      >
        {/* Product Image */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.images.length > 0 && !imageError ? (
                (() => {
                  const imageUrl = product.images[0];
                  const isValidImageUrl =
                    imageUrl &&
                    (imageUrl.startsWith("data:") ||
                      imageUrl.startsWith("https://res.cloudinary.com") ||
                      imageUrl.startsWith("https://images.unsplash.com") ||
                      imageUrl.startsWith("https://via.placeholder.com") ||
                      imageUrl.startsWith("https://example.com"));

                  return isValidImageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm">{product.name}</span>
              <span className="text-xs text-gray-500 font-mono">{product.sku}</span>
            </div>
          </div>
        </td>

        {/* Product Details */}
        <td className="px-4 py-3">
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {typeof product.category === "string" ? (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {product.category}
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {product.category.name}
                </span>
              )}
              {product.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{product.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded inline-block">
                  {Math.round(
                    ((product.comparePrice - product.price) / product.comparePrice) * 100
                  )}% OFF
                </span>
              </>
            )}
          </div>
        </td>

        {/* Stock */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(product.stock)}`}
            >
              {product.stock}
            </span>
          </div>
        </td>

        {/* Rating */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-900">
              {(product.rating || 0).toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviews || 0})
            </span>
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 border ${getStatusColor(product.isActive)}`}
            >
              {getStatusIcon(product.isActive)}
              <span className="capitalize">
                {product.isActive ? "active" : "inactive"}
              </span>
            </span>
            {product.isFeatured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            {product.isDigital && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Digital
              </span>
            )}
          </div>
        </td>

        {/* Date Created */}
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
          {formatDate(product.createdAt)}
        </td>

        {/* Actions */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
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
                    {product.isFeatured ? "Remove Featured" : "Mark Featured"}
                  </button>
                )}
                <button
                  onClick={() => onStatusChange(product.id, !product.isActive)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  {product.isActive ? (
                    <Archive className="w-4 h-4 mr-2" />
                  ) : (
                    <ArchiveRestore className="w-4 h-4 mr-2" />
                  )}
                  {product.isActive ? "Deactivate" : "Activate"}
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
        </td>
      </motion.tr>
    );
  }
);

EnhancedProductCard.displayName = "EnhancedProductCard";

export default EnhancedProductCard;