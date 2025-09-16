'use client';

import { useSearchParams } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity') || '1';

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutForm 
        productId={productId} 
        quantity={parseInt(quantity)} 
      />
    </div>
  );
}

