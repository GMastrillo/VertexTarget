/**
 * Users Service - Serviços para gerenciamento de usuários (Admin e Usuário Comum)
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const normalizeUrl = (baseUrl, path) => {
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${trimmedBase}/${trimmedPath}`;
};

// ============================================================================
// NOTA: A palavra 'export' foi ADICIONADA DE VOLTA na frente de cada função.
// Isso cria as "exportações nomeadas" que o seu projeto precisa.
// ============================================================================

export const getAllUsers = async (token) => {
  try {
    const url = normalizeUrl(API_BASE_URL, '/api/admin/users');
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      switch (response.status) {
        case 403: throw new Error('Acesso negado. Apenas administradores podem ver usuários.');
        case 401: throw new Error('Token inválido. Faça login novamente.');
        case 404: throw new Error('Nenhum usuário encontrado.');
        case 500: throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default: throw new Error(errorData?.detail || `Erro ao buscar usuários: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const url = normalizeUrl(API_BASE_URL, '/api/auth/register');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      switch (response.status) {
        case 400: throw new Error(errorData?.detail || 'Este email já está cadastrado');
        case 422: throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500: throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default: throw new Error(errorData?.detail || `Erro ao registrar usuário: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData, token) => {
  try {
    const url = normalizeUrl(API_BASE_URL, `/api/admin/users/${userId}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      switch (response.status) {
        case 403: throw new Error('Acesso negado. Apenas administradores podem atualizar usuários.');
        case 401: throw new Error('Token inválido. Faça login novamente.');
        case 404: throw new Error('Usuário não encontrado.');
        case 400: throw new Error(errorData?.detail || 'Dados inválidos para atualização.');
        case 422: throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500: throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default: throw new Error(errorData?.detail || `Erro ao atualizar usuário: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData, token) => {
  try {
    const url = normalizeUrl(API_BASE_URL, '/api/users/profile');
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      switch (response.status) {
        case 401: throw new Error('Não autorizado. Faça login novamente.');
        case 400: throw new Error(errorData?.detail || 'Dados inválidos para atualização.');
        case 422: throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500: throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default: throw new Error(errorData?.detail || `Erro ao atualizar perfil: ${response.status}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Também mantemos a exportação padrão para garantir a compatibilidade.
export default {
  getAllUsers,
  registerUser,
  updateUser,
  updateUserProfile
};
