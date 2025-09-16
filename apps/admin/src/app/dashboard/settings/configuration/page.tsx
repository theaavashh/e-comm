"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Save, 
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface CurrencyRate {
  id: string;
  country: string;
  currency: string;
  symbol: string;
  rateToNPR: number; // 1 unit of this currency = X NPR
  isActive: boolean;
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
}

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState('units');
  
  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
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
  });

  const tabs = [
    { id: 'units', label: 'Units', icon: Settings },
    { id: 'rates', label: 'Currency Rates', icon: Settings },
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
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/configuration/units`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
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
      const adminToken = localStorage.getItem('adminToken');
      
      if (activeTab === 'units') {
        // Save units configuration
        const response = await fetch(`${API_BASE_URL}/configuration/units`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
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
        const response = await fetch(`${API_BASE_URL}/configuration/currency-rates`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
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
        const adminToken = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/configuration/units`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
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
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/configuration/units`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
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
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/configuration/currency-rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
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
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/configuration/currency-rates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
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
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/configuration/currency-rates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
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

  // Load configuration data from API
  const loadConfiguration = async () => {
    try {
      setIsLoadingData(true);
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        toast.error('Please login to access configuration');
        return;
      }

      const response = await fetch('http://localhost:5000/api/v1/configuration', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConfig(prev => ({
            ...prev,
            ...data.data.units,
            currencyRates: data.data.currencyRates,
            defaultCurrency: data.data.defaultCurrency
          }));
          toast.success('Configuration loaded successfully!');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast.error('Failed to load configuration data');
    } finally {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <span>Units Configuration</span>
        </h3>
        
        {/* Weight Units */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-3">Weight Units</h4>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Weight Unit</label>
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
          <h4 className="text-md font-medium text-gray-800 mb-3">Length Units</h4>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Length Unit</label>
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
          <h4 className="text-md font-medium text-gray-800 mb-3">Clothing Sizes</h4>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Clothing Size</label>
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
          <h4 className="text-md font-medium text-gray-800 mb-3">Volume Units</h4>
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
          <h4 className="text-md font-medium text-gray-800 mb-3">Temperature Units</h4>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-green-600" />
          <span>Currency Rates Configuration</span>
        </h3>
        
        {/* Add New Currency Rate */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-800 mb-3">Add New Currency Rate</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                placeholder="e.g., United States"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
              <input
                type="text"
                placeholder="e.g., USD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-currency"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
              <input
                type="text"
                placeholder="e.g., $"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                id="new-symbol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate to NPR</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'units':
        return renderUnitsConfig();
      case 'rates':
        return renderCurrencyRatesConfig();
      default:
        return renderUnitsConfig();
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
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
                        <span className="font-medium">{tab.label}</span>
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
    </DashboardLayout>
  );
}
