// Domain message dictionary for auth (pt-BR)
import type { AuthDictionary } from '../../types';

const messages: AuthDictionary = {
  "login": {
    "title": "Acessar Workspace",
    "subtitle": "Entre com suas credenciais para continuar.",
    "emailLabel": "E-mail",
    "passwordLabel": "Senha",
    "submit": "Entrar",
    "noAccount": "Ainda não tem conta?",
    "signupLink": "Criar conta gratuita",
    "forgotPassword": "Esqueceu sua senha?"
  },
  "signup": {
    "title": "Criar Conta Gratuita",
    "subtitle": "Cadastre-se para acessar o Vertex OS.",
    "nameLabel": "Seu nome",
    "emailLabel": "E-mail profissional",
    "passwordLabel": "Senha (mínimo 12 caracteres)",
    "termsAgreement": "Concordo com os Termos e a Política de Privacidade",
    "submit": "Cadastrar",
    "hasAccount": "Já possui uma conta?",
    "loginLink": "Fazer login"
  },
  "recovery": {
    "title": "Recuperar Senha",
    "subtitle": "Enviaremos um link de acesso seguro ao seu e-mail.",
    "emailLabel": "E-mail cadastrado",
    "submit": "Enviar Link de Recuperação",
    "backToLogin": "Voltar ao login"
  },
  "reset": {
    "title": "Redefinir Senha",
    "subtitle": "Digite sua nova senha para continuar.",
    "newPasswordLabel": "Nova senha",
    "submit": "Atualizar Senha"
  }
};

export default messages;
