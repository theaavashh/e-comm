"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Package,
  Tag,
  Upload,
  Trash2,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Palette,
  Ruler,
  DollarSign,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

interface Brand {
  id: string;
  name: string;
}

interface VariantOption {
  id: string;
  name: string;
  value: string;
  price?: number; // Variant-specific price
  comparePrice?: number; // Variant-specific compare price
  weight?: number; // Variant-specific weight
  additionalCost?: number;
  stock?: number;
  colorCode?: string; // For color variants
  colorImage?: string; // For color image variants
  // Dimension-specific fields
  height?: number;
  width?: number;
  length?: number;
  dimensionUnit?: string;
}

interface Variant {
  id: string;
  name: string; // e.g., "Color", "Size", "Dimensions"
  options: VariantOption[];
}

interface EnhancedProductFormState {
  name: string;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  description: string;
  tags: string[];
  variants: Variant[];
  currencyPrices: {
    country: string;
    price: number;
    comparePrice?: number;
    minDeliveryDays: number;
    maxDeliveryDays: number;
    isActive: boolean;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  slug?: string;
}

interface EnhancedProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
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
  brands,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<EnhancedProductFormState>({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || "",
    subCategoryId: initialData?.subCategoryId || "",
    brandId: initialData?.brandId || "",
    description: initialData?.description || "",
    tags: initialData?.tags || [],
    variants: initialData?.variants || [],
    currencyPrices: initialData?.currencyPrices || [],
    seoTitle: initialData?.seoTitle || initialData?.name || "",
    seoDescription: initialData?.seoDescription || initialData?.description || "",
    seoKeywords: initialData?.seoKeywords || [],
    slug: initialData?.slug || "",
  });

  const [newTag, setNewTag] = useState("");
  const [newSeoKeyword, setNewSeoKeyword] = useState("");
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>(brands);
  
  // State for managing variants
  const [newVariant, setNewVariant] = useState({
    name: "",
    options: [{ id: Date.now().toString(), name: "", value: "", price: 0, comparePrice: 0, weight: 0, additionalCost: 0, stock: 0, colorCode: "", colorImage: "", height: 0, width: 0, length: 0, dimensionUnit: "cm" }],
  });
  
