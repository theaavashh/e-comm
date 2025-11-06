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
  Utensils,
  CreditCard,
  Lock
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Get user initials for profile picture
  const getUserInitials = () => {
    if (!user) return 'A';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Get full name for display
  const getFullName = () => {
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.username || 'Admin';
  };

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

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [profileDropdownOpen]);

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
      } else if (itemId === 'sliders') {
        router.push('/dashboard/sliders');
      } else if (itemId === 'sales-analytics') {
        router.push('/dashboard/sales-analytics');
      } else if (itemId === 'website-analytics') {
        router.push('/dashboard/website-analytics');
      } else if (itemId === 'product-performance') {
        router.push('/dashboard/product-performance');
      } else if (itemId === 'discounts') {
        router.push('/dashboard/discounts');
      } else if (itemId === 'all-orders') {
        router.push('/dashboard/orders');
      } else if (itemId === 'billing') {
        router.push('/dashboard/billing');
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
      } else if (itemId === 'content-management' && navigationItems.find(item => item.id === 'content-management')?.children?.length) {
        toggleSection(itemId);
      } else if (itemId === 'media') {
        router.push('/dashboard/media');
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
        { id: "billing", label: "Billing", icon: CreditCard },
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
        { id: "website-analytics", label: "Website Analytics", icon: PieChart },
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
        { 
          id: "media", 
          label: "Media", 
          icon: SliderIcon
        },
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
        {sidebarOpen && !isDesktop && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col ${
            isDesktop ? 'w-64' : 'w-80'
          } ${
            isDesktop ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
          }`}
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
              <span className="text-3xl font-bold text-gray-900 custom-font">Admin CMS</span>
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
            <div className="space-y-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isExpanded = expandedSections.includes(item.id);
                const hasChildren = item.children && item.children.length > 0;
                
                                  return (
                  <div 
                    key={item.id}
                  >
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleSection(item.id);
                        } else {
                          handleNavigation(item.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 text-base font-bold rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname.includes(item.id)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="truncate custom-font">{item.label}</span>
                      </div>
                      {hasChildren && (
                        <div className={`flex-shrink-0 ml-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                    
                    {/* Children */}
                    {hasChildren && isExpanded && (
                        <div className="relative ml-6 mt-1 space-y-1">
                          {/* Tree connector line */}
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                          
                          {item.children.map((child, index) => {
                            const ChildIcon = child.icon;
                            const isLast = index === item.children.length - 1;
                            const hasGrandChildren = (child as any).children && (child as any).children.length > 0;
                            const isChildExpanded = expandedSections.includes(child.id);
                            
                            return (
                              <div
                                key={child.id}
                                className="relative"
                              >
                                {/* Curved connector - horizontal line with curve */}
                                <div className="absolute left-0 top-1/2 w-6 h-3  transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>
                                
                                <button
                                  onClick={() => {
                                    if (hasGrandChildren) {
                                      toggleSection(child.id);
                                    } else {
                                      handleNavigation(child.id, item.id);
                                    }
                                  }}
                                  className={`w-full flex items-center pl-8 pr-3 py-3 text-base font-bold rounded-lg transition-colors relative ${
                                    typeof window !== 'undefined' && window.location.pathname.includes(child.id)
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                  }`}
                                >
                                  <ChildIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                                  <span className="truncate custom-font">{child.label}</span>
                                  {hasGrandChildren && (
                                    <div className={`flex-shrink-0 ml-2 transition-transform ${isChildExpanded ? 'rotate-90' : ''}`}>
                                      <ChevronRight className="w-3 h-3" />
                                    </div>
                                  )}
                                </button>

                                {/* Grand Children (Nested Submenu) */}
                                {hasGrandChildren && isChildExpanded && (
                                    <div className="relative ml-6 mt-1 space-y-1">
                                      {/* Tree connector line for nested items */}
                                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                                      
                                      {((child as any).children || []).map((grandChild: any, grandIndex: number) => {
                                        const GrandChildIcon = grandChild.icon;
                                        
                                        return (
                                          <div
                                            key={grandChild.id}
                                            className="relative"
                                          >
                                            {/* Curved connector for nested items */}
                                            <div className="absolute left-0 top-1/2 w-6 h-3 transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>
                                            
                                            <button
                                              onClick={() => handleNavigation(grandChild.id, child.id)}
                                              className={`w-full flex items-center pl-8 pr-3 py-3 text-base font-bold rounded-lg transition-colors relative ${
                                                typeof window !== 'undefined' && window.location.pathname.includes(grandChild.id)
                                                  ? 'bg-blue-50 text-blue-700'
                                                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                              }`}
                                            >
                                              <GrandChildIcon className="w-3 h-3 mr-3 flex-shrink-0" />
                                              <span className="truncate custom-font">{grandChild.label}</span>
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors custom-font"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className={`${isDesktop ? 'pl-64' : 'pl-0'} w-full`}>
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
                  <button
                    onClick={() => router.back()}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate custom-font">
                  {title}
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Profile Picture with Initials */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm text-gray-500 custom-font font-bold">
                        Welcome back, {user?.firstName || 'Admin'}
                      </div>
                      <div className="text-xs text-gray-400 custom-font">
                        {getFullName()}
                      </div>
                    </div>
                    <ChevronDown 
                      className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setProfileDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                {getUserInitials()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 custom-font">
                                  {getFullName()}
                                </div>
                                <div className="text-xs text-gray-500 custom-font">
                                  {user?.email}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                router.push('/dashboard/settings');
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors custom-font"
                            >
                              <Lock className="w-4 h-4" />
                              <span>Change Password</span>
                            </button>
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                handleLogout();
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors custom-font"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Log out</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
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
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Products
                </button>
                <button
                  onClick={() => handleNavigation('all-orders')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleNavigation('all-customers')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Customers
                </button>
                <button
                  onClick={() => handleNavigation('sales-analytics')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Analytics
                </button>
              </div>
            </div>
          )}

          {/* Page content */}
          <main className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Analytics Overview - only on main Dashboard */}
              
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
