/**
 * Admin Dashboard - Painel administrativo principal
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { usePortfolioStore, useTestimonialsStore } from '../stores';
import PortfolioManager from '../components/admin/PortfolioManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get fetchProjects and fetchTestimonials functions from stores
  const fetchProjects = usePortfolioStore((state) => state.fetchProjects);
  const fetchTestimonials = useTestimonialsStore((state) => state.fetchTestimonials);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (fetchProjects) await fetchProjects();
        if (fetchTestimonials) await fetchTestimonials();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchProjects, fetchTestimonials]);

  // Stores para estatísticas
  const portfolioStats = usePortfolioStore((state) => {
    try {
      return state.getStats ? state.getStats() : {
        totalProjects: 0,
        categories: [],
        lastFetch: 'Nunca',
        cacheValid: false,
        cacheExpiry: 'N/A'
      };
    } catch (error) {
      console.error('Error getting portfolio stats:', error);
      return {
        totalProjects: 0,
        categories: [],
        lastFetch: 'Nunca',
        cacheValid: false,
        cacheExpiry: 'N/A'
      };
    }
  });
  
  const testimonialsStats = useTestimonialsStore((state) => {
    try {
      return state.getStats ? state.getStats() : {
        totalTestimonials: 0,
        averageRating: 0,
        lastFetch: 'Nunca',
        cacheValid: false,
        cacheExpiry: 'N/A'
      };
    } catch (error) {
      console.error('Error getting testimonials stats:', error);
      return {
        totalTestimonials: 0,
        averageRating: 0,
        lastFetch: 'Nunca',
        cacheValid: false,
        cacheExpiry: 'N/A'
      };
    }
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const statsCards = [
    {
      title: 'Projetos do Portfólio',
      value: portfolioStats.totalProjects,
      description: `${portfolioStats.categories.length} categorias`,
      icon: '📁',
      color: 'purple'
    },
    {
      title: 'Depoimentos',
      value: testimonialsStats.totalTestimonials,
      description: `Média: ${testimonialsStats.averageRating} ⭐`,
      icon: '💬',
      color: 'indigo'
    },
    {
      title: 'Cache Portfolio',
      value: portfolioStats.cacheValid ? 'Ativo' : 'Expirado',
      description: portfolioStats.lastFetch,
      icon: '⚡',
      color: portfolioStats.cacheValid ? 'green' : 'orange'
    },
    {
      title: 'Cache Depoimentos',
      value: testimonialsStats.cacheValid ? 'Ativo' : 'Expirado',
      description: testimonialsStats.lastFetch,
      icon: '📦',
      color: testimonialsStats.cacheValid ? 'green' : 'orange'
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
                <p className="text-white font-semibold">{user?.full_name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
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
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
              📁 Portfólio
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-purple-600">
              💬 Depoimentos
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
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
              {statsCards.map((stat, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all">
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
                      <Badge variant="secondary">{portfolioStats.totalProjects}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Categorias:</span>
                      <Badge variant="secondary">{portfolioStats.categories.length}</Badge>
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
                      <Badge variant="secondary">{testimonialsStats.totalTestimonials}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avaliação média:</span>
                      <Badge variant="secondary">{testimonialsStats.averageRating} ⭐</Badge>
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
                    <p className="text-gray-400 mb-1">Status: {portfolioStats.cacheValid ? '✅ Ativo' : '❌ Expirado'}</p>
                    <p className="text-gray-400 mb-1">Última atualização: {portfolioStats.lastFetch}</p>
                    <p className="text-gray-400">Expira em: {portfolioStats.cacheExpiry}</p>
                  </div>
                  <div>
                    <h4 className="text-indigo-400 font-semibold mb-2">Cache Depoimentos</h4>
                    <p className="text-gray-400 mb-1">Status: {testimonialsStats.cacheValid ? '✅ Ativo' : '❌ Expirado'}</p>
                    <p className="text-gray-400 mb-1">Última atualização: {testimonialsStats.lastFetch}</p>
                    <p className="text-gray-400">Expira em: {testimonialsStats.cacheExpiry}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Management Tab */}
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>

          {/* Testimonials Management Tab */}
          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;