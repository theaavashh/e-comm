'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Eye, Edit3, Upload, X, Image as ImageIcon, Video, Link as LinkIcon, Plus, Trash2, Edit, Eye as ViewIcon, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  file: File | string;
  url: string;
  name: string;
  category: string;
  redirectUrl: string;
  altText: string;
  description: string;
  isActive: boolean;
  uploadedAt: string;
}

const mediaCategories = [
  'Banners',
  'Products',
  'Gallery',
  'Testimonials',
  'Partners',
  'Events',
  'News',
  'Other'
];

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [showPreview, setShowPreview] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media items on component mount
  useEffect(() => {
    loadMediaItems();
  }, []);

  const loadMediaItems = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockData: MediaItem[] = [
        {
          id: '1',
          type: 'image',
          file: '',
          url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop',
          name: 'Banner Image 1',
          category: 'Banners',
          redirectUrl: '/products',
          altText: 'Special offer banner',
          description: 'Main banner for homepage',
          isActive: true,
          uploadedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'image',
          file: '',
          url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
          name: 'Product Gallery 1',
          category: 'Products',
          redirectUrl: '/products/wooden-bowls',
          altText: 'Wooden bowl set',
          description: 'Traditional wooden bowl collection',
          isActive: true,
          uploadedAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'video',
          file: '',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          name: 'Product Video 1',
          category: 'Products',
          redirectUrl: '/products/video-demo',
          altText: 'Product demonstration video',
          description: 'How to use our products',
          isActive: true,
          uploadedAt: new Date().toISOString()
        }
      ];
      
      setMediaItems(mockData);
    } catch (error) {
      console.error('Error loading media items:', error);
      toast.error('Failed to load media items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (files: FileList) => {
    const newItems: MediaItem[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 50MB.`);
        return;
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        toast.error(`File ${file.name} is not a supported image or video format.`);
        return;
      }

      const url = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: isImage ? 'image' : 'video',
        file: file,
        url: url,
        name: file.name.split('.')[0],
        category: 'Other',
        redirectUrl: '',
        altText: '',
        description: '',
        isActive: true,
        uploadedAt: new Date().toISOString()
      };
      
      newItems.push(newItem);
    });

    if (newItems.length > 0) {
      setMediaItems(prev => [...prev, ...newItems]);
      toast.success(`${newItems.length} file(s) uploaded successfully!`);
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
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    toast.success('Media item deleted successfully!');
  };

  const filteredMediaItems = selectedCategory === 'All' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  const handleSave = async () => {
    setIsUploading(true);
    try {
      // In a real app, this would save to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Media items saved successfully!');
    } catch (error) {
      console.error('Error saving media items:', error);
      toast.error('Failed to save media items');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Media Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Media Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
            <p className="text-gray-600">Upload and manage images, videos, and their settings</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUploading ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Media Files</h2>
            <p className="text-sm text-gray-600">Upload multiple images and videos. Supported formats: JPG, PNG, GIF, MP4, MOV, AVI</p>
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } hover:border-gray-400`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Multiple Media Files</h3>
            <p className="text-gray-600 mb-4">Drag and drop files here, or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Choose Files
            </button>
            <p className="text-xs text-gray-500 mt-3">Multiple files supported • Max 50MB per file</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by category:</span>
            {['All', ...mediaCategories].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Media Library ({filteredMediaItems.length} items)
            </h2>
          </div>
          
          {filteredMediaItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media items found</h3>
              <p className="text-gray-600">Upload some files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMediaItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Media Preview */}
                  <div className="relative mb-3">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-32 object-cover rounded-lg"
                        controls
                      />
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => setShowPreview(item)}
                        className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-colors"
                      >
                        <ViewIcon className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteMediaItem(item.id)}
                        className="bg-red-500 bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    {item.redirectUrl && (
                      <div className="flex items-center text-xs text-blue-600">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        <span className="truncate">{item.redirectUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Media Item</h2>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Media Preview */}
                  <div className="flex justify-center">
                    {editingItem.type === 'image' ? (
                      <img
                        src={editingItem.url}
                        alt={editingItem.altText || editingItem.name}
                        className="max-w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={editingItem.url}
                        className="max-w-full h-48 object-cover rounded-lg"
                        controls
                      />
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      >
                        {mediaCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Redirect URL
                    </label>
                    <input
                      type="url"
                      value={editingItem.redirectUrl}
                      onChange={(e) => setEditingItem({...editingItem, redirectUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="https://example.com or /products"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={editingItem.altText}
                      onChange={(e) => setEditingItem({...editingItem, altText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="Alternative text for accessibility"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="Brief description of the media"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingItem.isActive}
                      onChange={(e) => setEditingItem({...editingItem, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateMediaItem(editingItem.id, editingItem);
                      setEditingItem(null);
                      toast.success('Media item updated successfully!');
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Media Preview</h2>
                  <button
                    onClick={() => setShowPreview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Media Display */}
                  <div className="flex justify-center">
                    {showPreview.type === 'image' ? (
                      <img
                        src={showPreview.url}
                        alt={showPreview.altText || showPreview.name}
                        className="max-w-full max-h-96 object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        src={showPreview.url}
                        className="max-w-full max-h-96 object-contain rounded-lg"
                        controls
                        autoPlay
                      />
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{showPreview.name}</h3>
                      <p className="text-sm text-gray-600">{showPreview.category}</p>
                    </div>
                    <div>
                      {showPreview.redirectUrl && (
                        <a
                          href={showPreview.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {showPreview.redirectUrl}
                        </a>
                      )}
                    </div>
                  </div>

                  {showPreview.description && (
                    <p className="text-gray-600">{showPreview.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
