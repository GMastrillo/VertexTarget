import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { testimonials, partners } from '../mockData';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

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

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Picos <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Conquistados</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Histórias reais de clientes que alcançaram o cume do sucesso digital conosco
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          {/* Main Testimonial Display */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-12">
                {/* Quote Icon */}
                <div className="flex justify-center mb-8">
                  <div className="text-6xl text-purple-400 opacity-50">
                    "
                  </div>
                </div>
                
                {/* Testimonial Content */}
                <div className="text-center">
                  <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8 italic">
                    {testimonials[activeTestimonial].quote}
                  </blockquote>
                  
                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    {renderStars(testimonials[activeTestimonial].rating)}
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <img 
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full border-2 border-purple-500 shadow-lg"
                    />
                    <div className="text-left">
                      <h4 className="text-white font-semibold text-lg">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-purple-400 font-medium">
                        {testimonials[activeTestimonial].position}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[activeTestimonial].company}
                      </p>
                    </div>
                  </div>
                  
                  {/* Project Badge */}
                  <div className="mt-6">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2">
                      Projeto: {testimonials[activeTestimonial].project}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTestimonialClick(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  activeTestimonial === index 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* All Testimonials Preview */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
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
                <CardHeader className="text-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mx-auto mb-4 border border-purple-500/50"
                  />
                  <CardTitle className="text-white text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="text-purple-400 text-sm">
                    {testimonial.position}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-400 text-sm text-center leading-relaxed line-clamp-3">
                    {testimonial.quote}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-t border-gray-800 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Parceiros de <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Confiança</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Trabalhamos com as melhores tecnologias e plataformas do mercado para garantir resultados superiores
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="group flex items-center justify-center p-6 bg-gray-900/30 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>

          {/* Partners Trust Badge */}
          <div className="text-center mt-12">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300 px-6 py-3 text-sm">
              <span className="mr-2">🤝</span>
              Parcerias estratégicas para máxima performance
            </Badge>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 pt-16 border-t border-gray-800">
          <h3 className="text-3xl font-bold text-white mb-6">
            Pronto para ser nosso próximo caso de sucesso?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Junte-se aos líderes que já conquistaram seus picos digitais. Sua jornada ao sucesso começa aqui.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="mr-2">🚀</span>
            Iniciar Minha Transformação
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