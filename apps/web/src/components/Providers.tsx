'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider } from '@/contexts/CartContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LocationProvider>
        <CartProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#111111',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#ffffff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </CartProvider>
      </LocationProvider>
    </SessionProvider>
  );
}