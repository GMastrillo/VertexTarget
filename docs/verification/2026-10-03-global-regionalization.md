# Relatório de Verificação — Onda 3: Regionalização e Contatos

**Data:** 2026-10-04  
**Plano de Origem:** `docs/superpowers/plans/2026-10-03-global-regionalization.md`  
**Status:** Aprovado e Verificado (Contratos locais e DTOs)

---

## 1. Escopo Entregue

1. **Preferências Regionais e Telefonia Pura (Tarefa 1):**
   - Módulos `src/lib/region/{types,countries,validation,format}.ts`.
   - `RegionalPreferences = { locale: Locale; country: string; timeZone: string }`.
   - `COUNTRY_CODES` e `PRIORITY_COUNTRIES` (exatamente os 21 países autorizados: BR, US, CA, GB, MX, AR, CL, CO, PE, UY, PT, ES, FR, DE, IT, AT, BE, NL, IE, LU, CH).
   - `normalizeInternationalPhone`: validação estrita E.164 (`+` + 2–15 dígitos), rejeita números nacionais sem `+`, caracteres de controle, extensões e letras.
   - `normalizeBrazilianPhone`: preservado intacto para chamadores e compatibilidade v1.
   - `contactHref`: suporte transparente aos formatos `legacy-br` (default) e `e164` (remove `+` estritamente na URL `wa.me`).
   - Testes em `scripts/tests/region-contracts.test.mjs` (10/10 passing).

2. **Workspace e Persistência (Tarefa 2):**
   - Migration aditiva `supabase/migrations/017_os_regional_preferences.sql` com colunas `locale`, `country_code`, `time_zone` e RPC `os_set_regional_preferences` restrito a `service_role`.
   - Validador `parseWorkspaceInput` em `src/lib/os/workspace-validation.ts`, com verificação rigorosa de chaves extras (`ownerId`, `plan`, `status`), consentimento e versão de aviso em modo create.
   - Atualização do repositório `src/lib/os/workspace-repository.ts` com fallback explícito `{ locale: 'pt-BR', country: 'BR', timeZone: 'UTC' }` para registros legados.
   - Rota de API `src/app/api/os/workspace/route.ts` atualizada para validar `regionalPreferences` em POST e PUT.
   - Componentes `WorkspaceSettings` e `OnboardingForm` com seletores de idioma, país e fuso horário, e aviso de renovação UTC.
   - Testes em `scripts/tests/region-workspace.test.mjs` (6/6 passing).

3. **Schema v2 e Publicação (Tarefa 3):**
   - Tipos de documento segregados: `SiteDocumentV1` (`schemaVersion: 1`), `SiteDocumentV2` (`schemaVersion: 2`, `locale`, `country`, `timeZone`, `whatsapp` E.164 canônico).
   - Validação separada em `src/lib/os/document-validation.ts` e versionamento em `src/lib/os/document-version.ts` (`getDocumentRegion`, `upgradeDocument`).
   - Re-exportação compatível em `src/lib/os/validation.ts`.
   - `publicDocument` em `src/lib/os/publication-utils.ts` preservando `schemaVersion` e campos regionais, sem vazar chaves de workspace.
   - `getRequestLocale()` em `src/lib/i18n/request-context.ts` e `getPublishedSite` em `src/lib/os/publication-repository.ts` deduplicados com React `cache`.
   - `SiteRenderer` adaptado para despachar telefones E.164 em documentos v2 e legados em v1.
   - Testes em `scripts/tests/region-documents.test.mjs` (7/7 passing).

4. **Geração, Prospects, Coleta e Datas (Tarefa 4):**
   - `buildCopyPrompt` e `mergeGeneratedCopy` em `src/lib/os/ai-prompts.ts` com isolamento estrito de prompt injection (dados do cliente delimitados, system instruction direcionada a idioma/país alvo, merge allowlisted que protege nome, contatos e região).
   - Testes de timezone e renovação de quotas em `scripts/tests/region-dates.test.mjs`: `usagePeriod` opera e renova estritamente em UTC.
   - Formulário de prospects e formulário de interesses aceitando telefones internacionais e nacionais com DDD.
   - Testes em `scripts/tests/region-ai.test.mjs` (4/4 passing) e `scripts/tests/region-dates.test.mjs` (2/2 passing).

---

## 2. Evidências de Execução de Testes

- `scripts/tests/region-*.test.mjs`: **29/29 passaram (100%)**.
- `npm run test:os`: **68/68 passaram (100%)**.
- `npm run test:commercial`: **30/30 passaram (100%)**.
- `npm exec -- tsc --noEmit`: **0 erros**.
- `npm run lint`: **0 erros**.
