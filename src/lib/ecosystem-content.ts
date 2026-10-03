import { FREE_LIMITS } from './os/policy.ts';

export interface EcosystemNavItem {
  label: string;
  href: string;
}

export interface EcosystemArea {
  id: string;
  title: string;
  category: 'execucao' | 'ferramenta' | 'conhecimento' | 'conexoes';
  status: 'available' | 'preparing';
  description: string;
  href: string;
}

export const ECOSYSTEM_NAV: EcosystemNavItem[] = [
  { label: 'Ecossistema', href: '/#ecossistema' },
  { label: 'Vertex OS', href: '/plataforma' },
  { label: 'Portfólio & Cases', href: '/cases' },
  { label: 'Criar Conta Gratuita', href: '/os/cadastro' },
  { label: 'Entrar no OS', href: '/os/entrar' },
];

export const ECOSYSTEM_AREAS: EcosystemArea[] = [
  {
    id: 'vertex-studio',
    title: 'Vertex Target Studio',
    category: 'execucao',
    status: 'available',
    description:
      'Engenharia de front-end criativo e desenvolvimento sob medida de landing pages de alta conversão, nível Awwwards.',
    href: '/#contato',
  },
  {
    id: 'vertex-os',
    title: 'Vertex OS',
    category: 'ferramenta',
    status: 'available',
    description:
      'Plataforma completa para autônomos, empresas e prestadores criarem sites profissionais e gerenciarem prospecção ativa.',
    href: '/os/cadastro',
  },
  {
    id: 'education',
    title: 'Vertex Academy',
    category: 'conhecimento',
    status: 'preparing',
    description:
      'Formação técnica e metodologias práticas de vendas para desenvolvedores e agências digitais.',
    href: '/#ecossistema',
  },
  {
    id: 'community',
    title: 'Vertex Network',
    category: 'conexoes',
    status: 'preparing',
    description:
      'Comunidade exclusiva de networking, indicações de projetos e parcerias estratégicas no mercado nacional.',
    href: '/#ecossistema',
  },
];

export const ECOSYSTEM_FREE_TIER_FEATURES = {
  maxWorkspaces: FREE_LIMITS.maxWorkspaces,
  maxProjects: FREE_LIMITS.maxProjects,
  maxPublishedSites: FREE_LIMITS.maxPublishedSites,
  monthlyCopyLimit: FREE_LIMITS.monthlyCopyLimit,
  monthlySearchLimit: FREE_LIMITS.monthlySearchLimit,
  maxProspects: FREE_LIMITS.maxProspects,
};

export const ECOSYSTEM_JOURNEYS = {
  business: {
    title: 'Para Empresas e Negócios Locais',
    subtitle: 'Presença digital com credibilidade e captação direta de clientes',
    description:
      'Crie a página oficial do seu negócio em minutos com templates otimizados para conversão, integração direta com WhatsApp e hospedagem pública segura.',
    cta: 'Criar Site do Meu Negócio',
    href: '/os/cadastro?journey=business',
  },
  professional: {
    title: 'Para Desenvolvedores, Designers e Prestadores',
    subtitle: 'Ferramenta completa para prospectar e entregar sites para terceiros',
    description:
      'Utilize o pipeline de vendas do Vertex OS para organizar até 50 clientes locais, gerar rascunhos com copywriting inteligente e acelerar suas entregas comerciais.',
    cta: 'Começar como Prestador',
    href: '/os/cadastro?journey=professional',
  },
};
