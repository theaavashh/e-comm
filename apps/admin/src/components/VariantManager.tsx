"use client";

import React, { useState } from "react";
import { Plus, Trash2, Package, Image, DollarSign, Weight, Ruler } from "lucide-react";

interface VariantAttribute {
  id: string;
  name: string;
  value: string;
}

interface VariantOption {
  id: string;
  name: string;
  value: string;
  price?: number;
  comparePrice?: number;
  weight?: number;
  additionalCost?: number;
  stock?: number;
  colorCode?: string;
  colorImage?: string;
  height?: number;
  width?: number;
  length?: number;
  dimensionUnit?: string;
  images?: string[];
  isActive?: boolean;
  position?: number;
  variantGroup?: string;
  sku?: string;
  barcode?: string;
  upc?: string;
  asin?: string;
  shippingClass?: string;
  packageWeight?: number;
  thumbnail?: string;
  packageType?: string;
  packageDescription?: string;
}

interface Variant {
  id: string;
  name: string;
  options: VariantOption[];
}

interface VariantManagerProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
}

const VariantManager: React.FC<VariantManagerProps> = ({ 
  variants, 
  onVariantsChange 
}) => {
  const [newVariant, setNewVariant] = useState<{
    name: string;
    options: VariantOption[];
  }>({
    name: "",
    options: [
      {
        id: Date.now().toString(),
        name: "",
        value: "",
        price: 0,
        comparePrice: 0,
        weight: 0,
        additionalCost: 0,
        stock: 0,
        colorCode: "",
        colorImage: "",
        height: 0,
        width: 0,
        length: 0,
        dimensionUnit: "cm",
        images: [],
        isActive: true,
        sku: "",
        barcode: "",
        upc: "",
        asin: "",
        shippingClass: "",
        packageWeight: 0,
        thumbnail: "",
        position: 0,
        variantGroup: "",
        packageType: "",
        packageDescription: "",
      },
    ],
  });

  const addVariantOption = (variantIndex: number) => {
    if (variantIndex === -1) {
      // Adding option to the new variant form (not yet added to variants)
      setNewVariant(prev => ({
        ...prev,
        options: [
          ...prev.options,
          { 
            id: Date.now().toString(), 
            name: "", 
            value: "", 
            price: 0, 
            comparePrice: 0, 
            weight: 0, 
            additionalCost: 0, 
            stock: 0, 
            colorCode: "", 
            colorImage: "", 
            height: 0, 
            width: 0, 
            length: 0, 
            dimensionUnit: "cm",
            images: [],
            isActive: true,
            sku: "",
            barcode: "",
            upc: "",
            asin: "",
            shippingClass: "",
            packageWeight: 0,
            thumbnail: "",
            position: 0,
            variantGroup: "",
            packageType: "",
            packageDescription: "",
          }
        ]
      }));
    } else {
      // Adding option to an existing variant
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].options.push({
        id: Date.now().toString(),
        name: "",
        value: "",
        price: 0,
        comparePrice: 0,
        weight: 0,
        additionalCost: 0,
        stock: 0,
        colorCode: "",
        colorImage: "",
        height: 0,
        width: 0,
        length: 0,
        dimensionUnit: "cm",
        images: [],
        isActive: true,
        sku: "",
        barcode: "",
        upc: "",
        asin: "",
        shippingClass: "",
        packageWeight: 0,
        thumbnail: "",
        position: 0,
        variantGroup: "",
        packageType: "",
        packageDescription: "",
      });
      onVariantsChange(updatedVariants);
    }
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    if (variantIndex === -1) {
      // Removing option from the new variant form
      if (newVariant.options.length > 1) {
        const updatedOptions = [...newVariant.options];
        updatedOptions.splice(optionIndex, 1);
        setNewVariant({ ...newVariant, options: updatedOptions });
      }
    } else {
      // Removing option from an existing variant
      const updatedVariants = [...variants];
      if (updatedVariants[variantIndex].options.length > 1) {
        updatedVariants[variantIndex].options.splice(optionIndex, 1);
        onVariantsChange(updatedVariants);
      }
    }
  };

  const updateVariantOption = (
    variantIndex: number,
    optionIndex: number,
    field: string,
    value: string | number,
  ) => {
    if (variantIndex === -1) {
      // Updating option in the new variant form
      const updatedOptions = [...newVariant.options];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [field]: value,
      };
      setNewVariant({ ...newVariant, options: updatedOptions });
    } else {
      // Updating option in an existing variant
      const updatedVariants = [...variants];
      updatedVariants[variantIndex].options[optionIndex] = {
        ...updatedVariants[variantIndex].options[optionIndex],
        [field]: value,
      };
      onVariantsChange(updatedVariants);
    }
  };

  const addVariant = () => {
    if (newVariant.name.trim() === "") return;

    const variantToAdd = {
      id: Date.now().toString(),
      name: newVariant.name,
      options: newVariant.options,
    };

    onVariantsChange([...variants, variantToAdd]);
    setNewVariant({
      name: "",
      options: [
        {
          id: Date.now().toString(),
          name: "",
          value: "",
          price: 0,
          comparePrice: 0,
          weight: 0,
          additionalCost: 0,
          stock: 0,
          colorCode: "",
          colorImage: "",
          height: 0,
          width: 0,
          length: 0,
          dimensionUnit: "cm",
          images: [],
          isActive: true,
          sku: "",
          barcode: "",
          upc: "",
          asin: "",
          shippingClass: "",
          packageWeight: 0,
          thumbnail: "",
          position: 0,
          variantGroup: "",
          packageType: "",
          packageDescription: "",
        },
      ],
    });
  };

  const removeVariant = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(variantIndex, 1);
    onVariantsChange(updatedVariants);
  };

  const updateVariantName = (variantIndex: number, name: string) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].name = name;
    onVariantsChange(updatedVariants);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Product Variants
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Create variants for your product such as color, size, or custom options
        </p>

        {/* Add New Variant */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Add New Variant Type
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Type Name
              </label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Enter variant type name (e.g., Color, Size, Dimensions)"
              />
            </div>
          </div>

          {/* Variant Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant Options
            </label>
            {newVariant.options.map((option, optionIndex) => (
              <div
                key={option.id}
                className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3"
              >
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].name =
                        e.target.value;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., Red, Large, 16GB"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].value =
                        e.target.value;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g., #FF0000, 100cm, 16GB RAM"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    value={option.price}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].price =
                        parseFloat(e.target.value) || 0;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Variant price (optional)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    value={option.comparePrice}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].comparePrice =
                        parseFloat(e.target.value) || 0;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Compare price (optional)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    value={option.weight}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].weight =
                        parseFloat(e.target.value) || 0;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Weight in kg (optional)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={option.additionalCost}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].additionalCost =
                        parseFloat(e.target.value) || 0;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Additional cost"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={option.stock}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].stock =
                        parseInt(e.target.value) || 0;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Stock"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={option.asin || ""}
                    onChange={(e) => {
                      const updatedOptions = [
                        ...newVariant.options,
                      ];
                      updatedOptions[optionIndex].asin =
                        e.target.value;
                      setNewVariant({
                        ...newVariant,
                        options: updatedOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="ASIN"
                  />
                </div>
                <div className="flex items-center">
                  {newVariant.name.toLowerCase() === "color" ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={option.colorCode || "#ffffff"}
                        onChange={(e) =>
                          updateVariantOption(
                            -1,
                            optionIndex,
                            "colorCode",
                            e.target.value,
                          )
                        }
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeVariantOption(-1, optionIndex)
                        }
                        className="p-2 text-red-600 hover:text-red-800"
                        disabled={newVariant.options.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        removeVariantOption(-1, optionIndex)
                      }
                      className="p-2 text-red-600 hover:text-red-800"
                      disabled={newVariant.options.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addVariantOption(-1)} // -1 indicates we're adding to new variant
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Option
            </button>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!newVariant.name.trim()}
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            Add Variant Type
          </button>
          {!newVariant.name.trim() && (
            <p className="text-xs text-gray-500 mt-1">
              Enter a variant type name to enable this button
            </p>
          )}
        </div>

        {/* Existing Variants */}
        {variants.length > 0 ? (
          <div className="space-y-4">
            {variants.map(
              (variant: Variant, variantIndex: number) => (
                <div
                  key={variant.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-900">
                      {variant.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariantName(
                          variantIndex,
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 mb-3"
                      placeholder="Variant type name"
                    />
                  </div>

                  {variant.options.map(
                    (
                      option: VariantOption,
                      optionIndex: number,
                    ) => (
                      <div
                        key={option.id}
                        className="grid grid-cols-1 md:grid-cols-8 gap-3 mb-3"
                      >
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "name",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="e.g., Red, Large, 16GB"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="e.g., #FF0000, 100cm, 16GB RAM"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            value={option.price}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "price",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Variant price (optional)"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            value={option.comparePrice}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "comparePrice",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Compare price (optional)"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            value={option.weight}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "weight",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Weight in kg (optional)"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={option.additionalCost}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "additionalCost",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Cost"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={option.stock}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "stock",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Stock"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={option.asin || ""}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "asin",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="ASIN"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={option.stock}
                            onChange={(e) =>
                              updateVariantOption(
                                variantIndex,
                                optionIndex,
                                "stock",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Stock"
                          />
                          {variant.name.toLowerCase() ===
                          "color" ? (
                            <div className="flex items-center space-x-2 ml-2">
                              <input
                                type="color"
                                value={
                                  option.colorCode || "#ffffff"
                                }
                                onChange={(e) =>
                                  updateVariantOption(
                                    variantIndex,
                                    optionIndex,
                                    "colorCode",
                                    e.target.value,
                                  )
                                }
                                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeVariantOption(
                                    variantIndex,
                                    optionIndex,
                                  )
                                }
                                className="p-2 text-red-600 hover:text-red-800"
                                disabled={
                                  variant.options.length <= 1
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                removeVariantOption(
                                  variantIndex,
                                  optionIndex,
                                )
                              }
                              className="ml-2 p-2 text-red-600 hover:text-red-800"
                              disabled={variant.options.length <= 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => addVariantOption(variantIndex)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </button>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No variants added yet</p>
            <p className="text-sm">
              Add variants like color, size, or custom options above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantManager;