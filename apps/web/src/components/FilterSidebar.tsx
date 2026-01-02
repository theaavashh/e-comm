'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSidebarProps {
  categories: { [key: string]: string };
  brands: string[];
  selectedCategory: string;
  selectedBrands: string[];
  priceRange: [number, number];
  minRating: number;
  onCategoryChange: (category: string) => void;
  onBrandToggle: (brand: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
  className?: string;
}

export default function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  selectedBrands,
  priceRange,
  minRating,
  onCategoryChange,
  onBrandToggle,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
  className = ''
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceRangeChange = (newMax: number) => {
    onPriceRangeChange([priceRange[0], newMax]);
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      {children}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-[#F0F2F5]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block lg:w-64 flex-shrink-0 ${className}`}>
        <div className="bg-[#F0F2F5] rounded-xl p-6 sticky top-6">
          <FilterContent />
        </div>
      </div>
    </>
  );

  function FilterContent() {
    return (
      <>
        {/* Header removed as requested (no Filters title or Clear All) */}

        {/* Category Filter */}
        <FilterSection title="Category">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="all"
                checked={selectedCategory === 'all'}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-black">All Categories</span>
            </label>
            {Object.entries(categories).map(([key, label]) => (
              <label key={key} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={key}
                  checked={selectedCategory === key}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-black">{label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
              className="w-full [&::-webkit-slider-thumb]:bg-[#EB6426] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-track]:bg-gray-200 [&::-webkit-slider-track]:rounded-full [&::-moz-range-thumb]:bg-[#EB6426] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:rounded-full"
            />
            <div className="flex justify-between text-sm text-black">
              <span className="text-black">$ {priceRange[0].toLocaleString()}</span>
              <span className="text-black">$ {priceRange[1].toLocaleString()}</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="10000"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 10000])}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black"
                placeholder="Max"
              />
            </div>
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                  className="mr-2"
                />
                <span className="text-sm text-black">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection title="Minimum Rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={minRating === rating}
                  onChange={(e) => onRatingChange(parseInt(e.target.value))}
                  className="mr-2"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Active Filters */}
        {(selectedBrands.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
          <FilterSection title="Active Filters">
            <div className="space-y-2">
              {selectedBrands.map(brand => (
                <div key={brand} className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                  <span className="text-sm text-blue-800">{brand}</span>
                  <button
                    onClick={() => onBrandToggle(brand)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {minRating > 0 && (
                <div className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                  <span className="text-sm text-blue-800">{minRating}+ stars</span>
                  <button
                    onClick={() => onRatingChange(0)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <div className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                  <span className="text-sm text-black">
                    ${priceRange[0]} - $ {priceRange[1]}
                  </span>
                  <button
                    onClick={() => onPriceRangeChange([0, 10000])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </FilterSection>
        )}
      </>
    );
  }
}
