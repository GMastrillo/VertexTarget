import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const Services = () => {
  const [expandedService, setExpandedService] = useState(null);

  const services = [
    {
      id: 1,
      title: "Marketing de Alvo",
      icon: "🎯",
      description: "Estratégias de marketing digital com precisão cirúrgica para atingir seu público ideal.",
      details: "Utilizamos IA avançada e análise de dados para criar campanhas que convertem. Nossas estratégias incluem segmentação inteligente, automação de marketing e otimização contínua.",
      technologies: ["Google Ads", "Meta Ads", "Analytics", "CRM Integration", "Marketing Automation"],
      results: "+350% ROI médio",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Desenvolvimento Sob Medida",
      icon: "⚡",
      description: "Criação de sites e aplicações web personalizadas com tecnologia de ponta.",
      details: "Desenvolvemos soluções digitais escaláveis usando as mais modernas tecnologias. Do MVP ao produto completo, criamos experiências digitais que impressionam.",
      technologies: ["React", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
      results: "100% uptime garantido",
      gradient: "from-indigo-600 to-blue-600"
    },
    {
      id: 3,
      title: "Inteligência Artificial",
      icon: "🧠",
      description: "Automações inteligentes que revolucionam processos e aumentam produtividade.",
      details: "Implementamos soluções de IA para automatizar processos, análise preditiva e experiências personalizadas. Chatbots, análise de sentimento e machine learning.",
      technologies: ["OpenAI", "TensorFlow", "Python AI", "Natural Language Processing", "Computer Vision"],
      results: "85% redução em tarefas manuais",
      gradient: "from-purple-600 to-indigo-600"
    }
  ];

  const toggleExpanded = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
            Arsenal de <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Precisão</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Nossa expertise em três pilares fundamentais para dominar o ambiente digital
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-6 sm:mt-8 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <Card 
              key={service.id}
              className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-500 group cursor-pointer backdrop-blur-sm"
              onClick={() => toggleExpanded(service.id)}
            >
              <CardHeader className="text-center pb-4">
                {/* Icon with Neon Effect */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-purple-500/50`}>
                  {service.icon}
                </div>
                
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {service.title}
                </CardTitle>
                
                <CardDescription className="text-gray-400 text-sm sm:text-base leading-relaxed px-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Results Badge */}
                <div className="text-center mb-6">
                  <Badge className={`bg-gradient-to-r ${service.gradient} text-white px-4 py-2 text-sm font-semibold`}>
                    {service.results}
                  </Badge>
                </div>

                {/* Expand/Collapse */}
                <div className={`transition-all duration-500 overflow-hidden ${expandedService === service.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="border-t border-gray-700 pt-6">
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {service.details}
                    </p>
                    
                    <h4 className="text-purple-400 font-semibold mb-3">Tecnologias:</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {service.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 text-xs sm:text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-purple-400 hover:text-white hover:bg-purple-600/20 transition-all"
                >
                  {expandedService === service.id ? 'Mostrar Menos ↑' : 'Saiba Mais ↓'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="hidden sm:inline">Iniciar Minha Jornada 🚀</span>
            <span className="sm:hidden">Iniciar Jornada 🚀</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;