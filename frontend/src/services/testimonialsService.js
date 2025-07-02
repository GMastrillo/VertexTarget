/**
 * Testimonials Service - Serviços para gerenciamento de depoimentos
 * Responsável por buscar depoimentos de clientes no backend
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Busca todos os depoimentos de clientes
 * @returns {Promise<Array>} Lista de depoimentos
 */
export const getTestimonials = async () => {
  try {
    console.log('Buscando depoimentos de clientes...');
    
    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Tratar diferentes tipos de erro
      switch (response.status) {
        case 404:
          throw new Error('Nenhum depoimento encontrado.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao buscar depoimentos: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ ${data.length} depoimentos carregados com sucesso`);
    
    return data;

  } catch (error) {
    console.error('Erro no testimonialsService.getTestimonials:', error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Busca um depoimento específico por ID
 * @param {string} testimonialId - ID do depoimento
 * @returns {Promise<Object>} Dados do depoimento
 */
export const getTestimonial = async (testimonialId) => {
  try {
    console.log(`Buscando depoimento ${testimonialId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${testimonialId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 404:
          throw new Error('Depoimento não encontrado.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao buscar depoimento: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Depoimento ${testimonialId} carregado com sucesso`);
    
    return data;

  } catch (error) {
    console.error(`Erro no testimonialsService.getTestimonial(${testimonialId}):`, error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Verifica se o serviço de depoimentos está disponível
 * @returns {Promise<boolean>} Status de disponibilidade
 */
export const checkTestimonialsServiceStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar status do serviço de depoimentos:', error);
    return false;
  }
};

/**
 * Cria um novo depoimento
 * @param {Object} testimonialData - Dados do depoimento
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Depoimento criado
 */
export const createTestimonial = async (testimonialData, token) => {
  try {
    console.log('Criando novo depoimento...');
    
    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testimonialData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 401:
          throw new Error('Não autorizado. Faça login novamente.');
        case 422:
          throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos obrigatórios'}`);
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao criar depoimento: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Depoimento criado com sucesso');
    
    return data;

  } catch (error) {
    console.error('Erro no testimonialsService.createTestimonial:', error);
    throw error;
  }
};

/**
 * Atualiza um depoimento existente
 * @param {string} testimonialId - ID do depoimento
 * @param {Object} testimonialData - Dados atualizados
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Depoimento atualizado
 */
export const updateTestimonial = async (testimonialId, testimonialData, token) => {
  try {
    console.log(`Atualizando depoimento ${testimonialId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${testimonialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testimonialData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 401:
          throw new Error('Não autorizado. Faça login novamente.');
        case 404:
          throw new Error('Depoimento não encontrado.');
        case 422:
          throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos'}`);
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao atualizar depoimento: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Depoimento ${testimonialId} atualizado com sucesso`);
    
    return data;

  } catch (error) {
    console.error(`Erro no testimonialsService.updateTestimonial(${testimonialId}):`, error);
    throw error;
  }
};

/**
 * Deleta um depoimento
 * @param {string} testimonialId - ID do depoimento
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Confirmação da exclusão
 */
export const deleteTestimonial = async (testimonialId, token) => {
  try {
    console.log(`Deletando depoimento ${testimonialId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${testimonialId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 401:
          throw new Error('Não autorizado. Faça login novamente.');
        case 404:
          throw new Error('Depoimento não encontrado.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao deletar depoimento: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Depoimento ${testimonialId} deletado com sucesso`);
    
    return data;

  } catch (error) {
    console.error(`Erro no testimonialsService.deleteTestimonial(${testimonialId}):`, error);
    throw error;
  }
};

export default {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  checkTestimonialsServiceStatus
};