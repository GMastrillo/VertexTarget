export type ClientStatus = "Ativo" | "Em negociação" | "Pausado";
export type ProjectStage = "Backlog" | "Design" | "Desenvolvimento" | "QA" | "Entregue";

export interface Client { id: string; name: string; initials: string; service: string; status: ClientStatus; value: string; email: string; since: string; description: string; }
export interface Project { id: string; title: string; client: string; type: string; stage: ProjectStage; priority: "Alta" | "Média" | "Baixa"; due: string; }

export const revenue = [
  { month: "Abr", value: 38400 }, { month: "Mai", value: 42600 }, { month: "Jun", value: 47800 },
  { month: "Jul", value: 51200 }, { month: "Ago", value: 58600 }, { month: "Set", value: 64200 },
];

export const transactions = [
  { id: "in_1Qp9", client: "ClinicFlow", method: "Assinatura Pro", date: "Hoje, 09:42", value: "R$ 8.400,00", status: "Pago" },
  { id: "in_1Qn2", client: "Autobelle Multimarcas", method: "Projeto Web", date: "15 Set, 14:20", value: "R$ 12.800,00", status: "Pago" },
  { id: "in_1Qm8", client: "CACCIA Energia Solar", method: "Tráfego + SEO", date: "12 Set, 11:05", value: "R$ 4.200,00", status: "Pago" },
  { id: "in_1Ql4", client: "ELON Watches", method: "E-commerce Premium", date: "08 Set, 16:38", value: "R$ 18.500,00", status: "Pago" },
  { id: "in_1Qj1", client: "Ale Rei Jet Ski", method: "Landing Page", date: "02 Set, 10:12", value: "R$ 6.800,00", status: "Pago" },
];

export const clients: Client[] = [
  { id: "clinicflow", name: "ClinicFlow", initials: "CF", service: "Automação IA + SaaS", status: "Ativo", value: "R$ 8.400/mês", email: "ops@clinicflow.com.br", since: "Março 2026", description: "Plataforma de automação inteligente para clínicas odontológicas. Retainer de produto, growth e suporte contínuo." },
  { id: "autobelle", name: "Autobelle Multimarcas", initials: "AM", service: "Sistema Web + Tráfego", status: "Ativo", value: "R$ 5.800/mês", email: "contato@autobelle.com.br", since: "Novembro 2025", description: "Catálogo automotivo com busca inteligente, simulador de financiamento e estratégia de aquisição local." },
  { id: "elon", name: "ELON Watches", initials: "EW", service: "E-commerce Premium", status: "Ativo", value: "R$ 18.500/projeto", email: "hello@elonwatches.com", since: "Janeiro 2026", description: "Ecossistema digital para intermediação de relógios de luxo, com catálogo, consignação e leads de alto valor." },
  { id: "caccia", name: "CACCIA Energia Solar", initials: "CE", service: "LP + Calculadora IA", status: "Em negociação", value: "R$ 6.200/projeto", email: "comercial@caccia.com.br", since: "Agosto 2026", description: "Nova plataforma com simulador de payback solar para agronegócio, indústria e residências de alto padrão." },
  { id: "alerei", name: "Ale Rei Jet Ski", initials: "AR", service: "Landing Page", status: "Pausado", value: "R$ 3.400/mês", email: "marketing@alerei.com.br", since: "Junho 2025", description: "Showroom náutico premium com catálogo de embarcações, filtros técnicos e concierge via WhatsApp." },
];

export const projects: Project[] = [
  { id: "p1", title: "Portal de Leads B2B", client: "CACCIA Energia Solar", type: "Next.js / IA", stage: "Backlog", priority: "Alta", due: "20 Set" },
  { id: "p2", title: "Dashboard de conversão", client: "ClinicFlow", type: "SaaS / Analytics", stage: "Design", priority: "Alta", due: "24 Set" },
  { id: "p3", title: "Catálogo de veículos 2.0", client: "Autobelle", type: "Next.js / CMS", stage: "Desenvolvimento", priority: "Média", due: "28 Set" },
  { id: "p4", title: "Checkout consignação", client: "ELON Watches", type: "E-commerce", stage: "QA", priority: "Alta", due: "18 Set" },
  { id: "p5", title: "Showroom premium", client: "Ale Rei Jet Ski", type: "WebGL / Landing", stage: "Entregue", priority: "Baixa", due: "12 Set" },
  { id: "p6", title: "Régua de reativação", client: "ClinicFlow", type: "Gemini / CRM", stage: "Desenvolvimento", priority: "Média", due: "30 Set" },
];

export const aiLogs = [
  { time: "09:42:18", automation: "Qualificação de leads", client: "ClinicFlow", model: "gemini-2.0-flash", tokens: "1.248", status: "Sucesso", latency: "842ms" },
  { time: "09:38:04", automation: "Copy para campanha", client: "CACCIA Energia Solar", model: "gemini-2.0-flash", tokens: "2.901", status: "Sucesso", latency: "1.2s" },
  { time: "09:31:47", automation: "Resumo de atendimento", client: "Autobelle", model: "gemini-2.0-flash", tokens: "876", status: "Falha", latency: "4.8s" },
  { time: "09:24:12", automation: "Segmentação preditiva", client: "ClinicFlow", model: "gemini-2.5-pro", tokens: "4.520", status: "Sucesso", latency: "2.4s" },
  { time: "09:18:55", automation: "Descrição de produto", client: "ELON Watches", model: "gemini-2.0-flash", tokens: "1.672", status: "Sucesso", latency: "696ms" },
];
