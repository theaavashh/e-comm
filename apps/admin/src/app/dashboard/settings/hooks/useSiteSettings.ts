import { useState, useCallback, useEffect } from 'react';
import { SiteSettings, ApiResponse, UploadResponse } from '../types';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface UseSiteSettingsReturn {
  settings: SiteSettings;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  saveSettings: () => Promise<void>;
  uploadMedia: (file: File) => Promise<string>;
  refetch: () => Promise<void>;
}

export const useSiteSettings = (): UseSiteSettingsReturn => {
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
    };
  }, []);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/site-settings`, {
        credentials: 'include', // Send httpOnly cookie automatically
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data: ApiResponse<Partial<SiteSettings>> = await response.json();
      
      if (data.success && data.data) {
        setSettings(prev => ({ ...prev, ...data.data }));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      console.error('Settings fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/site-settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify(settings)
      });

      const data: ApiResponse<null> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save settings');
      }

      toast.success('Settings saved successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [settings, getAuthHeaders]);

  const uploadMedia = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload/media`, {
        method: 'POST',
        credentials: 'include', // Send httpOnly cookie automatically
        body: formData
      });

      const data: ApiResponse<UploadResponse> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      // Save the uploaded URL immediately
      if (data.data) {
        const saveResponse = await fetch(`${API_BASE_URL}/api/v1/configuration/site-settings`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ [file.type.startsWith('image/') ? 'siteLogo' : 'siteFavicon']: data.data.url })
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save uploaded media URL');
        }

        toast.success('Media uploaded and saved successfully!');
        return data.data.url;
      }

      throw new Error('No data returned from upload');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [getAuthHeaders]);

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    isUploading,
    error,
    updateSettings,
    saveSettings,
    uploadMedia,
    refetch: fetchSettings
  };
};

function getDefaultSettings(): SiteSettings {
  return {
    siteName: 'Gharsamma Ecommerce',
    siteDescription: 'Your trusted online shopping destination',
    siteUrl: 'https://gharsamma.com',
    siteLogo: '/image.png',
    siteFavicon: '/favicon.ico',
    email: 'info@gharsamma.com',
    phone: '+977-1-2345678',
    address: 'Thamel, Kathmandu',
    city: 'Kathmandu',
    country: 'Nepal',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
    language: 'en',
    paymentMethods: ['cash', 'card', 'bank_transfer', 'esewa', 'khalti'],
    taxRate: 13,
    shippingCost: 100,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    theme: 'light',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    lowStockThreshold: 10,
    autoReorder: false,
    trackInventory: true,
    seoTitle: 'Gharsamma Ecommerce - Your Trusted Online Shopping Destination',
    seoDescription: 'Shop the latest products at Gharsamma Ecommerce. Quality products, competitive prices, and excellent customer service. Free delivery across Nepal.',
    seoKeywords: 'online shopping, ecommerce, nepal, electronics, clothing, books, home, garden, beauty, health',
    ogTitle: 'Gharsamma Ecommerce - Online Shopping in Nepal',
    ogDescription: 'Shop the latest products at Gharsamma Ecommerce.',
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@gharsamma',
    twitterCreator: '@gharsamma',
    canonicalUrl: 'https://gharsamma.com',
    robotsIndex: true,
    robotsFollow: true,
    sitemapUrl: 'https://gharsamma.com/sitemap.xml',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    structuredData: ''
  };
}

