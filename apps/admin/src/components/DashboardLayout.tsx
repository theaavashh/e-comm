"use client";

import { useState, useEffect } from "react";
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
  Newspaper as ArticleIcon,
  Info as AboutIcon,
  ChevronRight,
  ChevronDown,
  Database,
  Utensils
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export default function DashboardLayout({ 
  children, 
  title = "Dashboard",
  showBackButton = false 
}: DashboardLayoutProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const desktop = width >= 1024;
        const mobile = width < 768;
        
        setIsDesktop(desktop);
        setIsMobile(mobile);
        
        // Always hide sidebar on mobile, show on desktop
        if (desktop) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
        
      }
    };

    checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavigation = (itemId: string, parentId?: string) => {
    if (parentId) {
      // Handle child navigation
      if (itemId === 'categories') {
        router.push('/dashboard/category');
      } else if (itemId === 'all-products') {
        router.push('/dashboard/products');
      } else if (itemId === 'site-settings') {
        router.push('/dashboard/settings');
      } else if (itemId === 'configuration') {
        router.push('/dashboard/settings/configuration');
      } else if (itemId === 'top-banner') {
        router.push('/dashboard?tab=top-banner');
      } else if (itemId === 'popup-banner') {
        router.push('/dashboard/popup-banner');
      } else if (itemId === 'media') {
        router.push('/dashboard/media');
      } else if (itemId === 'about') {
        router.push('/dashboard/about');
      } else if (itemId === 'sales-analytics') {
        router.push('/dashboard/sales-analytics');
      } else if (itemId === 'product-performance') {
        router.push('/dashboard/product-performance');
      } else if (itemId === 'discounts') {
        router.push('/dashboard/discounts');
      } else if (itemId === 'all-orders') {
        router.push('/dashboard/orders');
      } else if (itemId === 'shipped-delivered') {
        router.push('/dashboard/orders/shipped-delivered');
      } else if (itemId === 'returns') {
        router.push('/dashboard/orders/returns');
      } else if (itemId === 'refunds') {
        router.push('/dashboard/orders/refunds');
      } else if (itemId === 'cancellations') {
        router.push('/dashboard/orders/cancellations');
      } else if (itemId === 'all-foods') {
        router.push('/foods');
      } else if (itemId === 'food-categories') {
        router.push('/foods');
      } else if (itemId === 'food-orders') {
        router.push('/foods');
      } else {
        // Handle other child navigation
        console.log('Navigate to:', itemId);
      }
    } else {
      // Handle parent navigation
      if (itemId === 'dashboard') {
        router.push('/dashboard');
      } else if (itemId === 'products' && navigationItems.find(item => item.id === 'products')?.children?.length) {
        toggleSection(itemId);
      } else if (itemId === 'settings' && navigationItems.find(item => item.id === 'settings')?.children?.length) {
        toggleSection(itemId);
      } else if (itemId === 'foods' && navigationItems.find(item => item.id === 'foods')?.children?.length) {
        toggleSection(itemId);
      } else {
        // Handle other parent navigation
        console.log('Navigate to:', itemId);
      }
    }
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      children: [
        { id: "quick-insights", label: "Quick Insights", icon: TrendingUp }
      ]
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      children: [
        { id: "all-orders", label: "All Orders", icon: FileText },
        { id: "shipped-delivered", label: "Shipped/Delivered", icon: Truck },
        { id: "returns", label: "Returns", icon: RotateCcw },
        { id: "refunds", label: "Refunds", icon: DollarSign },
        { id: "cancellations", label: "Cancellations", icon: XCircle }
      ]
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      children: [
        { id: "all-products", label: "All Products", icon: Package2 },
        { id: "categories", label: "Categories", icon: FolderOpen },
        { id: "inventory", label: "Inventory Management", icon: Layers }
      ]
    },
    {
      id: "foods",
      label: "Foods",
      icon: Utensils,
      children: [
        { id: "all-foods", label: "All Foods", icon: Utensils },
        { id: "food-categories", label: "Food Categories", icon: FolderOpen },
        { id: "food-orders", label: "Food Orders", icon: ShoppingCart }
      ]
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      children: [
        { id: "all-customers", label: "All Customers", icon: UserCheck },
        { id: "reviews", label: "Reviews & Ratings", icon: Star }
      ]
    },
    {
      id: "sales",
      label: "Sales",
      icon: DollarSign,
      children: [
        { id: "discounts", label: "Discounts", icon: Percent },
        { id: "promotions", label: "Promotions", icon: Gift },
        { id: "email-marketing", label: "Email Marketing", icon: Mail }
      ]
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      children: [
        { id: "sales-analytics", label: "Sales Analytics", icon: TrendingUp },
        { id: "product-performance", label: "Product Performance", icon: BarChart },
        { id: "customer-analytics", label: "Customer Analytics", icon: Users },
        { id: "marketing-performance", label: "Marketing Performance", icon: Target }
      ]
    },
    {
      id: "content-management",
      label: "Content Management",
      icon: ContentIcon,
      children: [
        { id: "top-banner", label: "Top Banner", icon: SliderIcon },
        { id: "popup-banner", label: "Pop-up Banner", icon: SliderIcon },
        { id: "media", label: "Media", icon: SliderIcon },
        { id: "sliders", label: "Sliders", icon: SliderIcon },
        { id: "articles", label: "Articles", icon: ArticleIcon },
        { id: "about", label: "About", icon: AboutIcon }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      children: [
        { id: "site-settings", label: "Site Settings", icon: Settings },
        { id: "configuration", label: "Configuration", icon: Database }
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && !isDesktop && (
            <motion.div 
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div 
          className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
            isDesktop ? 'w-64' : 'w-80'
          } ${
            isDesktop ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
          }`}
          initial={false}
          animate={{ 
            x: isDesktop ? 0 : (sidebarOpen ? 0 : -320)
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Fixed Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <Image
                  src="/image.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">Admin CMS</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-hide" style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}>
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isExpanded = expandedSections.includes(item.id);
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => {
                        if (hasChildren) {
                          toggleSection(item.id);
                        } else {
                          handleNavigation(item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname.includes(item.id)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      whileHover={{ x: isMobile ? 0 : 5 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {hasChildren && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0 ml-2"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.button>
                    
                    {/* Children */}
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div 
                          className="relative ml-6 mt-1 space-y-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {/* Tree connector line */}
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                          
                          {item.children.map((child, index) => {
                            const ChildIcon = child.icon;
                            const isLast = index === item.children.length - 1;
                            
                            return (
                              <motion.div
                                key={child.id}
                                className="relative"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                              >
                                {/* Curved connector - horizontal line with curve */}
                                <div className="absolute left-0 top-1/2 w-6 h-3  transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>
                                
                                <motion.button
                                  onClick={() => handleNavigation(child.id, item.id)}
                                  className={`w-full flex items-center pl-8 pr-3 py-3 text-sm font-medium rounded-lg transition-colors relative ${
                                    typeof window !== 'undefined' && window.location.pathname.includes(child.id)
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                  }`}
                                  whileHover={{ x: isMobile ? 0 : 5 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <ChildIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                                  <span className="truncate">{child.label}</span>
                                </motion.button>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </nav>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Main content */}
        <div className={`${isDesktop ? 'pl-64' : 'pl-0'} w-full transition-all duration-300`}>
          {/* Top bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`lg:hidden p-2 rounded-md transition-colors ${
                    sidebarOpen 
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {showBackButton && (
                  <motion.button
                    onClick={() => router.back()}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {title}
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="hidden sm:block text-sm text-gray-500">
                  Welcome back, {user?.firstName || 'Admin'}
                </div>
                <div className="sm:hidden text-xs text-gray-500">
                  {user?.firstName || 'Admin'}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Quick Actions */}
          {isMobile && (
            <div className="bg-white border-b border-gray-200 px-4 py-2">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <button
                  onClick={() => handleNavigation('all-products')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Products
                </button>
                <button
                  onClick={() => handleNavigation('all-orders')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleNavigation('all-customers')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Customers
                </button>
                <button
                  onClick={() => handleNavigation('sales-analytics')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
          )}

          {/* Page content */}
          <motion.main 
            className="p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
