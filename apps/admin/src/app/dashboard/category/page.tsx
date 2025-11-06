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
  image: string;
  internalLink?: string;
  createdAt: string;
  status: 'active' | 'inactive';
  parentId?: string;
  subCategories?: Category[];
  isSubCategory?: boolean;
  // New fields for sub-categories
  totalQuantity?: number;
  availableUnits?: number;
  // New fields for nested subcategories
  level?: number; // 0 = main category, 1 = subcategory, 2 = sub-subcategory, etc.
  hasChildren?: boolean;
}

export default function CategoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [subCategoryPagination, setSubCategoryPagination] = useState<{[key: string]: {currentPage: number, itemsPerPage: number}}>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{id: string, name: string, type: 'category' | 'subcategory'} | null>(null);
  const router = useRouter();

  // Categories state - now loaded from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

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
      internalLink: "",
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [creationStep, setCreationStep] = useState<'main' | 'sub' | 'nested'>('main');
  const [lastCreatedCategoryId, setLastCreatedCategoryId] = useState<string | null>(null);

  // Clear internal link when switching to subcategory creation
  useEffect(() => {
    if (creationStep !== 'main') {
      setValue('internalLink', '');
    }
  }, [creationStep, setValue]);
  
  // Pagination state for nested subcategories
  const [nestedPagination, setNestedPagination] = useState<{[key: string]: {currentPage: number, itemsPerPage: number}}>({});
  
  // State to track which subcategories are expanded to show all items
  const [expandedSubCategories, setExpandedSubCategories] = useState<{[key: string]: boolean}>({});

  // Helper functions for nested pagination
  const getNestedPagination = (subCategoryId: string) => {
    return nestedPagination[subCategoryId] || { currentPage: 1, itemsPerPage: 3 };
  };

  const setNestedPaginationForSubCategory = (subCategoryId: string, pagination: {currentPage: number, itemsPerPage: number}) => {
    setNestedPagination(prev => ({
      ...prev,
      [subCategoryId]: pagination
    }));
  };

  const handleNestedPageChange = (subCategoryId: string, page: number) => {
    setNestedPaginationForSubCategory(subCategoryId, {
      ...getNestedPagination(subCategoryId),
      currentPage: page
    });
  };

  // Helper functions for subcategory pagination
  const getSubCategoryPagination = (categoryId: string) => {
    return subCategoryPagination[categoryId] || { currentPage: 1, itemsPerPage: 3 };
  };

  const setSubCategoryPaginationForCategory = (categoryId: string, pagination: {currentPage: number, itemsPerPage: number}) => {
    setSubCategoryPagination(prev => ({
      ...prev,
      [categoryId]: pagination
    }));
  };

  const handleSubCategoryPageChange = (categoryId: string, page: number) => {
    setSubCategoryPaginationForCategory(categoryId, {
      ...getSubCategoryPagination(categoryId),
      currentPage: page
    });
  };

  // Toggle expanded state for subcategories
  const toggleSubCategoryExpansion = (subCategoryId: string) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId]
    }));
  };

  // API Functions
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
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
          image: cat.image || '/image.png',
          internalLink: cat.internalLink || null,
          createdAt: new Date(cat.createdAt).toISOString().split('T')[0],
          status: cat.isActive ? 'active' : 'inactive',
          parentId: cat.parentId,
          level: 0, // Main categories are level 0
          hasChildren: cat.children && cat.children.length > 0,
          subCategories: cat.children?.map((child: any) => ({
            id: child.id,
            name: child.name,
            description: child.description || '',
            image: child.image || '/image.png',
            internalLink: child.internalLink || null,
            createdAt: new Date(child.createdAt).toISOString().split('T')[0],
            status: child.isActive ? 'active' : 'inactive',
            parentId: child.parentId,
            isSubCategory: true,
            level: 1, // First level subcategories are level 1
            hasChildren: child.children && child.children.length > 0,
            totalQuantity: child._count?.products || 0,
            availableUnits: child._count?.products || 0,
            // Recursively handle nested subcategories
            subCategories: child.children?.map((grandChild: any) => ({
              id: grandChild.id,
              name: grandChild.name,
              description: grandChild.description || '',
              image: grandChild.image || '/image.png',
              internalLink: grandChild.internalLink || null,
              createdAt: new Date(grandChild.createdAt).toISOString().split('T')[0],
              status: grandChild.isActive ? 'active' : 'inactive',
              parentId: grandChild.parentId,
              isSubCategory: true,
              level: 2, // Second level subcategories are level 2
              hasChildren: grandChild.children && grandChild.children.length > 0,
              totalQuantity: grandChild._count?.products || 0,
              availableUnits: grandChild._count?.products || 0,
              subCategories: grandChild.children || []
            })) || []
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
      
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Request URL:', `${API_BASE_URL}/api/v1/categories`);
      console.log('Request data:', {
        name: categoryData.name,
        image: categoryData.image,
        internalLink: categoryData.internalLink || null,
        parentId: categoryData.parentId || null,
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: categoryData.name,
          image: categoryData.image,
          internalLink: categoryData.internalLink || null,
          parentId: categoryData.parentId || null,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        console.error('Response not ok:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          bodyUsed: response.bodyUsed
        });
        
        let errorData;
        try {
          // Clone the response to avoid consuming it
          const responseClone = response.clone();
          const responseText = await responseClone.text();
          console.error('Raw response text:', responseText);
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        const errorMessage = errorData.error || errorData.message || errorData.error || `Failed to create category: ${response.statusText}`;
        console.error('Category creation error:', { 
          status: response.status, 
          statusText: response.statusText, 
          errorData,
          errorMessage
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.success) {
        // Store the created category ID
        setLastCreatedCategoryId(data.data.category.id);
        
        // Optimistic update - add the new category to the existing state
        const newCategory = data.data.category;
        const transformedCategory: Category = {
          id: newCategory.id,
          name: newCategory.name,
          image: newCategory.image || '/image.png',
          internalLink: newCategory.internalLink || null,
          createdAt: new Date(newCategory.createdAt).toISOString().split('T')[0],
          status: newCategory.isActive ? 'active' : 'inactive',
          parentId: newCategory.parentId,
          level: newCategory.parentId ? 1 : 0,
          hasChildren: false,
          subCategories: [],
          totalQuantity: 0,
          availableUnits: 0
        };

        if (newCategory.parentId) {
          // This is a subcategory - find the parent and add it
          setCategories(prevCategories => 
            prevCategories.map(category => {
              if (category.id === newCategory.parentId) {
                return {
                  ...category,
                  subCategories: [...(category.subCategories || []), transformedCategory],
                  hasChildren: true
                };
              }
              // Check if it's a nested subcategory
              if (category.subCategories) {
                const updatedSubCategories = category.subCategories.map(subCategory => {
                  if (subCategory.id === newCategory.parentId) {
                    return {
                      ...subCategory,
                      subCategories: [...(subCategory.subCategories || []), transformedCategory],
                      hasChildren: true
                    };
                  }
                  return subCategory;
                });
                return {
                  ...category,
                  subCategories: updatedSubCategories
                };
              }
              return category;
            })
          );
        } else {
          // This is a main category - add it to the top level
          setCategories(prevCategories => [...prevCategories, transformedCategory]);
        }
        
        toast.success('Category created successfully!');
        return { success: true, categoryId: data.data.category.id };
      } else {
        throw new Error(data.message || 'Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create category');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, categoryData: any) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: categoryData.name,
          image: categoryData.image,
          internalLink: categoryData.internalLink || null,
          isActive: categoryData.status === 'active',
          parentId: categoryData.parentId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Failed to update category: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Optimistic update - update the category in the state
        const updatedCategory = data.data.category;
        const transformedCategory: Category = {
          id: updatedCategory.id,
          name: updatedCategory.name,
          image: updatedCategory.image || '/image.png',
          internalLink: updatedCategory.internalLink || null,
          createdAt: new Date(updatedCategory.createdAt).toISOString().split('T')[0],
          status: updatedCategory.isActive ? 'active' : 'inactive',
          parentId: updatedCategory.parentId,
          level: updatedCategory.parentId ? 1 : 0,
          hasChildren: false,
          subCategories: [],
          totalQuantity: 0,
          availableUnits: 0
        };

        setCategories(prevCategories => 
          prevCategories.map(category => {
            // Check if this is the main category being updated
            if (category.id === categoryId) {
              return { ...category, ...transformedCategory };
            }
            
            // Check subcategories
            if (category.subCategories) {
              const updatedSubCategories = category.subCategories.map(subCategory => {
                if (subCategory.id === categoryId) {
                  return { ...subCategory, ...transformedCategory };
                }
                
                // Check nested subcategories
                if (subCategory.subCategories) {
                  const updatedNestedSubCategories = subCategory.subCategories.map(nestedSubCategory => {
                    if (nestedSubCategory.id === categoryId) {
                      return { ...nestedSubCategory, ...transformedCategory };
                    }
                    return nestedSubCategory;
                  });
                  
                  return {
                    ...subCategory,
                    subCategories: updatedNestedSubCategories
                  };
                }
                
                return subCategory;
              });
              
              return {
                ...category,
                subCategories: updatedSubCategories
              };
            }
            
            return category;
          })
        );
        
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
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || `Failed to delete category: ${response.statusText}`;
        // Gracefully handle known constraint errors without throwing
        if (errorMessage.toLowerCase().includes('existing products')) {
          toast.error('Cannot delete category: remove or reassign products linked to it first.');
          return false;
        }
        toast.error(errorMessage);
        return false;
      }

      const data = await response.json();
      
      if (data.success) {
        // Optimistic update - remove the category from the state
        setCategories(prevCategories => 
          prevCategories
            .filter(category => category.id !== categoryId) // Remove main category if it matches
            .map(category => {
              // Check subcategories
              if (category.subCategories) {
                const updatedSubCategories = category.subCategories
                  .filter(subCategory => subCategory.id !== categoryId) // Remove subcategory if it matches
                  .map(subCategory => {
                    // Check nested subcategories
                    if (subCategory.subCategories) {
                      const updatedNestedSubCategories = subCategory.subCategories
                        .filter(nestedSubCategory => nestedSubCategory.id !== categoryId); // Remove nested subcategory if it matches
                      
                      return {
                        ...subCategory,
                        subCategories: updatedNestedSubCategories,
                        hasChildren: updatedNestedSubCategories.length > 0
                      };
                    }
                    
                    return subCategory;
                  });
                
                return {
                  ...category,
                  subCategories: updatedSubCategories,
                  hasChildren: updatedSubCategories.length > 0
                };
              }
              
              return category;
            })
        );
        
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

  // Sync selectedMainCategory with form's parentId
  useEffect(() => {
    const parentId = getValues('parentId');
    if (parentId && parentId !== selectedMainCategory) {
      setSelectedMainCategory(parentId);
    }
  }, [watchedParentId, selectedMainCategory, getValues]);

  // Remove handleInputChange as React Hook Form handles this automatically

  // Handle main category selection for hierarchical selection
  const handleMainCategoryChange = (mainCategoryId: string) => {
    setSelectedMainCategory(mainCategoryId);
    
    // Find the selected main category and get its sub-categories
    const mainCategory = categories.find(cat => cat.id === mainCategoryId);
    if (mainCategory && mainCategory.subCategories) {
      setAvailableSubCategories(mainCategory.subCategories);
      setSelectedParentCategory(mainCategory);
    } else {
      setAvailableSubCategories([]);
      setSelectedParentCategory(null);
    }
    
    // Reset sub-category selection when main category changes
    setValue('parentId', mainCategoryId);
  };

  // Handle subcategory selection for nested levels
  const handleSubCategoryChange = (subCategoryId: string) => {
    // Find the selected subcategory
    const subCategory = availableSubCategories.find(cat => cat.id === subCategoryId);
    if (subCategory) {
      setSelectedParentCategory(subCategory);
      setValue('parentId', subCategoryId);
    }
  };

  // Get all available parent categories for selection (flattened hierarchy)
  const getAllAvailableParents = () => {
    const parents: Category[] = [];
    
    // Add main categories
    categories.forEach(mainCat => {
      parents.push(mainCat);
      
      // Add first level subcategories
      if (mainCat.subCategories) {
        mainCat.subCategories.forEach(subCat => {
          parents.push(subCat);
          
          // Add second level subcategories
          if (subCat.subCategories) {
            subCat.subCategories.forEach(nestedCat => {
              parents.push(nestedCat);
            });
          }
        });
      }
    });
    
    return parents;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading image:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        apiUrl: `${API_BASE_URL}/api/v1/upload/category`
      });

      // Upload to Cloudinary via API
      const response = await fetch(`${API_BASE_URL}/api/v1/upload/category`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload image';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('Upload error details:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage
        });
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        setValue('image', result.data.url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Creation step:', creationStep);
    console.log('Parent ID:', data.parentId);
    console.log('Selected parent category:', selectedParentCategory);
    console.log('Is subcategory:', creationStep !== 'main');
    console.log('Internal link value:', data.internalLink);
    
    // Validate required fields
    if (!data.name) {
      toast.error('Name is required');
      return;
    }
    if (!data.image) {
      toast.error('Image is required');
      return;
    }
    // Internal link is only required for main categories
    // Check if this is a main category (either during creation or editing)
    const isMainCategory = editingCategory ? !editingCategory.parentId : (creationStep === 'main');
    
    if (isMainCategory && (!data.internalLink || data.internalLink.trim() === '')) {
      toast.error('Internal link is required for main categories');
      return;
    }
    if (creationStep !== 'main' && !data.parentId) {
      toast.error('Please select a parent category');
      return;
    }
    
    // Set isSubCategory based on creation step
    // Determine if this is a subcategory based on editing context or creation step
    const isSubCategory = editingCategory ? !!editingCategory.parentId : (creationStep !== 'main');
    
    const formData = {
      ...data,
      isSubCategory: isSubCategory,
      // Clear internal link for subcategories since it's not needed
      internalLink: isSubCategory ? null : data.internalLink
    };
    
    if (editingCategory) {
      // Update existing category
      const success = await updateCategory(editingCategory.id, formData);
      if (success) {
        setShowEditModal(false);
        setEditingCategory(null);
        reset({
          name: "",
          image: "",
          internalLink: "",
          status: "active",
          parentId: "",
          isSubCategory: false
        });
        setSelectedMainCategory('');
        setAvailableSubCategories([]);
        setSelectedParentCategory(null);
        setCreationStep('main');
      }
    } else {
      // Create new category
      const result = await createCategory(formData);
      if (result.success) {
        // After successful creation, move to next step or close modal
        if (creationStep === 'main') {
          // Use the created category ID as parent for sub-category
          setValue('parentId', result.categoryId);
          // Find the created category in the updated categories list
          const createdMainCategory = categories.find(cat => cat.id === result.categoryId);
          if (createdMainCategory) {
            setSelectedParentCategory(createdMainCategory);
          }
          setCreationStep('sub');
          setValue('name', '');
          setValue('image', '');
          toast.success('Main category created! Now you can add sub-categories.');
        } else if (creationStep === 'sub') {
          // Use the created category ID as parent for nested sub-category
          setValue('parentId', result.categoryId);
          // Find the created category in the updated categories list
          const createdSubCategory = categories.find(cat => 
            cat.subCategories?.some(sub => sub.id === result.categoryId)
          )?.subCategories?.find(sub => sub.id === result.categoryId);
          if (createdSubCategory) {
            setSelectedParentCategory(createdSubCategory);
          }
          setCreationStep('nested');
          setValue('name', '');
          setValue('image', '');
          toast.success('Sub-category created! Now you can add sub-subcategories.');
        } else {
      setShowAddModal(false);
      reset({
        name: "",
        image: "",
        internalLink: "",
        status: "active",
        parentId: "",
        isSubCategory: false
      });
      setSelectedMainCategory('');
      setAvailableSubCategories([]);
          setSelectedParentCategory(null);
          setCreationStep('main');
          toast.success('Sub-subcategory created successfully!');
        }
      }
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
    if (imageUrl) {
      // Handle both data URLs and Cloudinary URLs
      const displayUrl = imageUrl.startsWith('data:') 
        ? imageUrl 
        : imageUrl.startsWith('https://res.cloudinary.com')
        ? imageUrl
        : imageUrl.startsWith('http')
        ? imageUrl
        : `${API_BASE_URL}${imageUrl}`;
      
      setPreviewImage(displayUrl);
    setShowImagePreview(true);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('image', category.image || '');
    setValue('internalLink', category.internalLink || '');
    setValue('status', category.status);
    setValue('isSubCategory', !!category.parentId);
    setValue('parentId', category.parentId || '');
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    reset({
      name: "",
      image: "",
      internalLink: "",
      status: "active",
      parentId: "",
      isSubCategory: false
    });
    setSelectedMainCategory('');
    setAvailableSubCategories([]);
    setSelectedParentCategory(null);
    setCreationStep('main');
    setLastCreatedCategoryId(null);
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
    reset({
      name: "",
      image: "",
      internalLink: "",
      status: "active",
      parentId: "",
      isSubCategory: false
    });
    setSelectedMainCategory('');
    setAvailableSubCategories([]);
    setSelectedParentCategory(null);
    setCreationStep('main');
    setLastCreatedCategoryId(null);
  };

  const filteredCategories = categories.filter(category => {
    // Only show main categories (no parentId)
    if (category.parentId) return false;
    
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Also check sub-categories
    const subCategoryMatches = category.subCategories?.some(subCat =>
      subCat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
            />
          </div>
          <button
            onClick={() => {
              reset({
                name: "",
                image: "",
                internalLink: "",
                status: "active",
                parentId: "",
                isSubCategory: false
              });
              setSelectedMainCategory('');
              setAvailableSubCategories([]);
              setSelectedParentCategory(null);
              setCreationStep('main');
              setLastCreatedCategoryId(null);
              setShowAddModal(true);
            }}
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
                  onClick={() => {
              reset({
                name: "",
                image: "",
                internalLink: "",
                status: "active",
                parentId: "",
                isSubCategory: false
              });
              setSelectedMainCategory('');
                    setAvailableSubCategories([]);
                    setSelectedParentCategory(null);
                    setCreationStep('main');
                    setLastCreatedCategoryId(null);
              setShowAddModal(true);
            }}
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
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
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
                    <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status}
                    </span>
          {/* Image Preview Button */}
            <button
              onClick={() => handleImagePreview(category.image)}
                        className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
              title="Preview Image"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Created: {category.createdAt}</p>
                  
                  {/* Internal Link - Prominently Displayed */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-xs font-medium text-blue-700">Internal Link</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded">
                        {category.internalLink || 'No link set'}
                      </code>
                      {category.internalLink && (
                        <a 
                          href={category.internalLink} 
                          target={category.internalLink.startsWith('http') ? '_blank' : '_self'}
                          rel={category.internalLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Open link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleEditClick(category)}
                      className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Add Sub clicked for category:', category.id);
                        setValue('isSubCategory', true);
                        setValue('parentId', category.id);
                        setSelectedMainCategory(category.id);
                        setSelectedParentCategory(category);
                        setCreationStep('sub');
                        setShowAddModal(true);
                        console.log('Form values after setting:', {
                          isSubCategory: watch('isSubCategory'),
                          parentId: watch('parentId')
                        });
                      }}
                      className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-100 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Sub</span>
                    </button>
            <button
              onClick={() => handleDeleteClick(category.id, category.name, 'category')}
                      className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-100 transition-colors flex items-center space-x-1"
            >
                      <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
                  </div>
                </div>
              </motion.div>

              {/* Sub-categories */}
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Sub-categories:</h4>
                    <span className="text-xs text-gray-500">
                      {category.subCategories.length} items
                    </span>
                  </div>
                  
                  {/* Paginated Subcategories */}
                  <div className="space-y-2">
                    {(() => {
                      const pagination = getSubCategoryPagination(category.id);
                      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
                      const endIndex = startIndex + pagination.itemsPerPage;
                      const paginatedSubCategories = (category.subCategories || []).slice(startIndex, endIndex);
                      
                      return paginatedSubCategories.map((subCategory, subIndex) => (
                        <div key={subCategory.id} className="space-y-2">
                          {/* First Level Subcategory */}
                      <motion.div 
                        className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: subIndex * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                      >
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-gray-900">{subCategory.name}</h5>
                                <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              subCategory.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subCategory.status}
                            </span>
                                  {subCategory.hasChildren && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                      Has {subCategory.subCategories?.length || 0} sub-items
                                    </span>
                                  )}
                                </div>
                          </div>

                          
                          {/* Action Buttons Row */}
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleImagePreview(subCategory.image)}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-300"
                              title="Preview Image"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleEditClick(subCategory)}
                              className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors flex items-center space-x-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                                <button 
                                  onClick={() => {
                                    console.log('Add Sub clicked for subcategory:', subCategory.id);
                                    setValue('isSubCategory', true);
                                    setValue('parentId', subCategory.id);
                                    setSelectedMainCategory(subCategory.parentId || subCategory.id);
                                    setSelectedParentCategory(subCategory);
                                    setCreationStep('nested');
                                    setShowAddModal(true);
                                  }}
                                  className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-100 transition-colors flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Sub</span>
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

                          {/* Second Level Subcategories (Nested) */}
                          {subCategory.subCategories && subCategory.subCategories.length > 0 && (
                            <div className="ml-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <h6 className="text-xs font-medium text-gray-600 ml-2">Sub-items:</h6>
                                <span className="text-xs text-gray-500">
                                  {subCategory.subCategories.length} items
                                </span>
                              </div>
                              
                              {/* Simplified Display for Nested Subcategories */}
                              <div className="space-y-2">
                                {(() => {
                                  const isExpanded = expandedSubCategories[subCategory.id] || false;
                                  const displayItems = isExpanded 
                                    ? subCategory.subCategories 
                                    : subCategory.subCategories.slice(0, 3);
                                  const hasMoreItems = subCategory.subCategories.length > 3;
                                  
                                  return (
                                    <>
                                      {displayItems.map((nestedSubCategory, nestedIndex) => (
                                        <motion.div 
                                          key={nestedSubCategory.id}
                                          className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: (subIndex * 0.1) + (nestedIndex * 0.05) }}
                                          whileHover={{ y: -1, scale: 1.005 }}
                                        >
                                          <div className="p-3">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                <h6 className="text-sm font-semibold text-gray-900 truncate">{nestedSubCategory.name}</h6>
                                              </div>
                                            </div>
                                            
                                            {/* Action Buttons Row for Nested - No Add Sub */}
                                            <div className="flex flex-wrap gap-1">
                                              <button
                                                onClick={() => handleImagePreview(nestedSubCategory.image)}
                                                className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors flex items-center justify-center border border-blue-300"
                                                title="Preview Image"
                                              >
                                                <Eye className="w-3 h-3" />
                                              </button>
                                              <button 
                                                onClick={() => handleEditClick(nestedSubCategory)}
                                                className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors flex items-center space-x-1"
                                              >
                                                <Edit className="w-3 h-3" />
                                                <span>Edit</span>
                                              </button>
                                              <button 
                                                onClick={() => handleDeleteClick(nestedSubCategory.id, nestedSubCategory.name, 'subcategory')}
                              className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-100 transition-colors flex items-center space-x-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                                      
                                      {/* See More Button */}
                                      {hasMoreItems && !isExpanded && (
                                        <motion.button
                                          onClick={() => toggleSubCategoryExpansion(subCategory.id)}
                                          className="w-full py-2 px-4 bg-blue-100 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3 }}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <span className="text-sm font-medium">
                                            See More ({subCategory.subCategories.length - 3} more items)
                                          </span>
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </motion.button>
                                      )}
                                      
                                      {/* See Less Button */}
                                      {hasMoreItems && isExpanded && (
                                        <motion.button
                                          onClick={() => toggleSubCategoryExpansion(subCategory.id)}
                                          className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3 }}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <span className="text-sm font-medium">See Less</span>
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                          </svg>
                                        </motion.button>
                                      )}
                                    </>
                                  );
                                })()}
                  </div>

                            </div>
                          )}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Pagination for Subcategories - Always at bottom */}
                  {(() => {
                    const pagination = getSubCategoryPagination(category.id);
                    const totalPages = Math.ceil((category.subCategories || []).length / pagination.itemsPerPage);
                    
                    if (totalPages > 1) {
                      return (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-700">
                            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, (category.subCategories || []).length)} of {(category.subCategories || []).length} subcategories
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* Previous Button */}
                            <button
                              onClick={() => handleSubCategoryPageChange(category.id, pagination.currentPage - 1)}
                              disabled={pagination.currentPage === 1}
                              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex space-x-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handleSubCategoryPageChange(category.id, page)}
                                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    pagination.currentPage === page
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
                              onClick={() => handleSubCategoryPageChange(category.id, pagination.currentPage + 1)}
                              disabled={pagination.currentPage === totalPages}
                              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* Main Pagination - Always at bottom */}
        {filteredCategories.length > itemsPerPage && (
          <motion.div 
            className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200"
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleAddCancel();
              }
            }}
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
              <div>
              <h2 className="text-xl font-bold text-gray-900">
                  {creationStep === 'main' ? 'Add New Category' : 
                   creationStep === 'sub' ? 'Add Sub-category' : 
                   'Add Sub-subcategory'}
              </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {creationStep === 'main' ? 'Create a main category first' : 
                   creationStep === 'sub' ? 'Add a subcategory to the selected parent' : 
                   'Add a subcategory to the selected subcategory'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setCreationStep('main');
                  setSelectedParentCategory(null);
                }}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Step Indicator */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`flex items-center space-x-2 ${creationStep === 'main' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    creationStep === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                    </div>
                  <span className="text-sm font-medium">Main Category</span>
              </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center space-x-2 ${creationStep === 'sub' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    creationStep === 'sub' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Sub-category</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center space-x-2 ${creationStep === 'nested' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    creationStep === 'nested' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Sub-subcategory</span>
                </div>
              </div>

              {/* Parent Selection - Only show if not creating main category */}
              {creationStep !== 'main' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {creationStep === 'sub' ? 'Select Main Category' : 'Select Sub-category'}
                  </label>
                  <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          const selectedParent = creationStep === 'sub' 
                            ? categories.find(cat => cat.id === e.target.value)
                            : getAllAvailableParents().filter(cat => cat.level === 1).find(cat => cat.id === e.target.value);
                          if (selectedParent) {
                            setSelectedParentCategory(selectedParent);
                            setSelectedMainCategory(selectedParent.parentId || selectedParent.id);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="">
                          {creationStep === 'sub' ? 'Choose a main category' : 'Choose a sub-category'}
                          </option>
                        {creationStep === 'sub' 
                          ? categories.filter(cat => !cat.parentId).map(category => (
                              <option key={category.id} value={category.id}>
                                📁 {category.name}
                              </option>
                            ))
                          : getAllAvailableParents().filter(cat => cat.level === 1).map(category => (
                              <option key={category.id} value={category.id}>
                                └─ {category.name}
                              </option>
                            ))
                        }
                      </select>
                    )}
                  />
                  {errors.parentId && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.parentId.message)}</p>
                  )}
                  
                  {/* Show selected parent info */}
                  {selectedParentCategory && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-900">
                          Selected: {selectedParentCategory.name}
                        </span>
                        <span className="text-xs text-blue-600">
                          (Level {selectedParentCategory.level || 0})
                        </span>
                      </div>
                      {selectedParentCategory.hasChildren && (
                        <p className="text-xs text-blue-600 mt-1">
                          This category has {selectedParentCategory.subCategories?.length || 0} existing sub-items
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}


              {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-black custom-font">
                  {creationStep === 'main' ? 'Category Name' : 
                   creationStep === 'sub' ? 'Sub-category Name' : 
                   'Sub-subcategory Name'} <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                      placeholder={
                        creationStep === 'main' ? 'Enter category name' : 
                        creationStep === 'sub' ? 'Enter sub-category name' : 
                        'Enter sub-subcategory name'
                      }
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
                  )}
                </div>

              {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                  {creationStep === 'main' ? 'Category Image' : 
                   creationStep === 'sub' ? 'Sub-category Image' : 
                   'Sub-subcategory Image'} <span className="text-red-500">*</span>
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
                              className="mx-auto rounded-lg object-cover"
                            />
                            <div className="text-xs text-gray-500 text-center">
                              {field.value.startsWith('https://res.cloudinary.com') ? 'Cloudinary Image' : 'Local Image'}
                            </div>
                            <button
                              type="button"
                              onClick={() => field.onChange("")}
                                className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                                title="Remove Image"
                            >
                                <Trash2 className="w-4 h-4" />
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
                                disabled={isUploadingImage}
                            />
                            <label
                              htmlFor="image-upload"
                                className={`px-4 py-2 rounded-md cursor-pointer inline-block ${
                                  isUploadingImage 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                              >
                                {isUploadingImage ? 'Uploading...' : 'Choose Image'}
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

              {/* Internal Link - Only for main categories */}
              {creationStep === 'main' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-black custom-font">
                    Internal Link <span className="text-red-500">*</span>
                    </label>
                    <Controller
                  name="internalLink"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                      placeholder="e.g., /foods, /products/electronics, https://example.com"
                        />
                      )}
                    />
                {errors.internalLink && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.internalLink.message)}</p>
                    )}
                  <p className="text-xs text-gray-500 mt-1">
                    Required. Enter a relative path (e.g., /foods) or full URL for internal navigation.
                  </p>
                            </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
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
                  onClick={() => {
                    setShowAddModal(false);
                    setCreationStep('main');
                    setSelectedParentCategory(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {isSubmitting ? "Adding..." : 
                   creationStep === 'main' ? "Add Category" : 
                   creationStep === 'sub' ? "Add Sub-category" : 
                   "Add Sub-subcategory"}
                </button>
              </div>

              {/* Step Navigation */}
              {creationStep !== 'main' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (creationStep === 'nested') {
                          setCreationStep('sub');
                        } else if (creationStep === 'sub') {
                          setCreationStep('main');
                        }
                        setSelectedParentCategory(null);
                        setValue('parentId', '');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Back to {creationStep === 'nested' ? 'Sub-category' : 'Main Category'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (creationStep === 'sub') {
                          setCreationStep('nested');
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Next: Add Sub-subcategory →
                    </button>
                  </div>
                </div>
              )}
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleEditCancel();
              }
            }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 custom-font">Edit Category</h2>
                  <button
                    onClick={handleEditCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Category Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-black custom-font">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                          placeholder="Enter category name"
                        />
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>
                    )}
                  </div>


                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-black">
                      Category Image <span className="text-red-500">*</span>
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
                                className="mx-auto rounded-lg object-cover"
                              />
                              <div className="text-xs text-gray-500 text-center">
                                {field.value.startsWith('https://res.cloudinary.com') ? 'Cloudinary Image' : 'Local Image'}
                              </div>
                              <button
                                type="button"
                                onClick={() => field.onChange("")}
                                className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
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
                                id="edit-image-upload"
                                disabled={isUploadingImage}
                              />
                              <label
                                htmlFor="edit-image-upload"
                                className={`px-4 py-2 rounded-md cursor-pointer inline-block ${
                                  isUploadingImage 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                              >
                                {isUploadingImage ? 'Uploading...' : 'Choose Image'}
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

                  {/* Internal Link - Only for main categories */}
                  {!editingCategory?.parentId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-black custom-font">
                        Internal Link <span className="text-red-500">*</span>
                      </label>
                    <Controller
                      name="internalLink"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
                          placeholder="e.g., /foods, /products/electronics, https://example.com"
                        />
                      )}
                    />
                    {errors.internalLink && (
                      <p className="text-red-500 text-sm mt-1">{String(errors.internalLink.message)}</p>
                    )}
                      <p className="text-xs text-gray-500 mt-1">
                        Required. Enter a relative path (e.g., /foods) or full URL for internal navigation.
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                      Status
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
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
                      onClick={handleEditCancel}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                      {isSubmitting ? "Updating..." : "Update Category"}
                    </button>
                  </div>
                </form>
              </div>
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowImagePreview(false);
              }
            }}
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleDeleteCancel();
              }
            }}
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
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold">"{deleteItem.name}"</span>? 
                {deleteItem.type === 'category' && " This will also delete all associated sub-categories."}
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Warning:</p>
                    <p>This action will fail if there are products associated with this category or its subcategories. Please remove all products first before deleting.</p>
                  </div>
                </div>
              </div>
              
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
