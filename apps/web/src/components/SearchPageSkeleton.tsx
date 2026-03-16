export default function SearchPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-8 md:h-10 bg-[#262626] animate-pulse" />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-4" />
            
            <div className="max-w-3xl">
              <div className="h-14 w-full bg-gray-200 rounded-full animate-pulse" />
            </div>
          </header>

          <div className="mb-6">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 md:h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="h-10 w-full bg-gray-200 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
