interface ProductGridSkeletonProps {
  count?: number;
}

export default function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-lg overflow-hidden border border-gray-100"
          role="status"
          aria-label={`Loading product ${i + 1}`}
        >
          <div className="h-48 md:h-64 bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="flex items-center gap-2 mt-2">
              <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse line-through" />
            </div>
            <div className="h-10 w-full bg-gray-100 rounded-full mt-4 animate-pulse" />
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, j) => (
                <div 
                  key={j} 
                  className="w-3 h-3 bg-gray-100 rounded animate-pulse" 
                />
              ))}
              <div className="h-3 w-8 bg-gray-100 rounded animate-pulse ml-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
