import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

const Hero = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-900/20"></div>
        <div className="grid grid-cols-12 gap-px h-full w-full opacity-30">
          {Array.from({ length: 144 }, (_, i) => (
            <div 
              key={i} 
              className="border border-purple-500/10 animate-pulse" 
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Mountain SVG Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          width="300" 
          height="250" 
          viewBox="0 0 400 300" 
          className="opacity-30 w-64 h-48 sm:w-80 sm:h-60 md:w-96 md:h-72 lg:w-full lg:h-full max-w-md"
        >
          {/* Mountain Path */}
          <path 
            d="M50 250 L150 100 L200 50 L250 100 L350 250 Z" 
            fill="none" 
            stroke="url(#mountainGradient)" 
            strokeWidth="2"
            className={`transition-all duration-3000 ${isAnimated ? 'stroke-dasharray-none' : 'stroke-dasharray-1000 stroke-dashoffset-1000'}`}
          />
          
          {/* Target at Peak */}
          <g className={`transition-all duration-1000 delay-2000 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <circle cx="200" cy="50" r="15" fill="none" stroke="#8B5CF6" strokeWidth="2" className="animate-pulse" />
            <circle cx="200" cy="50" r="10" fill="none" stroke="#6366F1" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <circle cx="200" cy="50" r="5" fill="#8B5CF6" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </g>
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`transition-all duration-1000 delay-1000 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-4 tracking-tight">
              VERTEX
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent ml-2 md:ml-4">
                TARGET
              </span>
            </h1>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          {/* Main Slogan */}
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-gray-300 mb-6 sm:mb-8 font-light max-w-4xl mx-auto leading-relaxed">
            Atingindo o <span className="text-purple-400 font-semibold">Pico</span> do seu 
            <span className="text-indigo-400 font-semibold"> Potencial Digital</span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Criação de sites/aplicações, automações com IA e marketing digital de precisão. 
            Sua agência tecnológica para conquista do mercado digital.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25"
            onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="mr-2">🎯</span>
            <span className="hidden sm:inline">Nossas Estratégias</span>
            <span className="sm:hidden">Estratégias</span>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Geometric Decoration */}
      <div className="absolute top-20 right-20 w-20 h-20 border-2 border-purple-500/30 rotate-45 animate-spin-slow hidden md:block"></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-indigo-500/30 rotate-12 animate-pulse hidden md:block"></div>
    </section>
  );
};

export default Hero;