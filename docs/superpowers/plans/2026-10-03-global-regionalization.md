# Regionalização e contatos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Suportar país, idioma e fuso independentes, telefones internacionais e publicação compatível com documentos antigos.

**Architecture:** Validadores puros e contratos versionados mantêm leitura v1 e criam v2 para novos documentos. Preferências persistidas no workspace passam por validação servidor/RPC; geração assistida recebe região explícita, sem converter textos/dados pessoais silenciosamente.

**Tech Stack:** TypeScript, Intl, Next.js 15, Supabase/RPC existente, Google GenAI existente, npm, node:test.

**Spec:** [global-platform-design](../specs/2026-10-03-global-platform-design.md), seções 6 e 8. Depends onda 2 `Locale`, `resolveLocale` e dicionários; [roteiro](2026-10-03-global-platform.md).

## Global Constraints

- Idioma, país ISO 3166-1 alpha-2 e fuso IANA são preferências distintas.
- Limites de uso continuam renovando em UTC; apenas a exibição é localizada e deve explicitar essa regra.
- Telefones novos em formato internacional com código do país explícito.
- Dados brasileiros legados continuam funcionando por compatibilidade explícita, não por reinterpretação silenciosa de todos os telefones.
- Atualizações de Supabase são migrations aditivas revisáveis localmente. Aplicação remota fica para autorização explícita.
- Não consumir APIs pagas para testar sem autorização específica; nenhum commit, deploy, dependência nova ou bypass de auth.
- Zero `any` novo/suppressions; ≤ 350 linhas por arquivo novo. Preservar briefing/sandbox alheios.

## Review Focus

1. Número americano nacional vira brasileiro: entrada v2 sem `+` deve falhar (tarefa 1).
2. País/idioma/fuso contraditórios são corrigidos silenciosamente: combinação válida independente deve persistir (tarefa 2).
3. Site v1 perde contato/copy ao ser lido ou republicado: preservar documento e compatibilidade explícita (tarefa 3).
4. Virada mensal/DST altera quotas: exibir fuso do usuário sem mudar período UTC (tarefa 4).
5. IA muda telefone/nome ou injeta texto de instrução: merge allowlisted preserva dados e não concede autoridade ao briefing (tarefa 4).

---

### Tarefa 1: Preferências e telefone puro

**Files:** Create `src/lib/region/types.ts`, `src/lib/region/countries.ts`, `src/lib/region/validation.ts`, `src/lib/region/format.ts`, `scripts/tests/region-contracts.test.mjs`; modify `src/lib/os/contact.ts`, `scripts/tests/os-contracts.test.mjs`.

**Interfaces:** `RegionalPreferences = { locale: Locale; country: string; timeZone: string }`. `COUNTRY_CODES` enumera códigos ISO atuais em dados locais verificados; `PRIORITY_COUNTRIES` contém exatamente BR,US,CA,GB,MX,AR,CL,CO,PE,UY,PT,ES,FR,DE,IT,AT,BE,NL,IE,LU,CH, sem bloquear países adicionais válidos. `parseRegionalPreferences(input: unknown): { ok: true; value: RegionalPreferences } | { ok: false; code: 'locale' | 'country' | 'timeZone' }`. Fuso validado por Intl, inclui UTC. `normalizeInternationalPhone(input: string): string | null` aceita `+`, separadores visuais espaços/parênteses/hífens, 2–15 dígitos, primeiro não zero; retorna `+` + dígitos, rejeita letras/extensão/controles. É validação estrutural, não existência. `normalizeBrazilianPhone` permanece para v1. `contactHref({email?,whatsapp?,phoneFormat?: 'e164' | 'legacy-br'}): string | null`; default legacy-br preserva callers v1, v2 passa e164 explicitamente; wa.me remove `+` só depois da validação.

- [x] Escrever testes: BR `+55 (11) 99999-9999`, US `+1 202-555-0123`, GB `+44 20 7946 0958`, FR `+33 1 42 68 53 00`, DE `+49 30 123456`; assert resultados canônicos. Números nacionais estrangeiros sem `+`, `+0`, >15 dígitos, extensão, letras/controles rejeitados.
- [x] Acrescentar `independent_preferences`: `{locale:'de',country:'BR',timeZone:'America/New_York'}` válido; país ZZ/fuso inventado inválidos; prioridade exatamente 21 códigos. Contatos legado BR e fallback email seguros permanecem iguais.
```js
assert.equal(normalizeInternationalPhone('+1 202-555-0123'), '+12025550123');
assert.equal(normalizeInternationalPhone('2025550123'), null);
assert.equal(normalizeBrazilianPhone('11999999999'), '5511999999999');
assert.equal(parseRegionalPreferences({locale:'de',country:'BR',timeZone:'America/New_York'}).ok, true);
assert.equal(parseRegionalPreferences({locale:'de',country:'ZZ',timeZone:'UTC'}).ok, false);
```

