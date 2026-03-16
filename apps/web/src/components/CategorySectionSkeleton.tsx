export default function CategorySectionSkeleton() {
  return (
    <div className="w-full px-4 py-4 bg-white my-4 mt-8 md:mt-16">
      <div className="mb-6 md:mb-8 mx-4 sm:mx-8 md:mx-12 lg:mx-20 mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
          <div className="h-8 sm:h-10 md:h-12 bg-gray-200 rounded w-48 sm:w-64 animate-pulse" />
          <div className="h-5 sm:h-6 md:h-8 bg-gray-200 rounded w-40 sm:w-56 animate-pulse mt-2 md:mt-0" />
        </div>
      </div>

      <div className="relative mx-4 sm:mx-8 md:mx-16">
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-hide">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-[#F0F2F5] rounded-lg p-4 animate-pulse"
            >
              <div className="flex flex-row items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 ml-4">
                  <div className="h-6 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
