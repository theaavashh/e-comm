'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Globe, Mail, Phone, MapPin, CreditCard, Palette, Database, 
  Shield, Bell, Users, ShoppingCart, Package, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useSiteSettings } from './hooks/useSiteSettings';
import { MediaUploader } from './components/MediaUploader';
import { TABS, PAYMENT_METHODS, TIMEZONES, LANGUAGES, PASSWORD_POLICIES, THEMES } from './utils/constants';
import { validateSettings } from './utils/validation';
import { TabKey } from './types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const { settings, isLoading, isUploading, error, updateSettings, saveSettings, uploadMedia } = useSiteSettings();

  const handleSave = useCallback(async () => {
    const errors = validateSettings(settings);
    if (errors.length > 0) {
      toast.error(errors[0].message);
      return;
    }

    try {
      await saveSettings();
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, [settings, saveSettings]);

  const handleLogoUpload = useCallback(async (file: File) => {
    try {
      const url = await uploadMedia(file);
      updateSettings({ siteLogo: url });
    } catch (err) {
      console.error('Logo upload failed:', err);
    }
  }, [uploadMedia, updateSettings]);

  const handleFaviconUpload = useCallback(async (file: File) => {
    try {
      const url = await uploadMedia(file);
      updateSettings({ siteFavicon: url });
    } catch (err) {
      console.error('Favicon upload failed:', err);
    }
  }, [uploadMedia, updateSettings]);

  const handleInputChange = useCallback((field: keyof typeof settings, value: any) => {
    updateSettings({ [field]: value });
  }, [updateSettings]);

  const handleBooleanChange = useCallback((field: keyof typeof settings, value: boolean) => {
    updateSettings({ [field]: value });
  }, [updateSettings]);

  const handleArrayChange = useCallback((field: keyof typeof settings, value: string[]) => {
    updateSettings({ [field]: value });
  }, [updateSettings]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings settings={settings} onChange={handleInputChange} onMediaUpload={{ logo: handleLogoUpload, favicon: handleFaviconUpload }} isUploading={isUploading} />;
      case 'contact':
        return <ContactSettings settings={settings} onChange={handleInputChange} />;
      case 'business':
        return <BusinessSettings settings={settings} onChange={handleInputChange} />;
      case 'payment':
        return <PaymentSettings settings={settings} onChange={handleInputChange} onArrayChange={handleArrayChange} />;
      case 'appearance':
        return <AppearanceSettings settings={settings} onChange={handleInputChange} onBooleanChange={handleBooleanChange} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onBooleanChange={handleBooleanChange} />;
      case 'security':
        return <SecuritySettings settings={settings} onChange={handleInputChange} onBooleanChange={handleBooleanChange} />;
      case 'inventory':
        return <InventorySettings settings={settings} onChange={handleInputChange} onBooleanChange={handleBooleanChange} />;
      case 'seo':
        return <SeoSettings settings={settings} onChange={handleInputChange} onBooleanChange={handleBooleanChange} />;
      default:
        return null;
    }
  }, [activeTab, settings, handleInputChange, handleBooleanChange, handleArrayChange, handleLogoUpload, handleFaviconUpload, isUploading]);

  const IconMap: Record<string, any> = {
    Settings, Mail, Database, CreditCard, Palette, Bell, Shield, Package, Search
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold custom-font text-gray-900 mb-2">
            Site Settings & Configuration
          </h1>
          <p className="text-gray-600 custom-font">
            Manage your site settings, appearance, and configurations
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 custom-font">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {TABS.map((tab) => {
                const Icon = IconMap[tab.icon];
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium custom-font text-sm
                      ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isLoading && !settings ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {tabContent}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 custom-font font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed custom-font font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Setting Sections Components
function GeneralSettings({ settings, onChange, onMediaUpload, isUploading }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">General Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaUploader
          label="Site Logo"
          type="logo"
          currentUrl={settings.siteLogo}
          onUpload={onMediaUpload.logo}
          isUploading={isUploading}
        />
        
        <MediaUploader
          label="Favicon"
          type="favicon"
          currentUrl={settings.siteFavicon}
          onUpload={onMediaUpload.favicon}
          isUploading={isUploading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Site Name" value={settings.siteName} onChange={(v: string) => onChange('siteName', v)} />
        <InputField label="Site URL" value={settings.siteUrl} onChange={(v: string) => onChange('siteUrl', v)} />
      </div>

      <div>
        <TextAreaField label="Site Description" value={settings.siteDescription} onChange={(v: string) => onChange('siteDescription', v)} rows={3} />
      </div>
    </div>
  );
}

function ContactSettings({ settings, onChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Email" type="email" value={settings.email} onChange={(v: string) => onChange('email', v)} />
        <InputField label="Phone" type="tel" value={settings.phone} onChange={(v: string) => onChange('phone', v)} />
        <InputField label="Address" value={settings.address} onChange={(v: string) => onChange('address', v)} />
        <InputField label="City" value={settings.city} onChange={(v: string) => onChange('city', v)} />
        <InputField label="Country" value={settings.country} onChange={(v: string) => onChange('country', v)} />
      </div>
    </div>
  );
}

function BusinessSettings({ settings, onChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Business Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField label="Currency" value={settings.currency} onChange={(v: string) => onChange('currency', v)} options={['NPR', 'USD', 'EUR', 'GBP']} />
        <SelectField label="Timezone" value={settings.timezone} onChange={(v: string) => onChange('timezone', v)} options={TIMEZONES} />
        <SelectField label="Language" value={settings.language} onChange={(v: string) => onChange('language', v)} options={LANGUAGES.map(l => l.value)} />
      </div>
    </div>
  );
}

function PaymentSettings({ settings, onChange, onArrayChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Payment Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Tax Rate (%)" type="number" value={settings.taxRate} onChange={(v: string) => onChange('taxRate', Number(v))} />
        <InputField label="Shipping Cost" type="number" value={settings.shippingCost} onChange={(v: string) => onChange('shippingCost', Number(v))} />
      </div>
    </div>
  );
}

function AppearanceSettings({ settings, onChange, onBooleanChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Appearance Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Primary Color" type="color" value={settings.primaryColor} onChange={(v: string) => onChange('primaryColor', v)} />
        <InputField label="Secondary Color" type="color" value={settings.secondaryColor} onChange={(v: string) => onChange('secondaryColor', v)} />
        <SelectField label="Theme" value={settings.theme} onChange={(v: string) => onChange('theme', v)} options={THEMES.map(t => t.value)} />
      </div>
    </div>
  );
}

function NotificationSettings({ settings, onBooleanChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Notification Settings</h3>
      <div className="space-y-4">
        <CheckboxField label="Email Notifications" checked={settings.emailNotifications} onChange={(v: boolean) => onBooleanChange('emailNotifications', v)} />
        <CheckboxField label="SMS Notifications" checked={settings.smsNotifications} onChange={(v: boolean) => onBooleanChange('smsNotifications', v)} />
        <CheckboxField label="Push Notifications" checked={settings.pushNotifications} onChange={(v: boolean) => onBooleanChange('pushNotifications', v)} />
      </div>
    </div>
  );
}

function SecuritySettings({ settings, onChange, onBooleanChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Security Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxField label="Two-Factor Authentication" checked={settings.twoFactorAuth} onChange={(v: boolean) => onBooleanChange('twoFactorAuth', v)} />
        <InputField label="Session Timeout (minutes)" type="number" value={settings.sessionTimeout} onChange={(v: string) => onChange('sessionTimeout', Number(v))} />
        <SelectField label="Password Policy" value={settings.passwordPolicy} onChange={(v: string) => onChange('passwordPolicy', v)} options={PASSWORD_POLICIES.map(p => p.value)} />
      </div>
    </div>
  );
}

function InventorySettings({ settings, onChange, onBooleanChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">Inventory Settings</h3>
      <div className="space-y-4">
        <InputField label="Low Stock Threshold" type="number" value={settings.lowStockThreshold} onChange={(v: string) => onChange('lowStockThreshold', Number(v))} />
        <CheckboxField label="Auto Reorder" checked={settings.autoReorder} onChange={(v: boolean) => onBooleanChange('autoReorder', v)} />
        <CheckboxField label="Track Inventory" checked={settings.trackInventory} onChange={(v: boolean) => onBooleanChange('trackInventory', v)} />
      </div>
    </div>
  );
}

function SeoSettings({ settings, onChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">SEO Settings</h3>
      <div className="space-y-6">
        <InputField label="SEO Title" value={settings.seoTitle} onChange={(v: string) => onChange('seoTitle', v)} />
        <TextAreaField label="SEO Description" value={settings.seoDescription} onChange={(v: string) => onChange('seoDescription', v)} rows={3} />
        <InputField label="SEO Keywords" value={settings.seoKeywords} onChange={(v: string) => onChange('seoKeywords', v)} />
      </div>
    </div>
  );
}

// Reusable Form Components
function InputField({ label, value, onChange, type = 'text', ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        {...props}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 4, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="ml-2 text-sm custom-font text-gray-700">{label}</label>
    </div>
  );
}

