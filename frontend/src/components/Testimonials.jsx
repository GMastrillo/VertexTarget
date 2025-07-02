import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTestimonialsStore } from '../stores';
import { partners } from '../mockData'; // Mantemos partners como mock por enquanto

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Zustand store
  const {
    testimonials,
    isLoading,
    error,
    activeTestimonial,
    fetchTestimonials,
    setActiveTestimonial,
    nextTestimonial,
    getStats
  } = useTestimonialsStore();

  // Carregar depoimentos usando o store
  useEffect(() => {
    fetchTestimonials();
    
    // Debug: mostrar estatísticas do cache
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Testimonials Store Stats:', getStats());
    }
  }, [fetchTestimonials, getStats]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isVisible || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible, testimonials.length, nextTestimonial]);

  const handleTestimonialClick = (index) => {
    setActiveTestimonial(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}>
        ⭐
      </span>
    ));
  };

  // Estado de loading
  if (isLoading) {
    return (
      <section 
        id="testimonials" 
        ref={sectionRef}
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Mountain Texture Background */}
        <div className="absolute inset-0 opacity-5">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1200 800" 
            preserveAspectRatio="xMidYMid slice"
          >
            <path 
              d="M0,600 L150,300 L300,400 L450,200 L600,350 L750,150 L900,300 L1050,180 L1200,400 L1200,800 L0,800 Z" 
              fill="url(#mountainTexture1)"
            />
            <path 
              d="M0,700 L200,500 L400,600 L600,400 L800,550 L1000,350 L1200,500 L1200,800 L0,800 Z" 
              fill="url(#mountainTexture2)"
            />
            
            <defs>
              <linearGradient id="mountainTexture1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="mountainTexture2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.03" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Picos <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Conquistados</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Vozes dos que já alcançaram seus objetivos conosco. Cada depoimento é uma nova expedição bem-sucedida.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
          </div>

          {/* Loading State */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50 shadow-2xl animate-pulse">
              <CardHeader className="text-center">
                <div className="h-8 bg-gray-700 rounded mb-4 mx-auto w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2 mx-auto w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded mx-auto w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-700 rounded mb-6"></div>
                <div className="flex justify-center space-x-2 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Loading message */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Carregando depoimentos dos nossos clientes...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <section 
        id="testimonials" 
        ref={sectionRef}
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Mountain Texture Background */}
        <div className="absolute inset-0 opacity-5">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1200 800" 
            preserveAspectRatio="xMidYMid slice"
          >
            <path 
              d="M0,600 L150,300 L300,400 L450,200 L600,350 L750,150 L900,300 L1050,180 L1200,400 L1200,800 L0,800 Z" 
              fill="url(#mountainTexture1)"
            />
            <path 
              d="M0,700 L200,500 L400,600 L600,400 L800,550 L1000,350 L1200,500 L1200,800 L0,800 Z" 
              fill="url(#mountainTexture2)"
            />
            
            <defs>
              <linearGradient id="mountainTexture1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="mountainTexture2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.03" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Picos <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Conquistados</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Vozes dos que já alcançaram seus objetivos conosco. Cada depoimento é uma nova expedição bem-sucedida.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
          </div>

          {/* Error State */}
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Problema ao carregar depoimentos</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Estado vazio
  if (testimonials.length === 0) {
    return (
      <section 
        id="testimonials" 
        ref={sectionRef}
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Mountain Texture Background */}
        <div className="absolute inset-0 opacity-5">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1200 800" 
            preserveAspectRatio="xMidYMid slice"
          >
            <path 
              d="M0,600 L150,300 L300,400 L450,200 L600,350 L750,150 L900,300 L1050,180 L1200,400 L1200,800 L0,800 Z" 
              fill="url(#mountainTexture1)"
            />
            <path 
              d="M0,700 L200,500 L400,600 L600,400 L800,550 L1000,350 L1200,500 L1200,800 L0,800 Z" 
              fill="url(#mountainTexture2)"
            />
            
            <defs>
              <linearGradient id="mountainTexture1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="mountainTexture2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.03" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Picos <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Conquistados</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Vozes dos que já alcançaram seus objetivos conosco. Cada depoimento é uma nova expedição bem-sucedida.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
          </div>

          {/* Empty State */}
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum depoimento encontrado</h3>
            <p className="text-gray-400">Em breve teremos histórias incríveis de sucesso para compartilhar!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
    >
      {/* Mountain Texture Background */}
      <div className="absolute inset-0 opacity-5">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 800" 
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Mountain Silhouettes */}
          <path 
            d="M0,600 L150,300 L300,400 L450,200 L600,350 L750,150 L900,300 L1050,180 L1200,400 L1200,800 L0,800 Z" 
            fill="url(#mountainTexture1)"
          />
          <path 
            d="M0,700 L200,500 L400,600 L600,400 L800,550 L1000,350 L1200,500 L1200,800 L0,800 Z" 
            fill="url(#mountainTexture2)"
          />
          
          <defs>
            <linearGradient id="mountainTexture1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="mountainTexture2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.03" />
            </linearGradient>
          </defs>
        </svg>
      </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
              Picos <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Conquistados</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Histórias reais de clientes que alcançaram o cume do sucesso digital conosco
            </p>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-6 sm:mt-8 rounded-full"></div>
          </div>

        {/* Testimonials Section */}
        <div className="mb-16 sm:mb-20">
          {/* Main Testimonial Display */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8 md:p-12">
                {/* Quote Icon */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="text-4xl sm:text-5xl md:text-6xl text-purple-400 opacity-50">
                    "
                  </div>
                </div>
                
                {/* Testimonial Content */}
                <div className="text-center">
                  <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed mb-6 sm:mb-8 italic px-4">
                    {testimonials[activeTestimonial].quote}
                  </blockquote>
                  
                  {/* Rating */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    {renderStars(testimonials[activeTestimonial].rating)}
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <img 
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-purple-500 shadow-lg"
                      loading="lazy"
                    />
                    <div className="text-center sm:text-left">
                      <h4 className="text-white font-semibold text-base sm:text-lg">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-purple-400 font-medium text-sm sm:text-base">
                        {testimonials[activeTestimonial].position}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {testimonials[activeTestimonial].company}
                      </p>
                    </div>
                  </div>
                  
                  {/* Project Badge */}
                  <div className="mt-4 sm:mt-6">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                      Projeto: {testimonials[activeTestimonial].project}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-3 sm:space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTestimonialClick(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  activeTestimonial === index 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* All Testimonials Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 ${
                  activeTestimonial === index
                    ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500 scale-105'
                    : 'bg-gray-900/30 border-gray-800 hover:border-purple-500/50'
                }`}
                onClick={() => handleTestimonialClick(index)}
              >
                <CardHeader className="text-center p-4 sm:p-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 sm:mb-4 border border-purple-500/50"
                    loading="lazy"
                  />
                  <CardTitle className="text-white text-base sm:text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="text-purple-400 text-xs sm:text-sm">
                    {testimonial.position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex justify-center mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed line-clamp-3">
                    {testimonial.quote}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-t border-gray-800 pt-12 sm:pt-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Parceiros de <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Confiança</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Trabalhamos com as melhores tecnologias e plataformas do mercado para garantir resultados superiores
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 items-center">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="group flex items-center justify-center p-4 sm:p-6 bg-gray-900/30 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-8 sm:max-h-10 md:max-h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Partners Trust Badge */}
          <div className="text-center mt-8 sm:mt-12">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm">
              <span className="mr-2">🤝</span>
              Parcerias estratégicas para máxima performance
            </Badge>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-gray-800">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Pronto para ser nosso próximo caso de sucesso?
          </h3>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Junte-se aos líderes que já conquistaram seus picos digitais. Sua jornada ao sucesso começa aqui.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="mr-2">🚀</span>
            <span className="hidden sm:inline">Iniciar Minha Transformação</span>
            <span className="sm:hidden">Iniciar Transformação</span>
          </Button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;