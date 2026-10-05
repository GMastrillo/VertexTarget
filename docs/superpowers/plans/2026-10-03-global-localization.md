# Idiomas globais e SEO — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar PT/EN/ES/FR/DE/IT completos no público, auth, OS e admin, com idioma correto no HTML inicial.

**Architecture:** Núcleo puro de locales/rotas, dicionários tipados por domínio e carregamento servidor por idioma. Middleware estabelece contexto validado para o layout; rotas públicas explícitas vencem cookies, privados mantêm URLs e auth. Provider cliente recebe exatamente o locale/dicionário inicial do servidor.

**Tech Stack:** Next.js 15 App Router, TypeScript, cookies/headers servidor, React Context, Radix Dialog existente, Intl, npm, node:test.

**Spec:** [global-platform-design](../specs/2026-10-03-global-platform-design.md), seções 5 e 8. Consumes onda 1; [roteiro](2026-10-03-global-platform.md).

## Global Constraints

- Códigos públicos: `pt-BR`, `en`, `es`, `fr`, `de`, `it`. Mapear a preferência antiga `pt` para `pt-BR` sem descartar o idioma salvo.
- `/os/*`, `/login`, `/admin/*`, `/api/*`, `/auth/*` e `/sites/{slug}` mantêm contratos e URLs atuais.
- Conteúdo de negócios, nomes, propostas, comentários e textos do usuário não são traduzidos automaticamente.
- `x-default` aponta para inglês global. Nada de hostname inventado.
- Nenhuma dependência nova, bypass de auth, `any`, suppressions, baseline alterada ou arquivos novos > 350 linhas.
- Revisão humana das traduções e textos legais é gate de lançamento, não resultado presumido da geração.

## Review Focus

1. Cookie adulterado/header externo muda idioma de rota ou auth: rota é autoridade e header é sobrescrito (tarefas 1/3).
2. Seletor perde case slug, UTM ou fragmento: manter destino e parâmetros permitidos (tarefa 3).
3. Idioma misto em erro/loading/ARIA ou dicionário ausente: chaves equivalentes e fallback explícito sem falha de runtime (tarefas 2/4).
4. Redirect perde cookie renovado ou cria loop/open redirect: testar callbacks/fronteiras/Set-Cookie (tarefa 3).
5. SEO mostra pt-BR para rota alemã ou indexa privado: comparar resposta HTML e metadata, não só DOM (tarefa 5).

---

### Tarefa 1: Núcleo puro de locale e rotas

**Files:** Create `src/lib/i18n/locales.ts`, `src/lib/i18n/routing.ts`, `src/lib/i18n/types.ts`, `scripts/tests/i18n-routing.test.mjs`.

**Interfaces:** `SUPPORTED_LOCALES = ['pt-BR','en','es','fr','de','it'] as const`; `type Locale = typeof SUPPORTED_LOCALES[number]`; `normalizeLocale(input: unknown): Locale | null` aceita `pt` legado e os seis códigos, demais null. `resolveLocale(input: unknown): Locale` usa pt-BR quando inválido. `localizedPath(pathname: string, locale: Locale): string | null` trabalha apenas nas rotas públicas aprovadas; `switchLocaleHref(href: string, locale: Locale): string | null` aceita somente URL relativa local, preserva fragmento e allowlist `utm_source,utm_medium,utm_campaign,utm_term,utm_content,gclid,fbclid`, rejeita protocolo/host externo e caminhos privados. `DictionaryDomain = 'common' | 'marketing' | 'platform' | 'auth' | 'os' | 'admin' | 'legal' | 'cases'`.

- [x] Escrever testes `legacy_locale`, `invalid_cookie`, `public_only`, `slug_query_hash`, `unsafe_redirect`: assert `normalizeLocale('pt') === 'pt-BR'`, inválido null, `/os` não prefixado, `/fr/cases/case-real?utm_campaign=x#resultado` troca para `/de/cases/case-real?utm_campaign=x#resultado`, `//evil.example` e `javascript:` rejeitados. Locale de rota inválido não vira rota válida silenciosamente.
```js
assert.equal(normalizeLocale('pt'), 'pt-BR');
assert.equal(normalizeLocale('xx'), null);
assert.equal(localizedPath('/os', 'de'), null);
assert.equal(switchLocaleHref('/fr/cases/case-real?utm_campaign=x#resultado', 'de'), '/de/cases/case-real?utm_campaign=x#resultado');
assert.equal(switchLocaleHref('//evil.example', 'en'), null);
```

- [x] Executar `node --experimental-strip-types --test scripts/tests/i18n-routing.test.mjs`; confirmar RED por módulo ainda ausente.
- [x] Implementar núcleo puro sem imports Next/React/server-only; preferir URL/Intl nativos, preservando slug codificado sem dupla decodificação.
- [x] Reexecutar teste; acrescentar `%2F`, caracteres Unicode e parâmetro `next=https://evil.example`: sem redirect externo ou passagem de parâmetro não autorizado.

### Tarefa 2: Dicionários completos e carregamento

