'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Archive,
  ArchiveRestore,
  Star,
  StarOff,
  Edit,
  Copy,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react';

interface BulkOperationsProps {
  selectedProducts: string[];
  onBulkDelete: (ids: string[]) => void;
  onBulkStatusChange: (ids: string[], isActive: boolean) => void;
  onBulkFeaturedToggle: (ids: string[]) => void;
  onClearSelection: () => void;
  totalProducts: number;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedProducts,
  onBulkDelete,
  onBulkStatusChange,
  onBulkFeaturedToggle,
  onClearSelection,
  totalProducts
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        setShowConfirmDialog('delete');
        break;
      case 'archive':
        onBulkStatusChange(selectedProducts, false);
        break;
      case 'unarchive':
        onBulkStatusChange(selectedProducts, true);
        break;
      case 'featured':
        onBulkFeaturedToggle(selectedProducts);
        break;
      default:
        break;
    }
  };

  const confirmAction = () => {
    if (showConfirmDialog === 'delete') {
      onBulkDelete(selectedProducts);
    }
    setShowConfirmDialog(null);
  };

  if (selectedProducts.length === 0) return null;

  return (
    <>
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              {selectedProducts.length} of {totalProducts} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('delete')}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>

            <button
              onClick={() => handleBulkAction('archive')}
              className="flex items-center px-3 py-1.5 text-sm text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-md transition-colors"
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </button>

            <button
              onClick={() => handleBulkAction('unarchive')}
              className="flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
            >
              <ArchiveRestore className="w-4 h-4 mr-1" />
              Unarchive
            </button>

            <button
              onClick={() => handleBulkAction('featured')}
              className="flex items-center px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
            >
              <Star className="w-4 h-4 mr-1" />
              Toggle Featured
            </button>

            <button
              onClick={onClearSelection}
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirm Action
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {showConfirmDialog === 'delete' && (
                    <>
                      Are you sure you want to delete <strong>{selectedProducts.length}</strong> products? 
                      This action cannot be undone.
                    </>
                  )}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                    showConfirmDialog === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {showConfirmDialog === 'delete' ? 'Delete' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulkOperations;
