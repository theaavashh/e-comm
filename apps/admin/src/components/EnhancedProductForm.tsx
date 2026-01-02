"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  DollarSign,
  Package,
  Tag,
  Upload,
  Trash2,
  Edit,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Info,
  Weight,
  Ruler,
  Camera,
  Video,
  Search,
  Globe,
  Truck,
  Receipt,
  Settings,
  Star,
  Eye,
  EyeOff,
  Calendar,
  Hash,
  Barcode,
  QrCode,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Zap,
  Shield,
  TruckIcon,
  Percent,
  Minus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import RichTextEditor from "./RichTextEditor";

interface PricingTier {
  id?: string;
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  discount?: number;
}

interface CurrencyPrice {
  id?: string;
  country: string;
  currency: string;
  symbol: string;
  price: number;
  comparePrice?: number;
  isActive?: boolean;
}

interface ProductAttribute {
  id?: string;
  name: string;
  value: string;
  type:
    | "TEXT"
    | "NUMBER"
    | "BOOLEAN"
    | "COLOR"
    | "IMAGE"
    | "SELECT"
    | "MULTI_SELECT";
  isRequired: boolean;
  isFilterable: boolean;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

interface ProductFormData {
  // Product Identity
  name: string;
  productCode: string;
  categoryId: string;
  subCategoryId: string;
  brand: string;
  tags: string[];
  isVariant: boolean;

  // Basic Information
  description: string;
  shortDescription: string;
  disclaimer: string;
  ingredients: string;
  additionalDetails: string;
  materialCare: string;
  showIngredients: boolean;
  showDisclaimer: boolean;
  showAdditionalDetails: boolean;
  showMaterialCare: boolean;

  // Product Identification
  sku: string;
  barcode: string;
  upc: string;
  ean: string;
  isbn: string;

  // Inventory
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  manageStock: boolean;

  // Physical Properties
  weight: number;
  weightUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  // Media
  images: string[];
  videos: string[];
  thumbnail: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  metaTags: any;

  // Status
  isActive: boolean;
  isDigital: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
  isSales: boolean;
  isNewSeller: boolean;
  isFestivalOffer: boolean;
  visibility: string;
  publishedAt: string;

  // Shipping
  requiresShipping: boolean;
  shippingClass: string;
  freeShipping: boolean;

  // Tax
  taxable: boolean;
  taxClass: string;

  // Additional
  customFields: any;
  notes: string;

