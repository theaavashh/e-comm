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

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ProductFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Information
    name: initialData?.name || "",

    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    brand: initialData?.brand || "",
    tags: initialData?.tags || [],

    // Pricing removed - using international pricing instead

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
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

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setCategories(data.data.categories || []);
      } else {
        throw new Error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "media", label: "Media", icon: Camera },
    { id: "seo", label: "SEO", icon: Search },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "attributes", label: "Attributes", icon: Tag },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  const handleInputChange = (field: string, value: any) => {
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
          <h2 className="text-2xl font-bold text-white">
            {initialData ? "Edit Product" : "Add New Product"}
          </h2>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Enter SKU"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) =>
                      handleInputChange("shortDescription", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Brief product description"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Detailed product description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      disabled={isLoadingCategories}
                    >
                      <option value="">
                        {isLoadingCategories
                          ? "Loading categories..."
                          : "Select Category"}
                      </option>
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
                    {isLoadingCategories && (
                      <p className="text-xs text-gray-500 mt-1">
                        Loading categories from API...
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Enter brand name"
                    />
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
                          Description *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="SEO optimized title (max 60 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoTitle.length}/60 characters. Recommended: 50-60
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="SEO optimized description (max 160 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 characters.
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
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      placeholder="Enter keyword"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newKeyword.trim()) {
                            handleArrayChange(
                              "seoKeywords",
                              newKeyword.trim(),
                              "add",
                            );
                            setNewKeyword("");
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newKeyword.trim()) {
                          handleArrayChange(
                            "seoKeywords",
                            newKeyword.trim(),
                            "add",
                          );
                          setNewKeyword("");
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                    placeholder="product-url-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the product name
                  </p>
                </div>
              </div>
            )}

            {/* Attributes Tab */}
            {activeTab === "attributes" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Attributes
                  </h3>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Attribute
                  </button>
                </div>

                <div className="space-y-4">
                  {attributes.map((attr, index) => (
                    <div
                      key={attr.id || index}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={attr.name}
                          onChange={(e) => {
                            const updatedAttrs = [...attributes];
                            updatedAttrs[index].name = e.target.value;
                            setAttributes(updatedAttrs);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="e.g., Color, Size"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={attr.value}
                          onChange={(e) => {
                            const updatedAttrs = [...attributes];
                            updatedAttrs[index].value = e.target.value;
                            setAttributes(updatedAttrs);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="e.g., Red, Large"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={attr.type}
                          onChange={(e) => {
                            const updatedAttrs = [...attributes];
                            updatedAttrs[index].type = e.target.value as any;
                            setAttributes(updatedAttrs);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        >
                          <option value="TEXT">Text</option>
                          <option value="NUMBER">Number</option>
                          <option value="BOOLEAN">Boolean</option>
                          <option value="COLOR">Color</option>
                          <option value="IMAGE">Image</option>
                          <option value="SELECT">Select</option>
                          <option value="MULTI_SELECT">Multi Select</option>
                        </select>
                      </div>
                      <div className="flex items-end space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={attr.isRequired}
                            onChange={(e) => {
                              const updatedAttrs = [...attributes];
                              updatedAttrs[index].isRequired = e.target.checked;
                              setAttributes(updatedAttrs);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-1 text-sm text-gray-700">
                            Required
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={attr.isFilterable}
                            onChange={(e) => {
                              const updatedAttrs = [...attributes];
                              updatedAttrs[index].isFilterable =
                                e.target.checked;
                              setAttributes(updatedAttrs);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-1 text-sm text-gray-700">
                            Filterable
                          </span>
                        </label>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            removeAttribute(attr.id || index.toString())
                          }
                          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {attributes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No attributes added yet</p>
                      <p className="text-sm">
                        Add attributes like color, size, material, etc.
                      </p>
                    </div>
                  )}
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
