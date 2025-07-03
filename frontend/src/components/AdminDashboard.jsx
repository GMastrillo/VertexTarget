import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Folder, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    portfolioCount: 0,
    testimonialsCount: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Fetch portfolio count
      const portfolioResponse = await fetch(`${API}/portfolio`);
      const portfolioData = await portfolioResponse.json();
      
      // Fetch testimonials count
      const testimonialsResponse = await fetch(`${API}/testimonials`);
      const testimonialsData = await testimonialsResponse.json();
      
      setStats({
        portfolioCount: portfolioData.length || 0,
        testimonialsCount: testimonialsData.length || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const seedData = async () => {
    try {
      const response = await fetch(`${API}/seed-data`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Dados de exemplo adicionados com sucesso!');
        fetchStats(); // Refresh stats
      } else {
        alert('Erro ao adicionar dados de exemplo');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Erro ao conectar com o servidor');
    }
  };

  const statsCards = [
    {
      title: 'Total Portfolio',
      value: stats.loading ? '...' : stats.portfolioCount,
      icon: Folder,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/portfolio'
    },
    {
      title: 'Total Testimonials',
      value: stats.loading ? '...' : stats.testimonialsCount,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/testimonials'
    },
    {
      title: 'This Month',
      value: stats.loading ? '...' : new Date().toLocaleDateString('pt-BR', { month: 'short' }),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Status',
      value: 'Online',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Projeto',
      description: 'Adicionar projeto ao portfolio',
      icon: Plus,
      href: '/admin/portfolio',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Novo Depoimento',
      description: 'Adicionar depoimento de cliente',
      icon: User,
      href: '/admin/testimonials',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Gerencie seu portfolio e depoimentos</p>
        </div>
        <button
          onClick={seedData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Adicionar Dados de Exemplo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const CardComponent = card.href ? Link : 'div';
          
          return (
            <CardComponent
              key={index}
              to={card.href}
              className={`p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${
                card.href ? 'hover:border-gray-300 cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardComponent>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className={`p-2 rounded-lg ${action.bgColor} mr-4`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Sistema iniciado e conectado ao banco de dados
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            APIs de Portfolio e Testimonials funcionando
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            Dashboard admin configurado com sucesso
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;