/**
 * AI Service - Serviços para comunicação com API de IA
 * Responsável por fazer chamadas para o endpoint de geração de estratégias
 */

import { getDemoToken } from './authService';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Gera uma estratégia personalizada usando IA
 * @param {string} industry - Setor da empresa
 * @param {string} objective - Objetivo principal
 * @returns {Promise<Object>} Resposta com a estratégia gerada
 */
export const generateStrategy = async (industry, objective) => {
  try {
    // Validar parâmetros obrigatórios
    if (!industry || !objective) {
      throw new Error('Setor e objetivo são obrigatórios');
    }

    // Obter token de autenticação automaticamente
    const token = await getDemoToken();

    // Fazer a chamada para a API
    const response = await fetch(`${API_BASE_URL}/api/v1/ai/generate-strategy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        industry,
        objective
      })
    });

    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Tratar diferentes tipos de erro
      switch (response.status) {
        case 401:
          throw new Error('Sua sessão expirou. Recarregue a página e tente novamente.');
        case 403:
          throw new Error('Acesso restrito. Recarregue a página e tente novamente.');
        case 429:
          throw new Error('Nossa IA está recebendo muitas solicitações no momento! Por favor, aguarde um minuto antes de gerar uma nova estratégia.');
        case 503:
          throw new Error('Nosso serviço de IA está temporariamente indisponível. Tente novamente em alguns minutos.');
        default:
          throw new Error(errorData?.detail || `Erro na requisição: ${response.status}`);
      }
    }

    // Extrair e retornar os dados da resposta
    const data = await response.json();
    
    if (!data.strategy) {
      throw new Error('Resposta inválida da API - estratégia não encontrada');
    }

    return {
      success: true,
      strategy: data.strategy
    };

  } catch (error) {
    console.error('Erro no aiService.generateStrategy:', error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Verifica se o serviço de IA está disponível
 * @returns {Promise<boolean>} Status de disponibilidade
 */
export const checkAIServiceStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar status do serviço:', error);
    return false;
  }
};

export default {
  generateStrategy,
  checkAIServiceStatus
};