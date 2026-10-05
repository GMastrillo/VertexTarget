# Tema claro global — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar site público, plataforma, autenticação, OS e admin legíveis e consistentes em claro/escuro.

**Architecture:** Corrigir tokens e cores na origem; reaproveitar next-themes e primitivos existentes. Separar superfícies de aplicação de objetos com tema próprio (notebook e sites publicados); nenhum filtro/inversão global.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind 4, next-themes, Radix/shadcn, Motion, GSAP/Lenis existentes, npm, node:test.

**Spec:** [global-platform-design](../specs/2026-10-03-global-platform-design.md), seções 4 e 8.

## Global Constraints

- Preservar marca VertexTarget e fontes Outfit + Inter.
- Não aplicar inversão, filtros ou CSS global que remapeie indiscriminadamente `text-white`.
- Tema do site publicado é escolha do documento, separado do tema do dashboard.
- Tipagem estrita, zero `any` novo, arquivos novos ≤ 350 linhas, nenhuma supressão/baseline alterada.
- Nenhum commit, deploy, alteração remota ou dependência nova; preservar briefing/notebook/sandbox modificados por terceiros.
- Manter separação GSAP/Motion, cleanup, redução de movimento e foco visível.

## Review Focus

1. CSS/Tailwind resolve valor fixo apesar de `html.light`: comparar estilos computados nos dois temas (tarefa 1).
2. Reload/hidratação perde preferência ou pisca: verificar localStorage, reload e console (tarefa 2).
3. Documento publicado/chassi muda com tema do dashboard: provar isolamento no navegador (tarefa 3).
4. Modal/dropdown nativo herda cores escuras no claro: auditar estados abertos e focus ring (tarefas 2/4).
5. Texto longo/mobile/reduced motion corta controles: testar 360 px, teclado e redução de movimento (tarefa 5).

---

### Tarefa 1: Tokens e primitivos

**Files:** Modify `src/app/globals.css`, `src/components/ui/button.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/tabs.tsx`, `src/components/ui/accordion.tsx`. Create `src/styles/theme-tokens.css`. Test `scripts/tests/theme-contracts.test.mjs`. Evidence `docs/verification/2026-10-03-global-theme.md`.

**Interfaces:** Produces tokens CSS `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--success`, `--warning`; aliases legados `vt-*` apontam para tokens compatíveis. `@theme inline` expõe utilitários sem fixar outra paleta. Contratos/props dos primitivos não mudam.

- [x] Registrar reprodução: `/plataforma`, tema claro, h1 branco/fundo claro e navegação; guardar screenshot/estilos no relatório.
- [x] Escrever testes de contrato Node: cada token tem valor nos dois temas, aliases não divergem, `.admin-shell` não força `color-scheme: dark`; assert de ausência do bloco antigo força RED real. Testes de fonte não substituem contraste renderizado.
```js
const css = readFileSync('src/app/globals.css', 'utf8');
assert.equal(/\.admin-shell\s*\{[^}]*color-scheme:\s*dark/s.test(css), false);
const theme = readFileSync('src/styles/theme-tokens.css', 'utf8');
assert.match(theme, /html\.light/);
assert.match(theme, /--primary-foreground\s*:/);
assert.match(theme, /--ring\s*:/);
```

- [x] Executar `node --experimental-strip-types --test scripts/tests/theme-contracts.test.mjs`; confirmar falha esperada antes da correção.
- [x] Extrair somente definições de tema para o CSS novo e importar de globals; `:root` mantém dark default, `html.light` troca a mesma interface. Corrigir foreground dos botões, close/hover/disabled e foco dos primitivos.
- [x] Reexecutar teste e `npm exec -- tsc --noEmit`; no navegador comparar background/foreground/border computados em ambos os temas, inclusive portal do Dialog. PASS: valores acompanham tema, sem branco sobre fundo claro.

### Tarefa 2: Preferência e shells

