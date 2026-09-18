"use client";

/**
 * VertexTarget i18n — pt (default) / en / es / fr / it
 * Dictionary-based translations, no runtime dependency.
 */

export const LOCALES = ["pt", "en", "es", "fr", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
};

const pt = {
  nav: {
    hero: "Início",
    services: "Serviços",
    cases: "Cases",
    about: "Sobre",
    aiLab: "AI Lab",
    contact: "Contato",
  },
  hero: {
    label: "VertexTarget Studio",
    title1: "We engineer",
    title2: "digital gravity.",
    subtitle:
      "Marketing digital, automação com IA e experiências web imersivas. Transformamos marcas em forças gravitacionais do digital.",
    ctaPrimary: "Iniciar Projeto",
    ctaSecondary: "Ver Cases",
    scroll: "Scroll",
  },
  services: {
    label: "Serviços",
    title1: "Soluções que movem",
    title2: "o seu digital.",
    subtitle:
      "Da estratégia à execução. Combinamos marketing digital, engenharia de software e inteligência artificial para criar resultados mensuráveis.",
    swipeHint: "Deslize",
  },
  cases: {
    label: "Portfólio & Engenharia",
    title1: "Projetos que",
    title2: "definem mercados.",
    subtitle:
      "Cada aplicação é uma obra de alta precisão técnica. Unimos arquitetura full-stack, design imersivo, automação inteligente e performance extrema para transformar negócios reais.",
    viewStudy: "Ver Estudo & Arquitetura",
    liveDemo: "Live Demo",
    openProject: "Abrir projeto em nova aba",
    production: "✓ Produção 100% Ativa",
    aboutProject: "Sobre o projeto",
    techStack: "Tecnologias & Arquitetura",
    visitProject: "Visitar Projeto",
    deployNote: "Deploy oficial hospedado e otimizado na Vercel Edge Network",
  },
  about: {
    label: "Liderança & Visão",
    title1: "Liderança que une",
    title2: "Engenharia & Tração.",
    subtitle:
      "A VertexTarget nasce da fusão estratégica entre arquitetura técnica de ponta e agressividade comercial. Construímos experiências digitais imersivas respaldadas por estratégias de vendas que convertem.",
    stats: [
      { value: "50+", label: "Projetos Entregues" },
      { value: "340%", label: "ROI Médio Clientes" },
      { value: "7+", label: "Anos de Experiência" },
      { value: "∞", label: "Linhas de Código" },
    ],
    ceos: [
      {
        name: "Gabriel Mastrillo",
        badge: "⚡ CEO & CTO",
        side: "Engenharia & IA",
        subtitle: "Engenharia de Software, Arquitetura de Sistemas & IA",
        bio: "Fundador e líder técnico-executivo da VertexTarget. Com sólida formação prática em suporte técnico, hardware e resolução de problemas complexos, projeta ecossistemas digitais de alta precisão: arquiteturas full-stack, WebGL/3D com shaders customizados e integrações com inteligência artificial para marcas que buscam autoridade absoluta.",
        tags: ["Arquitetura Full-Stack", "Three.js / WebGL", "IA Generativa", "DevOps & Cloud"],
        initials: "GM",
      },
      {
        name: "Denis Braghin",
        badge: "🚀 CEO · Vendas & Marketing",
        side: "Growth & Tração",
        subtitle: "Estratégia Comercial, Growth Hacking & Funis de Conversão",
        bio: "Co-CEO especializado em vendas e marketing da VertexTarget. Especialista em acelerar receitas através de estratégias data-driven, funis de vendas de alta performance, automação de processos comerciais e posicionamento premium para transformar leads em clientes fiéis.",
        tags: ["Estratégia de Vendas", "Growth Hacking", "Funis de Conversão", "Posicionamento B2B"],
        initials: "DB",
      },
    ],
  },
  aiLab: {
    label: "AI Lab",
    title1: "Experimente o poder",
    title2: "da IA em ação.",
    subtitle:
      "Descreva seu negócio e veja uma estratégia de marketing sendo gerada em tempo real pelo motor de IA da VertexTarget.",
    terminal: "vertextarget-ai v1.0 — gemini-pro",
    empty: "Descreva seu negócio para gerar uma estratégia de marketing com IA.",
    suggestions: [
      "Loja de roupas femininas em SP",
      "SaaS de gestão financeira",
      "Clínica de estética premium",
      "Agência de viagens de luxo",
    ],
    placeholder: "Descreva seu negócio...",
    send: "Enviar",
  },
  contact: {
    label: "Contato",
    title1: "Vamos criar algo",
    title2: "extraordinário.",
    subtitle:
      "Pronto para transformar sua presença digital? Conte-nos sobre seu projeto e vamos engenheirar a solução perfeita juntos.",
    email: "Email",
    location: "Localização",
    locationValue: "Brasil — Remoto Global",
    name: "Nome",
    namePlaceholder: "Seu nome",
    emailPlaceholder: "seu@email.com",
    budget: "Orçamento Estimado",
    budgetPlaceholder: "Selecione...",
    budgetOptions: [
      "R$ 5.000 — R$ 10.000",
      "R$ 10.000 — R$ 25.000",
      "R$ 25.000 — R$ 50.000",
      "R$ 50.000+",
    ],
    message: "Mensagem",
    messagePlaceholder: "Conte sobre seu projeto...",
    submit: "Enviar Mensagem",
    sending: "Enviando...",
    sent: "✓ Mensagem Enviada!",
    error: "Erro — Tente novamente",
  },
  trusted: {
    label: "Quem confia",
    title: "Negócios reais, resultados reais.",
  },
  faq: {
    label: "Perguntas Frequentes",
    title1: "Tudo que você precisa",
    title2: "saber antes de começar.",
    items: [
      {
        q: "Quanto custa um projeto com a VertexTarget?",
        a: "Cada projeto é dimensionado sob medida. Trabalhamos de landing pages premium a plataformas completas com IA — o orçamento segue o escopo, não o contrário. O diagnóstico inicial é gratuito: conversamos sobre suas metas e retornamos com proposta em até 48h.",
      },
      {
        q: "Quanto tempo leva para ficar pronto?",
        a: "Landing pages premium: 2–3 semanas. Sites institucionais com CMS: 4–6 semanas. Plataformas com automação e IA: 6–10 semanas. Você acompanha cada etapa com demos semanais — nada de surpresas no final.",
      },
      {
        q: "O que é incluso no suporte pós-entrega?",
        a: "Todos os projetos incluem 30 dias de suporte dedicado pós-launch: correções, ajustes e monitoramento. Depois disso, oferecemos planos de manutenção contínua com SLA definido — o site nunca fica sem dono.",
      },
      {
        q: "Vocês trabalham com clientes fora do Brasil?",
        a: "Sim — atendemos em português, inglês, espanhol, francês e italiano. O processo é 100% remoto e assíncrono, com reuniões no fuso que funcionar para você.",
      },
      {
        q: "Por que escolher a VertexTarget?",
        a: "Porque unimos as duas pontas que agências separam: engenharia de software de alto nível e estratégia de vendas que converte. Seu site não é só bonito — ele é uma máquina de gerar receita. E você fala direto com os CEOs, sem intermediários.",
      },
    ],
  },
  footer: {
    tagline1: "Engenharia digital de alto impacto.",
    tagline2: "Marketing + IA + Código.",
    copyright: "VertexTarget. Engineered with",
    precision: "precision",
  },
  ui: {
    language: "Idioma",
    theme: "Tema",
    loadingPreview: "Carregando preview",
  },
};

