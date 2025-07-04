import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  User, // Para "Meu Perfil"
  LogOut,
  Menu,
  Home 
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';

// Itens da barra lateral para o usuário comum
const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  // Você pode adicionar mais itens aqui no futuro, como:
  // {
  //   title: 'Meus Projetos',
  //   href: '/dashboard/my-projects',
  //   icon: Briefcase,
  // },
  // {
  //   title: 'Meus Depoimentos',
  //   href: '/dashboard/my-testimonials',
  //   icon: MessageSquare,
  // },
  {
    title: 'Meu Perfil', // Nova opção para gerenciar o próprio perfil
    href: '/dashboard/profile',
    icon: User,
  },
];

function UserSidebarContent({ className = "", onCloseSheet }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    if (onCloseSheet) onCloseSheet();
  };

  const handleGoHome = () => {
    navigate('/');
    if (onCloseSheet) onCloseSheet();
  };

  return (
    <div className={cn("flex h-full flex-col bg-gray-900 text-white", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">VertexTarget</h2>
        <p className="text-sm text-gray-400">Dashboard do Usuário</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href) && 
                           (location.pathname === item.href || item.href === '/dashboard');
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onCloseSheet}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
        {/* Link para Voltar ao Site Principal */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Home className="h-5 w-5" />
          <span>Voltar ao Site Principal</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-white hover:bg-red-800"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function UserLayout() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-gray-800">
        <UserSidebarContent />
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-gray-900 text-white hover:bg-gray-800">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-gray-900 border-r border-gray-800">
            <UserSidebarContent onCloseSheet={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content - Adicionado o fundo aqui */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="p-6 lg:p-8">
          <Outlet /> {/* Aqui o conteúdo da rota filha será renderizado */}
        </div>
      </main>
    </div>
  );
}
