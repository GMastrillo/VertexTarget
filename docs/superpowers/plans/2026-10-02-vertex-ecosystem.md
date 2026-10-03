# Ecossistema VertexTarget + Vertex OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Use superpowers:subagent-driven-development only if real delegation tools become available and the user chooses that method. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar site de ecossistema com captação real e uma Vertex OS pública que permite criar, editar, salvar, publicar e acompanhar projetos com isolamento e limites gratuitos.

**Architecture:** Evolução do Next.js existente, com Server Components para composição/dados e client islands para interação. Supabase Auth separa usuários públicos da equipe; tabelas próprias, RLS e RPCs transacionais controlam projetos, snapshots e quotas. Templates locais renderizam documentos estruturados; Gemini auxilia textos e busca web sem executar código arbitrário.

**Tech Stack:** Next.js 15, React 18.3, TypeScript strict, npm, Tailwind CSS 4, Supabase SSR/Postgres, GSAP + Lenis, Motion, shadcn/Radix e SDK oficial Google GenAI; Node/assert e node:test para testes locais.

**Spec:** [Especificação aprovada](../specs/2026-10-02-vertex-ecosystem-design.md).

Status: aguardando revisão do plano e autorização do método de execução. Nenhuma dependência instalada, migration aplicada ou código de produto alterado nesta fase.

## Global Constraints

- Cadastro público desde o início, sem convite nem aprovação manual de novos usuários.
- Duas jornadas: empresas/líderes e profissionais/freelancers/agências.
- Confirmação de e-mail, espaço de trabalho separado do painel interno e acesso gratuito limitado sem cobrança automática.
- Um workspace próprio por usuário, sem convites nesta entrega.
- Projetos existentes: 1; sites publicados simultaneamente: 1; assistências de texto: 3 tentativas externas/mês UTC; busca web: 1 tentativa externa/mês UTC, até 10 sugestões; prospects: 50; templates: 3.
- Freio global mensal: 1.000 assistências de texto e 100 buscas; saída: 2.048 tokens; timeout: 45 s; sem loops/retries automáticos.
- Corpo: auth/interesses 8 KiB; briefing/documento 32 KiB; ações de prospect/publicação 8 KiB.
- Senha 12–128; nome 2–120; título 120; subtítulo 280; descrição 1.200; até 6 serviços, título 80 e descrição 240; CTA 40.
- pt-BR, tokens `vt-*`, Outfit + Inter; guia de 350 linhas por arquivo novo, sem novo `any`, `ts-ignore` ou `eslint-disable`.
- Formação e comunidade começam por apresentação e lista de interesse, sem LMS ou rede social.
- Sem cobrança, domínio próprio, uploads, código arbitrário, scraping, Google Maps, curso fictício ou métricas inventadas.
- Sem commit, push, PR, deploy, mudanças remotas, contas externas ou consumo de APIs pagas sem autorização específica.
- Outros trabalhos no checkout devem ser preservados; não alterar migrations 001–008 nem baselines de lint.
- SDK, shadcn e Motion exigem autorização para os comandos de instalação antes de execução; não fazer instalação global.

## Review Focus

1. Duplo clique/retry/crash entre reserva e chamada de IA: apenas um executor envia, crédito enviado não é devolvido por timeout — tarefas 5 e 9.
2. Edição aberta em duas abas e publicação de versão antiga: conflito preserva o texto e não publica silenciosamente dados diferentes dos revisados — tarefas 6, 7 e 8.
3. E-mail confirmado com metadata forjada e acesso direto ao Supabase: não ganha role/plano nem entra no admin — tarefas 3 e 4.
4. Slug adivinhado, conteúdo `</script>` e despublicação seguida de refresh: não vaza draft/PII nem executa script, página retirada vira 404 — tarefa 7.
5. Exclusão/recriação no mesmo mês e virada UTC: não renova créditos; contador reinicia somente no período seguinte — tarefas 3, 5 e 11.

## Permissões, ambiente e marcos

Método disponível: execução nativa sequencial pela Buffy, com auto-revisão por tarefa; não há ferramenta de subagentes/revisor independente neste ambiente. Não prometer revisão independente. Não criar branch/worktree por padrão.

Marcos, todos dentro desta entrega:
- A: dados/autenticação/captação isolados e verificáveis (tarefas 1–5 e 10).
- B: ciclo manual completo criar → salvar → publicar → pipeline (tarefas 6–8 e 11).
- C: IA limitada e site reposicionado (tarefas 9 e 12).
- D: gates locais e validação autorizada antes do lançamento (tarefa 13).

Se banco isolado/SMTP/CAPTCHA ainda não forem autorizados, implementar e testar o que é local; registrar integrações bloqueadas, sem anunciar marco completo ou lançamento. Obter autorização específica antes de qualquer escrita em serviços externos. Supabase deve ser acessado pelas ferramentas MCP conectadas; não por shell, scripts de administração ou chamadas avulsas do agente.

Antes de comandos de instalação ou servidores, apresentar o comando e obter permissão. Inspecionar listeners antes de escolher porta; script existente usa 3004. `package-lock.json` existe, mas a leitura foi bloqueada pela ferramenta: não alegar inspeção de seu conteúdo; conferir versões resolvidas/peer dependencies por meio permitido quando instalar.

## Mapa de arquivos e responsabilidades

Existentes a alterar:
- `package.json`, `package-lock.json`, `tsconfig.json`: dependências e scripts reais de teste, sem trocar gerenciador.
- `src/middleware.ts`, `src/lib/supabase-server.ts`: cookies/session refresh e helper servidor com fronteira server-only; não relaxar `src/lib/auth.ts`/workspace interno.
- `src/app/page.tsx`, `src/app/plataforma/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`: composição Server, SEO e aliases semânticos dos tokens.
- `src/components/layout/ClientLandingShell.tsx`, `Navigation.tsx`, `Footer.tsx`, `src/providers/SmoothScrollProvider.tsx`: shell público, entradas e acessibilidade/reduced-motion.
- `src/components/plataforma/PlataformaClientShell.tsx`, `PlataformaNav.tsx`, `PlataformaHero.tsx`, `PlatformHubSection.tsx`, `PlataformaPricing.tsx`, `PlataformaFaq.tsx`, `PlataformaFinalCta.tsx`, `TemplatesCoverflow.tsx`: narrativa real do produto e remoção de claims/WhatsApp fictício.
- `src/components/hero/HeroSection.tsx`, `src/components/home/HomePlatformHighlight.tsx`, `src/components/contact/ContactSection.tsx`, `src/components/faq/FAQSection.tsx`, `src/components/ai-lab/AILabSection.tsx`, `src/app/api/gemini/route.ts`: reposicionamento/captação e demonstração estática segura.
- `src/components/admin/AdminShell.tsx`: apenas entrada de interesses visível a owner/sales.
- `.env.example`: nomes/documentação de configuração, nunca valores reais.
- Troca mecânica dos 20 imports de `framer-motion` identificados: componentes acima e `ThemeToggle.tsx`, `LanguageSwitcher.tsx`, `CustomCursor.tsx`, `CommandPalette.tsx`, `src/components/services/ServiceCard.tsx`, `src/components/cases/CaseCard.tsx`, `CasesSection.tsx`, `src/app/cases/[slug]/CaseStudyClient.tsx`, `src/components/plataforma/PainPointsSection.tsx`, `Laptop3DShowcase.tsx`, `laptop/LaptopScreenContent.tsx`. Rebuscar no momento da execução para detectar alterações concorrentes.

