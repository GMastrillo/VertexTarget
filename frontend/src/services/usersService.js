/**
 * Atualiza o perfil do usuário logado.
 * @param {Object} userData - Dados do perfil a serem atualizados (full_name, email, password)
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Promise<Object>} Dados do usuário atualizado
 */
export const updateUserProfile = async (userData, token) => {
  try {
    console.log('Atualizando perfil do usuário logado...');
    
    // Usando normalizeUrl para garantir a construção correta da URL
    const url = normalizeUrl(API_BASE_URL, '/api/users/profile'); 
    console.log('DEBUG USERSERVICE: URL final construída:', url); // Log opcional

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
        case 401:
          throw new Error('Não autorizado. Faça login novamente.');
        case 400: // Ex: email já em uso
          throw new Error(errorData?.detail || 'Dados inválidos para atualização.');
        case 422:
          throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao atualizar perfil: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Perfil atualizado com sucesso para ${data.email}`);
    
    return data;

  } catch (error) {
    console.error('Erro no usersService.updateUserProfile:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  registerUser,
  updateUser,
  updateUserProfile
};
