// VertexTarget — Data Constants

export const SITE_CONFIG = {
  name: "VertexTarget",
  tagline: "Engenharia Digital de Alto Impacto",
  description:
    "Marketing digital e automação inteligente. Unimos estratégia, código e IA para criar experiências digitais que convertem.",
  url: "https://vertextarget.com",
  leadership: [
    {
      name: "Gabriel Mastrillo",
      role: "CEO & CTO",
      focus: "Engenharia de Software, Arquitetura de Sistemas & IA",
    },
    {
      name: "Denis Braghin",
      role: "CEO",
      specialty: "Vendas & Marketing",
      focus: "Estratégia de Vendas, Growth & Funis de Alta Conversão",
    },
  ],
} as const;

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: "ai-automation",
    number: "01",
    title: "Automação de\nMarketing com IA",
    description:
      "Pipelines de marketing automatizados com inteligência artificial. Campanhas que se otimizam sozinhas, copy gerado por IA, e segmentação preditiva de audiência.",
    tags: ["Gemini API", "Pipelines", "NLP", "Automação"],
  },
  {
    id: "web-development",
    number: "02",
    title: "Desenvolvimento\nWeb Premium",
    description:
      "Sites e aplicações web com padrão Awwwards. WebGL, shaders customizados, animações orquestradas e performance obsessiva. Zero templates genéricos.",
    tags: ["Next.js", "Three.js", "GSAP", "WebGL"],
  },
  {
    id: "digital-strategy",
    number: "03",
    title: "Estratégia\nDigital & SEO",
    description:
      "Posicionamento digital data-driven. SEO técnico avançado, analytics comportamental, growth hacking e funis de conversão otimizados por IA.",
    tags: ["SEO", "Analytics", "Growth", "Data"],
  },
  {
    id: "system-integration",
    number: "04",
    title: "Integração de\nSistemas & APIs",
    description:
      "Arquiteturas que conectam tudo. APIs RESTful, webhooks, integrações CRM/ERP, microserviços e orquestração de dados entre plataformas.",
    tags: ["APIs", "Node.js", "Python", "Cloud"],
  },
  {
    id: "infrastructure",
    number: "05",
    title: "Consultoria em\nInfraestrutura",
    description:
      "Da base física ao deploy na nuvem. Diagnóstico de hardware, otimização de redes, CI/CD e DevOps. A engenharia por trás da engenharia.",
    tags: ["DevOps", "Cloud", "Hardware", "Redes"],
  },
];

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  tags: string[];
  color: string;
  year: string;
  liveUrl: string;
  metrics: string;
  client: string;
}

