import type { SiteDemo } from './laptop-data';

export interface SandboxNichePreset {
  id: string;
  label: string;
  category: string;
  accent: string;
  headlineTemplate: (name: string) => string;
  subTemplate: (city: string) => string;
  badge: string;
  features: string[];
  defaultTemplateId: 'services' | 'commerce' | 'consulting';
}

export const SANDBOX_NICHES: SandboxNichePreset[] = [
  {
    id: 'saude',
    label: 'Saúde & Estética',
    category: 'Clínicas & Odontologia',
    accent: '#00f0ff',
    headlineTemplate: (name) => `${name} — Precisão médica e atendimento humanizado.`,
    subTemplate: (city) => `Agendamentos descomplicados e tratamentos de alta fidelidade em ${city}.`,
    badge: 'Atendimento & Tecnologia 3D',
    features: ['Agendamento WhatsApp', 'Corpo Clínico Especialista', 'Instalações Modernas'],
    defaultTemplateId: 'services',
  },
  {
    id: 'gastronomia',
    label: 'Gastronomia',
    category: 'Restaurantes & Cafés',
    accent: '#ff4d4d',
    headlineTemplate: (name) => `${name} — Experiência gastronômica e sabor autêntico.`,
    subTemplate: (city) => `Cardápio digital 1-Click e reservas imediatas sem taxas abusivas em ${city}.`,
    badge: 'Cardápio Digital Direto',
    features: ['Cardápio Interativo', 'Pedidos sem Taxa', 'Ingredientes Selecionados'],
    defaultTemplateId: 'commerce',
  },
  {
    id: 'servicos',
    label: 'Serviços Locais',
    category: 'Barbearias, Salões & Oficinas',
    accent: '#ff9900',
    headlineTemplate: (name) => `${name} — O padrão de qualidade que você procura.`,
    subTemplate: (city) => `Atendimento com hora marcada e sem filas de espera em ${city}.`,
    badge: 'Agendamento Sem Fila',
    features: ['Reserva pelo WhatsApp', 'Profissionais Certificados', 'Garantia de Satisfação'],
    defaultTemplateId: 'services',
  },
  {
    id: 'b2b',
    label: 'Consultoria & B2B',
    category: 'Advocacia, Finanças & Negócios',
    accent: '#818cf8',
    headlineTemplate: (name) => `${name} — Estratégia, conformidade e crescimento empresarial.`,
    subTemplate: (city) => `Assessoria consultiva personalizada para líderes e organizações em ${city}.`,
    badge: 'Inteligência Estratégica',
    features: ['Diagnóstico Corporativo', 'Governança & Compliance', 'Resultados Mensuráveis'],
    defaultTemplateId: 'consulting',
  },
  {
    id: 'automotivo',
    label: 'Automotivo',
    category: 'Detailing, Blindados & Vendas',
    accent: '#00e676',
    headlineTemplate: (name) => `${name} — Proteção estética e alta performance.`,
    subTemplate: (city) => `Detalhamento premium, vitrificação e laudo pericial técnico em ${city}.`,
    badge: 'Padrão de Concessionária',
    features: ['Vitrificação & PPF', 'Laudo Técnico 100%', 'Garantia Exclusiva'],
    defaultTemplateId: 'services',
  },
  {
    id: 'solar',
    label: 'Energia & Engenharia',
    category: 'Solar & Sustentabilidade',
    accent: '#ffb300',
    headlineTemplate: (name) => `${name} — Reduza seus custos com energia limpa e inteligente.`,
    subTemplate: (city) => `Projetos homologados e monitoramento em tempo real para imóveis em ${city}.`,
    badge: 'Economia Comprovada',
    features: ['Garantia de 25 Anos', 'Homologação Rápida', 'Zero Burocracia'],
    defaultTemplateId: 'consulting',
  },
];

export function generateCustomSiteDemo(
  businessName: string,
  nicheId: string,
  city: string
): SiteDemo {
  const cleanName = businessName.trim() || 'Sua Marca Aqui';
  const cleanCity = city.trim() || 'Sua Cidade, BR';
  const niche = SANDBOX_NICHES.find((n) => n.id === nicheId) || SANDBOX_NICHES[0];

  return {
    id: 'custom-sandbox',
    name: cleanName,
    niche: niche.category,
    category: niche.label,
    headline: niche.headlineTemplate(cleanName),
    sub: niche.subTemplate(cleanCity),
    badge: niche.badge,
    rating: '5.0',
    reviews: 'Novo Lançamento',
    city: cleanCity,
    accent: niche.accent,
    features: niche.features,
  };
}