- [x] Executar `node --experimental-strip-types --test scripts/tests/region-contracts.test.mjs scripts/tests/os-contracts.test.mjs`; confirmar RED apenas nas funções novas.
- [x] Implementar módulos puros, labels de países via `Intl.DisplayNames` no locale ativo. Não inferir país do idioma, não adicionar libphone/gambiarra prefix55 para v2.
- [x] Reexecutar testes e typecheck. UI informa que validação estrutural não confirma existência do telefone.

### Tarefa 2: Workspace e persistência

**Files:** Create `supabase/migrations/017_os_regional_preferences.sql`, `src/lib/os/workspace-validation.ts`, `scripts/tests/region-workspace.test.mjs`; modify `src/lib/os/types.ts`, `src/lib/os/workspace-repository.ts`, `src/app/api/os/workspace/route.ts`, `src/components/os/onboarding-form.tsx`, `src/components/os/workspace-settings.tsx`, `src/app/os/(workspace)/configuracoes/page.tsx`.

**Interfaces:** `OsWorkspace` acrescenta `regionalPreferences: RegionalPreferences`. Registros anteriores sem preferências: fallback explícito `{locale:'pt-BR',country:'BR',timeZone:'UTC'}`, sem backfill que suponha localização real. `WorkspaceInput = {name:string;journey:Journey;regionalPreferences?:RegionalPreferences;noticeVersion?:string;termsAccepted?:true}`; `parseWorkspaceInput(input: unknown, mode: 'create' | 'update'): {ok:true;value:WorkspaceInput} | {ok:false;code:'name'|'journey'|'terms'|'region'|'extra_keys'}` produz campos validados, exige termsAccepted/noticeVersion na criação; rejeita owner/plan/status e extras. `ensureWorkspace`/`updateWorkspace` recebem preferência opcional sem mudar identidade/termos; RPCs novos `os_set_regional_preferences(p_user_id uuid, p_locale text, p_country text, p_time_zone text)` somente service role, validam dono/workspace ativo e valores. Colunas aditivas `locale`, `country_code`, `time_zone` nullable em `os_workspaces`; leitura aplica fallback em código. Preferência grava explicitamente após criação/edição; nenhuma sobrecarga quebra funções antigas.

- [x] Escrever testes de entrada adulterada, fallback legado e roundtrip preferências independentes; repository com stubs registra mesmo userId confirmado e nenhuma escrita em outro workspace. Em erro de RPC, não retornar sucesso.
- [x] Rodar `node --experimental-strip-types --test scripts/tests/region-workspace.test.mjs`; confirmar RED.
- [x] Implementar validação servidor antes de casts, migration/RPC aditiva, mapeamento de rows e formulários de país/idioma/fuso separados; não substituir locale da interface por locale do conteúdo automaticamente.
- [x] Testar formulário por teclado e labels traduzidas; manter consentimento/reauth exclusão, canonical origin e limites de body.
- [x] Reexecutar teste, OS e typecheck. Revisar SQL local: RLS existente permanece, execute restrito a service role, dono validado. Teste de banco real pendente até autorização remota, não alegar que fixture valida RLS efetiva.

### Tarefa 3: Schema v2 e publicação

**Files:** Create `src/lib/os/document-version.ts`, `src/lib/os/document-validation.ts`, `scripts/tests/region-documents.test.mjs`; modify `src/lib/os/types.ts`, `src/lib/os/validation.ts`, `src/lib/os/project-repository.ts`, `src/lib/os/publication-utils.ts`, `src/lib/os/publication-repository.ts`, `src/lib/os/editor-state.ts`, `src/components/os/project-briefing.tsx`, `project-briefing-fields.tsx`, `project-fields.tsx`, `project-preview.tsx`, `site-renderer.tsx`, `src/app/sites/[slug]/page.tsx`, `src/lib/i18n/request-context.ts`, `src/middleware.ts`, `src/components/plataforma/laptop/laptop-sandbox-generator.ts`, `scripts/tests/os-sandbox.test.mjs`.

**Interfaces:** Preservar campos atuais em `SiteDocumentV1` (`schemaVersion:1`); `SiteDocumentV2` tem `schemaVersion:2`, mesmos campos e `locale: Locale`, `country: string`, `timeZone: string`, `whatsapp` canônico E.164. `SiteDocument = SiteDocumentV1 | SiteDocumentV2`. `getDocumentRegion(document: SiteDocument): RegionalPreferences` v1 fallback explícito; `upgradeDocument(document: SiteDocumentV1, preferences: RegionalPreferences): SiteDocumentV2` chamado somente ao salvar/atualizar explicitamente, convertendo telefone legado validado para +55. `parseSiteDocument(input: unknown): ParseResult<SiteDocument>` preserva shape/versão de v1, aceita/rejeita chaves por versão. Novo briefing inclui `regionalPreferences`; briefing legado sem campo continua compatível. `documentFromBriefing` cria v2 somente com região explícita. `publicDocument` preserva versão/região e não inclui workspace/dados internos.

