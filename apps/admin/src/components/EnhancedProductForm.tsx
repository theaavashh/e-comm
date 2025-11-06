'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Eye, EyeOff, AlertCircle, Link, Search, Hash, Globe, Image as ImageIcon, Target, ExternalLink, FileText, DollarSign, Package, Camera, Truck, Settings, Percent, Calculator, ShoppingCart, Minus, X, Star, Flame, Gift, Sparkles, Award, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';
import { productSchema, ProductFormData } from '@/schemas/productSchema';

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Array<{ 
    id: string; 
    name: string; 
    parentId?: string;
    _count?: { products: number };
  }>;
  _count?: { products: number };
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface EnhancedProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
  categories: Category[];
  brands: Brand[];
}

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  categories,
  brands
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [ogImagePreview, setOgImagePreview] = useState<string>('');
  const [canonicalUrlPreview, setCanonicalUrlPreview] = useState<string>('');
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
    getValues,
    trigger
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
      subCategoryId: '',
      brandId: '',
      tags: [],
      images: [],
      isActive: true,
      stock: 0,
      weight: undefined,
      dimensions: undefined,
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
      currencyPrices: [],
      customFields: [],
      // Shipping fields
      shippingCountry: undefined,
      deliveryCharge: 0,
      minDeliveryDays: 3,
      maxDeliveryDays: 7,
      freeShippingThreshold: 0,
      shippingWeight: 0,
      isFragile: false,
      isHazardous: false,
    }
  });

  // Watch categoryId to clear subCategoryId when category changes
  const watchedCategoryId = watch('categoryId');
  
  useEffect(() => {
    if (watchedCategoryId) {
      // Clear sub-category when main category changes
      setValue('subCategoryId', '');
    }
  }, [watchedCategoryId, setValue]);

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

  const { fields: currencyPriceFields, append: appendCurrencyPrice, remove: removeCurrencyPrice } = useFieldArray({
    control,
    name: 'currencyPrices' as const
  });

  const { fields: customFieldFields, append: appendCustomField, remove: removeCustomField } = useFieldArray({
    control,
    name: 'customFields' as const
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
        setOgImagePreview(initialData.seo?.ogImage || '');
        setCanonicalUrlPreview(initialData.seo?.canonicalUrl || '');
      } else {
        reset();
        setPreviewImages([]);
        setOgImagePreview('');
        setCanonicalUrlPreview('');
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

  // Custom submit handler that only validates essential fields
  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission attempted');
    
    // Convert string values to numbers for validation and remove unsupported fields
    const formData = getValues();
    console.log('Raw form data:', formData);
    
    // Create minimal data with only essential fields
    const processedData = {
      name: formData.name,
      price: formData.price ? Number(formData.price) : 0,
      categoryId: formData.categoryId,
      // Add only fields that have actual values (not empty strings or undefined)
      ...(formData.description && formData.description.trim() && { description: formData.description }),
      ...(formData.shortDescription && formData.shortDescription.trim() && { shortDescription: formData.shortDescription }),
      ...(formData.sku && formData.sku.trim() && { sku: formData.sku }),
      ...(formData.subCategoryId && formData.subCategoryId.trim() && { subCategoryId: formData.subCategoryId }),
      ...(formData.brandId && formData.brandId.trim() && { brandId: formData.brandId }),
      ...(formData.images && formData.images.length > 0 && { images: formData.images }),
      ...(formData.tags && formData.tags.length > 0 && { tags: formData.tags }),
      // Add pricing fields
      ...(formData.comparePrice && formData.comparePrice > 0 && { comparePrice: Number(formData.comparePrice) }),
      ...(formData.costPrice && formData.costPrice > 0 && { costPrice: Number(formData.costPrice) }),
      ...(formData.margin && formData.margin > 0 && { margin: Number(formData.margin) }),
      // Set defaults for required fields
      quantity: formData.stock ? Number(formData.stock) : 0,
      trackQuantity: formData.trackQuantity !== undefined ? formData.trackQuantity : true,
      manageStock: formData.manageStock !== undefined ? formData.manageStock : true,
      allowBackorder: formData.allowBackorder !== undefined ? formData.allowBackorder : false,
      lowStockThreshold: formData.lowStockThreshold ? Number(formData.lowStockThreshold) : 5,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      isDigital: formData.isDigital !== undefined ? formData.isDigital : false,
      isFeatured: formData.isFeatured !== undefined ? formData.isFeatured : false,
      isNew: formData.isNew !== undefined ? formData.isNew : false,
      isOnSale: formData.isOnSale !== undefined ? formData.isOnSale : false,
      isBestSeller: formData.isBestSeller !== undefined ? formData.isBestSeller : false,
      visibility: formData.visibility || 'VISIBLE',
      requiresShipping: formData.requiresShipping !== undefined ? formData.requiresShipping : true,
      freeShipping: formData.freeShipping !== undefined ? formData.freeShipping : false,
      taxable: formData.taxable !== undefined ? formData.taxable : true,
      // Arrays with defaults
      videos: formData.videos || [],
      seoKeywords: formData.seoKeywords || [],
      // Include SEO object if present
      ...(formData.seo && Object.keys(formData.seo).length > 0 && { 
        seo: {
          ...(formData.seo.ogTitle && { ogTitle: formData.seo.ogTitle }),
          ...(formData.seo.ogDescription && { ogDescription: formData.seo.ogDescription }),
          ...(formData.seo.ogImage && { ogImage: formData.seo.ogImage }),
          ...(formData.seo.canonicalUrl && { canonicalUrl: formData.seo.canonicalUrl }),
          ...(formData.seo.focusKeyword && { focusKeyword: formData.seo.focusKeyword }),
        }
      }),
      // Include currencyPrices if present
      ...(formData.currencyPrices && formData.currencyPrices.length > 0 && { 
        currencyPrices: formData.currencyPrices.map((cp: any) => ({
          country: cp.country,
          price: Number(cp.price) || 0,
          ...(cp.comparePrice && Number(cp.comparePrice) > 0 && { comparePrice: Number(cp.comparePrice) }),
          minDeliveryDays: Number(cp.minDeliveryDays) || 1,
          maxDeliveryDays: Number(cp.maxDeliveryDays) || 1,
          isActive: cp.isActive !== undefined ? cp.isActive : true,
        }))
      }),
      ...(formData.customFields && formData.customFields.length > 0 && {
        customFields: formData.customFields.map((f: any) => ({
          key: (f.key || '').trim(),
          label: (f.label || '').trim(),
          content: f.content || '',
          isVisible: f.isVisible !== false,
        })).filter((f: any) => f.key && f.label),
      }),
    };
    
    // Filter out empty strings and convert them to undefined
    const cleanedData = Object.fromEntries(
      Object.entries(processedData)
        .filter(([key, value]) => value !== '') // Remove empty strings entirely
        .map(([key, value]) => [key, value])
    );
    
    console.log('Processed data being sent to API:', cleanedData);
    
    // Update form values with converted numbers
    Object.keys(processedData).forEach(key => {
      if (processedData[key] !== formData[key]) {
        setValue(key, processedData[key]);
      }
    });
    
    // Only validate essential fields
    const essentialFields = ['name', 'price', 'categoryId'];
    const isValid = await trigger(essentialFields);
    
    console.log('Validation result:', isValid);
    console.log('Form errors:', errors);
    console.log('Processed form data:', cleanedData);
    
    if (isValid) {
      console.log('Submitting cleaned form data:', cleanedData);
      await onSubmit(cleanedData as any);
    } else {
      console.log('Validation failed, switching to Basic Info tab');
      // Switch to Basic Info tab if validation fails
      setActiveTab('basic');
    }
  };

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

  const handleOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOgImagePreview(result);
        setValue('seo.ogImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeOgImage = () => {
    setOgImagePreview('');
    setValue('seo.ogImage', '');
  };

  const handleCanonicalUrlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCanonicalUrlPreview(result);
        setValue('seo.canonicalUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCanonicalUrl = () => {
    setCanonicalUrlPreview('');
    setValue('seo.canonicalUrl', '');
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
              <h2 className="text-2xl font-bold text-black custom-font">
                {initialData ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-black mt-1 custom-font">
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
                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors custom-font ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-black bg-blue-50'
                        : 'border-transparent text-black hover:text-black hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleCustomSubmit} className="flex-1 overflow-y-auto">
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
                          <label className="block text-sm font-medium text-black mb-2 custom-font">
                            Product Name *
                          </label>
                          <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                placeholder="Enter product name"
                              />
                            )}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1 custom-font">{String(errors.name.message)}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2 custom-font">
                            SKU *
                          </label>
                          <Controller
                            name="sku"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
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
                        <label className="block text-sm font-medium text-black mb-2 custom-font">
                          Short Description *
                        </label>
                        <Controller
                          name="shortDescription"
                          control={control}
                          render={({ field }) => (
                            <textarea
                              {...field}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                              placeholder="Brief product description"
                            />
                          )}
                        />
                        {errors.shortDescription && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.shortDescription.message)}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2 custom-font">
                          Full Description *
                        </label>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <RichTextEditor
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Detailed product description"
                              height={400}
                              className="rounded-lg border border-gray-300"
                            />
                          )}
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2 custom-font">
                            Category *
                          </label>
                          <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                              >
                                <option value="">Select Category</option>
                                {mainCategories.map(category => (
                                  <optgroup key={category.id} label={category.name}>
                                    <option value={category.id}>
                                      {category.name} {category._count && `(${category._count.products} products)`}
                                    </option>
                                    {category.children?.map((subcategory) => (
                                      <option key={subcategory.id} value={subcategory.id}>
                                        └─ {subcategory.name} {subcategory._count && `(${subcategory._count.products} products)`}
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                            )}
                          />
                          {errors.categoryId && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.categoryId.message)}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Sub-Category
                          </label>
                          <Controller
                            name="subCategoryId"
                            control={control}
                            render={({ field }) => {
                              const selectedCategoryId = watch('categoryId');
                              const subCategories = selectedCategoryId 
                                ? categories.find(cat => cat.id === selectedCategoryId)?.children || []
                                : [];
                              
                              return (
                                <select
                                  {...field}
                                  disabled={!selectedCategoryId}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                  <option value="">
                                    {selectedCategoryId ? 'Select Sub-Category' : 'Select a category first'}
                                  </option>
                                  {subCategories.map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id}>
                                      {subCategory.name} {subCategory._count && `(${subCategory._count.products} products)`}
                                    </option>
                                  ))}
                                </select>
                              );
                            }}
                          />
                          {errors.subCategoryId && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.subCategoryId.message)}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2 custom-font">
                            Brand
                          </label>
                          <Controller
                            name="brandId"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                              >
                                <option value="">Select Brand</option>
                                {brands
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                      {brand.name} {brand.website && `(${brand.website})`}
                                    </option>
                                  ))}
                              </select>
                            )}
                          />
                          {errors.brandId && (
                            <p className="text-red-500 text-sm mt-1">{String(errors.brandId.message)}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
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
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black"
                                    placeholder="Enter tag"
                                  />
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addTag}
                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Plus className="w-5 h-5 mr-1" />
                            Add Tag
                          </button>
                        </div>
                      </div>

                      {/* Custom Sections (moved to Step 1 - Basic Info) */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-black custom-font">Custom Sections</h3>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: '', label: '', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              Add Section
                            </button>
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: 'ingredients', label: 'Ingredients', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              + Ingredients
                            </button>
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: 'disclaimer', label: 'Disclaimer', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              + Disclaimer
                            </button>
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: 'materialsCare', label: 'Materials & Care', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              + Materials & Care
                            </button>
                    </div>
                        </div>

                        {customFieldFields.length === 0 ? (
                          <p className="text-sm text-black custom-font">No custom sections added yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {customFieldFields.map((field, index) => (
                              <div key={field.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium text-black custom-font">Section {index + 1}</h4>
                                  <button type="button" onClick={() => removeCustomField(index)} className="text-red-600 hover:text-red-700 p-1">
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">Key</label>
                                    <Controller
                                      name={`customFields.${index}.key`}
                                      control={control}
                                      render={({ field }) => (
                                        <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-black custom-font" placeholder="e.g., ingredients, disclaimer, materialsCare" />
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">Label</label>
                                    <Controller
                                      name={`customFields.${index}.label`}
                                      control={control}
                                      render={({ field }) => (
                                        <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-black custom-font" placeholder="Display title" />
                                      )}
                                    />
                                  </div>
                                  <div className="flex items-center mt-6">
                                    <Controller
                                      name={`customFields.${index}.isVisible`}
                                      control={control}
                                      render={({ field }) => (
                                        <label className="flex items-center">
                                          <input {...field} type="checkbox" checked={field.value ?? true} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                          <span className="ml-2 text-sm text-black custom-font">Visible</span>
                                        </label>
                                      )}
                                    />
                                  </div>
                                </div>

                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-black mb-1 custom-font">Content</label>
                                  <Controller
                                    name={`customFields.${index}.content`}
                                    control={control}
                                    render={({ field }) => (
                                      <RichTextEditor value={field.value || ''} onChange={field.onChange} placeholder="Enter section content" height={200} className="rounded-lg border border-gray-300" />
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      {/* Multi-Currency Pricing */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="flex items-center text-lg font-medium text-black custom-font">
                              <Globe className="w-6 h-6 mr-2 text-blue-600" />
                              International Pricing
                        </h3>
                            <p className="text-sm text-black mt-1 custom-font">
                              Set different prices and delivery days for different countries
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => appendCurrencyPrice({ 
                              country: '', 
                              price: 0, 
                              comparePrice: 0, 
                              minDeliveryDays: 1,
                              maxDeliveryDays: 1,
                              isActive: true 
                            })}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Plus className="w-5 h-5 mr-1" />
                            Add Country Price
                          </button>
                        </div>
                        
                        {currencyPriceFields.length > 0 ? (
                          <div className="space-y-4">
                            {currencyPriceFields.map((field, index) => (
                              <div key={field.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-sm font-medium text-black custom-font">Country Pricing {index + 1}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeCurrencyPrice(index)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      Country *
                            </label>
                            <Controller
                                      name={`currencyPrices.${index}.country`}
                              control={control}
                              render={({ field }) => (
                                        <select
                                  {...field}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                        >
                                          <option value="">Select Country</option>
                                          <option value="Australia">Australia</option>
                                          <option value="USA">United States</option>
                                          <option value="UK">United Kingdom</option>
                                          <option value="Canada">Canada</option>
                                          <option value="India">India</option>
                                          <option value="China">China</option>
                                          <option value="Japan">Japan</option>
                                          <option value="Singapore">Singapore</option>
                                          <option value="UAE">UAE</option>
                                          <option value="Europe">Europe</option>
                                          <option value="Nepal">Nepal</option>
                                          <option value="Bangladesh">Bangladesh</option>
                                          <option value="Pakistan">Pakistan</option>
                                          <option value="Sri Lanka">Sri Lanka</option>
                                        </select>
                                      )}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      Price *
                                    </label>
                                    <Controller
                                      name={`currencyPrices.${index}.price`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                          value={field.value ?? ''}
                                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>

                          <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      Compare Price
                            </label>
                            <Controller
                                      name={`currencyPrices.${index}.comparePrice`}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                          value={field.value ?? ''}
                                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                  placeholder="0.00"
                                />
                              )}
                            />
                      </div>

                          <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      Min Delivery Days *
                            </label>
                            <Controller
                                      name={`currencyPrices.${index}.minDeliveryDays`}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                          min="1"
                                          value={field.value ?? ''}
                                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="e.g., 3"
                                />
                              )}
                            />
                          </div>

                          <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      Max Delivery Days *
                            </label>
                            <Controller
                                      name={`currencyPrices.${index}.maxDeliveryDays`}
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                          min="1"
                                          value={field.value ?? ''}
                                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="e.g., 7"
                                />
                              )}
                            />
                        </div>
                      </div>

                                <div className="mt-3 flex items-center">
                            <Controller
                                    name={`currencyPrices.${index}.isActive`}
                              control={control}
                              render={({ field }) => (
                                      <label className="flex items-center">
                                <input
                                  {...field}
                                          type="checkbox"
                                          checked={field.value}
                                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-black custom-font">Active country pricing</span>
                                      </label>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-black bg-gray-50 rounded-lg">
                            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm custom-font">No international pricing added yet</p>
                            <p className="text-xs text-black custom-font">Add prices and delivery days for different countries</p>
                          </div>
                        )}
                      </div>

                      {/* Color & Size Variants (for Clothing) */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="flex items-center text-lg font-medium text-black custom-font">
                              <Package className="w-6 h-6 mr-2 text-blue-600" />
                              Color & Size Variants
                            </h3>
                            <p className="text-sm text-black mt-1 custom-font">
                              Add color and size options for clothing products
                            </p>
                          </div>
                          </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Color Variants */}
                          <div>
                            <label className="block text-sm font-medium text-black mb-2 custom-font">
                              Colors *
                            </label>
                            <div className="space-y-2">
                              {variantFields
                                .filter((_, idx) => watch(`variants.${idx}.name`) === 'Color')
                                .map((field, idx) => {
                                  const actualIndex = variantFields.findIndex((f, i) => watch(`variants.${i}.name`) === 'Color' && idx === variantFields.slice(0, i + 1).filter((_, j) => watch(`variants.${j}.name`) === 'Color').length - 1);
                                  if (actualIndex === -1) return null;
                                  return (
                                    <div key={field.id} className="flex items-center gap-2">
                            <Controller
                                        name={`variants.${actualIndex}.value`}
                              control={control}
                                        render={({ field: colorField }) => (
                                <input
                                            {...colorField}
                                            type="text"
                                            placeholder="Color name (e.g., Red, Blue)"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none text-black custom-font"
                                />
                              )}
                            />
                                      <input
                                        type="color"
                                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                        onChange={(e) => {
                                          const colorName = watch(`variants.${actualIndex}.value`) || e.target.value;
                                          setValue(`variants.${actualIndex}.value`, colorName);
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeVariant(actualIndex)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  );
                                })}
                              <button
                                type="button"
                                onClick={() => appendVariant({ 
                                  name: 'Color', 
                                  value: '', 
                                  price: 0, 
                                  comparePrice: 0, 
                                  costPrice: 0, 
                                  sku: '',
                                  weight: 0,
                                  isActive: true 
                                })}
                                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors custom-font"
                              >
                                <Plus className="w-4 h-4 inline mr-1" />
                                Add Color
                              </button>
                            </div>
                          </div>

                          {/* Size Variants */}
                          <div>
                            <label className="block text-sm font-medium text-black mb-2 custom-font">
                              Sizes *
                            </label>
                            <div className="space-y-2">
                              {variantFields
                                .filter((_, idx) => watch(`variants.${idx}.name`) === 'Size')
                                .map((field, idx) => {
                                  const actualIndex = variantFields.findIndex((f, i) => watch(`variants.${i}.name`) === 'Size' && idx === variantFields.slice(0, i + 1).filter((_, j) => watch(`variants.${j}.name`) === 'Size').length - 1);
                                  if (actualIndex === -1) return null;
                                  return (
                                    <div key={field.id} className="flex items-center gap-2">
                                      <Controller
                                        name={`variants.${actualIndex}.value`}
                                        control={control}
                                        render={({ field: sizeField }) => (
                                          <select
                                            {...sizeField}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none text-black custom-font"
                                          >
                                            <option value="">Select Size</option>
                                            <option value="XS">XS - Extra Small</option>
                                            <option value="S">S - Small</option>
                                            <option value="M">M - Medium</option>
                                            <option value="L">L - Large</option>
                                            <option value="XL">XL - Extra Large</option>
                                            <option value="XXL">XXL - Extra Extra Large</option>
                                            <option value="XXXL">XXXL - Extra Extra Extra Large</option>
                                          </select>
                                        )}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeVariant(actualIndex)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  );
                                })}
                              <button
                                type="button"
                                onClick={() => appendVariant({ 
                                  name: 'Size', 
                                  value: '', 
                                  price: 0, 
                                  comparePrice: 0, 
                                  costPrice: 0, 
                                  sku: '',
                                  weight: 0,
                                  isActive: true 
                                })}
                                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors custom-font"
                              >
                                <Plus className="w-4 h-4 inline mr-1" />
                                Add Size
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Color & Size Combinations with Pricing */}
                        {(variantFields.some((_, idx) => watch(`variants.${idx}.name`) === 'Color') && 
                          variantFields.some((_, idx) => watch(`variants.${idx}.name`) === 'Size')) && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-black mb-3 custom-font">
                              Color & Size Combinations
                            </h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="text-sm text-blue-800 custom-font">
                                Price combinations will be created automatically. Each color-size combination can have its own price, SKU, and stock.
                            </p>
                          </div>
                        </div>
                        )}
                      </div>

                      {/* Generic Variant Pricing */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="flex items-center text-lg font-medium text-black custom-font">
                            <Package className="w-6 h-6 mr-2 text-blue-600" />
                            Generic Variant Pricing
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
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                          >
                            <Plus className="w-5 h-5 mr-1" />
                            Add Variant
                          </button>
                        </div>
                        
                        {variantFields.length > 0 ? (
                          <div className="space-y-4">
                            {variantFields.map((field, index) => (
                              <div key={field.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-sm font-medium text-black custom-font">Variant {index + 1}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      Variant Name *
                                    </label>
                                    <Controller
                                      name={`variants.${index}.name`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="e.g., 500gm, 1kg, 2kg"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
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
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
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
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
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
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="0.00"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
                                      SKU
                                    </label>
                                    <Controller
                                      name={`variants.${index}.sku`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                          placeholder="Variant SKU"
                                        />
                                      )}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">
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
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
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
                                        <span className="ml-2 text-sm text-black custom-font">Active variant</span>
                                      </label>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-black">
                            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm custom-font">No variants added yet</p>
                            <p className="text-xs text-black custom-font">Add variants to offer different sizes or quantities</p>
                          </div>
                        )}
                      </div>

                      {/* Order Quantity Limits */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-black mb-4 custom-font">
                          <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
                          Order Quantity Limits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                              <Minus className="w-5 h-5 mr-2 text-blue-600" />
                              Minimum Order Quantity
                            </label>
                            <Controller
                              name="minOrderQuantity"
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                  min="1"
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                  placeholder="1"
                                />
                              )}
                            />
                            {errors.minOrderQuantity && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.minOrderQuantity.message)}</p>
                            )}
                            <p className="text-xs text-black mt-1 custom-font">
                              Minimum quantity customers must order
                            </p>
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                              <Plus className="w-5 h-5 mr-2 text-blue-600" />
                              Maximum Order Quantity
                            </label>
                            <Controller
                              name="maxOrderQuantity"
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                  min="1"
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black placeholder:text-black custom-font"
                                  placeholder="999"
                                />
                              )}
                            />
                            {errors.maxOrderQuantity && (
                              <p className="text-red-500 text-sm mt-1">{String(errors.maxOrderQuantity.message)}</p>
                            )}
                            <p className="text-xs text-black mt-1 custom-font">
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
                          <label className="block text-sm font-medium text-black mb-2 custom-font">
                            Stock Quantity *
                          </label>
                          <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="number"
                                min="0"
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                placeholder="0"
                              />
                            )}
                          />
                          {errors.stock && (
                            <p className="text-red-500 text-sm mt-1 custom-font">{String(errors.stock.message)}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2 custom-font">
                            Weight (kg)
                          </label>
                          <Controller
                            name="weight"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={field.value ?? ''}
                                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
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
                        <h3 className="text-lg font-medium text-black mb-4 custom-font">Dimensions (cm)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2 custom-font">
                              Length
                            </label>
                            <Controller
                              name="dimensions.length"
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-2 custom-font">
                              Width
                            </label>
                            <Controller
                              name="dimensions.width"
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-2 custom-font">
                              Height
                            </label>
                            <Controller
                              name="dimensions.height"
                              control={control}
                              render={({ field }) => (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={field.value ?? ''}
                                  onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
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
                        <label className="block text-sm font-medium text-black mb-2 custom-font">
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
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                              <p className="text-black custom-font">Upload product images</p>
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
                            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors custom-font"
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
                        <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                          <Link className="w-5 h-5 mr-2 text-blue-600" />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                placeholder="product-url-slug"
                              />
                              <p className="text-xs text-black mt-1 custom-font">
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
                        <label className="flex items-center text-sm font-medium text-black mb-2">
                          <Search className="w-5 h-5 mr-2 text-blue-600" />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                placeholder="SEO optimized title"
                              />
                              <p className="text-xs text-black mt-1 custom-font">
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
                        <label className="flex items-center text-sm font-medium text-black mb-2">
                          <Hash className="w-5 h-5 mr-2 text-blue-600" />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                placeholder="SEO optimized description that appears in search results"
                              />
                              <p className="text-xs text-black mt-1 custom-font">
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
                        <label className="flex items-center text-sm font-medium text-black mb-2">
                          <Hash className="w-5 h-5 mr-2 text-blue-600" />
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
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                    placeholder="Enter keyword"
                                  />
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => removeKeyword(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addKeyword}
                            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors custom-font"
                          >
                            <Plus className="w-5 h-5 mr-1" />
                            Add Keyword
                          </button>
                          <p className="text-xs text-black custom-font">
                            Add relevant keywords that describe your product. Maximum 10 keywords recommended.
                          </p>
                        </div>
                      </div>

                      {/* Open Graph Fields */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-black mb-4 custom-font">
                          <Globe className="w-5 h-5 mr-2 text-blue-600" />
                          Open Graph (Social Media)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                              <Search className="w-5 h-5 mr-2 text-blue-600" />
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                  placeholder="Title for social media sharing"
                                />
                              )}
                            />
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                              <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                              OG Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              {ogImagePreview ? (
                                <div className="relative group">
                                  <Image
                                    src={ogImagePreview}
                                    alt="OG Image Preview"
                                    width={300}
                                    height={300}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={removeOgImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-black custom-font text-sm mb-2">Upload OG Image</p>
                                  <p className="text-xs text-black custom-font">Recommended: 1200x630px</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleOgImageUpload}
                                className="hidden"
                                id="og-image-upload"
                              />
                              <label
                                htmlFor="og-image-upload"
                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors custom-font text-sm"
                              >
                                {ogImagePreview ? 'Change Image' : 'Choose Image'}
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                            <Hash className="w-5 h-5 mr-2 text-blue-600" />
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                placeholder="Description for social media sharing"
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional SEO Fields */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-black mb-4 custom-font">
                          <Target className="w-6 h-6 mr-2 text-blue-600" />
                          Additional SEO
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                              <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                              Canonical URL
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              {canonicalUrlPreview ? (
                                <div className="relative group">
                                  <Image
                                    src={canonicalUrlPreview}
                                    alt="Canonical URL Preview"
                                    width={300}
                                    height={300}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={removeCanonicalUrl}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                          </div>
                              ) : (
                                <div className="text-center py-6">
                                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-black custom-font text-sm mb-2">Upload Canonical URL Image</p>
                                  <p className="text-xs text-black custom-font">Recommended: 1200x630px</p>
                    </div>
                  )}
                                <input
                                type="file"
                                accept="image/*"
                                onChange={handleCanonicalUrlUpload}
                                className="hidden"
                                id="canonical-url-upload"
                              />
                              <label
                                htmlFor="canonical-url-upload"
                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors custom-font text-sm"
                              >
                                {canonicalUrlPreview ? 'Change Image' : 'Choose Image'}
                            </label>
                        </div>
                          </div>

                          <div>
                            <label className="flex items-center text-sm font-medium text-black mb-2 custom-font">
                              <Target className="w-5 h-5 mr-2 text-blue-600" />
                              Focus Keyword
                            </label>
                            <Controller
                              name="seo.focusKeyword"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
                                  placeholder="Primary keyword for this product"
                                />
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
                      {/* Custom Sections */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-black custom-font">Custom Sections</h3>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: 'ingredients', label: 'Ingredients', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              Add Ingredients
                            </button>
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: 'disclaimer', label: 'Disclaimer', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              Add Disclaimer
                            </button>
                            <button
                              type="button"
                              onClick={() => appendCustomField({ key: 'materialsCare', label: 'Materials & Care', content: '', isVisible: true })}
                              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors custom-font"
                            >
                              Add Materials & Care
                            </button>
                        </div>
                      </div>

                        {customFieldFields.length === 0 ? (
                          <p className="text-sm text-black custom-font">No custom sections added yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {customFieldFields.map((field, index) => (
                              <div key={field.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium text-black custom-font">Section {index + 1}</h4>
                                  <button type="button" onClick={() => removeCustomField(index)} className="text-red-600 hover:text-red-700 p-1">
                                    <X className="w-5 h-5" />
                                  </button>
                          </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">Key</label>
                            <Controller
                                      name={`customFields.${index}.key`}
                              control={control}
                              render={({ field }) => (
                                        <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-black custom-font" placeholder="ingredients | disclaimer | materialsCare" />
                                      )}
                                    />
                          </div>
                            <div>
                                    <label className="block text-sm font-medium text-black mb-1 custom-font">Label</label>
                              <Controller
                                      name={`customFields.${index}.label`}
                                control={control}
                                render={({ field }) => (
                                        <input {...field} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-black custom-font" placeholder="Display title" />
                                      )}
                                    />
                            </div>
                                  <div className="flex items-center mt-6">
                              <Controller
                                      name={`customFields.${index}.isVisible`}
                                control={control}
                                render={({ field }) => (
                                        <label className="flex items-center">
                                          <input {...field} type="checkbox" checked={field.value ?? true} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                          <span className="ml-2 text-sm text-black custom-font">Visible</span>
                                        </label>
                                      )}
                                    />
                            </div>
                          </div>

                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-black mb-1 custom-font">Content</label>
                            <Controller
                                    name={`customFields.${index}.content`}
                              control={control}
                              render={({ field }) => (
                                      <RichTextEditor value={field.value || ''} onChange={field.onChange} placeholder="Enter section content" height={200} className="rounded-lg border border-gray-300" />
                              )}
                            />
                          </div>
                        </div>
                            ))}
                    </div>
                  )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2 custom-font">
                          Status *
                        </label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black custom-font"
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
                          <h3 className="text-lg font-medium text-black custom-font">Product Options</h3>
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
                                  <span className="text-sm text-black custom-font">Active</span>
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
                                  <span className="text-sm text-black custom-font">Featured</span>
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
                                  <span className="text-sm text-black custom-font">Digital Product</span>
                                </label>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-black custom-font">Inventory Options</h3>
                          <div className="space-y-3">
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
                                  <span className="text-sm text-black custom-font">Track Quantity</span>
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
                                  <span className="text-sm text-black custom-font">Allow Backorder</span>
                                </label>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Promotional Flags */}
                      <div className="border-t pt-6">
                        <h3 className="flex items-center text-lg font-medium text-black mb-4">
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
                              <label className="flex items-center ml-3 text-sm font-medium text-black custom-font">
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
                              <label className="flex items-center ml-3 text-sm font-medium text-black custom-font">
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
                              <label className="flex items-center ml-3 text-sm font-medium text-black custom-font">
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
                              <label className="flex items-center ml-3 text-sm font-medium text-black custom-font">
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
                              <label className="flex items-center ml-3 text-sm font-medium text-black custom-font">
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
                              <label className="flex items-center ml-3 text-sm font-medium text-black custom-font">
                                <Star className="w-4 h-4 mr-2 text-blue-500" />
                                Featured Product
                              </label>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-black mt-3 custom-font">
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
                  className="flex items-center text-sm text-black hover:text-black"
                >
                  {showAdvanced ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center text-sm text-black hover:text-black"
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
                    className="px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors flex items-center custom-font"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                )}
                {activeTab !== 'advanced' && (
                  <button
                    type="button"
                    onClick={handleNextTab}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center custom-font"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
                {/* Create/Update Product button - available on all tabs */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center custom-font"
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
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedProductForm;

