export default function SliderSkeleton() {
  return (
    <div 
      className="relative w-full h-64 md:h-96 bg-gray-100 animate-pulse"
      role="status"
      aria-label="Loading slider"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-wave" />
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" 
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes wave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-wave {
          background-size: 200% 100%;
          animation: wave 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
