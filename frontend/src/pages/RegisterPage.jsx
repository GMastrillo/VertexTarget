/**
 * Register Page - Página de registro de novos usuários
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user' // Default para 'user'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro quando o usuário começar a digitar
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Todos os campos são obrigatórios');
      return false;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('A senha deve conter pelo menos uma letra maiúscula');
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('A senha deve conter pelo menos uma letra minúscula');
      return false;
    }

    if (!/\d/.test(formData.password)) {
      setError('A senha deve conter pelo menos um número');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao criar conta');
      }

      // Armazenar token e dados do usuário
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirecionar baseado no role
      const dashboardRoute = data.user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(dashboardRoute);

    } catch (error) {
      console.error('Erro no registro:', error);
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">VT</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-400">Junte-se à VERTEX TARGET</p>
        </div>

        {/* Formulário de Registro */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Registro Universal</CardTitle>
            <CardDescription className="text-gray-400">
              Preencha seus dados para criar uma conta
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white">Nome Completo</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Seu nome completo"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-500">
                  Mínimo 8 caracteres com maiúscula, minúscula e número
                </p>
              </div>

              {/* Tipo de Conta - REMOVIDO A OPÇÃO DE ADMIN */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Tipo de Conta</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="user">👤 Usuário</SelectItem>
                    {/* <SelectItem value="admin">⚡ Administrador</SelectItem> */} {/* REMOVIDO */}
                  </SelectContent>
                </Select>
              </div>

              {/* Erro */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Botão de Registro */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            {/* Link para Login */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Fazer Login
                </Link>
              </p>
            </div>

            {/* Link para Home */}
            <div className="mt-4 text-center">
              <Link 
                to="/" 
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                ← Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
