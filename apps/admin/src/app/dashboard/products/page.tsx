"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import nextImage from "next/image";
import EnhancedProductForm from "@/components/EnhancedProductForm";
import AdvancedProductFilter from "@/components/AdvancedProductFilter";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import BulkOperations from "@/components/BulkOperations";
import DashboardLayout from "@/components/DashboardLayout";
import {
  productFilterSchema,
  ProductFilterData,
} from "@/schemas/productSchema";
import { getApiBaseUrl } from "@/utils/api";
import DeleteAlert from "@/components/DeleteAlert";
import { CompleteProductData } from "@/schemas/productFormSchema";
import {
  Plus,
  Search,
  Filter,
  Package,
  DollarSign,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string | { id: string; name: string; slug: string };
  categoryId: string;
  tags: string[];
  images: string[];
  isActive: boolean;
  stock: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isDigital?: boolean;
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    productId: "",
    productName: "",
    productImage: "",
  });
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      children?: Array<{ id: string; name: string; slug: string }>;
    }>
  >([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // UI State
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filter form
  const {
    control,
    handleSubmit,
    watch,
    reset: resetFilters,
    formState: { errors: filterErrors },
  } = useForm<ProductFilterData>({
    defaultValues: {
      search: "",
      categoryId: "",
      isActive: undefined,
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isFeatured: undefined,
      isDigital: undefined,
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt" as const,
      sortOrder: "desc" as const,
    },
  });

  const watchedFilters = watch();

  // API Base URL
  const API_BASE_URL = getApiBaseUrl();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products || []);
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Create product via API
  const createProduct = async (productData: any) => {
    try {
      setIsLoading(true);

      // Transform data to match API requirements
      const transformedData = {
        ...productData,
        // Ensure currencyPrices has at least one entry for API requirement
        currencyPrices:
          productData.currencyPrices && productData.currencyPrices.length > 0
            ? productData.currencyPrices.map((cp: any) => ({
                country: cp.country,
                currency:
                  cp.currency ||
                  (() => {
                    // Auto-detect currency based on country
                    const countryCurrencyMap: Record<string, string> = {
                      "United States": "USD",
                      USA: "USD",
                      UK: "GBP",
                      "United Kingdom": "GBP",
                      Australia: "AUD",
                      Canada: "CAD",
                      India: "INR",
                      China: "CNY",
                      Japan: "JPY",
                      Singapore: "SGD",
                      UAE: "AED",
                      Nepal: "NPR",
                    };
                    return countryCurrencyMap[cp.country] || "USD";
                  })(),
                symbol:
                  cp.symbol ||
                  (() => {
                    // Auto-detect symbol based on country
                    const countrySymbolMap: Record<string, string> = {
                      "United States": "$",
                      USA: "$",
                      UK: "£",
                      "United Kingdom": "£",
                      Australia: "$",
                      Canada: "$",
                      India: "₹",
                      China: "¥",
                      Japan: "¥",
                      Singapore: "$",
                      UAE: "د.إ",
                      Nepal: "NPR",
                    };
                    return countrySymbolMap[cp.country] || "$";
                  })(),
                price: cp.price,
                comparePrice:
                  cp.comparePrice !== undefined &&
                  cp.comparePrice !== null &&
                  cp.comparePrice !== ""
                    ? cp.comparePrice
                    : undefined,
                minDeliveryDays: cp.minDeliveryDays || 1,
                maxDeliveryDays: cp.maxDeliveryDays || 7,
                isActive: cp.isActive !== false,
              }))
            : [
                {
                  country: "USA",
                  currency: "USD",
                  symbol: "$",
                  price:
                    productData.price && productData.price > 0
                      ? productData.price
                      : 1,
                  minDeliveryDays: 1,
                  maxDeliveryDays: 7,
                  isActive: true,
                },
              ],
        // Set required fields with defaults if missing
        sku:
          productData.sku ||
          `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        asin:
          productData.asin ||
          `ASIN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        trackQuantity: productData.trackQuantity !== false,
        manageStock: productData.manageStock !== false,
        requiresShipping: productData.requiresShipping !== false,
        taxable: productData.taxable !== false,
        // Include weight and dimensions if present
        ...(productData.weight &&
          productData.weight > 0 && { weight: Number(productData.weight) }),
        ...(productData.weightUnit &&
          productData.weightUnit.trim() && {
            weightUnit: productData.weightUnit,
          }),
        ...(productData.dimensions && {
          dimensions: {
            length: productData.dimensions.length || 0,
            width: productData.dimensions.width || 0,
            height: productData.dimensions.height || 0,
            unit: productData.dimensions.unit || "cm",
          },
        }),
        // Transform variants to ensure proper structure with new fields
        variants:
          productData.variants && productData.variants.length > 0
            ? productData.variants.map((variant: any) => ({
                ...variant,
                options:
                  variant.options && variant.options.length > 0
                    ? variant.options.map((option: any) => ({
                        ...option,
                        // Ensure numeric fields are properly converted
                        price:
                          option.price !== undefined
                            ? Number(option.price)
                            : undefined,
                        comparePrice:
                          option.comparePrice !== undefined
                            ? Number(option.comparePrice)
                            : undefined,
                        weight:
                          option.weight !== undefined
                            ? Number(option.weight)
                            : undefined,
                        additionalCost:
                          option.additionalCost !== undefined
                            ? Number(option.additionalCost)
                            : 0,
                        stock:
                          option.stock !== undefined ? Number(option.stock) : 0,
                        asin:
                          option.asin !== undefined ? option.asin : undefined,
                      }))
                    : [],
              }))
            : [],
        // Remove fields not expected by API
        currency: undefined,
        symbol: undefined,
      };

      console.log("Creating product with data:", transformedData);
      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || response.statusText;
        console.error("API Error Response:", JSON.stringify(data, null, 2));
        throw new Error(`Failed to create product: ${errorMessage}`);
      }

      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        return true;
      } else {
        throw new Error(data.message || "Failed to create product");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create product",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update product via API
  const updateProduct = async (productId: string, productData: any) => {
    try {
      setIsLoading(true);

      // Transform data to match API requirements
      const transformedData = {
        ...productData,
        // Ensure all required fields are present
        name: productData.name || "",
        description: productData.description || "",
        sku:
          productData.sku ||
          `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        asin:
          productData.asin ||
          `ASIN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        categoryId: productData.categoryId || "",
        // Ensure currencyPrices has at least one entry for API requirement
        currencyPrices:
          productData.currencyPrices && productData.currencyPrices.length > 0
            ? productData.currencyPrices.map((cp: any) => ({
                country: cp.country,
                currency:
                  cp.currency ||
                  (() => {
                    // Auto-detect currency based on country
                    const countryCurrencyMap: Record<string, string> = {
                      "United States": "USD",
                      USA: "USD",
                      UK: "GBP",
                      "United Kingdom": "GBP",
                      Australia: "AUD",
                      Canada: "CAD",
                      India: "INR",
                      China: "CNY",
                      Japan: "JPY",
                      Singapore: "SGD",
                      UAE: "AED",
                      Nepal: "NPR",
                    };
                    return countryCurrencyMap[cp.country] || "USD";
                  })(),
                symbol:
                  cp.symbol ||
                  (() => {
                    // Auto-detect symbol based on country
                    const countrySymbolMap: Record<string, string> = {
                      "United States": "$",
                      USA: "$",
                      UK: "£",
                      "United Kingdom": "£",
                      Australia: "$",
                      Canada: "$",
                      India: "₹",
                      China: "¥",
                      Japan: "¥",
                      Singapore: "$",
                      UAE: "د.إ",
                      Nepal: "NPR",
                    };
                    return countrySymbolMap[cp.country] || "$";
                  })(),
                price: cp.price,
                comparePrice:
                  cp.comparePrice !== undefined &&
                  cp.comparePrice !== null &&
                  cp.comparePrice !== ""
                    ? cp.comparePrice
                    : undefined,
                minDeliveryDays: cp.minDeliveryDays || 1,
                maxDeliveryDays: cp.maxDeliveryDays || 7,
                isActive: cp.isActive !== false,
              }))
            : [
                {
                  country: "USA",
                  currency: "USD",
                  symbol: "$",
                  price:
                    productData.price && productData.price > 0
                      ? productData.price
                      : 1,
                  minDeliveryDays: 1,
                  maxDeliveryDays: 7,
                  isActive: true,
                },
              ],
        // Set boolean defaults
        trackQuantity: productData.trackQuantity !== false,
        manageStock: productData.manageStock !== false,
        requiresShipping: productData.requiresShipping !== false,
        taxable: productData.taxable !== false,
        // Include weight and dimensions if present
        ...(productData.weight &&
          productData.weight > 0 && { weight: Number(productData.weight) }),
        ...(productData.weightUnit &&
          productData.weightUnit.trim() && {
            weightUnit: productData.weightUnit,
          }),
        ...(productData.dimensions && {
          dimensions: {
            length: productData.dimensions.length || 0,
            width: productData.dimensions.width || 0,
            height: productData.dimensions.height || 0,
            unit: productData.dimensions.unit || "cm",
          },
        }),
        // Transform variants to ensure proper structure with new fields
        variants:
          productData.variants && productData.variants.length > 0
            ? productData.variants.map((variant: any) => ({
                ...variant,
                options:
                  variant.options && variant.options.length > 0
                    ? variant.options.map((option: any) => ({
                        ...option,
                        // Ensure numeric fields are properly converted
                        price:
                          option.price !== undefined
                            ? Number(option.price)
                            : undefined,
                        comparePrice:
                          option.comparePrice !== undefined
                            ? Number(option.comparePrice)
                            : undefined,
                        weight:
                          option.weight !== undefined
                            ? Number(option.weight)
                            : undefined,
                        additionalCost:
                          option.additionalCost !== undefined
                            ? Number(option.additionalCost)
                            : 0,
                        stock:
                          option.stock !== undefined ? Number(option.stock) : 0,
                        asin:
                          option.asin !== undefined ? option.asin : undefined,
                      }))
                    : [],
              }))
            : [],
        // Remove fields not expected by API
        currency: undefined,
        symbol: undefined,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${productId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        return true;
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update product",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product via API
  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/products/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        return true;
      } else {
        throw new Error(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete product",
      );
      return false;
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        const mappedCategories = (data.data.categories || []).map(
          (cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
            children:
              cat.children?.map((child: any) => ({
                id: child.id,
                name: child.name,
                slug:
                  child.slug || child.name.toLowerCase().replace(/\s+/g, "-"),
              })) || [],
          }),
        );
        setCategories(mappedCategories);
      } else {
        throw new Error(data.message || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Load products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Memoized filtering logic for performance
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products
      .filter((product) => {
        const {
          search,
          categoryId,
          isActive,
          priceMin,
          priceMax,
          stockMin,
          stockMax,
          isFeatured,
          isDigital,
          dateFrom,
          dateTo,
        } = watchedFilters;

        // Search filter
        const category =
          typeof product.category === "string"
            ? product.category
            : product.category.name;
        const matchesSearch =
          !search ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase()) ||
          category.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());

        // Category filter (only main categories)
        const matchesCategory =
          !categoryId || product.categoryId === categoryId;

        // Status filter - using isActive instead of status
        const matchesStatus = true; // All products are shown since we're using isActive

        // Price range filter
        const matchesPrice =
          (!priceMin || product.price >= priceMin) &&
          (!priceMax || product.price <= priceMax);

        // Stock range filter
        const matchesStock =
          (!stockMin || product.stock >= stockMin) &&
          (!stockMax || product.stock <= stockMax);

        // Featured filter
        const matchesFeatured =
          isFeatured === undefined || product.isFeatured === isFeatured;

        // Digital filter
        const matchesDigital =
          isDigital === undefined || product.isDigital === isDigital;

        // Date range filter
        const productDate = new Date(product.createdAt);
        const matchesDate =
          (!dateFrom || productDate >= new Date(dateFrom)) &&
          (!dateTo || productDate <= new Date(dateTo));

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesPrice &&
          matchesStock &&
          matchesFeatured &&
          matchesDigital &&
          matchesDate
        );
      })
      .sort((a, b) => {
        const { sortBy, sortOrder } = watchedFilters;
        let aValue, bValue;

        switch (sortBy) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "price":
            aValue = a.price;
            bValue = b.price;
            break;
          case "stock":
            aValue = a.stock;
            bValue = b.stock;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "updatedAt":
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
            break;
          default:
            return 0;
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [products, watchedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [watchedFilters]);

  // Enhanced handlers with performance optimizations
  const handleDelete = useCallback(
    async (id: string) => {
      // Find the product to get its name and image for the delete alert
      const product = products.find((p) => p.id === id);
      if (product) {
        setDeleteAlert({
          isOpen: true,
          productId: id,
          productName: product.name,
          productImage:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
        });
      }
    },
    [products],
  );

  const confirmDelete = useCallback(async () => {
    const success = await deleteProduct(deleteAlert.productId);
    if (success) {
      toast.success("Product deleted successfully!");
      setSelectedProducts((prev) =>
        prev.filter((productId) => productId !== deleteAlert.productId),
      );
      setDeleteAlert({
        isOpen: false,
        productId: "",
        productName: "",
        productImage: "",
      });
    }
  }, [deleteAlert.productId]);

  const cancelDelete = useCallback(() => {
    setDeleteAlert({
      isOpen: false,
      productId: "",
      productName: "",
      productImage: "",
    });
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, isActive: boolean) => {
      const success = await updateProduct(id, { isActive });
      if (success) {
        toast.success(
          `Product status updated to ${isActive ? "active" : "inactive"}`,
        );
      }
    },
    [],
  );

  const handleEditProduct = useCallback(async (product: Product) => {
    // Fetch complete product data for editing
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/api/v1/products/${product.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Ensure the product data has all required fields for the form
          const completeProductData = {
            // Copy all the fetched data
            ...result.data,
            // Ensure required fields exist with defaults if not present
            shortDescription: result.data.shortDescription || "",
            disclaimer: result.data.disclaimer || "",
            ingredients: result.data.ingredients || "",
            additionalDetails: result.data.additionalDetails || "",
            materialCare: result.data.materialCare || "",
            showIngredients: result.data.showIngredients || false,
            showDisclaimer: result.data.showDisclaimer || false,
            showAdditionalDetails: result.data.showAdditionalDetails || false,
            showMaterialCare: result.data.showMaterialCare || false,
            barcode: result.data.barcode || "",
            upc: result.data.upc || "",
            ean: result.data.ean || "",
            isbn: result.data.isbn || "",
            trackQuantity: result.data.trackQuantity !== undefined ? result.data.trackQuantity : true,
            lowStockThreshold: result.data.lowStockThreshold || 5,
            allowBackorder: result.data.allowBackorder || false,
            manageStock: result.data.manageStock !== undefined ? result.data.manageStock : true,
            weight: result.data.weight || 0,
            weightUnit: result.data.weightUnit || "kg",
            dimensions: result.data.dimensions || {
              length: 0,
              width: 0,
              height: 0,
              unit: "cm",
            },
            images: result.data.images || [],
            videos: result.data.videos || [],
            thumbnail: result.data.thumbnail || "",
            seoTitle: result.data.seoTitle || "",
            seoDescription: result.data.seoDescription || "",
            seoKeywords: result.data.seoKeywords || [],
            metaTags: result.data.metaTags || {},
            isActive: result.data.isActive !== undefined ? result.data.isActive : true,
            isDigital: result.data.isDigital || false,
            isFeatured: result.data.isFeatured || false,
            isNew: result.data.isNew || false,
            isOnSale: result.data.isOnSale || false,
            isBestSeller: result.data.isBestSeller || false,
            isSales: result.data.isSales || false,
            isNewSeller: result.data.isNewSeller || false,
            isFestivalOffer: result.data.isFestivalOffer || false,
            visibility: result.data.visibility || "VISIBLE",
            publishedAt: result.data.publishedAt || "",
            requiresShipping: result.data.requiresShipping !== undefined ? result.data.requiresShipping : true,
            shippingClass: result.data.shippingClass || "",
            freeShipping: result.data.freeShipping || false,
            taxable: result.data.taxable !== undefined ? result.data.taxable : true,
            taxClass: result.data.taxClass || "",
            customFields: result.data.customFields || [],
            notes: result.data.notes || "",
            variantAttributes: result.data.variantAttributes || [],
            // Make sure slug is mapped properly
            slug: result.data.slug || result.data.productCode || "",
            // Ensure category and subcategory are set
            categoryId: result.data.categoryId || "",
            subCategoryId: result.data.subCategoryId || "",
            // Ensure pricing tiers and other complex fields exist
            pricingTiers: result.data.pricingTiers || [],
            currencyPrices: result.data.currencyPrices || [],
            attributes: result.data.attributes || [],
          };
          setEditingProduct(completeProductData);
        } else {
          // Fallback to the original product data if detailed fetch fails
          setEditingProduct(product);
        }
      } else {
        // Fallback to the original product data if detailed fetch fails
        setEditingProduct(product);
      }
    } catch (error) {
      console.error('Error fetching complete product data:', error);
      // Fallback to the original product data if detailed fetch fails
      setEditingProduct(product);
    }
    
    setShowAddModal(true);
  }, []);

  const handleProductSubmit = useCallback(
    async (data: any) => {
      if (editingProduct) {
        const success = await updateProduct(editingProduct.id, data);
        if (success) {
          toast.success("Product updated successfully!");
          setShowAddModal(false);
          setEditingProduct(null);
        }
      } else {
        const success = await createProduct(data);
        if (success) {
          toast.success("Product created successfully!");
          setShowAddModal(false);
        }
      }
    },
    [editingProduct],
  );

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingProduct(null);
  }, []);

  // Bulk operations
  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const promises = ids.map((id) => deleteProduct(id));
    const results = await Promise.all(promises);
    const successCount = results.filter(Boolean).length;

    if (successCount > 0) {
      toast.success(`${successCount} products deleted successfully!`);
      setSelectedProducts([]);
    }
  }, []);

  const handleBulkStatusChange = useCallback(
    async (ids: string[], isActive: boolean) => {
      const promises = ids.map((id) => updateProduct(id, { isActive }));
      const results = await Promise.all(promises);
      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(
          `${successCount} products status updated to ${isActive ? "active" : "inactive"}!`,
        );
        setSelectedProducts([]);
      }
    },
    [],
  );

  const handleBulkFeaturedToggle = useCallback(async (ids: string[]) => {
    // This would need to be implemented in the API
    toast("Bulk featured toggle feature coming soon!", { icon: "ℹ️" });
  }, []);

  const handleProductSelect = useCallback((id: string, selected: boolean) => {
    setSelectedProducts((prev) =>
      selected ? [...prev, id] : prev.filter((productId) => productId !== id),
    );
  }, []);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedProducts(paginatedProducts.map((p) => p.id));
      } else {
        setSelectedProducts([]);
      }
    },
    [paginatedProducts],
  );

  const handleFilterChange = useCallback((filters: ProductFilterData) => {
    // Filters are automatically applied via watchedFilters
  }, []);

  // Utility functions - simplified for isActive boolean
  const getStatusColor = (isActive: boolean) => {
    return isActive ? "text-green-600 bg-green-50" : "text-gray-600 bg-gray-50";
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <AlertCircle className="w-4 h-4" />
    );
  };

  return (
    <DashboardLayout title="Product Management" showBackButton={true}>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog ({filteredProducts.length} products)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            {/* Add Product Button */}
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </motion.button>
          </div>
        </div>
        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdvancedProductFilter
                onFilterChange={handleFilterChange}
                categories={categories}
                isLoading={isLoadingCategories}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoadingProducts && (
          <motion.div
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoadingProducts && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Products
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Products Table */}
        {!isLoadingProducts && !error && (
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.images && product.images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {typeof product.category === "string"
                            ? product.category
                            : product.category?.name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price}
                          {product.comparePrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${product.comparePrice}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleBulkFeaturedToggle([product.id])}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            product.isFeatured
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {product.isFeatured ? "Featured" : "Normal"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setPreviewProduct(product)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(product.id, !product.isActive)
                            }
                            className={`${
                              product.isActive
                                ? "text-yellow-600 hover:text-yellow-900"
                                : "text-green-600 hover:text-green-900"
                            } transition-colors`}
                            title={product.isActive ? "Deactivate" : "Activate"}
                          >
                            {product.isActive ? (
                              <AlertCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoadingProducts && !error && filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              {watchedFilters.search ||
              watchedFilters.categoryId ||
              watchedFilters.isActive !== undefined
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"}
            </p>
          </motion.div>
        )}

        {/* Enhanced Product Form Modal */}
        <EnhancedProductForm
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleProductSubmit}
          initialData={(editingProduct as any) || undefined}
          isLoading={isLoading}
          categories={categories}
          brands={brands}
        />

        {/* Delete Alert Modal */}
        <DeleteAlert
          isOpen={deleteAlert.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          productName={deleteAlert.productName}
          productImage={deleteAlert.productImage}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteAlert.productName}"? This action cannot be undone and will permanently remove the product from your inventory.`}
        />

        {/* Product Preview Modal */}
        <AnimatePresence>
          {previewProduct && (
            <motion.div
              className="fixed inset-0 z-50 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewProduct(null)}
            >
              <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                  className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Product Preview
                    </h2>
                    <button
                      onClick={() => setPreviewProduct(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <EyeOff className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Column - Images */}
                      <div>
                        <div className="space-y-4">
                          {/* Main Image */}
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            {previewProduct.images &&
                            previewProduct.images.length > 0 ? (
                              <img
                                src={previewProduct.images[0]}
                                alt={previewProduct.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Images */}
                          {previewProduct.images &&
                            previewProduct.images.length > 1 && (
                              <div className="flex space-x-2 overflow-x-auto">
                                {previewProduct.images
                                  .slice(1)
                                  .map((image, index) => (
                                    <img
                                      key={index}
                                      src={image}
                                      alt={`${previewProduct.name} ${index + 2}`}
                                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity"
                                    />
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Right Column - Product Details */}
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {previewProduct.name || "N/A"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {previewProduct.description ||
                              "No description available"}
                          </p>

                          {/* SKU and Category */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>SKU: {previewProduct.sku || "N/A"}</span>
                            <span>•</span>
                            <span>
                              Category:{" "}
                              {typeof previewProduct.category === "string"
                                ? previewProduct.category
                                : previewProduct.category?.name || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div>
                          <div className="flex items-baseline space-x-3">
                            <span className="text-3xl font-bold text-gray-900">
                              ${previewProduct.price}
                            </span>
                            {previewProduct.comparePrice &&
                              previewProduct.comparePrice >
                                previewProduct.price && (
                                <span className="text-lg text-gray-500 line-through">
                                  ${previewProduct.comparePrice}
                                </span>
                              )}
                          </div>
                          {previewProduct.comparePrice &&
                            previewProduct.comparePrice >
                              previewProduct.price && (
                              <div className="mt-2">
                                <span className="inline-flex px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                                  {Math.round(
                                    ((previewProduct.comparePrice -
                                      previewProduct.price) /
                                      previewProduct.comparePrice) *
                                      100,
                                  )}
                                  % OFF
                                </span>
                              </div>
                            )}
                        </div>

                        {/* Stock and Status */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">
                              Stock Quantity
                            </div>
                            <div className="text-xl font-semibold text-gray-900">
                              {previewProduct.stock}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">
                              Status
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  previewProduct.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {previewProduct.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                              {previewProduct.isFeatured && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {previewProduct.tags &&
                          previewProduct.tags.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Tags
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {previewProduct.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Dimensions and Weight */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Physical Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Weight:</span>
                              <span className="ml-2 font-medium">
                                {previewProduct.weight} kg
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Dimensions:</span>
                              <span className="ml-2 font-medium">
                                {previewProduct.dimensions.length} ×{" "}
                                {previewProduct.dimensions.width} ×{" "}
                                {previewProduct.dimensions.height} cm
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* SEO Info */}
                        {previewProduct.seo && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              SEO Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-500">Title:</span>
                                <span className="ml-2">
                                  {previewProduct.seo.title || "N/A"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Description:
                                </span>
                                <span className="ml-2">
                                  {previewProduct.seo.description || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer with Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => setPreviewProduct(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setPreviewProduct(null);
                        handleEditProduct(previewProduct);
                      }}
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Product
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Operations */}
        <BulkOperations
          selectedProducts={selectedProducts}
          onBulkDelete={handleBulkDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkFeaturedToggle={handleBulkFeaturedToggle}
          onClearSelection={() => setSelectedProducts([])}
          totalProducts={filteredProducts.length}
        />
      </motion.div>
    </DashboardLayout>
  );
}