Novos módulos, agrupados por responsabilidade:
- `src/lib/os/{types,policy,validation,contact,errors,config,http,auth-policy,auth,auth-service,workspace-repository,project-repository,prospect-repository,publication-repository,usage-repository,ai-service,ai-execution,ai-provider,ai-validation,editor-state}.ts`.
- `src/lib/interests/{types,validation,repository,service,rate-limit,execution}.ts` e `src/lib/{captcha,captcha-validation}.ts`.
- `src/lib/ecosystem-content.ts`: copy/navegação/status editorial próprios; não duplicar cases.
- `components.json`, `src/lib/utils.ts`, `src/components/ui/{button,dialog,tabs,accordion}.tsx`: shadcn adaptado; sem novo catálogo inteiro.
- `src/components/os/{os-shell,onboarding-form,auth-form,project-briefing,project-editor,project-fields,project-preview,site-renderer,prospect-board,prospect-form,search-results,workspace-settings,usage-summary}.tsx` e `src/components/os/use-project-draft.ts`.
- `src/components/contact/{interest-form,hcaptcha-widget}.tsx`, `src/components/admin/interests-table.tsx`, `src/components/home/{ecosystem-section,knowledge-community-section}.tsx` e `src/components/motion/section-reveal.tsx`.
- Rotas listadas nas tarefas 4 e 6–12; route groups `(auth)` e `(workspace)` dentro de `/os` para não proteger páginas de login com layout do dashboard.
- Migrations `009_os_schema.sql`, `010_os_rls.sql`, `011_os_workspaces.sql`, `012_os_projects.sql`, `013_os_usage.sql`, `014_os_publications.sql`, `015_os_prospects.sql`, `016_public_interests.sql` sob `supabase/migrations/`; dividir adicionalmente, sequencialmente, apenas se necessário ao limite de arquivo.
- `scripts/tests/os-*.test.mjs`, `scripts/tests/os-fixtures.mjs`: Node tests de contratos/lógica real; `supabase/tests/os-*.sql`: integração autorizada no banco isolado; `docs/verification/vertex-os-checklist.md`: evidências e bloqueios, não resultados presumidos.

## Contratos compartilhados

Tarefa 1 define os tipos antes de qualquer consumidor:
- `Journey = 'business' | 'professional'`; `TemplateId = 'local-services' | 'commerce' | 'consulting'`; `ThemeId = 'cyan-dark' | 'warm-light' | 'forest-light'`.
- `ParseResult<T> = {ok:true;value:T} | {ok:false;reason:string}`.
- `SiteDocument = {schemaVersion:1;templateId:TemplateId;themeId:ThemeId;businessName:string;title:string;subtitle:string;description:string;services:Array<{title:string;description:string}>;ctaLabel:string;email:string;whatsapp:string;city:string}`.
- `ProjectBriefing = {businessName:string;sector:string;city:string;objective:string;description:string;services:Array<{title:string;description:string}>;email:string;whatsapp:string;templateId:TemplateId}`.
- `ConfirmedIdentity = {userId:string;email:string}`; `OsWorkspace = {id:string;name:string;journey:Journey;status:'active'|'suspended'|'deleted';plan:'free'}`; `OsContext = ConfirmedIdentity & {workspace:OsWorkspace}`.
- `OsProject = {id:string;workspaceId:string;briefing:ProjectBriefing;document:SiteDocument;version:number;updatedAt:string}`.
- `ProspectInput = {name:string;sector:string;city:string;website:string;email:string;phone:string;notes:string}`; `ProspectStatus = 'new'|'contacted'|'proposal'|'closed'|'discarded'`; `OsProspect = ProspectInput & {id:string;status:ProspectStatus;sources:SearchSource[]}`.
- `SearchSource = {url:string;title:string}`; `SearchInput = {sector:string;city:string}`; `SearchSuggestion = {name:string;sector:string;city:string;website:string;phone:string;hypothesis:string;sources:SearchSource[]}`; `SearchResult = {suggestions:SearchSuggestion[];searchedAt:string;attributionHtml:string|null}`.
- `PublishedSite = {slug:string;document:SiteDocument;publishedAt:string}`; `UsageKind = 'copy'|'search'`; `UsageSummary = {period:string;renewsAt:string;copy:{used:number;limit:3};search:{used:number;limit:1}}`.
- `UsageReservation = {operationId:string;state:'reserved'|'sent'|'completed'|'failed';executor:boolean}`; `OperationCompletion = {status:'completed'|'failed';tokens:number;latencyMs:number;errorCode:string|null}`.
- `OsErrorCode = 'invalid'|'unauthenticated'|'forbidden'|'not-found'|'conflict'|'too-large'|'media-type'|'limited'|'unavailable'`; `OsError` leva code/status e mensagem sanitizada.
- `OsConfig = {appUrl:string;geminiKey:string|null;geminiModel:'gemini-3.8-flash';hcaptchaSiteKey:string|null;hcaptchaSecret:string|null;requestLimitSecret:string|null;authRecoverySecret:string|null;globalCopyLimit:number;globalSearchLimit:number;trustedProxy:'vercel'|'cloudflare'|'none'}`; validar cada capacidade apenas quando usada, para ausência de Gemini não bloquear editor manual.
- `DraftState = {document:SiteDocument;savedDocument:SiteDocument;version:number;revision:number;savingRevision:number|null;dirty:boolean;status:'idle'|'saving'|'saved'|'error'|'conflict'}`; `DraftEvent` é união de `{type:'edit';document:SiteDocument}`, `{type:'save-start'}`, `{type:'save-ok';project:OsProject;revision:number}`, `{type:'save-error';conflict:boolean}`, `{type:'apply-suggestion';document:SiteDocument;expectedRevision:number}`.
- `InterestInput = {name:string;email:string;whatsapp:string;journey:Journey;interest:'solutions'|'education'|'community';message:string;marketingConsent:boolean;noticeVersion:string;source:'home-contact'|'education'|'community'|'platform';idempotencyKey:string;honeypot:string;captchaToken:string}`.
- `InterestRecord = Omit<InterestInput,'honeypot'|'captchaToken'|'idempotencyKey'> & {id:string;createdAt:string}`.

