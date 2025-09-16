'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Eye, EyeOff, AlertCircle, Link, Search, Hash, Globe, Image as ImageIcon, Target, ExternalLink, FileText, DollarSign, Package, Camera, Truck, Settings, Percent, Calculator, ShoppingCart, Minus, X, Star, Flame, Gift, Sparkles, Award, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { productSchema, ProductFormData } from '@/schemas/productSchema';

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Array<{ id: string; name: string }>;
}

interface EnhancedProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
  categories: Category[];
}

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  categories
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 0,
      comparePrice: undefined,
      costPrice: undefined,
      discountPrice: undefined,
      discountPercentage: undefined,
      margin: undefined,
      minOrderQuantity: undefined,
      maxOrderQuantity: undefined,
      sku: '',
      categoryId: '',
      brand: '',
      tags: [],
      images: [],
      status: 'draft',
      stock: 0,
      weight: undefined,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
      },
      seo: {
        title: '',
        description: '',
        keywords: [],
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        canonicalUrl: '',
        focusKeyword: '',
      },
      isActive: true,
      isFeatured: false,
      isDigital: false,
      requiresShipping: true,
      trackQuantity: true,
      allowBackorder: false,
      minQuantity: undefined,
      maxQuantity: undefined,
      isTodaysBestDeal: false,
      isOnSale: false,
      isFestivalOffer: false,
      isNewLaunch: false,
      isBestSeller: false,
      variants: [],
      // Shipping fields
      shippingCountry: '',
      deliveryCharge: 0,
      minDeliveryDays: 3,
      maxDeliveryDays: 7,
      freeShippingThreshold: 0,
      shippingWeight: 0,
      isFragile: false,
      isHazardous: false,
    }
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags' as const
  });

  const { fields: keywordFields, append: appendKeyword, remove: removeKeyword } = useFieldArray({
    control,
    name: 'seo.keywords' as const
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants' as const
  });

  const watchedImages = watch('images') || [];
  const watchedTags = watch('tags') || [];
  const watchedKeywords = watch('seo.keywords') || [];

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
        setPreviewImages(initialData.images || []);
      } else {
        reset();
        setPreviewImages([]);
      }
    }
  }, [isOpen, initialData, reset]);

  // Auto-generate slug from name
  const watchedName = watch('name');
  useEffect(() => {
    if (watchedName && !initialData) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchedName, setValue, initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: string[] = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newImages.push(result);
        if (newImages.length === files.length) {
          const currentImages = getValues('images');
          setValue('images', [...currentImages, ...newImages]);
          setPreviewImages([...currentImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const currentImages = getValues('images');
    const newImages = currentImages.filter((_: any, i: any) => i !== index);
    setValue('images', newImages);
    setPreviewImages(newImages);
  };

  const addTag = () => {
    appendTag('');
  };

  const addKeyword = () => {
    appendKeyword('');
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  const mainCategories = useMemo(() => 
    categories.filter((cat: any) => !cat.parentId), 
    [categories]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {initialData ? 'Update product information' : 'Create a new product for your store'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                          </label>
                          <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter product name"
                              />
                            )}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SKU *
                          </label>
                          <Controller
                            name="sku"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter SKU"
                              />
                            )}
                          />
                          {errors.sku && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.sku.message)}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description *
                        </label>
                        <Controller
                          name="shortDescription"
                          control={control}
                          render={({ field }) => (
                            <textarea
                              {...field}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="Brief product description"
                            />
                          )}
                        />
                        {errors.shortDescription && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.shortDescription.message)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Description *
                        </label>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <textarea
                              {...field}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="Detailed product description"
                            />
                          )}
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              >
                                <option value="">Select Category</option>
                                {mainCategories.map(category => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                          {errors.categoryId && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.categoryId.message)}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand
                          </label>
                          <Controller
                            name="brand"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter brand name"
                              />
                            )}
                          />
                          {errors.brand && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.brand.message)}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="space-y-2">
                          {tagFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                              <Controller
                                name={`tags.${index}`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                    placeholder="Enter tag"
                                  />
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addTag}
                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Tag
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      {/* Basic Pricing */}
                      <div>
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                          Basic Pricing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                              Selling Price (NPR) *
                            </label>
                            <Controller
                              name="price"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.price && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.price.message)}</p>
                            )}
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                              Compare Price (NPR)
                            </label>
                            <Controller
                              name="comparePrice"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.comparePrice && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.comparePrice.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Original price before discount (for showing strikethrough)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cost & Margin */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                          Cost & Margin
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                              Cost Price (NPR)
                            </label>
                            <Controller
                              name="costPrice"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.costPrice && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.costPrice.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Your cost to acquire/manufacture this product
                            </p>
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Percent className="w-4 h-4 mr-2 text-blue-600" />
                              Margin (NPR)
                            </label>
                            <Controller
                              name="margin"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.margin && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.margin.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Profit margin (selling price - cost price)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Discount Pricing */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Percent className="w-5 h-5 mr-2 text-blue-600" />
                          Discount Pricing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                              Discount Price (NPR)
                            </label>
                            <Controller
                              name="discountPrice"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.discountPrice && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.discountPrice.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Special discounted price for promotions
                            </p>
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Percent className="w-4 h-4 mr-2 text-blue-600" />
                              Discount Percentage (%)
                            </label>
                            <Controller
                              name="discountPercentage"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.discountPercentage && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.discountPercentage.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Discount percentage (0-100%)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Variant Pricing */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="flex items-center text-lg font-medium text-gray-900">
                            <Package className="w-5 h-5 mr-2 text-blue-600" />
                            Variant Pricing
                          </h3>
                          <button
                            type="button"
                            onClick={() => appendVariant({ 
                              name: '', 
                              price: 0, 
                              comparePrice: 0, 
                              costPrice: 0, 
                              sku: '',
                              weight: 0,
                              isActive: true 
                            })}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Variant
                          </button>
                        </div>
                        
                        {variantFields.length > 0 ? (
                          <div className="space-y-4">
                            {variantFields.map((field, index) => (
                              <div key={field.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-sm font-medium text-gray-700">Variant {index + 1}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Variant Name *
                                    </label>
                                    <Controller
                                      name={`variants.${index}.name`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                          placeholder="e.g., 500gm, 1kg, 2kg"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Price (NPR) *
                                    </label>
                                    <Controller
                                      name={`variants.${index}.price`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Compare Price (NPR)
                                    </label>
                                    <Controller
                                      name={`variants.${index}.comparePrice`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Cost Price (NPR)
                                    </label>
                                    <Controller
                                      name={`variants.${index}.costPrice`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      SKU
                                    </label>
                                    <Controller
                                      name={`variants.${index}.sku`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                          placeholder="Variant SKU"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Weight (kg)
                                    </label>
                                    <Controller
                                      name={`variants.${index}.weight`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex items-center">
                                  <Controller
                                    name={`variants.${index}.isActive`}
                                    control={control}
                                    render={({ field }) => (
                                      <label className="flex items-center">
                                        <input
                                          {...field}
                                          type="checkbox"
                                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active variant</span>
                                      </label>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No variants added yet</p>
                            <p className="text-xs text-gray-400">Add variants to offer different sizes or quantities</p>
                          </div>
                        )}
                      </div>

                      {/* Order Quantity Limits */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                          Order Quantity Limits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Minus className="w-4 h-4 mr-2 text-blue-600" />
                              Minimum Order Quantity
                            </label>
                            <Controller
                              name="minOrderQuantity"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  min="1"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="1"
                                />
                              )}
                            />
                            {errors.minOrderQuantity && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.minOrderQuantity.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum quantity customers must order
                            </p>
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Plus className="w-4 h-4 mr-2 text-blue-600" />
                              Maximum Order Quantity
                            </label>
                            <Controller
                              name="maxOrderQuantity"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  min="1"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="999"
                                />
                              )}
                            />
                            {errors.maxOrderQuantity && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.maxOrderQuantity.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Maximum quantity customers can order
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Inventory Tab */}
                  {activeTab === 'inventory' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity *
                          </label>
                          <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="0"
                              />
                            )}
                          />
                          {errors.stock && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.stock.message)}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (kg)
                          </label>
                          <Controller
                            name="weight"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="0.00"
                              />
                            )}
                          />
                          {errors.weight && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.weight.message)}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensions (cm)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Length
                            </label>
                            <Controller
                              name="dimensions.length"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Width
                            </label>
                            <Controller
                              name="dimensions.width"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Height
                            </label>
                            <Controller
                              name="dimensions.height"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Tab */}
                  {activeTab === 'media' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Images *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {previewImages.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {previewImages.map((image, index) => (
                                <div key={index} className="relative group">
                                  <Image
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                              <p className="text-gray-500">Upload product images</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                          >
                            Choose Images
                          </label>
                        </div>
                        {errors.images && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.images.message)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SEO Tab */}
                  {activeTab === 'seo' && (
                    <div className="space-y-6">
                      {/* Slug Field */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Link className="w-4 h-4 mr-2 text-blue-600" />
                          URL Slug *
                        </label>
                        <Controller
                          name="slug"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <input
                                {...field}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="product-url-slug"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                URL-friendly version of the product name. Only lowercase letters, numbers, and hyphens allowed.
                              </p>
                            </div>
                          )}
                        />
                        {errors.slug && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.slug.message)}</p>
                        )}
                      </div>

                      {/* SEO Title */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Search className="w-4 h-4 mr-2 text-blue-600" />
                          SEO Title
                        </label>
                        <Controller
                          name="seo.title"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <input
                                {...field}
                                type="text"
                                maxLength={60}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="SEO optimized title"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {field.value?.length || 0}/60 characters. Recommended: 50-60 characters for optimal search results display.
                              </p>
                            </div>
                          )}
                        />
                        {(errors.seo as any)?.title && (
                          <p className="text-red-500 text-sm mt-1">{String((errors.seo as any)?.title?.message)}</p>
                        )}
                      </div>

                      {/* SEO Description */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Hash className="w-4 h-4 mr-2 text-blue-600" />
                          Meta Description
                        </label>
                        <Controller
                          name="seo.description"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <textarea
                                {...field}
                                rows={3}
                                maxLength={160}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="SEO optimized description that appears in search results"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {field.value?.length || 0}/160 characters. Recommended: 150-160 characters for optimal search results display.
                              </p>
                            </div>
                          )}
                        />
                        {(errors.seo as any)?.description && (
                          <p className="text-red-500 text-sm mt-1">{String((errors.seo as any)?.description?.message)}</p>
                        )}
                      </div>

                      {/* SEO Keywords */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Hash className="w-4 h-4 mr-2 text-blue-600" />
                          Meta Keywords
                        </label>
                        <div className="space-y-2">
                          {keywordFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                              <Controller
                                name={`seo.keywords.${index}`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                    placeholder="Enter keyword"
                                  />
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => removeKeyword(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addKeyword}
                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Keyword
                          </button>
                          <p className="text-xs text-gray-500">
                            Add relevant keywords that describe your product. Maximum 10 keywords recommended.
                          </p>
                        </div>
                      </div>

                      {/* Open Graph Fields */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Globe className="w-5 h-5 mr-2 text-blue-600" />
                          Open Graph (Social Media)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Search className="w-4 h-4 mr-2 text-blue-600" />
                              OG Title
                            </label>
                            <Controller
                              name="seo.ogTitle"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  maxLength={60}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="Title for social media sharing"
                                />
                              )}
                            />
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <ImageIcon className="w-4 h-4 mr-2 text-blue-600" />
                              OG Image URL
                            </label>
                            <Controller
                              name="seo.ogImage"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="url"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="https://example.com/image.jpg"
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Hash className="w-4 h-4 mr-2 text-blue-600" />
                            OG Description
                          </label>
                          <Controller
                            name="seo.ogDescription"
                            control={control}
                            render={({ field }) => (
                              <textarea
                                {...field}
                                rows={2}
                                maxLength={160}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Description for social media sharing"
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional SEO Fields */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Target className="w-5 h-5 mr-2 text-blue-600" />
                          Additional SEO
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                              Canonical URL
                            </label>
                            <Controller
                              name="seo.canonicalUrl"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="url"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="https://example.com/product-page"
                                />
                              )}
                            />
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <Target className="w-4 h-4 mr-2 text-blue-600" />
                              Focus Keyword
                            </label>
                            <Controller
                              name="seo.focusKeyword"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="Primary keyword for this product"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Tab */}
                  {activeTab === 'shipping' && (
                    <div className="space-y-6">
                      {/* Shipping Information */}
                      <div>
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Truck className="w-5 h-5 mr-2 text-blue-600" />
                          Shipping Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country *
                            </label>
                            <Controller
                              name="shippingCountry"
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                >
                                  <option value="">Select Country</option>
                                  <option value="Nepal">Nepal</option>
                                  <option value="India">India</option>
                                  <option value="Bangladesh">Bangladesh</option>
                                  <option value="Pakistan">Pakistan</option>
                                  <option value="Sri Lanka">Sri Lanka</option>
                                  <option value="Bhutan">Bhutan</option>
                                  <option value="Maldives">Maldives</option>
                                  <option value="Afghanistan">Afghanistan</option>
                                  <option value="China">China</option>
                                  <option value="USA">USA</option>
                                  <option value="UK">UK</option>
                                  <option value="Canada">Canada</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="France">France</option>
                                  <option value="Japan">Japan</option>
                                  <option value="South Korea">South Korea</option>
                                  <option value="Singapore">Singapore</option>
                                  <option value="Thailand">Thailand</option>
                                  <option value="Malaysia">Malaysia</option>
                                  <option value="Indonesia">Indonesia</option>
                                  <option value="Philippines">Philippines</option>
                                  <option value="Vietnam">Vietnam</option>
                                  <option value="Other">Other</option>
                                </select>
                              )}
                            />
                            {errors.shippingCountry && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.shippingCountry.message)}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Delivery Charge (NPR) *
                            </label>
                            <Controller
                              name="deliveryCharge"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              )}
                            />
                            {errors.deliveryCharge && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.deliveryCharge.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Shipping cost for this product
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Time */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Clock className="w-5 h-5 mr-2 text-blue-600" />
                          Delivery Time
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Minimum Delivery Days *
                            </label>
                            <Controller
                              name="minDeliveryDays"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  min="1"
                                  max="30"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="3"
                                />
                              )}
                            />
                            {errors.minDeliveryDays && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.minDeliveryDays.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum days for delivery
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Delivery Days *
                            </label>
                            <Controller
                              name="maxDeliveryDays"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  min="1"
                                  max="30"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="7"
                                />
                              )}
                            />
                            {errors.maxDeliveryDays && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.maxDeliveryDays.message)}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Maximum days for delivery
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-blue-800">
                                Delivery Time Display: 
                                <span className="ml-2 text-blue-600">
                                  {watch('minDeliveryDays') || 3} - {watch('maxDeliveryDays') || 7} days
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Options */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Package className="w-5 h-5 mr-2 text-blue-600" />
                          Shipping Options
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Free Shipping Threshold (NPR)
                              </label>
                              <Controller
                                name="freeShippingThreshold"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                    placeholder="0.00"
                                  />
                                )}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Minimum order amount for free shipping
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight (kg)
                              </label>
                              <Controller
                                name="shippingWeight"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                    placeholder="0.00"
                                  />
                                )}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Product weight for shipping calculation
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Controller
                              name="requiresShipping"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Requires Shipping</span>
                                </label>
                              )}
                            />
                            <Controller
                              name="isFragile"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Fragile Item (Handle with Care)</span>
                                </label>
                              )}
                            />
                            <Controller
                              name="isHazardous"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Hazardous Material</span>
                                </label>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status and Advanced Options */}
                  {activeTab === 'advanced' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status *
                        </label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="archived">Archived</option>
                            </select>
                          )}
                        />
                        {errors.status && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.status.message)}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Product Options</h3>
                          <div className="space-y-3">
                            <Controller
                              name="isActive"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Active</span>
                                </label>
                              )}
                            />
                            <Controller
                              name="isFeatured"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Featured</span>
                                </label>
                              )}
                            />
                            <Controller
                              name="isDigital"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Digital Product</span>
                                </label>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Shipping Options</h3>
                          <div className="space-y-3">
                            <Controller
                              name="requiresShipping"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Requires Shipping</span>
                                </label>
                              )}
                            />
                            <Controller
                              name="trackQuantity"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Track Quantity</span>
                                </label>
                              )}
                            />
                            <Controller
                              name="allowBackorder"
                              control={control}
                              render={({ field }) => (
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Allow Backorder</span>
                                </label>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Promotional Flags */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                          <Star className="w-5 h-5 mr-2 text-blue-600" />
                          Promotional Flags
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Controller
                                name="isTodaysBestDeal"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                )}
                              />
                              <label className="flex items-center ml-3 text-sm font-medium text-gray-700">
                                <Flame className="w-4 h-4 mr-2 text-orange-500" />
                                Today's Best Deal
                              </label>
                            </div>

                            <div className="flex items-center">
                              <Controller
                                name="isOnSale"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                )}
                              />
                              <label className="flex items-center ml-3 text-sm font-medium text-gray-700">
                                <Percent className="w-4 h-4 mr-2 text-red-500" />
                                On Sale
                              </label>
                            </div>

                            <div className="flex items-center">
                              <Controller
                                name="isFestivalOffer"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                )}
                              />
                              <label className="flex items-center ml-3 text-sm font-medium text-gray-700">
                                <Gift className="w-4 h-4 mr-2 text-purple-500" />
                                Festival Offer
                              </label>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center">
                              <Controller
                                name="isNewLaunch"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                )}
                              />
                              <label className="flex items-center ml-3 text-sm font-medium text-gray-700">
                                <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                                New Launch
                              </label>
                            </div>

                            <div className="flex items-center">
                              <Controller
                                name="isBestSeller"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                )}
                              />
                              <label className="flex items-center ml-3 text-sm font-medium text-gray-700">
                                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                                Best Seller
                              </label>
                            </div>

                            <div className="flex items-center">
                              <Controller
                                name="isFeatured"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                )}
                              />
                              <label className="flex items-center ml-3 text-sm font-medium text-gray-700">
                                <Star className="w-4 h-4 mr-2 text-blue-500" />
                                Featured Product
                              </label>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Select appropriate promotional flags to highlight your product in different sections of the store.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  {showAdvanced ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4 mr-1" />
                  Close
                </button>
              </div>
              <div className="flex space-x-3">
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={handlePreviousTab}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                )}
                {activeTab !== 'advanced' && activeTab !== 'shipping' && (
                  <button
                    type="button"
                    onClick={handleNextTab}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
                {activeTab === 'shipping' && (
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                  >
                    {isSubmitting || isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {initialData ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      initialData ? 'Update Product' : 'Create Product'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedProductForm;

