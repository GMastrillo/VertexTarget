import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src/lib/i18n/messages');

const translations = {
  common: {
    'pt-BR': {
      brand: 'VertexTarget',
      tagline: 'Engenharia de Presença Digital & Vertex OS',
      theme: { toggle: 'Alternar tema', light: 'Claro', dark: 'Escuro' },
      language: { select: 'Selecionar idioma', ptBR: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano' },
      actions: { back: 'Voltar', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Salvar', close: 'Fechar', loading: 'Carregando...', openMenu: 'Abrir menu', closeMenu: 'Fechar menu' },
      errors: { generic: 'Ocorreu um erro inesperado.', notFound: 'Página não encontrada.', network: 'Falha na conexão de rede.', unauthorized: 'Acesso não autorizado.', rateLimited: 'Limite de requisições atingido. Tente novamente mais tarde.' },
    },
    en: {
      brand: 'VertexTarget',
      tagline: 'Digital Presence Engineering & Vertex OS',
      theme: { toggle: 'Toggle theme', light: 'Light', dark: 'Dark' },
      language: { select: 'Select language', ptBR: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano' },
      actions: { back: 'Back', cancel: 'Cancel', confirm: 'Confirm', save: 'Save', close: 'Close', loading: 'Loading...', openMenu: 'Open menu', closeMenu: 'Close menu' },
      errors: { generic: 'An unexpected error occurred.', notFound: 'Page not found.', network: 'Network connection failure.', unauthorized: 'Unauthorized access.', rateLimited: 'Rate limit exceeded. Please try again later.' },
    },
    es: {
      brand: 'VertexTarget',
      tagline: 'Ingeniería de Presencia Digital & Vertex OS',
      theme: { toggle: 'Cambiar tema', light: 'Claro', dark: 'Oscuro' },
      language: { select: 'Seleccionar idioma', ptBR: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano' },
      actions: { back: 'Volver', cancel: 'Cancelar', confirm: 'Confirmar', save: 'Guardar', close: 'Cerrar', loading: 'Cargando...', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú' },
      errors: { generic: 'Ocurrió un error inesperado.', notFound: 'Página no encontrada.', network: 'Fallo de conexión de red.', unauthorized: 'Acceso no autorizado.', rateLimited: 'Límite de solicitudes alcanzado. Intente más tarde.' },
    },
    fr: {
      brand: 'VertexTarget',
      tagline: 'Ingénierie de Présence Numérique & Vertex OS',
      theme: { toggle: 'Changer de thème', light: 'Clair', dark: 'Sombre' },
      language: { select: 'Choisir la langue', ptBR: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano' },
      actions: { back: 'Retour', cancel: 'Annuler', confirm: 'Confirmer', save: 'Enregistrer', close: 'Fermer', loading: 'Chargement...', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu' },
      errors: { generic: 'Une erreur inattendue est survenue.', notFound: 'Page non trouvée.', network: 'Échec de connexion réseau.', unauthorized: 'Accès non autorisé.', rateLimited: 'Limite de requêtes atteinte. Réessayez plus tard.' },
    },
    de: {
      brand: 'VertexTarget',
      tagline: 'Digitale Präsenztechnik & Vertex OS',
      theme: { toggle: 'Design umschalten', light: 'Hell', dark: 'Dunkel' },
      language: { select: 'Sprache wählen', ptBR: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano' },
      actions: { back: 'Zurück', cancel: 'Abbrechen', confirm: 'Bestätigen', save: 'Speichern', close: 'Schließen', loading: 'Laden...', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen' },
      errors: { generic: 'Ein unerwarteter Fehler ist aufgetreten.', notFound: 'Seite nicht gefunden.', network: 'Netzwerkfehler.', unauthorized: 'Nicht autorisierter Zugriff.', rateLimited: 'Anfragelimit erreicht. Bitte später erneut versuchen.' },
    },
    it: {
      brand: 'VertexTarget',
      tagline: 'Ingegneria della Presenza Digitale & Vertex OS',
      theme: { toggle: 'Cambia tema', light: 'Chiaro', dark: 'Scuro' },
      language: { select: 'Seleziona lingua', ptBR: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano' },
      actions: { back: 'Indietro', cancel: 'Annulla', confirm: 'Conferma', save: 'Salva', close: 'Chiudi', loading: 'Caricamento...', openMenu: 'Apri menu', closeMenu: 'Chiudi menu' },
      errors: { generic: 'Si è verificato un errore imprevisto.', notFound: 'Pagina non trovata.', network: 'Errore di connessione alla rete.', unauthorized: 'Accesso non autorizzato.', rateLimited: 'Limite di richieste raggiunto. Riprova più tardi.' },
    },
  },

  marketing: {
    'pt-BR': {
      nav: { home: 'Início', platform: 'Plataforma', services: 'Serviços', cases: 'Cases', about: 'Sobre', aiLab: 'AI Lab', contact: 'Contato', login: 'Entrar', start: 'Começar Agora' },
      hero: { badge: 'Engenharia Digital & IA', title1: 'Construímos autoridade e', title2: 'gravidade digital.', subtitle: 'Soluções customizadas de alta performance e um ecossistema completo para acelerar seu negócio digital.', ctaPrimary: 'Iniciar Projeto', ctaSecondary: 'Conhecer Plataforma' },
      services: { badge: 'Soluções', title: 'Engenharia e Crescimento', subtitle: 'Da arquitetura de sistemas às estratégias avançadas de conversão.' },
      ecosystem: { badge: 'Ecossistema', title: 'Áreas de Atuação', subtitle: 'Estruturas completas para líderes e profissionais de mercado.' },
      faq: { badge: 'Dúvidas', title: 'Perguntas Frequentes', subtitle: 'Tudo o que você precisa saber sobre nosso modelo de atuação.' },
      contact: { badge: 'Contato', title: 'Vamos conversar?', subtitle: 'Preencha os dados abaixo e entraremos em contato.', submit: 'Enviar Mensagem', success: 'Mensagem enviada com sucesso!' },
      footer: { rights: 'Todos os direitos reservados.', privacy: 'Privacidade', terms: 'Termos' },
    },
    en: {
      nav: { home: 'Home', platform: 'Platform', services: 'Services', cases: 'Cases', about: 'About', aiLab: 'AI Lab', contact: 'Contact', login: 'Login', start: 'Get Started' },
      hero: { badge: 'Digital Engineering & AI', title1: 'We engineer authority and', title2: 'digital gravity.', subtitle: 'High-performance custom solutions and a complete ecosystem to accelerate your digital business.', ctaPrimary: 'Start Project', ctaSecondary: 'Explore Platform' },
      services: { badge: 'Solutions', title: 'Engineering & Growth', subtitle: 'From systems architecture to advanced conversion strategies.' },
      ecosystem: { badge: 'Ecosystem', title: 'Areas of Focus', subtitle: 'Comprehensive frameworks for market leaders and professionals.' },
      faq: { badge: 'FAQ', title: 'Frequently Asked Questions', subtitle: 'Everything you need to know about how we work.' },
      contact: { badge: 'Contact', title: 'Let us connect', subtitle: 'Fill in the details below and we will be in touch.', submit: 'Send Message', success: 'Message sent successfully!' },
      footer: { rights: 'All rights reserved.', privacy: 'Privacy', terms: 'Terms' },
    },
    es: {
      nav: { home: 'Inicio', platform: 'Plataforma', services: 'Servicios', cases: 'Casos', about: 'Nosotros', aiLab: 'AI Lab', contact: 'Contacto', login: 'Acceso', start: 'Empezar' },
      hero: { badge: 'Ingeniería Digital & IA', title1: 'Construimos autoridad y', title2: 'gravedad digital.', subtitle: 'Soluciones personalizadas de alto rendimiento y un ecosistema integral para potenciar su negocio digital.', ctaPrimary: 'Iniciar Proyecto', ctaSecondary: 'Conocer Plataforma' },
      services: { badge: 'Soluciones', title: 'Ingeniería y Crecimiento', subtitle: 'Desde la arquitectura técnica hasta estrategias avanzadas de conversión.' },
      ecosystem: { badge: 'Ecosistema', title: 'Áreas de Especialización', subtitle: 'Estructuras completas para líderes y profesionales de la industria.' },
      faq: { badge: 'Preguntas', title: 'Preguntas Frecuentes', subtitle: 'Todo lo que necesita saber sobre nuestro enfoque.' },
      contact: { badge: 'Contacto', title: '¿Conversamos?', subtitle: 'Complete el formulario y nos comunicaremos en breve.', submit: 'Enviar Mensaje', success: '¡Mensaje enviado con éxito!' },
      footer: { rights: 'Todos los derechos reservados.', privacy: 'Privacidad', terms: 'Términos' },
    },
    fr: {
      nav: { home: 'Accueil', platform: 'Plateforme', services: 'Services', cases: 'Projets', about: 'À Propos', aiLab: 'AI Lab', contact: 'Contact', login: 'Connexion', start: 'Commencer' },
      hero: { badge: 'Ingénierie Numérique & IA', title1: 'Nous créons autorité et', title2: 'gravité numérique.', subtitle: 'Solutions sur-mesure haute performance et un écosystème complet pour dynamiser votre entreprise numérique.', ctaPrimary: 'Démarrer le Projet', ctaSecondary: 'Découvrir la Plateforme' },
      services: { badge: 'Solutions', title: 'Ingénierie & Croissance', subtitle: 'De l’architecture technique aux stratégies de conversion avancées.' },
      ecosystem: { badge: 'Écosystème', title: 'Domaines d’Intervention', subtitle: 'Cadres complets pour dirigeants et spécialistes du marché.' },
      faq: { badge: 'Questions', title: 'Foire Aux Questions', subtitle: 'Tout ce que vous devez savoir sur nos méthodes de travail.' },
      contact: { badge: 'Contact', title: 'Parlons ensemble', subtitle: 'Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement.', submit: 'Envoyer le Message', success: 'Message envoyé avec succès !' },
      footer: { rights: 'Tous droits réservés.', privacy: 'Confidentialité', terms: 'Conditions' },
    },
    de: {
      nav: { home: 'Start', platform: 'Plattform', services: 'Leistungen', cases: 'Referenzen', about: 'Über uns', aiLab: 'AI Lab', contact: 'Kontakt', login: 'Anmelden', start: 'Jetzt Starten' },
      hero: { badge: 'Digitale Ingenieurskunst & KI', title1: 'Wir schaffen Autorität und', title2: 'digitale Gravitation.', subtitle: 'Leistungsstarke maßgeschneiderte Lösungen und ein vollständiges Ökosystem für Ihr digitales Wachstum.', ctaPrimary: 'Projekt starten', ctaSecondary: 'Plattform erkunden' },
      services: { badge: 'Lösungen', title: 'Ingenieurwesen & Wachstum', subtitle: 'Von solider Systemarchitektur bis zu optimierten Konversionspfaden.' },
      ecosystem: { badge: 'Ökosystem', title: 'Kompetenzbereiche', subtitle: 'Umfassende Strukturen für Branchenführer und Fachleute.' },
      faq: { badge: 'Fragen', title: 'Häufig gestellte Fragen', subtitle: 'Wissenswertes über unsere Zusammenarbeit und Methoden.' },
      contact: { badge: 'Kontakt', title: 'Lassen Sie uns sprechen', subtitle: 'Füllen Sie das Formular aus, wir melden uns umgehend.', submit: 'Nachricht senden', success: 'Nachricht erfolgreich gesendet!' },
      footer: { rights: 'Alle Rechte vorbehalten.', privacy: 'Datenschutz', terms: 'AGB' },
    },
    it: {
      nav: { home: 'Home', platform: 'Piattaforma', services: 'Servizi', cases: 'Casi Studio', about: 'Chi Siamo', aiLab: 'AI Lab', contact: 'Contatti', login: 'Accedi', start: 'Inizia Ora' },
      hero: { badge: 'Ingegneria Digitale & IA', title1: 'Costruiamo autorevolezza e', title2: 'gravità digitale.', subtitle: 'Soluzioni personalizzate ad alte prestazioni e un ecosistema completo per far crescere il tuo business.', ctaPrimary: 'Avvia Progetto', ctaSecondary: 'Scopri la Piattaforma' },
      services: { badge: 'Soluzioni', title: 'Ingegneria & Crescita', subtitle: 'Dall’architettura software alle strategie di conversione evolute.' },
      ecosystem: { badge: 'Ecosistema', title: 'Aree di Focus', subtitle: 'Strutture complete per leader e professionisti di settore.' },
      faq: { badge: 'FAQ', title: 'Domande Frequenti', subtitle: 'Tutto ciò che c’è da sapere sulle nostre metodologie.' },
      contact: { badge: 'Contatto', title: 'Mettiti in contatto', subtitle: 'Compila il modulo qui sotto e ti risponderemo al più presto.', submit: 'Invia Messaggio', success: 'Messaggio inviato con successo!' },
      footer: { rights: 'Tutti i diritti riservati.', privacy: 'Privacy', terms: 'Termini' },
    },
  },

  platform: {
    'pt-BR': {
      nav: { overview: 'Visão Geral', templates: 'Modelos', pricing: 'Preços', faq: 'Dúvidas', startFree: 'Criar Conta Gratuita', enter: 'Entrar' },
      hero: { badge: 'Vertex OS', title: 'O Sistema Operacional para Landing Pages de Alto Padrão', subtitle: 'Crie, customize, publique e prospecte clientes com templates validados e apoio de inteligência artificial.', cta: 'Criar Conta Gratuita', secondaryCta: 'Ver Demonstração' },
      features: { title: 'Recursos Essenciais', subtitle: 'Tudo o que você precisa para gerenciar páginas e prospecção com agilidade.' },
      pricing: { badge: 'Planos Transparentes', title: 'Acesso Livre e Sob Demanda', subtitle: 'O Vertex OS é gratuito com quotas mensais; serviços personalizados são orçados conforme sua necessidade.', freeTitle: 'Vertex OS Gratuito', freePrice: 'R$ 0', freeDesc: 'Acesso completo com limites mensais de IA e 1 site publicado simultaneamente.', freeCta: 'Criar Conta Grátis', customTitle: 'Soluções Customizadas', customPrice: 'Sob Orçamento', customDesc: 'Projetos sob medida desenvolvidos pelo time de engenharia da VertexTarget.', customCta: 'Solicitar Proposta' },
      faq: { title: 'Dúvidas sobre a Plataforma' },
    },
    en: {
      nav: { overview: 'Overview', templates: 'Templates', pricing: 'Pricing', faq: 'FAQ', startFree: 'Create Free Account', enter: 'Log In' },
      hero: { badge: 'Vertex OS', title: 'The Operating System for High-Converting Landing Pages', subtitle: 'Design, customize, publish, and prospect clients with validated templates and AI assistance.', cta: 'Create Free Account', secondaryCta: 'Watch Demo' },
      features: { title: 'Core Features', subtitle: 'Everything you need to manage pages and client prospecting smoothly.' },
      pricing: { badge: 'Transparent Pricing', title: 'Free Access & On-Demand Services', subtitle: 'Vertex OS is free with monthly quotas; custom engineering projects are quoted upon request.', freeTitle: 'Vertex OS Free', freePrice: '$0', freeDesc: 'Full access with monthly AI quotas and 1 live published website at a time.', freeCta: 'Sign Up Free', customTitle: 'Custom Solutions', customPrice: 'Custom Quote', customDesc: 'Tailor-made digital engineering crafted by the VertexTarget team.', customCta: 'Request Proposal' },
      faq: { title: 'Platform FAQ' },
    },
    es: {
      nav: { overview: 'Visión General', templates: 'Plantillas', pricing: 'Precios', faq: 'FAQ', startFree: 'Crear Cuenta Gratis', enter: 'Iniciar Sesión' },
      hero: { badge: 'Vertex OS', title: 'El Sistema Operativo para Páginas de Alto Impacto', subtitle: 'Cree, personalice, publique y prospecte clientes con plantillas comprobadas y soporte de IA.', cta: 'Crear Cuenta Gratis', secondaryCta: 'Ver Demo' },
      features: { title: 'Funciones Clave', subtitle: 'Todo lo necesario para gestionar páginas y prospección con rapidez.' },
      pricing: { badge: 'Precios Claros', title: 'Acceso Gratuito y Servicios a Medida', subtitle: 'Vertex OS es gratuito con cuotas mensuales; los proyectos personalizados se cotizan según alcance.', freeTitle: 'Vertex OS Gratis', freePrice: '$0', freeDesc: 'Acceso total con cuotas mensuales de IA y 1 sitio publicado simultáneamente.', freeCta: 'Crear Cuenta Gratis', customTitle: 'Soluciones a Medida', customPrice: 'Bajo Cotización', customDesc: 'Ingeniería digital personalizada desarrollada por el equipo de VertexTarget.', customCta: 'Pedir Propuesta' },
      faq: { title: 'Preguntas sobre la Plataforma' },
    },
    fr: {
      nav: { overview: 'Aperçu', templates: 'Modèles', pricing: 'Tarifs', faq: 'FAQ', startFree: 'Créer un Compte Gratuit', enter: 'Connexion' },
      hero: { badge: 'Vertex OS', title: 'Le Système d’Exploitation pour vos Pages Web d’Excellence', subtitle: 'Créez, personnalisez, publiez et prospectez avec des gabarits éprouvés et l’assistance de l’IA.', cta: 'Créer un Compte Gratuit', secondaryCta: 'Voir la Démo' },
      features: { title: 'Fonctionnalités Clés', subtitle: 'Tout ce dont vous avez besoin pour concevoir et prospecter efficacement.' },
      pricing: { badge: 'Tarification Claire', title: 'Accès Gratuit & Projets sur Devis', subtitle: 'Vertex OS est gratuit avec quotas mensuels ; les développements personnalisés font l’objet d’un devis.', freeTitle: 'Vertex OS Gratuit', freePrice: '0 €', freeDesc: 'Accès complet avec quotas IA mensuels et 1 site publié en ligne en simultané.', freeCta: 'Créer un Compte Gratuit', customTitle: 'Solutions Sur Mesure', customPrice: 'Sur Devis', customDesc: 'Ingénierie web de précision réalisée par les ingénieurs VertexTarget.', customCta: 'Demander un Devis' },
      faq: { title: 'Questions sur la Plateforme' },
    },
    de: {
      nav: { overview: 'Übersicht', templates: 'Vorlagen', pricing: 'Preise', faq: 'FAQ', startFree: 'Kostenloses Konto', enter: 'Anmelden' },
      hero: { badge: 'Vertex OS', title: 'Das Betriebssystem für hochkonvertierende Landingpages', subtitle: 'Erstellen, anpassen, veröffentlichen und Leads gewinnen mit validierten Vorlagen und KI-Unterstützung.', cta: 'Kostenloses Konto anlegen', secondaryCta: 'Demo ansehen' },
      features: { title: 'Hauptfunktionen', subtitle: 'Alles, was Sie für schnelles Seitenmanagement und Kundengewinnung benötigen.' },
      pricing: { badge: 'Transparente Preise', title: 'Kostenfreier Zugang & Individuelle Lösungen', subtitle: 'Vertex OS ist kostenlos mit monatlichen Kontingenten; individuelle Projekte werden nach Aufwand kalkuliert.', freeTitle: 'Vertex OS Kostenlos', freePrice: '0 €', freeDesc: 'Vollzugriff mit monatlichen KI-Kontingenten und 1 zeitgleich aktiven Website.', freeCta: 'Kostenlos registrieren', customTitle: 'Maßgeschneiderte Lösungen', customPrice: 'Auf Anfrage', customDesc: 'Individuelle digitale Ingenieursleistung durch das Team von VertexTarget.', customCta: 'Angebot anfordern' },
      faq: { title: 'Fragen zur Plattform' },
    },
    it: {
      nav: { overview: 'Panoramica', templates: 'Modelli', pricing: 'Prezzi', faq: 'FAQ', startFree: 'Crea Account Gratuito', enter: 'Accedi' },
      hero: { badge: 'Vertex OS', title: 'Il Sistema Operativo per Pagine Web ad Alta Conversione', subtitle: 'Crea, personalizza, pubblica e acquisisci clienti con template testati e supporto dell’IA.', cta: 'Crea Account Gratuito', secondaryCta: 'Guarda Demo' },
      features: { title: 'Funzionalità Principali', subtitle: 'Tutto ciò che serve per gestire pagine e pipeline di vendita senza attriti.' },
      pricing: { badge: 'Prezzi Trasparenti', title: 'Accesso Gratuito e Servizi Dedicati', subtitle: 'Vertex OS è gratuito con quote mensili; i progetti personalizzati sono preventivati su misura.', freeTitle: 'Vertex OS Gratuito', freePrice: '0 €', freeDesc: 'Accesso completo con quote IA mensili e 1 sito pubblicato simultaneamente.', freeCta: 'Registrati Gratis', customTitle: 'Soluzioni Custom', customPrice: 'Su Preventivo', customDesc: 'Ingegneria software su misura realizzata dal team di VertexTarget.', customCta: 'Richiedi Preventivo' },
      faq: { title: 'Domande sulla Piattaforma' },
    },
  },

  auth: {
    'pt-BR': {
      login: { title: 'Acessar Workspace', subtitle: 'Entre com suas credenciais para continuar.', emailLabel: 'E-mail', passwordLabel: 'Senha', submit: 'Entrar', noAccount: 'Ainda não tem conta?', signupLink: 'Criar conta gratuita', forgotPassword: 'Esqueceu sua senha?' },
      signup: { title: 'Criar Conta Gratuita', subtitle: 'Cadastre-se para acessar o Vertex OS.', nameLabel: 'Seu nome', emailLabel: 'E-mail profissional', passwordLabel: 'Senha (mínimo 12 caracteres)', termsAgreement: 'Concordo com os Termos e a Política de Privacidade', submit: 'Cadastrar', hasAccount: 'Já possui uma conta?', loginLink: 'Fazer login' },
      recovery: { title: 'Recuperar Senha', subtitle: 'Enviaremos um link de acesso seguro ao seu e-mail.', emailLabel: 'E-mail cadastrado', submit: 'Enviar Link de Recuperação', backToLogin: 'Voltar ao login' },
      reset: { title: 'Redefinir Senha', subtitle: 'Digite sua nova senha para continuar.', newPasswordLabel: 'Nova senha', submit: 'Atualizar Senha' },
    },
    en: {
      login: { title: 'Access Workspace', subtitle: 'Enter your credentials to continue.', emailLabel: 'Email', passwordLabel: 'Password', submit: 'Sign In', noAccount: 'Do not have an account?', signupLink: 'Create free account', forgotPassword: 'Forgot password?' },
      signup: { title: 'Create Free Account', subtitle: 'Sign up to get access to Vertex OS.', nameLabel: 'Your name', emailLabel: 'Work email', passwordLabel: 'Password (min. 12 characters)', termsAgreement: 'I agree to the Terms of Service and Privacy Policy', submit: 'Sign Up', hasAccount: 'Already have an account?', loginLink: 'Sign in' },
      recovery: { title: 'Recover Password', subtitle: 'We will send a secure reset link to your email.', emailLabel: 'Registered email', submit: 'Send Recovery Link', backToLogin: 'Back to sign in' },
      reset: { title: 'Reset Password', subtitle: 'Enter your new password to proceed.', newPasswordLabel: 'New password', submit: 'Update Password' },
    },
    es: {
      login: { title: 'Acceder al Workspace', subtitle: 'Ingrese sus credenciales para continuar.', emailLabel: 'Correo electrónico', passwordLabel: 'Contraseña', submit: 'Iniciar Sesión', noAccount: '¿No tiene cuenta?', signupLink: 'Crear cuenta gratis', forgotPassword: '¿Olvidó su contraseña?' },
      signup: { title: 'Crear Cuenta Gratis', subtitle: 'Regístrese para acceder a Vertex OS.', nameLabel: 'Su nombre', emailLabel: 'Correo profesional', passwordLabel: 'Contraseña (mínimo 12 caracteres)', termsAgreement: 'Acepto los Términos y la Política de Privacidad', submit: 'Registrarse', hasAccount: '¿Ya tiene una cuenta?', loginLink: 'Iniciar sesión' },
      recovery: { title: 'Recuperar Contraseña', subtitle: 'Le enviaremos un enlace seguro a su correo.', emailLabel: 'Correo registrado', submit: 'Enviar Enlace de Recuperación', backToLogin: 'Volver a iniciar sesión' },
      reset: { title: 'Restablecer Contraseña', subtitle: 'Ingrese su nueva contraseña para continuar.', newPasswordLabel: 'Nueva contraseña', submit: 'Actualizar Contraseña' },
    },
    fr: {
      login: { title: 'Accéder à l’Espace', subtitle: 'Entrez vos identifiants pour continuer.', emailLabel: 'Adresse e-mail', passwordLabel: 'Mot de passe', submit: 'Se Connecter', noAccount: 'Pas encore de compte ?', signupLink: 'Créer un compte gratuit', forgotPassword: 'Mot de passe oublié ?' },
      signup: { title: 'Créer un Compte Gratuit', subtitle: 'Inscrivez-vous pour accéder à Vertex OS.', nameLabel: 'Votre nom', emailLabel: 'E-mail professionnel', passwordLabel: 'Mot de passe (min. 12 caractères)', termsAgreement: 'J’accepte les Conditions et la Politique de Confidentialité', submit: 'S’inscrire', hasAccount: 'Déjà un compte ?', loginLink: 'Se connecter' },
      recovery: { title: 'Récupérer le Mot de Passe', subtitle: 'Nous vous enverrons un lien sécurisé par e-mail.', emailLabel: 'E-mail enregistré', submit: 'Envoyer le Lien', backToLogin: 'Retour à la connexion' },
      reset: { title: 'Réinitialiser le Mot de Passe', subtitle: 'Saisissez votre nouveau mot de passe.', newPasswordLabel: 'Nouveau mot de passe', submit: 'Mettre à Jour' },
    },
    de: {
      login: { title: 'Workspace aufrufen', subtitle: 'Geben Sie Ihre Zugangsdaten ein, um fortzufahren.', emailLabel: 'E-Mail-Adresse', passwordLabel: 'Passwort', submit: 'Anmelden', noAccount: 'Noch kein Konto?', signupLink: 'Kostenloses Konto anlegen', forgotPassword: 'Passwort vergessen?' },
      signup: { title: 'Kostenloses Konto erstellen', subtitle: 'Registrieren Sie sich für den Zugang zu Vertex OS.', nameLabel: 'Ihr Name', emailLabel: 'Geschäftliche E-Mail', passwordLabel: 'Passwort (mind. 12 Zeichen)', termsAgreement: 'Ich akzeptiere die AGB und die Datenschutzerklärung', submit: 'Registrieren', hasAccount: 'Bereits registriert?', loginLink: 'Anmelden' },
      recovery: { title: 'Passwort wiederherstellen', subtitle: 'Wir senden Ihnen einen sicheren Link per E-Mail.', emailLabel: 'Registrierte E-Mail', submit: 'Wiederherstellungslink senden', backToLogin: 'Zurück zur Anmeldung' },
      reset: { title: 'Passwort zurücksetzen', subtitle: 'Geben Sie Ihr neues Passwort ein.', newPasswordLabel: 'Neues Passwort', submit: 'Passwort aktualisieren' },
    },
    it: {
      login: { title: 'Accedi al Workspace', subtitle: 'Inserisci le tue credenziali per continuare.', emailLabel: 'Indirizzo e-mail', passwordLabel: 'Password', submit: 'Accedi', noAccount: 'Non hai un account?', signupLink: 'Crea account gratuito', forgotPassword: 'Password dimenticata?' },
      signup: { title: 'Crea Account Gratuito', subtitle: 'Registrati per accedere a Vertex OS.', nameLabel: 'Il tuo nome', emailLabel: 'E-mail professionale', passwordLabel: 'Password (minimo 12 caratteri)', termsAgreement: 'Accetto i Termini di Servizio e la Privacy Policy', submit: 'Registrati', hasAccount: 'Hai già un account?', loginLink: 'Accedi' },
      recovery: { title: 'Recupera Password', subtitle: 'Invieremo un link sicuro al tuo indirizzo e-mail.', emailLabel: 'E-mail registrata', submit: 'Invia Link di Recupero', backToLogin: 'Torna all’accesso' },
      reset: { title: 'Reimposta Password', subtitle: 'Inserisci la tua nuova password.', newPasswordLabel: 'Nuova password', submit: 'Aggiorna Password' },
    },
  },

  os: {
    'pt-BR': {
      shell: { dashboard: 'Painel', projects: 'Projetos', prospects: 'Prospecção', settings: 'Configurações', logout: 'Sair' },
      projects: { title: 'Seus Projetos', newProject: 'Novo Projeto', save: 'Salvar Alterações', publish: 'Publicar Página', unpublish: 'Despublicar', preview: 'Pré-visualização', savedStatus: 'Salvo com sucesso', savingStatus: 'Salvando...', conflictStatus: 'Conflito detectado' },
      prospects: { title: 'Pipeline de Prospecção', addProspect: 'Adicionar Lead', searchMarket: 'Buscar no Mercado', columns: { new: 'Novos', contacted: 'Contatados', proposal: 'Proposta', closed: 'Fechados', discarded: 'Descartados' } },
      usage: { title: 'Seu Uso Mensal', copyRemaining: 'Gerações de copy restantes', searchRemaining: 'Buscas no mercado restantes', renewNotice: 'Limites renovados no início de cada mês UTC.' },
    },
    en: {
      shell: { dashboard: 'Dashboard', projects: 'Projects', prospects: 'Prospects', settings: 'Settings', logout: 'Sign Out' },
      projects: { title: 'Your Projects', newProject: 'New Project', save: 'Save Changes', publish: 'Publish Page', unpublish: 'Unpublish', preview: 'Live Preview', savedStatus: 'Saved successfully', savingStatus: 'Saving...', conflictStatus: 'Conflict detected' },
      prospects: { title: 'Prospecting Pipeline', addProspect: 'Add Lead', searchMarket: 'Search Market', columns: { new: 'New', contacted: 'Contacted', proposal: 'Proposal', closed: 'Closed', discarded: 'Discarded' } },
      usage: { title: 'Monthly Usage', copyRemaining: 'Copy generations remaining', searchRemaining: 'Market searches remaining', renewNotice: 'Quotas renew at the beginning of each UTC month.' },
    },
    es: {
      shell: { dashboard: 'Panel', projects: 'Proyectos', prospects: 'Prospección', settings: 'Configuración', logout: 'Cerrar Sesión' },
      projects: { title: 'Sus Proyectos', newProject: 'Nuevo Proyecto', save: 'Guardar Cambios', publish: 'Publicar Página', unpublish: 'Despublicar', preview: 'Vista Previa', savedStatus: 'Guardado correctamente', savingStatus: 'Guardando...', conflictStatus: 'Conflicto detectado' },
      prospects: { title: 'Pipeline de Prospección', addProspect: 'Añadir Lead', searchMarket: 'Buscar en el Mercado', columns: { new: 'Nuevos', contacted: 'Contactados', proposal: 'Propuesta', closed: 'Cerrados', discarded: 'Descartados' } },
      usage: { title: 'Uso Mensual', copyRemaining: 'Generaciones de copy restantes', searchRemaining: 'Búsquedas de mercado restantes', renewNotice: 'Límites renovados al inicio de cada mes UTC.' },
    },
    fr: {
      shell: { dashboard: 'Tableau de bord', projects: 'Projets', prospects: 'Prospection', settings: 'Paramètres', logout: 'Déconnexion' },
      projects: { title: 'Vos Projets', newProject: 'Nouveau Projet', save: 'Enregistrer', publish: 'Publier la Page', unpublish: 'Dépublier', preview: 'Aperçu Direct', savedStatus: 'Enregistré avec succès', savingStatus: 'Enregistrement...', conflictStatus: 'Conflit détecté' },
      prospects: { title: 'Pipeline de Prospection', addProspect: 'Ajouter un Prospect', searchMarket: 'Explorer le Marché', columns: { new: 'Nouveaux', contacted: 'Contactés', proposal: 'Proposition', closed: 'Conclus', discarded: 'Écartés' } },
      usage: { title: 'Utilisation Mensuelle', copyRemaining: 'Générations de texte restantes', searchRemaining: 'Recherches marché restantes', renewNotice: 'Quotas réinitialisés au début de chaque mois UTC.' },
    },
    de: {
      shell: { dashboard: 'Dashboard', projects: 'Projekte', prospects: 'Akquise', settings: 'Einstellungen', logout: 'Abmelden' },
      projects: { title: 'Ihre Projekte', newProject: 'Neues Projekt', save: 'Speichern', publish: 'Seite veröffentlichen', unpublish: 'Zurückziehen', preview: 'Live-Vorschau', savedStatus: 'Erfolgreich gespeichert', savingStatus: 'Wird gespeichert...', conflictStatus: 'Konflikt erkannt' },
      prospects: { title: 'Akquise-Pipeline', addProspect: 'Lead hinzufügen', searchMarket: 'Markt durchsuchen', columns: { new: 'Neu', contacted: 'Kontaktiert', proposal: 'Angebot', closed: 'Gewonnen', discarded: 'Verworfen' } },
      usage: { title: 'Monatliche Nutzung', copyRemaining: 'Verbleibende Texterstellungen', searchRemaining: 'Verbleibende Marktsuchen', renewNotice: 'Limits erneuern sich zu Beginn jedes UTC-Monats.' },
    },
    it: {
      shell: { dashboard: 'Dashboard', projects: 'Progetti', prospects: 'Prospecting', settings: 'Impostazioni', logout: 'Esci' },
      projects: { title: 'I Tuoi Progetti', newProject: 'Nuovo Progetto', save: 'Salva Modifiche', publish: 'Pubblica Pagina', unpublish: 'Rimuovi Pubblicazione', preview: 'Anteprima Live', savedStatus: 'Salvato con successo', savingStatus: 'Salvataggio...', conflictStatus: 'Rilevato conflitto' },
      prospects: { title: 'Pipeline di Vendita', addProspect: 'Aggiungi Contatto', searchMarket: 'Esplora Mercato', columns: { new: 'Nuovi', contacted: 'Contattati', proposal: 'Proposta', closed: 'Chiusi', discarded: 'Scartati' } },
      usage: { title: 'Utilizzo Mensile', copyRemaining: 'Generazioni di testo rimanenti', searchRemaining: 'Ricerche di mercato rimanenti', renewNotice: 'Le quote si rinnovano all’inizio di ogni mese UTC.' },
    },
  },

  admin: {
    'pt-BR': {
      shell: { overview: 'Visão Geral', commercial: 'Comercial', crm: 'CRM', interests: 'Interesses', prospecting: 'Prospecção', performance: 'Performance', financial: 'Financeiro', inbox: 'Mensagens', whatsapp: 'WhatsApp', settings: 'Configurações' },
      interests: { title: 'Interesses Registrados', empty: 'Nenhum registro encontrado.', statusNew: 'Novo' },
    },
    en: {
      shell: { overview: 'Overview', commercial: 'Commercial', crm: 'CRM', interests: 'Interests', prospecting: 'Prospecting', performance: 'Performance', financial: 'Financial', inbox: 'Inbox', whatsapp: 'WhatsApp', settings: 'Settings' },
      interests: { title: 'Registered Leads', empty: 'No records found.', statusNew: 'New' },
    },
    es: {
      shell: { overview: 'Visión General', commercial: 'Comercial', crm: 'CRM', interests: 'Intereses', prospecting: 'Prospección', performance: 'Rendimiento', financial: 'Finanzas', inbox: 'Bandeja', whatsapp: 'WhatsApp', settings: 'Configuración' },
      interests: { title: 'Intereses Registrados', empty: 'No se encontraron registros.', statusNew: 'Nuevo' },
    },
    fr: {
      shell: { overview: 'Vue Globale', commercial: 'Commercial', crm: 'CRM', interests: 'Intérêts', prospecting: 'Prospection', performance: 'Performance', financial: 'Finances', inbox: 'Messages', whatsapp: 'WhatsApp', settings: 'Paramètres' },
      interests: { title: 'Leads Enregistrés', empty: 'Aucun enregistrement trouvé.', statusNew: 'Nouveau' },
    },
    de: {
      shell: { overview: 'Übersicht', commercial: 'Vertrieb', crm: 'CRM', interests: 'Interessenten', prospecting: 'Akquise', performance: 'Leistung', financial: 'Finanzen', inbox: 'Posteingang', whatsapp: 'WhatsApp', settings: 'Einstellungen' },
      interests: { title: 'Eingegangene Anfragen', empty: 'Keine Einträge gefunden.', statusNew: 'Neu' },
    },
    it: {
      shell: { overview: 'Panoramica', commercial: 'Commerciale', crm: 'CRM', interests: 'Interessi', prospecting: 'Prospecting', performance: 'Prestazioni', financial: 'Finanze', inbox: 'Messaggi', whatsapp: 'WhatsApp', settings: 'Impostazioni' },
      interests: { title: 'Interessi Registrati', empty: 'Nessun record trovato.', statusNew: 'Nuovo' },
    },
  },

  legal: {
    'pt-BR': {
      privacy: { title: 'Política de Privacidade', updatedAt: 'Atualizado em Outubro de 2026', intro: 'Esta política descreve como o VertexTarget e o Vertex OS coletam, tratam e protegem suas informações pessoais em conformidade com a LGPD.' },
      terms: { title: 'Termos de Serviço', updatedAt: 'Atualizado em Outubro de 2026', intro: 'Estes termos regulam a utilização da plataforma Vertex OS e dos serviços digitais da VertexTarget.' },
    },
    en: {
      privacy: { title: 'Privacy Policy', updatedAt: 'Updated October 2026', intro: 'This policy describes how VertexTarget and Vertex OS collect, process, and protect your personal information in compliance with relevant data privacy laws.' },
      terms: { title: 'Terms of Service', updatedAt: 'Updated October 2026', intro: 'These terms govern the use of the Vertex OS platform and digital services provided by VertexTarget.' },
    },
    es: {
      privacy: { title: 'Política de Privacidad', updatedAt: 'Actualizado en Octubre de 2026', intro: 'Esta política describe cómo VertexTarget y Vertex OS recopilan, tratan y protegen su información personal.' },
      terms: { title: 'Términos de Servicio', updatedAt: 'Actualizado en Octubre de 2026', intro: 'Estos términos regulan el uso de la plataforma Vertex OS y los servicios digitales de VertexTarget.' },
    },
    fr: {
      privacy: { title: 'Politique de Confidentialité', updatedAt: 'Mis à jour en Octobre 2026', intro: 'Cette politique décrit la manière dont VertexTarget et Vertex OS collectent, traitent et protègent vos données personnelles.' },
      terms: { title: 'Conditions d’Utilisation', updatedAt: 'Mis à jour en Octobre 2026', intro: 'Ces conditions régissent l’utilisation de la plateforme Vertex OS et des prestations numériques VertexTarget.' },
    },
    de: {
      privacy: { title: 'Datenschutzerklärung', updatedAt: 'Stand: Oktober 2026', intro: 'Diese Erklärung beschreibt, wie VertexTarget und Vertex OS personenbezogene Daten gemäß den geltenden Datenschutzbestimmungen erheben, verarbeiten und schützen.' },
      terms: { title: 'Allgemeine Geschäftsbedingungen', updatedAt: 'Stand: Oktober 2026', intro: 'Diese Bedingungen regeln die Nutzung der Plattform Vertex OS und der Dienstleistungen von VertexTarget.' },
    },
    it: {
      privacy: { title: 'Informativa sulla Privacy', updatedAt: 'Aggiornato a Ottobre 2026', intro: 'Questa informativa descrive le modalità con cui VertexTarget e Vertex OS raccolgono, trattano e proteggono i dati personali degli utenti.' },
      terms: { title: 'Termini di Servizio', updatedAt: 'Aggiornato a Ottobre 2026', intro: 'I presenti termini regolano l’uso della piattaforma Vertex OS e dei servizi forniti da VertexTarget.' },
    },
  },

  cases: {
    'pt-BR': {
      badge: 'Portfólio de Engenharia',
      title: 'Projetos que Definem Padrões',
      subtitle: 'Conheça em detalhes a arquitetura técnica, os desafios superados e os resultados alcançados em cada entrega.',
      filterAllCategories: 'Todas as categorias',
      filterAllTech: 'Todas as tecnologias',
      filterAllYears: 'Todos os anos',
      viewStudy: 'Ver Estudo de Caso',
      backToCases: 'Voltar aos Cases',
    },
    en: {
      badge: 'Engineering Portfolio',
      title: 'Projects that Set Industry Standards',
      subtitle: 'Explore the technical architecture, key challenges solved, and tangible business outcomes delivered.',
      filterAllCategories: 'All categories',
      filterAllTech: 'All technologies',
      filterAllYears: 'All years',
      viewStudy: 'View Case Study',
      backToCases: 'Back to Cases',
    },
    es: {
      badge: 'Portafolio de Ingeniería',
      title: 'Proyectos que Marcan Tendencia',
      subtitle: 'Conozca en detalle la arquitectura técnica, los desafíos resueltos y los resultados tangibles alcanzados.',
      filterAllCategories: 'Todas las categorías',
      filterAllTech: 'Todas las tecnologías',
      filterAllYears: 'Todos los años',
      viewStudy: 'Ver Estudio de Caso',
      backToCases: 'Volver a los Casos',
    },
    fr: {
      badge: 'Portfolio d’Ingénierie',
      title: 'Des Réalisations qui Définissent les Standards',
      subtitle: 'Découvrez en détail l’architecture technique, les défis relevés et les retombées mesurables de chaque projet.',
      filterAllCategories: 'Toutes les catégories',
      filterAllTech: 'Toutes les technologies',
      filterAllYears: 'Toutes les années',
      viewStudy: 'Voir l’Étude de Cas',
      backToCases: 'Retour aux Projets',
    },
    de: {
      badge: 'Technisches Portfolio',
      title: 'Projekte, die Maßstäbe setzen',
      subtitle: 'Entdecken Sie die detaillierte Systemarchitektur, bewältigte Herausforderungen und messbare Ergebnisse.',
      filterAllCategories: 'Alle Kategorien',
      filterAllTech: 'Alle Technologien',
      filterAllYears: 'Alle Jahre',
      viewStudy: 'Fallstudie ansehen',
      backToCases: 'Zurück zu den Referenzen',
    },
    it: {
      badge: 'Portfolio Ingegneristico',
      title: 'Progetti che Fanno Scuola',
      subtitle: 'Scopri nel dettaglio l’architettura tecnica, le sfide affrontate e gli impatti concreti generati per i clienti.',
      filterAllCategories: 'Tutte le categorie',
      filterAllTech: 'Tutte le tecnologie',
      filterAllYears: 'Tutti gli anni',
      viewStudy: 'Leggi Caso Studio',
      backToCases: 'Torna ai Casi Studio',
    },
  },
};

const LOCALES = ['pt-BR', 'en', 'es', 'fr', 'de', 'it'];
const DOMAINS = ['common', 'marketing', 'platform', 'auth', 'os', 'admin', 'legal', 'cases'];

for (const locale of LOCALES) {
  const dir = path.join(ROOT, locale);
  fs.mkdirSync(dir, { recursive: true });

  for (const domain of DOMAINS) {
    const data = translations[domain][locale];
    if (!data) {
      throw new Error(`Missing translation for ${domain}.${locale}`);
    }
    const filePath = path.join(dir, `${domain}.ts`);
    const content = `// Domain message dictionary for ${domain} (${locale})
import type { ${capitalize(domain)}Dictionary } from '../../types';

const messages: ${capitalize(domain)}Dictionary = ${JSON.stringify(data, null, 2)};

export default messages;
`;
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

console.log('Successfully generated all 48 dictionary modules in src/lib/i18n/messages/');