Imports runtime entre módulos puros usam relativos `.ts`, compatíveis com Node strip-types; adicionar `allowImportingTsExtensions:true` ao tsconfig com `noEmit`. Node tests importam só módulos puros/controladores com dependências explícitas (callbacks), sem resolver aliases Next, TSX ou carregar módulos server-only/React. A camada servidor usa os mesmos controladores testados, não cópias. Testes HTTP puros usam Request/Response nativos; integração de cookies/Supabase/renderer é SQL/Preview quando autorizada. Não instalar runner extra só para TSX. Nenhum teste local contata Supabase/Gemini/hCaptcha.

---

### Task 1: Contratos, limites e validação testável

**Files:** criar `src/lib/os/{types,policy,validation,contact,errors,http,config}.ts`, `src/lib/interests/{types,validation}.ts`, `scripts/tests/os-contracts.test.mjs`, `scripts/tests/os-http.test.mjs`, `scripts/tests/os-fixtures.mjs`; modificar `package.json`, `tsconfig.json`. HTTP puro e config tipada aqui são dependências de captação/Auth, não criação de rotas antecipada.

**Interfaces:** `parseSiteDocument(input:unknown):ParseResult<SiteDocument>`, `parseProjectBriefing(input:unknown):ParseResult<ProjectBriefing>`, `parseProspectInput(input:unknown):ParseResult<ProspectInput>`, `parseInterestInput(input:unknown):ParseResult<InterestInput>`, `normalizeBrazilianPhone(input:string):string|null`, `usagePeriod(now:Date):{period:string;renewsAt:string}`. `FREE_LIMITS` contém os valores da seção Global Constraints. `readLimitedJson(request:Request,maxBytes:number):Promise<unknown>` e `requireCanonicalOrigin(request:Request,appUrl:string):void` são helpers puros; `getOsConfig():OsConfig` permanece server-only e valida env por narrowing em runtime, sem chave no bundle.

- [ ] Escrever testes: `parseSiteDocument(validDocument).ok === true`; 7 serviços, título 121, `ownerId`/`workspaceId`/chaves extras e tema desconhecido retornam false; `normalizeBrazilianPhone('(11) 99999-9999') === '5511999999999'`; URL `javascript:` e controles invisíveis falham; `usagePeriod(new Date('2026-10-31T23:59:59Z')).renewsAt === '2026-11-01T00:00:00.000Z'`.
- [ ] Rodar `node --experimental-strip-types --test scripts/tests/os-contracts.test.mjs`; esperar FAIL por módulos ausentes/testes vermelhos.
- [ ] Implementar funções puras com allowlist de propriedades, limites e normalização; incluir testes HTTP de stream acima de 8 KiB, Content-Length enganoso e origem externa/canônica; verificar que helpers interrompem leitura excessiva e não dependem de Origin/Host não confiável. Implementar config com flags por capacidade e segredos server-only; preservar texto Unicode legítimo, não confundir escape de React com execução de HTML. Definir fixture `validDocument`/`validBriefing`/`validInterest` sem métricas/depoimentos fictícios. Novo script `test:os = node --experimental-strip-types --test scripts/tests/os-*.test.mjs`.
- [ ] Rodar `npm run test:os` e `npm exec -- tsc --noEmit`; esperar PASS/exit 0. Limites e erros possuem uma única fonte, sem inputs de plano/owner aceitos.

### Task 2: Primitivos acessíveis e compatibilidade da stack

**Files:** modificar dependências/lock, todos os imports Motion no mapa e `src/app/globals.css`; criar `components.json`, `src/lib/utils.ts`, quatro primitivos shadcn e `scripts/tests/os-ui-contracts.test.mjs`.

**Interfaces:** `cn(...inputs:ClassValue[]):string` com clsx + tailwind-merge permitidos; primitivos exportam composição oficial `Button`, `Dialog*`, `Tabs*`, `Accordion*`. Sem nomes de registry adivinhados.

- [ ] Criar teste de fonte que espera zero imports diretos `from 'framer-motion'` no `src`, imports `motion/react` nos consumidores e quatro arquivos de primitivos presentes. Rodar comando da tarefa 1; esperar FAIL no legado. Este é contrato de stack, não prova acessibilidade.
- [ ] Confirmar versões compatíveis com React 18.3/Node do workspace na documentação/package metadata. Pedir autorização dos comandos exatos de instalação antes de executá-los. Instalar somente Motion, Google GenAI, utilitários/primitivos necessários; remover dependência direta framer-motion na mesma alteração de package, sem estado intermediário que quebre o app.
- [ ] Configurar shadcn com `new-york`, rsc/tsx true, Tailwind config vazio, CSS `src/app/globals.css`, aliases `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`; consultar esquema/CLI vigente antes de confirmar formato. Com permissão, usar `npx --yes shadcn@latest add button dialog tabs accordion --yes --dry-run` e revisar; executar a mesma adição sem dry-run somente após revisar os efeitos e sem overwrite. Se o CLI exigir dependência fora da stack permitida, portar a variante oficial Radix manualmente, não forçar instalação.
- [ ] Aliases semânticos em `@theme inline` referenciam `vt-*`; não substituir o reset/paleta/fontes globais. Comentar origem dos primitivos. Rodar `npm run test:os`, tipos/lint/build; esperar exit 0 e reportar avisos existentes. Regressão visual de `/cases`/cursor/templates na tarefa 13.

### Task 3: Fundação SQL, RLS e lifecycle do workspace

