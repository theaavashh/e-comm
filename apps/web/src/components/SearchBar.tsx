"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  images?: string[];
}

interface SearchBarProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

function SearchBar({
  className = "",
  inputClassName = "",
  placeholder = "Search products...",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data = await response.json();
      
      if (data.success && data.data?.products) {
        setResults(data.data.products);
        setIsOpen(true);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  }, [searchProducts]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  }, [query, router]);

  const handleResultClick = useCallback((slug: string) => {
    router.push(`/products/${slug}`);
    setIsOpen(false);
    setQuery("");
  }, [router]);

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 pr-24 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-black placeholder-gray-500 ${inputClassName}`}
            aria-label="Search products"
            autoComplete="off"
          />
          
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isLoading && (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            )}
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </form>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
              <p className="mt-2 text-gray-500">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b bg-gray-50">
                Found {results.length} products
              </div>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleResultClick(product.slug)}
                  className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={product.images?.[0] || product.image || "/placeholder-image.jpg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg mr-3"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-center text-orange-600 hover:bg-orange-50 transition-colors border-t"
              >
                View all results
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SearchBar);
