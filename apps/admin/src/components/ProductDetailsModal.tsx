"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Package,
  DollarSign,
  Tag,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Weight,
  Ruler,
  Truck,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Globe,
  Hash,
  Image as ImageIcon,
  FileText,
  Search,
  ExternalLink,
} from "lucide-react";
import DeleteAlert from "./DeleteAlert";

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
  brandId?: string;
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
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  visibility?: string;
  requiresShipping?: boolean;
  freeShipping?: boolean;
  taxable?: boolean;
  videos?: string[];
  seoKeywords?: string[];
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
  onDelete?: (
    productId: string,
    productName?: string,
    productImage?: string,
  ) => void;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDeleteClick = () => {
    if (onDelete && product) {
      onDelete(
        product.id,
        product.name,
        product.images && product.images.length > 0
          ? product.images[0]
          : undefined,
      );
    }
  };

  if (!product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <AlertCircle className="w-4 h-4" />
    );
  };

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : (product.category as any)?.name || "Uncategorized";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      SKU: {product.sku || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Action Buttons */}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(product)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  {/* Left Column - Images and Basic Info */}
                  <div className="space-y-6">
                    {/* Product Images */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Product Images
                      </h3>

                      {product.images && product.images.length > 0 ? (
                        <div className="space-y-4">
                          {/* Main Image */}
                          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={product.images[activeImageIndex]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Thumbnail Images */}
                          {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                              {product.images.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveImageIndex(index)}
                                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                    index === activeImageIndex
                                      ? "border-purple-500"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <Image
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No images available</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Basic Information
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Status
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.isActive)}`}
                          >
                            {getStatusIcon(product.isActive)}
                            <span className="ml-1">
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Category
                          </span>
                          <span className="text-sm text-gray-900">
                            {categoryName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Stock
                          </span>
                          <span className="text-sm text-gray-900">
                            {product.stock || 0} units
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Weight
                          </span>
                          <span className="text-sm text-gray-900">
                            {product.weight || 0} lbs
                          </span>
                        </div>

                        {product.dimensions && (
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">
                              Dimensions
                            </span>
                            <span className="text-sm text-gray-900">
                              {product.dimensions.length}" ×{" "}
                              {product.dimensions.width}" ×{" "}
                              {product.dimensions.height}"
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    {/* Pricing */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Pricing
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Price
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {formatCurrency(Number(product.price) || 0)}
                          </span>
                        </div>

                        {product.comparePrice &&
                          Number(product.comparePrice) > 0 && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">
                                Compare Price
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(Number(product.comparePrice))}
                              </span>
                            </div>
                          )}

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Taxable
                          </span>
                          <span className="text-sm text-gray-900">
                            {product.taxable ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Features
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`flex items-center p-3 rounded-lg ${product.isFeatured ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <Award
                            className={`w-4 h-4 mr-2 ${product.isFeatured ? "text-yellow-600" : "text-gray-400"}`}
                          />
                          <span
                            className={`text-sm font-medium ${product.isFeatured ? "text-yellow-800" : "text-gray-600"}`}
                          >
                            Featured
                          </span>
                        </div>

                        <div
                          className={`flex items-center p-3 rounded-lg ${product.isDigital ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <Globe
                            className={`w-4 h-4 mr-2 ${product.isDigital ? "text-blue-600" : "text-gray-400"}`}
                          />
                          <span
                            className={`text-sm font-medium ${product.isDigital ? "text-blue-800" : "text-gray-600"}`}
                          >
                            Digital
                          </span>
                        </div>

                        <div
                          className={`flex items-center p-3 rounded-lg ${product.isNew ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <Star
                            className={`w-4 h-4 mr-2 ${product.isNew ? "text-green-600" : "text-gray-400"}`}
                          />
                          <span
                            className={`text-sm font-medium ${product.isNew ? "text-green-800" : "text-gray-600"}`}
                          >
                            New
                          </span>
                        </div>

                        <div
                          className={`flex items-center p-3 rounded-lg ${product.isOnSale ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <TrendingUp
                            className={`w-4 h-4 mr-2 ${product.isOnSale ? "text-red-600" : "text-gray-400"}`}
                          />
                          <span
                            className={`text-sm font-medium ${product.isOnSale ? "text-red-800" : "text-gray-600"}`}
                          >
                            On Sale
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Logistics */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Shipping & Logistics
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Requires Shipping
                          </span>
                          <span className="text-sm text-gray-900">
                            {product.requiresShipping ? "Yes" : "No"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Free Shipping
                          </span>
                          <span className="text-sm text-gray-900">
                            {product.freeShipping ? "Yes" : "No"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Visibility
                          </span>
                          <span className="text-sm text-gray-900">
                            {product.visibility || "Visible"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SEO Information */}
                    {product.seo && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Search className="w-5 h-5 mr-2" />
                          SEO Information
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-1">
                              SEO Title
                            </span>
                            <p className="text-sm text-gray-900">
                              {product.seo.title || "Not set"}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-1">
                              SEO Description
                            </span>
                            <p className="text-sm text-gray-900">
                              {product.seo.description || "Not set"}
                            </p>
                          </div>

                          {product.seo.keywords &&
                            product.seo.keywords.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-gray-600 block mb-1">
                                  Keywords
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {product.seo.keywords.map(
                                    (keyword, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                      >
                                        {keyword}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Timestamps
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Created
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatDate(product.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">
                            Last Updated
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatDate(product.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                {(product.description || product.shortDescription) && (
                  <div className="px-6 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Description
                    </h3>

                    <div className="space-y-4">
                      {product.shortDescription && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Short Description
                          </h4>
                          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                            {product.shortDescription}
                          </p>
                        </div>
                      )}

                      {product.description && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Full Description
                          </h4>
                          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg prose prose-sm max-w-none">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: product.description,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
