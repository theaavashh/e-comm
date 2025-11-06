'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, Image as ImageIcon, Video, Link, X, ToggleLeft, ToggleRight, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';

const mediaSchema = z.object({
  linkTo: z.string().min(1, 'Link destination is required'),
  mediaType: z.enum(['image', 'video'], { required_error: 'Media type is required' }),
  internalLink: z.string().min(1, 'Internal link is required').regex(/^\/[a-zA-Z0-9\/-]*$/, 'Internal link must start with /'),
  file: z.any().optional(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

interface MediaItem {
  id: string;
  linkTo: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  internalLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const linkToOptions = [
  { value: 'category', label: 'Category' },
  { value: 'today-sales', label: 'Today Sales' },
  { value: 'for-you', label: 'For You' },
  { value: 'products', label: 'Products' },
  { value: 'brands', label: 'Brands' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' },
  { value: 'home', label: 'Home' },
  { value: 'special-offers', label: 'Special Offers' },
  { value: 'custom', label: 'Custom Link' },
];

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema)
  });

  const mediaType = watch('mediaType');

  useEffect(() => {
    fetchMediaItems();
  }, []);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    const totalPages = Math.ceil(mediaItems.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [mediaItems.length, currentPage, itemsPerPage]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/media`);
      if (!response.ok) throw new Error('Failed to fetch media items');
      
      const data = await response.json();
      setMediaItems(data.data.mediaItems || []);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error('Error fetching media items:', error);
      toast.error('Failed to fetch media items');
    } finally {
      setLoading(false);
    }
  };

  const uploadMediaFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/upload/media`, {
      method: 'POST',
      credentials: 'include', // Send httpOnly cookie automatically
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || errorData.error || 'Upload failed';
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data.data.url;
  };

  const onSubmit = async (data: MediaFormData) => {
    try {
      setUploading(true);
      
      let mediaUrl = '';
      
      if (data.file && data.file.length > 0) {
        // Upload new file
        mediaUrl = await uploadMediaFile(data.file[0]);
      } else if (editingItem) {
        // Keep existing URL when editing
        mediaUrl = editingItem.mediaUrl;
      } else {
        throw new Error('Please select a file');
      }

      const payload = {
        linkTo: data.linkTo,
        mediaType: data.mediaType.toUpperCase(), // Convert to uppercase for enum
        mediaUrl,
        internalLink: data.internalLink,
      };

      const url = editingItem 
        ? `${API_BASE_URL}/api/v1/media/${editingItem.id}`
        : `${API_BASE_URL}/api/v1/media`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || 'Failed to save media item';
        throw new Error(errorMessage);
      }

      toast.success(editingItem ? 'Media item updated successfully!' : 'Media item created successfully!');
      setShowModal(false);
      setEditingItem(null);
      reset();
      setPreviewUrl(null);
      fetchMediaItems();
    } catch (error) {
      console.error('Error saving media item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save media item');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setValue('linkTo', item.linkTo);
    setValue('mediaType', item.mediaType.toLowerCase() as 'image' | 'video');
    setValue('internalLink', item.internalLink);
    setPreviewUrl(item.mediaUrl);
    setShowModal(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || 'Failed to update media item status';
        throw new Error(errorMessage);
      }

      toast.success(`Media item ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchMediaItems();
    } catch (error) {
      console.error('Error updating media item status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update media item status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/media/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Send httpOnly cookie automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || 'Failed to delete media item';
        throw new Error(errorMessage);
      }

      toast.success('Media item deleted successfully!');
      fetchMediaItems();
    } catch (error) {
      console.error('Error deleting media item:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete media item');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const openModal = () => {
    setEditingItem(null);
    reset();
    setPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
    setPreviewUrl(null);
  };

  const getMediaIcon = (type: string) => {
    return type === 'VIDEO' ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />;
  };

  // Pagination logic
  const totalPages = Math.ceil(mediaItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = mediaItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout title="Media Management">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 custom-font">Media Management</h1>
                <p className="text-gray-600 mt-2 custom-font">Upload and manage images and videos with internal links</p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Grid View"
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={openModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 custom-font"
                >
                  <Plus className="w-5 h-5" />
                  Add Media
                </button>
              </div>
            </div>
          </div>

          {/* Media Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  {item.mediaType === 'IMAGE' ? (
                    <Image
                      src={item.mediaUrl}
                      alt={item.linkTo.replace('-', ' ')}
                      fill
                      className="object-cover"
                      />
                    ) : (
                      <video
                      src={item.mediaUrl}
                      className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                    {getMediaIcon(item.mediaType)}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 truncate capitalize custom-font mb-2">{item.linkTo.replace('-', ' ')}</h3>
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 custom-font">
                        <Link className="w-4 h-4" />
                        <span className="truncate">{item.internalLink}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className={`px-2 py-1 rounded-full custom-font ${
                          item.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                          }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(item.id, item.isActive)}
                        className={`p-1 rounded transition-colors ${
                          item.isActive 
                            ? 'text-green-600 hover:text-green-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(item.internalLink, '_blank')}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 custom-font"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {currentItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 relative flex-shrink-0">
                      {item.mediaType === 'IMAGE' ? (
                        <Image
                          src={item.mediaUrl}
                          alt={item.linkTo.replace('-', ' ')}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                        {getMediaIcon(item.mediaType)}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 capitalize custom-font mb-2">{item.linkTo.replace('-', ' ')}</h3>
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 custom-font">
                            <Link className="w-4 h-4" />
                            <span>{item.internalLink}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <span className={`px-2 py-1 rounded-full custom-font ${
                              item.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <button
                            onClick={() => handleToggleActive(item.id, item.isActive)}
                            className={`p-1 rounded transition-colors ${
                              item.isActive 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {item.isActive ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => window.open(item.internalLink, '_blank')}
                              className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 custom-font"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && mediaItems.length > itemsPerPage && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600 custom-font">
                Showing {startIndex + 1} to {Math.min(endIndex, mediaItems.length)} of {mediaItems.length} items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg border transition-colors custom-font ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500 custom-font">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {!loading && mediaItems.length === 0 && (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 custom-font">No media items yet</h3>
              <p className="text-gray-600 mb-4 custom-font">Upload your first image or video to get started</p>
              <button
                onClick={openModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors custom-font"
              >
                Add Media
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold custom-font">
                  {editingItem ? 'Edit Media Item' : 'Add Media Item'}
                </h2>
                  <button
                onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    Media Type *
                  </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-black custom-font">
                    <input
                      type="radio"
                      value="image"
                      {...register('mediaType')}
                      className="mr-2"
                    />
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Image
                  </label>
                  <label className="flex items-center text-black custom-font">
                    <input
                      type="radio"
                      value="video"
                      {...register('mediaType')}
                      className="mr-2"
                    />
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </label>
                </div>
                {errors.mediaType && (
                  <p className="text-red-500 text-sm mt-1 custom-font">{String(errors.mediaType.message)}</p>
                )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    File *
                  </label>
                <input
                  type="file"
                  accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                  {...register('file')}
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                {errors.file && (
                  <p className="text-red-500 text-sm mt-1 custom-font">{String(errors.file.message)}</p>
                )}
                </div>

                {previewUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                      Preview
                    </label>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {mediaType === 'video' ? (
                      <video
                        src={previewUrl}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    Link To *
                  </label>
                  <select
                    {...register('linkTo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black custom-font"
                  >
                    <option value="">Select destination</option>
                    {linkToOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.linkTo && (
                    <p className="text-red-500 text-sm mt-1 custom-font">{String(errors.linkTo.message)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                    Internal Link *
                  </label>
                  <input
                    type="text"
                    {...register('internalLink')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500 custom-font"
                    placeholder="/products/category/item"
                  />
                  <p className="text-sm text-gray-500 mt-1 custom-font">
                    Internal link should start with / (e.g., /products, /about)
                  </p>
                  {errors.internalLink && (
                    <p className="text-red-500 text-sm mt-1 custom-font">{String(errors.internalLink.message)}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors custom-font"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 custom-font"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editingItem ? 'Updating...' : 'Uploading...'}
                      </>
                    ) : (
                      editingItem ? 'Update Media' : 'Upload Media'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}