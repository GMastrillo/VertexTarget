import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Methodology from "./components/Methodology";
import AIDemo from "./components/AIDemo";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard"; // Dashboard content for /admin
import UserDashboard from "./pages/UserDashboard"; // Dashboard content for /dashboard
import UserProfilePage from "./pages/UserProfilePage"; // Importar UserProfilePage
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { UserCircle2 } from 'lucide-react'; // Ícone de usuário
// Importar os componentes de gerenciamento para as rotas aninhadas
import { AdminLayout } from "./components/AdminLayout"; // Importar AdminLayout
import PortfolioManager from "./components/admin/PortfolioManager";
import TestimonialsManager from "./components/admin/TestimonialsManager";
import UsersManager from "./components/admin/UsersManager";
import { UserLayout } from "./components/UserLayout"; // Importar UserLayout

// Navigation Component
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, user, getDashboardRoute, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDashboardClick = () => {
    if (isAuthenticated() && user) {
      const dashboardPath = getDashboardRoute(user.role);
      navigate(dashboardPath);
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VT</span>
            </div>
            <span className="text-white font-bold text-base sm:text-lg">VERTEX TARGET</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-purple-400 transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-gray-300 hover:text-purple-400 transition-colors">
              Portfólio
            </button>
            <button onClick={() => scrollToSection('methodology')} className="text-gray-300 hover:text-purple-400 transition-colors">
              Metodologia
            </button>
            <button onClick={() => scrollToSection('ai-demo')} className="text-gray-300 hover:text-purple-400 transition-colors">
              IA Demo
            </button>
            <button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
              Contato
            </button>
            
            {/* Botão de Login / Ícone de Perfil */}
            {isAuthenticated() ? (
              <button
                onClick={handleDashboardClick}
                className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-md"
                title={`Acessar Dashboard (${user?.email})`}
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <UserCircle2 size={24} />}
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-md"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 pb-2 space-y-2 border-t border-gray-800 mt-4">
            <button 
              onClick={() => scrollToSection('services')} 
              className="block w-full text-left text-gray-300 hover:text-purple-400 py-3 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')} 
              className="block w-full text-left text-gray-300 hover:text-purple-400 py-3 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              Portfólio
            </button>
            <button 
              onClick={() => scrollToSection('methodology')} 
              className="block w-full text-left text-gray-300 hover:text-purple-400 py-3 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              Metodologia
            </button>
            <button 
              onClick={() => scrollToSection('ai-demo')} 
              className="block w-full text-left text-gray-300 hover:text-purple-400 py-3 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              IA Demo
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block w-full text-left bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Contato
            </button>
            {/* Botão de Login / Ícone de Perfil para Mobile */}
            {isAuthenticated() ? (
              <button
                onClick={handleDashboardClick}
                className="block w-full text-left text-gray-300 hover:text-purple-400 py-3 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Acessar Dashboard
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="block w-full text-left text-gray-300 hover:text-purple-400 py-3 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Homepage Component
const Homepage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <Services />
      <Portfolio />
      <Methodology />
      <AIDemo />
      <Testimonials />
      <Contact />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Dashboard - Apenas para usuários admin */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              } 
            >
              {/* Rotas aninhadas para o Admin Dashboard */}
              <Route index element={<AdminDashboard />} /> {/* Conteúdo padrão para /admin */}
              <Route path="portfolio" element={<PortfolioManager />} /> {/* /admin/portfolio */}
              <Route path="testimonials" element={<TestimonialsManager />} /> {/* /admin/testimonials */}
              <Route path="users" element={<UsersManager />} /> {/* /admin/users */}
            </Route>
            
            {/* User Dashboard - Apenas para usuários comuns */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="user">
                  <UserLayout /> {/* UserLayout agora é o elemento principal da rota /dashboard */}
                </ProtectedRoute>
              } 
            >
              {/* Rotas aninhadas para o User Dashboard */}
              <Route index element={<UserDashboard />} /> {/* Conteúdo padrão para /dashboard */}
              <Route path="profile" element={<UserProfilePage />} /> {/* Nova rota para /dashboard/profile */}
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;
