'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Edit3, Upload, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import toast from 'react-hot-toast';

interface AboutUsData {
  id?: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  lastUpdated: string;
}

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState<AboutUsData>({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    lastUpdated: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load about us data on component mount
  useEffect(() => {
    loadAboutUsData();
  }, []);

  const loadAboutUsData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      const mockData: AboutUsData = {
        id: '1',
        title: 'About Gharsamma',
        content: `# Welcome to Gharsamma

**Gharsamma** is your premier destination for authentic Nepali products, bringing the rich culture and traditions of Nepal right to your doorstep.

## Our Story

Founded with a passion for preserving and sharing Nepal's cultural heritage, Gharsamma has been serving customers worldwide with:

- **Authentic Products**: Handpicked items directly from local artisans
- **Quality Assurance**: Every product undergoes rigorous quality checks
- **Cultural Preservation**: Supporting local communities and traditional crafts
- **Global Reach**: Delivering Nepali culture to every corner of the world

## Our Mission

To bridge the gap between Nepal's rich cultural heritage and the global community by providing authentic, high-quality products that tell the story of our beautiful country.

## Our Values

- **Authenticity**: Every product is genuine and sourced directly from Nepal
- **Quality**: We maintain the highest standards in all our offerings
- **Community**: Supporting local artisans and preserving traditional crafts
- **Sustainability**: Promoting eco-friendly and sustainable practices

## Contact Us

For any inquiries or support, please reach out to us:

- **Email**: info@gharsamma.com
- **Phone**: +977-1-1234567
- **Address**: Kathmandu, Nepal

Thank you for being part of our journey!`,
        metaTitle: 'About Gharsamma - Authentic Nepali Products',
        metaDescription: 'Learn about Gharsamma, your trusted source for authentic Nepali products, handicrafts, and cultural items. Discover our story, mission, and commitment to quality.',
        isActive: true,
        lastUpdated: new Date().toISOString()
      };
      
      setAboutData(mockData);
    } catch (error) {
      toast.error('Failed to load about us data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to your API
      const updatedData = {
        ...aboutData,
        lastUpdated: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAboutData(updatedData);
      setIsEditing(false);
      toast.success('About Us page updated successfully!');
    } catch (error) {
      toast.error('Failed to save about us data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewMode(false);
    // Reload original data
    loadAboutUsData();
  };

  const handleInputChange = (field: keyof AboutUsData, value: string | boolean) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout title="About Us">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="About Us">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">About Us Page</h1>
            <p className="text-gray-600">Manage your website's about us content</p>
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
                <div className={`w-2 h-2 rounded-full ${aboutData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {aboutData.isActive ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {aboutData.lastUpdated ? new Date(aboutData.lastUpdated).toLocaleString() : 'Never'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aboutData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{aboutData.title}</h1>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutData.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={aboutData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter page title"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Content</h2>
              <RichTextEditor
                value={aboutData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Write your about us content here..."
                height={600}
                className="min-h-[600px]"
              />
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={aboutData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter meta title for SEO"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {aboutData.metaTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={aboutData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter meta description for SEO"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {aboutData.metaDescription.length}/160 characters
                  </p>
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
                  disabled={isSaving || !aboutData.title.trim() || !aboutData.content.trim()}
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