export type Dict = typeof pt;

const en: Dict = {
  nav: {
    hero: "Home",
    services: "Services",
    cases: "Cases",
    about: "About",
    aiLab: "AI Lab",
    contact: "Contact",
  },
  hero: {
    label: "VertexTarget Studio",
    title1: "We engineer",
    title2: "digital gravity.",
    subtitle:
      "Digital marketing, AI automation and immersive web experiences. We turn brands into gravitational forces of the digital world.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "View Cases",
    scroll: "Scroll",
  },
  services: {
    label: "Services",
    title1: "Solutions that move",
    title2: "your digital world.",
    subtitle:
      "From strategy to execution. We combine digital marketing, software engineering and artificial intelligence to create measurable results.",
    swipeHint: "Swipe",
  },
  cases: {
    label: "Portfolio & Engineering",
    title1: "Projects that",
    title2: "define markets.",
    subtitle:
      "Every application is a work of high technical precision. We combine full-stack architecture, immersive design, intelligent automation and extreme performance to transform real businesses.",
    viewStudy: "View Study & Architecture",
    liveDemo: "Live Demo",
    openProject: "Open project in a new tab",
    production: "✓ Production 100% Active",
    aboutProject: "About the project",
    techStack: "Technologies & Architecture",
    visitProject: "Visit Project",
    deployNote: "Officially hosted and optimized on the Vercel Edge Network",
  },
  about: {
    label: "Leadership & Vision",
    title1: "Leadership that unites",
    title2: "Engineering & Traction.",
    subtitle:
      "VertexTarget is born from the strategic fusion of cutting-edge technical architecture and commercial aggressiveness. We build immersive digital experiences backed by sales strategies that convert.",
    stats: [
      { value: "50+", label: "Projects Delivered" },
      { value: "340%", label: "Average Client ROI" },
      { value: "7+", label: "Years of Experience" },
      { value: "∞", label: "Lines of Code" },
    ],
    ceos: [
      {
        name: "Gabriel Mastrillo",
        badge: "⚡ CEO & CTO",
        side: "Engineering & AI",
        subtitle: "Software Engineering, Systems Architecture & AI",
        bio: "Founder and technical-executive leader of VertexTarget. With solid hands-on background in tech support, hardware and complex problem-solving, he designs high-precision digital ecosystems: full-stack architectures, WebGL/3D with custom shaders and artificial intelligence integrations for brands seeking absolute authority.",
        tags: ["Full-Stack Architecture", "Three.js / WebGL", "Generative AI", "DevOps & Cloud"],
        initials: "GM",
      },
      {
        name: "Denis Braghin",
        badge: "🚀 CEO · Sales & Marketing",
        side: "Growth & Traction",
        subtitle: "Commercial Strategy, Growth Hacking & Conversion Funnels",
        bio: "Co-CEO specialized in sales and marketing at VertexTarget. Expert in accelerating revenue through data-driven strategies, high-performance sales funnels, commercial process automation and premium positioning to turn leads into loyal customers.",
        tags: ["Sales Strategy", "Growth Hacking", "Conversion Funnels", "B2B Positioning"],
        initials: "DB",
      },
    ],
  },
  aiLab: {
    label: "AI Lab",
    title1: "Experience the power",
    title2: "of AI in action.",
    subtitle:
      "Describe your business and watch a marketing strategy being generated in real time by the VertexTarget AI engine.",
    terminal: "vertextarget-ai v1.0 — gemini-pro",
    empty: "Describe your business to generate a marketing strategy with AI.",
    suggestions: [
      "Women's clothing store in São Paulo",
      "Financial management SaaS",
      "Premium aesthetics clinic",
      "Luxury travel agency",
    ],
    placeholder: "Describe your business...",
    send: "Send",
  },
  contact: {
    label: "Contact",
    title1: "Let's create something",
    title2: "extraordinary.",
    subtitle:
      "Ready to transform your digital presence? Tell us about your project and we'll engineer the perfect solution together.",
    email: "Email",
    location: "Location",
    locationValue: "Brazil — Remote Global",
    name: "Name",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@email.com",
    budget: "Estimated Budget",
    budgetPlaceholder: "Select...",
    budgetOptions: [
      "R$ 5,000 — R$ 10,000",
      "R$ 10,000 — R$ 25,000",
      "R$ 25,000 — R$ 50,000",
      "R$ 50,000+",
    ],
    message: "Message",
    messagePlaceholder: "Tell us about your project...",
    submit: "Send Message",
    sending: "Sending...",
    sent: "✓ Message Sent!",
    error: "Error — Try again",
  },
  trusted: {
    label: "Trusted by",
    title: "Real businesses, real results.",
  },
  faq: {
    label: "Frequently Asked Questions",
    title1: "Everything you need",
    title2: "to know before starting.",
    items: [
      {
        q: "How much does a VertexTarget project cost?",
        a: "Every project is custom-scoped. We work from premium landing pages to complete AI-powered platforms — budget follows scope, not the other way around. The initial diagnosis is free: we discuss your goals and return a proposal within 48h.",
      },
      {
        q: "How long does it take to be ready?",
        a: "Premium landing pages: 2–3 weeks. Institutional sites with CMS: 4–6 weeks. Platforms with automation and AI: 6–10 weeks. You follow every step with weekly demos — no surprises at the end.",
      },
      {
        q: "What does post-delivery support include?",
        a: "Every project includes 30 days of dedicated post-launch support: fixes, adjustments and monitoring. After that, we offer ongoing maintenance plans with defined SLA — your site is never left orphaned.",
      },
      {
        q: "Do you work with clients outside Brazil?",
        a: "Yes — we serve clients in Portuguese, English, Spanish, French and Italian. The process is 100% remote and asynchronous, with meetings in whatever timezone works for you.",
      },
      {
        q: "Why choose VertexTarget?",
        a: "Because we unite the two ends that agencies separate: high-level software engineering and sales strategy that converts. Your site isn't just beautiful — it's a revenue-generating machine. And you talk directly with the CEOs, no middlemen.",
      },
    ],
  },
  footer: {
    tagline1: "High-impact digital engineering.",
    tagline2: "Marketing + AI + Code.",
    copyright: "VertexTarget. Engineered with",
    precision: "precision",
  },
  ui: {
    language: "Language",
    theme: "Theme",
    loadingPreview: "Loading preview",
  },
};