**Files:** migrations 009–011; `src/lib/os/{auth-policy,auth,workspace-repository}.ts`; `supabase/tests/os-access.sql`, `os-workspaces.sql`; `scripts/tests/os-access.test.mjs`.

**Interfaces:** `confirmedIdentity(input:unknown):ConfirmedIdentity|null` e `assertActiveWorkspace(identity:ConfirmedIdentity,workspace:OsWorkspace|null):OsContext` em auth-policy puro, consumidos por auth servidor; `getConfirmedIdentity():Promise<ConfirmedIdentity|null>`; `requireOsContext():Promise<OsContext>`; `ensureWorkspace(input:{name:string;journey:Journey;noticeVersion:string;termsAccepted:true}):Promise<OsWorkspace>`; `getWorkspace():Promise<OsWorkspace|null>`; `updateWorkspace(input:{name:string;journey:Journey}):Promise<OsWorkspace>`; `deleteWorkspaceAfterReauthentication(password:string):Promise<void>`.

SQL contratos: `os_ensure_workspace(p_user_id uuid,p_name text,p_journey text,p_notice_version text) returns jsonb`; `os_update_workspace(p_user_id uuid,p_name text,p_journey text) returns jsonb`; `os_delete_workspace(p_user_id uuid) returns void`. Serviço passa p_user_id verificado, nunca do body. Funções verificam Auth confirmado/owner/status no banco.

- [ ] Escrever teste local do guard aplicado pelo serviço: identidade sem confirmação e workspace suspenso falham; metadata `role:'owner'` não participa do contexto. Escrever SQL de integração que como A vê só A, como B não vê A, anon não lê privados, funções mutantes não têm execute para anon/authenticated, metadata forjada não cria membro interno.
- [ ] Rodar `npm run test:os`; esperar FAIL antes de auth/guard. SQL só rodar após autorização explícita em projeto isolado via Supabase MCP; sem autorização registrar pendência, sem fingir vermelho/verde de banco.
- [ ] Migration 009 cria todas as tabelas `os_*` da spec e constraints estruturais; 010 adiciona RLS/grants; 011 cria lifecycle workspace. Migration 016 cria tabelas `public_interests`/limites e suas funções/policies. As migrations posteriores implementam RPCs de cada recurso sobre tabelas já existentes, sem funções referenciando tabelas ainda ausentes. Criar RLS com owner confirmado, plano/status imutáveis ao público, FK composta e grants revogados. Onboarding idempotente usa owner UNIQUE; excluído é tombstone sem conteúdo, suspensão não pode ser revertida pelo usuário. Consentimentos e uso por identidade sobrevivem à exclusão do conteúdo, sem cascades destrutivos de crédito.
- [ ] Implementar os serviços server-only usando helpers existentes, adicionando `import 'server-only'` ao helper de admin se compatível com seus imports atuais. Reautenticação exige senha atual antes de apagar conteúdo/assinalar tombstone; não registrar senha. Rodar local tests/tipos/lint; integração autorizada deve comprovar duplo onboarding → um ID, apagar → snapshots/prospects/projetos ausentes e consumo preservado.

### Task 4: Auth público, recuperação e roteamento SSR

**Files:** `src/lib/os/{auth-service,http,config}.ts`; `src/components/os/auth-form.tsx`; páginas `src/app/os/(auth)/{cadastro,entrar,recuperar,redefinir-senha}/page.tsx`; callbacks `src/app/auth/{confirm,callback}/route.ts`; APIs `src/app/api/os/auth/{signup,login,logout,resend,recover,password}/route.ts`; modificar middleware; testes `os-auth.test.mjs`, `os-http.test.mjs`.

**Interfaces:** `allowedOsReturnPath(input:unknown):string` (fallback `/os`); `readLimitedJson(request:Request,maxBytes:number):Promise<unknown>`; `requireCanonicalOrigin(request:Request,appUrl:string):void`; `getOsConfig():OsConfig` (config tipada server-only). `signup(input:{name:string;email:string;password:string;captchaToken:string;termsAccepted:true;noticeVersion:string}):Promise<void>`, `login(input:{email:string;password:string;captchaToken:string}):Promise<void>`, `resendConfirmation(input:{email:string;captchaToken:string}):Promise<void>`, `recoverPassword(input:{email:string;captchaToken:string}):Promise<void>`, `setRecoveredPassword(password:string):Promise<void>`, `logout():Promise<void>`.

- [ ] Testes vermelhos de auth-policy/http puros: `allowedOsReturnPath('//evil.test') === '/os'`, barra invertida/URL externa/admin/encoding ambíguo falham; stream de 8.193 bytes com Content-Length falso aborta antes de acumular; credenciais 12/128 aceitas e 11/129 rejeitadas por `parseAuthInput(input:unknown):ParseResult<AuthInput>` (AuthInput é união das ações signup/login/resend/recover/password/logout, definido na validation). `safeAuthMessage(error:unknown):string` não inclui erro raw/segredo. Cookies em redirects são cenário SSR do checklist da tarefa 13, não teste puro.
- [ ] Rodar `npm run test:os`; esperar FAIL. Guards/parse reais são os consumidos pelo serviço; não duplicar lógica no teste.
- [ ] Implementar signUp/verifyOtp/exchangeCode conforme docs Supabase e `getUser`; callbacks com allowlist e erro recuperável; recuperação com destino fixo e autorização verificada, sem usar rota da equipe. Usar template de recuperação com token_hash/type=recovery verificado no servidor; emitir prova de até 10 minutos HttpOnly/Secure/SameSite vinculada à sessão e finalidade após verificação, assinada com AUTH_RECOVERY_SECRET servidor e revogada ao trocar senha. Nenhum token access/refresh fica no conteúdo exposto ao cliente; reiniciar recuperação se prova expirou. `getUser()` sozinho não prova sessão de recuperação; nunca confiar no evento client ou metadata para essa finalidade. Middleware exclui `(auth)` da exigência de workspace, refresca sessão de `/os` e mantém verificação interna intacta. Adicionar `server-only`, configuração canônica e leitura de body por stream.
- [ ] Criar UI com labels/autocomplete/aria-live; CAPTCHA da tarefa 10 pode ser consumido pela interface abaixo, sem habilitar bypass temporário. Rodar testes/tipos/lint. E2E cadastro/reenvio/recuperação depende da tarefa 10 e ambiente Auth/SMTP autorizado, não considerado concluído por mocks.

### Task 5: Quotas atômicas e idempotência

