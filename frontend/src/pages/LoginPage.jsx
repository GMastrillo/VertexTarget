import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, error, setError, user, getDashboardRoute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Clear any previous errors when component mounts
  useEffect(() => {
    setError(null);
  }, [setError]);

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated()) {
    const dashboardRoute = getDashboardRoute(user?.role);
    const from = location.state?.from?.pathname || dashboardRoute;
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect based on user role
      const dashboardRoute = getDashboardRoute(result.user.role);
      const from = location.state?.from?.pathname || dashboardRoute;
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#5d3a9b] to-[#3b1f66] rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Login Universal</h2>
          <p className="text-gray-400">Acesse sua área personalizada</p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#5d3a9b] focus:ring-1 focus:ring-[#5d3a9b] transition-all duration-200"
                  placeholder="admin@vertextarget.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#5d3a9b] focus:ring-1 focus:ring-[#5d3a9b] transition-all duration-200"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-[#5d3a9b] to-[#3b1f66] text-white font-medium rounded-lg hover:from-[#6b4aab] hover:to-[#4b2f76] focus:outline-none focus:ring-2 focus:ring-[#5d3a9b] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Fazendo login...
                </div>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Credentials Help */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Credenciais padrão:</strong><br />
                Email: admin@vertextarget.com<br />
                Senha: VT@admin2025!
              </p>
            </div>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ← Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;