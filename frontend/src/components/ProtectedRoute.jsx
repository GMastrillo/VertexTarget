import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from './AdminLayout'; // Importado AdminLayout

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d3a9b] mb-4"></div>
          <p className="text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se um role específico é requerido, verifica se o usuário tem esse role
  if (requiredRole && user?.role !== requiredRole) {
    // Se o usuário está autenticado mas não tem o role correto, 
    // redireciona para sua dashboard apropriada
    const userDashboard = user?.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={userDashboard} replace />;
  }

  // Se o usuário está autenticado e tem o role correto, renderiza o conteúdo
  // Se for um admin, envolve o conteúdo com AdminLayout
  if (requiredRole === 'admin') {
    // Aqui, o AdminLayout envolverá os children (que é o AdminDashboard)
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Para outros roles (ex: 'user'), apenas renderiza os children diretamente
  return children;
};

export default ProtectedRoute;