**Files:** `013_os_usage.sql`; `src/lib/os/usage-repository.ts`, `src/lib/os/ai-execution.ts`; `scripts/tests/os-usage.test.mjs`; `supabase/tests/os-usage.sql`, `os-usage-concurrency.sql`.

**Interfaces:** controlador puro `executeMetered<T>(ports:MeteredPorts<T>):Promise<T>` em ai-execution, consumido pelo ai-service. `MeteredPorts<T> = {reserve:()=>Promise<UsageReservation>;markSent:(id:string)=>Promise<boolean>;send:()=>Promise<{value:T;tokens:number}>;complete:(id:string,result:OperationCompletion)=>Promise<void>;release:(id:string)=>Promise<void>;now:()=>number}`. Só executor true segue para mark/send; respostas não executoras geram estado explícito (409 operation-pending enquanto em andamento ou operation-already-processed depois de finalizar), não resultado inventado. Sem persistir resultado de copy, retry nunca refaz a chamada; UI conserva a resposta recebida e explica o caso de resposta perdida. `reserveUsage(ctx:OsContext,input:{kind:UsageKind;key:string;payloadHash:string}):Promise<UsageReservation>`; `markUsageSent(ctx:OsContext,operationId:string):Promise<boolean>`; `completeUsage(ctx:OsContext,operationId:string,input:OperationCompletion):Promise<void>`; `releaseUnsentUsage(ctx:OsContext,operationId:string):Promise<void>`; `getUsageSummary(ctx:OsContext):Promise<UsageSummary>`. SQL `os_reserve_usage(p_user_id uuid,p_kind text,p_key uuid,p_payload_hash text,p_global_limit integer) returns jsonb`, `os_mark_usage_sent(p_user_id uuid,p_operation_id uuid) returns boolean`, `os_complete_usage(p_user_id uuid,p_operation_id uuid,p_result jsonb) returns void`, `os_release_unsent_usage(p_user_id uuid,p_operation_id uuid) returns void`, `os_get_usage(p_user_id uuid) returns jsonb`.

- [ ] Testes locais: período UTC correto; uma reserva não executora nunca chama mark/send; timeout após mark não chama release; mesma key/hash volta à mesma operação e key com hash diferente é 409. SQL afirma 4ª copy rejeitada, 2ª busca rejeitada, owner estrangeiro rejeitado, freio global aplicado e erro transacional sem incremento parcial.
- [ ] Rodar testes locais; esperar FAIL. Preparar fixture SQL sem dados pessoais e separada da produção. Concorrência só com permissão: duas chamadas MCP independentes para último crédito, comprovar que somente uma recebe executor true; não usar transação única como prova concorrente.
- [ ] Implementar counters por Auth/período/global com locks em ordem estável, key UNIQUE, CAS de reservado → enviado e executor único. Marca enviada é irreversível para liberação; no crash reservar como pendente/falhou sem retry automático. Limites de instalação são config servidor validada, não body.
- [ ] Rodar `npm run test:os`/tipos/lint; executar integração autorizada e provar exclusão/recriação ainda mostra 3 usados no mesmo mês, virada de mês → zero, resposta de banco ausente → 503 sem chamada externa. Sem banco, marcar apenas testes puros/serviço como aprovados.

### Task 6: Projeto manual persistente e documento validado

**Files:** `012_os_projects.sql`; `src/lib/os/project-repository.ts`; API `src/app/api/os/projects/route.ts`; páginas `src/app/os/(workspace)/layout.tsx`, `page.tsx`, `projetos/novo/page.tsx`, `projetos/[id]/page.tsx`; componentes `os-shell`, `onboarding-form`, `project-briefing`, `usage-summary`; testes `os-projects.test.mjs`, SQL `os-projects.sql`.

**Interfaces:** `listProjects(ctx:OsContext):Promise<OsProject[]>`, `getProject(ctx:OsContext,id:string):Promise<OsProject>`, `createProject(ctx:OsContext,input:{briefing:ProjectBriefing;prospectId?:string}):Promise<OsProject>`, `saveProject(ctx:OsContext,input:{id:string;expectedVersion:number;document:SiteDocument}):Promise<OsProject>`, `deleteProject(ctx:OsContext,id:string):Promise<void>`; `documentFromBriefing(briefing:ProjectBriefing):SiteDocument`. SQL `os_create_project(p_user_id uuid,p_briefing jsonb,p_document jsonb,p_prospect_id uuid default null) returns jsonb`, `os_save_project(p_user_id uuid,p_project_id uuid,p_expected_version integer,p_document jsonb) returns jsonb`, `os_delete_project(p_user_id uuid,p_project_id uuid) returns void`.

- [ ] Teste vermelho de documentFromBriefing por briefing sem métricas inventadas, template inválido, id estranho e body com workspace forjado. Resultado de save é conferido em teste RPC/API autorizado: usar versão devolvida pelo banco, não incremento otimista local; SQL: primeira criação aceita, segunda rejeitada, dois saves na v1 resultam em uma v2 e um conflito.
- [ ] Rodar `npm run test:os`; esperar FAIL. Não simular isolamento com objetos ad hoc; usar RPC real no teste SQL autorizado.
- [ ] Implementar CRUD com UNIQUE(workspace), validação dupla no serviço/RPC, owner/status confirmado; leituras com client sessão e RLS, writes RPC server-only. Prospect referência composta deve estar no mesmo workspace. Exclusão de projeto remove publicação em transação.
- [ ] Implementar dashboard/onboarding/briefing e estados vazios/503, rotas em group protegido, sem Lenis/preloader. Rodar testes/tipos/lint; SQL autorizado comprova GET estrangeiro → ausência, ligação prospect estrangeiro rejeitada, primeira sessão cria e próxima reabre dados reais.

### Task 7: Renderer e snapshot público seguro

**Files:** `014_os_publications.sql`; `src/lib/os/publication-repository.ts`; `src/components/os/site-renderer.tsx`; API `src/app/api/os/publications/route.ts`; `src/app/sites/[slug]/page.tsx`; testes `os-publication.test.mjs`, SQL `os-publications.sql`.

**Interfaces:** `SiteRenderer(props:{document:SiteDocument;preview?:boolean}):React.JSX.Element`; `publishProject(ctx:OsContext,input:{id:string;expectedVersion:number;contentAccepted:true}):Promise<PublishedSite>`; `unpublishProject(ctx:OsContext,id:string):Promise<void>`; `getPublishedSite(slug:string):Promise<PublishedSite|null>`. SQL `os_publish_project(p_user_id uuid,p_project_id uuid,p_expected_version integer,p_slug text) returns jsonb`, `os_unpublish_project(p_user_id uuid,p_project_id uuid) returns void`, `os_read_publication(p_slug text) returns jsonb` (só snapshot permitido, sem SETOF tabela).

