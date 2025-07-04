/**
 * Admin Dashboard - Painel administrativo principal
 */

import React, { useState, useEffect, useRef } from 'react'; // Adicionado useEffect e useRef
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolioStore, useTestimonialsStore } from '../stores';
import PortfolioManager from '../components/admin/PortfolioManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import UsersManager from '../components/admin/UsersManager';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  // Os estados isLoading e error são agora primariamente gerenciados pelos stores.
  // Vamos usar os estados isLoading e error diretamente dos stores para a renderização.
  const isMounted = useRef(true); // Flag para verificar se o componente está montado

  // Stores para estatísticas e estados de carregamento/erro
  const portfolioStore = usePortfolioStore();
  const testimonialsStore = useTestimonialsStore();

  // Desestruturar estados e ações dos stores
  const { projects, isLoading: portfolioLoading, error: portfolioError, fetchProjects } = portfolioStore;
  const { testimonials, isLoading: testimonialsLoading, error: testimonialsError, fetchTestimonials } = testimonialsStore;

  // Combinar estados de loading e erro para o dashboard
  const isLoading = portfolioLoading || testimonialsLoading;
  const error = portfolioError || testimonialsError;

  // Carrega dados quando o componente monta
  useEffect(() => {
    isMounted.current = true; // Marca o componente como montado no início do efeito

    const loadInitialData = async () => {
      // As chamadas fetchProjects e fetchTestimonials já gerenciam seus próprios loadings e erros
      // e atualizam o estado do store. Não precisamos de try/catch/finally aqui
      // para setar isLoading/error do componente, pois já vem dos stores.
      // Apenas precisamos disparar as ações.
      await fetchProjects();
      await fetchTestimonials();
    };

    loadInitialData();

    // Função de cleanup: executa quando o componente é desmontado
    return () => {
      isMounted.current = false; // Marca o componente como desmontado
    };
  }, [fetchProjects, fetchTestimonials]); // Dependências: as funções de fetch dos stores

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const statsCards = [
    {
      title: 'Projetos do Portfólio',
      value: projects?.length || 0, // Usar projects diretamente do store
      description: `${[...new Set(projects?.map(p => p.category))].length || 0} categorias`,
      icon: '📁',
      color: 'purple'
    },
    {
      title: 'Depoimentos',
      value: testimonials?.length || 0, // Usar testimonials diretamente do store
      description: `Média: ${testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0'} ⭐`,
      icon: '💬',
      color: 'indigo'
    },
    {
      title: 'Cache Portfolio',
      value: portfolioStore.isCacheValid() ? 'Ativo' : 'Expirado', // Usar isCacheValid do store
      description: portfolioStore.lastFetch ? new Date(portfolioStore.lastFetch).toLocaleString() : 'Nunca carregado',
      icon: '⚡',
      color: portfolioStore.isCacheValid() ? 'green' : 'orange'
    },
    {
      title: 'Cache Depoimentos',
      value: testimonialsStore.isCacheValid() ? 'Ativo' : 'Expirado', // Usar isCacheValid do store
      description: testimonialsStore.lastFetch ? new Date(testimonialsStore.lastFetch).toLocaleString() : 'N/A',
      icon: '📦',
      color: testimonialsStore.isCacheValid() ? 'green' : 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-gray-900/90 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo e Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">VT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-gray-400 text-sm">VERTEX TARGET</p>
              </div>
            </div>

            {/* User Info e Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">{user?.full_name || 'Administrador'}</p>
                <p className="text-gray-400 text-sm">{user?.email || 'admin@vertextarget.com'}</p>
                <Badge variant="secondary" className="mt-1 text-xs">{user?.role || 'admin'}</Badge>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
              📁 Portfólio
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-purple-600">
              💬 Depoimentos
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              👥 Usuários
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-400">Carregando informações administrativas...</p>
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
            {/* Welcome */}
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-4">
                Bem-vindo ao <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Centro de Comando</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Gerencie todo o conteúdo do seu site de forma simples e eficiente. Atualizações em tempo real.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat) => (
                <Card key={stat.title} className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Portfolio Quick Access */}
              <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <span className="mr-2">📁</span>
                    Gerenciar Portfólio
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Adicione, edite ou remova projetos do portfólio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total de projetos:</span>
                      <Badge variant="secondary">{projects?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Categorias:</span>
                      <Badge variant="secondary">{[...new Set(projects?.map(p => p.category))].length || 0}</Badge>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('portfolio')}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Gerenciar Projetos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials Quick Access */}
              <Card className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-500/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <span className="mr-2">💬</span>
                    Gerenciar Depoimentos
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Adicione, edite ou remova depoimentos de clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total de depoimentos:</span>
                      <Badge variant="secondary">{testimonials?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avaliação média:</span>
                      <Badge variant="secondary">{testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0'} ⭐</Badge>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('testimonials')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Gerenciar Depoimentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Info */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">⚙️</span>
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2">Cache Portfolio</h4>
                    <p className="text-gray-400 mb-1">Status: {portfolioStore.isCacheValid() ? '✅ Ativo' : '❌ Expirado'}</p>
                    <p className="text-gray-400 mb-1">Última atualização: {portfolioStore.lastFetch ? new Date(portfolioStore.lastFetch).toLocaleString() : 'Nunca carregado'}</p>
                    <p className="text-gray-400">Expira em: {portfolioStore.lastFetch ? new Date(portfolioStore.lastFetch + portfolioStore.CACHE_DURATION).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-indigo-400 font-semibold mb-2">Cache Depoimentos</h4>
                    <p className="text-gray-400 mb-1">Status: {testimonialsStore.isCacheValid() ? '✅ Ativo' : '❌ Expirado'}</p>
                    <p className="text-gray-400 mb-1">Última atualização: {testimonialsStore.lastFetch ? new Date(testimonialsStore.lastFetch).toLocaleString() : 'Nunca carregado'}</p>
                    <p className="text-gray-400">Expira em: {testimonialsStore.lastFetch ? new Date(testimonialsStore.lastFetch + testimonialsStore.CACHE_DURATION).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </>
            )}
          </TabsContent>

          {/* Portfolio Management Tab */}
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>

          {/* Testimonials Management Tab */}
          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
