import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import ContactModal from './ContactModal'; // 1. Importar o modal

const Hero = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. Adicionar estado para o modal

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* ... todo o seu código de background e animações continua igual aqui ... */}
        <div className="absolute inset-0 opacity-20">
            {/* ... */}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            {/* ... */}
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
              Sua  <span className="text-purple-400 font-semibold">Presença Online Completa: </span> Do Site Profissional à 
              <span className="text-indigo-400 font-semibold"> Geração Diária de Leads. </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Soluções de site e gestão de tráfego focadas em uma única métrica: o seu resultado.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25"
              onClick={() => setIsModalOpen(true)} // 3. Alterar o onClick para abrir o modal
            >
              <span className="mr-2">🎯</span>
              <span className="hidden sm:inline">Receber Diagnóstico Gratuito</span>
              <span className="sm:hidden">Diagnóstico</span>
            </Button>
          </div>
        </div>
        
        {/* ... seu código de scroll e decoração continua igual aqui ... */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            {/* ... */}
        </div>
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-purple-500/30 rotate-45 animate-spin-slow hidden md:block"></div>
        <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-indigo-500/30 rotate-12 animate-pulse hidden md:block"></div>
      </section>

      {/* 4. Renderizar o Modal (ele só aparece quando isModalOpen for true) */}
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Hero;