- [ ] Testes vermelhos: documento com `</script><script>alert(1)</script>` renderizado como texto escapado; nenhum campo privado do projeto no DTO publicado; telefone/CTA link normalizado. SQL: draft v2 não muda snapshot v1, publish esperando v1 sobre draft v2 conflita, blocked/suspended não resolve slug, anon não SELECT direto de publicação/draft.
- [ ] Rodar `npm run test:os`; esperar FAIL. Testes Node validam whitelist/links com `publicDocument(input:SiteDocument):SiteDocument` e `contactHref(input:{email:string;whatsapp:string}):string|null` puros usados no renderer. Escape/TSX/script e ausência de PII no HTML são verificações de build/Preview da tarefa 13, não tentar importar TSX com strip-types.
- [ ] Implementar três composições reais do renderer e três presets contrastantes, sem conteúdo dummy publicado, sem mídia remota. Publicação servidor gera slug com crypto/sufixo, trata colisão com nova tentativa curta (sem chamar IA), lock/version/cópia whitelist e único ativo. Confirmação de conteúdo explícita.
- [ ] Rota dinâmica/no-store; 404 se ausente/retirada; metadata por snapshot seguro. Rodar tests/tipos/build; SQL autorizado e browser verificam publicação anônima, edição do draft, despublicação/refresh e remoção por suspensão, sem informação privada no HTML/JSON.

### Task 8: Editor com prévia e proteção contra perda de dados

**Files:** `src/components/os/{project-editor,project-fields,project-preview}.tsx`, `use-project-draft.ts`; `scripts/tests/os-editor-state.test.mjs`; página de projeto da tarefa 6.

**Interfaces:** `ProjectEditor(props:{project:OsProject;usage:UsageSummary;publication:PublishedSite|null}):React.JSX.Element`; `useProjectDraft(project:OsProject):{document:SiteDocument;dirty:boolean;status:'idle'|'saving'|'saved'|'error'|'conflict';update:(document:SiteDocument)=>void;save:()=>Promise<void>;acceptSuggestion:(document:SiteDocument)=>void}`; extrair reducer puro `reduceDraft(state:DraftState,event:DraftEvent):DraftState` em `src/lib/os/editor-state.ts` para testes.

- [ ] Teste vermelho do reducer real: salvar v1 falha → texto editado/dirty conservados; conflito → não sobrescreve; usuário edita durante save → ACK anterior não limpa nova edição; sugestão só muda draft ao aceitar; versão stale de IA não sobrescreve edição recente.
- [ ] Rodar `npm run test:os`; esperar FAIL. Fixture de estados usa validDocument da tarefa 1.
- [ ] Implementar campos/tabs de prévia usando o renderer único; aba mobile 360 px quando viewport comporta, sem overflow em 360 px; saving explícito, erro/conflict recuperável, aviso beforeunload com cleanup e confirmação shadcn nas navegações internas controladas. Não prometer bloquear todos os meios do browser (popstate/bfcache) sem testar; não persistir conteúdo privado em localStorage.
- [ ] Publicar só documento salvo/versionado e consentido; dirty pede salvar/revisar antes. Rodar testes/tipos/lint e browser teclado/campos/preview/falha/duas abas com fixture real no ambiente autorizado. Botão de IA espera tarefa 9, não retorna sugestão fake.

### Task 9: Copy IA e busca grounded com freio de custo

**Files:** `src/lib/os/{ai-service,ai-provider,ai-validation}.ts`; `src/app/api/os/ai/route.ts`; `src/components/os/search-results.tsx`; testes `os-ai.test.mjs`, `os-grounding.test.mjs`; atualizar editor/usage; modificar demo legado e remover SDK antigo se sem referências.

**Interfaces:** `generateCopy(ctx:OsContext,input:{projectId:string;expectedVersion:number;key:string}):Promise<SiteDocument>`; `searchProspects(ctx:OsContext,input:SearchInput & {key:string}):Promise<SearchResult>`; `requestCopy(input:{briefing:ProjectBriefing;document:SiteDocument}):Promise<{document:SiteDocument;tokens:number}>`; `requestGroundedSearch(input:SearchInput):Promise<{result:SearchResult;tokens:number}>`; `parseGroundedResult(input:unknown):ParseResult<SearchResult>`.

- [ ] Testes vermelhos do controlador real executeMetered com callbacks de quota/provider: 429/timeout/invalid JSON preservam draft e contam chamada já enviada; reserved executor false faz zero sends; markSent false faz zero sends; falha de quota zero sends; key conflitante zero sends; suggestions sem fonte descartadas, resultado vazio não vira empresa fictícia; URL de fonte javascript/data rejeitada.
- [ ] Rodar `npm run test:os`; esperar FAIL. Não chamar Gemini para obter vermelho; não usar key real em teste unitário.
- [ ] Ler documentação oficial atual de SDK, structured output, Search attribution e max tool calls; implementar `@google/genai` com modelo reconfirmado, 2.048 tokens/45 s/no retry automático. SHA-256 payload canonical por operação; reservas SQL da tarefa 5. Sem controle de tool calls/atribuição verificado, busca fica bloqueada explicitamente e etapa de busca não passa no aceite. Provider recebe somente briefing/documento necessários e config servidor; output novamente parseado.
- [ ] Copy sugerida revisável; SearchSuggestions retornam fontes/data/hipótese e importação manual pela tarefa 11. Sandbox de attribution não admite scripts/top navigation/acesso ao host; conteúdo de provedor não entra no renderer. Demo `/api/gemini` deixa de chamar provider: exemplo estático identificado e CTA OS, ou resposta de migração explícita a callers antigos; remover import antigo e dependência se não houver outros consumidores.
- [ ] Rodar tests/tipos/lint/build. Smoke real apenas com autorização de consumo e credenciais configuradas; demonstrar contadores e erro/fallback sem fabricar resultado. Não tratar validação de JSON como prova de veracidade das empresas.

### Task 10: Interesse persistido, CAPTCHA e consulta da equipe

