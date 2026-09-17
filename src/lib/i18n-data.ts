import type { Locale } from "./i18n";
import type { SERVICES, CASES } from "./constants";

type ServiceId = (typeof SERVICES)[number]["id"];
type CaseId = (typeof CASES)[number]["id"];

export interface ServiceContent {
  title: string;
  description: string;
  tags: string[];
}

export interface CaseContent {
  category: string;
  tagline: string;
  description: string;
  metrics: string;
  tags: string[];
}

interface LocaleCardContent {
  services: Record<ServiceId, ServiceContent>;
  cases: Record<CaseId, CaseContent>;
}

/**
 * Card content translations. Titles/clients of cases are proper nouns and
 * stay in constants.ts; everything the visitor reads per card lives here.
 */
export const CARD_CONTENT: Record<Locale, LocaleCardContent> = {
  pt: {
    services: {
      "ai-automation": {
        title: "Automação de\nMarketing com IA",
        description:
          "Pipelines de marketing automatizados com inteligência artificial. Campanhas que se otimizam sozinhas, copy gerado por IA, e segmentação preditiva de audiência.",
        tags: ["Gemini API", "Pipelines", "NLP", "Automação"],
      },
      "web-development": {
        title: "Desenvolvimento\nWeb Premium",
        description:
          "Sites e aplicações web com padrão Awwwards. WebGL, shaders customizados, animações orquestradas e performance obsessiva. Zero templates genéricos.",
        tags: ["Next.js", "Three.js", "GSAP", "WebGL"],
      },
      "digital-strategy": {
        title: "Estratégia\nDigital & SEO",
        description:
          "Posicionamento digital data-driven. SEO técnico avançado, analytics comportamental, growth hacking e funis de conversão otimizados por IA.",
        tags: ["SEO", "Analytics", "Growth", "Data"],
      },
      "system-integration": {
        title: "Integração de\nSistemas & APIs",
        description:
          "Arquiteturas que conectam tudo. APIs RESTful, webhooks, integrações CRM/ERP, microserviços e orquestração de dados entre plataformas.",
        tags: ["APIs", "Node.js", "Python", "Cloud"],
      },
      infrastructure: {
        title: "Consultoria em\nInfraestrutura",
        description:
          "Da base física ao deploy na nuvem. Diagnóstico de hardware, otimização de redes, CI/CD e DevOps. A engenharia por trás da engenharia.",
        tags: ["DevOps", "Cloud", "Hardware", "Redes"],
      },
    },
    cases: {
      clinicflow: {
        category: "SaaS · Automação Odonto / IA",
        tagline: "Cada paciente, no momento certo.",
        description:
          "Plataforma SaaS de automação inteligente para clínicas odontológicas e de saúde. Desenvolvida para máxima conversão e retenção, conta com autenticação por senha e Magic Link, réguas de comunicação preditiva, agendamento automatizado e painel analítico com troca dinâmica de tema.",
        metrics: "Automação 24/7 de Pacientes · Multi-theme · Zero Latency",
        tags: ["Next.js", "TailwindCSS", "SaaS", "Automação CRM", "Magic Link", "TypeScript"],
      },
      "cliente-absoluto": {
        category: "Segurança Eletrônica & VRF / PMOC",
        tagline: "Segurança Absoluta. Climatização & Proteção 24/7.",
        description:
          "Infraestrutura digital de alta precisão que unifica duas potências regionais no Oeste do PR: Absoluto (CFTV IP 4K com reconhecimento facial, leitura de placas LPR, alarmes monitorados) e Lucena Refrigeração (sistemas VRF, Chillers e laudo PMOC ANVISA Lei 13.589/18). Inclui calculadora técnica de dimensionamento em tempo real.",
        metrics: "+15.000k BTUs Instalados · 99.9% Disponibilidade · +450 Sensores Ativos",
        tags: ["Next.js", "TailwindCSS", "Calculadora Técnica", "CFTV IP IA", "VRF Climatização", "CREA-PR"],
      },
      "jetski-gold": {
        category: "E-Commerce Náutico & Showroom de Luxo",
        tagline: "Potência, Liberdade & Excelência Náutica.",
        description:
          "Plataforma digital de luxo para a maior referência em compra, venda e centro técnico de embarcações (Sea-Doo, Yamaha WaveRunner, Kawasaki) e linha off-road (Can-Am Maverick) no ABC Paulista. Apresenta catálogo com filtros por cavalaria (+300 HP), periciados com garantia, boutique de som náutico e concierge integrado.",
        metrics: "5.0★ Google (+180 Reviews) · 100% Inspecionados · Zero Km & Seminovos",
        tags: ["Next.js", "TailwindCSS", "Luxury UI", "Showroom 360°", "Filtro HP", "WhatsApp Concierge"],
      },
      "autobelle-multimarcas": {
        category: "Concessionária & Plataforma Automotiva",
        tagline: "20+ Anos de Tradição, Laudo Dekra e Procedência Total.",
        description:
          "Ambiente digital moderno para conceituada loja multimarcas com mais de 20 anos de história em Perus/SP. Desenvolvido com catálogo em tempo real, busca inteligente por modelo e categoria (SUVs, Sedans, Hatchs, Picapes), simulador de parcelamento e credibilidade com laudo cautelar 100% periciado.",
        metrics: "+8.500 Carros Entregues · 4.6★ Google (230+) · Laudo Dekra 100%",
        tags: ["Next.js", "TailwindCSS", "Catálogo Dinâmico", "Simulador Financiamento", "Lead Gen", "SEO Local"],
      },
      "caccia-energia-solar": {
        category: "CleanTech & Engenharia Fotovoltaica",
        tagline: "Engenharia Solar de Alta Eficiência. Autonomia e Lucro Energético no MS.",
        description:
          "Plataforma institucional e ferramenta de engenharia fotovoltaica voltada ao Agronegócio (pivôs de irrigação, granjas, Plano Safra/FCO), indústrias e residências de alto padrão no Mato Grosso do Sul. Conta com simulador algorítmico de payback patrimonial com base na radiação solar de Ivinhema e homologação Energisa MS.",
        metrics: "Economia de até 95% · Payback Médio 2,4 Anos · 25 Anos Garantia Linear",
        tags: ["Next.js", "TailwindCSS", "Simulador Algorítmico", "Agro Solar", "Payback Calc", "Energisa MS"],
      },
    },
  },

  en: {
    services: {
      "ai-automation": {
        title: "AI-Powered\nMarketing Automation",
        description:
          "Marketing pipelines automated with artificial intelligence. Self-optimizing campaigns, AI-generated copy and predictive audience segmentation.",
        tags: ["Gemini API", "Pipelines", "NLP", "Automation"],
      },
      "web-development": {
        title: "Premium\nWeb Development",
        description:
          "Awwwards-standard websites and web apps. WebGL, custom shaders, orchestrated animations and obsessive performance. Zero generic templates.",
        tags: ["Next.js", "Three.js", "GSAP", "WebGL"],
      },
      "digital-strategy": {
        title: "Digital Strategy\n& SEO",
        description:
          "Data-driven digital positioning. Advanced technical SEO, behavioral analytics, growth hacking and AI-optimized conversion funnels.",
        tags: ["SEO", "Analytics", "Growth", "Data"],
      },
      "system-integration": {
        title: "System & API\nIntegration",
        description:
          "Architectures that connect everything. RESTful APIs, webhooks, CRM/ERP integrations, microservices and data orchestration across platforms.",
        tags: ["APIs", "Node.js", "Python", "Cloud"],
      },
      infrastructure: {
        title: "Infrastructure\nConsulting",
        description:
          "From physical foundation to cloud deploy. Hardware diagnostics, network optimization, CI/CD and DevOps. The engineering behind the engineering.",
        tags: ["DevOps", "Cloud", "Hardware", "Networks"],
      },
    },
    cases: {
      clinicflow: {
        category: "SaaS · Dental Automation / AI",
        tagline: "Every patient, at the right moment.",
        description:
          "SaaS platform for intelligent automation in dental and healthcare clinics. Built for maximum conversion and retention, it features password and Magic Link authentication, predictive communication flows, automated scheduling and an analytics dashboard with dynamic theme switching.",
        metrics: "24/7 Patient Automation · Multi-theme · Zero Latency",
        tags: ["Next.js", "TailwindCSS", "SaaS", "CRM Automation", "Magic Link", "TypeScript"],
      },
      "cliente-absoluto": {
        category: "Electronic Security & VRF / PMOC",
        tagline: "Absolute Security. Climate & Protection 24/7.",
        description:
          "High-precision digital infrastructure uniting two regional powerhouses in western Paraná: Absoluto (4K IP CCTV with facial recognition, LPR plate reading, monitored alarms) and Lucena Refrigeração (VRF systems, Chillers and PMOC ANVISA report under Law 13.589/18). Includes a real-time technical sizing calculator.",
        metrics: "15,000k+ BTUs Installed · 99.9% Uptime · +450 Active Sensors",
        tags: ["Next.js", "TailwindCSS", "Technical Calculator", "AI IP CCTV", "VRF Climate", "CREA-PR"],
      },
      "jetski-gold": {
        category: "Nautical E-Commerce & Luxury Showroom",
        tagline: "Power, Freedom & Nautical Excellence.",
        description:
          "Luxury digital platform for the leading reference in buying, selling and technical service of watercraft (Sea-Doo, Yamaha WaveRunner, Kawasaki) and the off-road line (Can-Am Maverick) in ABC Paulista. Features a catalog with horsepower filters (+300 HP), certified pre-owned with warranty, a nautical audio boutique and an integrated concierge.",
        metrics: "5.0★ Google (+180 Reviews) · 100% Inspected · New & Pre-Owned",
        tags: ["Next.js", "TailwindCSS", "Luxury UI", "360° Showroom", "HP Filter", "WhatsApp Concierge"],
      },
      "autobelle-multimarcas": {
        category: "Dealership & Automotive Platform",
        tagline: "20+ Years of Tradition, Dekra Report & Total Provenance.",
        description:
          "Modern digital environment for a renowned multi-brand dealership with over 20 years of history in Perus/SP. Built with a real-time catalog, smart search by model and category (SUVs, Sedans, Hatchs, Pickups), a financing simulator and credibility with 100% inspected inspection reports.",
        metrics: "+8,500 Cars Delivered · 4.6★ Google (230+) · 100% Dekra Report",
        tags: ["Next.js", "TailwindCSS", "Dynamic Catalog", "Financing Simulator", "Lead Gen", "Local SEO"],
      },
      "caccia-energia-solar": {
        category: "CleanTech & Photovoltaic Engineering",
        tagline: "High-Efficiency Solar Engineering. Energy Independence & Profit in MS.",
        description:
          "Institutional platform and photovoltaic engineering tool for Agribusiness (irrigation pivots, farms, Plano Safra/FCO), industries and high-end residences in Mato Grosso do Sul. Features an algorithmic asset payback simulator based on Ivinhema's solar radiation and Energisa MS homologation.",
        metrics: "Up to 95% Savings · Avg. Payback 2.4 Years · 25-Year Linear Warranty",
        tags: ["Next.js", "TailwindCSS", "Algorithmic Simulator", "Agro Solar", "Payback Calc", "Energisa MS"],
      },
    },
  },

  es: {
    services: {
      "ai-automation": {
        title: "Automatización de\nMarketing con IA",
        description:
          "Pipelines de marketing automatizados con inteligencia artificial. Campañas que se optimizan solas, copy generado por IA y segmentación predictiva de audiencia.",
        tags: ["Gemini API", "Pipelines", "NLP", "Automatización"],
      },
      "web-development": {
        title: "Desarrollo\nWeb Premium",
        description:
          "Sitios y aplicaciones web con estándar Awwwards. WebGL, shaders personalizados, animaciones orquestadas y performance obsesiva. Cero plantillas genéricas.",
        tags: ["Next.js", "Three.js", "GSAP", "WebGL"],
      },
      "digital-strategy": {
        title: "Estrategia\nDigital & SEO",
        description:
          "Posicionamiento digital data-driven. SEO técnico avanzado, analytics comportamental, growth hacking y funiles de conversión optimizados por IA.",
        tags: ["SEO", "Analytics", "Growth", "Data"],
      },
      "system-integration": {
        title: "Integración de\nSistemas & APIs",
        description:
          "Arquitecturas que conectan todo. APIs RESTful, webhooks, integraciones CRM/ERP, microservicios y orquestación de datos entre plataformas.",
        tags: ["APIs", "Node.js", "Python", "Cloud"],
      },
      infrastructure: {
        title: "Consultoría en\nInfraestructura",
        description:
          "Desde la base física hasta el deploy en la nube. Diagnóstico de hardware, optimización de redes, CI/CD y DevOps. La ingeniería detrás de la ingeniería.",
        tags: ["DevOps", "Cloud", "Hardware", "Redes"],
      },
    },
    cases: {
      clinicflow: {
        category: "SaaS · Automatización Dental / IA",
        tagline: "Cada paciente, en el momento correcto.",
        description:
          "Plataforma SaaS de automatización inteligente para clínicas odontológicas y de salud. Desarrollada para máxima conversión y retención, cuenta con autenticación por contraseña y Magic Link, flujos de comunicación predictiva, agendado automatizado y panel analítico con cambio dinámico de tema.",
        metrics: "Automatización 24/7 de Pacientes · Multi-theme · Latencia Cero",
        tags: ["Next.js", "TailwindCSS", "SaaS", "Automatización CRM", "Magic Link", "TypeScript"],
      },
      "cliente-absoluto": {
        category: "Seguridad Electrónica & VRF / PMOC",
        tagline: "Seguridad Absoluta. Climatización & Protección 24/7.",
        description:
          "Infraestructura digital de alta precisión que une dos potencias regionales del Oeste de Paraná: Absoluto (CFTV IP 4K con reconocimiento facial, lectura de placas LPR, alarmas monitoreadas) y Lucena Refrigeração (sistemas VRF, Chillers y laudo PMOC ANVISA Ley 13.589/18). Incluye calculadora técnica de dimensionamiento en tiempo real.",
        metrics: "+15.000k BTUs Instalados · 99.9% Disponibilidad · +450 Sensores Activos",
        tags: ["Next.js", "TailwindCSS", "Calculadora Técnica", "CFTV IP IA", "Climatización VRF", "CREA-PR"],
      },
      "jetski-gold": {
        category: "E-Commerce Náutico & Showroom de Lujo",
        tagline: "Potencia, Libertad & Excelencia Náutica.",
        description:
          "Plataforma digital de lujo para la mayor referencia en compra, venta y centro técnico de embarcaciones (Sea-Doo, Yamaha WaveRunner, Kawasaki) y línea off-road (Can-Am Maverick) en el ABC Paulista. Presenta catálogo con filtros por caballos de fuerza (+300 HP), seminuevos periciados con garantía, boutique de audio náutico y conserje integrado.",
        metrics: "5.0★ Google (+180 Reseñas) · 100% Inspeccionados · Zero Km & Seminuevos",
        tags: ["Next.js", "TailwindCSS", "UI de Lujo", "Showroom 360°", "Filtro HP", "Conserje WhatsApp"],
      },
      "autobelle-multimarcas": {
        category: "Concesionaria & Plataforma Automotriz",
        tagline: "20+ Años de Tradición, Laudo Dekra y Procedencia Total.",
        description:
          "Ambiente digital moderno para una reconocida tienda multimarcas con más de 20 años de historia en Perus/SP. Desarrollado con catálogo en tiempo real, búsqueda inteligente por modelo y categoría (SUVs, Sedans, Hatchs, Pickups), simulador de financiamento y credibilidad con laudo cautelar 100% periciado.",
        metrics: "+8.500 Autos Entregados · 4.6★ Google (230+) · Laudo Dekra 100%",
        tags: ["Next.js", "TailwindCSS", "Catálogo Dinámico", "Simulador de Financiamiento", "Lead Gen", "SEO Local"],
      },
      "caccia-energia-solar": {
        category: "CleanTech & Ingeniería Fotovoltaica",
        tagline: "Ingeniería Solar de Alta Eficiencia. Autonomía y Lucro Energético en MS.",
        description:
          "Plataforma institucional y herramienta de ingeniería fotovoltaica orientada al Agronegocio (pivotes de riego, granjas, Plano Safra/FCO), industrias y residencias de alto estándar en Mato Grosso do Sul. Cuenta con simulador algorítmico de payback patrimonial basado en la radiación solar de Ivinhema y homologación Energisa MS.",
        metrics: "Ahorro de hasta 95% · Payback Medio 2,4 Años · 25 Años de Garantía Lineal",
        tags: ["Next.js", "TailwindCSS", "Simulador Algorítmico", "Agro Solar", "Cálculo Payback", "Energisa MS"],
      },
    },
  },

  fr: {
    services: {
      "ai-automation": {
        title: "Automatisation\nMarketing par IA",
        description:
          "Pipelines marketing automatisés par l'intelligence artificielle. Campagnes auto-optimisées, copy générée par IA et segmentation prédictive des audiences.",
        tags: ["Gemini API", "Pipelines", "NLP", "Automatisation"],
      },
      "web-development": {
        title: "Développement\nWeb Premium",
        description:
          "Sites et applications web de niveau Awwwards. WebGL, shaders sur mesure, animations orchestrées et performance obsessionnelle. Zéro template générique.",
        tags: ["Next.js", "Three.js", "GSAP", "WebGL"],
      },
      "digital-strategy": {
        title: "Stratégie\nDigitale & SEO",
        description:
          "Positionnement digital data-driven. SEO technique avancé, analytics comportemental, growth hacking et tunnels de conversion optimisés par IA.",
        tags: ["SEO", "Analytics", "Growth", "Data"],
      },
      "system-integration": {
        title: "Intégration de\nSystèmes & APIs",
        description:
          "Des architectures qui connectent tout. APIs RESTful, webhooks, intégrations CRM/ERP, microservices et orchestration des données entre plateformes.",
        tags: ["APIs", "Node.js", "Python", "Cloud"],
      },
      infrastructure: {
        title: "Conseil en\nInfrastructure",
        description:
          "De la base physique au déploiement cloud. Diagnostic matériel, optimisation réseau, CI/CD et DevOps. L'ingénierie derrière l'ingénierie.",
        tags: ["DevOps", "Cloud", "Hardware", "Réseaux"],
      },
    },
    cases: {
      clinicflow: {
        category: "SaaS · Automatisation Dentaire / IA",
        tagline: "Chaque patient, au bon moment.",
        description:
          "Plateforme SaaS d'automatisation intelligente pour cliniques dentaires et de santé. Conçue pour une conversion et une rétention maximales : authentification par mot de passe et Magic Link, parcours de communication prédictive, prise de rendez-vous automatisée et tableau de bord analytique avec changement de thème dynamique.",
        metrics: "Automatisation 24/7 des Patients · Multi-theme · Latence Zéro",
        tags: ["Next.js", "TailwindCSS", "SaaS", "Automatisation CRM", "Magic Link", "TypeScript"],
      },
      "cliente-absoluto": {
        category: "Sécurité Électronique & VRF / PMOC",
        tagline: "Sécurité Absolue. Climatisation & Protection 24/7.",
        description:
          "Infrastructure numérique de haute précision unissant deux puissances régionales de l'ouest du Paraná : Absoluto (vidéosurveillance IP 4K avec reconnaissance faciale, lecture de plaques LPR, alarmes surveillées) et Lucena Refrigeração (systèmes VRF, Chillers et rapport PMOC ANVISA loi 13.589/18). Inclut une calculatrice technique de dimensionnement en temps réel.",
        metrics: "+15 000k BTU Installés · 99,9% Disponibilité · +450 Capteurs Actifs",
        tags: ["Next.js", "TailwindCSS", "Calculatrice Technique", "Vidéosurveillance IP IA", "Climatisation VRF", "CREA-PR"],
      },
      "jetski-gold": {
        category: "E-Commerce Nautique & Showroom de Luxe",
        tagline: "Puissance, Liberté & Excellence Nautique.",
        description:
          "Plateforme digitale de luxe pour la plus grande référence d'achat, de vente et de service technique d'embarcations (Sea-Doo, Yamaha WaveRunner, Kawasaki) et de la gamme tout-terrain (Can-Am Maverick) dans l'ABC Paulista. Catalogue avec filtres par puissance (+300 ch), occasions certifiées garanties, boutique audio nautique et conciergerie intégrée.",
        metrics: "5,0★ Google (+180 Avis) · 100% Inspectés · Zéro Km & Occasions",
        tags: ["Next.js", "TailwindCSS", "UI de Luxe", "Showroom 360°", "Filtre CV", "Conciergerie WhatsApp"],
      },
      "autobelle-multimarcas": {
        category: "Concession & Plateforme Automobile",
        tagline: "20+ Ans de Tradition, Rapport Dekra et Provenance Totale.",
        description:
          "Environnement digital moderne pour un concessionnaire multimarques réputé avec plus de 20 ans d'histoire à Perus/SP. Catalogue en temps réel, recherche intelligente par modèle et catégorie (SUV, Berlines, Citadines, Pick-up), simulateur de financement et crédibilité avec rapport cautélaire 100% expertisé.",
        metrics: "+8 500 Voitures Livrées · 4,6★ Google (230+) · Rapport Dekra 100%",
        tags: ["Next.js", "TailwindCSS", "Catalogue Dynamique", "Simulateur de Financement", "Lead Gen", "SEO Local"],
      },
      "caccia-energia-solar": {
        category: "CleanTech & Ingénierie Photovoltaïque",
        tagline: "Ingénierie Solaire Haute Efficacité. Autonomie & Profit Énergétique dans le MS.",
        description:
          "Plateforme institutionnelle et outil d'ingénierie photovoltaïque destiné à l'Agrobusiness (pivots d'irrigation, fermes, Plano Safra/FCO), aux industries et aux résidences haut de gamme du Mato Grosso do Sul. Simulateur algorithmique de retour sur investissement patrimonial basé sur le rayonnement solaire d'Ivinhema et homologation Energisa MS.",
        metrics: "Jusqu'à 95% d'Économies · Retour Moyen 2,4 Ans · 25 Ans de Garantie Linéaire",
        tags: ["Next.js", "TailwindCSS", "Simulateur Algorithmique", "Agro Solaire", "Calcul Retour", "Energisa MS"],
      },
    },
  },

  it: {
    services: {
      "ai-automation": {
        title: "Automazione\nMarketing con IA",
        description:
          "Pipeline di marketing automatizzate con intelligenza artificiale. Campagne che si ottimizzano da sole, copy generato dall'IA e segmentazione predittiva del pubblico.",
        tags: ["Gemini API", "Pipelines", "NLP", "Automazione"],
      },
      "web-development": {
        title: "Sviluppo\nWeb Premium",
        description:
          "Siti e applicazioni web con standard Awwwards. WebGL, shader personalizzati, animazioni orchestrate e prestazioni ossessive. Zero template generici.",
        tags: ["Next.js", "Three.js", "GSAP", "WebGL"],
      },
      "digital-strategy": {
        title: "Strategia\nDigitale & SEO",
        description:
          "Posizionamento digitale data-driven. SEO tecnico avanzato, analytics comportamentale, growth hacking e funnel di conversione ottimizzati dall'IA.",
        tags: ["SEO", "Analytics", "Growth", "Data"],
      },
      "system-integration": {
        title: "Integrazione di\nSistemi & API",
        description:
          "Architetture che collegano tutto. API RESTful, webhook, integrazioni CRM/ERP, microservizi e orchestrazione dei dati tra piattaforme.",
        tags: ["API", "Node.js", "Python", "Cloud"],
      },
      infrastructure: {
        title: "Consulenza su\nInfrastruttura",
        description:
          "Dalla base fisica al deploy sul cloud. Diagnostica hardware, ottimizzazione delle reti, CI/CD e DevOps. L'ingegneria dietro l'ingegneria.",
        tags: ["DevOps", "Cloud", "Hardware", "Reti"],
      },
    },
    cases: {
      clinicflow: {
        category: "SaaS · Automazione Dentale / IA",
        tagline: "Ogni paziente, al momento giusto.",
        description:
          "Piattaforma SaaS di automazione intelligente per cliniche odontoiatriche e sanitarie. Progettata per massima conversione e fidelizzazione: autenticazione con password e Magic Link, flussi di comunicazione predittiva, prenotazioni automatizzate e dashboard analitica con cambio tema dinamico.",
        metrics: "Automazione Pazienti 24/7 · Multi-theme · Latenza Zero",
        tags: ["Next.js", "TailwindCSS", "SaaS", "Automazione CRM", "Magic Link", "TypeScript"],
      },
      "cliente-absoluto": {
        category: "Sicurezza Elettronica & VRF / PMOC",
        tagline: "Sicurezza Assoluta. Climatizzazione & Protezione 24/7.",
        description:
          "Infrastruttura digitale di alta precisione che unisce due potenze regionali dell'ovest del Paraná: Absoluto (videosorveglianza IP 4K con riconoscimento facciale, lettura targhe LPR, allarmi monitorati) e Lucena Refrigeração (sistemi VRF, Chillers e relazione PMOC ANVISA Legge 13.589/18). Include una calcolatrice tecnica di dimensionamento in tempo reale.",
        metrics: "+15.000k BTU Installati · 99,9% Disponibilità · +450 Sensori Attivi",
        tags: ["Next.js", "TailwindCSS", "Calcolatrice Tecnica", "Videosorveglianza IP IA", "Climatizzazione VRF", "CREA-PR"],
      },
      "jetski-gold": {
        category: "E-Commerce Nautico & Showroom di Lusso",
        tagline: "Potenza, Libertà & Eccellenza Nautica.",
        description:
          "Piattaforma digitale di lusso per il punto di riferimento principale nell'acquisto, vendita e assistenza tecnica di imbarcazioni (Sea-Doo, Yamaha WaveRunner, Kawasaki) e gamma off-road (Can-Am Maverick) nell'ABC Paulista. Catalogo con filtri per cavalli (+300 CV), usato certificato con garanzia, boutique audio nautico e concierge integrato.",
        metrics: "5.0★ Google (+180 Recensioni) · 100% Ispezionati · Zero Km & Usato",
        tags: ["Next.js", "TailwindCSS", "UI di Lusso", "Showroom 360°", "Filtro CV", "Concierge WhatsApp"],
      },
      "autobelle-multimarcas": {
        category: "Concessionaria & Piattaforma Automotive",
        tagline: "20+ Anni di Tradizione, Perizia Dekra e Provenienza Totale.",
        description:
          "Ambiente digitale moderno per una rinomata concessionaria multimarca con oltre 20 anni di storia a Perus/SP. Sviluppato con catalogo in tempo reale, ricerca intelligente per modello e categoria (SUV, Sedan, Hatch, Pickup), simulatore di finanziamento e credibilità con perizia cautelare 100% ispezionata.",
        metrics: "+8.500 Auto Consegnate · 4.6★ Google (230+) · Perizia Dekra 100%",
        tags: ["Next.js", "TailwindCSS", "Catalogo Dinamico", "Simulatore Finanziamento", "Lead Gen", "SEO Locale"],
      },
      "caccia-energia-solar": {
        category: "CleanTech & Ingegneria Fotovoltaica",
        tagline: "Ingegneria Solare Alta Efficienza. Autonomia e Profitto Energetico in MS.",
        description:
          "Piattaforma istituzionale e strumento di ingegneria fotovoltaica per l'Agribusiness (pivot di irrigazione, aziende agricole, Plano Safra/FCO), industrie e residenze di alto livello nel Mato Grosso do Sul. Simulatore algoritmico di payback patrimoniale basato sulla radiazione solare di Ivinhema e omologazione Energisa MS.",
        metrics: "Risparmio fino al 95% · Payback Medio 2,4 Anni · 25 Anni di Garanzia Lineare",
        tags: ["Next.js", "TailwindCSS", "Simulatore Algoritmico", "Agro Solare", "Calcolo Payback", "Energisa MS"],
      },
    },
  },
};