const es: Dict = {
  nav: {
    hero: "Inicio",
    services: "Servicios",
    cases: "Casos",
    about: "Nosotros",
    aiLab: "AI Lab",
    contact: "Contacto",
  },
  hero: {
    label: "VertexTarget Studio",
    title1: "We engineer",
    title2: "digital gravity.",
    subtitle:
      "Marketing digital, automatización con IA y experiencias web inmersivas. Convertimos marcas en fuerzas gravitacionales del mundo digital.",
    ctaPrimary: "Iniciar Proyecto",
    ctaSecondary: "Ver Casos",
    scroll: "Scroll",
  },
  services: {
    label: "Servicios",
    title1: "Soluciones que mueven",
    title2: "tu mundo digital.",
    subtitle:
      "De la estrategia a la ejecución. Combinamos marketing digital, ingeniería de software e inteligencia artificial para crear resultados medibles.",
    swipeHint: "Desliza",
  },
  cases: {
    label: "Portafolio e Ingeniería",
    title1: "Proyectos que",
    title2: "definen mercados.",
    subtitle:
      "Cada aplicación es una obra de alta precisión técnica. Unimos arquitectura full-stack, diseño inmersivo, automatización inteligente y rendimiento extremo para transformar negocios reales.",
    viewStudy: "Ver Estudio y Arquitectura",
    liveDemo: "Demo en Vivo",
    openProject: "Abrir proyecto en nueva pestaña",
    production: "✓ Producción 100% Activa",
    aboutProject: "Sobre el proyecto",
    techStack: "Tecnologías y Arquitectura",
    visitProject: "Visitar Proyecto",
    deployNote: "Despliegue oficial alojado y optimizado en Vercel Edge Network",
  },
  about: {
    label: "Liderazgo y Visión",
    title1: "Liderazgo que une",
    title2: "Ingeniería y Tracción.",
    subtitle:
      "VertexTarget nace de la fusión estratégica entre arquitectura técnica de vanguardia y agresividad comercial. Construimos experiencias digitales inmersivas respaldadas por estrategias de ventas que convierten.",
    stats: [
      { value: "50+", label: "Proyectos Entregados" },
      { value: "340%", label: "ROI Promedio Clientes" },
      { value: "7+", label: "Años de Experiencia" },
      { value: "∞", label: "Líneas de Código" },
    ],
    ceos: [
      {
        name: "Gabriel Mastrillo",
        badge: "⚡ CEO & CTO",
        side: "Ingeniería e IA",
        subtitle: "Ingeniería de Software, Arquitectura de Sistemas e IA",
        bio: "Fundador y líder técnico-ejecutivo de VertexTarget. Con sólida formación práctica en soporte técnico, hardware y resolución de problemas complejos, diseña ecosistemas digitales de alta precisión: arquitecturas full-stack, WebGL/3D con shaders personalizados e integraciones con inteligencia artificial para marcas que buscan autoridad absoluta.",
        tags: ["Arquitectura Full-Stack", "Three.js / WebGL", "IA Generativa", "DevOps y Cloud"],
        initials: "GM",
      },
      {
        name: "Denis Braghin",
        badge: "🚀 CEO · Ventas y Marketing",
        side: "Growth y Tracción",
        subtitle: "Estrategia Comercial, Growth Hacking y Embudos de Conversión",
        bio: "Co-CEO especializado en ventas y marketing de VertexTarget. Experto en acelerar ingresos mediante estrategias data-driven, embudos de ventas de alto rendimiento, automatización de procesos comerciales y posicionamiento premium para convertir leads en clientes fieles.",
        tags: ["Estrategia de Ventas", "Growth Hacking", "Embudos de Conversión", "Posicionamiento B2B"],
        initials: "DB",
      },
    ],
  },
  aiLab: {
    label: "AI Lab",
    title1: "Experimenta el poder",
    title2: "de la IA en acción.",
    subtitle:
      "Describe tu negocio y observa cómo se genera una estrategia de marketing en tiempo real por el motor de IA de VertexTarget.",
    terminal: "vertextarget-ai v1.0 — gemini-pro",
    empty: "Describe tu negocio para generar una estrategia de marketing con IA.",
    suggestions: [
      "Tienda de ropa femenina en São Paulo",
      "SaaS de gestión financiera",
      "Clínica de estética premium",
      "Agencia de viajes de lujo",
    ],
    placeholder: "Describe tu negocio...",
    send: "Enviar",
  },
  contact: {
    label: "Contacto",
    title1: "Creemos algo",
    title2: "extraordinario.",
    subtitle:
      "¿Listo para transformar tu presencia digital? Cuéntanos sobre tu proyecto y diseñemos juntos la solución perfecta.",
    email: "Email",
    location: "Ubicación",
    locationValue: "Brasil — Remoto Global",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "tu@email.com",
    budget: "Presupuesto Estimado",
    budgetPlaceholder: "Seleccionar...",
    budgetOptions: [
      "R$ 5.000 — R$ 10.000",
      "R$ 10.000 — R$ 25.000",
      "R$ 25.000 — R$ 50.000",
      "R$ 50.000+",
    ],
    message: "Mensaje",
    messagePlaceholder: "Cuéntanos sobre tu proyecto...",
    submit: "Enviar Mensaje",
    sending: "Enviando...",
    sent: "✓ ¡Mensaje Enviado!",
    error: "Error — Intenta de nuevo",
  },
  trusted: {
    label: "Quién confía",
    title: "Negocios reales, resultados reales.",
  },
  faq: {
    label: "Preguntas Frecuentes",
    title1: "Todo lo que necesitas",
    title2: "saber antes de empezar.",
    items: [
      {
        q: "¿Cuánto cuesta un proyecto con VertexTarget?",
        a: "Cada proyecto se dimensiona a medida. Trabajamos desde landing pages premium hasta plataformas completas con IA — el presupuesto sigue al alcance, no al revés. El diagnóstico inicial es gratuito: conversamos sobre tus metas y devolvemos propuesta en hasta 48h.",
      },
      {
        q: "¿Cuánto tiempo tarda en estar listo?",
        a: "Landing pages premium: 2–3 semanas. Sitios institucionales con CMS: 4–6 semanas. Plataformas con automatización e IA: 6–10 semanas. Acompañas cada etapa con demos semanales — sin sorpresas al final.",
      },
      {
        q: "¿Qué incluye el soporte post-entrega?",
        a: "Todos los proyectos incluyen 30 días de soporte dedicado post-lanzamiento: correcciones, ajustes y monitoreo. Después ofrecemos planes de mantenimiento continuo con SLA definido — tu sitio nunca queda huérfano.",
      },
      {
        q: "¿Trabajan con clientes fuera de Brasil?",
        a: "Sí — atendemos en portugués, inglés, español, francés e italiano. El proceso es 100% remoto y asíncrono, con reuniones en el huso horario que te funcione.",
      },
      {
        q: "¿Por qué elegir VertexTarget?",
        a: "Porque unimos las dos puntas que las agencias separan: ingeniería de software de alto nivel y estrategia de ventas que convierte. Tu sitio no es solo bonito — es una máquina de generar ingresos. Y hablas directo con los CEOs, sin intermediarios.",
      },
    ],
  },
  footer: {
    tagline1: "Ingeniería digital de alto impacto.",
    tagline2: "Marketing + IA + Código.",
    copyright: "VertexTarget. Engineered with",
    precision: "precision",
  },
  ui: {
    language: "Idioma",
    theme: "Tema",
    loadingPreview: "Cargando vista previa",
  },
};

