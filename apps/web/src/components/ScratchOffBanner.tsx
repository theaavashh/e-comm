'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ScratchOffBanner() {
  const [isScratched, setIsScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with scratch-off silver color
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add scratch-off texture
    ctx.fillStyle = '#a0a0a0';
    for (let i = 0; i < canvas.width; i += 10) {
      for (let j = 0; j < canvas.height; j += 10) {
        if ((i + j) % 20 === 0) {
          ctx.fillRect(i, j, 5, 5);
        }
      }
    }

    // Add text
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratched) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear a circular area where the user scratches
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check if enough area has been scratched
    checkScratchCompletion();
  };

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Count transparent pixels
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }

    // If more than 50% of pixels are transparent, reveal the code
    if (transparentPixels > (pixels.length / 4) * 0.5) {
      setIsScratched(true);
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratched) return;
    
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    
    handleScratch(mouseEvent as any);
  };

  return (
    <div className="w-full bg-black py-6  relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#facc15', '#ef4444', '#3b82f6', '#10b981'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>

      <div className="max-w-9xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side - Banner Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-400 mb-1 tracking-wide font-inter">
              BLACK FRIDAY
            </h2>
            <p className="text-white text-lg md:text-xl font-bold mb-1 tracking-wide font-inter">
              SPECIAL OFFER
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-0.5 bg-yellow-400 flex-1"></div>
              <span className="text-yellow-400 font-bold text-lg">★</span>
              <div className="h-0.5 bg-yellow-400 flex-1"></div>
            </div>
          </div>

          {/* Center - Scratch Off Area */}
          <div className="flex flex-col items-center">
            <div className="relative bg-black rounded-xl p-3 md:p-4 border-2 border-yellow-400 shadow-2xl">
              <div className="text-center mb-2">
                <p className="text-white text-xs md:text-sm uppercase">Your Exclusive Coupon</p>
              </div>
                            
              {!isScratched ? (
                <div className="relative w-40 h-20 md:w-48 md:h-24">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full cursor-pointer rounded-lg"
                    onMouseMove={handleScratch}
                    onTouchMove={handleTouchMove}
                  />
                </div>
              ) : (
                <div className="w-40 h-20 md:w-48 md:h-24 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                  <span className="text-black font-extrabold text-xs md:text-sm uppercase">Coupon Code</span>
                  <span className="text-black font-extrabold text-xl md:text-2xl mt-1">BF2025</span>
                  <span className="text-black text-xs mt-1">25% OFF Everything!</span>
                </div>
              )}
                            
              <div className="text-center mt-2">
                <p className="text-gray-300 text-xs">
                  {isScratched ? 'Use this code at checkout!' : 'Scratch the silver area!'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Offer Details */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
            <p className="text-white text-base md:text-lg font-bold mb-2 font-inter">
              LIMITED TIME ONLY
            </p>
            <Link 
              href="/products?sale=true" 
              className="mt-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold py-2 px-6 md:py-3 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}