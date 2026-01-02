'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist.
        </p>
        <p className="text-gray-500 mb-8">
          You will be redirected to the home page automatically...
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}