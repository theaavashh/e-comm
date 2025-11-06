'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Building2, Package, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Brand {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  inStock: boolean;
  brand: string;
  tags: string[];
  sku: string;
}

export default function BrandPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First, get all brands to find the one with matching website/slug
        const brandsResponse = await fetch(`${API_BASE_URL}/api/v1/brands`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!brandsResponse.ok) {
          throw new Error(`Failed to fetch brands: ${brandsResponse.status}`);
        }

        const brandsData = await brandsResponse.json();
        
        if (brandsData.success && brandsData.data && brandsData.data.brands && Array.isArray(brandsData.data.brands)) {
          // Find brand by website/slug match
          const foundBrand = brandsData.data.brands.find((b: Brand) => 
            b.website === `/${slug}` || b.website === `/${slug}/`
          );
          
          if (foundBrand) {
            setBrand(foundBrand);
            
            // Fetch products for this brand
            const productsResponse = await fetch(`${API_BASE_URL}/api/v1/products?brandId=${foundBrand.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (productsResponse.ok) {
              const productsData = await productsResponse.json();
              if (productsData.success && productsData.data && Array.isArray(productsData.data)) {
                setProducts(productsData.data);
              }
            }
          } else {
            throw new Error('Brand not found');
          }
        } else {
          throw new Error('Invalid brands response format');
        }
      } catch (err) {
        console.error('Error fetching brand data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch brand data');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBrandData();
    }
  }, [slug, API_BASE_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading brand...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The brand you are looking for does not exist.'}</p>
              <Link 
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     

      {/* Brand Hero Section */}
      <div className="bg-[#F0F2F5]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-6">
            {/* Brand Logo */}
            <div className="w-24 h-24  overflow-hidden flex items-center justify-center flex-shrink-0">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">${brand.name.charAt(0)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">
                  {brand.name.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Brand Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{brand.name}</h1>
              <p className="text-gray-600 text-lg mb-4">
                Discover products from {brand.name} - a trusted brand in our marketplace
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                {brand._count && (
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>{brand._count.products} product{brand._count.products !== 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Trusted Brand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Products by {brand.name}
          </h2>
          <p className="text-gray-600">
            {products.length > 0 
              ? `Explore ${products.length} product${products.length !== 1 ? 's' : ''} from ${brand.name}`
              : `No products available from ${brand.name} yet`
            }
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                onAddToCart={(product) => console.log('Add to cart:', product)}
                onToggleWishlist={(product) => console.log('Toggle wishlist:', product)}
                onQuickView={(product) => console.log('Quick view:', product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">
              {brand.name} hasn't added any products yet. Check back later!
            </p>
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Other Brands
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