const fr: Dict = {
  nav: {
    hero: "Accueil",
    services: "Services",
    cases: "Réalisations",
    about: "À propos",
    aiLab: "AI Lab",
    contact: "Contact",
  },
  hero: {
    label: "VertexTarget Studio",
    title1: "We engineer",
    title2: "digital gravity.",
    subtitle:
      "Marketing digital, automatisation par IA et expériences web immersives. Nous transformons les marques en forces gravitationnelles du numérique.",
    ctaPrimary: "Démarrer un Projet",
    ctaSecondary: "Voir les Réalisations",
    scroll: "Défiler",
  },
  services: {
    label: "Services",
    title1: "Des solutions qui font",
    title2: "bouger votre digital.",
    subtitle:
      "De la stratégie à l'exécution. Nous allions marketing digital, ingénierie logicielle et intelligence artificielle pour créer des résultats mesurables.",
    swipeHint: "Glissez",
  },
  cases: {
    label: "Portfolio & Ingénierie",
    title1: "Des projets qui",
    title2: "définissent les marchés.",
    subtitle:
      "Chaque application est une œuvre de haute précision technique. Nous unissons architecture full-stack, design immersif, automatisation intelligente et performances extrêmes pour transformer de vraies entreprises.",
    viewStudy: "Voir l'Étude & l'Architecture",
    liveDemo: "Démo Live",
    openProject: "Ouvrir le projet dans un nouvel onglet",
    production: "✓ Production 100% Active",
    aboutProject: "À propos du projet",
    techStack: "Technologies & Architecture",
    visitProject: "Visiter le Projet",
    deployNote: "Déploiement officiel hébergé et optimisé sur Vercel Edge Network",
  },
  about: {
    label: "Leadership & Vision",
    title1: "Un leadership qui unit",
    title2: "Ingénierie & Traction.",
    subtitle:
      "VertexTarget naît de la fusion stratégique entre architecture technique de pointe et agressivité commerciale. Nous créons des expériences numériques immersives soutenues par des stratégies de vente qui convertissent.",
    stats: [
      { value: "50+", label: "Projets Livrés" },
      { value: "340%", label: "ROI Moyen Clients" },
      { value: "7+", label: "Années d'Expérience" },
      { value: "∞", label: "Lignes de Code" },
    ],
    ceos: [
      {
        name: "Gabriel Mastrillo",
        badge: "⚡ CEO & CTO",
        side: "Ingénierie & IA",
        subtitle: "Ingénierie Logicielle, Architecture Système & IA",
        bio: "Fondateur et leader technique-exécutif de VertexTarget. Fort d'une solide formation pratique en support technique, matériel et résolution de problèmes complexes, il conçoit des écosystèmes numériques de haute précision : architectures full-stack, WebGL/3D avec shaders personnalisés et intégrations d'intelligence artificielle pour les marques en quête d'autorité absolue.",
        tags: ["Architecture Full-Stack", "Three.js / WebGL", "IA Générative", "DevOps & Cloud"],
        initials: "GM",
      },
      {
        name: "Denis Braghin",
        badge: "🚀 CEO · Ventes & Marketing",
        side: "Growth & Traction",
        subtitle: "Stratégie Commerciale, Growth Hacking & Funnels de Conversion",
        bio: "Co-CEO spécialisé dans les ventes et le marketing de VertexTarget. Expert en accélération du chiffre d'affaires grâce à des stratégies data-driven, des tunnels de vente performants, l'automatisation des processus commerciaux et un positionnement premium pour transformer les prospects en clients fidèles.",
        tags: ["Stratégie de Vente", "Growth Hacking", "Funnels de Conversion", "Positionnement B2B"],
        initials: "DB",
      },
    ],
  },
  aiLab: {
    label: "AI Lab",
    title1: "Expérimentez la puissance",
    title2: "de l'IA en action.",
    subtitle:
      "Décrivez votre entreprise et regardez une stratégie marketing se générer en temps réel par le moteur d'IA de VertexTarget.",
    terminal: "vertextarget-ai v1.0 — gemini-pro",
    empty: "Décrivez votre entreprise pour générer une stratégie marketing avec l'IA.",
    suggestions: [
      "Boutique de vêtements féminins à São Paulo",
      "SaaS de gestion financière",
      "Clinique d'esthétique premium",
      "Agence de voyages de luxe",
    ],
    placeholder: "Décrivez votre entreprise...",
    send: "Envoyer",
  },
  contact: {
    label: "Contact",
    title1: "Créons quelque chose",
    title2: "d'extraordinaire.",
    subtitle:
      "Prêt à transformer votre présence numérique ? Parlez-nous de votre projet et concevons ensemble la solution parfaite.",
    email: "Email",
    location: "Localisation",
    locationValue: "Brésil — Télétravail Global",
    name: "Nom",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "vous@email.com",
    budget: "Budget Estimé",
    budgetPlaceholder: "Sélectionner...",
    budgetOptions: [
      "R$ 5 000 — R$ 10 000",
      "R$ 10 000 — R$ 25 000",
      "R$ 25 000 — R$ 50 000",
      "R$ 50 000+",
    ],
    message: "Message",
    messagePlaceholder: "Parlez-nous de votre projet...",
    submit: "Envoyer le Message",
    sending: "Envoi...",
    sent: "✓ Message Envoyé !",
    error: "Erreur — Réessayez",
  },
  trusted: {
    label: "Ils nous font confiance",
    title: "Des business réels, des résultats réels.",
  },
  faq: {
    label: "Questions Fréquentes",
    title1: "Tout ce qu'il faut",
    title2: "savoir avant de commencer.",
    items: [
      {
        q: "Combien coûte un projet avec VertexTarget?",
        a: "Chaque projet est dimensionné sur mesure. Nous travaillons des landing pages premium aux plateformes complètes avec IA — le budget suit le périmètre, pas l'inverse. Le diagnostic initial est gratuit : nous discutons de vos objectifs et revenons avec une proposition sous 48h.",
      },
      {
        q: "Combien de temps pour être prêt ?",
        a: "Landing pages premium : 2–3 semaines. Sites institutionnels avec CMS : 4–6 semaines. Plateformes avec automatisation et IA : 6–10 semaines. Vous suivez chaque étape avec des démos hebdomadaires — aucune surprise à la fin.",
      },
      {
        q: "Que comprend le support après livraison ?",
        a: "Tous les projets incluent 30 jours de support dédié post-lancement : corrections, ajustements et monitoring. Ensuite, nous proposons des plans de maintenance continue avec SLA défini — votre site n'est jamais orphelin.",
      },
      {
        q: "Travaillez-vous avec des clients hors Brésil ?",
        a: "Oui — nous servons en portugais, anglais, espagnol, français et italien. Le processus est 100% remote et asynchrone, avec des réunions au fuseau qui vous convient.",
      },
      {
        q: "Pourquoi choisir VertexTarget ?",
        a: "Parce que nous unissons les deux bouts que les agences séparent : ingénierie logicielle de haut niveau et stratégie commerciale qui convertit. Votre site n'est pas seulement beau — c'est une machine à générer du revenu. Et vous parlez directement aux CEO, sans intermédiaires.",
      },
    ],
  },
  footer: {
    tagline1: "Ingénierie numérique à fort impact.",
    tagline2: "Marketing + IA + Code.",
    copyright: "VertexTarget. Engineered with",
    precision: "precision",
  },
  ui: {
    language: "Langue",
    theme: "Thème",
    loadingPreview: "Chargement de l'aperçu",
  },
};

