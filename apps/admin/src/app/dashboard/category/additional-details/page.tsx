"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  AlertTriangle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { z } from "zod";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Define the schema for FAQ items
const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
  answer: z.string().min(1, "Answer is required").max(2000, "Answer must be less than 2000 characters"),
});

// Define the schema for care instructions
const careInstructionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
});

// Define the schema for category details
const categoryDetailsSchema = z.object({
  disclaimer: z
    .string()
    .max(2000, "Disclaimer must be less than 2000 characters")
    .optional(),
  additionalDetails: z
    .string()
    .max(5000, "Additional details must be less than 5000 characters")
    .optional(),
  howToCare: z
    .string()
    .max(5000, "How to care must be less than 5000 characters")
    .optional(),
  faqs: z.array(faqSchema).optional(),
  careInstructions: z.array(careInstructionSchema).optional(),
});

type CategoryDetailsFormData = z.infer<typeof categoryDetailsSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  level?: number;
}

interface CategoryDetails {
  id: string;
  disclaimer?: string;
  additionalDetails?: string;
  howToCare?: string;
  faqs?: Array<{ question: string; answer: string }>;
  careInstructions?: Array<{ title: string; description: string }>;
}

interface CategoryApiResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  internalLink?: string;
  disclaimer?: string;
  additionalDetails?: string;
  howToCare?: string;
  faqs?: Array<{ question: string; answer: string }>;
  careInstructions?: Array<{ title: string; description: string }>;
  createdAt: string;
  isActive: boolean;
  parentId?: string;
  children?: CategoryApiResponse[];
  _count?: {
    products?: number;
  };
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: CategoryApiResponse[];
  };
  message?: string;
}

interface UpdateCategoryDetailsResponse {
  success: boolean;
  data: {
    category: CategoryApiResponse;
  };
  message?: string;
}

