"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Save, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  EyeOff,
  Building2,
  Tag
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema, BrandFormData } from "@/schemas/brandSchema";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

interface CurrencyRate {
  id: string;
  country: string;
  currency: string;
  symbol: string;
  rateToNPR: number; // 1 unit of this currency = X NPR
  isActive: boolean;
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface SystemConfig {
  // Units Configuration
  weightUnits: string[];
  lengthUnits: string[];
  clothingSizes: string[];
  volumeUnits: string[];
  temperatureUnits: string[];
  defaultWeightUnit: string;
  defaultLengthUnit: string;
  defaultClothingSize: string;
  
  // Currency Rates Configuration
  currencyRates: CurrencyRate[];
  defaultCurrency: string;
  
  // Brands Configuration
  brands: Brand[];
}

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState('units');
  const router = useRouter();
  
  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Brand management state
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    clearErrors
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
    name: '',
    logo: '',
    website: ''
    }
  });
  
  const [config, setConfig] = useState<SystemConfig>({
    // Units Configuration - Start with empty arrays
    weightUnits: [],
    lengthUnits: [],
    clothingSizes: [],
    volumeUnits: [],
    temperatureUnits: [],
    defaultWeightUnit: "",
    defaultLengthUnit: "",
    defaultClothingSize: "",
    
    // Currency Rates Configuration - Start with empty array
    currencyRates: [],
    defaultCurrency: "",
    
    // Brands Configuration - Start with empty array
    brands: [],
  });

  const tabs = [
    { id: 'units', label: 'Units', icon: Settings },
    { id: 'rates', label: 'Currency Rates', icon: Settings },
    { id: 'brands', label: 'Brands', icon: Building2 },
  ];

  const handleInputChange = (field: keyof SystemConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDefaultUnitChange = async (unitType: 'defaultWeightUnit' | 'defaultLengthUnit' | 'defaultClothingSize', value: string) => {
    // Update local state
    const updatedConfig = {
      ...config,
      [unitType]: value
    };
    handleInputChange(unitType, value);
    
    // Save to database
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/units`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify({
          weightUnits: updatedConfig.weightUnits,
          lengthUnits: updatedConfig.lengthUnits,
          clothingSizes: updatedConfig.clothingSizes,
          volumeUnits: updatedConfig.volumeUnits,
          temperatureUnits: updatedConfig.temperatureUnits,
          defaultWeightUnit: updatedConfig.defaultWeightUnit,
          defaultLengthUnit: updatedConfig.defaultLengthUnit,
          defaultClothingSize: updatedConfig.defaultClothingSize
        })
      });

      if (response.ok) {
        toast.success(`Default ${unitType.replace('default', '').replace('Unit', '').replace('Size', '')} updated successfully!`);
      } else {
        toast.error('Failed to update default unit in database');
      }
    } catch (error) {
      console.error('Error updating default unit:', error);
      toast.error('Failed to update default unit in database');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'units') {
        // Save units configuration
        const response = await fetch(`${API_BASE_URL}/api/v1/configuration/units`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Send httpOnly cookie automatically
          body: JSON.stringify({
            weightUnits: config.weightUnits,
            lengthUnits: config.lengthUnits,
            clothingSizes: config.clothingSizes,
            volumeUnits: config.volumeUnits,
            temperatureUnits: config.temperatureUnits,
            defaultWeightUnit: config.defaultWeightUnit,
            defaultLengthUnit: config.defaultLengthUnit,
            defaultClothingSize: config.defaultClothingSize
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save units configuration');
        }
      } else if (activeTab === 'rates') {
        // Save currency rates configuration
        const response = await fetch(`${API_BASE_URL}/api/v1/configuration/currency-rates`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Send httpOnly cookie automatically
          body: JSON.stringify({
            currencyRates: config.currencyRates,
            defaultCurrency: config.defaultCurrency
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save currency rates configuration');
        }
      }

      toast.success('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };


  const addUnit = async (unitType: keyof Pick<SystemConfig, 'weightUnits' | 'lengthUnits' | 'clothingSizes' | 'volumeUnits' | 'temperatureUnits'>, unit: string) => {
    if (unit.trim() && !config[unitType].includes(unit.trim())) {
      // Add to local state immediately
      const newUnits = [...config[unitType], unit.trim()];
      const updatedConfig = {
        ...config,
        [unitType]: newUnits
      };
      handleInputChange(unitType, newUnits);
      
      // Save to database
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/configuration/units`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Send httpOnly cookie automatically
          body: JSON.stringify({
            weightUnits: updatedConfig.weightUnits,
            lengthUnits: updatedConfig.lengthUnits,
            clothingSizes: updatedConfig.clothingSizes,
            volumeUnits: updatedConfig.volumeUnits,
            temperatureUnits: updatedConfig.temperatureUnits,
            defaultWeightUnit: updatedConfig.defaultWeightUnit,
            defaultLengthUnit: updatedConfig.defaultLengthUnit,
            defaultClothingSize: updatedConfig.defaultClothingSize
          })
        });

        if (response.ok) {
          toast.success(`${unit} added successfully!`);
        } else {
          // Revert local state if API call failed
          handleInputChange(unitType, config[unitType]);
          toast.error('Failed to add unit to database');
        }
      } catch (error) {
        // Revert local state if API call failed
        handleInputChange(unitType, config[unitType]);
        console.error('Error adding unit:', error);
        toast.error('Failed to add unit to database');
      }
    }
  };

  const removeUnit = async (unitType: keyof Pick<SystemConfig, 'weightUnits' | 'lengthUnits' | 'clothingSizes' | 'volumeUnits' | 'temperatureUnits'>, unit: string) => {
    // Remove from local state immediately
    const newUnits = config[unitType].filter(u => u !== unit);
    const updatedConfig = {
      ...config,
      [unitType]: newUnits
    };
    handleInputChange(unitType, newUnits);
    
    // Save to database
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/units`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify({
          weightUnits: updatedConfig.weightUnits,
          lengthUnits: updatedConfig.lengthUnits,
          clothingSizes: updatedConfig.clothingSizes,
          volumeUnits: updatedConfig.volumeUnits,
          temperatureUnits: updatedConfig.temperatureUnits,
          defaultWeightUnit: updatedConfig.defaultWeightUnit,
          defaultLengthUnit: updatedConfig.defaultLengthUnit,
          defaultClothingSize: updatedConfig.defaultClothingSize
        })
      });

      if (response.ok) {
        toast.success(`${unit} removed successfully!`);
      } else {
        // Revert local state if API call failed
        handleInputChange(unitType, config[unitType]);
        toast.error('Failed to remove unit from database');
      }
    } catch (error) {
      // Revert local state if API call failed
      handleInputChange(unitType, config[unitType]);
      console.error('Error removing unit:', error);
      toast.error('Failed to remove unit from database');
    }
  };

  const addCurrencyRate = async (newRate: Omit<CurrencyRate, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/currency-rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify(newRate)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          handleInputChange('currencyRates', [...config.currencyRates, data.data]);
          toast.success('Currency rate added successfully!');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add currency rate');
      }
    } catch (error) {
      console.error('Error adding currency rate:', error);
      toast.error('Failed to add currency rate');
    }
  };

  const updateCurrencyRate = async (id: string, updatedRate: Partial<CurrencyRate>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/currency-rates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify(updatedRate)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedRates = config.currencyRates.map(rate => 
            rate.id === id ? { ...rate, ...updatedRate } : rate
          );
          handleInputChange('currencyRates', updatedRates);
          toast.success('Currency rate updated successfully!');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update currency rate');
      }
    } catch (error) {
      console.error('Error updating currency rate:', error);
      toast.error('Failed to update currency rate');
    }
  };

  const removeCurrencyRate = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/configuration/currency-rates/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Send httpOnly cookie automatically
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedRates = config.currencyRates.filter(rate => rate.id !== id);
          handleInputChange('currencyRates', updatedRates);
          toast.success('Currency rate deleted successfully!');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete currency rate');
      }
    } catch (error) {
      console.error('Error deleting currency rate:', error);
      toast.error('Failed to delete currency rate');
    }
  };

  // Brand management functions
  const loadBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/brands`, {
        credentials: 'include', // Send httpOnly cookie automatically
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          handleInputChange('brands', data.data.brands);
        } else {
          console.error('Brands API returned error:', data.message);
          toast.error(data.message || 'Failed to load brands');
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to load brands:', errorData);
        toast.error(errorData.message || 'Failed to load brands');
      }
    } catch (error) {
      console.error('Error loading brands:', error);
      toast.error('Failed to load brands');
    }
  };

  const handleBrandFormChange = (field: keyof BrandFormData, value: any) => {
    setValue(field, value);
    clearErrors(field);
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/upload/brand`, {
      method: 'POST',
      credentials: 'include', // Send httpOnly cookie automatically
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
  };

  const resetBrandForm = () => {
    reset({
      name: '',
      logo: '',
      website: ''
    });
    setEditingBrand(null);
  };

  const handleAddBrand = () => {
    resetBrandForm();
  };

  const handleEditBrand = (brand: Brand) => {
    reset({
      name: brand.name,
      logo: brand.logo || '',
      website: brand.website || ''
    });
    setEditingBrand(brand);
  };

  const handleSaveBrand = handleSubmit(
    async (data: BrandFormData) => {
      try {
      const url = editingBrand 
        ? `${API_BASE_URL}/api/v1/brands/${editingBrand.id}`
        : `${API_BASE_URL}/api/v1/brands`;
      
      const method = editingBrand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookie automatically
        body: JSON.stringify(data)
      });

      console.log('API response:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API response data:', responseData);
        if (responseData.success) {
          if (editingBrand) {
            const updatedBrands = config.brands.map(brand => 
              brand.id === editingBrand.id ? responseData.data.brand : brand
            );
            handleInputChange('brands', updatedBrands);
            toast.success('Brand updated successfully!');
          } else {
            handleInputChange('brands', [...config.brands, responseData.data.brand]);
            toast.success('Brand created successfully!');
          }
          resetBrandForm();
        } else {
          console.error('API returned success: false', responseData);
          toast.error(responseData.message || 'Failed to save brand - API returned error');
        }
      } else {
        console.error('API response not ok:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        let errorMessage = 'Failed to save brand';
        try {
        const errorData = await response.json();
          console.error('API error data:', errorData);
          errorMessage = errorData.message || errorData.error || `Server error (${response.status})`;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Cannot connect to API server. Please ensure the API server is running on port 5000.');
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
      toast.error('Failed to save brand');
      }
    }
  },
  (errors) => {
    // Handle validation errors
    console.log('Validation errors:', errors);
    console.log('Current form values:', watch());
    
    // Show specific field errors
    if (errors.name) {
      toast.error(`Name error: ${errors.name.message}`);
    } else if (errors.logo) {
      toast.error(`Logo error: ${errors.logo.message}`);
    } else if (errors.website) {
      toast.error(`Internal path error: ${errors.website.message}`);
    } else {
      toast.error('Please fix the validation errors before submitting');
    }
  });

  const handleDeleteBrand = (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const confirmDeleteBrand = async () => {
    if (!brandToDelete) return;
    
    setIsDeleting(true);
      try {
      const response = await fetch(`${API_BASE_URL}/api/v1/brands/${brandToDelete.id}`, {
          method: 'DELETE',
          credentials: 'include', // Send httpOnly cookie automatically
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
          const updatedBrands = config.brands.filter(b => b.id !== brandToDelete.id);
            handleInputChange('brands', updatedBrands);
            toast.success('Brand deleted successfully!');
          setShowDeleteModal(false);
          setBrandToDelete(null);
          }
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to delete brand');
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
        toast.error('Failed to delete brand');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };


  // Load configuration data from API
  const loadConfiguration = async () => {
    try {
      console.log('Loading configuration...');
      setIsLoadingData(true);

      const response = await fetch(`${API_BASE_URL}/api/v1/configuration`, {
        credentials: 'include', // Send httpOnly cookie automatically
      });

      console.log('Configuration API response status:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Configuration API response data:', data);
        if (data.success) {
          setConfig(prev => ({
            ...prev,
            ...data.data.units,
            currencyRates: data.data.currencyRates,
            defaultCurrency: data.data.defaultCurrency,
            brands: data.data.brands || []
          }));
          console.log('Configuration loaded successfully, brands:', data.data.brands);
          toast.success('Configuration loaded successfully!');
        }
      } else {
        const errorData = await response.json();
        console.log('Configuration API error:', errorData);
        toast.error(errorData.message || 'Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast.error('Failed to load configuration data');
    } finally {
      console.log('Setting isLoadingData to false');
      setIsLoadingData(false);
    }
  };

  // Load configuration on component mount
  useEffect(() => {
    loadConfiguration();
  }, []);


  const renderUnitsConfig = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <span>Units Configuration</span>
        </h3>
        
        {/* Weight Units */}
        <div className="mb-8">
          <h4 className="text-md font-medium custom-font text-gray-800 mb-3">Weight Units</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add weight unit (e.g., kg, g, lb)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                onKeyPress={async (e) => {
                  if (e.key === 'Enter') {
                    await addUnit('weightUnits', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={async (e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  await addUnit('weightUnits', input.value);
                  input.value = '';
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.weightUnits.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No weight units added yet. Add your first unit above.</p>
              ) : (
                config.weightUnits.map((unit, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-700">{unit}</span>
                    <button
                      onClick={async () => await removeUnit('weightUnits', unit)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
              <div className="mt-2">
                <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Default Weight Unit</label>
                <select
                  value={config.defaultWeightUnit}
                  onChange={(e) => handleDefaultUnitChange('defaultWeightUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  {config.weightUnits.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
          </div>
        </div>

        {/* Length Units */}
        <div className="mb-8">
          <h4 className="text-md font-medium custom-font text-gray-800 mb-3">Length Units</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add length unit (e.g., cm, m, in, ft)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                onKeyPress={async (e) => {
                  if (e.key === 'Enter') {
                    await addUnit('lengthUnits', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={async (e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  await addUnit('lengthUnits', input.value);
                  input.value = '';
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.lengthUnits.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No length units added yet. Add your first unit above.</p>
              ) : (
                config.lengthUnits.map((unit, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-700">{unit}</span>
                    <button
                      onClick={async () => await removeUnit('lengthUnits', unit)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Default Length Unit</label>
              <select
                value={config.defaultLengthUnit}
                onChange={(e) => handleDefaultUnitChange('defaultLengthUnit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                {config.lengthUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clothing Sizes */}
        <div className="mb-8">
          <h4 className="text-md font-medium custom-font text-gray-800 mb-3">Clothing Sizes</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add clothing size (e.g., XS, S, M, L, XL)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                onKeyPress={async (e) => {
                  if (e.key === 'Enter') {
                    await addUnit('clothingSizes', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={async (e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  await addUnit('clothingSizes', input.value);
                  input.value = '';
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.clothingSizes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No clothing sizes added yet. Add your first size above.</p>
              ) : (
                config.clothingSizes.map((unit, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-700">{unit}</span>
                    <button
                      onClick={async () => await removeUnit('clothingSizes', unit)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Default Clothing Size</label>
              <select
                value={config.defaultClothingSize}
                onChange={(e) => handleDefaultUnitChange('defaultClothingSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                {config.clothingSizes.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Volume Units */}
        <div className="mb-8">
          <h4 className="text-md font-medium custom-font text-gray-800 mb-3">Volume Units</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add volume unit (e.g., ml, l, gal, cup)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                onKeyPress={async (e) => {
                  if (e.key === 'Enter') {
                    await addUnit('volumeUnits', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={async (e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  await addUnit('volumeUnits', input.value);
                  input.value = '';
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.volumeUnits.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No volume units added yet. Add your first unit above.</p>
              ) : (
                config.volumeUnits.map((unit, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-700">{unit}</span>
                    <button
                      onClick={async () => await removeUnit('volumeUnits', unit)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Temperature Units */}
        <div className="mb-8">
          <h4 className="text-md font-medium custom-font text-gray-800 mb-3">Temperature Units</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add temperature unit (e.g., °C, °F, K)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                onKeyPress={async (e) => {
                  if (e.key === 'Enter') {
                    await addUnit('temperatureUnits', e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={async (e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  await addUnit('temperatureUnits', input.value);
                  input.value = '';
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.temperatureUnits.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No temperature units added yet. Add your first unit above.</p>
              ) : (
                config.temperatureUnits.map((unit, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-gray-700">{unit}</span>
                    <button
                      onClick={async () => await removeUnit('temperatureUnits', unit)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrencyRatesConfig = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-green-600" />
          <span>Currency Rates Configuration</span>
        </h3>
        
        {/* Add New Currency Rate */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-medium custom-font text-gray-800 mb-3">Add New Currency Rate</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Country</label>
              <input
                type="text"
                placeholder="e.g., United States"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Currency Code</label>
              <input
                type="text"
                placeholder="e.g., USD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-currency"
              />
            </div>
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Symbol</label>
              <input
                type="text"
                placeholder="e.g., $"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-symbol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-1">Rate to NPR</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 133.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-rate"
              />
            </div>
          </div>
          <button
            onClick={async () => {
              const country = (document.getElementById('new-country') as HTMLInputElement)?.value;
              const currency = (document.getElementById('new-currency') as HTMLInputElement)?.value;
              const symbol = (document.getElementById('new-symbol') as HTMLInputElement)?.value;
              const rate = parseFloat((document.getElementById('new-rate') as HTMLInputElement)?.value || '0');
              
              if (country && currency && symbol && rate > 0) {
                await addCurrencyRate({
                  country,
                  currency,
                  symbol,
                  rateToNPR: rate,
                  isActive: true,
                });
                
                // Clear inputs
                (document.getElementById('new-country') as HTMLInputElement).value = '';
                (document.getElementById('new-currency') as HTMLInputElement).value = '';
                (document.getElementById('new-symbol') as HTMLInputElement).value = '';
                (document.getElementById('new-rate') as HTMLInputElement).value = '';
              } else {
                toast.error('Please fill all fields with valid values');
              }
            }}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Currency Rate
          </button>
        </div>

        {/* Default Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium custom-font text-gray-700 mb-2">Default Currency</label>
          <select
            value={config.defaultCurrency}
            onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          >
            {config.currencyRates.map((rate) => (
              <option key={rate.id} value={rate.currency}>
                {rate.currency} - {rate.country} ({rate.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Currency Rates List */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-800">Current Currency Rates</h4>
          <div className="grid grid-cols-1 gap-4">
            {config.currencyRates.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 italic">No currency rates added yet. Add your first currency rate above.</p>
              </div>
            ) : (
              config.currencyRates.map((rate) => (
              <div key={rate.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                      <input
                        type="text"
                        value={rate.country}
                        onChange={(e) => {
                          const updatedRates = config.currencyRates.map(r => 
                            r.id === rate.id ? { ...r, country: e.target.value } : r
                          );
                          handleInputChange('currencyRates', updatedRates);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                      <input
                        type="text"
                        value={rate.currency}
                        onChange={(e) => {
                          const updatedRates = config.currencyRates.map(r => 
                            r.id === rate.id ? { ...r, currency: e.target.value } : r
                          );
                          handleInputChange('currencyRates', updatedRates);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Symbol</label>
                      <input
                        type="text"
                        value={rate.symbol}
                        onChange={(e) => {
                          const updatedRates = config.currencyRates.map(r => 
                            r.id === rate.id ? { ...r, symbol: e.target.value } : r
                          );
                          handleInputChange('currencyRates', updatedRates);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Rate to NPR</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rate.rateToNPR}
                        onChange={(e) => {
                          const updatedRates = config.currencyRates.map(r => 
                            r.id === rate.id ? { ...r, rateToNPR: parseFloat(e.target.value) || 0 } : r
                          );
                          handleInputChange('currencyRates', updatedRates);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-gray-500">Active</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rate.isActive}
                          onChange={async (e) => await updateCurrencyRate(rate.id, { isActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <button
                      onClick={async () => await removeCurrencyRate(rate.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove currency rate"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Rate Display */}
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-600">
                    <strong>1 {rate.currency} ({rate.symbol})</strong> = <strong>{rate.rateToNPR} NPR (रू)</strong>
                  </span>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandsConfig = () => {
    try {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="custom-font">Brands Configuration</span>
            </h3>
          </div>


          {/* Add New Brand Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-medium custom-font text-gray-900 mb-4">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h4>
            <form onSubmit={handleSaveBrand}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium custom-font text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                    {...register('name')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="e.g., Nike, Apple, Samsung"
                />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium custom-font text-gray-700 mb-1">
                    Internal Path *
                </label>
                <input
                    type="text"
                    {...register('website')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black ${
                      errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., /zipzip, /gharsamma, /zipzip/products"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Internal path must start with / and contain only letters, numbers, hyphens, underscores, and forward slashes (e.g., /zipzip, /gharsamma, /zipzip/products)
                  </p>
              </div>
            </div>
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium custom-font text-gray-700 mb-1">
                    Brand Logo *
                </label>
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-gray-400 transition-colors ${
                    errors.logo ? 'border-red-300' : 'border-gray-300'
                  }`}>
                  <div className="space-y-1 text-center">
                      {watch('logo') ? (
                      <div className="space-y-2">
                        <img
                            src={watch('logo')}
                          alt="Brand logo preview"
                          className="mx-auto h-20 w-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="text-sm text-gray-600">
                          <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>{isUploadingImage ? 'Uploading...' : 'Change logo'}</span>
                            <input
                              id="logo-upload"
                              name="logo-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              disabled={isUploadingImage}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    setIsUploadingImage(true);
                                    const imageUrl = await uploadImageToCloudinary(file);
                                    handleBrandFormChange('logo', imageUrl);
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                    toast.error(error instanceof Error ? error.message : 'Failed to upload image');
                                  } finally {
                                    setIsUploadingImage(false);
                                  }
                                }
                              }}
                            />
                          </label>
                          <span className="ml-2">or</span>
                          <button
                            type="button"
                            onClick={() => handleBrandFormChange('logo', '')}
                            className="ml-2 text-red-600 hover:text-red-500"
                            disabled={isUploadingImage}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                          <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                            <span>{isUploadingImage ? 'Uploading...' : 'Upload a logo'}</span>
                            <input
                              id="logo-upload"
                              name="logo-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              disabled={isUploadingImage}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    setIsUploadingImage(true);
                                    const imageUrl = await uploadImageToCloudinary(file);
                                    handleBrandFormChange('logo', imageUrl);
                                  } catch (error) {
                                    console.error('Upload error:', error);
                                    toast.error(error instanceof Error ? error.message : 'Failed to upload image');
                                  } finally {
                                    setIsUploadingImage(false);
                                  }
                                }
                              }}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
                  )}
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                  type="submit"
                  disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : (editingBrand ? 'Update Brand' : 'Add Brand')}
              </button>
              {editingBrand && (
                <button
                    type="button"
                  onClick={resetBrandForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            </form>
          </div>

          {/* Current Brands Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-md font-medium custom-font text-gray-900 mb-4">Current Brands</h4>
            {config.brands.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No brands added yet</p>
                <p className="text-sm">Add your first brand above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {config.brands.map((brand) => (
                  <div key={brand.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={`${brand.name} logo`}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h5 className="font-semibold custom-font text-gray-900">{brand.name}</h5>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              {brand._count?.products || 0} products
                            </span>
                            {brand.website && (
                              <span className="text-sm text-gray-600 flex items-center">
                                <Tag className="w-3 h-3 mr-1 text-gray-400" />
                                {brand.website}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit brand"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error in renderBrandsConfig:', error);
      return <div className="text-red-600">Error rendering brands config: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    }
  };

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'units':
          return renderUnitsConfig();
        case 'rates':
          return renderCurrencyRatesConfig();
        case 'brands':
          return renderBrandsConfig();
        default:
          return renderUnitsConfig();
      }
    } catch (error) {
      console.error('Error in renderTabContent:', error);
      return <div className="text-red-600">Error rendering tab content: {error instanceof Error ? error.message : 'Unknown error'}</div>;
    }
  };

  try {
    return (
      <DashboardLayout title="System Configuration" showBackButton={true}>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        {/* Configuration Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 custom-font">System Configuration</h1>
          </div>
          <p className="text-gray-600">
            Configure units, currency rates, and other system settings for your e-commerce platform.
          </p>
        </div>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading configuration...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Configuration Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium custom-font">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Configuration Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {renderTabContent()}
                </div>
                
                {/* Save Button */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? 'Saving...' : 'Save Configuration'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && brandToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold custom-font text-gray-900">Delete Brand</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isDeleting}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                {brandToDelete.logo && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={brandToDelete.logo}
                      alt={brandToDelete.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-gray-900 font-medium">{brandToDelete.name}</p>
                  <p className="text-sm text-gray-500">{brandToDelete.website}</p>
                  {brandToDelete._count && (
                    <p className="text-xs text-gray-400">
                      {brandToDelete._count.products} product{brandToDelete._count.products !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{brandToDelete.name}"</strong>? 
                This will permanently remove the brand and all associated data.
              </p>

              {/* Warning for brands with products */}
              {brandToDelete._count && brandToDelete._count.products > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-yellow-600 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Warning</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This brand has {brandToDelete._count.products} product{brandToDelete._count.products !== 1 ? 's' : ''}. 
                        Deleting it will remove the brand association from all products.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-xl">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium custom-font text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBrand}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Brand</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
    );
  } catch (error) {
    console.error('Error rendering ConfigurationPage:', error);
    return (
      <DashboardLayout title="System Configuration" showBackButton={true}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Configuration</h1>
          <p className="text-gray-600 mb-4">There was an error loading the configuration page.</p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </pre>
        </div>
      </DashboardLayout>
    );
  }
}
