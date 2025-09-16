"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Upload,
  X,
  Eye,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryFormData } from '@/schemas/categorySchema';
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";


interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  status: 'active' | 'inactive';
  parentId?: string;
  subCategories?: Category[];
  isSubCategory?: boolean;
  // New fields for sub-categories
  totalQuantity?: number;
  availableUnits?: number;
}

export default function CategoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{id: string, name: string, type: 'category' | 'subcategory'} | null>(null);
  const router = useRouter();

  // Categories state - now loaded from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
      status: "active",
      parentId: "",
      isSubCategory: false
    }
  });

  // Watch form values for conditional logic
  const watchedIsSubCategory = watch('isSubCategory');
  const watchedParentId = watch('parentId');

  // New state for hierarchical selection
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [availableSubCategories, setAvailableSubCategories] = useState<Category[]>([]);

  // API Functions
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setError(null);
      
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
        // Transform API data to match our Category interface
        const transformedCategories = data.data.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          image: cat.image || '/image.png',
          createdAt: new Date(cat.createdAt).toISOString().split('T')[0],
          status: cat.isActive ? 'active' : 'inactive',
          parentId: cat.parentId,
          subCategories: cat.children?.map((child: any) => ({
            id: child.id,
            name: child.name,
            description: child.description || '',
            image: child.image || '/image.png',
            createdAt: new Date(child.createdAt).toISOString().split('T')[0],
            status: child.isActive ? 'active' : 'inactive',
            parentId: child.parentId,
            isSubCategory: true,
            totalQuantity: child._count?.products || 0,
            availableUnits: child._count?.products || 0
          })) || [],
          totalQuantity: cat._count?.products || 0,
          availableUnits: cat._count?.products || 0
        }));
        
        setCategories(transformedCategories);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const createCategory = async (categoryData: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/v1/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryData.name,
          image: categoryData.image,
          parentId: categoryData.parentId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Failed to create category: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh categories after creation
        await fetchCategories();
        toast.success('Category created successfully!');
        return true;
      } else {
        throw new Error(data.message || 'Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create category');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, categoryData: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/v1/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryData.name,
          image: categoryData.image,
          isActive: categoryData.status === 'active',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Failed to update category: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh categories after update
        await fetchCategories();
        toast.success('Category updated successfully!');
        return true;
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update category');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh categories after deletion
        await fetchCategories();
        toast.success('Category deleted successfully!');
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
      return false;
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Remove handleInputChange as React Hook Form handles this automatically

  // Handle main category selection for hierarchical selection
  const handleMainCategoryChange = (mainCategoryId: string) => {
    setSelectedMainCategory(mainCategoryId);
    
    // Find the selected main category and get its sub-categories
    const mainCategory = categories.find(cat => cat.id === mainCategoryId);
    if (mainCategory && mainCategory.subCategories) {
      setAvailableSubCategories(mainCategory.subCategories);
    } else {
      setAvailableSubCategories([]);
    }
    
    // Reset sub-category selection when main category changes
    setValue('parentId', mainCategoryId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setValue('image', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    const success = await createCategory(data);
    
    if (success) {
      setShowAddModal(false);
      reset();
      // Reset hierarchical selection
      setSelectedMainCategory('');
      setAvailableSubCategories([]);
    }
  };

  const handleDeleteClick = (id: string, name: string, type: 'category' | 'subcategory') => {
    setDeleteItem({ id, name, type });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    
    const success = await deleteCategory(deleteItem.id);
    
    if (success) {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setShowImagePreview(true);
  };

  const filteredCategories = categories.filter(category => {
    // Only show main categories (no parentId)
    if (category.parentId) return false;
    
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Also check sub-categories
    const subCategoryMatches = category.subCategories?.some(subCat =>
      subCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subCat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchesSearch || subCategoryMatches;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout title="Category Management" showBackButton={true}>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        {/* Loading State */}
        {isLoadingCategories && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoadingCategories && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Categories</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingCategories && !error && paginatedCategories.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No categories match your search.' : 'Get started by creating your first category.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Category
                </button>
              )}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoadingCategories && !error && paginatedCategories.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {paginatedCategories.map((category, index) => (
            <motion.div 
              key={category.id}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Main Category */}
              <motion.div 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <p className="text-xs text-gray-500 mb-4">Created: {category.createdAt}</p>
                  
          {/* Image Preview Button */}
          <div className="mb-4">
            <button
              onClick={() => handleImagePreview(category.image)}
              className="w-full bg-gray-50 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
              title="Preview Image"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => {
                        setValue('isSubCategory', true);
                        setValue('parentId', category.id);
                        setShowAddModal(true);
                      }}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Sub</span>
                    </button>
            <button
              onClick={() => handleDeleteClick(category.id, category.name, 'category')}
              className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
                  </div>
                </div>
              </motion.div>

              {/* Sub-categories */}
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Sub-categories:</h4>
                  <div className="space-y-2">
                    {category.subCategories.map((subCategory, subIndex) => (
                      <motion.div 
                        key={subCategory.id}
                        className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: subIndex * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-gray-900">{subCategory.name}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              subCategory.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subCategory.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{subCategory.description}</p>
                          
                          {/* Quantity and Units Info */}
                          {subCategory.totalQuantity !== undefined && (
                            <div className="mb-3 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Total Qty:</span>
                                <span className="font-medium text-gray-700">{subCategory.totalQuantity}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Available:</span>
                                <span className="font-medium text-gray-700">{subCategory.availableUnits}</span>
                              </div>
                            </div>
                          )}

                          
                          {/* Image Preview Button for Sub-category */}
                          <div className="mb-3">
                            <button
                              onClick={() => handleImagePreview(subCategory.image)}
                              className="w-full bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-300"
                              title="Preview Image"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex space-x-1">
                            <button className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors flex items-center space-x-1">
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(subCategory.id, subCategory.name, 'subcategory')}
                              className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-100 transition-colors flex items-center space-x-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filteredCategories.length > itemsPerPage && (
          <motion.div 
            className="flex items-center justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} categories
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.3 }
              }}
            >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {watchedIsSubCategory ? 'Add New Sub-category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Category Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                  Category Type
                </label>
                <Controller
                  name="isSubCategory"
                  control={control}
                  render={({ field }) => (
                    <div className="flex space-x-4">
                      <label className="flex items-center text-black">
                        <input
                          type="radio"
                          checked={!field.value}
                          onChange={() => {
                            field.onChange(false);
                            setValue('parentId', '');
                          }}
                          className="mr-2"
                        />
                        Main Category
                      </label>
                      <label className="flex items-center text-black">
                        <input
                          type="radio"
                          checked={field.value}
                          onChange={() => field.onChange(true)}
                          className="mr-2"
                        />
                        Sub-category
                      </label>
                    </div>
                  )}
                />
                {errors.isSubCategory && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.isSubCategory.message)}</p>
                )}
              </div>

              {/* Hierarchical Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Main Category
                </label>
                <select
                  value={selectedMainCategory}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">Choose a main category first</option>
                  {categories.filter(category => !category.parentId).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-category Selection (only shown after main category is selected) */}
              {selectedMainCategory && availableSubCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Sub-category (Optional)
                  </label>
                  <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="">Select a sub-category (or leave empty for main category)</option>
                        {availableSubCategories.map(subCategory => (
                          <option key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.parentId && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.parentId.message)}</p>
                  )}
                </div>
              )}


              {/* Category Name - only for main categories */}
              {!watchedIsSubCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                    Category Name
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter category name"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
                  )}
                </div>
              )}


              {/* Image Upload - only for main categories */}
              {!watchedIsSubCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                    Category Image
                  </label>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {field.value ? (
                          <div className="space-y-2">
                            <Image
                              src={field.value}
                              alt="Preview"
                              width={200}
                              height={200}
                              className="mx-auto rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => field.onChange("")}
                              className="text-red-600 text-sm hover:text-red-700"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                            >
                              Choose Image
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.image.message)}</p>
                  )}
                </div>
              )}

              {/* Sub-category specific fields - simplified for multiple subcategories */}
              {watchedIsSubCategory && (
                <>
                  {/* Sub-category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                      Sub-category Name
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Enter sub-category name"
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
                    )}
                  </div>

                  {/* Sub-category Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                      Sub-category Image
                    </label>
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {field.value ? (
                            <div className="space-y-2">
                              <img
                                src={field.value}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg mx-auto"
                              />
                              <button
                                type="button"
                                onClick={() => field.onChange("")}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove Image
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                              <button
                                type="button"
                                onClick={() => document.getElementById('subcategory-image-upload')?.click()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Choose Image
                              </button>
                              <input
                                id="subcategory-image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">{String(errors.image.message)}</p>
                    )}
                  </div>
                </>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.status.message)}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {isSubmitting ? "Adding..." : (watchedIsSubCategory ? "Add Sub-category" : "Add Category")}
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center">
                  <Image
                    src={previewImage}
                    alt="Category Image Preview"
                    width={800}
                    height={600}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deleteItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleDeleteCancel}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.3, 
                ease: [0.25, 0.46, 0.45, 0.94],
                scale: { duration: 0.25 }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete {deleteItem.type === 'category' ? 'Category' : 'Sub-category'}</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{deleteItem.name}"</span>? 
                {deleteItem.type === 'category' && " This will also delete all associated sub-categories."}
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
