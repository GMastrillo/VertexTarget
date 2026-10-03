export const validBriefing = Object.freeze({
  businessName: 'Studio Arquitetura Vertex',
  sector: 'Arquitetura e Interiores',
  city: 'São Paulo',
  objective: 'Apresentar projetos de interiores e captar clientes residenciais',
  description: 'Projetos arquitetônicos contemporâneos com foco em sustentabilidade e conforto.',
  services: [
    { title: 'Projeto Residencial', description: 'Concepção completa de residências unifamiliares.' },
    { title: 'Design de Interiores', description: 'Otimização de espaços, mobiliário e iluminação.' },
    { title: 'Consultoria Técnica', description: 'Laudos e acompanhamento de obras.' },
  ],
  email: 'contato@studiovertex.com.br',
  whatsapp: '11987654321',
  templateId: 'consulting',
});

export const validDocument = Object.freeze({
  schemaVersion: 1,
  templateId: 'consulting',
  themeId: 'cyan-dark',
  businessName: 'Studio Arquitetura Vertex',
  title: 'Arquitetura contemporânea com identidade e precisão',
  subtitle: 'Transformamos espaços residenciais com planejamento e acompanhamento técnico.',
  description: 'Projetos arquitetônicos contemporâneos com foco em sustentabilidade e conforto.',
  services: [
    { title: 'Projeto Residencial', description: 'Concepção completa de residências unifamiliares.' },
    { title: 'Design de Interiores', description: 'Otimização de espaços, mobiliário e iluminação.' },
    { title: 'Consultoria Técnica', description: 'Laudos e acompanhamento de obras.' },
  ],
  ctaLabel: 'Solicitar proposta',
  email: 'contato@studiovertex.com.br',
  whatsapp: '5511987654321',
  city: 'São Paulo',
});

export const validInterest = Object.freeze({
  name: 'Mariana Silva',
  email: 'mariana.silva@exemplo.com.br',
  whatsapp: '(11) 98765-4321',
  journey: 'business',
  interest: 'solutions',
  message: 'Gostaria de entender a implantação da plataforma para nossa rede.',
  marketingConsent: false,
  noticeVersion: '2026-10-02',
  source: 'home-contact',
  idempotencyKey: '00000000-0000-0000-0000-000000000001',
  honeypot: '',
  captchaToken: 'valid-hcaptcha-test-token',
});

export const validProspect = Object.freeze({
  name: 'Cafeteria Grão Nobre',
  sector: 'Alimentos e Bebidas',
  city: 'Curitiba',
  website: 'https://graonobre.com.br',
  email: 'contato@graonobre.com.br',
  phone: '41999998888',
  notes: 'Visita presencial agendada para apresentação de cardápio digital.',
});
