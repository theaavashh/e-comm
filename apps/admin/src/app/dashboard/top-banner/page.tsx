"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Save,
  X,
  AlertCircle,
} from "lucide-react";

// Validation schema
const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isActive: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function TopBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      isActive: true,
    },
  });

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const url = `${API_BASE_URL}/banners/admin`;
      console.log(`🔄 FRONTEND: Fetching banners from: ${url}`);
      const response = await fetch(url, {
        credentials: "include", // Send httpOnly cookie automatically
      });

      console.log(`🔄 FRONTEND: Fetch response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(
          `🔄 FRONTEND: Fetched ${data.data.length} banners:`,
          data.data,
        );
        setBanners(data.data || []);
      } else {
        console.log(`🔄 FRONTEND: Fetch failed: ${response.statusText}`);
        toast.error("Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle form submission
  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingBanner
        ? `${API_BASE_URL}/banners/${editingBanner.id}`
        : `${API_BASE_URL}/banners`;

      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send httpOnly cookie automatically
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(
          editingBanner
            ? "Banner updated successfully"
            : "Banner created successfully",
        );
        await fetchBanners();
        handleCloseForm();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save banner");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setValue("title", banner.title);
    setValue("isActive", banner.isActive);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    console.log(`🗑️ FRONTEND: DELETE called for banner ${id}`);
    if (!confirm("Are you sure you want to delete this banner?")) {
      console.log(`🗑️ FRONTEND: DELETE cancelled by user`);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: "DELETE",
        credentials: "include", // Send httpOnly cookie automatically
      });

      console.log(`🗑️ FRONTEND: DELETE response status: ${response.status}`);

      if (response.ok) {
        toast.success("Banner deleted successfully");
        await fetchBanners();
      } else {
        toast.error("Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    console.log(`🔄 FRONTEND: Toggle called for banner ${id}`);
    console.log(`🔄 FRONTEND: About to make PATCH request`);
    try {
      const url = `${API_BASE_URL}/banners/${id}/toggle`;
      console.log(`🔄 FRONTEND: Making PATCH request to: ${url}`);

      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include", // Send httpOnly cookie automatically
      });

      console.log(`🔄 FRONTEND: Request made. Method: PATCH, URL: ${url}`);
      console.log(
        `🔄 FRONTEND: Response status: ${response.status} ${response.statusText}`,
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`🔄 FRONTEND: Toggle response:`, result);
        toast.success(result.message);
        console.log(
          `🔄 FRONTEND: About to call fetchBanners() to refresh list`,
        );
        await fetchBanners();
        console.log(`🔄 FRONTEND: fetchBanners() completed`);
      } else {
        console.log(`🔄 FRONTEND: Toggle failed: ${response.statusText}`);
        toast.error("Failed to toggle banner status");
      }
    } catch (error) {
      console.error("🔄 FRONTEND: Error in toggle:", error);
      toast.error("Failed to toggle banner status");
    }
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
    reset({
      title: "",
      isActive: true,
    });
  };

  // Handle new banner
  const handleNewBanner = () => {
    setEditingBanner(null);
    reset({
      title: "",
      isActive: true,
    });
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout title="Top Banner Management" showBackButton={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-bricolag text-gray-900">
              Top Banner Management
            </h1>
            <p className="text-gray-600">
              Manage promotional banners that appear at the top of your website
            </p>
          </div>
          <button
            onClick={handleNewBanner}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        {/* Banners List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {banners.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No banners found
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first promotional banner to get started.
                </p>
                <button
                  onClick={handleNewBanner}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Banner
                </button>
              </div>
            ) : (
              banners.map((banner) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {banner.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              banner.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Updated:{" "}
                              {new Date(banner.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleToggleStatus(banner.id)}
                          className={`p-2 rounded-lg ${
                            banner.isActive
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={banner.isActive ? "Deactivate" : "Activate"}
                        >
                          {banner.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Banner Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingBanner ? "Edit Banner" : "Create New Banner"}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        {...register("title")}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Banner title"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <input
                        {...register("isActive")}
                        type="checkbox"
                        id="isActive"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isActive"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Active (visible on website)
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSubmitting
                        ? "Saving..."
                        : editingBanner
                          ? "Update Banner"
                          : "Create Banner"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
