"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import EnhancedProductForm from "@/components/EnhancedProductForm";
import AdvancedProductFilter from "@/components/AdvancedProductFilter";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import BulkOperations from "@/components/BulkOperations";
import DashboardLayout from "@/components/DashboardLayout";
import { productFilterSchema, ProductFilterData } from "@/schemas/productSchema";
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
  Settings,
  Eye,
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
  tags: string[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
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
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  isDigital?: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, name: string, children?: Array<{id: string, name: string}>}>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    formState: { errors: filterErrors }
  } = useForm<ProductFilterData>({
    defaultValues: {
      search: '',
      categoryId: '',
      status: 'all' as const,
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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/v1/products`, {
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
      
      const response = await fetch(`${API_BASE_URL}/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const data = await response.json();
      
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
      
      const response = await fetch(`${API_BASE_URL}/v1/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
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
      const response = await fetch(`${API_BASE_URL}/v1/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
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
      const response = await fetch(`${API_BASE_URL}/v1/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // Load products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Memoized filtering logic for performance
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const {
        search,
        categoryId,
        status,
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
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(search.toLowerCase());

      // Category filter (only main categories)
      const matchesCategory = !categoryId || product.categoryId === categoryId;

      // Status filter
      const matchesStatus = status === 'all' || product.status === status;

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
  const handleDelete = useCallback(async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const success = await deleteProduct(id);
      if (success) {
        toast.success("Product deleted successfully!");
        setSelectedProducts(prev => prev.filter(productId => productId !== id));
      }
    }
  }, []);

  const handleStatusChange = useCallback(async (id: string, newStatus: Product['status']) => {
    const success = await updateProduct(id, { status: newStatus });
    if (success) {
      toast.success(`Product status updated to ${newStatus}`);
    }
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
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

  const handleBulkStatusChange = useCallback(async (ids: string[], status: Product['status']) => {
    const promises = ids.map(id => updateProduct(id, { status }));
    const results = await Promise.all(promises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      toast.success(`${successCount} products status updated to ${status}!`);
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
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-yellow-600 bg-yellow-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'archived': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              animate={{ opacity: 1, height: 'auto' }}
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
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Products Grid/List */}
        {!isLoadingProducts && !error && (
          <motion.div 
            className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {paginatedProducts.map((product, index) => (
              <EnhancedProductCard
                key={product.id}
                product={product}
                index={index}
                onEdit={handleEditProduct}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onToggleFeatured={(id) => handleBulkFeaturedToggle([id])}
              />
            ))}
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
              {watchedFilters.search || watchedFilters.categoryId || watchedFilters.status !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product"
              }
            </p>
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

