'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('product') ?? null;
  const quantity = searchParams?.get('quantity') || '1';
  const variant = searchParams?.get('variant') || '0';

  return (
    <div className="min-h-screen bg-gray-50 font-bricolage">
      <CheckoutForm 
        productId={productId} 
        quantity={parseInt(quantity)}
        variant={parseInt(variant)}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-bricolage">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

