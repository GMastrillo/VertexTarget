export interface SiteDemo {
  id: string;
  name: string;
  niche: string;
  category: string;
  headline: string;
  sub: string;
  badge: string;
  rating: string;
  reviews: string;
  city: string;
  accent: string;
  features: string[];
}

export const DEMO_SITES: SiteDemo[] = [
  {
    id: "barbearia",
    name: "Navalha & Honra",
    niche: "Barbearia Clássica",
    category: "Estética Masculina",
    headline: "O corte e o cuidado que você merece.",
    sub: "Barba na toalha quente, chopp gelado e agendamento sem fila pelo WhatsApp.",
    badge: "Agendamento Inteligente",
    rating: "4.9",
    reviews: "187 avaliações",
    city: "São Paulo, SP",
    accent: "#ff9900",
    features: ["Corte degradê", "Barboterapia", "Chopp artesanal"],
  },
  {
    id: "clinica",
    name: "Clínica Lumina Oral",
    niche: "Odontologia & Estética",
    category: "Saúde & Bem-Estar",
    headline: "Sorrisos que transformam vidas e negócios.",
    sub: "Implantes, alinhadores invisíveis e estética orofacial com tecnologia 3D.",
    badge: "Tecnologia 3D Guiada",
    rating: "5.0",
    reviews: "246 avaliações",
    city: "Campinas, SP",
    accent: "#00f0ff",
    features: ["Alinhadores invisíveis", "Scanner intraoral 3D", "Implante guiado"],
  },
  {
    id: "pizzaria",
    name: "Forneria Napoletana",
    niche: "Pizzaria Artesanal",
    category: "Gastronomia",
    headline: "Fermentação natural de 48h assada a 450°C.",
    sub: "Cardápio interativo e pedidos instantâneos no balcão ou WhatsApp sem taxa abusiva de app.",
    badge: "Cardápio 1-Click",
    rating: "4.8",
    reviews: "320 avaliações",
    city: "Curitiba, PR",
    accent: "#ff4d4d",
    features: ["Farinha Caputo 00", "Forno a lenha", "Delivery direto"],
  },
  {
    id: "automotivo",
    name: "Apex Motors",
    niche: "Estética & Blindados",
    category: "Automotivo Premium",
    headline: "Proteção cerâmica e detalhamento de alto padrão.",
    sub: "PPF regenerativo, vitrificação 9H e laudo pericial detalhado para supercarros.",
    badge: "Laudo Pericial 100%",
    rating: "5.0",
    reviews: "112 avaliações",
    city: "Balneário Camboriú, SC",
    accent: "#00e676",
    features: ["PPF regenerativo", "Vitrificação 9H", "Higienização ozônio"],
  },
  {
    id: "solar",
    name: "Caccia Solar Energy",
    niche: "Energia Solar Fotovoltaica",
    category: "Engenharia & CleanTech",
    headline: "Reduza até 95% da conta de energia da sua empresa.",
    sub: "Projetos homologados com financiamento facilitado e monitoramento em tempo real.",
    badge: "Economia Comprovada",
    rating: "4.9",
    reviews: "94 avaliações",
    city: "Ribeirão Preto, SP",
    accent: "#ffb300",
    features: ["Garantia 25 anos", "App de geração", "Zero burocracia"],
  },
];
