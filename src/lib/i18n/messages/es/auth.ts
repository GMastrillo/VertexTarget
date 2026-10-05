// Domain message dictionary for auth (es)
import type { AuthDictionary } from '../../types';

const messages: AuthDictionary = {
  "login": {
    "title": "Acceder al Workspace",
    "subtitle": "Ingrese sus credenciales para continuar.",
    "emailLabel": "Correo electrónico",
    "passwordLabel": "Contraseña",
    "submit": "Iniciar Sesión",
    "noAccount": "¿No tiene cuenta?",
    "signupLink": "Crear cuenta gratis",
    "forgotPassword": "¿Olvidó su contraseña?"
  },
  "signup": {
    "title": "Crear Cuenta Gratis",
    "subtitle": "Regístrese para acceder a Vertex OS.",
    "nameLabel": "Su nombre",
    "emailLabel": "Correo profesional",
    "passwordLabel": "Contraseña (mínimo 12 caracteres)",
    "termsAgreement": "Acepto los Términos y la Política de Privacidad",
    "submit": "Registrarse",
    "hasAccount": "¿Ya tiene una cuenta?",
    "loginLink": "Iniciar sesión"
  },
  "recovery": {
    "title": "Recuperar Contraseña",
    "subtitle": "Le enviaremos un enlace seguro a su correo.",
    "emailLabel": "Correo registrado",
    "submit": "Enviar Enlace de Recuperación",
    "backToLogin": "Volver a iniciar sesión"
  },
  "reset": {
    "title": "Restablecer Contraseña",
    "subtitle": "Ingrese su nueva contraseña para continuar.",
    "newPasswordLabel": "Nueva contraseña",
    "submit": "Actualizar Contraseña"
  }
};

export default messages;
