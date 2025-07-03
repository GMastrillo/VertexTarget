/**
 * User Dashboard - Painel para usuários comuns
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolioStore, useTestimonialsStore } from '../stores';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stores para dados
  const fetchProjects = usePortfolioStore((state) => state.fetchProjects);
  const fetchTestimonials = useTestimonialsStore((state) => state.fetchTestimonials);

  useEffect(() => {
    // Carrega dados quando o componente monta
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const projects = await fetchProjects();
        const reviews = await fetchTestimonials();
        
        // Garante que sempre temos arrays válidos
        setPortfolioProjects(Array.isArray(projects) ? projects : []);
        setTestimonials(Array.isArray(reviews) ? reviews : []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
        // Define arrays vazios em caso de erro
        setPortfolioProjects([]);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchProjects, fetchTestimonials]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const statsCards = [
    {
      title: 'Projetos Disponíveis',
      value: Array.isArray(portfolioProjects) ? portfolioProjects.length : 0,
      description: 'Projetos no portfólio',
      icon: '📁',
      color: 'blue'
    },
    {
      title: 'Depoimentos',
      value: Array.isArray(testimonials) ? testimonials.length : 0,
      description: 'Avaliações de clientes',
      icon: '💬',
      color: 'green'
    },
    {
      title: 'Categorias',
      value: Array.isArray(portfolioProjects) && portfolioProjects.length > 0 
        ? [...new Set(portfolioProjects.map(p => p.category))].length 
        : 0,
      description: 'Áreas de atuação',
      icon: '🏷️',
      color: 'purple'
    },
    {
      title: 'Média de Avaliação',
      value: Array.isArray(testimonials) && testimonials.length > 0
        ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
        : '0.0',
      description: 'Estrelas de satisfação',
      icon: '⭐',
      color: 'yellow'
    }
  ];

  const recentProjects = Array.isArray(portfolioProjects) ? portfolioProjects.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/90 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo e Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">VT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard do Usuário</h1>
                <p className="text-gray-400 text-sm">VERTEX TARGET</p>
              </div>
            </div>

            {/* User Info e Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">{user?.full_name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">{user?.role}</Badge>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600"
              >
                Sair 🚪
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-4">
            Bem-vindo, <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{user?.full_name || 'Usuário'}!</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore nosso portfólio de projetos e descubra como podemos ajudar sua empresa a alcançar novos patamares.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Carregando informações...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!isLoading && (
          <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-blue-500/50 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <CardDescription className="text-gray-400 text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <Card className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">📁</span>
                Projetos Recentes
              </CardTitle>
              <CardDescription className="text-gray-300">
                Últimos projetos adicionados ao portfólio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {project?.category?.substring(0, 2).toUpperCase() || 'PR'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{project?.title || 'Projeto'}</p>
                        <p className="text-gray-400 text-xs">{project?.category || 'Categoria'}</p>
                        <Badge variant="outline" className="mt-1 text-xs border-blue-500/50 text-blue-300">
                          {project?.metric || 'Métrica'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">Nenhum projeto disponível</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Testimonials */}
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">💬</span>
                Depoimentos Recentes
              </CardTitle>
              <CardDescription className="text-gray-300">
                O que nossos clientes dizem sobre nós
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(testimonials) && testimonials.length > 0 ? (
                  testimonials.slice(0, 2).map((testimonial, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white font-medium text-sm">{testimonial?.name || 'Cliente'}</p>
                          <p className="text-gray-400 text-xs">{testimonial?.position || 'Posição não informada'}</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < (testimonial?.rating || 0) ? 'text-yellow-400' : 'text-gray-600'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "{testimonial?.message && testimonial.message.length > 100 
                          ? testimonial.message.substring(0, 100) + '...' 
                          : testimonial?.message || 'Mensagem não disponível'}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">Nenhum depoimento disponível</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-xl">
                Pronto para começar seu projeto?
              </CardTitle>
              <CardDescription className="text-gray-300">
                Entre em contato conosco e descubra como podemos transformar suas ideias em realidade
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
              >
                Ver Site Principal 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;