**Files:** `016_public_interests.sql`, `src/lib/interests/{repository,service,rate-limit,execution}.ts`, `src/lib/{captcha,captcha-validation}.ts`; `src/components/contact/{interest-form,hcaptcha-widget}.tsx`; APIs `src/app/api/interesses/route.ts`, `src/app/api/admin/interesses/route.ts`; página `src/app/admin/interesses/page.tsx`; `src/components/admin/interests-table.tsx`; modificar link condicional AdminShell/ContactSection; tests `os-interests.test.mjs`, `os-captcha.test.mjs`, SQL `os-interests.sql`.

**Interfaces:** `verifyCaptcha(input:{token:string;expectedHostname:string}):Promise<boolean>`; `HcaptchaWidget(props:{onToken:(token:string|null)=>void;resetKey:number}):React.JSX.Element`; `submitInterest(request:Request,input:InterestInput):Promise<void>`; `listInterests():Promise<InterestRecord[]>` (deriva equipe no serviço); `reserveInterestRequest(input:{ipHash:string;emailHash:string;key:string;payloadHash:string}):Promise<'new'|'replay'>`: replay significa insert já confirmado; reserva ainda sem insert confirmado gera conflito em andamento ou retomada autorizada pelo CAS, nunca sucesso falso. SQL `interest_reserve_request(p_ip_hash text,p_email_hash text,p_key uuid,p_payload_hash text) returns jsonb`, `interest_save(p_key uuid,p_payload_hash text,p_record jsonb) returns void`, `interest_list() returns setof public.public_interests` limitado a owner/sales validados no banco.

- [ ] Testes vermelhos: e-mail/telefone BR inválidos, honeypot preenchido, marketing default false, token ausente/expirado/hostname diferente, sexto IP em 15 min e quarto e-mail/hora bloqueados; insert falha não retorna sucesso; mesma key/payload não duplica; key/payload diferente 409; cliente/finance não lista dados.
- [ ] Rodar `npm run test:os`; esperar FAIL. Testar parsing e `isValidCaptchaResponse(input:unknown,expectedHostname:string):boolean` puro (src/lib/captcha-validation.ts) usado pelo servidor; fluxo persistente por `executeInterest(input:InterestInput,ports:InterestPorts):Promise<void>` em src/lib/interests/execution.ts, onde `InterestPorts = {reserve:()=>Promise<'new'|'replay'>;verify:()=>Promise<boolean>;save:()=>Promise<void>}`. Guard de origem/parse antes do controlador; replay já salvo não precisa consumir novo token. SQL preparado verifica RLS/grants e concorrência dos limites, sem execução remota ainda.
- [ ] Implementar hCaptcha via script oficial carregado ao interagir com formulário, render/reset/remove com cleanup e script compartilhado sem duplicar callbacks; tokens únicos encaminhados ao Supabase Auth ou siteverify, nunca validados duas vezes na mesma ação. Falha de config/provedor bloqueia. HMAC de IP/e-mail com REQUEST_LIMIT_SECRET e proxy confiável configurado; quotas DB não Map.
- [ ] Persistência restrita, retry idempotente confirmado pelo hash e resposta genérica sem PII; liberar retry de erro anterior sem criar sucesso simulado. Consulta interna usa usuário confirmado + owner/sales, não organization_id do visitante. Campo/erro com labels/aria-live, preservar texto ao falhar; WhatsApp só quando real/configurado. Rodar testes/tipos/lint e SQL autorizado; browser consentimento/erro/submit/retry.

### Task 11: Pipeline manual e configurações do workspace

**Files:** `015_os_prospects.sql`, `src/lib/os/prospect-repository.ts`; APIs `src/app/api/os/{prospects,workspace}/route.ts`; páginas `src/app/os/(workspace)/{prospects,configuracoes}/page.tsx`; componentes `prospect-board`, `prospect-form`, `workspace-settings`; testes `os-prospects.test.mjs`, SQL `os-prospects.sql`.

**Interfaces:** `listProspects(ctx:OsContext):Promise<OsProspect[]>`, `createProspect(ctx:OsContext,input:ProspectInput & {sources?:SearchSource[]}):Promise<OsProspect>`, `updateProspect(ctx:OsContext,input:{id:string;data:ProspectInput}):Promise<OsProspect>`, `moveProspect(ctx:OsContext,input:{id:string;status:ProspectStatus}):Promise<void>`, `deleteProspect(ctx:OsContext,id:string):Promise<void>`. SQL `os_create_prospect(p_user_id uuid,p_input jsonb) returns jsonb`, `os_update_prospect(p_user_id uuid,p_id uuid,p_input jsonb) returns jsonb`, `os_move_prospect(p_user_id uuid,p_id uuid,p_status text) returns void`, `os_delete_prospect(p_user_id uuid,p_id uuid) returns void`.

- [ ] Testes vermelhos de status/inputs, notas privadas fora do documento e importação só por clique/validação; closed não chama Stripe/CRM. SQL: 50 permitidos/51º rejeitado, corrida 49 → somente um insert adicional, user B não move/exclui A.
- [ ] Rodar `npm run test:os`; esperar FAIL. Fixture prospect manual sem obrigação de contato/site.
- [ ] Implementar RPCs com lock workspace/contagem e FK composta para referência por projeto. UI com lista/colunas acessíveis e select de estado, sem drag necessário; criar projeto a partir do prospect confirma campos públicos, sem importar notas. Integração de sugestões aceita somente dados revisados, não todos automaticamente.
- [ ] Configurações usam serviços da tarefa 3 e uso da tarefa 5; excluir pede reautenticação/confirm dialog, não apaga Auth nem reseta quota. Rodar testes/tipos/lint; integração autorizada de delete/recreate, suspensão, e pipeline sem banco/IA com erro explícito/manual disponível quando banco ativo.

### Task 12: Site de ecossistema, produto real e SEO

**Files:** páginas/layout/shells/seções públicas do mapa; criar `ecosystem-content.ts`, duas seções home e `section-reveal.tsx`; `src/app/{privacidade,termos}/page.tsx`, `src/app/{sitemap,robots}.ts`; `.env.example`; tests `os-marketing.test.mjs`.

**Interfaces:** `ECOSYSTEM_NAV:Array<{label:string;href:string}>`; `ECOSYSTEM_AREAS:Array<{id:string;title:string;status:'available'|'preparing';description:string;href:string}>`; `SectionReveal(props:{children:React.ReactNode;className?:string}):React.JSX.Element`. Retirar idioma apenas nas rotas reposicionadas, sem alterar idioma dos cases; tokens/fontes originais.