  // Variant attributes
  variantAttributes: string[];
}

interface CompleteProductData extends ProductFormData {
  pricingTiers?: PricingTier[];
  currencyPrices?: CurrencyPrice[];
  attributes?: ProductAttribute[];
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: CompleteProductData;
  isLoading?: boolean;
  categories?: Category[];
  brands?: any[];
}

export default function EnhancedProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  categories = [],
  brands = [],
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState("identity");
  const [formData, setFormData] = useState({
    // Product Identity
    name: initialData?.name || "",
    productCode: initialData?.productCode || "",
    categoryId: initialData?.categoryId || "",
    subCategoryId: initialData?.subCategoryId || "",
    brand: initialData?.brand || "",
    tags: initialData?.tags || [],
    isVariant: initialData?.isVariant ?? false,

    // Basic Information
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    disclaimer: initialData?.disclaimer || "",
    ingredients: initialData?.ingredients || "",
    additionalDetails: initialData?.additionalDetails || "",
    materialCare: initialData?.materialCare || "",
    showIngredients: initialData?.showIngredients ?? false,
    showDisclaimer: initialData?.showDisclaimer ?? false,
    showAdditionalDetails: initialData?.showAdditionalDetails ?? false,
    showMaterialCare: initialData?.showMaterialCare ?? false,

    // Product Identification
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    upc: initialData?.upc || "",
    ean: initialData?.ean || "",
    isbn: initialData?.isbn || "",

    // Inventory
    trackQuantity: initialData?.trackQuantity ?? true,
    quantity: initialData?.quantity || 0,
    lowStockThreshold: initialData?.lowStockThreshold || 5,
    allowBackorder: initialData?.allowBackorder ?? false,
    manageStock: initialData?.manageStock ?? true,

    // Physical Properties
    weight: initialData?.weight || 0,
    weightUnit: initialData?.weightUnit || "kg",
    dimensions: initialData?.dimensions || {
      length: 0,
      width: 0,
      height: 0,
      unit: "cm",
    },

    // Media
    images: initialData?.images || [],
    videos: initialData?.videos || [],
    thumbnail: initialData?.thumbnail || "",

    // SEO
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    seoKeywords: initialData?.seoKeywords || [],
    metaTags: initialData?.metaTags || {},

    // Status
    isActive: initialData?.isActive ?? true,
    isDigital: initialData?.isDigital ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    isNew: initialData?.isNew ?? false,
    isOnSale: initialData?.isOnSale ?? false,
    isBestSeller: initialData?.isBestSeller ?? false,
    isSales: initialData?.isSales ?? false,
    isNewSeller: initialData?.isNewSeller ?? false,
    isFestivalOffer: initialData?.isFestivalOffer ?? false,
    visibility: initialData?.visibility || "VISIBLE",
    publishedAt: initialData?.publishedAt || "",
   

    // Shipping
    requiresShipping: initialData?.requiresShipping ?? true,
    shippingClass: initialData?.shippingClass || "",
    freeShipping: initialData?.freeShipping ?? false,

    // Tax
    taxable: initialData?.taxable ?? true,
    taxClass: initialData?.taxClass || "",

    // Additional
    customFields: initialData?.customFields || {},
    notes: initialData?.notes || "",
    
    // Variant attributes
    variantAttributes: initialData?.variantAttributes || [],
  });

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(
    initialData?.pricingTiers || [],
  );
  const [currencyPrices, setCurrencyPrices] = useState<CurrencyPrice[]>(
    initialData?.currencyPrices || [],
  );
  const [attributes, setAttributes] = useState<ProductAttribute[]>(
    initialData?.attributes || [],
  );
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newPricingTier, setNewPricingTier] = useState<PricingTier>({
    minQuantity: 1,
    price: 0,
  });
  const [newCurrencyPrice, setNewCurrencyPrice] = useState<CurrencyPrice>({
    country: "",
    currency: "USD",
    symbol: "$",
    price: 0,
    comparePrice: 0,
    isActive: true,
  });
  const [newAttribute, setNewAttribute] = useState<ProductAttribute>({
    name: "",
    value: "",
    type: "TEXT",
    isRequired: false,
    isFilterable: true,
    sortOrder: 0,
  });

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const tabs = [
    { id: "identity", label: "Product Identity", icon: Package },
    { id: "details", label: "Product Details", icon: FileText },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    ...(formData.isVariant ? [{ id: "variants", label: "Variants", icon: Package }] : []),
    { id: "media", label: "Media", icon: Camera },
    { id: "seo", label: "SEO", icon: Search },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: string,
    value: string,
    action: "add" | "remove",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        action === "add"
          ? [...(prev[field as keyof typeof prev] as string[]), value]
          : (prev[field as keyof typeof prev] as string[]).filter(
              (item) => item !== value,
            ),
    }));
  };

  const addPricingTier = () => {
    if (newPricingTier.minQuantity && newPricingTier.price) {
      setPricingTiers((prev) => [
        ...prev,
        { ...newPricingTier, id: Date.now().toString() },
      ]);
      setNewPricingTier({ minQuantity: 1, price: 0 });
    }
  };

  const addCurrencyPrice = () => {
    if (
      newCurrencyPrice.country &&
      newCurrencyPrice.currency &&
      newCurrencyPrice.price
    ) {
      setCurrencyPrices((prev) => [
        ...prev,
        { ...newCurrencyPrice, id: Date.now().toString() },
      ]);
      setNewCurrencyPrice({
        country: "",
        currency: "USD",
        symbol: "$",
        price: 0,
        comparePrice: 0,
        isActive: true,
      });
    }
  };

  const removeCurrencyPrice = (id: string) => {
    setCurrencyPrices((prev) => prev.filter((cp) => cp.id !== id));
  };

  const currencyOptions = [
    { country: "United States", currency: "USD", symbol: "$" },
    { country: "United Kingdom", currency: "GBP", symbol: "£" },
    { country: "European Union", currency: "EUR", symbol: "€" },
    { country: "Canada", currency: "CAD", symbol: "C$" },
    { country: "Australia", currency: "AUD", symbol: "A$" },
    { country: "Japan", currency: "JPY", symbol: "¥" },
    { country: "India", currency: "INR", symbol: "₹" },
    { country: "China", currency: "CNY", symbol: "¥" },
    { country: "Nepal", currency: "NPR", symbol: "Rs." },
    { country: "Bangladesh", currency: "BDT", symbol: "৳" },
    { country: "Pakistan", currency: "PKR", symbol: "Rs." },
    { country: "Sri Lanka", currency: "LKR", symbol: "Rs." },
  ];

  const removePricingTier = (id: string) => {
    setPricingTiers((prev) => prev.filter((tier) => tier.id !== id));
  };

  const addAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      setAttributes((prev) => [
        ...prev,
        { ...newAttribute, id: Date.now().toString() },
      ]);
      setNewAttribute({
        name: "",
        value: "",
        type: "TEXT",
        isRequired: false,
        isFilterable: true,
        sortOrder: 0,
      });
    }
  };

  const removeAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Set default price from first currency price if exists (for backward compatibility)
    const defaultPrice =
      currencyPrices.length > 0 ? currencyPrices[0].price : 0;
    onSubmit({
      ...formData,
      price: defaultPrice,
      comparePrice:
        currencyPrices.length > 0 ? currencyPrices[0].comparePrice : 0,
      pricingTiers,
      attributes,
      currencyPrices: currencyPrices.map((cp) => ({
        country: cp.country,
        currency: cp.currency,
        symbol: cp.symbol,
        price: cp.price,
        comparePrice: cp.comparePrice,
        isActive: cp.isActive ?? true,
      })),
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">
            {initialData ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-white"
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
            {/* Product Identity Tab */}
            {activeTab === "identity" && (
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Code
                    </label>
                    <input
                      type="text"
                      value={formData.productCode}
                      onChange={(e) =>
                        handleInputChange("productCode", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Enter product code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        handleInputChange("categoryId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <optgroup key={category.id} label={category.name}>
                          <option value={category.id}>
                            {category.name}{" "}
                            {category._count &&
                              `(${category._count.products} products)`}
                          </option>
                          {category.children?.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              └─ {subcategory.name}{" "}
                              {subcategory._count &&
                                `(${subcategory._count.products} products)`}
                            </option>
                          ))}
                        </optgroup>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Sub-Category</option>
                      {categories
                        .filter(cat => cat.children && cat.children.length > 0)
                        .flatMap(cat => cat.children || [])
                        .map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVariant"
                    checked={formData.isVariant}
                    onChange={(e) =>
                      handleInputChange("isVariant", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isVariant"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    This product has variants
                  </label>
                </div>
              </div>
            )}

            

            {/* Product Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => handleInputChange("description", value)}
                    placeholder="Enter detailed product description..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showIngredients"
                    checked={formData.showIngredients}
                    onChange={(e) =>
                      handleInputChange("showIngredients", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="showIngredients"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Show Ingredients
                  </label>
                </div>

                {formData.showIngredients && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients
                    </label>
                    <RichTextEditor
                      value={formData.ingredients}
                      onChange={(value) => handleInputChange("ingredients", value)}
                      placeholder="Enter product ingredients..."
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showDisclaimer"
                    checked={formData.showDisclaimer}
                    onChange={(e) =>
                      handleInputChange("showDisclaimer", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="showDisclaimer"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Show Disclaimer
                  </label>
                </div>

                {formData.showDisclaimer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disclaimer
                    </label>
                    <RichTextEditor
                      value={formData.disclaimer}
                      onChange={(value) => handleInputChange("disclaimer", value)}
                      placeholder="Enter disclaimer..."
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showAdditionalDetails"
                    checked={formData.showAdditionalDetails}
                    onChange={(e) =>
                      handleInputChange("showAdditionalDetails", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="showAdditionalDetails"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Show Additional Details
                  </label>
                </div>

                {formData.showAdditionalDetails && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Details
                    </label>
                    <RichTextEditor
                      value={formData.additionalDetails}
                      onChange={(value) => handleInputChange("additionalDetails", value)}
                      placeholder="Enter additional details..."
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showMaterialCare"
                    checked={formData.showMaterialCare}
                    onChange={(e) =>
                      handleInputChange("showMaterialCare", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="showMaterialCare"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Show Material & Care
                  </label>
                </div>

                {formData.showMaterialCare && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material & Care
                    </label>
                    <RichTextEditor
                      value={formData.materialCare}
                      onChange={(value) => handleInputChange("materialCare", value)}
                      placeholder="Enter material and care instructions..."
                    />
                  </div>
                )}
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                {/* International Pricing Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        International Pricing
                      </h3>
                      <p className="text-sm text-gray-500">
                        Set different prices for different countries
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addCurrencyPrice}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Country Price
                    </button>
                  </div>

                  {/* Add New Currency Price Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          value={newCurrencyPrice.country}
                          onChange={(e) => {
                            const selectedCountry = currencyOptions.find(
                              (opt) => opt.country === e.target.value,
                            );
                            setNewCurrencyPrice((prev) => ({
                              ...prev,
                              country: e.target.value,
                              currency:
                                selectedCountry?.currency || prev.currency,
                              symbol: selectedCountry?.symbol || prev.symbol,
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        >
                          <option value="">Select Country</option>
                          {currencyOptions.map((opt) => (
                            <option key={opt.country} value={opt.country}>
                              {opt.country}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <input
                          type="text"
                          value={newCurrencyPrice.currency}
                          onChange={(e) =>
                            setNewCurrencyPrice((prev) => ({
                              ...prev,
                              currency: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="USD"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Symbol
                        </label>
                        <input
                          type="text"
                          value={newCurrencyPrice.symbol}
                          onChange={(e) =>
                            setNewCurrencyPrice((prev) => ({
                              ...prev,
                              symbol: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="$"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newCurrencyPrice.price}
                          onChange={(e) =>
                            setNewCurrencyPrice((prev) => ({
                              ...prev,
                              price: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compare Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newCurrencyPrice.comparePrice}
                          onChange={(e) =>
                            setNewCurrencyPrice((prev) => ({
                              ...prev,
                              comparePrice: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addCurrencyPrice}
                      className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Price
                    </button>
                  </div>

                  {/* Existing Currency Prices */}
                  <div className="space-y-3">
                    {currencyPrices.map((currencyPrice, index) => (
                      <div
                        key={currencyPrice.id || index}
                        className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Country
                          </label>
                          <p className="text-sm font-medium text-gray-900">
                            {currencyPrice.country}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Currency
                          </label>
                          <p className="text-sm text-gray-900">
                            {currencyPrice.currency}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Symbol
                          </label>
                          <p className="text-sm text-gray-900">
                            {currencyPrice.symbol}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Price
                          </label>
                          <p className="text-sm font-semibold text-gray-900">
                            {currencyPrice.symbol}
                            {currencyPrice.price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Compare Price
                          </label>
                          <p className="text-sm text-gray-600 line-through">
                            {currencyPrice.comparePrice
                              ? `${currencyPrice.symbol}${currencyPrice.comparePrice.toFixed(2)}`
                              : "-"}
                          </p>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              removeCurrencyPrice(
                                currencyPrice.id || index.toString(),
                              )
                            }
                            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {currencyPrices.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No country prices added yet</p>
                        <p className="text-sm">
                          Add prices for different countries above
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Pricing Tiers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dynamic Pricing Tiers
                    </h3>
                    <button
                      type="button"
                      onClick={addPricingTier}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Tier
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pricingTiers.map((tier, index) => (
                      <div
                        key={tier.id || index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Min Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tier.minQuantity}
                            onChange={(e) => {
                              const updatedTiers = [...pricingTiers];
                              updatedTiers[index].minQuantity =
                                parseInt(e.target.value) || 1;
                              setPricingTiers(updatedTiers);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tier.maxQuantity || ""}
                            onChange={(e) => {
                              const updatedTiers = [...pricingTiers];
                              updatedTiers[index].maxQuantity =
                                parseInt(e.target.value) || undefined;
                              setPricingTiers(updatedTiers);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            placeholder="No limit"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={tier.price}
                            onChange={(e) => {
                              const updatedTiers = [...pricingTiers];
                              updatedTiers[index].price =
                                parseFloat(e.target.value) || 0;
                              setPricingTiers(updatedTiers);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              removePricingTier(tier.id || index.toString())
                            }
                            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {pricingTiers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No pricing tiers added yet</p>
                        <p className="text-sm">
                          Add tiers to offer different prices based on quantity
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange(
                          "quantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={(e) =>
                        handleInputChange(
                          "lowStockThreshold",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trackQuantity"
                      checked={formData.trackQuantity}
                      onChange={(e) =>
                        handleInputChange("trackQuantity", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="trackQuantity"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Track quantity for this product
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowBackorder"
                      checked={formData.allowBackorder}
                      onChange={(e) =>
                        handleInputChange("allowBackorder", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="allowBackorder"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Allow backorders when out of stock
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="manageStock"
                      checked={formData.manageStock}
                      onChange={(e) =>
                        handleInputChange("manageStock", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="manageStock"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Manage stock levels
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={(e) =>
                          handleInputChange(
                            "weight",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="0.00"
                      />
                      <select
                        value={formData.weightUnit}
                        onChange={(e) =>
                          handleInputChange("weightUnit", e.target.value)
                        }
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lb">lb</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Length"
                        value={formData.dimensions.length}
                        onChange={(e) =>
                          handleInputChange("dimensions", {
                            ...formData.dimensions,
                            length: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Width"
                        value={formData.dimensions.width}
                        onChange={(e) =>
                          handleInputChange("dimensions", {
                            ...formData.dimensions,
                            width: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Height"
                        value={formData.dimensions.height}
                        onChange={(e) =>
                          handleInputChange("dimensions", {
                            ...formData.dimensions,
                            height: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isSales"
                        checked={formData.isSales}
                        onChange={(e) =>
                          handleInputChange("isSales", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isSales"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Sales
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isNewSeller"
                        checked={formData.isNewSeller}
                        onChange={(e) =>
                          handleInputChange("isNewSeller", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isNewSeller"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        New Seller
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFestivalOffer"
                        checked={formData.isFestivalOffer}
                        onChange={(e) =>
                          handleInputChange("isFestivalOffer", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isFestivalOffer"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Festival Offer
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files);
                          // Limit to 8 images total
                          const currentImagesCount = formData.images.length;
                          const remainingSlots = 8 - currentImagesCount;
                          const filesToAdd = files.slice(0, remainingSlots);
                          
                          if (filesToAdd.length > 0) {
                            const imageUrls = filesToAdd.map((file: File) => URL.createObjectURL(file));
                            setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, ...imageUrls]
                            }));
                          }
                        }
                      }}
                      className="hidden"
                      id="media-upload"
                    />
                    <label 
                      htmlFor="media-upload" 
                      className="cursor-pointer inline-flex flex-col items-center justify-center"
                    >
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-blue-600 font-medium">Click to upload images</span>
                      <p className="text-sm text-gray-500 mt-1">Or drag and drop images here</p>
                      <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP (Max 5MB each)</p>
                      <p className="text-xs text-gray-400 mt-2">Maximum 8 images allowed</p>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">{formData.images.length}/8 images uploaded</p>
                  </div>
                  
                  {/* Display uploaded images */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image: string, index: number) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Product ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_: string, i: number) => i !== index)
                                }));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Variants Tab */}
            {activeTab === "variants" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Attributes
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="size"
                        checked={formData.variantAttributes?.includes('size')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'size']
                            : attributes.filter((attr: string) => attr !== 'size');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="size" className="ml-2 block text-sm text-gray-900">
                        Size
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="style"
                        checked={formData.variantAttributes?.includes('style')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'style']
                            : attributes.filter((attr: string) => attr !== 'style');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="style" className="ml-2 block text-sm text-gray-900">
                        Style
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="materialType"
                        checked={formData.variantAttributes?.includes('materialType')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'materialType']
                            : attributes.filter((attr: string) => attr !== 'materialType');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="materialType" className="ml-2 block text-sm text-gray-900">
                        Material Type
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="color"
                        checked={formData.variantAttributes?.includes('color')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'color']
                            : attributes.filter((attr: string) => attr !== 'color');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="color" className="ml-2 block text-sm text-gray-900">
                        Color
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dimension"
                        checked={formData.variantAttributes?.includes('dimension')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'dimension']
                            : attributes.filter((attr: string) => attr !== 'dimension');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="dimension" className="ml-2 block text-sm text-gray-900">
                        Dimension
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="numberOfItems"
                        checked={formData.variantAttributes?.includes('numberOfItems')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'numberOfItems']
                            : attributes.filter((attr: string) => attr !== 'numberOfItems');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="numberOfItems" className="ml-2 block text-sm text-gray-900">
                        Number of Items
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="unitCount"
                        checked={formData.variantAttributes?.includes('unitCount')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked 
                            ? [...attributes, 'unitCount']
                            : attributes.filter((attr: string) => attr !== 'unitCount');
                          handleInputChange('variantAttributes', newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="unitCount" className="ml-2 block text-sm text-gray-900">
                        Unit Count
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Variant Table Form - shown when any checkbox is selected */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Variants</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                          {formData.variantAttributes?.includes('dimension') && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Width</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
                            </>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (USD)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (EUR)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (GBP)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (INR)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="e.g., Small Blue"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="SKU"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                id="variant-image-upload"
                              />
                              <label 
                                htmlFor="variant-image-upload" 
                                className="cursor-pointer inline-flex flex-col items-center"
                              >
                                <Camera className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-xs text-blue-600">Upload</span>
                              </label>
                            </div>
                          </td>
                          {formData.variantAttributes?.includes('dimension') && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="0.00"
                                />
                              </td>
                            </>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-red-600 hover:text-red-900">Remove</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        + Add Row
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Display existing variants */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Variants</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                          {formData.variantAttributes?.includes('dimension') && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Width</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
                            </>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (USD)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (EUR)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (GBP)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (INR)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Small Blue</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">SB-001</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <img src="/placeholder-image.jpg" alt="Variant" className="w-10 h-10 object-cover rounded" />
                          </td>
                          {formData.variantAttributes?.includes('dimension') && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10.0</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5.0</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3.0</td>
                            </>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$25.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€22.50</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">£20.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹1,800.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Large Red</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">LR-002</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <img src="/placeholder-image.jpg" alt="Variant" className="w-10 h-10 object-cover rounded" />
                          </td>
                          {formData.variantAttributes?.includes('dimension') && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15.0</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">7.0</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.0</td>
                            </>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$27.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€24.30</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">£22.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹2,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other tabs would be implemented similarly... */}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading
              ? "Saving..."
              : initialData
                ? "Update Product"
                : "Add Product"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}