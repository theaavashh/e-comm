'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, DollarSign, Package, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { productFilterSchema, ProductFilterData } from '@/schemas/productSchema';

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Array<{ id: string; name: string }>;
}

interface AdvancedProductFilterProps {
  onFilterChange: (filters: ProductFilterData) => void;
  categories: Category[];
  isLoading?: boolean;
}

const AdvancedProductFilter: React.FC<AdvancedProductFilterProps> = ({
  onFilterChange,
  categories,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ProductFilterData>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      search: '',
      categoryId: '',
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isFeatured: undefined,
      isDigital: undefined,
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
  });

  const watchedValues = watch();

  // Apply filters on change
  React.useEffect(() => {
    onFilterChange(watchedValues);
  }, [watchedValues, onFilterChange]);

  const handleReset = () => {
    reset();
    onFilterChange({
      search: '',
      categoryId: '',
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isFeatured: undefined,
      isDigital: undefined,
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const mainCategories = categories.filter(cat => !cat.parentId);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 custom-font">Product Filters</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full custom-font">
              Advanced
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors custom-font"
            >
              Reset
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Controller
                    name="search"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                      />
                    )}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                        disabled={isLoading}
                      >
                        <option value="">All Categories</option>
                        {mainCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                {/* Status Filter */}
                <div>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900 custom-font">Advanced Filters</h4>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 custom-font"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                  {showAdvanced ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Price Range */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center custom-font">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Price Range
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">Min Price</label>
                          <Controller
                            name="priceMin"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">Max Price</label>
                          <Controller
                            name="priceMax"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="999.99"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock Range */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center custom-font">
                        <Package className="w-4 h-4 mr-2" />
                        Stock Range
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">Min Stock</label>
                          <Controller
                            name="stockMin"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">Max Stock</label>
                          <Controller
                            name="stockMax"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                placeholder="999"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Options */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center custom-font">
                        <Star className="w-4 h-4 mr-2" />
                        Product Options
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Controller
                            name="isFeatured"
                            control={control}
                            render={({ field }) => (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={field.value || false}
                                  onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                                  className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 custom-font">Featured Only</span>
                              </label>
                            )}
                          />
                        </div>
                        <div>
                          <Controller
                            name="isDigital"
                            control={control}
                            render={({ field }) => (
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={field.value || false}
                                  onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                                  className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 custom-font">Digital Only</span>
                              </label>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center custom-font">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date Range
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">From Date</label>
                          <Controller
                            name="dateFrom"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">To Date</label>
                          <Controller
                            name="dateTo"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 custom-font">Sort Options</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">Sort By</label>
                          <Controller
                            name="sortBy"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              >
                                <option value="createdAt">Created Date</option>
                                <option value="updatedAt">Updated Date</option>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="stock">Stock</option>
                              </select>
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1 custom-font">Sort Order</label>
                          <Controller
                            name="sortOrder"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                              >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                              </select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedProductFilter;