const it: Dict = {
  nav: {
    hero: "Home",
    services: "Servizi",
    cases: "Casi",
    about: "Chi siamo",
    aiLab: "AI Lab",
    contact: "Contatti",
  },
  hero: {
    label: "VertexTarget Studio",
    title1: "We engineer",
    title2: "digital gravity.",
    subtitle:
      "Marketing digitale, automazione con IA e esperienze web immersive. Trasformiamo i marchi in forze gravitazionali del digitale.",
    ctaPrimary: "Avvia Progetto",
    ctaSecondary: "Vedi i Casi",
    scroll: "Scorri",
  },
  services: {
    label: "Servizi",
    title1: "Soluzioni che muovono",
    title2: "il tuo digitale.",
    subtitle:
      "Dalla strategia all'esecuzione. Combiniamo marketing digitale, ingegneria del software e intelligenza artificiale per creare risultati misurabili.",
    swipeHint: "Scorri",
  },
  cases: {
    label: "Portfolio & Ingegneria",
    title1: "Progetti che",
    title2: "definiscono i mercati.",
    subtitle:
      "Ogni applicazione è un'opera di alta precisione tecnica. Uniamo architettura full-stack, design immersivo, automazione intelligente e prestazioni estreme per trasformare aziende reali.",
    viewStudy: "Vedi Studio e Architettura",
    liveDemo: "Demo Live",
    openProject: "Apri il progetto in una nuova scheda",
    production: "✓ Produzione 100% Attiva",
    aboutProject: "Sul progetto",
    techStack: "Tecnologie e Architettura",
    visitProject: "Visita il Progetto",
    deployNote: "Deploy ufficiale ospitato e ottimizzato su Vercel Edge Network",
  },
  about: {
    label: "Leadership e Visione",
    title1: "Una leadership che unisce",
    title2: "Ingegneria e Trazione.",
    subtitle:
      "VertexTarget nasce dalla fusione strategica tra architettura tecnica all'avanguardia e aggressività commerciale. Costruiamo esperienze digitali immersive supportate da strategie di vendita che convertono.",
    stats: [
      { value: "50+", label: "Progetti Consegnati" },
      { value: "340%", label: "ROI Medio Clienti" },
      { value: "7+", label: "Anni di Esperienza" },
      { value: "∞", label: "Righe di Codice" },
    ],
    ceos: [
      {
        name: "Gabriel Mastrillo",
        badge: "⚡ CEO & CTO",
        side: "Ingegneria e IA",
        subtitle: "Ingegneria del Software, Architettura dei Sistemi e IA",
        bio: "Fondatore e leader tecnico-esecutivo di VertexTarget. Con una solida formazione pratica in supporto tecnico, hardware e risoluzione di problemi complessi, progetta ecosistemi digitali di alta precisione: architetture full-stack, WebGL/3D con shader personalizzati e integrazioni di intelligenza artificiale per marchi in cerca di autorità assoluta.",
        tags: ["Architettura Full-Stack", "Three.js / WebGL", "IA Generativa", "DevOps e Cloud"],
        initials: "GM",
      },
      {
        name: "Denis Braghin",
        badge: "🚀 CEO · Vendite e Marketing",
        side: "Growth e Trazione",
        subtitle: "Strategia Commerciale, Growth Hacking e Funnel di Conversione",
        bio: "Co-CEO specializzato in vendite e marketing di VertexTarget. Esperto nell'accelerare i ricavi attraverso strategie data-driven, funnel di vendita ad alta performance, automazione dei processi commerciali e posizionamento premium per trasformare i lead in clienti fedeli.",
        tags: ["Strategia di Vendita", "Growth Hacking", "Funnel di Conversione", "Posizionamento B2B"],
        initials: "DB",
      },
    ],
  },
  aiLab: {
    label: "AI Lab",
    title1: "Sperimenta la potenza",
    title2: "dell'IA in azione.",
    subtitle:
      "Descrivi la tua attività e guarda una strategia di marketing generarsi in tempo reale dal motore IA di VertexTarget.",
    terminal: "vertextarget-ai v1.0 — gemini-pro",
    empty: "Descrivi la tua attività per generare una strategia di marketing con l'IA.",
    suggestions: [
      "Negozio di abbigliamento femminile a São Paulo",
      "SaaS di gestione finanziaria",
      "Clinica estetica premium",
      "Agenzia di viaggi di lusso",
    ],
    placeholder: "Descrivi la tua attività...",
    send: "Invia",
  },
  contact: {
    label: "Contatti",
    title1: "Creiamo qualcosa",
    title2: "di straordinario.",
    subtitle:
      "Pronto a trasformare la tua presenza digitale? Raccontaci il tuo progetto e progetteremo insieme la soluzione perfetta.",
    email: "Email",
    location: "Località",
    locationValue: "Brasile — Remoto Globale",
    name: "Nome",
    namePlaceholder: "Il tuo nome",
    emailPlaceholder: "tu@email.com",
    budget: "Budget Stimato",
    budgetPlaceholder: "Seleziona...",
    budgetOptions: [
      "R$ 5.000 — R$ 10.000",
      "R$ 10.000 — R$ 25.000",
      "R$ 25.000 — R$ 50.000",
      "R$ 50.000+",
    ],
    message: "Messaggio",
    messagePlaceholder: "Raccontaci il tuo progetto...",
    submit: "Invia Messaggio",
    sending: "Invio...",
    sent: "✓ Messaggio Inviato!",
    error: "Errore — Riprova",
  },
  trusted: {
    label: "Chi si fida di noi",
    title: "Business reali, risultati reali.",
  },
  faq: {
    label: "Domande Frequenti",
    title1: "Tutto ciò che devi",
    title2: "sapere prima di iniziare.",
    items: [
      {
        q: "Quanto costa un progetto con VertexTarget?",
        a: "Ogni progetto è dimensionato su misura. Lavoriamo da landing page premium a piattaforme complete con IA — il budget segue lo scope, non il contrario. La diagnosi iniziale è gratuita: parliamo dei tuoi obiettivi e restituiamo una proposta entro 48h.",
      },
      {
        q: "Quanto tempo serve per essere pronto?",
        a: "Landing page premium: 2–3 settimane. Siti istituzionali con CMS: 4–6 settimane. Piattaforme con automazione e IA: 6–10 settimane. Segui ogni fase con demo settimanali — nessuna sorpresa alla fine.",
      },
      {
        q: "Cosa include il supporto post-consegna?",
        a: "Tutti i progetti includono 30 giorni di supporto dedicato post-lancio: correzioni, aggiustamenti e monitoraggio. Dopo offriamo piani di manutenzione continua con SLA definito — il tuo sito non resta mai orfano.",
      },
      {
        q: "Lavorate con clienti fuori dal Brasile?",
        a: "Sì — serviamo in portoghese, inglese, spagnolo, francese e italiano. Il processo è 100% remoto e asincrono, con riunioni nel fuso orario che ti serve.",
      },
      {
        q: "Perché scegliere VertexTarget?",
        a: "Perché uniamo le due estremità che le agenzie separano: ingegneria del software di alto livello e strategia di vendita che converte. Il tuo sito non è solo bello — è una macchina che genera fatturato. E parli direttamente con i CEO, senza intermediari.",
      },
    ],
  },
  footer: {
    tagline1: "Ingegneria digitale ad alto impatto.",
    tagline2: "Marketing + IA + Codice.",
    copyright: "VertexTarget. Engineered with",
    precision: "precision",
  },
  ui: {
    language: "Lingua",
    theme: "Tema",
    loadingPreview: "Caricamento anteprima",
  },
};

const dictionaries: Record<Locale, Dict> = { pt, en, es, fr, it };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.pt;
}
