"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, X, Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// Mock categories data - in a real implementation, this would come from an API
const categories = [
  { id: "cat1", name: "Electronics" },
  { id: "cat2", name: "Clothing" },
  { id: "cat3", name: "Home & Garden" },
  { id: "cat4", name: "Jewelry" },
  { id: "cat5", name: "Books" },
];

// Mock variant themes
const variantThemes = [
  { id: "color", name: "Color", isDynamic: false },
  { id: "size", name: "Size", isDynamic: false },
  { id: "dimension", name: "Dimension", isDynamic: true },
  { id: "material", name: "Material", isDynamic: false },
  { id: "package", name: "Package", isDynamic: false },
  { id: "units", name: "Units", isDynamic: false },
];

export default function VariantManagementPage() {
  // State for selected category and theme
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [variantValues, setVariantValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState("");
  const [isDynamic, setIsDynamic] = useState(false);
  
  // State to track all configured variant themes for the selected category
  const [configuredThemes, setConfiguredThemes] = useState<Array<{
    themeId: string;
    themeName: string;
    values: string[];
    isDynamic: boolean;
  }>>([]);

  const addVariantValue = () => {
    if (newValue.trim() && !variantValues.includes(newValue.trim()) && selectedTheme) {
      setVariantValues([...variantValues, newValue.trim()]);
      setNewValue("");
    }
  };

  const removeVariantValue = (index: number) => {
    setVariantValues(variantValues.filter((_, i) => i !== index));
  };

  const addConfiguredTheme = () => {
    if (selectedTheme && !configuredThemes.some(theme => theme.themeId === selectedTheme)) {
      const theme = variantThemes.find(t => t.id === selectedTheme);
      if (theme) {
        setConfiguredThemes([
          ...configuredThemes,
          {
            themeId: selectedTheme,
            themeName: theme.name,
            values: [...variantValues],
            isDynamic: isDynamic
          }
        ]);
        // Reset current theme and values
        setSelectedTheme("");
        setVariantValues([]);
        setIsDynamic(theme.isDynamic); // Reset to default based on theme
      }
    }
  };

  const removeConfiguredTheme = (themeId: string) => {
    setConfiguredThemes(configuredThemes.filter(theme => theme.themeId !== themeId));
  };

  const removeValueFromConfiguredTheme = (themeId: string, valueIndex: number) => {
    setConfiguredThemes(configuredThemes.map(theme => {
      if (theme.themeId === themeId) {
        return {
          ...theme,
          values: theme.values.filter((_, i) => i !== valueIndex)
        };
      }
      return theme;
    }));
  };

  const addValueToConfiguredTheme = (themeId: string, value: string) => {
    setConfiguredThemes(configuredThemes.map(theme => {
      if (theme.themeId === themeId) {
        if (!theme.values.includes(value)) {
          return {
            ...theme,
            values: [...theme.values, value]
          };
        }
      }
      return theme;
    }));
  };

  const toggleDynamicForConfiguredTheme = (themeId: string) => {
    setConfiguredThemes(configuredThemes.map(theme => {
      if (theme.themeId === themeId) {
        return {
          ...theme,
          isDynamic: !theme.isDynamic
        };
      }
      return theme;
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold custom-font text-gray-900">
              Variant Management
            </h1>
          </div>
          <p className="text-gray-600 custom-font">
            Configure multiple variant themes and values for different product categories
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  // Reset all related states when category changes
                  setSelectedTheme("");
                  setVariantValues([]);
                  setConfiguredThemes([]);
                  setIsDynamic(false);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                        Select Variant Theme
                      </label>
                      <select
                        value={selectedTheme}
                        onChange={(e) => {
                          setSelectedTheme(e.target.value);
                          // Load values if this theme was already configured
                          const existingTheme = configuredThemes.find(t => t.themeId === e.target.value);
                          if (existingTheme) {
                            setVariantValues(existingTheme.values);
                            setIsDynamic(existingTheme.isDynamic);
                          } else {
                            setVariantValues([]);
                            const theme = variantThemes.find(t => t.id === e.target.value);
                            setIsDynamic(theme ? theme.isDynamic : false);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="">Select a variant theme</option>
                        {variantThemes
                          .filter(theme => !configuredThemes.some(configured => configured.themeId === theme.id))
                          .map((theme) => (
                            <option key={theme.id} value={theme.id}>
                              {theme.name} {theme.isDynamic ? "(Dynamic)" : "(Static)"}
                            </option>
                          ))}
                      </select>
                    </div>

                    {selectedTheme && (
                      <div>
                        <div className="flex items-center mb-2">
                          <label className="block text-sm font-medium custom-font text-gray-700 mr-3">
                            Dynamic:
                          </label>
                          <div className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={isDynamic}
                              onChange={(e) => setIsDynamic(e.target.checked)}
                              className="sr-only"
                              id="dynamic-toggle"
                            />
                            <label
                              htmlFor="dynamic-toggle"
                              className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                                isDynamic ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                                  isDynamic ? 'transform translate-x-6' : ''
                                }`}
                              />
                            </label>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {isDynamic ? "Dynamic - Values set during product creation" : "Static - Predefined values"}
                          </span>
                        </div>
                        
                        <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                          Variant Values for {variantThemes.find(t => t.id === selectedTheme)?.name}
                        </label>
                        
                        {!isDynamic && (
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={newValue}
                              onChange={(e) => setNewValue(e.target.value)}
                              placeholder={`Enter ${variantThemes.find(t => t.id === selectedTheme)?.name} value (e.g. L, M, XL)`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                              onKeyPress={(e) => e.key === 'Enter' && addVariantValue()}
                              disabled={isDynamic}
                            />
                            <button
                              type="button"
                              onClick={addVariantValue}
                              disabled={isDynamic}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add
                            </button>
                          </div>
                        )}
                        
                        {!isDynamic && variantValues.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {variantValues.map((value, index) => (
                              <div 
                                key={index} 
                                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                {value}
                                <button
                                  type="button"
                                  onClick={() => removeVariantValue(index)}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                  disabled={isDynamic}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {isDynamic && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-yellow-800">
                              <Settings className="w-4 h-4 inline mr-1" />
                              This is a dynamic theme. Values will be set when creating individual products.
                            </p>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={addConfiguredTheme}
                          disabled={!selectedTheme || (isDynamic ? false : variantValues.length === 0)}
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Theme
                        </button>
                        
                        {!isDynamic && (
                          <p className="text-sm text-gray-500 mt-2">
                            Add values for the selected category and variant theme. Press Enter or click "Add" to add a new value.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-semibold custom-font text-gray-900">
                      Configured Themes
                    </h3>
                    
                    {configuredThemes.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No variant themes configured yet. Select a theme and add values to get started.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {configuredThemes.map((configuredTheme, index) => (
                          <div 
                            key={configuredTheme.themeId} 
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">
                                {configuredTheme.themeName} 
                                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                  {configuredTheme.isDynamic ? "Dynamic" : "Static"}
                                </span>
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeConfiguredTheme(configuredTheme.themeId)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center mb-2">
                              <label className="text-sm font-medium text-gray-700 mr-2">Dynamic:</label>
                              <div className="relative inline-block w-10 h-5">
                                <input
                                  type="checkbox"
                                  checked={configuredTheme.isDynamic}
                                  onChange={() => toggleDynamicForConfiguredTheme(configuredTheme.themeId)}
                                  className="sr-only"
                                  id={`toggle-${configuredTheme.themeId}`}
                                />
                                <label
                                  htmlFor={`toggle-${configuredTheme.themeId}`}
                                  className={`block w-10 h-5 rounded-full cursor-pointer transition-colors ${
                                    configuredTheme.isDynamic ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                                      configuredTheme.isDynamic ? 'transform translate-x-5' : ''
                                    }`}
                                  />
                                </label>
                              </div>
                            </div>
                            
                            {!configuredTheme.isDynamic && (
                              <>
                                <div className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    placeholder={`Add ${configuredTheme.themeName} value`}
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        addValueToConfiguredTheme(configuredTheme.themeId, e.currentTarget.value.trim());
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  {configuredTheme.values.map((value, valueIndex) => (
                                    <div 
                                      key={valueIndex} 
                                      className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {value}
                                      <button
                                        type="button"
                                        onClick={() => removeValueFromConfiguredTheme(configuredTheme.themeId, valueIndex)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                            
                            {configuredTheme.isDynamic && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                  This theme is dynamic. Values will be set when creating individual products.
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}