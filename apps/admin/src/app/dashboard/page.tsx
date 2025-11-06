"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  BarChart3, 
  FolderOpen, 
  Package, 
  Percent, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  FileText,
  Star,
  Truck,
  RotateCcw,
  XCircle,
  Package2,
  Layers,
  BarChart,
  Mail,
  Gift,
  Target,
  PieChart,
  UserCheck,
  MessageSquare,
  TrendingDown,
  AlertTriangle,
  Clock,
  FileText as ContentIcon,
  Image as SliderIcon,
  Image as ImageIcon,
  Newspaper as ArticleIcon,
  Info as AboutIcon,
  ChevronRight,
  ChevronDown,
  Plus
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [editingBanner, setEditingBanner] = useState<{ id: string; [key: string]: any } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<{ id: string; [key: string]: any } | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    isActive: true
  });
  const searchParams = useSearchParams();

  // Read tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch banners when top-banner tab is active
  useEffect(() => {
    if (activeTab === 'top-banner') {
      fetchBanners();
    }
  }, [activeTab]);

  // Function to fetch banners
  const fetchBanners = async () => {
    setIsLoadingBanners(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/banners`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data.data || []);
      } else {
        console.error('Failed to fetch banners');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  // Handle form field changes
  const handleFormChange = (field: string, value: any) => {
    setBannerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form when modal opens
  const openModal = () => {
    setBannerForm({
      title: '',
      isActive: true
    });
    setEditingBanner(null);
    setIsBannerModalOpen(true);
  };

  // Open edit modal with banner data
  const openEditModal = (banner: any) => {
    setBannerForm({
      title: banner.title,
      isActive: banner.isActive
    });
    setEditingBanner(banner);
    setIsBannerModalOpen(true);
  };

  // Handle edit banner
  const handleEditBanner = async () => {
    if (!editingBanner) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/banners/${editingBanner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerForm),
      });

      if (response.ok) {
        toast.success('Banner updated successfully!');
        setIsBannerModalOpen(false);
        setEditingBanner(null);
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Error updating banner');
    }
  };

  // Handle delete confirmation
  const openDeleteConfirm = (banner: any) => {
    setBannerToDelete(banner);
    setShowDeleteConfirm(true);
  };

  // Handle delete banner
  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/banners/${bannerToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Banner deleted successfully!');
        setShowDeleteConfirm(false);
        setBannerToDelete(null);
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Error deleting banner');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 custom-font">Dashboard Overview</h2>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Visitors (24h)</h3>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 custom-font">12,4380</p>
                <p className="text-sm text-green-600 custom-font mt-1">+8.2% vs yesterday</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Website Performance</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 custom-font">98</p>
                <p className="text-sm text-green-600 custom-font mt-1">Good (Lighthouse)</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Orders (7d)</h3>
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 custom-font">1,024</p>
                <p className="text-sm text-green-600 custom-font mt-1">+3.4% WoW</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Revenue (7d)</h3>
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 custom-font">NPR 3.2M</p>
                <p className="text-sm text-green-600 custom-font mt-1">+5.1% WoW</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visitors by Country Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 custom-font">Visitorsss by Country</h3>
                  </div>
                  <span className="text-xs text-gray-500 custom-font">Last 7 days</span>
                </div>
                <div className="h-64 flex items-end justify-between space-x-2 px-4">
                  {[
                    { country: 'Nepal', value: 3200 },
                    { country: 'India', value: 4500 },
                    { country: 'USA', value: 2800 },
                    { country: 'UK', value: 2100 },
                    { country: 'AU', value: 1800 },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 space-y-2">
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:from-purple-700 hover:to-purple-500 shadow-md"
                          style={{ height: `${(item.value / 5000) * 200}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 custom-font font-medium">{item.value}</span>
                      <span className="text-xs text-gray-500 custom-font">{item.country}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 custom-font">Orders (Last 14 days)</h3>
                  </div>
                  <span className="text-xs text-gray-500 custom-font">Updated hourly</span>
                </div>
                <div className="h-64 flex items-end justify-between space-x-1 px-4">
                  {[120, 145, 130, 160, 140, 155, 170, 165, 180, 175, 190, 185, 200, 195].map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full relative">
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400 rounded-t transition-all duration-300 hover:from-purple-700 hover:to-purple-600 shadow-sm"
                          style={{ height: `${(value / 200) * 200}px` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Overview Summary */}
            <div className="mt-2">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Total Sales</h3>
                  <p className="text-3xl font-bold text-gray-900 custom-font">NPR 4,523,100</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Orders</h3>
                  <p className="text-3xl font-bold text-gray-900 custom-font">2,350</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Products</h3>
                  <p className="text-3xl font-bold text-gray-900 custom-font">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 custom-font">Customers</h3>
                  <p className="text-3xl font-bold text-gray-900 custom-font">8,921</p>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center custom-font">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Top Products
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">iPhone 15 Pro</span>
                    <span className="text-sm font-medium text-gray-900 custom-font">NPR 129,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">MacBook Air</span>
                    <span className="text-sm font-medium text-gray-900 custom-font">NPR 99,900</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">AirPods Pro</span>
                    <span className="text-sm font-medium text-gray-900 custom-font">NPR 24,900</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center custom-font">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Low Stock
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">Samsung Galaxy S24</span>
                    <span className="text-sm font-medium text-orange-600 custom-font">3 left</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">iPad Pro</span>
                    <span className="text-sm font-medium text-orange-600 custom-font">7 left</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">Apple Watch</span>
                    <span className="text-sm font-medium text-orange-600 custom-font">2 left</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center custom-font">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Pending Orders
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">Order #1234</span>
                    <span className="text-sm font-medium text-blue-600 custom-font">Processing</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">Order #1235</span>
                    <span className="text-sm font-medium text-blue-600 custom-font">Pending</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 custom-font">Order #1236</span>
                    <span className="text-sm font-medium text-blue-600 custom-font">Shipped</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "quick-insights":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Insights</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Detailed insights and analytics will be displayed here...</p>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Order management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "products":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Product management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "customers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Customer management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "sales":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Sales management content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Analytics and reports content will go here...</p>
              </div>
            </div>
          </div>
        );
      case "content-management":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Content management dashboard will be displayed here...</p>
              </div>
            </div>
          </div>
        );
      case "top-banner":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Top Banner Management</h2>
              <button
                onClick={openModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </button>
            </div>
            
            {isLoadingBanners ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading banners...</p>
                  </div>
                </div>
              </div>
            ) : banners.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No banners created yet</h3>
                    <p className="text-gray-500 mb-4">Create your first promotional banner to get started.</p>
                    <button 
                      onClick={openModal}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Create Banner
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner: any) => (
                  <div key={banner.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      {/* Banner Content */}
                      <div className="mb-4">
                        <div 
                          className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: banner.title }}
                        />
                      </div>

                      {/* Status and Date */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/banners/${banner.id}/toggle`, {
                                method: 'PATCH',
                              });
                              if (response.ok) {
                                toast.success(banner.isActive ? 'Banner deactivated' : 'Banner activated');
                                fetchBanners(); // Refresh the list
                              } else {
                                toast.error('Failed to toggle banner status');
                              }
                            } catch (error) {
                              console.error('Error toggling banner:', error);
                              toast.error('Error toggling banner status');
                            }
                          }}
                          className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 ${
                            banner.isActive 
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' 
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          }`}
                        >
                          {banner.isActive ? (
                            <>
                              <Clock className="w-3 h-3" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Star className="w-3 h-3" />
                              Activate
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => openEditModal(banner)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Package className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(banner)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "sliders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sliders Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Manage homepage sliders and banners here...</p>
              </div>
            </div>
          </div>
        );
      case "articles":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Articles Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Create and manage blog articles and news posts here...</p>
              </div>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">About Page Management</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Edit and manage the about page content here...</p>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Settings content will go here...</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <p className="text-gray-500">Content for {activeTab} will be displayed here...</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardLayout title="Dashboard">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Banner Creation Modal */}
      <AnimatePresence>
        {isBannerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsBannerModalOpen(false);
                      setEditingBanner(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title & Content *
                    </label>
                    <RichTextEditor
                      value={bannerForm.title}
                      onChange={(value) => handleFormChange('title', value)}
                      placeholder="e.g., Free Delivery on orders over NPR.10000. Don't miss discount."
                      className="border border-gray-300 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the rich text editor to format your banner content with custom styling</p>
                  </div>




                  {/* Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={bannerForm.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active (visible on website)
                    </label>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 bg-white">
                      <div className="text-center">
                        <div 
                          className="text-sm font-medium text-gray-900"
                          dangerouslySetInnerHTML={{ __html: bannerForm.title || 'Banner content will appear here' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBanner ? handleEditBanner : async () => {
                      try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/banners`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(bannerForm)
                        });

                        if (response.ok) {
                          const result = await response.json();
                          console.log('Banner created:', result);
                          toast.success('Banner created successfully!');
                          setIsBannerModalOpen(false);
                          // Reset form
                          setBannerForm({
                            title: '',
                            isActive: true
                          });
                          // Refresh banner list
                          fetchBanners();
                        } else {
                          const error = await response.json();
                          console.error('Error creating banner:', error);
                          toast.error('Failed to create banner');
                        }
                      } catch (error) {
                        console.error('Error creating banner:', error);
                        toast.error('Failed to create banner');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    {editingBanner ? (
                      <>
                        <Package className="w-4 h-4" />
                        Update Banner
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Banner
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Delete Banner</h2>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this banner? This action cannot be undone.
                  </p>
                  {bannerToDelete && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: bannerToDelete.title }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBanner}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Delete Banner
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </DashboardLayout>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: { background: '#ffffff', color: '#111111' },
          success: { iconTheme: { primary: '#16a34a', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />
    </>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
