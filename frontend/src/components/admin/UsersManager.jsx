/**
 * Users Manager - Componente para gerenciamento de usuários (Admin)
 */

import React, { useState, useEffect, useRef } from 'react'; // Adicionado useRef
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllUsers } from '../../services/usersService';
import { useToast } from '../../hooks/use-toast';

const UsersManager = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const isMounted = useRef(true); // Flag para verificar se o componente está montado
  
  // Estados principais
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManager;
