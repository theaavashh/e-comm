'use client';

import { useState, useEffect } from 'react';
import { Plus, Upload, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';

interface SliderImage {
  id: string;
  imageUrl: string;
  internalLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    imageUrl: '',
    internalLink: '',
    isActive: true
  });

  // Fetch sliders
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sliders');
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('Fetched sliders:', data.data.sliders);
        setSliders(data.data.sliders || []);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      toast.error('Failed to fetch sliders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/upload/slider`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(errorMessage);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sliderData = {
        imageUrl: formData.imageUrl,
        internalLink: formData.internalLink,
        isActive: formData.isActive,
        order: sliders.length + 1
      };

      const url = editingSlider 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders/${editingSlider.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders/test`;
      
      const method = editingSlider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sliderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Slider save error:', errorData);
        throw new Error(errorData.message || `Failed to save slider with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Optimistically update the list
        if (editingSlider) {
          // Update existing slider
          setSliders(prev => prev.map(s => s.id === editingSlider.id ? data.data.slider : s));
        } else {
          // Add new slider
          setSliders(prev => [...prev, data.data.slider]);
        }
        
        toast.success(editingSlider ? 'Slider updated successfully' : 'Slider created successfully');
        setShowModal(false);
        setEditingSlider(null);
        setFormData({
          imageUrl: '',
          internalLink: '',
          isActive: true
        });
      } else {
        throw new Error(data.message || 'Failed to save slider');
      }
    } catch (error) {
      console.error('Error saving slider:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save slider';
      toast.error(errorMessage);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setSliderToDelete(id);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!sliderToDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders/${sliderToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete error response:', errorData);
        throw new Error(errorData.message || `Failed to delete slider with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Optimistically remove from list
        setSliders(prev => prev.filter(s => s.id !== sliderToDelete));
        toast.success('Slider deleted successfully');
        setShowDeleteModal(false);
        setSliderToDelete(null);
      } else {
        throw new Error(data.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete slider';
      toast.error(errorMessage);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update slider');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Slider status updated');
        fetchSliders();
      }
    } catch (error) {
      console.error('Error updating slider:', error);
      toast.error('Failed to update slider');
    }
  };

  // Handle reorder
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentSlider = sliders.find(s => s.id === id);
    if (!currentSlider) return;

    const currentIndex = sliders.findIndex(s => s.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sliders.length) return;

    const newSliders = [...sliders];
    [newSliders[currentIndex], newSliders[newIndex]] = [newSliders[newIndex], newSliders[currentIndex]];

    // Update order values
    newSliders.forEach((slider, index) => {
      slider.order = index + 1;
    });

    setSliders(newSliders);

    // Update on server
    try {
      await Promise.all(
        newSliders.map(slider =>
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sliders/${slider.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ order: slider.order }),
          })
        )
      );
      toast.success('Slider order updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  // Open edit modal
  const openEditModal = (slider: SliderImage) => {
    setEditingSlider(slider);
    setFormData({
      imageUrl: slider.imageUrl,
      internalLink: slider.internalLink,
      isActive: slider.isActive
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      imageUrl: '',
      internalLink: '',
      isActive: true
    });
    setEditingSlider(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
              <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 custom-font">Slider Management</h1>
        <p className="text-gray-600 custom-font">Manage your website slider images and content</p>
      </div>

      {/* Add Slider Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 custom-font"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Slider</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider, index) => (
          <div key={slider.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              {slider.imageUrl ? (
                <img
                  src={slider.imageUrl.startsWith('http') ? slider.imageUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL}${slider.imageUrl}`}
                  alt={`Slider ${slider.order}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', slider.imageUrl);
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="flex items-center justify-center h-full" style={{ display: slider.imageUrl ? 'none' : 'flex' }}>
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slider.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {slider.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Order Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium custom-font">
                  #{slider.order}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {slider.internalLink && (
                <p className="text-blue-600 text-sm mb-3 truncate">Link: {slider.internalLink}</p>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReorder(slider.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(slider.id, 'down')}
                    disabled={index === sliders.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(slider.id, slider.isActive)}
                    className={`p-1 rounded ${
                      slider.isActive 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {slider.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => openEditModal(slider)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => openDeleteModal(slider.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sliders.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 custom-font">No sliders found</h3>
          <p className="text-gray-600 mb-4 custom-font">Get started by creating your first slider</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors custom-font"
          >
            Add New Slider
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-black custom-font">
              {editingSlider ? 'Edit Slider' : 'Add New Slider'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1 custom-font">
                  Image *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setFormData({ ...formData, imageUrl: url });
                        } catch (error) {
                          // Error already handled in handleImageUpload
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1 custom-font">
                  Internal Link
                </label>
                <input
                  type="text"
                  value={formData.internalLink}
                  onChange={(e) => setFormData({ ...formData, internalLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="/products/category-slug or /foods"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-black custom-font">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors custom-font"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !formData.imageUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors custom-font"
                >
                  {uploading ? 'Uploading...' : (editingSlider ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSliderToDelete(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-black custom-font">Delete Slider</h2>
            <p className="text-black mb-6 custom-font">
              Are you sure you want to delete this slider? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSliderToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors custom-font"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors custom-font"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
