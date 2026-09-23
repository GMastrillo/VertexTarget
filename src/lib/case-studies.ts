import type { Locale } from "./i18n";

export interface StudyLayer {
  title: string;
  items: string[];
}

export interface StudyChallenge {
  problem: string;
  solution: string;
}

export interface CaseStudyContent {
  summary: string;
  layers: StudyLayer[];
  features: string[];
  challenges: StudyChallenge[];
  results: string[];
}

type StudyByLocale = Partial<Record<Locale, CaseStudyContent>> & {
  pt: CaseStudyContent;
};

/**
 * Architecture studies for /cases/[slug].
 * elon-watches ships fully translated (pt/en/es/fr/it);
 * other cases ship pt + en — the page falls back to `pt` for the rest.
 */
export const CASE_STUDIES: Record<string, StudyByLocale> = {
  "elon-watches": {
    pt: {
      summary:
        "Plataforma digital para o maior ecossistema de intermediação de relógios de luxo do Brasil. O desafio não era vender relógios — era traduzir confiança, autenticidade e exclusividade em uma experiência web que sustentasse negócios de cinco a sete dígitos por transação.",
      layers: [
        {
          title: "Frontend & Experiência Premium",
          items: [
            "Next.js (App Router) com renderização híbrida: páginas de catálogo estáticas para SEO, jornada de compra dinâmica",
            "Design system de luxo: tipografia serifada em pesos editoriais, paleta neutra com acentos dourados, microinterações contidas",
            "Otimização de imagens de peças com prioridade de carregamento por relevância no viewport",
          ],
        },
        {
          title: "Catálogo & Inventário",
          items: [
            "Catálogo de +1.000 peças organizado por marca (Rolex, Patek Philippe, Audemars Piguet), referência e condição",
            "Páginas de detalhe com ficha técnica completa, proveniência e fotos de alta resolução",
            "Curadoria de coleções em destaque para estações e campanhas",
          ],
        },
        {
          title: "Consignação & Relacionamento",
          items: [
            "Fluxo de consignação: captação de peças, avaliação e publicação assistida",
            "Captura de leads de alto valor com roteamento direto para atendimento humano (WhatsApp concierge)",
            "Zero checkout automatizado intencional: cada transação tem curadoria humana — o site qualifica, o especialista fecha",
          ],
        },
        {
          title: "Infraestrutura & Performance",
          items: [
            "Deploy na Vercel Edge Network com cache granular por tipo de página",
            "SEO técnico: dados estruturados de produto, sitemap dinâmico e metadata por peça",
            "Core Web Vitals monitorados — LCP priorizado nas páginas de entrada",
          ],
        },
      ],
      features: [
        "Catálogo premium com +1.000 peças autenticadas",
        "Filtros por marca, referência e faixa de valor",
        "Fluxo completo de consignação assistida",
        "Concierge humano integrado ao WhatsApp",
        "Curadoria editorial de coleções",
        "SEO técnico orientado a peças específicas (busca de nicho)",
      ],
      challenges: [
        {
          problem:
            "Mercado de luxo sobrevive de confiança — mas sites de revenda raramente transmitem autenticidade real.",
          solution:
            "Prova social em cada camada: fotografias reais das peças, fichas técnicas completas e narrativa de proveniência — nada de fotos de banco de imagens.",
        },
        {
          problem:
            "Catálogo de alto valor precisa ranquear em buscas de nicho extremamente competitivas (\"Rolex Submariner preço\").",
          solution:
            "Arquitetura orientada a SEO de long-tail: página indexável por referência, dados estruturados de produto e conteúdo editorial de curadoria.",
        },
        {
          problem:
            "Transações de cinco a sete dígitos não podem fluir por um checkout genérico.",
          solution:
            "Decisão de produto deliberada: o site qualifica e roteia leads de alto valor direto para atendimento humano especializado via WhatsApp.",
        },
      ],
      results: [
        "Maior ecossistema de intermediação de relógios de luxo do Brasil",
        "+1.000 peças autenticadas em catálogo contínuo",
        "Pipeline de leads high-value com qualificação automatizada",
        "Presença digital à altura de marcas de cinco a sete dígitos",
      ],
    },
    en: {
      summary:
        "Digital platform for Brazil's largest luxury watch brokerage ecosystem. The challenge was never selling watches — it was translating trust, authenticity and exclusivity into a web experience that supports five-to-seven-figure deals per transaction.",
      layers: [
        {
          title: "Frontend & Premium Experience",
          items: [
            "Next.js (App Router) with hybrid rendering: static catalog pages for SEO, dynamic purchase journey",
            "Luxury design system: editorial serif typography, neutral palette with gold accents, restrained microinteractions",
            "Piece imagery optimized with viewport-relevance loading priority",
          ],
        },
        {
          title: "Catalog & Inventory",
          items: [
            "1,000+ piece catalog organized by brand (Rolex, Patek Philippe, Audemars Piguet), reference and condition",
            "Detail pages with complete tech specs, provenance and high-resolution photography",
            "Featured collection curation for seasons and campaigns",
          ],
        },
        {
          title: "Consignment & Relationships",
          items: [
            "Consignment flow: piece intake, valuation and assisted publishing",
            "High-value lead capture with direct routing to human concierge (WhatsApp)",
            "Intentionally no automated checkout: every deal is human-curated — the site qualifies, the specialist closes",
          ],
        },
        {
          title: "Infrastructure & Performance",
          items: [
            "Deployed on Vercel Edge Network with granular per-page caching",
            "Technical SEO: product structured data, dynamic sitemap, per-piece metadata",
            "Core Web Vitals monitored — LCP prioritized on entry pages",
          ],
        },
      ],
      features: [
        "Premium catalog with 1,000+ authenticated pieces",
        "Filters by brand, reference and value range",
        "Complete assisted consignment flow",
        "Human concierge integrated with WhatsApp",
        "Editorial collection curation",
        "Technical SEO targeting niche, specific searches",
      ],
      challenges: [
        {
          problem:
            "The luxury market runs on trust — yet resale sites rarely convey real authenticity.",
          solution:
            "Social proof in every layer: real photography of the pieces, complete spec sheets and provenance narrative — zero stock imagery.",
        },
        {
          problem:
            "A high-value catalog must rank in extremely competitive niche searches (\"Rolex Submariner price\").",
          solution:
            "Long-tail SEO architecture: indexable page per reference, product structured data and editorial curation content.",
        },
        {
          problem:
            "Five-to-seven-figure transactions cannot flow through a generic checkout.",
          solution:
            "Deliberate product decision: the site qualifies and routes high-value leads straight to specialized human service via WhatsApp.",
        },
      ],
      results: [
        "Brazil's largest luxury watch brokerage ecosystem",
        "1,000+ authenticated pieces in a continuous catalog",
        "High-value lead pipeline with automated qualification",
        "Digital presence matching five-to-seven-figure brands",
      ],
    },
    es: {
      summary:
        "Plataforma digital para el mayor ecosistema de intermediación de relojes de lujo de Brasil. El desafío no era vender relojes — era traducir confianza, autenticidad y exclusividad en una experiencia web que soporta negocios de cinco a siete dígitos por transacción.",
      layers: [
        {
          title: "Frontend & Experiencia Premium",
          items: [
            "Next.js (App Router) con renderización híbrida: catálogo estático para SEO, jornada de compra dinámica",
            "Design system de lujo: tipografía editorial, paleta neutra con acentos dorados, microinteracciones contenidas",
            "Optimización de imágenes de piezas con prioridad por relevancia en el viewport",
          ],
        },
        {
          title: "Catálogo & Inventario",
          items: [
            "Catálogo de +1.000 piezas organizado por marca (Rolex, Patek Philippe, Audemars Piguet), referencia y condición",
            "Páginas de detalle con ficha técnica completa, procedencia y fotos de alta resolución",
            "Curaduría de colecciones destacadas para temporadas y campañas",
          ],
        },
        {
          title: "Consignación & Relacionamiento",
          items: [
            "Flujo de consignación: captación de piezas, valuación y publicación asistida",
            "Captura de leads de alto valor con enrutamiento directo a atención humana (WhatsApp concierge)",
            "Sin checkout automatizado a propósito: cada transacción tiene curaduría humana — el sitio califica, el especialista cierra",
          ],
        },
        {
          title: "Infraestructura & Performance",
          items: [
            "Deploy en Vercel Edge Network con cache granular por tipo de página",
            "SEO técnico: datos estructurados de producto, sitemap dinámico y metadata por pieza",
            "Core Web Vitals monitoreados — LCP priorizado en páginas de entrada",
          ],
        },
      ],
      features: [
        "Catálogo premium con +1.000 piezas autenticadas",
        "Filtros por marca, referencia y rango de valor",
        "Flujo completo de consignación asistida",
        "Concierge humano integrado al WhatsApp",
        "Curaduría editorial de colecciones",
        "SEO técnico orientado a piezas específicas",
      ],
      challenges: [
        {
          problem:
            "El mercado de lujo sobrevive de confianza — pero los sitios de reventa rara vez transmiten autenticidad real.",
          solution:
            "Prueba social en cada capa: fotografías reales de las piezas, fichas técnicas completas y narrativa de procedencia — cero fotos de stock.",
        },
        {
          problem:
            "Un catálogo de alto valor necesita posicionar en búsquedas de nicho extremamente competitivas.",
          solution:
            "Arquitectura SEO de long-tail: página indexable por referencia, datos estructurados de producto y contenido editorial de curaduría.",
        },
        {
          problem:
            "Transacciones de cinco a siete dígitos no pueden fluir por un checkout genérico.",
          solution:
            "Decisión de producto deliberada: el sitio califica y enruta leads de alto valor directo al servicio humano especializado vía WhatsApp.",
        },
      ],
      results: [
        "El mayor ecosistema de intermediación de relojes de lujo de Brasil",
        "+1.000 piezas autenticadas en catálogo continuo",
        "Pipeline de leads high-value con calificación automatizada",
        "Presencia digital a la altura de marcas de cinco a siete dígitos",
      ],
    },
    fr: {
      summary:
        "Plateforme digitale pour le plus grand écosystème de courtage de montres de luxe du Brésil. Le défi n'était pas de vendre des montres — mais de traduire confiance, authenticité et exclusivité dans une expérience web capable de porter des transactions à cinq ou sept chiffres.",
      layers: [
        {
          title: "Frontend & Expérience Premium",
          items: [
            "Next.js (App Router) avec rendu hybride : catalogue statique pour le SEO, parcours d'achat dynamique",
            "Design system de luxe : typographie éditoriale, palette neutre à accents dorés, micro-interactions contenues",
            "Optimisation des visuels de pièces avec priorité de chargement par pertinence dans le viewport",
          ],
        },
        {
          title: "Catalogue & Inventaire",
          items: [
            "Catalogue de +1 000 pièces organisé par marque (Rolex, Patek Philippe, Audemars Piguet), référence et état",
            "Pages de détail avec fiche technique complète, provenance et photos haute résolution",
            "Curation de collections en vedette pour les saisons et campagnes",
          ],
        },
        {
          title: "Dépôt-Vente & Relation Client",
          items: [
            "Flux de dépôt-vente : prise en charge des pièces, expertise et publication assistée",
            "Capture de leads à haute valeur avec routage direct vers un service humain (conciergerie WhatsApp)",
            "Pas de checkout automatisé volontairement : chaque transaction est curée par un humain — le site qualifie, le spécialiste conclut",
          ],
        },
        {
          title: "Infrastructure & Performance",
          items: [
            "Déploiement sur Vercel Edge Network avec cache granulaire par type de page",
            "SEO technique : données structurées produit, sitemap dynamique et métadonnées par pièce",
            "Core Web Vitals surveillés — LCP priorisé sur les pages d'entrée",
          ],
        },
      ],
      features: [
        "Catalogue premium de +1 000 pièces authentifiées",
        "Filtres par marque, référence et gamme de valeur",
        "Flux complet de dépôt-vente assisté",
        "Conciergerie humaine intégrée à WhatsApp",
        "Curation éditoriale de collections",
        "SEO technique orienté pièces spécifiques",
      ],
      challenges: [
        {
          problem:
            "Le marché du luxe survit grâce à la confiance — mais les sites de revente transmettent rarement une authenticité réelle.",
          solution:
            "Preuve sociale à chaque couche : photographies réelles des pièces, fiches techniques complètes et récit de provenance — zéro image de banque d'images.",
        },
        {
          problem:
            "Un catalogue à haute valeur doit se positionner sur des recherches de niche extrêmement concurrentielles.",
          solution:
            "Architecture SEO long-tail : page indexable par référence, données structurées produit et contenu éditorial de curation.",
        },
        {
          problem:
            "Des transactions à cinq ou sept chiffres ne peuvent pas passer par un checkout générique.",
          solution:
            "Décision produit délibérée : le site qualifie et route les leads à haute valeur directement vers un service humain spécialisé via WhatsApp.",
        },
      ],
      results: [
        "Le plus grand écosystème de courtage de montres de luxe du Brésil",
        "+1 000 pièces authentifiées en catalogue continu",
        "Pipeline de leads haute valeur avec qualification automatisée",
        "Présence digitale à la hauteur de marques à cinq ou sept chiffres",
      ],
    },
    it: {
      summary:
        "Piattaforma digitale per il più grande ecosistema di intermediazione di orologi di lusso del Brasile. La sfida non era vendere orologi — era tradurre fiducia, autenticità ed esclusività in un'esperienza web che sostiene affari da cinque a sette cifre per transazione.",
      layers: [
        {
          title: "Frontend & Esperienza Premium",
          items: [
            "Next.js (App Router) con rendering ibrido: catalogo statico per il SEO, percorso d'acquisto dinamico",
            "Design system di lusso: tipografia editoriale, palette neutra con accenti dorati, microinterazioni contenute",
            "Ottimizzazione delle immagini dei pezzi con priorità di caricamento per rilevanza nel viewport",
          ],
        },
        {
          title: "Catalogo & Inventario",
          items: [
            "Catalogo di oltre 1.000 pezzi organizzato per marca (Rolex, Patek Philippe, Audemars Piguet), riferimento e condizione",
            "Pagine di dettaglio con scheda tecnica completa, provenienza e foto ad alta risoluzione",
            "Cura delle collezioni in evidenza per stagioni e campagne",
          ],
        },
        {
          title: "Consignment & Relazione",
          items: [
            "Flusso di consignment: acquisizione dei pezzi, valutazione e pubblicazione assistita",
            "Acquisizione di lead ad alto valore con instradamento diretto all'assistenza umana (concierge WhatsApp)",
            "Nessun checkout automatizzato per scelta: ogni transazione è curata da una persona — il sito qualifica, lo specialista chiude",
          ],
        },
        {
          title: "Infrastruttura & Performance",
          items: [
            "Deploy su Vercel Edge Network con cache granulare per tipo di pagina",
            "SEO tecnico: dati strutturati di prodotto, sitemap dinamico e metadata per pezzo",
            "Core Web Vitals monitorati — LCP prioritizzato nelle pagine di ingresso",
          ],
        },
      ],
      features: [
        "Catalogo premium con oltre 1.000 pezzi autenticati",
        "Filtri per marca, riferimento e fascia di valore",
        "Flusso completo di consignment assistito",
        "Concierge umano integrato con WhatsApp",
        "Cura editoriale delle collezioni",
        "SEO tecnico orientato ai pezzi specifici",
      ],
      challenges: [
        {
          problem:
            "Il mercato del lusso vive di fiducia — ma i siti di rivendita raramente trasmettono autenticità reale.",
          solution:
            "Prova sociale in ogni livello: fotografie reali dei pezzi, schede tecniche complete e narrativa di provenienza — zero foto stock.",
        },
        {
          problem:
            "Un catalogo di alto valore deve posizionarsi su ricerche di nicchia estremamente competitive.",
          solution:
            "Architettura SEO long-tail: pagina indicizzabile per riferimento, dati strutturati di prodotto e contenuti editoriali di cura.",
        },
        {
          problem:
            "Transazioni da cinque a sette cifre non possono passare da un checkout generico.",
          solution:
            "Decisione di prodotto deliberata: il sito qualifica e instrada i lead di alto valore direttamente all'assistenza umana specializzata via WhatsApp.",
        },
      ],
      results: [
        "Il più grande ecosistema di intermediazione di orologi di lusso del Brasile",
        "Oltre 1.000 pezzi autenticati in catalogo continuo",
        "Pipeline di lead high-value con qualifica automatizzata",
        "Presenza digitale all'altezza di marchi da cinque a sette cifre",
      ],
    },
  },

  clinicflow: {
    pt: {
      summary:
        "SaaS de automação inteligente para clínicas odontológicas e de saúde. Construída para máxima conversão e retenção: autenticação por senha e Magic Link, réguas de comunicação preditiva, agendamento automatizado e painel analítico com troca dinâmica de tema.",
      layers: [
        {
          title: "Frontend & Painel",
          items: [
            "Next.js + TailwindCSS com painel administrativo responsivo",
            "Troca dinâmica de tema (multi-theme) por clínica",
            "Dashboard analítico com indicadores de retenção e agenda",
          ],
        },
        {
          title: "Automação & Comunicação",
          items: [
            "Réguas de comunicação preditiva: lembretes, follow-ups e reativação de pacientes",
            "Agendamento automatizado 24/7 integrado à rotina da recepção",
            "Autenticação por senha e Magic Link (login sem fricção para pacientes)",
          ],
        },
        {
          title: "Infraestrutura",
          items: [
            "Deploy contínuo na Vercel com preview environments por feature",
            "Automação CRM com auditoria de cada interação",
          ],
        },
      ],
      features: [
        "Agendamento automatizado 24/7",
        "Réguas de comunicação preditiva",
        "Magic Link + senha para zero fricção",
        "Painel analítico multi-theme",
        "Automação CRM com auditoria",
      ],
      challenges: [
        {
          problem:
            "Clínicas perdem pacientes por falha de follow-up — ninguém tem tempo de operar réguas manuais.",
          solution:
            "Motor de comunicação preditiva que dispara a mensagem certa no momento certo, sem intervenção humana.",
        },
        {
          problem:
            "Pacientes abandonam agendamento quando precisam criar senha e confirmar e-mail.",
          solution:
            "Magic Link como caminho primário: um clique no e-mail, sessão ativa, agendamento concluído.",
        },
      ],
      results: [
        "Retenção de pacientes em elevação perceptível",
        "Operação de agenda automatizada 24/7",
        "Clareza gerencial via painel analítico",
      ],
    },
    en: {
      summary:
        "SaaS for intelligent automation in dental and healthcare clinics. Built for maximum conversion and retention: password + Magic Link auth, predictive communication flows, automated scheduling and an analytics dashboard with dynamic theme switching.",
      layers: [
        {
          title: "Frontend & Dashboard",
          items: [
            "Next.js + TailwindCSS with a responsive admin panel",
            "Per-clinic dynamic theme switching (multi-theme)",
            "Analytics dashboard with retention and scheduling indicators",
          ],
        },
        {
          title: "Automation & Communication",
          items: [
            "Predictive communication flows: reminders, follow-ups and patient reactivation",
            "24/7 automated scheduling integrated with front-desk routine",
            "Password + Magic Link authentication (frictionless patient login)",
          ],
        },
        {
          title: "Infrastructure",
          items: [
            "Continuous deploy on Vercel with per-feature preview environments",
            "CRM automation with a full audit trail of each interaction",
          ],
        },
      ],
      features: [
        "24/7 automated scheduling",
        "Predictive communication flows",
        "Magic Link + password for zero friction",
        "Multi-theme analytics dashboard",
        "CRM automation with auditing",
      ],
      challenges: [
        {
          problem:
            "Clinics lose patients to missed follow-ups — nobody has time to run manual flows.",
          solution:
            "A predictive communication engine fires the right message at the right moment, no human intervention needed.",
        },
        {
          problem:
            "Patients abandon scheduling when forced to create accounts and confirm emails.",
          solution:
            "Magic Link as the primary path: one tap in the email, active session, booking completed.",
        },
      ],
      results: [
        "Noticeable lift in patient retention",
        "24/7 automated scheduling operation",
        "Managerial clarity via the analytics dashboard",
      ],
    },
  },

  "cliente-absoluto": {
    pt: {
      summary:
        "Infraestrutura digital que unifica duas potências regionais no Oeste do PR: Absoluto (CFTV IP 4K com reconhecimento facial, LPR e alarmes monitorados) e Lucena Refrigeração (VRF, Chillers e laudo PMOC ANVISA). Inclui calculadora técnica de dimensionamento em tempo real.",
      layers: [
        {
          title: "Frontend Institucional",
          items: [
            "Next.js + TailwindCSS com arquitetura de duas marcas em um só domínio",
            "Páginas de serviço com especificação técnica detalhada (CFTV, alarmes, VRF)",
            "Identidade visual dual com navegação unificada",
          ],
        },
        {
          title: "Calculadora Técnica",
          items: [
            "Dimensionamento de climatização em tempo real (BTUs por ambiente)",
            "Regras de engenharia VRF embutidas no frontend com validação",
            "Resultado orientado a orçamento: cálculo gera lead contextual",
          ],
        },
        {
          title: "Conformidade & Confiança",
          items: [
            "Laudo PMOC ANVISA (Lei 13.589/18) como ativo de credibilidade",
            "Registros profissionais (CREA-PR) em evidência nas páginas técnicas",
          ],
        },
      ],
      features: [
        "Calculadora técnica de BTUs em tempo real",
        "Duas marcas, um domínio, navegação unificada",
        "Vitrine de conformidade regulatória (PMOC/ANVISA)",
        "Catálogo de serviços técnicos especializados",
      ],
      challenges: [
        {
          problem:
            "Serviços técnicos (CFTV, climatização) sofrem com orçamentos vagos que geram leads desqualificados.",
          solution:
            "A calculadora de dimensionamento qualifica o cliente no momento do interesse: o lead já chega com o escopo dimensionado.",
        },
        {
          problem:
            "Unir duas empresas com identidades distintas sem diluir a força de cada uma.",
          solution:
            "Arquitetura de marca dual: seções autônomas com design system compartilhado e navegação integrada.",
        },
      ],
      results: [
        "+15.000k BTUs instalados documentados",
        "99.9% de disponibilidade dos sistemas monitorados",
        "+450 sensores ativos sob gestão",
        "Leads técnicos pré-qualificados pela calculadora",
      ],
    },
    en: {
      summary:
        "Digital infrastructure uniting two regional powerhouses in western Paraná: Absoluto (4K IP CCTV with facial recognition, LPR and monitored alarms) and Lucena Refrigeração (VRF, Chillers and PMOC ANVISA compliance). Includes a real-time technical sizing calculator.",
      layers: [
        {
          title: "Institutional Frontend",
          items: [
            "Next.js + TailwindCSS with a two-brands-one-domain architecture",
            "Service pages with detailed technical specification (CCTV, alarms, VRF)",
            "Dual brand identity with unified navigation",
          ],
        },
        {
          title: "Technical Calculator",
          items: [
            "Real-time climate sizing (BTUs per room)",
            "VRF engineering rules embedded in the frontend with validation",
            "Budget-oriented output: the calculation generates a contextual lead",
          ],
        },
        {
          title: "Compliance & Trust",
          items: [
            "PMOC ANVISA compliance (Law 13.589/18) as a credibility asset",
            "Professional credentials (CREA-PR) featured on technical pages",
          ],
        },
      ],
      features: [
        "Real-time BTU technical calculator",
        "Two brands, one domain, unified navigation",
        "Regulatory compliance showcase (PMOC/ANVISA)",
        "Specialized technical services catalog",
      ],
      challenges: [
        {
          problem:
            "Technical services (CCTV, climate) suffer from vague quotes that generate unqualified leads.",
          solution:
            "The sizing calculator qualifies the customer at the moment of interest: the lead arrives with scoped requirements.",
        },
        {
          problem:
            "Merging two companies with distinct identities without diluting either brand.",
          solution:
            "Dual-brand architecture: autonomous sections sharing a design system and integrated navigation.",
        },
      ],
      results: [
        "15,000k+ BTUs installed documented",
        "99.9% uptime of monitored systems",
        "450+ active sensors under management",
        "Pre-qualified technical leads via the calculator",
      ],
    },
  },

  "jetski-gold": {
    pt: {
      summary:
        "Plataforma digital de luxo para a maior referência em compra, venda e centro técnico de embarcações (Sea-Doo, Yamaha WaveRunner, Kawasaki) e linha off-road (Can-Am Maverick) no ABC Paulista.",
      layers: [
        {
          title: "Showroom Digital",
          items: [
            "Catálogo com filtros por cavalaria (+300 HP), marca e categoria",
            "Fichas de embarcações com especificações completas e galeria",
            "Seção de periciados com garantia e certificação",
          ],
        },
        {
          title: "Concierge & Conversão",
          items: [
            "WhatsApp concierge integrado em cada veículo do catálogo",
            "Boutique de som náutico como linha de receita adicional",
            "Jornada de compra premium sem fricção de formulários",
          ],
        },
        {
          title: "Reputação & Prova Social",
          items: [
            "Integração de avaliações Google (5.0★, +180 reviews)",
            "Selos de inspeção 100% e estoque Zero Km & seminovos",
          ],
        },
      ],
      features: [
        "Catálogo filtrável por cavalaria (+300 HP)",
        "Periciados com garantia documentada",
        "Boutique de som náutico",
        "Concierge WhatsApp por embarcação",
        "Prova social Google 5.0★ integrada",
      ],
      challenges: [
        {
          problem:
            "Produtos de luxo precisam de apresentação à altura — fotos amadoras matam negócios de alto valor.",
          solution:
            "Padrão editorial de fotos e layout de showroom com hierarquia de informações técnica e emocional.",
        },
        {
          problem:
            "Compradores de embarcações têm dúvidas altamente específicas que formulários genéricos não capturam.",
          solution:
            "Concierge WhatsApp contextual por veículo: a conversa começa com o contexto do anúncio já carregado.",
        },
      ],
      results: [
        "5.0★ no Google com +180 avaliações",
        "100% do estoque inspecionado e documentado",
        "Leads qualificados direto no WhatsApp do time",
      ],
    },
    en: {
      summary:
        "Luxury digital platform for the leading reference in buying, selling and technical service of watercraft (Sea-Doo, Yamaha WaveRunner, Kawasaki) and the off-road line (Can-Am Maverick) in ABC Paulista.",
      layers: [
        {
          title: "Digital Showroom",
          items: [
            "Catalog with horsepower filters (+300 HP), brand and category",
            "Vehicle spec sheets with complete specifications and gallery",
            "Certified pre-owned section with documented warranty",
          ],
        },
        {
          title: "Concierge & Conversion",
          items: [
            "WhatsApp concierge integrated on every catalog vehicle",
            "Nautical audio boutique as an additional revenue line",
            "Premium purchase journey with zero form friction",
          ],
        },
        {
          title: "Reputation & Social Proof",
          items: [
            "Google reviews integration (5.0★, 180+ reviews)",
            "100% inspected badges and New & Pre-Owned stock tiers",
          ],
        },
      ],
      features: [
        "Horsepower-filterable catalog (+300 HP)",
        "Certified pre-owned with documented warranty",
        "Nautical audio boutique",
        "Per-vehicle WhatsApp concierge",
        "Integrated 5.0★ Google social proof",
      ],
      challenges: [
        {
          problem:
            "Luxury products demand presentation — amateur photos kill high-value deals.",
          solution:
            "Editorial photo standards and showroom layout balancing technical and emotional hierarchy.",
        },
        {
          problem:
            "Watercraft buyers have highly specific questions that generic forms can't capture.",
          solution:
            "Contextual WhatsApp concierge per vehicle: the conversation starts with the listing context pre-loaded.",
        },
      ],
      results: [
        "5.0★ on Google with 180+ reviews",
        "100% of stock inspected and documented",
        "Qualified leads straight to the team's WhatsApp",
      ],
    },
  },

  "autobelle-multimarcas": {
    pt: {
      summary:
        "Ambiente digital moderno para conceituada loja multimarcas com mais de 20 anos de história em Perus/SP: catálogo em tempo real, busca inteligente e simulador de parcelamento com credibilidade de laudo cautelar 100% periciado.",
      layers: [
        {
          title: "Catálogo Dinâmico",
          items: [
            "Estoque em tempo real com busca por modelo e categoria (SUVs, Sedans, Hatchs, Picapes)",
            "Páginas de veículo com ficha completa e galeria profissional",
            "Simulador de parcelamento embutido em cada anúncio",
          ],
        },
        {
          title: "Confiança & Procedência",
          items: [
            "Laudo cautelar Dekra 100% em evidência",
            "Narrativa de 20+ anos de tradição como ativo de marca",
            "Avaliações Google (4.6★, 230+) integradas",
          ],
        },
        {
          title: "Captação Local",
          items: [
            "SEO local orientado a buscas de região + modelo",
            "Lead gen direto para o time de vendas",
          ],
        },
      ],
      features: [
        "Catálogo dinâmico em tempo real",
        "Busca por modelo e categoria",
        "Simulador de financiamento por anúncio",
        "Laudo Dekra 100% documentado",
        "SEO local por região e modelo",
      ],
      challenges: [
        {
          problem:
            "Lojas multimarcas tradicionais operam com estoque em planilha — o site fica desatualizado e queima confiança.",
          solution:
            "Catálogo em tempo real: anúncio vendido, anúncio sai do ar. Zero veículo indisponível no ar.",
        },
        {
          problem:
            "Comprador de carro usado quer saber a parcela antes de falar com vendedor.",
          solution:
            "Simulador de parcelamento em cada anúncio: o visitante autosserva-se e chega ao vendedor qualificado.",
        },
      ],
      results: [
        "+8.500 carros entregues",
        "4.6★ no Google com 230+ avaliações",
        "Laudo cautelar Dekra 100% do estoque",
      ],
    },
    en: {
      summary:
        "Modern digital environment for a renowned multi-brand dealership with 20+ years of history in Perus/SP: real-time catalog, smart search and a financing simulator backed by 100% inspected inspection reports.",
      layers: [
        {
          title: "Dynamic Catalog",
          items: [
            "Real-time inventory with search by model and category (SUVs, Sedans, Hatchs, Pickups)",
            "Vehicle pages with complete specs and professional gallery",
            "Financing simulator embedded in every listing",
          ],
        },
        {
          title: "Trust & Provenance",
          items: [
            "100% Dekra inspection report featured prominently",
            "20+ years of tradition as a brand asset",
            "Google reviews (4.6★, 230+) integrated",
          ],
        },
        {
          title: "Local Acquisition",
          items: [
            "Local SEO targeting region + model searches",
            "Direct lead generation to the sales team",
          ],
        },
      ],
      features: [
        "Real-time dynamic catalog",
        "Search by model and category",
        "Per-listing financing simulator",
        "100% documented Dekra report",
        "Local SEO by region and model",
      ],
      challenges: [
        {
          problem:
            "Traditional dealerships run inventory on spreadsheets — outdated sites burn trust.",
          solution:
            "Real-time catalog: sold vehicle, listing down. Zero unavailable vehicles live.",
        },
        {
          problem:
            "Used-car buyers want the monthly payment before talking to a salesperson.",
          solution:
            "Financing simulator on every listing: visitors self-serve and arrive qualified.",
        },
      ],
      results: [
        "8,500+ cars delivered",
        "4.6★ on Google with 230+ reviews",
        "100% of stock covered by Dekra reports",
      ],
    },
  },

  "caccia-energia-solar": {
    pt: {
      summary:
        "Plataforma institucional e ferramenta de engenharia fotovoltaica voltada ao Agronegócio (pivôs de irrigação, granjas, Plano Safra/FCO), indústrias e residências de alto padrão no Mato Grosso do Sul.",
      layers: [
        {
          title: "Simulador Algorítmico",
          items: [
            "Payback patrimonial calculado com base na radiação solar de Ivinhema",
            "Regras de homologação Energisa MS embutidas no cálculo",
            "Cenários por perfil: agro (pivôs, granjas), indústria e residência premium",
          ],
        },
        {
          title: "Institucional & Confiança",
          items: [
            "Páginas de serviço por segmento com especificação de engenharia",
            "Garantia linear de 25 anos como pilar da narrativa",
            "Métricas de economia (até 95%) com transparência de cálculo",
          ],
        },
        {
          title: "Captação Segmentada",
          items: [
            "SEO orientado a buscas do agronegócio sul-mato-grossense",
            "CTAs por segmento: o produtor rural não cai no funil residencial",
          ],
        },
      ],
      features: [
        "Simulador de payback algorítmico",
        "Radiação solar regional embutida no cálculo",
        "Cenários agro, indústria e residência",
        "Homologação Energisa MS",
        "Garantia linear de 25 anos em evidência",
      ],
      challenges: [
        {
          problem:
            "Energia solar virou commodity de porta a porta — diferenciação exige engenharia visível.",
          solution:
            "O simulador expõe o cálculo: radiação da região, homologação, payback real. O cliente vê a engenharia, não o discursos de vendas.",
        },
        {
          problem:
            "O produtor rural tem necessidades (pivôs, granjas) completamente distintas do residencial.",
          solution:
            "Segmentação total: páginas, cenários do simulador e CTAs separados por perfil de consumo.",
        },
      ],
      results: [
        "Economia de até 95% documentada por cenário",
        "Payback médio de 2,4 anos no cálculo regional",
        "Funil segmentado agro/indústria/residencial",
      ],
    },
    en: {
      summary:
        "Institutional platform and photovoltaic engineering tool for Agribusiness (irrigation pivots, farms, Plano Safra/FCO), industries and high-end residences in Mato Grosso do Sul.",
      layers: [
        {
          title: "Algorithmic Simulator",
          items: [
            "Asset payback calculated on Ivinhema's regional solar radiation",
            "Energisa MS homologation rules embedded in the calculation",
            "Scenarios by profile: agro (pivots, farms), industry and premium residential",
          ],
        },
        {
          title: "Institutional & Trust",
          items: [
            "Service pages per segment with engineering specifications",
            "25-year linear warranty as the narrative pillar",
            "Savings metrics (up to 95%) with calculation transparency",
          ],
        },
        {
          title: "Segmented Acquisition",
          items: [
            "SEO targeting agribusiness searches in Mato Grosso do Sul",
            "Per-segment CTAs: the rural producer never falls into the residential funnel",
          ],
        },
      ],
      features: [
        "Algorithmic payback simulator",
        "Regional solar radiation embedded in calculations",
        "Agro, industry and residential scenarios",
        "Energisa MS homologation",
        "25-year linear warranty featured",
      ],
      challenges: [
        {
          problem:
            "Solar energy became a door-to-door commodity — differentiation demands visible engineering.",
          solution:
            "The simulator exposes the math: regional radiation, homologation, real payback. The customer sees engineering, not sales talk.",
        },
        {
          problem:
            "Rural producers (pivots, farms) have completely different needs from residential customers.",
          solution:
            "Full segmentation: separate pages, simulator scenarios and CTAs by consumption profile.",
        },
      ],
      results: [
        "Up to 95% savings documented per scenario",
        "Average 2.4-year payback in regional calculations",
        "Agro/industry/residential segmented funnel",
      ],
    },
  },

  "prime-imports": {
    pt: {
      summary:
        "Showroom privativo de supercarros e veículos blindados de alto padrão no Tatuapé/Anália Franco, São Paulo. O desafio era traduzir curadoria de exóticos — inspeção de 250+ itens, laudo cautelar 100% e discrição total — em uma experiência web de vitrine nacional para acervos de sete dígitos.",
      layers: [
        {
          title: "Showroom Digital Exclusivo",
          items: [
            "Acervo curado com ficha completa: ano, quilometragem, potência e valor por veículo",
            "Selos de estado por unidade (Série Limitada, Blindado, Full Size VIP, Zero Km)",
            "Galeria profissional com hierarquia de marca e modelo em primeiro plano",
          ],
        },
        {
          title: "Concierge & Confiança",
          items: [
            "Concierge WhatsApp por veículo: proposta negociada com contexto do anúncio já carregado",
            "Curadoria cirúrgica documentada: inspeção técnica de 250+ itens e laudo cautelar 100%",
            "Discrição estruturada para compra, venda e consignação confidenciais",
          ],
        },
        {
          title: "Sourcing & Logística",
          items: [
            "Personal broker com busca ativa em mercados fechados do Brasil, Europa e EUA",
            "Importação direta com desembaraço completo e procedência verificada",
            "Entrega nacional em caminhão prancha fechado e segurado",
          ],
        },
      ],
      features: [
        "Showroom privativo com atendimento por hora marcada",
        "Acervo com selos de estado por unidade",
        "Sourcing internacional com importação e desembaraço",
        "Concierge WhatsApp por veículo",
        "Laudo cautelar 100% e inspeção de 250+ itens",
      ],
      challenges: [
        {
          problem:
            "Supercarros de sete dígitos não toleram vitrine genérica: o comprador exige prova de procedência antes do primeiro contato.",
          solution:
            "Cada unidade exposta com documentação técnica completa, selos de estado e narrativa de curadoria — a confiança é construída na página, não no telefone.",
        },
        {
          problem:
            "Clientes de alto poder aquisitivo valorizam discrição e não convertem por formulários longos.",
          solution:
            "Concierge WhatsApp contextual por anúncio e agendamento de visita privativa: a conversa começa com o veículo já em contexto.",
        },
      ],
      results: [
        "Ferrari, Porsche, McLaren e Mercedes-AMG no acervo curado",
        "Inspeção técnica de 250+ itens com laudo cautelar 100% aprovado",
        "Entrega privativa documentada em todo o território nacional",
      ],
    },
    en: {
      summary:
        "Private showroom for supercars and high-end armored vehicles in Tatuapé/Anália Franco, São Paulo. The challenge was translating exotic-car curation — 250+ item inspection, 100% approved inspection reports and total discretion — into a web experience that showcases seven-figure inventories nationwide.",
      layers: [
        {
          title: "Exclusive Digital Showroom",
          items: [
            "Curated inventory with complete spec sheets: year, mileage, horsepower and price per vehicle",
            "Per-unit condition badges (Limited Series, Armored, Full Size VIP, Zero Km)",
            "Professional gallery with brand and model hierarchy up front",
          ],
        },
        {
          title: "Concierge & Trust",
          items: [
            "Per-vehicle WhatsApp concierge: offers negotiated with the listing context pre-loaded",
            "Documented surgical curation: 250+ item technical inspection and 100% approved reports",
            "Discretion built into confidential buying, selling and consignment",
          ],
        },
        {
          title: "Sourcing & Logistics",
          items: [
            "Personal broker with active sourcing across closed markets in Brazil, Europe and the USA",
            "Direct import with full customs clearance and verified provenance",
            "Nationwide delivery in insured enclosed car carriers",
          ],
        },
      ],
      features: [
        "Private showroom with appointment-only service",
        "Inventory with per-unit condition badges",
        "International sourcing with import and customs clearance",
        "Per-vehicle WhatsApp concierge",
        "100% approved inspection reports and 250+ item checks",
      ],
      challenges: [
        {
          problem:
            "Seven-figure supercars tolerate no generic storefront: buyers demand provenance proof before first contact.",
          solution:
            "Every unit listed with complete technical documentation, condition badges and a curation narrative — trust is built on the page, not over the phone.",
        },
        {
          problem:
            "High-net-worth clients value discretion and never convert through long forms.",
          solution:
            "Contextual per-listing WhatsApp concierge and private visit booking: the conversation starts with the vehicle in context.",
        },
      ],
      results: [
        "Ferrari, Porsche, McLaren and Mercedes-AMG in the curated inventory",
        "250+ item technical inspection with 100% approved reports",
        "Documented private delivery across the national territory",
      ],
    },
  },

  newjetcar: {
    pt: {
      summary:
        "Showroom multimarcas premium em Vinhedo/SP, referência no interior paulista em superesportivos, clássicos e blindados com mais de 15 anos de mercado. O desafio era traduzir curadoria pericial — vistoria de 150+ pontos, laudo cautelar 100% e consignação discreta — em uma vitrine digital com estoque diverso e curadoria visível.",
      layers: [
        {
          title: "Curadoria de Estoque",
          items: [
            "Inventário diverso em vitrine: Porsche Cayman R, Mustang Mach 1, clássicos (Fusca, BMW E36) e picapes premium",
            "Ficha técnica com ano, quilometragem e investimento por veículo",
            "Selos de estado por unidade: Blindado, entre outros",
          ],
        },
        {
          title: "Perícia & Procedência",
          items: [
            "Vistoria de 150+ pontos: estrutura, pintura, histórico de leilões, sinistros e verificação eletrônica com scanners homologados",
            "Laudo cautelar 100% aprovado como pilar da narrativa",
            "Quilometragem comprovada e procedência irretocável documentadas por unidade",
          ],
        },
        {
          title: "Consignação & Bespoke",
          items: [
            "Consignação estratégica: posicionamento do veículo perante base selecionada de colecionadores e investidores, com privacidade preservada",
            "Bespoke Car Hunter: consultoria internacional para exemplares raros e configurações sob encomenda",
            "Entrega VIP nacional em caminhão plataforma fechado e climatizado",
          ],
        },
      ],
      features: [
        "Vistoria pericial de 150+ pontos por veículo",
        "Laudo cautelar 100% aprovado",
        "Consignação estratégica com discrição",
        "Bespoke Car Hunter para encomendas raras",
        "Entrega VIP nacional em caminhão fechado climatizado",
      ],
      challenges: [
        {
          problem:
            "Estoque multimarcas diverso (do Fusca 1974 ao superesportivo) dilui o posicionamento premium quando a vitrine não tem hierarquia.",
          solution:
            "Curadoria com narrativa unificada: cada unidade apresentada com perícia documentada e selos de estado — a diversidade vira amplitude de curadoria, não bagunça.",
        },
        {
          problem:
            "Vendedores e consignantes de alto padrão exigem discrição absoluta na venda de blindados e exóticos.",
          solution:
            "Consignação estratégica com base qualificada de colecionadores e bespoke sourcing internacional — a negociação acontece em canal privado, não na vitrine pública.",
        },
      ],
      results: [
        "100% do estoque com perícia cautelar aprovada",
        "Mais de 15 anos de mercado e referência no interior paulista",
        "Entrega VIP documentada em todo o território nacional",
      ],
    },
    en: {
      summary:
        "Premium multi-brand showroom in Vinhedo/SP, a reference in inland São Paulo for supercars, classics and armored vehicles with 15+ years in the market. The challenge was translating expert curation — 150+ point inspection, 100% approved reports and discreet consignment — into a digital showcase with diverse inventory and visible curation.",
      layers: [
        {
          title: "Inventory Curation",
          items: [
            "Diverse inventory on display: Porsche Cayman R, Mustang Mach 1, classics (Fusca, BMW E36) and premium pickups",
            "Spec sheets with year, mileage and investment per vehicle",
            "Per-unit condition badges: Armored, among others",
          ],
        },
        {
          title: "Inspection & Provenance",
          items: [
            "150+ point inspection: structure, paint, auction history, accidents and electronic verification with homologated scanners",
            "100% approved inspection report as the narrative pillar",
            "Verified mileage and impeccable provenance documented per unit",
          ],
        },
        {
          title: "Consignment & Bespoke",
          items: [
            "Strategic consignment: positioning the vehicle before a selected base of collectors and investors, preserving privacy",
            "Bespoke Car Hunter: international consultancy for rare examples and made-to-order configurations",
            "Nationwide VIP delivery in an enclosed, climate-controlled car carrier",
          ],
        },
      ],
      features: [
        "150+ point expert inspection per vehicle",
        "100% approved inspection reports",
        "Strategic consignment with discretion",
        "Bespoke Car Hunter for rare commissions",
        "Nationwide VIP delivery in a climate-controlled enclosed truck",
      ],
      challenges: [
        {
          problem:
            "Diverse multi-brand stock (from a 1974 Fusca to supercars) dilutes premium positioning when the showcase lacks hierarchy.",
          solution:
            "Curation with a unified narrative: every unit presented with documented inspection and condition badges — diversity becomes curatorial breadth, not clutter.",
        },
        {
          problem:
            "High-end sellers and consignors demand absolute discretion when trading armored and exotic vehicles.",
          solution:
            "Strategic consignment with a qualified collector base and international bespoke sourcing — the deal happens in a private channel, not the public storefront.",
        },
      ],
      results: [
        "100% of inventory with approved inspection reports",
        "15+ years in the market as an inland São Paulo reference",
        "Documented VIP delivery across the national territory",
      ],
    },
  },

  avantgarde: {
    pt: {
      summary:
        "Plataforma digital da Avantgarde, referência nacional em multimarcas premium e superesportivos com mais de vinte mil clientes. O desafio era sustentar a personalidade da marca, a qualidade do estoque (Porsche, Ferrari, Lamborghini, Brabus) e a experiência imersiva que os diferencia no mercado.",
      layers: [
        {
          title: "Catálogo de Hipercarros",
          items: [
            "Vitrine de unidades raras: Porsche 911 GT2 RS, Ferrari 812 GTS Atelier, Lamborghini Sterrato",
            "Fichas com ano, quilometragem e valor de unidades de sete dígitos",
            "Estoque de Blindados e modelos sob encomenda em destaque",
          ],
        },
        {
          title: "Avantgarde Experience",
          items: [
            "Seção imersiva dedicada à experiência de marca do cliente",
            "Narrativa de trajetória: mais de vinte mil clientes conquistados no país",
            "Posicionamento premium com personalidade própria nos negócios",
          ],
        },
        {
          title: "Captação de Demanda Sob Encomenda",
          items: [
            "Formulário de aviso de chegada: o cliente registra o modelo desejado e é notificado",
            "Captura de demanda para modelos que nem chegaram ao estoque",
            "Jornada conectada entre vitrine, wishlist e relacionamento",
          ],
        },
      ],
      features: [
        "Catálogo de hipercarros com unidades raras",
        "Avantgarde Experience imersiva",
        "Aviso de chegada para modelos sob encomenda",
        "Narrativa de 20.000+ clientes",
        "Blindados e séries especiais em destaque",
      ],
      challenges: [
        {
          problem:
            "Multimarcas premium competem por estoque raro — a marca precisa justificar por que o melhor carro está com ela, e não no concorrente.",
          solution:
            "A plataforma expõe a trajetória, a personalidade e a qualidade do estoque como prova: o hipercarro certo aparece para quem já confia na marca.",
        },
        {
          problem:
            "Modelos exclusivos raramente estão disponíveis; demanda chega sem estoque para atender.",
          solution:
            "Aviso de chegada transforma demanda sem estoque em pipeline: o cliente deixa o contato e é notificado quando o modelo chega.",
        },
      ],
      results: [
        "Mais de vinte mil clientes em todo o país",
        "Porsche, Ferrari, Lamborghini e Brabus no catálogo",
        "Pipeline de demanda ativo via aviso de chegada",
      ],
    },
    en: {
      summary:
        "Digital platform for Avantgarde, a national reference in premium multi-brand and supercars with over twenty thousand clients. The challenge was sustaining the brand's personality, inventory quality (Porsche, Ferrari, Lamborghini, Brabus) and the immersive experience that sets them apart.",
      layers: [
        {
          title: "Hypercar Catalog",
          items: [
            "Rare-unit showcase: Porsche 911 GT2 RS, Ferrari 812 GTS Atelier, Lamborghini Sterrato",
            "Spec sheets with year, mileage and value for seven-figure units",
            "Armored and made-to-order models featured",
          ],
        },
        {
          title: "Avantgarde Experience",
          items: [
            "Immersive section dedicated to the client brand experience",
            "Trajectory narrative: twenty thousand clients won nationwide",
            "Premium positioning with its own business personality",
          ],
        },
        {
          title: "Made-to-Order Demand Capture",
          items: [
            "Arrival-alert form: clients register the desired model and get notified",
            "Captures demand for models that have not even reached stock",
            "Connected journey between showcase, wishlist and relationship",
          ],
        },
      ],
      features: [
        "Hypercar catalog with rare units",
        "Immersive Avantgarde Experience",
        "Arrival alerts for made-to-order models",
        "20,000+ client narrative",
        "Armored and special series featured",
      ],
      challenges: [
        {
          problem:
            "Premium multi-brand dealers compete for rare stock — the brand must justify why the best car is with them, not the competitor.",
          solution:
            "The platform exposes trajectory, personality and inventory quality as proof: the right hypercar finds the client who already trusts the brand.",
        },
        {
          problem:
            "Exclusive models are rarely in stock; demand arrives with nothing to fulfill it.",
          solution:
            "Arrival alerts turn unmet demand into pipeline: the client leaves contact details and is notified when the model lands.",
        },
      ],
      results: [
        "More than twenty thousand clients nationwide",
        "Porsche, Ferrari, Lamborghini and Brabus in the catalog",
        "Active demand pipeline via arrival alerts",
      ],
    },
  },

  vertexcars: {
    pt: {
      summary:
        "Plataforma da maior autoridade em veículos de alta performance de Minas Gerais, com 33 anos de tradição e mais de 1.400 veículos entregues. O desafio era unir curadoria Porsche, certificação Approved e um showroom conceito de 2.000m² em uma jornada digital com simulação financeira transparente.",
      layers: [
        {
          title: "Vitrine Porsche de Alta Performance",
          items: [
            "Inventário filtrável por categoria, valor e propulsão com 5 unidades em destaque",
            "Fichas técnicas completas: potência, 0-100 km/h, câmbio e equipamentos Weissach/PCCB",
            "Selos de disponibilidade: pronta entrega, oportunidade da semana, laudo OK",
          ],
        },
        {
          title: "Simulador de Financiamento",
          items: [
            "Simulação de entrada (20-80%) e prazo com taxa média de private banking",
            "Estimativa de parcela mensal calculada no navegador antes do contato",
            "Proposta oficial roteada ao WhatsApp com o cenário já configurado",
          ],
        },
        {
          title: "Prova Social & Entrega",
          items: [
            "Depoimentos assinados por clientes reais com veículo e cidade",
            "Certificação Porsche Approved: inspeção de 111 itens com ferramental oficial",
            "Entrega nacional em caminhão prancha fechado e cerimônia VIP",
          ],
        },
      ],
      features: [
        "Inventário Porsche filtrável por categoria e valor",
        "Simulador de financiamento com taxas de private banking",
        "Certificação Porsche Approved (111 itens)",
        "Showroom conceito de 2.000m² com lounge VIP",
        "+1.400 veículos entregues e 4.9★ no Google",
      ],
      challenges: [
        {
          problem:
            "Comprador de superesportivo quer simular a parcela antes de expor interesse — formulário puro espanta.",
          solution:
            "Simulador transparente embutido: o visitante calcula entrada e parcela sozinho e só então fala com o especialista, já qualificado.",
        },
        {
          problem:
            "33 anos de tradição precisavam virar prova digital, não apenas uma frase de 'sobre nós'.",
          solution:
            "Métricas reais em evidência: +1.400 entregues, 100% laudo cautelar, 4.9★ Google e depoimentos assinados por clientes com modelo e cidade.",
        },
      ],
      results: [
        "+1.400 veículos entregues em todo o território nacional",
        "4.9★ de avaliação no Google",
        "Aprovação de crédito em menos de 2 horas com bancos parceiros",
      ],
    },
    en: {
      summary:
        "Platform for the leading high-performance vehicle authority in Minas Gerais, with 33 years of tradition and 1,400+ vehicles delivered. The challenge was uniting Porsche curation, Approved certification and a 2,000m² concept showroom into a digital journey with transparent financial simulation.",
      layers: [
        {
          title: "High-Performance Porsche Showcase",
          items: [
            "Inventory filterable by category, value and propulsion with 5 featured units",
            "Complete spec sheets: horsepower, 0-100 km/h, transmission and Weissach/PCCB equipment",
            "Availability badges: ready for delivery, deal of the week, inspection OK",
          ],
        },
        {
          title: "Financing Simulator",
          items: [
            "Down payment (20-80%) and term simulation with an average private-banking rate",
            "Monthly installment estimate computed in the browser before contact",
            "Official proposal routed to WhatsApp with the scenario pre-configured",
          ],
        },
        {
          title: "Social Proof & Delivery",
          items: [
            "Signed testimonials from real clients with vehicle and city",
            "Porsche Approved certification: 111-item inspection with official tooling",
            "Nationwide enclosed-car-carrier delivery and VIP handover ceremony",
          ],
        },
      ],
      features: [
        "Porsche inventory filterable by category and value",
        "Financing simulator with private-banking rates",
        "Porsche Approved certification (111 items)",
        "2,000m² concept showroom with VIP lounge",
        "1,400+ vehicles delivered and 4.9★ on Google",
      ],
      challenges: [
        {
          problem:
            "Supercar buyers want to simulate the monthly payment before exposing interest — plain forms scare them off.",
          solution:
            "A transparent embedded simulator: visitors compute down payment and installments themselves and only then talk to a specialist, already qualified.",
        },
        {
          problem:
            "33 years of tradition had to become digital proof, not just an 'about us' sentence.",
          solution:
            "Real metrics front and center: 1,400+ delivered, 100% inspection reports, 4.9★ Google and testimonials signed by clients with model and city.",
        },
      ],
      results: [
        "1,400+ vehicles delivered across the national territory",
        "4.9★ Google rating",
        "Credit approval in under 2 hours with partner banks",
      ],
    },
  },

  vertexjet: {
    pt: {
      summary:
        "Landing page de hiperluxo para embarcações pessoais construídas em fibra de carbono aeroespacial T1000 com motor marinho supercharged de 380 HP. O desafio era vender engenharia naval — monocoque, hidrojato em titânio, telemetria VTS — como um produto de desejo com acesso restrito por agendamento.",
      layers: [
        {
          title: "Narrativa de Engenharia",
          items: [
            "Especificações de produto como protagonismo: 380 HP, 2.4s de 0-100 na água, redline de 8.850 RPM",
            "Arquitetura do casco explicada: monocoque T1000 forjado a vácuo com autoclave aeroespacial",
            "Sistemas proprietários nomeados (CLCS, VTS) para construir linguagem de marca técnica",
          ],
        },
        {
          title: "Telemetria Marinha Viva",
        items: [
            "Painel de telemetria em tempo real: ângulo de trim, pressão da bomba e posição GNSS",
            "Sensores inerciais simulados a 200 Hz reforçam a percepção de produto ativo",
            "Cockpit digital com link satelital e leitura de velocidade em nós",
          ],
        },
        {
          title: "Escassez & Acesso",
          items: [
            "Coleção exclusiva 2026 com edição Stealth numerada",
            "Test ride privado disponível apenas por agendamento para clientes selecionados",
            "Homologação naval internacional como selo de credibilidade",
          ],
        },
      ],
      features: [
        "Motor supercharged de 380 HP com arquitetura CLCS",
        "Monocoque em fibra de carbono T1000 (310 kg secos)",
        "Painel de telemetria marinha em tempo real",
        "Coleção exclusiva 2026 com edição Stealth",
        "Test ride privativo por agendamento",
      ],
      challenges: [
        {
          problem:
            "Produto inexistente no mercado tradicional precisa criar categoria, confiança e desejo do zero.",
          solution:
            "Engenharia exposta como argumento: cada número (HP, peso, empuxo, G) é verificável e cada sistema tem nome próprio — a página lê como especificação naval, não como folder.",
        },
        {
          problem:
            "Hiperluxo não converte por botão de compra: exige acesso restringido e ritural de descoberta.",
          solution:
            "Funil de escassez: coleção numerada, test ride por agendamento e disponibilidade restrita a clientes selecionados.",
        },
      ],
      results: [
        "380 HP com hidrojato duplo em titânio e 138 km/h de velocidade máxima",
        "Casco 32% mais leve em fibra de carbono T1000",
        "Funil de test ride privativo para clientes selecionados",
      ],
    },
    en: {
      summary:
        "Hyperluxury landing page for personal watercraft built with aerospace-grade T1000 carbon fiber and a 380 HP supercharged marine engine. The challenge was selling naval engineering — monocoque, titanium waterjet, VTS telemetry — as a desirable product with restricted, appointment-only access.",
      layers: [
        {
          title: "Engineering Narrative",
          items: [
            "Product specs as protagonists: 380 HP, 2.4s 0-100 on water, 8,850 RPM redline",
            "Hull architecture explained: T1000 monocoque vacuum-forged in an aerospace autoclave",
            "Proprietary systems named (CLCS, VTS) to build a technical brand language",
          ],
        },
        {
          title: "Live Marine Telemetry",
          items: [
            "Real-time telemetry panel: trim angle, pump pressure and GNSS position",
            "Inertial sensors simulated at 200 Hz reinforce the perception of an active product",
            "Digital cockpit with satellite link and speed readout in knots",
          ],
        },
        {
          title: "Scarcity & Access",
          items: [
            "Exclusive 2026 collection with a numbered Stealth edition",
            "Private test ride available only by appointment for selected clients",
            "International naval homologation as a credibility seal",
          ],
        },
      ],
      features: [
        "380 HP supercharged engine with CLCS architecture",
        "T1000 carbon-fiber monocoque (310 kg dry)",
        "Real-time marine telemetry panel",
        "Exclusive 2026 collection with Stealth edition",
        "Private test ride by appointment",
      ],
      challenges: [
        {
          problem:
            "A product with no traditional market precedent must create category, trust and desire from scratch.",
          solution:
            "Engineering exposed as the argument: every number (HP, weight, thrust, G) is verifiable and every system has a name — the page reads as a naval spec sheet, not a brochure.",
        },
        {
          problem:
            "Hyperluxury never converts through a buy button: it demands restricted access and a discovery ritual.",
          solution:
            "Scarcity funnel: numbered collection, appointment-only test rides and availability restricted to selected clients.",
        },
      ],
      results: [
        "380 HP with dual titanium waterjet and 138 km/h top speed",
        "32% lighter T1000 carbon-fiber hull",
        "Private test-ride funnel for selected clients",
      ],
    },
  },
};

/** Locale fallback: returns the study in the requested locale, then `pt`. */
export function getCaseStudy(id: string, locale: Locale): CaseStudyContent | null {
  const entry = CASE_STUDIES[id];
  if (!entry) return null;
  return entry[locale] ?? entry.pt;
}
