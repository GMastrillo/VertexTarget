/**
 * Users Manager - Componente para gerenciamento de usuários (Admin)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers, updateUser } from '../../services/usersService'; // Importado updateUser
import { useToast } from '../../hooks/use-toast';
import { Edit, Loader2 } from 'lucide-react'; // Importado ícone Edit e Loader2
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'; // Importado Dialog components
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch'; // Importado Switch para is_active

const UsersManager = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const isMounted = useRef(true); // Flag para verificar se o componente está montado
  
  // Estados principais
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // Estado para controlar o modal do formulário
  const [selectedUser, setSelectedUser] = useState(null); // Usuário selecionado para edição
  const [formData, setFormData] = useState({ // Estado para os dados do formulário de edição
    full_name: '',
    email: '',
    role: 'user',
    is_active: true,
    password: '' // Campo opcional para redefinir senha
  });
  const [isSaving, setIsSaving] = useState(false); // Estado para o loading do botão Salvar

  // Carregar usuários na inicialização
  useEffect(() => {
    isMounted.current = true; // Componente montado

    loadUsers();

    return () => {
      isMounted.current = false; // Função de cleanup: marca o componente como desmontado
    };
  }, []); // Dependências vazias para rodar apenas uma vez na montagem

  const loadUsers = async () => {
    try {
      if (isMounted.current) setLoading(true);
      if (isMounted.current) setError(null);
      const data = await getAllUsers(token);
      if (isMounted.current) setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      if (isMounted.current) {
        setError(error.message);
        toast({
          title: "Erro ao carregar usuários",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const openEditForm = (user) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'user',
      is_active: user.is_active,
      password: '' // Sempre limpa a senha ao abrir o formulário
    });
    setIsFormOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedUser) return; // Deve ter um usuário selecionado para editar

    try {
      if (isMounted.current) setIsSaving(true);
      
      const updatePayload = {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
      };

      // Adiciona a senha apenas se não estiver vazia
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      await updateUser(selectedUser.id, updatePayload, token);
      
      if (isMounted.current) {
        toast({
          title: "Usuário atualizado",
          description: `O usuário ${formData.email} foi atualizado com sucesso!`,
        });
      }
      
      setIsFormOpen(false);
      loadUsers(); // Recarrega a lista de usuários para mostrar as mudanças

    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      if (isMounted.current) {
        toast({
          title: "Erro ao atualizar usuário",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  };


  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return '⚡ Admin';
      case 'user':
        return '👤 Usuário';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
          <p className="text-gray-400">Visualize e administre usuários registrados</p>
        </div>
        
        <Button 
          onClick={loadUsers}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Carregando...
            </div>
          ) : (
            '🔄 Atualizar'
          )}
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <p className="text-gray-400 text-xs">Usuários registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {users.filter(user => user.role === 'admin').length}
            </div>
            <p className="text-gray-400 text-xs">Usuários admin</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {users.filter(user => user.is_active).length}
            </div>
            <p className="text-gray-400 text-xs">Contas ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Usuários */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Usuários Registrados</CardTitle>
          <CardDescription className="text-gray-400">
            {users.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Carregando usuários...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                <p className="text-red-400">{error}</p>
              </div>
              <Button onClick={loadUsers} variant="outline" className="border-gray-700 text-gray-300">
                Tentar novamente
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum usuário encontrado</p>
              <p className="text-gray-500 text-sm">Os usuários registrados aparecerão aqui</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Usuário</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Registrado em</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead> {/* Adicionada coluna Ações */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{user.full_name}</p>
                          <p className="text-gray-400 text-sm">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? '✅ Ativo' : '❌ Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell> {/* Coluna de Ações */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(user)}
                        className="border-gray-700 text-gray-300 hover:bg-purple-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição de Usuário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">
              Edite as informações do usuário selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="edit-full-name" className="text-white">Nome Completo</Label>
              <Input
                id="edit-full-name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-white">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-white">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status Ativo */}
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="edit-is-active" className="text-white">Ativo</Label>
              <Switch
                id="edit-is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
            {/* Senha (Opcional) */}
            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-white">Nova Senha (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Deixe em branco para não alterar"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-gray-400 text-xs">Mínimo 8 caracteres, maiúscula, minúscula e número.</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)} className="border-gray-700 text-gray-300">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManager;
