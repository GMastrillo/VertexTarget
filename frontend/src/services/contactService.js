/**
 * Contact Service - Serviços para gerenciamento de contatos
 * Responsável por enviar formulários de contato para o backend
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Envia uma mensagem de contato
 * @param {Object} contactData - Dados do formulário de contato
 * @param {string} contactData.client_name - Nome do cliente
 * @param {string} contactData.email - Email do cliente
 * @param {string} contactData.message - Mensagem do cliente
 * @param {string} contactData.budget - Orçamento (opcional)
 * @param {string} contactData.timeline - Prazo (opcional)
 * @param {string} contactData.phone - Telefone (opcional)
 * @returns {Promise<Object>} Resposta do servidor
 */
export const sendContactMessage = async (contactData) => {
  try {
    console.log('Enviando mensagem de contato...');
    
    // Validar dados obrigatórios
    if (!contactData.client_name || !contactData.email || !contactData.message) {
      throw new Error('Nome, email e mensagem são obrigatórios.');
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      throw new Error('Por favor, insira um email válido.');
    }

    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: contactData.client_name.trim(),
        email: contactData.email.trim(),
        message: contactData.message.trim(),
        budget: contactData.budget?.trim() || '',
        timeline: contactData.timeline?.trim() || '',
        phone: contactData.phone?.trim() || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Tratar diferentes tipos de erro
      switch (response.status) {
        case 400:
          throw new Error('Dados inválidos. Verifique as informações e tente novamente.');
        case 422:
          // Erro de validação Pydantic
          if (errorData?.detail && Array.isArray(errorData.detail)) {
            const errors = errorData.detail.map(err => err.msg).join(', ');
            throw new Error(`Erro de validação: ${errors}`);
          }
          throw new Error('Dados inválidos. Verifique as informações e tente novamente.');
        case 500:
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        case 429:
          throw new Error('Muitas mensagens enviadas. Aguarde alguns minutos antes de tentar novamente.');
        default:
          throw new Error(errorData?.detail || `Erro ao enviar mensagem: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Mensagem de contato enviada com sucesso');
    
    return {
      success: true,
      message: 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.',
      data: data
    };

  } catch (error) {
    console.error('Erro no contactService.sendContactMessage:', error);
    
    // Se for um erro de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Problema de conexão detectado. Verifique sua internet e tente novamente.');
    }
    
    // Propagar o erro com a mensagem apropriada
    throw error;
  }
};

/**
 * Valida dados de contato antes do envio
 * @param {Object} contactData - Dados do formulário
 * @returns {Object} Resultado da validação
 */
export const validateContactData = (contactData) => {
  const errors = [];

  // Validar nome
  if (!contactData.client_name || contactData.client_name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres.');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!contactData.email || !emailRegex.test(contactData.email)) {
    errors.push('Por favor, insira um email válido.');
  }

  // Validar mensagem
  if (!contactData.message || contactData.message.trim().length < 10) {
    errors.push('Mensagem deve ter pelo menos 10 caracteres.');
  }

  // Validar telefone (se fornecido)
  if (contactData.phone && contactData.phone.trim()) {
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(contactData.phone) || contactData.phone.length < 8) {
      errors.push('Telefone deve ter um formato válido.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Verifica se o serviço de contato está disponível
 * @returns {Promise<boolean>} Status de disponibilidade
 */
export const checkContactServiceStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Erro ao verificar status do serviço de contato:', error);
    return false;
  }
};

export default {
  sendContactMessage,
  validateContactData,
  checkContactServiceStatus
};