export default function OngoingSalesSkeleton() {
  return (
    <div className="pt-8 px-1 md:px-16">
      <div className="max-w-8xl mx-auto pl-3 pr-3">
        <div className="flex flex-row items-center justify-between mb-5 mx-3">
          <div className="mb-4 sm:mb-0">
            <div className="h-8 md:h-10 bg-gray-200 rounded w-48 animate-pulse mb-2" />
            <div className="h-5 md:h-6 bg-gray-200 rounded w-40 animate-pulse" />
          </div>
          <div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="relative">
          <div
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
          >
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 bg-white shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded-full mt-4" />
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
