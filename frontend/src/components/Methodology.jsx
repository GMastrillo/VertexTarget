import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { methodology } from '../mockData';

const Methodology = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-progress through steps
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % methodology.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  return (
    <section 
      id="methodology" 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden"
    >
      {/* Mountain Silhouette Background */}
      <div className="absolute inset-0 opacity-10">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 600" 
          preserveAspectRatio="xMidYMid slice"
        >
          <path 
            d="M0,400 L200,200 L400,150 L600,100 L800,180 L1000,120 L1200,300 L1200,600 L0,600 Z" 
            fill="url(#mountainSilhouette)"
          />
          <defs>
            <linearGradient id="mountainSilhouette" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            A <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Escalada</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Nossa metodologia exclusiva para levar seu projeto ao topo do sucesso digital
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Vertical Timeline - Mountain Ascent Visualization */}
          <div className="relative">
            {/* Mountain Path SVG */}
            <div className="relative h-[600px] flex items-center justify-center">
              <svg 
                width="300" 
                height="500" 
                viewBox="0 0 300 500" 
                className="absolute"
              >
                {/* Mountain Path Line */}
                <path 
                  d="M150 450 L120 350 L100 250 L80 150 L150 50" 
                  fill="none" 
                  stroke="url(#pathGradient)" 
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className={`transition-all duration-2000 ${
                    isVisible ? 'stroke-dashoffset-0' : 'stroke-dashoffset-100'
                  }`}
                />
                
                {/* Step Markers */}
                {methodology.map((step, index) => {
                  const positions = [
                    { x: 150, y: 450 }, // Basecamp
                    { x: 120, y: 350 }, // Acampamento 1
                    { x: 100, y: 250 }, // Acampamento 2
                    { x: 150, y: 50 }   // Cume
                  ];
                  
                  const position = positions[index];
                  const isActive = activeStep === index;
                  const isPassed = activeStep > index;
                  
                  return (
                    <g key={index}>
                      {/* Step Circle */}
                      <circle 
                        cx={position.x} 
                        cy={position.y} 
                        r={isActive ? "20" : "15"}
                        fill={isActive ? "url(#activeGradient)" : isPassed ? "#8B5CF6" : "#374151"}
                        stroke={isActive ? "#8B5CF6" : isPassed ? "#6366F1" : "#6B7280"}
                        strokeWidth="3"
                        className={`transition-all duration-500 cursor-pointer ${
                          isActive ? 'animate-pulse' : ''
                        }`}
                        onClick={() => handleStepClick(index)}
                      />
                      
                      {/* Target Icon for Active Step */}
                      {isActive && (
                        <g className="animate-spin-slow">
                          <circle cx={position.x} cy={position.y} r="8" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                          <circle cx={position.x} cy={position.y} r="4" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                          <circle cx={position.x} cy={position.y} r="2" fill="#FFFFFF" />
                        </g>
                      )}
                      
                      {/* Step Number */}
                      <text 
                        x={position.x} 
                        y={position.y + 5} 
                        textAnchor="middle" 
                        className="text-white text-sm font-bold"
                        fill={isActive ? "#000" : "#FFF"}
                      >
                        {index + 1}
                      </text>
                    </g>
                  );
                })}
                
                {/* Summit Flag */}
                <g className={`transition-all duration-1000 delay-1000 ${
                  activeStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}>
                  <path 
                    d="M150 50 L150 20 L180 30 L150 40 Z" 
                    fill="#8B5CF6" 
                    stroke="#6366F1" 
                    strokeWidth="1"
                  />
                  <line x1="150" y1="50" x2="150" y2="20" stroke="#8B5CF6" strokeWidth="2" />
                </g>
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <radialGradient id="activeGradient">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Step Details */}
          <div className="space-y-8">
            {methodology.map((step, index) => (
              <Card 
                key={index}
                className={`transition-all duration-500 cursor-pointer ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-500 scale-105 shadow-2xl shadow-purple-500/20' 
                    : 'bg-gray-900/50 border-gray-800 hover:border-purple-500/30'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Badge 
                      className={`px-3 py-1 text-sm font-bold ${
                        activeStep === index 
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Etapa {index + 1}
                    </Badge>
                    <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                      {step.duration}
                    </Badge>
                  </div>
                  
                  <CardTitle className={`text-2xl font-bold transition-colors ${
                    activeStep === index ? 'text-white' : 'text-gray-300'
                  }`}>
                    {step.title}
                  </CardTitle>
                  
                  <CardDescription className={`text-lg leading-relaxed ${
                    activeStep === index ? 'text-gray-200' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Expanded Details for Active Step */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    activeStep === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="space-y-4 pt-4 border-t border-purple-500/30">
                      <p className="text-gray-300 leading-relaxed">
                        {step.details}
                      </p>
                      
                      <div>
                        <h4 className="text-purple-400 font-semibold mb-2">Entregáveis:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {step.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                              <span className="text-gray-300 text-sm">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-16">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span className="text-gray-400 text-sm">Progresso da Escalada</span>
            <div className="flex-1 max-w-md bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((activeStep + 1) / methodology.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-purple-400 text-sm font-semibold">
              {Math.round(((activeStep + 1) / methodology.length) * 100)}%
            </span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Pronto para começar sua escalada ao sucesso?
          </h3>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="mr-2">🏔️</span>
            Iniciar Minha Jornada
          </Button>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Methodology;