**Files:** Create `src/lib/i18n/load-dictionary.ts`, `src/lib/i18n/legacy-adapter.ts`, `scripts/tests/i18n-dictionaries.test.mjs`; módulos sob `src/lib/i18n/messages/{pt-BR,en,es,fr,de,it}/{common,marketing,platform,auth,os,admin,legal,cases}.ts` (48 caminhos resultantes desta matriz). Modify `src/lib/i18n.ts`, `src/lib/i18n-data.ts`, `src/lib/case-index-i18n.ts`, `src/lib/case-studies.ts`, `src/lib/ecosystem-content.ts`.

**Interfaces:** `DomainDictionaryMap` define cada shape em `types.ts`; `loadDictionary<D extends DictionaryDomain>(locale: Locale, domain: D): Promise<DomainDictionaryMap[D]>`, servidor com import explícito allowlisted, sem montar caminho a partir de entrada não validada. `loadDictionaries(locale: Locale, domains: readonly DictionaryDomain[]): Promise<Partial<DomainDictionaryMap>>`. Adapter mantém API `getDict`/shape legado enquanto consumidores migram; tipo `Locale` passa a reexportar núcleo, não arquivo client. Traduções/dados puros não usam `"use client"`.

- [x] Inventariar strings estáticas das telas/estados e fixar shapes por domínio; não usar índice `Record<string,string>` para esconder chaves ausentes.
- [x] Escrever teste `six_locale_key_parity`: achatar folhas de cada módulo, assert mesmas chaves/tipos/parâmetros para todos os seis idiomas, nenhuma string vazia/placeholder de tradução; invalid locale nunca importa arquivo arbitrário.
- [x] Rodar `node --experimental-strip-types --test scripts/tests/i18n-dictionaries.test.mjs`; confirmar RED antes dos novos módulos.
- [x] Migrar dados existentes e completar alemão + domínios não traduzidos nos seis idiomas, com frases reais; manter conteúdo do usuário sem tradução. Compor adapter, evitando manter monolito com seis cópias e evitando imports de todas as línguas no provider cliente.
- [x] Reexecutar teste e typecheck; comprovar bundle pelo build: componentes cliente não importam loader servidor nem todas as traduções. Paridade não equivale a revisão linguística humana.

### Tarefa 3: URLs, SSR e preferência

**Files:** Modify `src/middleware.ts`, `src/app/layout.tsx`, `src/providers/LanguageProvider.tsx`, `src/components/layout/LanguageSwitcher.tsx`, `src/components/layout/Navigation.tsx`, `src/components/layout/Footer.tsx`, `src/components/plataforma/PlataformaNav.tsx`, `src/components/os/os-shell.tsx`, `src/components/admin/AdminShell.tsx` e rotas antigas `src/app/{page.tsx,plataforma/page.tsx,cases/page.tsx,cases/[slug]/page.tsx,privacidade/page.tsx,termos/page.tsx}`. Create `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/plataforma/page.tsx`, `src/app/[locale]/cases/page.tsx`, `src/app/[locale]/cases/[slug]/page.tsx`, `src/app/[locale]/privacidade/page.tsx`, `src/app/[locale]/termos/page.tsx`, `scripts/tests/i18n-middleware.test.mjs`, `src/lib/i18n/request-context.ts`.

**Interfaces:** Cookie `vt-locale` (Path=/, SameSite=Lax, valores allowlisted; preferência não credencial). Header interno `x-vt-locale` sempre sobrescrito pelo middleware, deriva da rota pública ou cookie validado, nunca entrada externa. `getRequestLocale(): Promise<Locale>` servidor. `LanguageProviderProps = {initialLocale:Locale;dictionaries:Partial<DomainDictionaryMap>;children:ReactNode}`; `LanguageProvider(props: LanguageProviderProps)`; `useLanguage()` conserva `locale`, `setLocale`, `dict` no adapter durante migração. `useDictionary<D extends DictionaryDomain>(domain:D): DomainDictionaryMap[D]` verifica domínio carregado, falha explícita em desenvolvimento e fallback seguro localizado em produção; limite de provider de cada rota recebe todos os domínios que seus descendentes realmente consomem. Seletor usa Dialog Radix existente para lista acessível, sem instalar dropdown novo. Em público troca URL; privado salva cookie e faz refresh para SSR.