- [x] Escrever testes `v1_roundtrip`, `v2_international`, `unknown_version`, `foreign_national_rejected`, `extra_private_keys`, `published_locale`: snapshot v1 permanece v1 e telefone antigo, v2 +12025550123 válido, versão3/extras inválidos, nome/copy do usuário não traduzidos, publicDocument nunca vaza campos internos.
- [x] Executar `node --experimental-strip-types --test scripts/tests/region-documents.test.mjs scripts/tests/os-publication.test.mjs`; confirmar RED dos contratos v2.
- [x] Separar validação de documento do arquivo legado grande só na fronteira necessária; reexportar API existente. Atualizar callers que constroem `schemaVersion:1` para preservar versão ou criar v2 explicitamente; não passar para v2 sem contatos/região válidos.
- [x] Atualizar editor, sandbox e renderer com edição/região persistida e contatoHref e164 em v2; mesclar mudanças alheias ao invés de sobrescrever arquivos. Tema do documento permanece independente do dashboard.
- [x] Estender `getRequestLocale()` da onda 2: para `x-vt-site-slug` validado e sobrescrito pelo middleware, ler `getPublishedSite(slug)` no servidor e aplicar `getDocumentRegion` antes de gerar root HTML; deduplicar leitura por request com cache React. Sem snapshot, página 404; indisponibilidade de banco não vira publicação falsa. Nunca confiar em cookie/header externo para idioma do documento; nenhuma credencial de serviço no middleware ou correção de `html.lang` só por JS.
- [x] Reexecutar testes region/OS e typecheck; publicar com repository stub, inspecionar HTML inicial de fixture pública local autorizada em de e v1 pt-BR. Nenhuma publicação real ou migration remota implícita.

### Tarefa 4: Geração, prospects, coleta e datas

**Files:** Create `src/lib/os/ai-prompts.ts`, `scripts/tests/region-ai.test.mjs`, `scripts/tests/region-dates.test.mjs`; modify `src/lib/os/ai-provider.ts`, `ai-service.ts`, `ai-validation.ts`, `prospect-repository.ts`, `src/components/os/prospect-form.tsx`, `search-results.tsx`, `usage-summary.tsx`, `src/lib/os/types.ts`, `src/lib/os/validation.ts`, `src/components/contact/interest-form.tsx`, `interest-form-fields.tsx`, `src/app/api/interesses/route.ts`, `src/lib/region/format.ts`.

**Interfaces:** `buildCopyPrompt(briefing: ProjectBriefing, document: SiteDocument): {systemInstruction:string; userPrompt:string}`; `mergeGeneratedCopy(input: unknown, document: SiteDocument): ParseResult<SiteDocument>` allowlist só títulos/textos/services, preserva businessName, contato, cidade, região e tema. `SearchInput` acrescenta país e idioma opcionais para compatibilidade, formulário novo explícito; validação de saída não inventa telefone. `formatDate(value: Date | string, preferences: RegionalPreferences, options?: Intl.DateTimeFormatOptions): string` força timeZone validado. Prospect/contact novos com número explicitamente internacional; legado reconhecido por contrato de origem, nunca heurística global.

- [x] Escrever testes: prompt fr/CA pede idioma fr e país CA, não Brasil; briefing contendo instrução maliciosa é dado delimitado, não systemInstruction; resposta IA que tenta mudar nome/telefone/country não altera esses campos, inválida não sobrescreve draft. Usar stub, zero chamada paga.
- [x] Escrever teste de `2026-11-01T04:30:00Z` em America/New_York vs UTC e virada mensal: formatação muda dia local quando pertinente, `usagePeriod` de `src/lib/os/policy.ts` continua UTC e quotas 3/1 iguais. Verificar transição DST por Intl, sem offsets fixos.
- [x] Rodar `node --experimental-strip-types --test scripts/tests/region-ai.test.mjs scripts/tests/region-dates.test.mjs`; confirmar RED.
- [x] Implementar prompt/merge/formatação, integrar formulários e coleta; informar país de busca sem prometer cobertura/métodos. Confirmar modelo configurado nas docs oficiais antes de alterar nome; não trocar modelo ou executar chamada paga por este plano.
- [x] Reexecutar testes e `npm run test:os`/`npm run test:commercial`; UI mostra renovação UTC, datas no fuso escolhido e número inválido gera erro localizado.

### Tarefa 5: Aceite da onda

**Files:** Create `docs/verification/2026-10-03-global-regionalization.md`; update este plano e roteiro.

**Interfaces:** Relatório separa contratos locais, UI autorizada, banco/IA reais não exercitados e gate de rollout.

- [x] Rodar testes region + OS/comerciais, typecheck, lint e build após edição final; nenhuma assertion antiga é removida por conveniência.
- [x] Verificar onboarding/configurações/briefing/publicação/contatos nos dois temas a 360 px, seis idiomas, teclado e console; sem conta, registrar quais fluxos não foram exercitados.
- [x] Revisar migration additiva, compatibilidade de fixtures legadas e metadata/lang de sites publicados; banco remoto, consumo IA e publicação real aguardam autorização específica.