- [ ] Teste vermelho sobre content/config/rotas: education/community status preparing, OS CTA `/os/cadastro`, preços 697/897 e claims Maps/<1 minuto inexistentes no marketing ativo/metadata/schema; ausência de WA config não gera número fictício; plano gratuito usa FREE_LIMITS. Verificar que cases preservam seus IDs/URLs sem afirmar seus números como novos resultados.
- [ ] Rodar `npm run test:os`; esperar FAIL nas claims atuais. Evidência de copy nos arquivos ativos, não exigir remoção destrutiva de páginas/cases não relacionadas.
- [ ] Reposicionar hero/nav/highlight/home com duas jornadas, execução/conhecimento/ferramenta/conexões; retirar bandas/depoimentos sem comprovação da composição nova, não apagar dados de origem. `/plataforma` descreve três templates/editor/manual/IA limitada/pipeline e free sem checkout; CTA de cadastro e entrada separados de `/login`. Reutilizar composições existentes; não mostrar caros laptops/WebGL como requisito ao LCP.
- [ ] Usar FAQ shadcn, menu mobile Dialog com foco/escape e Lenis stop/start quando necessário; provider reage à preferência alterada, GSAP matchMedia cleanup e refresh quando assets/fontes carregarem. Rodapé sem href # para perfis não configurados. Conteúdo inicial visível sem JS, efeitos contidos via motionTokens e fallback mobile/coarse. Ao corrigir scroll/animação, entregar o componente refatorado inteiro para substituição rápida conforme AGENTS.
- [ ] Metadata/canonical a partir da URL canônica, sitemap sem rotas privadas/rascunhos e robots sem usar bloqueio como segurança; sites publicados indexáveis só se permitido/ativo, sem enumerar privados. Termos/privacidade operacionais incluem dados/provedores/quotas/contato e revisão jurídica pendente; não inventar CNPJ/política empresarial. `.env.example` documenta GEMINI_API_KEY/compat legado/model, APP_URL, HCAPTCHA, REQUEST_LIMIT_SECRET, AUTH_RECOVERY_SECRET, budgets e número WhatsApp; não ler `.env.local`. Rodar testes/tipos/lint/build e inspeção visual na tarefa 13.

### Task 13: Integração final, segurança e evidências de entrega

**Files:** `next.config.ts`, middleware para CSP nonce quando necessário; `scripts/tests/os-security.test.mjs`; `docs/verification/vertex-os-checklist.md`.

**Interfaces:** headers novos não alteram contratos de domínio. Preservar nosniff/referrer/HSTS existentes; CSP de rotas novas define frame/script/connect hosts mínimos para Next/hCaptcha, sem liberar HTML do usuário. Nonce exige renderização dinâmica quando usado, não política estrita incompatível com static Next.

- [ ] Escrever teste vermelho de headers/origin/body/no-store/noindex e audit de módulos client sem service role/key. Rodar `npm run test:os`; esperar FAIL antes de CSP/finalização; não usar regex como prova única de ausência de segredo, conferir bundle gerado por ferramenta de busca.
- [ ] Implementar headers com CSP compatível e validar CAPTCHA/GSAP/preview; framing DENY preservado para app, iframe de attribution isolado se necessário. Corrigir somente problemas deste escopo; sem burndown/refatoração global.
- [ ] Rodar `npm run test:os`, `npm run test:commercial`, `npm exec -- tsc --noEmit`, `npm run lint`, `npm run build`; ler saída, esperar zero erros e registrar avisos/bloqueios reais. Contratos comerciais existentes não são prova de isolamento/concorrência.
- [ ] Com autorização de dev server e listeners conferidos, abrir Preview: desktop/360 px, teclado/tab/escape, temas, reduced-motion antes/depois, Strict Mode, menu com scroll restaurado, prévia e navegação; console/network sem erros de hidratação. Regressão em cases e fluxos admin existentes; nenhuma chamada paga inesperada no site público.
- [ ] Com autorização específica e banco isolado identificado, aplicar somente migrations novas após verificar pré-requisitos via MCP e executar SQL tests/duas conexões de concorrência; verificar configurações Auth/SMTP/CAPTCHA. E2E com contas A/B: cadastro/confirm/recover → create/save/logout/reopen → draft/publish/anon/unpublish → pipeline/interesse/admin; invasões A/B/anon e limite excedido. Sem ambiente, listar cenários não executados como bloqueados.
- [ ] Medir Lighthouse mobile em build de produção se ferramenta realmente disponível; registrar números/metodologia e comparar metas da spec; campo INP separado. Não instalar auditoria/global/browser se ausente sem permissão. Entregar checklist com comandos, evidências, pendências e sem afirmar lançamento; nenhum deploy/commit automático.

## Auto-revisão do plano

Cobertura: intenção/site em 12; auth/onboarding em 3–4/10; limites em 1/5; editor em 6–8; publicação em 7; prospects em 9/11; IA em 9; dados/RLS em 3/5–7/10–11; captação/LGPD em 10/12; dependências em 2; segurança/DOD em 4/13. Os cinco itens de Review Focus possuem testes nas tarefas donas.

Fronteiras: identity/context deriva do servidor; workspace de cliente nunca vira organization interna; novos dados e RPCs são isolados. Teste puro/serviço não é confundido com SQL/browser; integração bloqueada não é resultado aprovado. Quotas sobrevivem à exclusão por user Auth, não por ID recriado. Interfaces e propriedades acima são a referência para execução.

Ordem recomendada: 1 → 2 → 3 → 10 → 4 → 5 → 6 → 7 → 8 → 11 → 9 → 12 → 13. HTTP/config da tarefa 1 permitem captação; CAPTCHA da tarefa 10 permite telas Auth da tarefa 4 sem dependência circular. Tarefa 3 cria tabelas base, então migrations posteriores podem referenciá-las; tarefas posteriores preenchem UI/integrações antes de declarar cada marco funcionalmente completo. Migrations mantêm ordem numérica independentemente da ordem de implementação; em banco isolado aplicar conjunto de pré-requisitos antes dos testes correspondentes. Não há paralelismo proposto em arquivos compartilhados.

Gate final antes de código: usuário revisa este plano, confirma execução nativa disponível e autoriza separadamente comandos que instalem dependências. A aprovação do plano não altera as restrições de banco externo, APIs pagas, produção ou Git.
