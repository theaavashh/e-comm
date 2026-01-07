"use client";

import { useState, useEffect, useRef } from "react";
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
  minDeliveryDays?: number;
  maxDeliveryDays?: number;
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

interface CustomField {
  id?: string;
  title: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
}

interface GeneratedVariant {
  id: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  comparePrice: number;
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
  slug: string;
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
  customFields: CustomField[];
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
  onSuccess?: () => void; // Callback for successful submission
}

export default function EnhancedProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  categories = [],
  brands = [],
  onSuccess,
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
    slug: initialData?.slug || "", // Use API slug field directly
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
    customFields: initialData?.customFields || [],
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

  const [customFields, setCustomFields] = useState<CustomField[]>(
    initialData?.customFields || [],
  );
  const [newCustomField, setNewCustomField] = useState<CustomField>({
    title: "",
    content: "",
    sortOrder: customFields.length,
    isActive: true,
  });

  // Selected variant options
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [autoGeneratedVariants, setAutoGeneratedVariants] = useState<
    GeneratedVariant[]
  >([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // State to track if slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug && !!initialData?.slug.trim()); // Set to true if editing existing product with a non-empty slug

  // Effect to reset form when initialData changes (for edit mode)
  const prevInitialDataRef = useRef<any>(null);
  
  useEffect(() => {
    // Only update if initialData has actually changed (not on initial mount)
    if (initialData && initialData !== prevInitialDataRef.current) {
      // Reset form with new initial data
      setFormData({
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
        slug: initialData?.slug || "",
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
        customFields: initialData?.customFields || [],
        notes: initialData?.notes || "",

        // Variant attributes
        variantAttributes: initialData?.variantAttributes || [],
      });
      
      // Reset additional states
      setPricingTiers(initialData?.pricingTiers || []);
      setCurrencyPrices(initialData?.currencyPrices || []);
      setAttributes(initialData?.attributes || []);
      setCustomFields(initialData?.customFields || []);
      
      // Update slug tracking
      setSlugManuallyEdited(!!initialData?.slug && !!initialData?.slug.trim());
    }
    
    // Update previous reference
    prevInitialDataRef.current = initialData;
  }, [initialData]);

  // Effect to update slug when product name changes (only if slug hasn't been manually edited)
  useEffect(() => {
    // Only auto-update if slug hasn't been manually edited
    if (!slugManuallyEdited) {
      const autoGeneratedSlug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "-");
      
      handleInputChange("slug", autoGeneratedSlug);
    }
  }, [formData.name, slugManuallyEdited]);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const tabs = [
    { id: "identity", label: "Product Identity", icon: Package },
    { id: "details", label: "Product Details", icon: FileText },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    ...(formData.isVariant
      ? [{ id: "variants", label: "Variants", icon: Package }]
      : []),
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
    
    // If no currency prices are added, create a default one
    const finalCurrencyPrices = currencyPrices.length > 0 ? currencyPrices : [
      {
        country: "USA",
        currency: "USD",
        symbol: "$",
        price: 0, // formData doesn't have price field, use 0 as default
        comparePrice: 0, // formData doesn't have comparePrice field, use 0 as default
        minDeliveryDays: 1,
        maxDeliveryDays: 7,
        isActive: true,
      }
    ];
    
    // Set default price from first currency price if exists (for backward compatibility)
    const defaultPrice =
      finalCurrencyPrices.length > 0 ? finalCurrencyPrices[0].price : 0;

    // Create submission data without the sku field
    const {
      sku, // Remove this field
      ...formDataWithoutSku
    } = formData;
    
    const submissionData = {
      ...formDataWithoutSku,
      productCode: formData.slug || formData.productCode, // Use the slug field for product code if available
      isOnSale: formData.isSales, // Map isSales to isOnSale for API compatibility
      customFields,
      price: defaultPrice,
      comparePrice:
        finalCurrencyPrices.length > 0 ? finalCurrencyPrices[0].comparePrice : 0,
      pricingTiers,
      attributes,
      currencyPrices: finalCurrencyPrices.map((cp) => ({
        country: cp.country,
        currency: cp.currency,
        symbol: cp.symbol,
        price: cp.price,
        comparePrice: cp.comparePrice,
        minDeliveryDays: cp.minDeliveryDays ?? 1,
        maxDeliveryDays: cp.maxDeliveryDays ?? 7,
        isActive: cp.isActive ?? true,
      })),
    };

    // Show success state briefly
    setShowSuccess(true);

    onSubmit(submissionData);

    // Clear form after successful submission (only for new products, not updates)
    if (!initialData) {
      setTimeout(() => {
        clearForm();
        setShowSuccess(false);
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Optionally close's form after successful submission
        // Uncomment's next line if you want to auto-close after adding
        // onClose();
      }, 1500); // Show success for 1.5 seconds before clearing
    } else {
      // For updates, just hide success message after 1.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }
  };

  const clearForm = () => {
    // Reset form data to initial state
    setFormData({
      // Product Identity
      name: "",
      productCode: "",
      categoryId: "",
      subCategoryId: "",
      brand: "",
      tags: [],
      isVariant: false,

      // Basic Information
      description: "",
      shortDescription: "",
      disclaimer: "",
      ingredients: "",
      additionalDetails: "",
      materialCare: "",
      showIngredients: false,
      showDisclaimer: false,
      showAdditionalDetails: false,
      showMaterialCare: false,

      // Product Identification
      sku: "",
      barcode: "",
      upc: "",
      ean: "",
      isbn: "",

      // Inventory
      trackQuantity: true,
      quantity: 0,
      lowStockThreshold: 5,
      allowBackorder: false,
      manageStock: true,

      // Physical Properties
      weight: 0,
      weightUnit: "kg",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },

      // Media
      images: [],
      videos: [],
      thumbnail: "",

      // SEO
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      slug: "",
      metaTags: {},

      // Status
      isActive: true,
      isDigital: false,
      isFeatured: false,
      isNew: false,
      isOnSale: false,
      isBestSeller: false,
      isSales: false,
      isNewSeller: false,
      isFestivalOffer: false,
      visibility: "VISIBLE",
      publishedAt: "",

      // Shipping
      requiresShipping: true,
      shippingClass: "",
      freeShipping: false,

      // Tax
      taxable: true,
      taxClass: "",

      // Additional
      customFields: [],
      notes: "",

      // Variant attributes
      variantAttributes: [],
    });

    // Reset additional state
    setPricingTiers([]);
    setCurrencyPrices([]);
    setAttributes([]);
    setNewTag("");
    setNewKeyword("");
    setSelectedSizes([]);
    setSelectedColors([]);
    setAutoGeneratedVariants([]);
    setActiveTab("identity"); // Reset to first tab
  };

  // Navigation functions
  const getCurrentTabIndex = () => {
    return tabs.findIndex((tab) => tab.id === activeTab);
  };

  const handleNext = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const isFirstTab = getCurrentTabIndex() === 0;
  const isLastTab = getCurrentTabIndex() === tabs.length - 1;

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

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-700">
                {initialData
                  ? "Product updated successfully!"
                  : "Product added successfully! Form has been cleared."}
              </p>
            </div>
          </motion.div>
        )}

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
                      onChange={(e) => {
                        handleInputChange("categoryId", e.target.value);
                        // Reset sub-category when category changes
                        handleInputChange("subCategoryId", "");
                      }}
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
                      {formData.categoryId && 
                        categories
                          .find(cat => cat.id === formData.categoryId)
                          ?.children
                          ?.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))
                      }
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
                    onChange={(value) =>
                      handleInputChange("description", value)
                    }
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
                      onChange={(value) =>
                        handleInputChange("ingredients", value)
                      }
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
                      onChange={(value) =>
                        handleInputChange("disclaimer", value)
                      }
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
                      handleInputChange(
                        "showAdditionalDetails",
                        e.target.checked,
                      )
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
                      onChange={(value) =>
                        handleInputChange("additionalDetails", value)
                      }
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
                      onChange={(value) =>
                        handleInputChange("materialCare", value)
                      }
                      placeholder="Enter material and care instructions..."
                    />
                  </div>
                )}

                {/* Custom Fields Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Custom Fields
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        if (newCustomField.title && newCustomField.content) {
                          setCustomFields((prev) => [
                            ...prev,
                            { ...newCustomField, id: Date.now().toString() },
                          ]);
                          setNewCustomField({
                            title: "",
                            content: "",
                            sortOrder: customFields.length,
                            isActive: true,
                          });
                        }
                      }}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Custom Field
                    </button>
                  </div>

                  {/* Add New Custom Field Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={newCustomField.title}
                          onChange={(e) =>
                            setNewCustomField((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Enter field title"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newCustomFieldActive"
                          checked={newCustomField.isActive}
                          onChange={(e) =>
                            setNewCustomField((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-6"
                        />
                        <label
                          htmlFor="newCustomFieldActive"
                          className="ml-2 block text-sm text-gray-900 mt-6"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content *
                      </label>
                      <textarea
                        value={newCustomField.content}
                        onChange={(e) =>
                          setNewCustomField((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter field content"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newCustomField.title && newCustomField.content) {
                          setCustomFields((prev) => [
                            ...prev,
                            { ...newCustomField, id: Date.now().toString() },
                          ]);
                          setNewCustomField({
                            title: "",
                            content: "",
                            sortOrder: customFields.length,
                            isActive: true,
                          });
                        }
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Custom Field
                    </button>
                  </div>

                  {/* Existing Custom Fields */}
                  <div className="space-y-3">
                    {customFields.map((field, index) => (
                      <div
                        key={field.id || index}
                        className="p-4 border border-gray-200 rounded-lg bg-white"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {field.title}
                              </h4>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  field.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {field.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                              {field.content}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setCustomFields((prev) =>
                                prev.filter((f, i) => i !== index),
                              )
                            }
                            className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {customFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No custom fields added yet</p>
                        <p className="text-sm">
                          Add custom fields above to provide additional product
                          information
                        </p>
                      </div>
                    )}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Settings
                  </h3>
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

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          handleInputChange("isFeatured", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Featured
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                {/* Basic SEO Fields */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic SEO
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) =>
                          handleInputChange("seoTitle", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter SEO title (50-60 characters recommended)"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.seoTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Description
                      </label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) =>
                          handleInputChange("seoDescription", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter SEO description (150-160 characters recommended)"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.seoDescription.length}/160 characters
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
                    </div>
                  </div>
                </div>

                {/* Advanced SEO Fields */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Advanced SEO
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          const slug = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-");
                          handleInputChange("slug", slug);
                          setSlugManuallyEdited(true); // Mark that the slug has been manually edited
                        }}
                        onBlur={() => {
                          // Auto-generate slug from product name if slug is empty
                          if (!formData.slug) {
                            const autoSlug = formData.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^a-z0-9-]/g, "-");
                            handleInputChange("slug", autoSlug);
                            setSlugManuallyEdited(false); // Reset the manual edit flag if auto-generated
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="product-url-slug"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        URL-friendly version of the product name
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/product/canonical-url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Prevent duplicate content issues
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Focus Keyword
                        </label>
                        <input
                          type="text"
                          placeholder="Main target keyword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Search Priority
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media & Open Graph */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Social Media & Open Graph
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Title
                        </label>
                        <input
                          type="text"
                          placeholder="Title for social media sharing"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="product">Product</option>
                          <option value="website">Website</option>
                          <option value="article">Article</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OG Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Description for social media sharing"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter Card Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="summary">Summary</option>
                          <option value="summary_large_image">
                            Summary with Large Image
                          </option>
                          <option value="product">Product</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Data */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Structured Data (Schema.org)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableProductSchema"
                        defaultChecked={true}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="enableProductSchema"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Product Schema
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableBreadcrumbSchema"
                        defaultChecked={true}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="enableBreadcrumbSchema"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Breadcrumb Schema
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableReviewSchema"
                        defaultChecked={false}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="enableReviewSchema"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Enable Review Schema
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Schema (JSON-LD)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Enter custom JSON-LD schema..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical SEO */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical SEO
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Robots Meta Tag
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="index,follow">Index, Follow</option>
                          <option value="index,nofollow">
                            Index, No Follow
                          </option>
                          <option value="noindex,follow">
                            No Index, Follow
                          </option>
                          <option value="noindex,nofollow">
                            No Index, No Follow
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="en">English</option>
                          <option value="ne">Nepali</option>
                          <option value="hi">Hindi</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Geographic Target
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="">Global</option>
                          <option value="NP">Nepal</option>
                          <option value="IN">India</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content Rating
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                          <option value="general">General</option>
                          <option value="mature">Mature</option>
                          <option value="restricted">Restricted</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Meta Tags
                      </label>
                      <textarea
                        rows={3}
                        placeholder='name="custom-meta" content="value"'
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Add custom meta tags (one per line)
                      </p>
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
                      onChange={async (e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files);
                          // Limit to 8 images total
                          const currentImagesCount = formData.images.length;
                          const remainingSlots = 12 - currentImagesCount;
                          const filesToAdd = files.slice(0, remainingSlots);

                          if (filesToAdd.length > 0) {
                            // Upload each image to the server
                            const uploadedPaths: string[] = [];
                            for (const file of filesToAdd) {
                              try {
                                const formDataUpload = new FormData();
                                formDataUpload.append("image", file);

                                const response = await fetch(
                                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/upload/product`,
                                  {
                                    method: "POST",
                                    body: formDataUpload,
                                  },
                                );

                                const result = await response.json();
                                if (result.success) {
                                  uploadedPaths.push(result.data.path); // Use the path that should be stored in DB
                                }
                              } catch (error) {
                                console.error("Error uploading image:", error);
                              }
                            }

                            if (uploadedPaths.length > 0) {
                              setFormData((prev) => ({
                                ...prev,
                                images: [...prev.images, ...uploadedPaths],
                              }));
                            }
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
                      <span className="text-blue-600 font-medium">
                        Click to upload images
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Or drag and drop images here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports JPG, PNG, WEBP (Max 5MB each)
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Maximum 12 images allowed
                      </p>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.images.length}/12 images uploaded
                    </p>
                  </div>

                  {/* Display uploaded images */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Uploaded Images
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image: string, index: number) => (
                          <div key={index} className="relative group">
                            <img
                              src={
                                image.startsWith("/uploads/")
                                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`
                                  : image
                              }
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_: string, i: number) => i !== index,
                                  ),
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
                        checked={formData.variantAttributes?.includes("size")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "size"]
                            : attributes.filter(
                                (attr: string) => attr !== "size",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="size"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Size
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="style"
                        checked={formData.variantAttributes?.includes("style")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "style"]
                            : attributes.filter(
                                (attr: string) => attr !== "style",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="style"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Style
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="materialType"
                        checked={formData.variantAttributes?.includes(
                          "materialType",
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "materialType"]
                            : attributes.filter(
                                (attr: string) => attr !== "materialType",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="materialType"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Material Type
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="color"
                        checked={formData.variantAttributes?.includes("color")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "color"]
                            : attributes.filter(
                                (attr: string) => attr !== "color",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="color"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Color
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dimension"
                        checked={formData.variantAttributes?.includes(
                          "dimension",
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "dimension"]
                            : attributes.filter(
                                (attr: string) => attr !== "dimension",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="dimension"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Dimension
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="numberOfItems"
                        checked={formData.variantAttributes?.includes(
                          "numberOfItems",
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "numberOfItems"]
                            : attributes.filter(
                                (attr: string) => attr !== "numberOfItems",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="numberOfItems"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Number of Items
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="unitCount"
                        checked={formData.variantAttributes?.includes(
                          "unitCount",
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const checked = e.target.checked;
                          const attributes = formData.variantAttributes || [];
                          const newAttributes = checked
                            ? [...attributes, "unitCount"]
                            : attributes.filter(
                                (attr: string) => attr !== "unitCount",
                              );
                          handleInputChange("variantAttributes", newAttributes);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="unitCount"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Unit Count
                      </label>
                    </div>
                  </div>
                </div>

                {/* Size Options Section - shown when size variant is checked */}
                {formData.variantAttributes?.includes("size") && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Size Options
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <div key={size} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) {
                                setSelectedSizes((prev) => [...prev, size]);
                              } else {
                                setSelectedSizes((prev) =>
                                  prev.filter((s) => s !== size),
                                );
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`size-${size}`}
                            className="ml-1 text-sm text-gray-700"
                          >
                            {size}
                          </label>
                        </div>
                      ))}
                      <input
                        type="text"
                        placeholder="Add custom size"
                        className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-24"
                      />
                    </div>
                  </div>
                )}

                {/* Color Options Section - shown when color variant is checked */}
                {formData.variantAttributes?.includes("color") && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Color Options
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Red", "Blue", "Green", "Black", "White", "Yellow"].map(
                        (color) => (
                          <div key={color} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`color-${color}`}
                              checked={selectedColors.includes(color)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked) {
                                  setSelectedColors((prev) => [...prev, color]);
                                } else {
                                  setSelectedColors((prev) =>
                                    prev.filter((c) => c !== color),
                                  );
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`color-${color}`}
                              className="ml-1 text-sm text-gray-700"
                            >
                              {color}
                            </label>
                          </div>
                        ),
                      )}
                      <input
                        type="text"
                        placeholder="Add custom color"
                        className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm w-24"
                      />
                    </div>
                  </div>
                )}

                {/* Auto Generate Variants Button */}
                {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        const variants: GeneratedVariant[] = [];
                        if (
                          selectedSizes.length > 0 &&
                          selectedColors.length > 0
                        ) {
                          // Generate combinations of size and color
                          selectedSizes.forEach((size) => {
                            selectedColors.forEach((color) => {
                              variants.push({
                                id: Date.now().toString() + Math.random(),
                                name: `${size} - ${color}`,
                                sku: `SKU-${size.toLowerCase()}-${color.toLowerCase()}`,
                                size: size,
                                color: color,
                                price: 0,
                                comparePrice: 0,
                              });
                            });
                          });
                        } else if (selectedSizes.length > 0) {
                          // Only sizes selected
                          selectedSizes.forEach((size) => {
                            variants.push({
                              id: Date.now().toString() + Math.random(),
                              name: size,
                              sku: `SKU-${size.toLowerCase()}`,
                              size: size,
                              color: "",
                              price: 0,
                              comparePrice: 0,
                            });
                          });
                        } else if (selectedColors.length > 0) {
                          // Only colors selected
                          selectedColors.forEach((color) => {
                            variants.push({
                              id: Date.now().toString() + Math.random(),
                              name: color,
                              sku: `SKU-${color.toLowerCase()}`,
                              size: "",
                              color: color,
                              price: 0,
                              comparePrice: 0,
                            });
                          });
                        }
                        setAutoGeneratedVariants(variants);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Generate Variants (
                      {selectedSizes.length * selectedColors.length ||
                        selectedSizes.length ||
                        selectedColors.length}{" "}
                      combinations)
                    </button>
                  </div>
                )}

                {/* Variant Table Form - shown when any checkbox is selected */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add Variants
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Variant Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Images
                          </th>
                          {formData.variantAttributes?.includes("size") && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Size
                            </th>
                          )}
                          {formData.variantAttributes?.includes("color") && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Color
                            </th>
                          )}
                          {formData.variantAttributes?.includes(
                            "dimension",
                          ) && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Length
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Width
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Height
                              </th>
                            </>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (USD)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (EUR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (GBP)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (INR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
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
                                <span className="text-xs text-blue-600">
                                  Upload
                                </span>
                              </label>
                            </div>
                          </td>
                          {formData.variantAttributes?.includes("size") && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black">
                                <option value="">Select Size</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                              </select>
                            </td>
                          )}
                          {formData.variantAttributes?.includes(
                            "dimension",
                          ) && (
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
                            <button className="text-red-600 hover:text-red-900">
                              Remove
                            </button>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Existing Variants
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Images
                          </th>
                          {formData.variantAttributes?.includes(
                            "dimension",
                          ) && (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Length
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Width
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Height
                              </th>
                            </>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (USD)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (EUR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (GBP)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (INR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {autoGeneratedVariants.map((variant, index) => (
                          <tr key={variant.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => {
                                  const updatedVariants = [
                                    ...autoGeneratedVariants,
                                  ];
                                  updatedVariants[index].name = e.target.value;
                                  setAutoGeneratedVariants(updatedVariants);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="e.g., Small Blue"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => {
                                  const updatedVariants = [
                                    ...autoGeneratedVariants,
                                  ];
                                  updatedVariants[index].sku = e.target.value;
                                  setAutoGeneratedVariants(updatedVariants);
                                }}
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
                                  id={`variant-image-${index}`}
                                />
                                <label
                                  htmlFor={`variant-image-${index}`}
                                  className="cursor-pointer inline-flex flex-col items-center"
                                >
                                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                                  <span className="text-xs text-blue-600">
                                    Upload
                                  </span>
                                </label>
                              </div>
                            </td>
                            {formData.variantAttributes?.includes("size") && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <input
                                  type="text"
                                  value={variant.size}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                                  placeholder="Size"
                                />
                              </td>
                            )}
                            {formData.variantAttributes?.includes("color") && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <input
                                  type="text"
                                  value={variant.color}
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                                  placeholder="Color"
                                />
                              </td>
                            )}
                            {formData.variantAttributes?.includes(
                              "dimension",
                            ) && (
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
                              <div className="flex items-center">
                                <span className="mr-1">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={variant.price}
                                  onChange={(e) => {
                                    const updatedVariants = [
                                      ...autoGeneratedVariants,
                                    ];
                                    updatedVariants[index].price =
                                      parseFloat(e.target.value) || 0;
                                    setAutoGeneratedVariants(updatedVariants);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="29.99"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <span className="mr-1">€</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="22.99"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <span className="mr-1">£</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="22.99"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <span className="mr-1">₹</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                  placeholder="2,000.00"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-900 mr-2"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedVariants =
                                    autoGeneratedVariants.filter(
                                      (_, i) => i !== index,
                                    );
                                  setAutoGeneratedVariants(updatedVariants);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
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
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            {!isFirstTab && (
              <motion.button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className="w-4 h-4 mr-2 rotate-270" />
                Previous
              </motion.button>
            )}
          </div>

          <div className="flex space-x-4">
            {!isLastTab && (
              <motion.button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ArrowDown className="w-4 h-4 ml-2 rotate-90" />
              </motion.button>
            )}

            {isLastTab && (
              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  "Saving..."
                ) : initialData ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
