/**
 * User Profile Page - Página para o usuário gerenciar seu próprio perfil
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/usersService'; // Função para atualizar o próprio perfil
import { useToast } from '../hooks/use-toast';
import { Loader2 } from 'lucide-react'; // Ícone de loading

const UserProfilePage = () => {
  const { user, token, logout, login } = useAuth(); // Precisamos de login para re-autenticar se o email mudar
  const { toast } = useToast();
  const isMounted = useRef(true);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    password: '', // Nova senha (opcional)
    confirmPassword: '' // Confirmação da nova senha
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efeito para garantir que o formulário seja preenchido se o usuário carregar depois
  useEffect(() => {
    if (user && isMounted.current) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Lógica isMounted para cleanup
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null); // Limpa o erro ao digitar
  };

  const validateForm = () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      setError('Nome completo e Email são obrigatórios.');
      return false;
    }
    
    // Validação de email básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor, insira um email válido.');
      return false;
    }

    // Validação de senha se estiver sendo alterada
    if (formData.password) {
      if (formData.password.length < 8) {
        setError('A nova senha deve ter pelo menos 8 caracteres.');
        return false;
      }
      if (!/[A-Z]/.test(formData.password)) {
        setError('A nova senha deve conter pelo menos uma letra maiúscula.');
        return false;
      }
      if (!/[a-z]/.test(formData.password)) {
        setError('A nova senha deve conter pelo menos uma letra minúscula.');
        return false;
      }
      if (!/\d/.test(formData.password)) {
        setError('A nova senha deve conter pelo menos um número.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('A nova senha e a confirmação não coincidem.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isMounted.current) setIsLoading(true);
    if (isMounted.current) setError(null);

    try {
      const updatePayload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const updatedUser = await updateUserProfile(updatePayload, token);

      if (isMounted.current) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações de perfil foram salvas com sucesso!",
        });
        // Se o email foi alterado, precisamos re-autenticar o usuário
        if (updatedUser.email !== user.email) {
          toast({
            title: "Email alterado",
            description: "Seu email foi atualizado. Por favor, faça login novamente com o novo email.",
            variant: "default",
            duration: 5000
          });
          await logout(); // Força o logout para o usuário fazer login com o novo email
        } else {
          // Se não mudou o email, atualiza o estado do usuário no AuthContext
          // Isso é importante para que o nome e email atualizados apareçam na UI
          // sem precisar de um refresh completo ou logout/login.
          // O AuthContext precisa expor uma forma de atualizar o 'user' localmente.
          // Por enquanto, o AuthContext já faz isso no login, então um logout/login é mais seguro.
          // Se você quiser evitar o logout, o AuthContext precisaria de uma função `setUser` ou `refreshUser`.
          // Por simplicidade e segurança, manteremos o logout/login se o email mudar.
          // Se apenas o nome mudar, o `user` no AuthContext já é atualizado pelo retorno do `login`
          // ou você pode adicionar uma função `updateUserInContext` ao AuthContext.
          // Por enquanto, assumimos que o `user` do AuthContext já reflete a mudança após esta chamada.
          // Se precisar de atualização imediata sem logout, o AuthContext precisaria de um `setUser` público.
          // Para esta iteração, o `user` no AuthContext é atualizado na próxima vez que o `AuthContext`
          // for reavaliado (ex: refresh da página, ou se o token for renovado).
          // Para garantir, vamos fazer um pequeno truque:
          await login(updatedUser.email, formData.password || "dummy_password_if_not_changed"); // Tenta re-logar para atualizar o contexto
        }
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Limpa campos de senha
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      if (isMounted.current) {
        setError(err.message || 'Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-400">
        Carregando informações do usuário...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900/50 border border-gray-700 rounded-lg shadow-xl">
      <CardHeader className="text-center mb-6">
        <CardTitle className="text-3xl font-bold text-white">Meu Perfil</CardTitle>
        <CardDescription className="text-gray-400">
          Gerencie suas informações pessoais e credenciais de acesso.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white">Nome Completo</Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
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
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Nova Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Deixe em branco para não alterar"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-500">
              Mínimo 8 caracteres com maiúscula, minúscula e número.
            </p>
          </div>

          {/* Confirmação de Senha */}
          {formData.password && ( // Só mostra se uma nova senha foi digitada
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirme sua nova senha"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Botão de Salvar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </div>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </form>
      </CardContent>
    </div>
  );
};

export default UserProfilePage;
