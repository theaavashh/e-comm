'use client';

import { useParams } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';

export default function ProductPage() {
  const params = useParams();
  const { category, id } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail 
        productId={id as string} 
        category={category as string} 
      />
    </div>
  );
}

