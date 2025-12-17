import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Call onFinish after fade out completes
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#234F83] via-[#1a3d6b] to-[#234F83] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Logo Container with Animation */}
        <div className="animate-bounce-slow mb-6">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
            <img
              src="/cosco.png"
              alt="Hospo Logo"
              className="w-32 h-auto sm:w-40 md:w-48 lg:w-56 object-contain animate-scale-pulse"
            />
          </div>
        </div>

        {/* App Name with Fade In Animation */}
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-fade-in-up">
          Hospo
        </h1>
        
        {/* Tagline */}
        <p className="text-white/80 text-sm sm:text-base md:text-lg animate-fade-in-up-delay">
          Healthcare at your fingertips
        </p>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-8">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce-dot-1"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce-dot-2"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce-dot-3"></div>
        </div>
      </div>

      {/* Add custom animations to global CSS */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes scale-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-dot {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-scale-pulse {
          animation: scale-pulse 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }

        .animate-bounce-dot-1 {
          animation: bounce-dot 1.4s ease-in-out infinite;
          animation-delay: 0s;
        }

        .animate-bounce-dot-2 {
          animation: bounce-dot 1.4s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .animate-bounce-dot-3 {
          animation: bounce-dot 1.4s ease-in-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