- [x] Escrever testes de política/middleware: rota `/de/plataforma` vence cookie fr e header en; legado `/plataforma?utm_source=x` retorna 308 para `/pt-BR/plataforma?utm_source=x`; `/os`, `/api`, `/auth`, `/sites` não prefixam. Cookie Supabase renovado aparece também na resposta de redirect; next externo não é aceito.
- [x] Executar `node --experimental-strip-types --test scripts/tests/i18n-middleware.test.mjs`; confirmar RED da nova política (usar fronteira pura/stubs, sem rede).
- [x] Implementar contexto e rotas; params assíncronos Next 15 validados, locale inválido 404. Preservar consulta/redirect existente da auth, copiar cookies renovados ao redirect, matcher exclui assets/_next mas cobre páginas públicas e privadas relevantes. Rotas/API não passam a depender de locale para conceder acesso.
- [x] Atualizar root `html.lang` a partir do contexto servidor; provider público carrega só domínios da rota, privados só seus domínios. Aceitar SSR dinâmico em vez de fingir export estático. Para `/sites/{slug}`, middleware sobrescreve também `x-vt-site-slug` após validar formato/comprimento do slug; `getRequestLocale()` consulta a publicação pública no servidor via repository existente/cache por request, sem credencial no middleware. Na onda 2 snapshots v1 são pt-BR; a onda 3 acrescenta resolução v2.
- [x] Migrar localStorage `vt-locale` legado somente se cookie ausente em rota sem idioma explícito; nunca sobrescrever rota pública com preferências antigas. Usar replace/refresh controlado e nenhum loop de hydration.
- [x] Rodar testes/`npm run test:os` e navegador: Tab/Escape no seletor, troca mantém página/case/UTM/hash, reload preserva idioma, roteamento protegido continua redirecionando sem sessão. Sem auth real, não declarar todos os fluxos privados testados.

### Tarefa 4: Todos os consumidores e erros

**Files:** Modify os componentes/páginas públicos, auth, OS e admin enumerados nas tarefas 2–4 de [global-theme](2026-10-03-global-theme.md), mais `src/app/os/(auth)/{cadastro,entrar,recuperar,redefinir-senha}/page.tsx`, `src/lib/os/errors.ts`, `src/lib/os/http.ts`, `src/lib/os/validation.ts`, `src/lib/os/auth-validation.ts`, `src/lib/os/ai-validation.ts`, `src/components/contact/interest-form.tsx`, `src/app/api/interesses/route.ts`. Create `src/lib/i18n/error-messages.ts`; update `scripts/tests/i18n-dictionaries.test.mjs` e testes OS/comerciais afetados.

**Interfaces:** `localizeError(code: string, dictionary: DomainDictionaryMap['common']): string` usa mensagem segura por código conhecido, fallback genérico para desconhecido. Manter payloads/enum/status HTTP e campos existentes; adicionar código estável onde erro só tem string, sem remover reason legado durante compatibilidade. Todas as labels/ARIA/erros estáticos vêm do domínio apropriado.

- [x] Adicionar teste de código desconhecido e falha de rede: fallback traduzido, nenhuma stack/SQL/raw provider error exibida; lógica não compara mensagem portuguesa.
- [x] Substituir copy estática de navegação, loading/vazio/erro, confirmações, forms, cards, tooltip e ARIA em cada área. Strings do usuário seguem inalteradas. Datas/números usam locale ativo, fuso explícito entra na onda 3.
- [x] Revisar pricing/claims/JSON-LD: OS só free, serviços sujeitos a orçamento, remover promessas/métricas sem suporte em todos os idiomas. Não traduzir uma alegação falsa como fato.
- [x] Verificar lista de seis idiomas em público/auth e áreas privadas autorizadas; relatório deve listar páginas/estados não auditados. Reexecutar paridade, `npm run test:commercial`, `npm run test:os` e typecheck.

### Tarefa 5: SEO e aceite

**Files:** Modify `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/sites/[slug]/page.tsx`, `src/app/[locale]/layout.tsx` e páginas localizadas; `src/app/admin/layout.tsx`, `src/app/os/(auth)/layout.tsx`, `src/app/os/(workspace)/layout.tsx`, `src/app/login/page.tsx`. Create `src/lib/i18n/seo.ts`, `src/lib/site-origin.ts`, `scripts/tests/i18n-seo.test.mjs`, `docs/verification/2026-10-03-global-localization.md`. Reutilizar `APP_URL`/`NEXT_PUBLIC_APP_URL` documentados em `.env.example`; não criar outra variável canônica.

**Interfaces:** `getSiteOrigin(): URL | null` valida `APP_URL` ou `NEXT_PUBLIC_APP_URL` como origem canônica HTTPS configurada (loopback permitido apenas dev); ausência não fabrica domínio/URL absoluta de produção. `publicAlternates(pathname: string, origin: URL): { canonical: string; languages: Record<Locale | 'x-default', string> }`. Metadata utiliza tradução e mesmo path; sitemap contém só variantes reais/cases existentes; privado noindex.

- [x] Escrever testes: seis alternates + x-default en, canonical alemão não pt-BR, slug preservado, origem inválida rejeitada, privado excluído do sitemap. Rodar `node --experimental-strip-types --test scripts/tests/i18n-seo.test.mjs` e confirmar RED.
- [x] Implementar metadata/OG/JSON-LD localizado e sitemap/robots com origem real; sem domínio configurado registrar blocker de lançamento, não emitir URLs inventadas.
- [x] Servir build e inspecionar HTML HTTP inicial dos seis idiomas: lang/title/description/canonical/hreflang corretos, sem depender de JS; confirmar 308 antigos e 404 locale inexistente. Sites v1 pt-BR, v2 usam idioma do documento na onda 3.
- [x] Rodar todos os testes i18n, tipos, lint, contratos, OS e build após edição final; testar 360 px com alemão/francês longos, ambos temas, teclado, reduced motion e console. Medir Lighthouse público e registrar limites da revisão legal/linguística e INP real.
