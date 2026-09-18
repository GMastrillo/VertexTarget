import type { Locale } from "@/lib/i18n";

export type CaseIndexCopy = {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  all: string;
  category: string;
  technology: string;
  year: string;
  allCategories: string;
  allTechnologies: string;
  allYears: string;
  noResults: string;
  reset: string;
  backHome: string;
};

export const CASE_INDEX_COPY: Record<Locale, CaseIndexCopy> = {
  pt: { eyebrow: "Estudos de arquitetura", title1: "Projetos que transformam", title2: "complexidade em impacto.", description: "Explore os cases da VertexTarget, do contexto de negócio às decisões técnicas, experiências digitais e resultados entregues.", all: "Todos os cases", category: "Categoria", technology: "Tecnologia", year: "Ano", allCategories: "Todas as categorias", allTechnologies: "Todas as tecnologias", allYears: "Todos os anos", noResults: "Nenhum case corresponde aos filtros selecionados.", reset: "Limpar filtros", backHome: "Voltar para a home" },
  en: { eyebrow: "Architecture studies", title1: "Projects that turn", title2: "complexity into impact.", description: "Explore VertexTarget cases, from business context to technical decisions, digital experiences and delivered results.", all: "All cases", category: "Category", technology: "Technology", year: "Year", allCategories: "All categories", allTechnologies: "All technologies", allYears: "All years", noResults: "No case matches the selected filters.", reset: "Clear filters", backHome: "Back to home" },
  es: { eyebrow: "Estudios de arquitectura", title1: "Proyectos que transforman", title2: "complejidad en impacto.", description: "Explora los casos de VertexTarget, desde el contexto de negocio hasta las decisiones técnicas, experiencias digitales y resultados entregados.", all: "Todos los casos", category: "Categoría", technology: "Tecnología", year: "Año", allCategories: "Todas las categorías", allTechnologies: "Todas las tecnologías", allYears: "Todos los años", noResults: "Ningún caso coincide con los filtros seleccionados.", reset: "Limpiar filtros", backHome: "Volver al inicio" },
  fr: { eyebrow: "Études d'architecture", title1: "Des projets qui transforment", title2: "la complexité en impact.", description: "Explorez les réalisations VertexTarget, du contexte métier aux décisions techniques, expériences digitales et résultats livrés.", all: "Toutes les réalisations", category: "Catégorie", technology: "Technologie", year: "Année", allCategories: "Toutes les catégories", allTechnologies: "Toutes les technologies", allYears: "Toutes les années", noResults: "Aucune réalisation ne correspond aux filtres sélectionnés.", reset: "Réinitialiser", backHome: "Retour à l'accueil" },
  it: { eyebrow: "Studi di architettura", title1: "Progetti che trasformano", title2: "la complessità in impatto.", description: "Esplora i casi VertexTarget, dal contesto di business alle decisioni tecniche, esperienze digitali e risultati consegnati.", all: "Tutti i casi", category: "Categoria", technology: "Tecnologia", year: "Anno", allCategories: "Tutte le categorie", allTechnologies: "Tutte le tecnologie", allYears: "Tutti gli anni", noResults: "Nessun caso corrisponde ai filtri selezionati.", reset: "Cancella filtri", backHome: "Torna alla home" },
};