  const [selectedVariantType, setSelectedVariantType] = useState("custom");

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      sku: initialData?.sku || "",
      categoryId: initialData?.categoryId || "",
      subCategoryId: initialData?.subCategoryId || "",
      brandId: initialData?.brandId || "",
      description: initialData?.description || "",
      tags: initialData?.tags || [],
      variants: initialData?.variants || [],
      currencyPrices: initialData?.currencyPrices || [],
      seoTitle: initialData?.seoTitle || initialData?.name || "",
      seoDescription: initialData?.seoDescription || initialData?.description || "",
      seoKeywords: initialData?.seoKeywords || [],
      slug: initialData?.slug || "",
    });
  }, [initialData]);

  // Filter subcategories based on selected category
  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
  const subCategories = selectedCategory?.children || [];

  // Filter brands based on search
  useEffect(() => {
    if (formData.name) {
      const filtered = brands.filter(brand => 
        brand.name.toLowerCase().includes(formData.name.toLowerCase())
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
  }, [formData.name, brands]);

  const handleInputChange = (field: keyof EnhancedProductFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: keyof EnhancedProductFormState,
    value: string,
    action: "add" | "remove",
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]:
        action === "add"
          ? [...(prev[field] as string[]), value]
          : (prev[field] as string[]).filter(
              (item) => item !== value,
            ),
    }));
  };

  // Variant management functions
  const addVariantOption = (variantIndex: number) => {
    if (variantIndex === -1) {
      // Adding option to the new variant form (not yet added to formData)
      setNewVariant(prev => ({
        ...prev,
        options: [
          ...prev.options,
          { id: Date.now().toString(), name: "", value: "", price: 0, comparePrice: 0, weight: 0, additionalCost: 0, stock: 0, colorCode: "", colorImage: "", height: 0, width: 0, length: 0, dimensionUnit: "cm" }
        ]
      }));
    } else {
      // Adding option to an existing variant in formData
      const updatedVariants = [...formData.variants];
      updatedVariants[variantIndex].options.push({
        id: Date.now().toString(),
        name: "",
        value: "",
        price: 0,
        comparePrice: 0,
        weight: 0,
        additionalCost: 0,
        stock: 0,
        colorCode: "",
        colorImage: "",
        height: 0,
        width: 0,
        length: 0,
        dimensionUnit: "cm",
      });
      handleInputChange("variants", updatedVariants);
    }
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    if (variantIndex === -1) {
      // Removing option from the new variant form
      if (newVariant.options.length > 1) {
        const updatedOptions = [...newVariant.options];
        updatedOptions.splice(optionIndex, 1);
        setNewVariant({...newVariant, options: updatedOptions});
      }
    } else {
      // Removing option from an existing variant in formData
      const updatedVariants = [...formData.variants];
      if (updatedVariants[variantIndex].options.length > 1) {
        updatedVariants[variantIndex].options.splice(optionIndex, 1);
        handleInputChange("variants", updatedVariants);
      }
    }
  };

  const updateVariantOption = (
    variantIndex: number,
    optionIndex: number,
    field: string,
    value: string | number
  ) => {
    if (variantIndex === -1) {
      // Updating option in the new variant form
      const updatedOptions = [...newVariant.options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value,
      };
      setNewVariant({...newVariant, options: updatedOptions});
    } else {
      // Updating option in an existing variant in formData
      const updatedVariants = [...formData.variants];
      updatedVariants[variantIndex].options[optionIndex] = {
        ...updatedVariants[variantIndex].options[optionIndex],
        [field]: value,
      };
      handleInputChange("variants", updatedVariants);
    }
  };

  const updateColorOption = (
    variantIndex: number,
    optionIndex: number,
    colorField: 'colorCode' | 'colorImage',
    value: string
  ) => {
    if (variantIndex === -1) {
      // Updating color option in the new variant form
      const updatedOptions = [...newVariant.options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [colorField]: value,
      };
      setNewVariant({...newVariant, options: updatedOptions});
    } else {
      // Updating color option in an existing variant in formData
      const updatedVariants = [...formData.variants];
      updatedVariants[variantIndex].options[optionIndex] = {
        ...updatedVariants[variantIndex].options[optionIndex],
        [colorField]: value,
      };
      handleInputChange("variants", updatedVariants);
    }
  };

  const addVariant = () => {
    if (newVariant.name.trim() === "") return;
    
    const variantToAdd = {
      id: Date.now().toString(),
      name: newVariant.name,
      options: newVariant.options,
    };
    
    handleInputChange("variants", [...formData.variants, variantToAdd]);
    setNewVariant({
      name: "",
      options: [{ id: Date.now().toString(), name: "", value: "", price: 0, comparePrice: 0, weight: 0, additionalCost: 0, stock: 0, colorCode: "", colorImage: "", height: 0, width: 0, length: 0, dimensionUnit: "cm" }],
    });
  };

  const removeVariant = (variantIndex: number) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(variantIndex, 1);
    handleInputChange("variants", updatedVariants);
  };

  const updateVariantName = (variantIndex: number, name: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[variantIndex].name = name;
    handleInputChange("variants", updatedVariants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "variants", label: "Variants", icon: Palette },
    { id: "seo", label: "SEO", icon: Search },
    { id: "pricing", label: "Multi-Currency Pricing", icon: DollarSign },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Code (SKU) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter SKU"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Detailed product description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) =>
                          handleInputChange("categoryId", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}{" "}
                            {category._count &&
                              `(${category._count.products} products)`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Category
                      </label>
                      <select
                        value={formData.subCategoryId}
                        onChange={(e) =>
                          handleInputChange("subCategoryId", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        disabled={!formData.categoryId}
                      >
                        <option value="">Select Sub-Category</option>
                        {subCategories.map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}{" "}
                            {subcategory._count &&
                              `(${subcategory._count.products} products)`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <select
                        value={formData.brandId}
                        onChange={(e) =>
                          handleInputChange("brandId", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="">Select Brand</option>
                        {filteredBrands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayChange("tags", tag, "remove")
                            }
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newTag.trim()) {
                              handleArrayChange("tags", newTag.trim(), "add");
                              setNewTag("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTag.trim()) {
                            handleArrayChange("tags", newTag.trim(), "add");
                            setNewTag("");
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === "variants" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Create variants for your product such as color, size, or custom options
                    </p>
                    
                    {/* Add New Variant */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Add New Variant Type</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Variant Type Name
                          </label>
                          <input
                            type="text"
                            value={newVariant.name}
                            onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Enter variant type name (e.g., Color, Size, Dimensions)"
                          />
                        </div>
                      </div>
                      
                      {/* Variant Options */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Variant Options
                        </label>
                        {newVariant.options.map((option, optionIndex) => (
                          <div key={option.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                              <input
                                type="text"
                                value={option.name}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].name = e.target.value;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="e.g., Red, Large, 16GB"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={option.value}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].value = e.target.value;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="e.g., #FF0000, 100cm, 16GB RAM"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                step="0.01"
                                value={option.price}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].price = parseFloat(e.target.value) || 0;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Variant price (optional)"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                step="0.01"
                                value={option.comparePrice}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].comparePrice = parseFloat(e.target.value) || 0;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Compare price (optional)"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                step="0.01"
                                value={option.weight}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].weight = parseFloat(e.target.value) || 0;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Weight in kg (optional)"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={option.additionalCost}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].additionalCost = parseFloat(e.target.value) || 0;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Additional cost"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={option.stock}
                                onChange={(e) => {
                                  const updatedOptions = [...newVariant.options];
                                  updatedOptions[optionIndex].stock = parseInt(e.target.value) || 0;
                                  setNewVariant({...newVariant, options: updatedOptions});
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="Stock"
                              />
                            </div>
                            <div className="flex items-center">
                              {newVariant.name.toLowerCase() === 'color' ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={option.colorCode || '#ffffff'}
                                    onChange={(e) => updateColorOption(-1, optionIndex, 'colorCode', e.target.value)}
                                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeVariantOption(-1, optionIndex)}
                                    className="p-2 text-red-600 hover:text-red-800"
                                    disabled={newVariant.options.length <= 1}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeVariantOption(-1, optionIndex)}
                                  className="p-2 text-red-600 hover:text-red-800"
                                  disabled={newVariant.options.length <= 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVariantOption(-1)} // -1 indicates we're adding to new variant
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        onClick={addVariant}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={!newVariant.name.trim()}
                      >
                        <Plus className="w-4 h-4 mr-1 inline" />
                        Add Variant Type
                      </button>
                      {!newVariant.name.trim() && (
                        <p className="text-xs text-gray-500 mt-1">Enter a variant type name to enable this button</p>
                      )}
                    </div>
                    
                    {/* Existing Variants */}
                    {formData.variants.length > 0 ? (
                      <div className="space-y-4">
                        {formData.variants.map((variant: Variant, variantIndex: number) => (
                          <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-md font-medium text-gray-900">
                                {variant.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeVariant(variantIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="mb-3">
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => updateVariantName(variantIndex, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 mb-3"
                                placeholder="Variant type name"
                              />
                            </div>
                            
                            {variant.options.map((option: VariantOption, optionIndex: number) => (
                              <div key={option.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-3">
                                <div className="md:col-span-2">
                                  <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "name", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="e.g., Red, Large, 16GB"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={option.value}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "value", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="e.g., #FF0000, 100cm, 16GB RAM"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={option.price}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "price", parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Variant price (optional)"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={option.comparePrice}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "comparePrice", parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Compare price (optional)"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={option.weight}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "weight", parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Weight in kg (optional)"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    value={option.additionalCost}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "additionalCost", parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Cost"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    value={option.stock}
                                    onChange={(e) => updateVariantOption(variantIndex, optionIndex, "stock", parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Stock"
                                  />
                                  {variant.name.toLowerCase() === 'color' ? (
                                    <div className="flex items-center space-x-2 ml-2">
                                      <input
                                        type="color"
                                        value={option.colorCode || '#ffffff'}
                                        onChange={(e) => updateColorOption(variantIndex, optionIndex, 'colorCode', e.target.value)}
                                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeVariantOption(variantIndex, optionIndex)}
                                        className="p-2 text-red-600 hover:text-red-800"
                                        disabled={variant.options.length <= 1}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeVariantOption(variantIndex, optionIndex)}
                                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                                      disabled={variant.options.length <= 1}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            <button
                              type="button"
                              onClick={() => addVariantOption(variantIndex)}
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Option
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No variants added yet</p>
                        <p className="text-sm">Add variants like color, size, or custom options above</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* SEO Tab */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title *
                    </label>
                    <input
                      type="text"
                      maxLength={60}
                      value={formData.seoTitle}
                      onChange={(e) =>
                        handleInputChange("seoTitle", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="SEO optimized title (max 60 characters)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.seoTitle?.length || 0}/60 characters. Recommended: 50-60
                      characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description *
                    </label>
                    <textarea
                      maxLength={160}
                      rows={3}
                      value={formData.seoDescription}
                      onChange={(e) =>
                        handleInputChange("seoDescription", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="SEO optimized description (max 160 characters)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.seoDescription?.length || 0}/160 characters.
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.seoKeywords.map(
                        (keyword: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() =>
                                handleArrayChange(
                                  "seoKeywords",
                                  keyword,
                                  "remove",
                                )
                              }
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ),
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSeoKeyword}
                        onChange={(e) => setNewSeoKeyword(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter keyword"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newSeoKeyword.trim()) {
                              handleArrayChange(
                                "seoKeywords",
                                newSeoKeyword.trim(),
                                "add",
                              );
                              setNewSeoKeyword("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSeoKeyword.trim()) {
                            handleArrayChange(
                              "seoKeywords",
                              newSeoKeyword.trim(),
                              "add",
                            );
                            setNewSeoKeyword("");
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                      placeholder="product-url-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly version of the product name
                    </p>
                  </div>
                </div>
              )}
              
              {/* Multi-Currency Pricing Tab */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Currency Pricing</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Set different prices for different countries/regions
                    </p>
                    
                    {/* Currency Prices */}
                    <div className="space-y-4">
                      {formData.currencyPrices.map((price, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border border-gray-200 rounded-lg">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              value={price.country}
                              onChange={(e) => {
                                const updatedPrices = [...formData.currencyPrices];
                                updatedPrices[index].country = e.target.value;
                                handleInputChange("currencyPrices", updatedPrices);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="e.g., USA, Australia"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={price.price}
                              onChange={(e) => {
                                const updatedPrices = [...formData.currencyPrices];
                                updatedPrices[index].price = parseFloat(e.target.value) || 0;
                                handleInputChange("currencyPrices", updatedPrices);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="Price"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Compare Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={price.comparePrice || ""}
                              onChange={(e) => {
                                const updatedPrices = [...formData.currencyPrices];
                                updatedPrices[index].comparePrice = e.target.value ? parseFloat(e.target.value) : undefined;
                                handleInputChange("currencyPrices", updatedPrices);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="Compare"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Min Days
                            </label>
                            <input
                              type="number"
                              value={price.minDeliveryDays}
                              onChange={(e) => {
                                const updatedPrices = [...formData.currencyPrices];
                                updatedPrices[index].minDeliveryDays = parseInt(e.target.value) || 1;
                                handleInputChange("currencyPrices", updatedPrices);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="Min days"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Days
                            </label>
                            <input
                              type="number"
                              value={price.maxDeliveryDays}
                              onChange={(e) => {
                                const updatedPrices = [...formData.currencyPrices];
                                updatedPrices[index].maxDeliveryDays = parseInt(e.target.value) || 7;
                                handleInputChange("currencyPrices", updatedPrices);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                              placeholder="Max days"
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={price.isActive}
                                onChange={(e) => {
                                  const updatedPrices = [...formData.currencyPrices];
                                  updatedPrices[index].isActive = e.target.checked;
                                  handleInputChange("currencyPrices", updatedPrices);
                                }}
                                className="sr-only"
                              />
                              <div className={`relative w-11 h-6 rounded-full transition-colors ${price.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${price.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedPrices = formData.currencyPrices.filter((_, i) => i !== index);
                                handleInputChange("currencyPrices", updatedPrices);
                              }}
                              className="ml-2 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const newPrice = {
                          country: "",
                          price: 0,
                          comparePrice: undefined,
                          minDeliveryDays: 1,
                          maxDeliveryDays: 7,
                          isActive: true,
                        };
                        handleInputChange("currencyPrices", [...formData.currencyPrices, newPrice]);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Currency Price
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading
                  ? "Saving..."
                  : initialData
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedProductForm;