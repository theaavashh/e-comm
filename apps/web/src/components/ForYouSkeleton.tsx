export default function ForYouSkeleton() {
  return (
    <div className="py-16 bg-white mt-10 pl-5">
      <div className="max-w-7xl mx-0 sm:mx-6 md:mx-8 lg:mx-14 px-0 sm:px-6 lg:px-8">
        <div className="text-left mb-6 sm:mb-8 md:mb-12 w-full">
          <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-32 sm:w-40 animate-pulse mb-2" />
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-64 sm:w-80 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-1 md:gap-4 w-full">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse"
              role="status"
              aria-label={`Loading product ${i + 1}`}
            >
              <div className="relative h-52 md:h-64 bg-gray-100" />
              <div className="p-3 sm:p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="h-6 md:h-8 bg-gray-100 rounded w-20" />
                  <div className="h-4 bg-gray-100 rounded w-12 line-through" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-gray-100 rounded" />
                  ))}
                  <div className="h-3 w-8 bg-gray-100 rounded ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
