'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Eye, Edit3, Upload, X, Image as ImageIcon, Link as LinkIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

interface PopupBannerData {
  id?: string;
  image: string;
  isActive: boolean;
  position: 'top' | 'center' | 'bottom';
  size: 'small' | 'medium' | 'large';
  lastUpdated: string;
}

export default function PopupBannerPage() {
  const [bannerData, setBannerData] = useState<PopupBannerData>({
    image: '',
    isActive: false,
    position: 'center',
    size: 'medium',
    lastUpdated: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load popup banner data on component mount
  useEffect(() => {
    loadPopupBannerData();
  }, []);

  const loadPopupBannerData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your API
      const mockData: PopupBannerData = {
        id: '1',
        image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=400&fit=crop',
        isActive: true,
        position: 'center',
        size: 'medium',
        lastUpdated: new Date().toISOString()
      };
      
      setBannerData(mockData);
    } catch (error) {
      console.error('Error loading popup banner data:', error);
      toast.error('Failed to load popup banner data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to your API
      const updatedData = {
        ...bannerData,
        lastUpdated: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBannerData(updatedData);
      setIsEditing(false);
      toast.success('Popup banner updated successfully!');
    } catch (error) {
      console.error('Error saving popup banner data:', error);
      toast.error('Failed to save popup banner data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewMode(false);
    // Reload original data
    loadPopupBannerData();
  };

  const handleInputChange = (field: keyof PopupBannerData, value: string | boolean) => {
    setBannerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('image', result);
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          handleInputChange('image', result);
          toast.success('Image uploaded successfully!');
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const removeImage = () => {
    handleInputChange('image', '');
    toast.success('Image removed');
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Pop-up Banner">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Pop-up Banner">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pop-up Banner Management</h1>
            <p className="text-gray-600">Create and manage pop-up banners for your website</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            {!isEditing && !previewMode && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${bannerData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {bannerData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {bannerData.lastUpdated ? new Date(bannerData.lastUpdated).toLocaleString() : 'Never'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleInputChange('isActive', !bannerData.isActive)}
                disabled={!isEditing}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                  bannerData.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
              >
                {bannerData.isActive ? (
                  <ToggleRight className="w-4 h-4" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {bannerData.isActive ? 'Active' : 'Inactive'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Preview</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                {bannerData.image ? (
                  <div className="relative">
                    <img
                      src={bannerData.image}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {bannerData.size.toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">

            {/* Image Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Banner Photo</h2>
                <p className="text-sm text-gray-600">Choose an image for your pop-up banner. Recommended size: 600x400px</p>
              </div>
              <div className="space-y-4">
                {bannerData.image ? (
                  <div className="relative">
                    <img
                      src={bannerData.image}
                      alt="Banner preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      disabled={!isEditing}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    } ${isEditing ? 'hover:border-gray-400' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Banner Photo</h3>
                    <p className="text-gray-600 mb-4">Drag and drop an image here, or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!isEditing}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Choose File
                    </button>
                    <p className="text-xs text-gray-500 mt-3">PNG, JPG, GIF up to 5MB • Recommended: 600x400px</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Display Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    value={bannerData.position}
                    onChange={(e) => handleInputChange('position', e.target.value as 'top' | 'center' | 'bottom')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 text-black"
                  >
                    <option value="top">Top</option>
                    <option value="center">Center</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={bannerData.size}
                    onChange={(e) => handleInputChange('size', e.target.value as 'small' | 'medium' | 'large')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 text-black"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end space-x-3 bg-gray-50 rounded-lg p-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !bannerData.image}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
