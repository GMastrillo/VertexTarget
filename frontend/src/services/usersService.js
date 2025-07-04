/**
 * Users Service - Serviços para gerenciamento de usuários (Admin)
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Função auxiliar para normalizar URLs (copiada de AuthContext.jsx)
const normalizeUrl = (baseUrl, path) => {
  const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${trimmedBase}/${trimmedPath}`;
};

/**
 * Busca todos os usuários (apenas para admin)
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Array>} Lista de usuários
 */
export const getAllUsers = async (token) => {
  try {
    console.log('Buscando usuários...');
    
    const url = normalizeUrl(API_BASE_URL, '/api/admin/users'); // Usando normalizeUrl
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 403:
          throw new Error('Acesso negado. Apenas administradores podem ver usuários.');
        case 401:
          throw new Error('Token inválido. Faça login novamente.');
        case 404:
          throw new Error('Nenhum usuário encontrado.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao buscar usuários: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ ${data.length} usuários carregados com sucesso`);
    
    return data;

  } catch (error) {
    console.error('Erro no usersService.getAllUsers:', error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Registra um novo usuário
 * @param {Object} userData - Dados do usuário
 * @returns {Promise<Object>} Usuário criado e token
 */
export const registerUser = async (userData) => {
  try {
    console.log('Registrando novo usuário...');
    
    const url = normalizeUrl(API_BASE_URL, '/api/auth/register'); // Usando normalizeUrl
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 400:
          throw new Error(errorData?.detail || 'Este email já está cadastrado');
        case 422:
          throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao registrar usuário: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Usuário registrado com sucesso');
    
    return data;

  } catch (error) {
    console.error('Erro no usersService.registerUser:', error);
    throw error;
  }
};

/**
 * Atualiza um usuário existente (apenas para admin)
 * @param {string} userId - ID do usuário a ser atualizado
 * @param {Object} userData - Dados do usuário a serem atualizados
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Usuário atualizado
 */
export const updateUser = async (userId, userData, token) => {
  try {
    console.log(`Atualizando usuário ${userId}...`);
    
    const url = normalizeUrl(API_BASE_URL, `/api/admin/users/${userId}`); // Usando normalizeUrl
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 403:
          throw new Error('Acesso negado. Apenas administradores podem atualizar usuários.');
        case 401:
          throw new Error('Token inválido. Faça login novamente.');
        case 404:
          throw new Error('Usuário não encontrado.');
        case 400: // Ex: email já em uso
          throw new Error(errorData?.detail || 'Dados inválidos para atualização.');
        case 422:
          throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao atualizar usuário: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Usuário ${data.email} atualizado com sucesso`);
    
    return data;

  } catch (error) {
    console.error('Erro no usersService.updateUser:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  registerUser,
  updateUser // Exportando a nova função
};
