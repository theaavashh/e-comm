"use client";

import { useState, useEffect, useRef, memo } from "react";
import {
  ShoppingCart,
  User,
  ChevronRight,
  ChevronDown,
  X,
  Menu,
  ChevronLeft,
  LogOut,
  Package,
  Heart,
  UserCircle,
  Settings,
  Scissors,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TopBanner from "./TopBanner";
import SearchBar from "./SearchBar";
import { useCart } from "@/contexts/CartContext";

interface NavItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "dropdown";
  columns?: NavColumn[];
}

interface NavColumn {
  title: string;
  groups?: NavGroup[];
  items?: NavLink[];
}

interface NavGroup {
  title: string;
  items: NavLink[];
}

interface NavLink {
  label: string;
  href: string;
}

interface GlobalHeaderClientProps {
  navigationItems: NavItem[];
}

function GlobalHeaderClient({
  navigationItems: serverNavigationItems,
}: GlobalHeaderClientProps) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [navigationItems, setNavigationItems] = useState<NavItem[]>(
    serverNavigationItems,
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { cartItemCount, cartTotal } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    siteName: "GharSamma",
    siteLogo: "",
    siteFavicon: "",
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
        const response = await fetch(
          `${API_BASE_URL}/api/v1/configuration/public/site-settings`,
          { next: { revalidate: 3600 } },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSiteSettings(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };

    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (siteSettings.siteFavicon) {
      const link = document.querySelector(
        "link[rel~='icon']",
      ) as HTMLLinkElement;
      if (link) {
        link.href = siteSettings.siteFavicon;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = siteSettings.siteFavicon;
        document.head.appendChild(newLink);
      }
    }
  }, [siteSettings.siteFavicon]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full font-inter">
      <TopBanner />

      <div
        className="border-b"
        style={{ backgroundColor: "#EB6426", borderColor: "#d65a1f" }}
      >
        <div className="max-w-8xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-3 md:py-4">
          <div className="flex lg:hidden items-center justify-between gap-2 mb-3 px-4">
            <Link href="/" className="flex items-center">
              {siteSettings.siteLogo ? (
                <img
                  src={siteSettings.siteLogo}
                  alt={siteSettings.siteName}
                  className="h-10 w-auto object-contain"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      (
                        e.currentTarget.nextElementSibling as HTMLElement
                      ).classList.remove("hidden");
                    }
                  }}
                />
              ) : null}
              <img
                src="/main.png"
                alt="GharSamma Logo"
                className="h-10 w-32 object-contain"
              />
            </Link>
          </div>

          <motion.div
            className="lg:hidden mb-3 space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={isMounted ? { duration: 0.3 } : { duration: 0 }}
          >
            <div className="mx-4 flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white rounded-lg hover:bg-orange-700 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex-1">
                <SearchBar placeholder="Search products..." />
              </div>
            </div>
          </motion.div>

          <div className="px-4 relative">
            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <motion.div
                    className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 overflow-y-auto"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  >
                    <div className="sticky top-0 bg-gradient-to-r from-[#EB6426] to-[#4a1f18]">
                      <div className="px-4 py-3 flex items-center justify-between border-b border-white/20">
                        <Link
                          href="/"
                          className="flex items-center flex-shrink-0"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {siteSettings.siteLogo ? (
                            <img
                              src={siteSettings.siteLogo}
                              alt={siteSettings.siteName}
                              className="h-10 w-auto object-contain"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling) {
                                  (
                                    e.currentTarget
                                      .nextElementSibling as HTMLElement
                                  ).classList.remove("hidden");
                                }
                              }}
                            />
                          ) : null}
                          <img
                            src="/main.png"
                            alt="GharSamma Logo"
                            className="h-10 w-32 object-contain"
                          />
                        </Link>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <h2 className="text-white text-lg font-bold">
                          {activeDropdown
                            ? navigationItems.find(
                                (item) => item.id === activeDropdown,
                              )?.label
                            : "Menu"}
                        </h2>
                        <div className="flex items-center gap-2">
                          {activeDropdown && (
                            <button
                              onClick={() => setActiveDropdown(null)}
                              className="text-white hover:bg-[#F0F2F5]/20 p-2 rounded-lg transition-colors"
                            >
                              <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                          )}
                          <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-white hover:bg-[#F0F2F5]/20 p-2 rounded-lg transition-colors"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {!activeDropdown ? (
                        <motion.nav
                          key="main-menu"
                          className="flex flex-col font-extrabold text-black font-inter"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {navigationItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={
                                isMounted
                                  ? { x: 0, opacity: 1 }
                                  : { x: 0, opacity: 1 }
                              }
                              transition={{ delay: 0.1 + index * 0.05 }}
                            >
                              {item.type === "dropdown" ? (
                                <button
                                  onClick={() => setActiveDropdown(item.id)}
                                  className="transition-colors block py-3 px-6 hover:bg-gray-50 border-b border-gray-100 text-sm w-full text-left flex items-center justify-between"
                                >
                                  <span>{item.label}</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              ) : (
                                <Link
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="transition-colors block py-3 px-6 hover:bg-gray-50 border-b border-gray-100 text-sm"
                                >
                                  {item.label}
                                </Link>
                              )}
                            </motion.div>
                          ))}
                        </motion.nav>
                      ) : (
                        navigationItems
                          .filter((i) => i.id === activeDropdown)
                          .map((item) => (
                            <motion.nav
                              key={item.id}
                              className="flex flex-col"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="bg-gray-100 px-4 py-2 flex items-center">
                                <button
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center text-sm font-bold text-gray-700"
                                >
                                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                </button>
                              </div>
                              {item.columns?.map((column, idx) => (
                                <div
                                  key={idx}
                                  className="px-4 py-3 border-b border-gray-200"
                                >
                                  <div className="font-semibold text-gray-800 text-lg mb-1">
                                    {column.title}
                                  </div>
                                  {column.groups ? (
                                    column.groups.map((group, grpIdx) => (
                                      <div key={grpIdx} className="mb-3">
                                        <div className="text-gray-600 text-sm mb-2 font-medium">
                                          {group.title}
                                        </div>
                                        <div className="space-y-2 ml-2">
                                          {group.items.map(
                                            (subItem, subIdx) => (
                                              <Link
                                                key={subIdx}
                                                href={subItem.href}
                                                className="block py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-800 rounded-lg"
                                                onClick={() =>
                                                  setIsMobileMenuOpen(false)
                                                }
                                              >
                                                {subItem.label}
                                              </Link>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="space-y-2">
                                      {column.items?.map((subItem, subIdx) => (
                                        <Link
                                          key={subIdx}
                                          href={subItem.href}
                                          className="block py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-800 rounded-lg"
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                        >
                                          {subItem.label}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </motion.nav>
                          ))
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex items-center justify-between w-full">
            <Link href="/" className="flex items-center flex-shrink-0">
              {siteSettings.siteLogo ? (
                <img
                  src={siteSettings.siteLogo}
                  alt={siteSettings.siteName}
                  className="h-12 lg:h-14 xl:h-16 w-auto object-contain"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      (
                        e.currentTarget.nextElementSibling as HTMLElement
                      ).classList.remove("hidden");
                    }
                  }}
                />
              ) : null}
              <img
                src="/main.png"
                alt="GharSamma Logo"
                className="h-12 lg:h-14 xl:h-16 w-40 object-contain"
              />
            </Link>

            <div className="flex-1 flex justify-center max-w-2xl mx-8">
              <SearchBar
                placeholder="Search products..."
                className="w-full"
                inputClassName="text-lg py-4"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {session?.user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center gap-2 p-2 text-white rounded-lg transition-colors hover:bg-orange-700"
                      style={{ color: "white" }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white text-[#EB6426] flex items-center justify-center font-bold">
                        {session.user.name?.charAt(0).toUpperCase() ||
                          session.user.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                      <span className="text-sm font-bold hidden md:inline">
                        {session.user.name?.split(" ")[0] || "Account"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {session.user.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session.user.email}
                            </p>
                          </div>

                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <UserCircle className="w-4 h-4" />
                            My Account
                          </Link>

                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>

                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <Heart className="w-4 h-4" />
                            My Wishlist
                          </Link>

                          <Link
                            href="/customization"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMenu(false)}
                          >
                            <Scissors className="w-4 h-4" />
                            Request Customization
                          </Link>

                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 p-2 text-white rounded-lg transition-colors hover:bg-orange-700"
                    style={{ color: "white" }}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-sm font-bold">Sign in</span>
                  </Link>
                )}

                <Link
                  href="/cart"
                  className="relative flex flex-col items-center p-2 text-white rounded-lg transition-colors hover:bg-orange-700"
                  style={{ color: "white" }}
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-white font-bold mt-1">
                    <sup className="text-[0.7em]">$</sup>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(cartTotal)}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hidden md:block relative z-[200]"
        ref={categoryRef}
        style={{ backgroundColor: "#622A1F" }}
      >
        <div className="w-full px-6 py-2">
          <nav className="flex items-center justify-center overflow-x-auto">
            <div className="flex space-x-4 md:space-x-5 relative z-[200] text-sm font-extrabold text-white">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() =>
                    item.type === "dropdown" && setActiveDropdown(item.id)
                  }
                  onMouseLeave={() =>
                    item.type === "dropdown" && setActiveDropdown(null)
                  }
                >
                  <Link
                    href={item.href}
                    className={`transition-colors whitespace-nowrap block py-2 px-4 relative ${pathname?.startsWith(item.href) ? "active-link" : ""}`}
                  >
                    <span
                      className={
                        pathname?.startsWith(item.href) ? "text-white" : ""
                      }
                    >
                      {item.label}
                    </span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white block"
                      initial={{
                        scaleX: pathname?.startsWith(item.href) ? 1 : 0,
                      }}
                      animate={{
                        scaleX: pathname?.startsWith(item.href) ? 1 : 0,
                      }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </Link>

                  {item.type === "dropdown" && (
                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className="font-inter absolute top-full left-0 mt-2 bg-white rounded-sm shadow-2xl border border-gray-200 z-[9999] text-black font-normal"
                          style={{
                            width: "max-content",
                            maxWidth: "90vw",
                            minWidth: "600px",
                          }}
                        >
                          <div className="p-6">
                            <div className="flex gap-10">
                              {item.columns?.map((column, idx) => (
                                <div key={idx} className="flex-1 min-w-[200px]">
                                  <h3 className="text-gray-900 mb-4 text-base font-semibold border-b pb-2">
                                    {column.title}
                                  </h3>
                                  <div className="space-y-3">
                                    {column.groups ? (
                                      column.groups.map((group, grpIdx) => (
                                        <div key={grpIdx}>
                                          <h4 className="text-gray-700 text-sm mb-2 font-medium">
                                            {group.title}
                                          </h4>
                                          <div className="space-y-1 ml-2">
                                            {group.items.map(
                                              (subItem, subIdx) => (
                                                <Link
                                                  key={subIdx}
                                                  href={subItem.href}
                                                  className="block text-sm text-black hover:text-blue-600 py-1 transition-colors"
                                                >
                                                  {subItem.label}
                                                </Link>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="space-y-1">
                                        {column.items?.map(
                                          (subItem, subIdx) => (
                                            <Link
                                              key={subIdx}
                                              href={subItem.href}
                                              className="block text-sm text-black hover:text-blue-600 py-1 transition-colors"
                                            >
                                              {subItem.label}
                                            </Link>
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default memo(GlobalHeaderClient);
