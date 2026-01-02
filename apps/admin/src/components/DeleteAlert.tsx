"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2, Package } from "lucide-react";

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productName?: string;
  productImage?: string;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function DeleteAlert({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productImage,
  isLoading = false,
  title = "Delete Product",
  message,
}: DeleteAlertProps) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  const defaultMessage = productName
    ? `Are you sure you want to delete "${productName}"? This action cannot be undone and will permanently remove the product from your inventory.`
    : "Are you sure you want to delete this product? This action cannot be undone and will permanently remove the product from your inventory.";

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
            onClick={isLoading ? undefined : onClose}
          />

          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                    <p className="text-sm text-red-600">
                      This action is permanent
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Product Preview */}
                {productName && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Product to be deleted
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning Message */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {message || defaultMessage}
                  </p>
                </div>

                {/* Warning Details */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Important Notice
                      </p>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        <li>• Product data will be permanently deleted</li>
                        <li>• Product images will be removed</li>
                        <li>• This action cannot be undone</li>
                        <li>• Associated data may be affected</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <motion.button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center px-4 py-3 text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Product
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
