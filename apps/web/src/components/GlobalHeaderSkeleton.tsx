export default function GlobalHeaderSkeleton() {
  return (
    <div className="w-full">
      <div className="h-8 md:h-10 bg-[#262626] animate-pulse" />
      
      <div className="bg-[#EB6426] border-b border-[#d65a1f]">
        <div className="max-w-8xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-32 bg-white/20 rounded animate-pulse" />
            
            <div className="flex-1 max-w-2xl mx-4">
              <div className="h-12 w-full bg-white/20 rounded-full animate-pulse" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-8 w-20 bg-white/20 rounded animate-pulse" />
              <div className="h-10 w-24 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="hidden md:block bg-[#622A1F] py-2">
          <div className="max-w-8xl mx-auto px-6">
            <div className="flex justify-center gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-5 w-20 bg-white/10 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
