import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTargetHit, setIsTargetHit] = useState(false);
  const { toast } = useToast();
  const targetRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsTargetHit(true);
      
      // Target hit animation
      if (targetRef.current) {
        targetRef.current.classList.add('animate-ping');
      }

      toast({
        title: "🎯 Alvo Atingido!",
        description: "Sua mensagem foi enviada com sucesso. Nossa equipe entrará em contato em até 24 horas.",
        duration: 5000,
      });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          budget: '',
          timeline: ''
        });
        setIsSubmitting(false);
        setIsTargetHit(false);
        if (targetRef.current) {
          targetRef.current.classList.remove('animate-ping');
        }
      }, 2000);
    }, 1500);
  };

  const budgetOptions = [
    { value: 'startup', label: 'Startup (R$ 5k - 15k)', icon: '🚀' },
    { value: 'growth', label: 'Crescimento (R$ 15k - 50k)', icon: '📈' },
    { value: 'enterprise', label: 'Enterprise (R$ 50k+)', icon: '🏢' },
    { value: 'discuss', label: 'Vamos Conversar', icon: '💬' }
  ];

  const timelineOptions = [
    { value: 'urgent', label: 'Urgente (1-2 semanas)', icon: '⚡' },
    { value: 'fast', label: 'Rápido (1 mês)', icon: '🏃' },
    { value: 'standard', label: 'Padrão (2-3 meses)', icon: '📅' },
    { value: 'flexible', label: 'Flexível', icon: '🕐' }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-t from-black via-gray-900 to-black relative overflow-hidden">
      {/* Topographic Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 800">
          {/* Topographic Lines */}
          <g stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.3">
            <ellipse cx="500" cy="400" rx="100" ry="60" />
            <ellipse cx="500" cy="400" rx="150" ry="90" />
            <ellipse cx="500" cy="400" rx="200" ry="120" />
            <ellipse cx="500" cy="400" rx="250" ry="150" />
            <ellipse cx="500" cy="400" rx="300" ry="180" />
            <ellipse cx="500" cy="400" rx="350" ry="210" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Fale com um <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Estrategista</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Pronto para alcançar seu próximo pico? Nossa equipe de especialistas está preparada para transformar sua visão em realidade digital.
          </p>
          
          {/* Target Animation */}
          <div className="flex justify-center mb-8">
            <div 
              ref={targetRef}
              className="relative w-24 h-24 mx-auto"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.3" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#6366F1" strokeWidth="2" opacity="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.7" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="#6366F1" strokeWidth="2" opacity="0.9" />
                <circle cx="50" cy="50" r="5" fill="#8B5CF6" className={isTargetHit ? 'animate-pulse' : ''} />
                
                {/* Crosshairs */}
                <line x1="10" y1="50" x2="90" y2="50" stroke="#8B5CF6" strokeWidth="1" opacity="0.5" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="#8B5CF6" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <Card className="bg-gray-900/50 border-gray-800 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                <span className="mr-2">📋</span>
                Conte-nos sobre seu projeto
              </CardTitle>
              <CardDescription className="text-gray-400">
                Preencha os detalhes e nossa equipe entrará em contato para uma consultoria personalizada
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-400 font-semibold mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-400 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-400 font-semibold mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Nome da empresa"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-400 font-semibold mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Budget Selection */}
                <div>
                  <label className="block text-purple-400 font-semibold mb-3">
                    Orçamento Estimado
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {budgetOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, budget: option.value }))}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          formData.budget === option.value
                            ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500/50'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Selection */}
                <div>
                  <label className="block text-purple-400 font-semibold mb-3">
                    Prazo Desejado
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {timelineOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timeline: option.value }))}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          formData.timeline === option.value
                            ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-500/50'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-purple-400 font-semibold mb-2">
                    Descreva seu projeto *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Conte-nos sobre seus objetivos, desafios e como podemos ajudar a atingir seu próximo pico..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <>
                      <span className="mr-2">🎯</span>
                      Atingir o Alvo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & CTA */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-white text-xl mb-4">
                  <span className="mr-2">🚀</span>
                  Vamos Conversar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Email</h4>
                    <p className="text-purple-300">contato@vertexTarget.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">WhatsApp</h4>
                    <p className="text-purple-300">+55 (11) 99999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    🕐
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Horário</h4>
                    <p className="text-purple-300">Seg-Sex: 9h às 18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Guarantee */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-white font-bold text-lg mb-2">
                  Garantia de Precisão
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Comprometidos com resultados excepcionais. Sua satisfação é nosso alvo principal.
                </p>
              </CardContent>
            </Card>

            {/* Response Time */}
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 text-sm">
                <span className="mr-2">⚡</span>
                Resposta em até 24 horas
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-16 border-t border-gray-800">
          <h3 className="text-3xl font-bold text-white mb-4">
            Não perca tempo. Seu próximo pico está esperando.
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Cada dia que passa é uma oportunidade perdida. Comece sua jornada ao topo hoje mesmo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;