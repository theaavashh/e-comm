'use client';

export default function SimpleHomepage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Welcome to GharSamma
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Your destination for authentic Nepali products
        </p>
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

