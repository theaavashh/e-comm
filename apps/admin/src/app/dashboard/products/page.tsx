"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import EnhancedProductForm from "@/components/EnhancedProductForm";
import AdvancedProductFilter from "@/components/AdvancedProductFilter";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import BulkOperations from "@/components/BulkOperations";
import DashboardLayout from "@/components/DashboardLayout";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import { productFilterSchema, ProductFilterData } from "@/schemas/productSchema";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
  Grid3X3,
  List,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  Settings,
  EyeOff
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  sku: string;
  category: string;
  categoryId: string;
  brandId?: string;
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
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  visibility?: string;
  requiresShipping?: boolean;
  freeShipping?: boolean;
  taxable?: boolean;
  videos?: string[];
  seoKeywords?: string[];
}

function ProductsPageContent() {
  const { token, isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, name: string, children?: Array<{id: string, name: string}>}>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [brands, setBrands] = useState<Array<{id: string, name: string, slug: string, isActive: boolean, sortOrder: number}>>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Filter form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset: resetFilters,
    formState: { errors: filterErrors }
  } = useForm<ProductFilterData>({
    defaultValues: {
      search: '',
      categoryId: '',
      isActive: undefined,
      priceMin: undefined,
      priceMax: undefined,
      stockMin: undefined,
      stockMax: undefined,
      isFeatured: undefined,
      isDigital: undefined,
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    }
  });

  const watchedFilters = watch();

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products || []);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Create product via API
  const createProduct = async (productData: any) => {
    try {
      setIsLoading(true);
      
      // Debug: Log authentication status
      console.log('Authentication status:', { isAuthenticated, hasToken: !!token, user: user?.email });
      
      // Check if user is authenticated (cookie-based auth)
      if (!isAuthenticated) {
        throw new Error('You must be logged in to create products. Please log in again.');
      }
      
      // Debug: Log the data being sent
      console.log('Creating product with data:', JSON.stringify(productData, null, 2));
      console.log('Token available:', !!token);
      console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      console.log('Making API request to:', `${API_BASE_URL}/api/v1/products`);
      console.log('Request headers:', headers);
      console.log('Request body:', JSON.stringify(productData, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData),
        credentials: 'include',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        console.error('Response status text:', response.statusText);
        
        let errorMessage = `Failed to create product: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('API error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Debug: Log the response
      console.log('Product creation response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        return true;
      } else {
        throw new Error(data.message || 'Failed to create product');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update product via API
  const updateProduct = async (productId: string, productData: any) => {
    try {
      setIsLoading(true);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(productData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        return true;
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product via API
  const deleteProduct = async (productId: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Your session has expired or you lack permissions. Please log in again.');
          try { logout?.(); } catch {}
          try { router.push('/'); } catch {}
        }
        // Try to provide a more helpful error message
        let errorMessage = `Failed to delete product: ${response.statusText}`;
        try {
          const clone = response.clone();
          const text = await clone.text();
          const json = JSON.parse(text);
          errorMessage = json.message || json.error || errorMessage;
        } catch (_) {
          // ignore parse failures
        }
        toast.error(errorMessage);
        return false;
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the products list
        await fetchProducts();
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories || []);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/brands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch brands: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBrands(data.data.brands || []);
      } else {
        throw new Error(data.message || 'Failed to fetch brands');
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  // Load products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // Memoized filtering logic for performance
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
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
        dateTo
      } = watchedFilters;

      // Search filter
      const categoryName = typeof product.category === 'string' 
        ? product.category 
        : (product.category as any)?.name || 'Uncategorized';
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.sku || '').toLowerCase().includes(search.toLowerCase()) ||
        categoryName.toLowerCase().includes(search.toLowerCase()) ||
        (product.shortDescription || '').toLowerCase().includes(search.toLowerCase());

      // Category filter (only main categories)
      const matchesCategory = !categoryId || product.categoryId === categoryId;

      // Status filter
      const matchesStatus = isActive === undefined || product.isActive === isActive;

      // Price range filter
      const matchesPrice = (!priceMin || product.price >= priceMin) && 
                          (!priceMax || product.price <= priceMax);

      // Stock range filter
      const matchesStock = (!stockMin || product.stock >= stockMin) && 
                          (!stockMax || product.stock <= stockMax);

      // Featured filter
      const matchesFeatured = isFeatured === undefined || product.isFeatured === isFeatured;

      // Digital filter
      const matchesDigital = isDigital === undefined || product.isDigital === isDigital;

      // Date range filter
      const productDate = new Date(product.createdAt);
      const matchesDate = (!dateFrom || productDate >= new Date(dateFrom)) && 
                         (!dateTo || productDate <= new Date(dateTo));

      return matchesSearch && matchesCategory && matchesStatus && 
             matchesPrice && matchesStock && matchesFeatured && 
             matchesDigital && matchesDate;
    }).sort((a, b) => {
      const { sortBy, sortOrder } = watchedFilters;
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
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
  const handleViewProduct = useCallback((product: Product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback(async (id: string, productName?: string) => {
    const confirmMessage = productName 
      ? `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      : "Are you sure you want to delete this product? This action cannot be undone.";
    
    if (confirm(confirmMessage)) {
      try {
      const success = await deleteProduct(id);
      if (success) {
        toast.success("Product deleted successfully!");
        setSelectedProducts(prev => prev.filter(productId => productId !== id));
          // Close view modal if it's open for the deleted product
          if (viewingProduct?.id === id) {
            setShowViewModal(false);
            setViewingProduct(null);
          }
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error("Failed to delete product. Please try again.");
      }
    }
  }, [viewingProduct]);

  const handleStatusChange = useCallback(async (id: string, newStatus: boolean) => {
    const success = await updateProduct(id, { isActive: newStatus });
    if (success) {
      toast.success(`Product status updated to ${newStatus ? 'active' : 'inactive'}`);
    }
  }, []);

  const handleProductSubmit = useCallback(async (data: any) => {
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
  }, [editingProduct]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingProduct(null);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setShowViewModal(false);
    setViewingProduct(null);
  }, []);

  // Bulk operations
  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const promises = ids.map(id => deleteProduct(id));
    const results = await Promise.all(promises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      toast.success(`${successCount} products deleted successfully!`);
      setSelectedProducts([]);
    }
  }, []);

  const handleBulkStatusChange = useCallback(async (ids: string[], isActive: boolean) => {
    const promises = ids.map(id => updateProduct(id, { isActive }));
    const results = await Promise.all(promises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      toast.success(`${successCount} products status updated to ${isActive ? 'active' : 'inactive'}!`);
      setSelectedProducts([]);
    }
  }, []);

  const handleBulkFeaturedToggle = useCallback(async (ids: string[]) => {
    // This would need to be implemented in the API
    toast("Bulk featured toggle feature coming soon!", { icon: 'ℹ️' });
  }, []);

  const handleProductSelect = useCallback((id: string, selected: boolean) => {
    setSelectedProducts(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(productId => productId !== id)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  }, [paginatedProducts]);

  const handleFilterChange = useCallback((filters: ProductFilterData) => {
    // Filters are automatically applied via watchedFilters
  }, []);

  // Utility functions
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
              <h1 className="text-2xl font-bold text-gray-900 custom-font">All Products</h1>
              <div className="flex items-center mt-2">
                <Package className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-600 custom-font">
                  {isLoadingProducts ? 'Loading...' : `${filteredProducts.length} Total Products`}
                </span>
          </div>
          </div>
          
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search product"
                  value={watchedFilters.search || ''}
                  onChange={(e) => setValue('search', e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-black custom-font"
                />
            </div>

              {/* Show Entries Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 custom-font">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black custom-font"
                >
                  <option value={10}>10 Entries</option>
                  <option value={25}>25 Entries</option>
                  <option value={50}>50 Entries</option>
                  <option value={100}>100 Entries</option>
                </select>
              </div>

            {/* Add Product Button */}
            <motion.button
              onClick={() => setShowAddModal(true)}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium custom-font"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
                Add New
            </motion.button>
          </div>
        </div>
        </div>
        {/* Advanced Filters - Hidden for cleaner UI */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
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
              <p className="text-gray-600 custom-font">Loading products...</p>
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
            <h3 className="text-lg font-semibold text-red-800 mb-2 custom-font">Error Loading Products</h3>
            <p className="text-red-600 mb-4 custom-font">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors custom-font"
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider custom-font">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {/* Product Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 custom-font">{product.name}</div>
                            <div className="text-sm text-gray-500 custom-font">SKU: {product.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 custom-font">
                          {typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'Uncategorized'}
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 custom-font">
                          ${(Number(product.price) || 0).toFixed(2)}
                        </div>
                        {product.comparePrice && Number(product.comparePrice) > 0 && (
                          <div className="text-sm text-gray-500 line-through custom-font">
                            ${Number(product.comparePrice).toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Stock Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 custom-font">{product.stock || 0}</div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full custom-font ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Created Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-font">
                        {new Date(product.createdAt).toLocaleDateString('en-GB')}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
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
            <div className="text-sm text-gray-700 custom-font">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed custom-font"
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
                      className={`px-3 py-2 text-sm font-medium rounded-md custom-font ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed custom-font"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoadingProducts && !error && filteredProducts.length === 0 && (
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg custom-font">No products found</p>
            <p className="text-gray-400 text-sm mt-2 custom-font">
              {watchedFilters.search || watchedFilters.categoryId || watchedFilters.isActive !== undefined 
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors custom-font"
            >
              Add Product
            </button>
          </motion.div>
        )}

        {/* Enhanced Product Form Modal */}
        <EnhancedProductForm
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleProductSubmit}
          initialData={editingProduct}
          isLoading={isLoading}
          categories={categories}
          brands={brands as any}
        />

        {/* Product Details Modal */}
        <ProductDetailsModal
          isOpen={showViewModal}
          onClose={handleCloseViewModal}
          product={viewingProduct}
          onEdit={handleEditProduct}
          onDelete={handleDelete}
        />

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

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsPageContent />
    </ProtectedRoute>
  );
}

