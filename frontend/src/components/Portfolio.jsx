import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const portfolio = [
    {
      id: 1,
      title: "E-commerce Luxury",
      category: "E-commerce",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      metric: "Conversão +420%",
      description: "Transformação digital completa de marca de luxo com IA personalizada",
      technologies: ["React", "IA Recommendations", "Stripe", "Analytics"],
      results: {
        conversion: "+420%",
        revenue: "+280%",
        engagement: "+156%"
      },
      challenge: "Marca de luxo precisava de presença digital premium mantendo exclusividade",
      solution: "Criamos experiência digital sofisticada com recomendações IA e checkout otimizado",
      outcome: "Aumento significativo em vendas online mantendo padrão de qualidade"
    },
    {
      id: 2,
      title: "FinTech Revolution",
      category: "FinTech",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      metric: "Usuários +650%",
      description: "Plataforma financeira com automação IA e segurança avançada",
      technologies: ["Next.js", "AI Analytics", "Blockchain", "Security"],
      results: {
        users: "+650%",
        transactions: "+890%",
        satisfaction: "98%"
      },
      challenge: "Startup fintech precisava escalar rapidamente com segurança máxima",
      solution: "Arquitetura microserviços com IA para detecção de fraudes e UX intuitiva",
      outcome: "Crescimento exponencial de usuários com zero incidentes de segurança"
    },
    {
      id: 3,
      title: "HealthTech Platform",
      category: "HealthTech",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      metric: "Eficiência +380%",
      description: "Sistema hospitalar com IA preditiva para diagnósticos",
      technologies: ["Vue.js", "AI Diagnostics", "IoT", "Cloud Computing"],
      results: {
        efficiency: "+380%",
        accuracy: "+245%",
        satisfaction: "96%"
      },
      challenge: "Hospital precisava otimizar diagnósticos e reduzir tempo de atendimento",
      solution: "IA preditiva integrada com IoT para monitoramento em tempo real",
      outcome: "Diagnósticos mais rápidos e precisos, melhorando cuidado ao paciente"
    },
    {
      id: 4,
      title: "EduTech Innovation",
      category: "EduTech",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      metric: "Engajamento +290%",
      description: "Plataforma educacional com aprendizado adaptativo por IA",
      technologies: ["React Native", "AI Learning", "Video Streaming", "Analytics"],
      results: {
        engagement: "+290%",
        completion: "+185%",
        satisfaction: "94%"
      },
      challenge: "Instituição educacional queria personalizar aprendizado para cada aluno",
      solution: "IA adaptativa que ajusta conteúdo baseado no progresso individual",
      outcome: "Estudantes mais engajados com melhor desempenho acadêmico"
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Expedições de <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Sucesso</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Cada projeto é um pico conquistado. Descubra as jornadas transformadoras que levamos ao topo.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {portfolio.map((project) => (
            <Card key={project.id} className="bg-black/50 border-gray-800 hover:border-purple-500/50 transition-all duration-500 group overflow-hidden backdrop-blur-sm">
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-6 w-full">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-2">
                      {project.metric}
                    </Badge>
                    <p className="text-white text-sm">{project.description}</p>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                    {project.category}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* CTA Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
                      onClick={() => setSelectedProject(project)}
                    >
                      Ver Jornada Completa 🏔️
                    </Button>
                  </DialogTrigger>
                  
                  {selectedProject && (
                    <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-white mb-2">
                          {selectedProject.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-lg">
                          A jornada até o cume do sucesso digital
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid md:grid-cols-2 gap-8 mt-6">
                        {/* Project Image */}
                        <div>
                          <img 
                            src={selectedProject.image} 
                            alt={selectedProject.title}
                            className="w-full h-64 object-cover rounded-lg shadow-xl"
                          />
                        </div>
                        
                        {/* Results */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-purple-400 font-semibold mb-3 text-lg">Resultados Alcançados:</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(selectedProject.results).map(([key, value]) => (
                                <div key={key} className="bg-gray-800 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-white">{value}</div>
                                  <div className="text-gray-400 capitalize">{key}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Journey Steps */}
                      <div className="mt-8 space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-gray-800 p-6 rounded-lg">
                            <h5 className="text-red-400 font-semibold mb-2">🎯 Desafio</h5>
                            <p className="text-gray-300 text-sm">{selectedProject.challenge}</p>
                          </div>
                          
                          <div className="bg-gray-800 p-6 rounded-lg">
                            <h5 className="text-blue-400 font-semibold mb-2">⚡ Solução</h5>
                            <p className="text-gray-300 text-sm">{selectedProject.solution}</p>
                          </div>
                          
                          <div className="bg-gray-800 p-6 rounded-lg">
                            <h5 className="text-green-400 font-semibold mb-2">🏆 Resultado</h5>
                            <p className="text-gray-300 text-sm">{selectedProject.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6 text-lg">Pronto para sua própria expedição de sucesso?</p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            Começar Minha Jornada 🎯
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;