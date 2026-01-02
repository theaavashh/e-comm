"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

// Define TypeScript interfaces
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: NavItem[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

// Constants
const BREAKPOINTS = {
  DESKTOP: 1024,
  MOBILE: 768
};

const NAVIGATION_ITEMS: NavItem[] = [
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
    id: "categories",
    label: "Categories",
    icon: FolderOpen,
    children: []
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    children: [
      { id: "all-products", label: "All Products", icon: Package2 },
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
      { id: "google-analytics", label: "Google Analytics", icon: BarChart },
      { id: "facebook-pixel", label: "Facebook Pixel", icon: BarChart },
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
      { id: "navigation", label: "Navigation", icon: Menu },
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
      { id: "configuration", label: "Configuration", icon: Database },
      { id: "variant-management", label: "Variant Management", icon: Package }
    ]
  }
];

export default function DashboardLayout({
  children,
  title = "Dashboard",
  showBackButton = false
}: DashboardLayoutProps) {
  // State management
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Hooks
  const router = useRouter();
  const { user, logout } = useAuth();

  // Memoized user information
  const userInitials = useMemo(() => {
    if (!user) return 'A';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user && user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  }, [user]);

  const fullName = useMemo(() => {
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user?.username || 'Admin';
  }, [user]);

  // Screen size detection
  const checkScreenSize = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const desktop = width >= BREAKPOINTS.DESKTOP;
    const mobile = width < BREAKPOINTS.MOBILE;

    setIsDesktop(desktop);
    setIsMobile(mobile);

    // Auto-manage sidebar state based on screen size
    setSidebarOpen(desktop);
  }, []);

  // Effects
  useEffect(() => {
    checkScreenSize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, [checkScreenSize]);

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

  // Navigation handlers
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const handleNavigation = useCallback((itemId: string, parentId?: string) => {
    // Handle child navigation
    if (parentId) {
      switch (itemId) {
        case 'categories':
          router.push('/dashboard/category');
          break;
        case 'all-products':
          router.push('/dashboard/products');
          break;
        case 'site-settings':
          router.push('/dashboard/settings');
          break;
        case 'configuration':
          router.push('/dashboard/settings/configuration');
          break;
        case 'variant-management':
          router.push('/dashboard/settings/variant-management');
          break;
        case 'top-banner':
          router.push('/dashboard?tab=top-banner');
          break;
        case 'popup-banner':
          router.push('/dashboard/popup-banner');
          break;
        case 'media':
          router.push('/dashboard/media');
          break;
        case 'about':
          router.push('/dashboard/about');
          break;
        case 'sliders':
          router.push('/dashboard/sliders');
          break;
        case 'sales-analytics':
          router.push('/dashboard/sales-analytics');
          break;
        case 'website-analytics':
          router.push('/dashboard/website-analytics');
          break;
        case 'google-analytics':
          router.push('/dashboard?tab=google-analytics');
          break;
        case 'facebook-pixel':
          router.push('/dashboard?tab=facebook-pixel');
          break;
        case 'navigation':
          router.push('/dashboard/navigation');
          break;
        case 'product-performance':
          router.push('/dashboard/product-performance');
          break;
        case 'discounts':
          router.push('/dashboard/discounts');
          break;
        case 'all-orders':
          router.push('/dashboard/orders');
          break;
        case 'billing':
          router.push('/dashboard/billing');
          break;
        case 'shipped-delivered':
          router.push('/dashboard/orders/shipped-delivered');
          break;
        case 'returns':
          router.push('/dashboard/orders/returns');
          break;
        case 'refunds':
          router.push('/dashboard/orders/refunds');
          break;
        case 'cancellations':
          router.push('/dashboard/orders/cancellations');
          break;
        case 'all-foods':
        case 'food-categories':
        case 'food-orders':
          router.push('/foods');
          break;
        default:
          console.log('Navigate to child:', itemId);
      }
    } else {
      // Handle parent navigation
      switch (itemId) {
        case 'dashboard':
          router.push('/dashboard');
          break;
        case 'categories':
          router.push('/dashboard/category');
          break;
        case 'products':
        case 'settings':
        case 'foods':
        case 'content-management':
        case 'analytics':
          const item = NAVIGATION_ITEMS.find(navItem => navItem.id === itemId);
          if (item?.children?.length) {
            toggleSection(itemId);
          }
          break;
        case 'media':
          router.push('/dashboard/media');
          break;
        default:
          console.log('Navigate to parent:', itemId);
      }
    }

    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [router, toggleSection, isMobile]);

  // Render helpers
  const renderNavItems = useMemo(() => {
    return NAVIGATION_ITEMS.map((item) => {
      const Icon = item.icon;
      const isExpanded = expandedSections.includes(item.id);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.id}>
          <button
            onClick={() => {
              if (hasChildren) {
                toggleSection(item.id);
              } else {
                handleNavigation(item.id);
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-3 text-base font-semibold rounded-lg transition-colors title-regular ${typeof window !== 'undefined' && window.location.pathname.includes(item.id)
              ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
              : 'text-black hover:bg-gray-50 hover:text-black'
              }`}
          >
            <div className="flex items-center min-w-0 flex-1">
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-xl custom-font">{item.label}</span>
            </div>
            {hasChildren && (
              <div className={`flex-shrink-0 ml-2 transition-transform title-regular ${isExpanded ? 'rotate-90' : ''}`}>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div className="relative ml-6 mt-1 space-y-1">
              {/* Tree connector line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>

              {item.children?.map((child) => {
                const ChildIcon = child.icon;
                const hasGrandChildren = child.children && child.children.length > 0;
                const isChildExpanded = expandedSections.includes(child.id);

                return (
                  <div key={child.id} className="relative">
                    {/* Curved connector - horizontal line with curve */}
                    <div className="absolute left-0 top-1/2 w-6 h-3 transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>

                    <button
                      onClick={() => {
                        if (hasGrandChildren) {
                          toggleSection(child.id);
                        } else {
                          handleNavigation(child.id, item.id);
                        }
                      }}
                      className={`w-full flex items-center pl-8 pr-3 py-3 text-base font-bold rounded-lg transition-colors relative ${typeof window !== 'undefined' && window.location.pathname.includes(child.id)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-black hover:bg-gray-50 hover:text-black'
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

                        {child.children?.map((grandChild) => {
                          const GrandChildIcon = grandChild.icon;

                          return (
                            <div key={grandChild.id} className="relative">
                              {/* Curved connector for nested items */}
                              <div className="absolute left-0 top-1/2 w-6 h-3 transform -translate-y-1/2 border-l-2 border-b-2 border-gray-300 rounded-bl-2xl"></div>

                              <button
                                onClick={() => handleNavigation(grandChild.id, child.id)}
                                className={`w-full flex items-center pl-8 pr-3 py-3 text-base font-bold rounded-lg transition-colors relative ${typeof window !== 'undefined' && window.location.pathname.includes(grandChild.id)
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-black hover:bg-gray-50 hover:text-black'
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
    });
  }, [expandedSections, handleNavigation, toggleSection]);

  // Main render
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
          className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col ${isDesktop ? 'w-64' : 'w-80'
            } ${isDesktop ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
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
              <span className="text-3xl font-bold text-black title-regular">Admin CMS</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-black hover:text-black hover:bg-gray-100 transition-colors"
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
              {renderNavItems}
            </div>
          </nav>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={() => logout()}
              className="w-full flex items-center px-3 py-2 text-base font-bold text-black hover:bg-gray-50 hover:text-black rounded-lg transition-colors custom-font"
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
                  className={`lg:hidden p-2 rounded-md transition-colors ${sidebarOpen
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'text-black hover:text-black hover:bg-gray-100'
                    }`}
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {showBackButton && (
                  <button
                    onClick={() => router.back()}
                    className="p-2 rounded-md text-black hover:text-black hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-lg sm:text-xl font-bold text-black truncate custom-font">
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
                      {userInitials}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm text-black custom-font font-bold">
                        Welcome back, {user?.firstName || 'Admin'}
                      </div>
                      <div className="text-xs text-black custom-font">
                        {fullName}
                      </div>
                    </div>
                    <ChevronDown
                      className={`hidden sm:block w-4 h-4 text-black transition-transform ${profileDropdownOpen ? 'rotate-180' : ''
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
                                {userInitials}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-black custom-font">
                                  {fullName}
                                </div>
                                <div className="text-xs text-black custom-font">
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
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors custom-font"
                            >
                              <Lock className="w-4 h-4" />
                              <span>Change Password</span>
                            </button>
                            <button
                              onClick={() => {
                                setProfileDropdownOpen(false);
                                logout();
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
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Products
                </button>
                <button
                  onClick={() => handleNavigation('all-orders')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleNavigation('all-customers')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Customers
                </button>
                <button
                  onClick={() => handleNavigation('sales-analytics')}
                  className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors custom-font"
                >
                  Analytics
                </button>
              </div>
            </div>
          )}

          {/* Page content */}
          <main className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}