export default function CategoryAdditionalDetailsPage() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryDetailsFormData>({
    resolver: zodResolver(categoryDetailsSchema),
    defaultValues: {
      disclaimer: "",
      additionalDetails: "",
      howToCare: "",
      faqs: [],
      careInstructions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  const { fields: careInstructionFields, append: appendCareInstruction, remove: removeCareInstruction } = useFieldArray({
    control,
    name: "careInstructions",
  });

  // Fetch all categories
  const fetchCategories = async (): Promise<void> => {
    try {
      setIsLoadingCategories(true);

      const response = await axios.get<CategoriesResponse>(
        `${API_BASE_URL}/api/v1/categories`,
      );

      if (response.data.success) {
        // Flatten the category tree to a single list
        const flattenCategories = (cats: CategoryApiResponse[], level = 0): Category[] => {
          let result: Category[] = [];
          
          cats.forEach(cat => {
            result.push({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              parentId: cat.parentId,
              level,
            });
            
            if (cat.children && cat.children.length > 0) {
              result = [...result, ...flattenCategories(cat.children, level + 1)];
            }
          });
          
          return result;
        };

        const flattenedCategories = flattenCategories(response.data.data.categories);
        setCategories(flattenedCategories);
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to fetch categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load category details when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      loadCategoryDetails(selectedCategory);
    } else {
      // Reset form when no category is selected
      reset({
        disclaimer: "",
        additionalDetails: "",
        howToCare: "",
        faqs: [],
        careInstructions: [],
      });
    }
  }, [selectedCategory]);

  const loadCategoryDetails = async (categoryId: string) => {
    try {
      setIsLoading(true);
      
      const response = await axios.get<{ success: boolean; data: { category: CategoryApiResponse }; message?: string }>(
        `${API_BASE_URL}/api/v1/categories/${categoryId}`
      );
      
      if (response.data.success) {
        const category = response.data.data.category;
        
        reset({
          disclaimer: category.disclaimer || "",
          additionalDetails: category.additionalDetails || "",
          howToCare: category.howToCare || "",
          faqs: category.faqs || [],
          careInstructions: category.careInstructions || [],
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch category details");
      }
    } catch (err: any) {
      console.error("Error loading category details:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to load category details");
      reset({
        disclaimer: "",
        additionalDetails: "",
        howToCare: "",
        faqs: [],
        careInstructions: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CategoryDetailsFormData) => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.put<UpdateCategoryDetailsResponse>(
        `${API_BASE_URL}/api/v1/categories/${selectedCategory}`,
        {
          ...data,
          faqs: data.faqs || [],
          careInstructions: data.careInstructions || [],
        }
      );

      if (response.data.success) {
        toast.success("Category details updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update category details");
      }
    } catch (err: any) {
      console.error("Error updating category details:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update category details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId || null);
  };

  const handleAddFAQ = () => {
    append({ question: "", answer: "" });
  };

  const handleRemoveFAQ = (index: number) => {
    remove(index);
  };

  const handleAddCareInstruction = () => {
    appendCareInstruction({ title: "", description: "" });
  };

  const handleRemoveCareInstruction = (index: number) => {
    removeCareInstruction(index);
  };

  // Format category name based on its level for better display in dropdown
  const formatCategoryName = (category: Category) => {
    const indent = "\u00A0".repeat(category.level ? category.level * 4 : 0); // Add indentation based on level
    return `${indent}${category.name}`;
  };

  return (
    <DashboardLayout title="Category Additional Details" showBackButton={true}>
      <motion.div
        className="space-y-6 bg-white rounded-lg shadow-lg p-6 min-h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200 title-regular">
            Category Additional Details
          </h1>
        </div>

        <div className="mb-6">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Category
          </label>
          <select
            id="category-select"
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font"
          >
            <option value="">-- Select a Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Disclaimer Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                <label htmlFor="disclaimer" className="block text-sm font-medium text-gray-700">
                  Disclaimer
                </label>
              </div>
              <textarea
                id="disclaimer"
                {...control.register("disclaimer")}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                  errors.disclaimer ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter disclaimer text here..."
              />
              {errors.disclaimer && (
                <p className="text-red-500 text-sm">{errors.disclaimer.message}</p>
              )}
              <p className="text-xs text-gray-500">
                {watch("disclaimer")?.length || 0}/2000 characters
              </p>
            </div>

            {/* Additional Details Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">
                  Additional Details
                </label>
              </div>
              <textarea
                id="additionalDetails"
                {...control.register("additionalDetails")}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                  errors.additionalDetails ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter additional details here..."
              />
              {errors.additionalDetails && (
                <p className="text-red-500 text-sm">{errors.additionalDetails.message}</p>
              )}
              <p className="text-xs text-gray-500">
                {watch("additionalDetails")?.length || 0}/5000 characters
              </p>
            </div>

            {/* How to Care Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                <label htmlFor="howToCare" className="block text-sm font-medium text-gray-700">
                  How to Care
                </label>
              </div>
              <textarea
                id="howToCare"
                {...control.register("howToCare")}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                  errors.howToCare ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter care instructions here..."
              />
              {errors.howToCare && (
                <p className="text-red-500 text-sm">{errors.howToCare.message}</p>
              )}
              <p className="text-xs text-gray-500">
                {watch("howToCare")?.length || 0}/5000 characters
              </p>
            </div>

            {/* Care Instructions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <label className="block text-sm font-medium text-gray-700">
                    Care Instructions
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddCareInstruction}
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Care Instruction
                </button>
              </div>

              <AnimatePresence>
                {careInstructionFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Care Instruction #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveCareInstruction(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        {...control.register(`careInstructions.${index}.title`)}
                        placeholder="Title"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                          errors.careInstructions?.[index]?.title ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.careInstructions?.[index]?.title && (
                        <p className="text-red-500 text-sm">{errors.careInstructions[index]?.title.message}</p>
                      )}
                      
                      <textarea
                        {...control.register(`careInstructions.${index}.description`)}
                        placeholder="Description"
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                          errors.careInstructions?.[index]?.description ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.careInstructions?.[index]?.description && (
                        <p className="text-red-500 text-sm">{errors.careInstructions[index]?.description.message}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {errors.careInstructions && (
                <p className="text-red-500 text-sm">{errors.careInstructions.message}</p>
              )}
            </div>

            {/* FAQs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <label className="block text-sm font-medium text-gray-700">
                    Frequently Asked Questions (FAQs)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddFAQ}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add FAQ
                </button>
              </div>

              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    className="border border-gray-200 rounded-lg p-4 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">FAQ #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveFAQ(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        {...control.register(`faqs.${index}.question`)}
                        placeholder="Question"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                          errors.faqs?.[index]?.question ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.faqs?.[index]?.question && (
                        <p className="text-red-500 text-sm">{errors.faqs[index]?.question.message}</p>
                      )}
                      
                      <textarea
                        {...control.register(`faqs.${index}.answer`)}
                        placeholder="Answer"
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black custom-font ${
                          errors.faqs?.[index]?.answer ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.faqs?.[index]?.answer && (
                        <p className="text-red-500 text-sm">{errors.faqs[index]?.answer.message}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {errors.faqs && (
                <p className="text-red-500 text-sm">{errors.faqs.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-2 bg-[#EB2464] text-white rounded-lg hover:bg-[#d01e57] transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Details
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {!selectedCategory && (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Category Selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please select a category from the dropdown to manage its additional details.
            </p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}