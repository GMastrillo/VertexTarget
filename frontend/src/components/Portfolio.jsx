import React, { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { usePortfolioStore } from '../stores';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const isMounted = useRef(true); // Flag para verificar se o componente está montado
  
  // Zustand store
  const {
    projects,
    isLoading,
    error,
    fetchProjects,
    getStats
  } = usePortfolioStore();

  // Carregar projetos usando o store
  useEffect(() => {
    isMounted.current = true; // Componente montado

    const loadProjects = async () => {
      try {
        await fetchProjects();
        // O estado `projects` é atualizado pelo store, então não precisamos de setItems aqui.
        // Apenas garantimos que o fetchProjects é chamado.
      } catch (err) {
        // O erro já é tratado pelo store, mas podemos logar aqui se necessário
        console.error("Erro ao carregar projetos no Portfolio.jsx:", err);
      } finally {
        // O isLoading é gerenciado pelo store, não precisamos de setLoading aqui.
      }
    };

    loadProjects();
    
    // Debug: mostrar estatísticas do cache
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Portfolio Store Stats:', getStats());
    }

    // Função de cleanup: executa quando o componente é desmontado
    return () => {
      isMounted.current = false; // Marca o componente como desmontado
    };
  }, [fetchProjects, getStats]); // Dependências do useEffect

  // Estado de loading
  if (isLoading) {
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

          {/* Loading State */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <Card key={index} className="bg-black/50 border-gray-800 overflow-hidden backdrop-blur-sm animate-pulse">
                <div className="w-full h-64 bg-gray-800"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-700 rounded w-14"></div>
                  </div>
                  <div className="h-10 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading message */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Carregando nossos projetos incríveis...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Estado de erro
  if (error) {
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

          {/* Error State */}
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Oops! Algo deu errado</h3>
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
  if (projects.length === 0) {
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

          {/* Empty State */}
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-400">Em breve teremos projetos incríveis para mostrar!</p>
          </div>
        </div>
      </section>
    );
  }

  // Renderização normal com dados do backend
  return (
    <section id="portfolio" className="py-16 sm:py-20 md:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
            Expedições de <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Sucesso</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Cada projeto é um pico conquistado. Descubra as jornadas transformadoras que levamos ao topo.
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-6 sm:mt-8 rounded-full"></div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="bg-black/50 border-gray-800 hover:border-purple-500/50 transition-all duration-500 group overflow-hidden backdrop-blur-sm">
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => e.target.src = 'https://placehold.co/600x400/1a1a2e/ffffff?text=Vertex+Target'}
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                  <div className="p-4 sm:p-6 w-full">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-2 text-xs sm:text-sm">
                      {project.metric}
                    </Badge>
                    <p className="text-white text-sm">{project.description}</p>
                  </div>
                </div>
              </div>

              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300 text-xs sm:text-sm w-fit">
                    {project.category}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0">
                {/* Technologies */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                  {project.technologies && project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors text-xs">
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
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 mx-4">
                      <DialogHeader>
                        <DialogTitle className="text-2xl sm:text-3xl font-bold text-white mb-2">
                          {selectedProject.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-base sm:text-lg">
                          A jornada até o cume do sucesso digital
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-6">
                        {/* Project Image */}
                        <div>
                          <img 
                            src={selectedProject.image} 
                            alt={selectedProject.title}
                            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-xl"
                            onError={(e) => e.target.src = 'https://placehold.co/600x400/1a1a2e/ffffff?text=Vertex+Target'}
                          />
                        </div>
                        
                        {/* Results */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-purple-400 font-semibold mb-3 text-base sm:text-lg">Resultados Alcançados:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedProject.results && Object.entries(selectedProject.results).map(([key, value]) => (
                                <div key={key} className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center">
                                  <div className="text-lg sm:text-2xl font-bold text-white">{value}</div>
                                  <div className="text-gray-400 capitalize text-sm">{key}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Technologies Used */}
                          <div>
                            <h4 className="text-indigo-400 font-semibold mb-3 text-base sm:text-lg">Tecnologias Utilizadas:</h4>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {selectedProject.technologies && selectedProject.technologies.map((tech, index) => (
                                <Badge key={index} className="bg-indigo-600/20 text-indigo-300 border-indigo-600/50 text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Journey Details */}
                      <div className="mt-6 sm:mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                          {/* Challenge */}
                          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
                            <h4 className="text-red-400 font-semibold mb-3 flex items-center text-sm sm:text-base">
                              🎯 Desafio
                            </h4>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                              {selectedProject.challenge}
                            </p>
                          </div>

                          {/* Solution */}
                          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
                            <h4 className="text-blue-400 font-semibold mb-3 flex items-center text-sm sm:text-base">
                              ⚡ Solução
                            </h4>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                              {selectedProject.solution}
                            </p>
                          </div>

                          {/* Outcome */}
                          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
                            <h4 className="text-green-400 font-semibold mb-3 flex items-center text-sm sm:text-base">
                              🏆 Resultado
                            </h4>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                              {selectedProject.outcome}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 sm:mt-8 text-center">
                        <Button 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                          onClick={() => {
                            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                            setSelectedProject(null);
                          }}
                        >
                          <span className="hidden sm:inline">Quero Resultados Como Este! 🚀</span>
                          <span className="sm:hidden">Quero Resultados 🚀</span>
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Portfolio;
