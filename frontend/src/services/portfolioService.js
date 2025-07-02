/**
 * Portfolio Service - Serviços para gerenciamento de dados do portfólio
 * Responsável por buscar projetos do portfólio no backend
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Busca todos os projetos do portfólio
 * @returns {Promise<Array>} Lista de projetos do portfólio
 */
export const getPortfolioProjects = async () => {
  try {
    console.log('Buscando projetos do portfólio...');
    
    const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
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
          throw new Error('Nenhum projeto encontrado no portfólio.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao buscar portfólio: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ ${data.length} projetos do portfólio carregados com sucesso`);
    
    return data;

  } catch (error) {
    console.error('Erro no portfolioService.getPortfolioProjects:', error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Busca um projeto específico por ID
 * @param {string} projectId - ID do projeto
 * @returns {Promise<Object>} Dados do projeto
 */
export const getPortfolioProject = async (projectId) => {
  try {
    console.log(`Buscando projeto ${projectId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 404:
          throw new Error('Projeto não encontrado.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao buscar projeto: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Projeto ${projectId} carregado com sucesso`);
    
    return data;

  } catch (error) {
    console.error(`Erro no portfolioService.getPortfolioProject(${projectId}):`, error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Verifica se o serviço de portfólio está disponível
 * @returns {Promise<boolean>} Status de disponibilidade
 */
export const checkPortfolioServiceStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar status do serviço de portfólio:', error);
    return false;
  }
};

/**
 * Cria um novo projeto no portfólio
 * @param {Object} projectData - Dados do projeto
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Projeto criado
 */
export const createPortfolioProject = async (projectData, token) => {
  try {
    console.log('Criando novo projeto no portfólio...');
    
    const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
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
          throw new Error(errorData?.detail || `Erro ao criar projeto: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Projeto criado com sucesso');
    
    return data;

  } catch (error) {
    console.error('Erro no portfolioService.createPortfolioProject:', error);
    throw error;
  }
};

/**
 * Atualiza um projeto existente
 * @param {string} projectId - ID do projeto
 * @param {Object} projectData - Dados atualizados
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Projeto atualizado
 */
export const updatePortfolioProject = async (projectId, projectData, token) => {
  try {
    console.log(`Atualizando projeto ${projectId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      switch (response.status) {
        case 401:
          throw new Error('Não autorizado. Faça login novamente.');
        case 404:
          throw new Error('Projeto não encontrado.');
        case 422:
          throw new Error(`Dados inválidos: ${errorData?.detail || 'Verifique os campos'}`);
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao atualizar projeto: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Projeto ${projectId} atualizado com sucesso`);
    
    return data;

  } catch (error) {
    console.error(`Erro no portfolioService.updatePortfolioProject(${projectId}):`, error);
    throw error;
  }
};

/**
 * Deleta um projeto do portfólio
 * @param {string} projectId - ID do projeto
 * @param {string} token - Token JWT para autenticação
 * @returns {Promise<Object>} Confirmação da exclusão
 */
export const deletePortfolioProject = async (projectId, token) => {
  try {
    console.log(`Deletando projeto ${projectId}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/portfolio/${projectId}`, {
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
          throw new Error('Projeto não encontrado.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          throw new Error(errorData?.detail || `Erro ao deletar projeto: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`✅ Projeto ${projectId} deletado com sucesso`);
    
    return data;

  } catch (error) {
    console.error(`Erro no portfolioService.deletePortfolioProject(${projectId}):`, error);
    throw error;
  }
};

export default {
  getPortfolioProjects,
  getPortfolioProject,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  checkPortfolioServiceStatus
};