**Files:** Modify `src/providers/ThemeProvider.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/ThemeTransition.tsx`, `src/components/os/os-shell.tsx`, `src/components/admin/AdminShell.tsx`, `src/app/os/(auth)/layout.tsx`, `src/app/os/(workspace)/layout.tsx`, `src/app/admin/layout.tsx`, `src/app/login/page.tsx`, `src/app/login/trocar-senha/page.tsx`, `src/components/os/auth-form.tsx`, `src/components/os/auth-form-fields.tsx`, `src/components/os/onboarding-form.tsx`, `src/lib/motion.ts`.

**Interfaces:** Preserve `ThemeProvider({ children })` e `ThemeToggle()`; toggle disponível na OS/admin com nome acessível indicando ação e `type="button"`. Consumes tokens da tarefa 1 e duração de `motionTokens`; `resolvedTheme` não produz conteúdo divergente antes do mount.

- [x] Registrar falhas de shell escuro e falta de alternância; abrir formulário com erro e modal em claro.
- [x] Reutilizar toggle e substituir cores de superfícies/textos/foco por tokens, incluindo `color-scheme` e menu mobile. Não mudar auth, rotas, roles ou API.
- [x] Testar toggle por Tab/Enter, persistência ao reload, retorno ao escuro e preferência limpa; PASS: nenhuma mensagem de hidratação, preferência mantida e nome acessível correto.
- [x] Em conta autorizada, verificar shells OS/admin e diálogos abertos; sem conta, verificar auth pública e registrar auditoria privada pendente, sem criar bypass/demo.

### Tarefa 3: Site público e plataforma

**Files:** Modify os arquivos existentes listados abaixo; reler modificações concorrentes antes de editar.

- Layout: `src/components/layout/Navigation.tsx`, `Footer.tsx`, `CommandPalette.tsx`, `ClientLandingShell.tsx`, `LanguageSwitcher.tsx`.
- Home: `src/components/hero/HeroSection.tsx`, `src/components/home/HomePlatformHighlight.tsx`, `src/components/trusted/TrustedBy.tsx`, `src/components/metrics/MetricsBand.tsx`, `src/components/services/ServicesSection.tsx`, `ServiceCard.tsx`, `src/components/cases/CasesSection.tsx`, `CaseCard.tsx`, `src/components/testimonials/TestimonialsSection.tsx`, `src/components/about/AboutSection.tsx`, `SkillsOrbit.tsx`, `src/components/ai-lab/AILabSection.tsx`, `src/components/faq/FAQSection.tsx`, `src/components/contact/ContactSection.tsx`, `interest-form.tsx`, `interest-form-fields.tsx`.
- Plataforma: `src/components/plataforma/PlataformaNav.tsx`, `PlataformaHero.tsx`, `PainPointsSection.tsx`, `PlatformHubSection.tsx`, `TemplatesCoverflow.tsx`, `NichesMarquee.tsx`, `PlataformaPricing.tsx`, `PlataformaFaq.tsx`, `PlataformaFinalCta.tsx`, `PlataformaClientShell.tsx`, `Laptop3DShowcase.tsx`; `src/components/plataforma/laptop/LaptopScreenContent.tsx`, `LaptopModeHeader.tsx`, `LaptopSandboxBar.tsx`, `LaptopSandboxCta.tsx`, `LaptopShowcaseTabs.tsx`.
- Pages: `src/app/cases/CasesIndexClient.tsx`, `src/app/cases/[slug]/CaseStudyClient.tsx`, `src/app/privacidade/page.tsx`, `src/app/termos/page.tsx`.

**Interfaces:** Nenhuma nova prop de negócio. Consumes tokens; notebook/chassi conserva paleta de objeto. Não editar `src/components/os/site-theme-styles.ts` para obedecer ao dashboard.

- [x] Reproduzir claro em home/plataforma/cases/legal e registrar áreas ilegíveis; abrir drawer/FAQ/command palette.
- [x] Corrigir cores na origem, mantendo contraste sobre mídia e conteúdo do notebook; nenhum seletor universal ou novo efeito pesado.
- [x] Comparar screenshot dark/light e estilos de título/nav/CTA/form; medir pares de contraste renderizados: texto normal ≥ 4,5:1, grande ≥ 3:1, controles/foco ≥ 3:1. Registrar amostras e método, não declarar toda a página aprovada por uma amostra.
- [x] Abrir preview de documento `warm-light` e `cyan-dark`, alternar dashboard e verificar que documento/chassi não recebem a paleta da aplicação.

