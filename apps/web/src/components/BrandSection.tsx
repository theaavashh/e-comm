'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

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

export default function BrandSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/brands`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.brands && Array.isArray(data.data.brands)) {
          setBrands(data.data.brands);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch brands');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [API_BASE_URL]);

  if (isLoading) {
    return (
      <div className="bg-[#F0F2F5] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
              <span className='custom-font'>Our Brands</span>
            </h2>
            <p className="text-black text-2xl">Discover trusted brands and their products</p>
          </div>
          
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }


  if (brands.length > 0) {
  return (
    <div className="bg-[#F0F2F5] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
            <span className='custom-font'>Our Brands</span>
          </h2>
          <p className="text-black text-2xl custom-font">Discover trusted brands and their products</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={brand.website || '#'}
              className="w-24 h-24  overflow-hidden hover:scale-110 transition-all duration-300"
            >
              <Image
                src={brand.logo || ''}
                alt={brand.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
}