export const CASES: CaseStudy[] = [
  {
    id: "elon-watches",
    title: "ELON Watches",
    category: "Luxury E-Commerce & Intermediação",
    tagline: "O maior ecossistema de relógios de luxo do Brasil.",
    description:
      "Plataforma digital para o maior ecossistema de intermediação de relógios de luxo do Brasil. Catálogo premium com mais de 1.000 peças autenticadas — Rolex, Patek Philippe, Audemars Piguet — com fluxo de consignação, curadoria de coleções e jornada de compra de alto padrão para colecionadores e investidores.",
    tags: ["Next.js", "TailwindCSS", "Luxury UI", "Catálogo Premium", "Consignação", "High-Value Leads"],
    color: "#d4af37",
    year: "2026",
    liveUrl: "https://elonwatches.com/",
    metrics: "+1.000 Relógios Autenticados · Rolex · Patek · AP · Consignação",
    client: "ELON Watches (Elon Chaves)",
  },
  {
    id: "clinicflow",
    title: "ClinicFlow",
    category: "SaaS · Automação Odonto / IA",
    tagline: "Cada paciente, no momento certo.",
    description:
      "Plataforma SaaS de automação inteligente para clínicas odontológicas e de saúde. Desenvolvida para máxima conversão e retenção, conta com autenticação por senha e Magic Link, réguas de comunicação preditiva, agendamento automatizado e painel analítico com troca dinâmica de tema.",
    tags: ["Next.js", "TailwindCSS", "SaaS", "Automação CRM", "Magic Link", "TypeScript"],
    color: "#10b981",
    year: "2026",
    liveUrl: "https://clinicflow-dashboard-two.vercel.app/",
    metrics: "Automação 24/7 de Pacientes · Multi-theme · Zero Latency",
    client: "ClinicFlow · VertexTarget Co.",
  },
  {
    id: "cliente-absoluto",
    title: "Absoluto Soluções Integradas",
    category: "Segurança Eletrônica & VRF / PMOC",
    tagline: "Segurança Absoluta. Climatização & Proteção 24/7.",
    description:
      "Infraestrutura digital de alta precisão que unifica duas potências regionais no Oeste do PR: Absoluto (CFTV IP 4K com reconhecimento facial, leitura de placas LPR, alarmes monitorados) e Lucena Refrigeração (sistemas VRF, Chillers e laudo PMOC ANVISA Lei 13.589/18). Inclui calculadora técnica de dimensionamento em tempo real.",
    tags: ["Next.js", "TailwindCSS", "Calculadora Técnica", "CFTV IP IA", "VRF Climatização", "CREA-PR"],
    color: "#00e5ff",
    year: "2026",
    liveUrl: "https://cliente-absoluto.vercel.app/",
    metrics: "+15.000k BTUs Instalados · 99.9% Disponibilidade · +450 Sensores Ativos",
    client: "Absoluto Sistemas & Lucena Refrigeração",
  },
  {
    id: "jetski-gold",
    title: "Ale Rei Jet Ski & Marine",
    category: "E-Commerce Náutico & Showroom de Luxo",
    tagline: "Potência, Liberdade & Excelência Náutica.",
    description:
      "Plataforma digital de luxo para a maior referência em compra, venda e centro técnico de embarcações (Sea-Doo, Yamaha WaveRunner, Kawasaki) e linha off-road (Can-Am Maverick) no ABC Paulista. Apresenta catálogo com filtros por cavalaria (+300 HP), periciados com garantia, boutique de som náutico e concierge integrado.",
    tags: ["Next.js", "TailwindCSS", "Luxury UI", "Showroom 360°", "Filtro HP", "WhatsApp Concierge"],
    color: "#f59e0b",
    year: "2025",
    liveUrl: "https://jetski-gold.vercel.app/",
    metrics: "5.0★ Google (+180 Reviews) · 100% Inspecionados · Zero Km & Seminovos",
    client: "Ale Rei Jet Ski (São Bernardo do Campo)",
  },
  {
    id: "autobelle-multimarcas",
    title: "Autobelle Multimarcas",
    category: "Concessionária & Plataforma Automotiva",
    tagline: "20+ Anos de Tradição, Laudo Dekra e Procedência Total.",
    description:
      "Ambiente digital moderno para conceituada loja multimarcas com mais de 20 anos de história em Perus/SP. Desenvolvido com catálogo em tempo real, busca inteligente por modelo e categoria (SUVs, Sedans, Hatchs, Picapes), simulador de parcelamento e credibilidade com laudo cautelar 100% periciado.",
    tags: ["Next.js", "TailwindCSS", "Catálogo Dinâmico", "Simulador Financiamento", "Lead Gen", "SEO Local"],
    color: "#eab308",
    year: "2025",
    liveUrl: "https://autobelle-multimarcas.vercel.app/",
    metrics: "+8.500 Carros Entregues · 4.6★ Google (230+) · Laudo Dekra 100%",
    client: "Autobelle Multimarcas (São Paulo - SP)",
  },
  {
    id: "caccia-energia-solar",
    title: "CACCIA Energia Solar Renovável",
    category: "CleanTech & Engenharia Fotovoltaica",
    tagline: "Engenharia Solar de Alta Eficiência. Autonomia e Lucro Energético no MS.",
    description:
      "Plataforma institucional e ferramenta de engenharia fotovoltaica voltada ao Agronegócio (pivôs de irrigação, granjas, Plano Safra/FCO), indústrias e residências de alto padrão no Mato Grosso do Sul. Conta com simulador algorítmico de payback patrimonial com base na radiação solar de Ivinhema e homologação Energisa MS.",
    tags: ["Next.js", "TailwindCSS", "Simulador Algorítmico", "Agro Solar", "Payback Calc", "Energisa MS"],
    color: "#ff9900",
    year: "2025",
    liveUrl: "https://caccia-energia-solar.vercel.app/",
    metrics: "Economia de até 95% · Payback Médio 2,4 Anos · 25 Anos Garantia Linear",
    client: "CACCIA Engenharia Solar (Ivinhema - MS)",
  },
];

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  isFoundation?: boolean;
  tags: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "login-informatica",
    period: "2019 — 2022",
    role: "Suporte Técnico",
    company: "Login Informática",
    description:
      "Experiência prática e intensiva em suporte técnico — diagnóstico de hardware, manutenção preventiva/corretiva, resolução de problemas reais e infraestrutura de TI. A base sólida em pensamento sistêmico e troubleshooting que sustenta toda a engenharia de software da VertexTarget.",
    isFoundation: true,
    tags: ["Hardware", "Diagnóstico", "Redes", "Troubleshooting", "Infraestrutura"],
  },
  {
    id: "freelance-dev",
    period: "2022 — 2024",
    role: "Desenvolvedor Freelance",
    company: "Independente",
    description:
      "Transição para desenvolvimento web full-stack. Primeiros projetos com React, Node.js e integrações de API. Construção de portfólio e networking no ecossistema tech.",
    tags: ["React", "Node.js", "APIs", "WordPress"],
  },
  {
    id: "vertex-target",
    period: "2024 — Presente",
    role: "CEO & CTO",
    company: "VertexTarget",
    description:
      "Fundação e liderança executiva da VertexTarget ao lado de Denis Braghin (CEO de Vendas & Marketing). Arquitetura de software de alta performance, integração de IA generativa, desenvolvimento WebGL imersivo e orquestração de funis comerciais escaláveis.",
    tags: ["CEO & CTO", "Next.js", "Arquitetura", "IA", "Growth", "Liderança Executiva"],
  },
];

export const SKILLS_DATA = [
  { name: "TypeScript", level: 95, category: "core" },
  { name: "React/Next.js", level: 92, category: "core" },
  { name: "Three.js/WebGL", level: 88, category: "creative" },
  { name: "GSAP", level: 90, category: "creative" },
  { name: "Node.js", level: 87, category: "backend" },
  { name: "Python", level: 82, category: "backend" },
  { name: "AI/ML APIs", level: 85, category: "ai" },
  { name: "DevOps/Cloud", level: 78, category: "infra" },
  { name: "Hardware/Redes", level: 90, category: "infra" },
  { name: "UI/UX Design", level: 83, category: "creative" },
];

export const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Serviços", href: "#services" },
  { label: "Cases", href: "#cases" },
  { label: "Sobre", href: "#about" },
  { label: "AI Lab", href: "#ai-lab" },
  { label: "Contato", href: "#contact" },
] as const;
