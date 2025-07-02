/**
 * Auth Service - Gerenciamento de autenticação JWT
 * Para uso na demonstração de IA
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Credenciais de demonstração (em produção, isso seria feito de forma diferente)
const DEMO_CREDENTIALS = {
  email: "admin@vertextarget.com",
  password: "VT@admin2025!"
};

/**
 * Faz login e retorna o token JWT
 * @returns {Promise<string>} Token JWT
 */
export const getDemoToken = async () => {
  try {
    console.log('getDemoToken called, API_BASE_URL:', API_BASE_URL);
    
    // Verificar se já temos um token válido no localStorage
    const storedToken = localStorage.getItem('demo_token');
    const tokenExpiry = localStorage.getItem('demo_token_expiry');
    
    console.log('Checking stored token:', { storedToken: storedToken ? 'exists' : 'missing', tokenExpiry });
    
    if (storedToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
      console.log('Using stored valid token');
      return storedToken;
    }

    console.log('Making login request to:', `${API_BASE_URL}/api/auth/login`);
    
    // Fazer login para obter novo token
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(DEMO_CREDENTIALS)
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      throw new Error(`Erro de autenticação: ${response.status}`);
    }

    const data = await response.json();
    console.log('Login response data:', data);
    
    if (!data.access_token) {
      throw new Error('Token não encontrado na resposta');
    }

    // Armazenar token e expiração (23 horas para segurança)
    const expiryTime = new Date().getTime() + (23 * 60 * 60 * 1000);
    localStorage.setItem('demo_token', data.access_token);
    localStorage.setItem('demo_token_expiry', expiryTime.toString());

    console.log('Token stored successfully');
    return data.access_token;

  } catch (error) {
    console.error('Erro ao obter token de demonstração:', error);
    throw new Error('Erro de autenticação interno');
  }
};

/**
 * Remove o token do localStorage
 */
export const clearDemoToken = () => {
  localStorage.removeItem('demo_token');
  localStorage.removeItem('demo_token_expiry');
};

/**
 * Verifica se há um token válido
 * @returns {boolean} Status da autenticação
 */
export const hasValidToken = () => {
  const storedToken = localStorage.getItem('demo_token');
  const tokenExpiry = localStorage.getItem('demo_token_expiry');
  
  return storedToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry);
};

export default {
  getDemoToken,
  clearDemoToken,
  hasValidToken
};