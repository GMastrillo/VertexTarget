export type Journey = 'business' | 'professional';
export type TemplateId = 'local-services' | 'commerce' | 'consulting';
export type ThemeId = 'cyan-dark' | 'warm-light' | 'forest-light';

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string };

export interface SiteService {
  title: string;
  description: string;
}

export interface SiteDocument {
  schemaVersion: 1;
  templateId: TemplateId;
  themeId: ThemeId;
  businessName: string;
  title: string;
  subtitle: string;
  description: string;
  services: SiteService[];
  ctaLabel: string;
  email: string;
  whatsapp: string;
  city: string;
}

export interface ProjectBriefing {
  businessName: string;
  sector: string;
  city: string;
  objective: string;
  description: string;
  services: SiteService[];
  email: string;
  whatsapp: string;
  templateId: TemplateId;
}

export interface ConfirmedIdentity {
  userId: string;
  email: string;
}

export interface OsWorkspace {
  id: string;
  name: string;
  journey: Journey;
  status: 'active' | 'suspended' | 'deleted';
  plan: 'free';
}

export interface OsContext extends ConfirmedIdentity {
  workspace: OsWorkspace;
}

export interface OsProject {
  id: string;
  workspaceId: string;
  briefing: ProjectBriefing;
  document: SiteDocument;
  version: number;
  updatedAt: string;
}

export type ProspectStatus = 'new' | 'contacted' | 'proposal' | 'closed' | 'discarded';

export interface SearchSource {
  url: string;
  title: string;
}

export interface ProspectInput {
  name: string;
  sector: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  notes: string;
}

export interface OsProspect extends ProspectInput {
  id: string;
  status: ProspectStatus;
  sources: SearchSource[];
}

export interface SearchInput {
  sector: string;
  city: string;
}

export interface SearchSuggestion {
  name: string;
  sector: string;
  city: string;
  website: string;
  phone: string;
  hypothesis: string;
  sources: SearchSource[];
}

export interface SearchResult {
  suggestions: SearchSuggestion[];
  searchedAt: string;
  attributionHtml: string | null;
}

export interface PublishedSite {
  slug: string;
  document: SiteDocument;
  publishedAt: string;
}

export type UsageKind = 'copy' | 'search';

export interface UsageSummary {
  period: string;
  renewsAt: string;
  copy: { used: number; limit: 3 };
  search: { used: number; limit: 1 };
}

export interface UsageReservation {
  operationId: string;
  state: 'reserved' | 'sent' | 'completed' | 'failed';
  executor: boolean;
}

export interface OperationCompletion {
  status: 'completed' | 'failed';
  tokens: number;
  latencyMs: number;
  errorCode: string | null;
}
