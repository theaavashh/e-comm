'use client';

import { useParams } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';

export default function ProductByIdPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail productId={id as string} category="" />
    </div>
  );
}


