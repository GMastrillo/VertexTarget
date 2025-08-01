import React, { createContext, useContext, useState, useEffect } from 'react';

// Função auxiliar para normalizar URLs e evitar barras duplas
// Esta função deve estar no topo do arquivo, fora de qualquer componente ou hook.
const normalizeUrl = (baseUrl, path) => {
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${trimmedBase}/${trimmedPath}`;
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Debug: Log da URL do backend
  console.log('🔗 BACKEND_URL configurado:', BACKEND_URL);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Tentando login para:', email);
      
      // Use a função normalizeUrl aqui para construir a URL corretamente
      const loginApiUrl = normalizeUrl(BACKEND_URL, '/api/auth/login');
      console.log('🌐 URL do login:', loginApiUrl);
      
      const response = await fetch(loginApiUrl, { // Usando a URL normalizada
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Função para determinar a rota correta baseada no role do usuário
  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'user':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Verifica se o usuário é admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Verifica se o usuário é comum
  const isUser = () => {
    return user?.role === 'user';
  };

  const value = {
    user,
    token: getToken(),
    login,
    logout,
    isAuthenticated,
    getAuthHeader,
    getToken,
    getDashboardRoute,
    isAdmin,
    isUser,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