### Tarefa 4: Conteúdo OS e admin

**Files:** Modify OS `project-editor.tsx`, `project-editor-header.tsx`, `project-fields.tsx`, `project-fields-services.tsx`, `project-briefing.tsx`, `project-briefing-fields.tsx`, `project-preview.tsx`, `ai-copy-review-modal.tsx`, `publish-modal.tsx`, `prospect-board.tsx`, `prospect-card.tsx`, `prospect-columns.tsx`, `prospect-form.tsx`, `search-results.tsx`, `usage-summary.tsx`, `workspace-settings.tsx`, `workspace-delete-modal.tsx`, sob `src/components/os/`.

Modify admin `AdminUI.tsx`, `CommercialWorkspace.tsx`, `CRMTable.tsx`, `InboxWorkspace.tsx`, `interests-table.tsx`, `ManualSales.tsx`, `PaymentLinkForm.tsx`, `PaymentLinkList.tsx`, `PaymentLinks.tsx`, `PerformanceWorkspace.tsx`, `ProjectsBoard.tsx`, `ProspectingClient.tsx`, `WhatsAppWorkspace.tsx`, `WorkspaceSwitcher.tsx`, sob `src/components/admin/`; páginas existentes `src/app/admin/{page.tsx,ai-logs/page.tsx,comercial/page.tsx,configuracoes/page.tsx,crm/page.tsx,financeiro/page.tsx,inbox/page.tsx,interesses/page.tsx,performance/page.tsx,projetos/page.tsx,prospecting/page.tsx,whatsapp/page.tsx}` e `src/app/os/(workspace)/{page.tsx,configuracoes/page.tsx,projetos/novo/page.tsx,projetos/[id]/page.tsx,prospects/page.tsx}`. As chaves nesta lista são expansão documental de caminhos existentes, não arquivos literais.

**Interfaces:** Contratos de dados/formulários preservados; gráficos usam cores semânticas e tooltip legível. Não alterar cálculos, consultas ou schemas neste ciclo.

- [x] Inspecionar estados vazio/loading/erro, seleção, status, gráfico/tooltip e diálogo destrutivo em claro; registrar falhas.
- [x] Aplicar tokens somente a chrome/controles da aplicação; preservar renderer do site e hunks concorrentes de briefing.
- [x] Com acesso autorizado, testar editor, prospects, configurações, financeiro e cada módulo admin em dark/light; PASS: nenhuma superfície de diálogo incompatível, tooltip/seleção/foco legíveis. Módulos sem acesso ficam explicitamente não auditados.

### Tarefa 5: Aceite da onda

**Files:** Update `docs/verification/2026-10-03-global-theme.md` e checklist deste plano.

**Interfaces:** Relatório contém rota, tema, viewport, estados verificados, screenshot, contraste medido, checks/exit status e limitações.

- [x] Verificar desktop/360 px, teclado sem trap, menus/modais e tabelas com scroll interno; `document.documentElement.scrollWidth <= window.innerWidth`, exceto regiões internas identificadas.
- [x] Emular `prefers-reduced-motion: reduce`, confirmar Lenis/parallax desligados e animações de estado reduzidas; sem erro/hidratação no console após toggle/reload/interações.
- [x] Rodar `node --experimental-strip-types --test scripts/tests/theme-contracts.test.mjs`, `npm exec -- tsc --noEmit`, `npm run lint`, `npm run test:commercial`, `npm run test:os`, `npm run build`; todos depois da edição final.
- [x] Medir Lighthouse mobile em build público servido localmente após inspecionar listeners; registrar LCP/CLS/performance/acessibilidade e gaps. Não instalar ferramenta silenciosamente nem inferir INP real.
- [x] Atualizar roteiro com entrega real: tema corrigido não significa globalização concluída; documentar auditorias privadas bloqueadas e qualquer gate não executado.
