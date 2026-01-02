'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FilterSidebar from '@/components/FilterSidebar';
import { useLocation } from '@/contexts/LocationContext';
import ProductGrid from '@/components/ProductGrid';
import { List, LayoutGrid } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface ApiProduct {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number | string;
  comparePrice?: number | string | null;
  image?: string;
  images?: string[];
  brand?: { name: string } | null;
  averageRating?: number;
  reviewCount?: number;
  category: { slug: string };
}

export default function CategoryListingPage() {
  const { category } = useParams();
  const router = useRouter();
  const { selectedCountry } = useLocation();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<'best' | 'priceAsc' | 'priceDesc'>('best');
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Get user country from context for pricing
        const res = await fetch(`${API_BASE_URL}/api/v1/products?category=${category}&country=${encodeURIComponent(selectedCountry)}`);
        const json = await res.json();
        const list: ApiProduct[] = json?.data?.products || [];
        setProducts(list);
        const uniqueBrands = Array.from(
          new Set((list || []).map((p) => (p.brand?.name || 'Unknown')).filter(Boolean))
        );
        setBrands(uniqueBrands);
      } catch {
        setProducts([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    if (category) load();
  }, [category, selectedCountry]);

  const mappedProducts = useMemo(() => {
    const base = (products || []).map((p, idx) => ({
      id: p.id, // Use actual product ID from API
      name: p.name,
      category: (p.category?.slug as string) || String(category),
      subcategory: '',
      price: Number(p.price) || 0,
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      discount: p.comparePrice ? Math.max(0, Math.round(((Number(p.comparePrice) - Number(p.price)) / Number(p.comparePrice)) * 100)) : 0,
      rating: p.averageRating || 0,
      reviewCount: p.reviewCount || 0,
      image: p.image || p.images?.[0] || '/banner.jpg',
      description: p.shortDescription || p.description || '',
      inStock: true,
      brand: p.brand?.name || 'Unknown',
      tags: [],
      sku: ''
    }));

    // filters
    const byBrand = selectedBrands.length ? base.filter(b => selectedBrands.includes(b.brand)) : base;
    const byPrice = byBrand.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1]);
    const byRating = minRating ? byPrice.filter(b => b.rating >= minRating) : byPrice;

    // sort
    const sorted = [...byRating].sort((a, b) => {
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;
      return (b.rating || 0) - (a.rating || 0);
    });

    return sorted;
  }, [products, selectedBrands, priceRange, minRating, sort, category]);

  const categoryMap = useMemo(() => ({ [String(category)]: String(category) }), [category]);

  return (
    <div className="min-h-screen font-inter mx-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-lg text-black mt-4">
        <a href="/" className="text-black hover:text-gray-700">Home</a>
        <span className="mx-2">/</span>
        <a href="/categories" className="text-black hover:text-gray-700">Categories</a>
        <span className="mx-2">/</span>
        <span className="capitalize text-black">{String(category)}</span>
      </div>

      <div className="flex gap-6 mt-4">
        <FilterSidebar
          categories={categoryMap}
          brands={brands}
          selectedCategory={String(category)}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          minRating={minRating}
          onCategoryChange={(c) => router.push(`/products/${c}`)}
          onBrandToggle={(b) =>
            setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))
          }
          onPriceRangeChange={setPriceRange}
          onRatingChange={setMinRating}
          onClearFilters={() => {
            setSelectedBrands([]);
            setPriceRange([0, 10000]);
            setMinRating(0);
          }}
          className=""
        />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 font-inter text-black">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{String(category)}</h2>
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-black"
              >
                <option value="best">Best Match</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-black ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-[#F0F2F5]'}`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-black ${viewMode === 'list' ? 'bg-gray-100' : 'bg-[#F0F2F5]'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <ProductGrid products={mappedProducts as any} viewMode={viewMode} loading={loading} />
        </div>
      </div>
      </div>
    </div>
  );
}







