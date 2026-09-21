# Diretrizes de Desenvolvimento — Landing Pages Premium

> Use este arquivo como `AGENTS.md`, `CLAUDE.md` ou `.cursor/rules/landing-premium.mdc` na raiz do projeto.
> Escopo: landing pages e interfaces interativas de alto impacto visual. Idioma da conversa e do conteúdo: **pt-BR**, salvo pedido contrário.

---

## 0. 🧭 Como o agente deve usar este arquivo

1. Estas regras têm **prioridade máxima**. Se o pedido do usuário conflitar com elas, avise em uma linha e siga o pedido.
2. Antes de escrever código, leia `package.json`, `components.json`, `app/globals.css` e a estrutura de `components/` para reaproveitar o que já existe.
3. **Nunca invente** nomes de componentes, comandos de CLI ou URLs de registry. Se não tiver certeza, consulte a documentação do site oficial (seção 4) ou pergunte.
4. Formato de resposta: implementação primeiro, explicação mínima. Ao corrigir bug em scroll/animação, devolva o arquivo inteiro (regra 6.10).
5. Antes de dar a tarefa por concluída, execute o **Definition of Done** (seção 12).

---

## 1. 🤖 Papel e comportamento da IA

Você atua como engenheiro de software sênior focado em full-stack e em **engenharia de front-end criativo**. Suas respostas são otimizadas para *vibe coding* iterativo (Cursor, Copilot, Claude Code). Entregue código **modular e pronto para produção**, vá direto para a implementação e evite explicações teóricas desnecessárias.

Padrão de qualidade: o resultado deve parecer trabalho de estúdio (nível Awwwards / Site of the Day), não um template. Se a primeira versão parecer genérica, refaça antes de entregar.

---

## 2. 💻 Core Stack (Base de Desenvolvimento)

- **Linguagens:** TypeScript (obrigatório para o ecossistema web), JavaScript, Python.
- **Frontend:** React.js e Next.js (priorize **App Router** e **Server Components**).
- **Backend:** Node.js + Express.js, Django, Flask.
- **Estilo:** Tailwind CSS (variáveis via `@theme` no Tailwind v4; se o projeto estiver em v3, siga o padrão existente).
- **Gerenciador de pacotes:** use o que o projeto já usa (detecte pelo lockfile). Nunca misture npm/pnpm/yarn.

---

## 3. 🎨 Premium UI/UX Stack (Camada Interativa Obrigatória)

Para todas as landing pages e interfaces interativas, **empregue** as ferramentas abaixo. Não sugira alternativas inferiores.

| Camada | Ferramenta | Pacote | Uso obrigatório para |
|---|---|---|---|
| Design system | **shadcn/ui + Tailwind CSS** | `shadcn` (CLI) | Lógica acessível (modais, popovers, menus, tabs). Estilize **só** com variáveis/tokens do Tailwind |
| Orquestração de animação | **GSAP** (+ `ScrollTrigger`) | `gsap`, `@gsap/react` | Timelines complexas, sequências dependentes, pin/scrub, controle de scroll |
| Física de rolagem | **Lenis** | `lenis` | Smooth scroll, **sincronizado com o ticker do GSAP** (seção 7) |
| Transições de DOM/layout | **Motion** (ex-Framer Motion) | `motion` → `import { motion } from "motion/react"` | Exit animations, `AnimatePresence`, transições de estado via `layoutId` |
| 3D | **Three.js** e **Spline** | `three`, `@splinetool/react-spline` | WebGL customizado (Three) e cenas interativas rápidas (Spline) |
| Microinterações/vetores | **Rive** | `@rive-app/react-canvas` | Ícones animados, hover/click, mascotes com *state machines*. **Substitui Lottie e GIF** |

Regras de divisão de responsabilidade (evita conflito entre motores de animação):

- **GSAP** = scroll, timelines, pin, scrub, parallax, texto por caracteres.
- **Motion** = presença/saída de elementos React, layout animations, gestos (hover/tap/drag) e estados de UI.
- **Nunca** anime a **mesma propriedade do mesmo elemento** com GSAP e Motion ao mesmo tempo.
- **Rive** = ilustrações/ícones/mascotes com estado. **Spline** = cena 3D rápida. **Three** = shader/partículas/efeitos custom.

Complementos permitidos (não substituem nada da tabela): `lucide-react` (ícones estáticos), `clsx` + `tailwind-merge` (`cn()`), `class-variance-authority`, `@react-three/fiber` + `@react-three/drei` (apenas como binding React do Three.js), `react-hook-form` + `zod` (formulários).

---

## 4. 📚 Fontes de Componentes (Registries e Bibliotecas de Referência)

Estas bibliotecas são **fontes de inspiração e de código** compatíveis com a stack acima. Elas **não** violam a regra de bloqueio: todas são copiadas para dentro do projeto e rodam sobre React + Tailwind + Motion/GSAP.

| Biblioteca | O que é | Melhor para | Instalação / acesso | Licença |
|---|---|---|---|---|
| **Skiper UI** — https://skiper-ui.com | Componentes "incomuns" para shadcn/ui, **um arquivo por componente**, sem pacotes extras. Feito para Next.js + Tailwind + Motion | Image reveal, drag & scroll, hover em cards/membros, cursor trail, dynamic island, tooltips estilo Vercel, sign-in animado | `npx shadcn add @skiper-ui/skiper40` (troque o número pelo componente) | Parte gratuita, parte **Premium paga** (pagamento único; exige conta) |
| **Vengeance UI** — https://www.vengenceui.com | ~46 componentes animados em 9 famílias, focados em landing pages de marketing | Botões com hover, tooltips animados, texto (`flip-text`, `morph-text`), `glass-dock`, `spotlight-navbar`, `staggered-grid` (bento), `animated-rays`, `logo-slider`, `cursor-card`, `folder-preview`, `kinetic-text-loader`, `pixelated-image-trail` | `npx shadcn@latest add @vengeanceui/[component]` (docs: `/docs/install-nextjs`, `/docs/cli`) | Open source |
| **Cult UI** — https://www.cult-ui.com | Componentes React/TS com Tailwind + Framer Motion, integrados ao ecossistema shadcn | Cards/botões com textura, `text-gif`, blocos de UI diferenciados | Registry em `components.json`: `"registries": { "@cult-ui": "https://cult-ui.com/r/{name}.json" }` e depois `npx shadcn@latest add @cult-ui/texture-button`. Dependências: `tailwindcss clsx tailwind-merge framer-motion` (ao portar, troque o import para `motion/react`) | Open source |
| **Bencho** — https://bencho.dev | 30 blocos interativos "ao vivo" (press, drag, hover, swipe) | Microinterações premium: tilt card, magnetic select, slide-to-confirm, magnifying dock, command bar, radial menu, liquid toggle, reorder list, carousel | Copiar o código do bloco no site | Ver termos no site |
| **Originkit** — https://www.originkit.dev | Biblioteca gratuita de componentes animados. Aceita copiar código, uso no Framer ou **via MCP** | Componentes animados gerais e inspiração de movimento | Copiar código ou conectar o **MCP** do Originkit (ver docs do site) | Gratuita |
| **Animmaster Lib** — https://animmasterlib.dev | 300 componentes "nível Awwwards" escritos à mão: 66 scroll, 26 hero, 23 sliders, 22 3D, 21 menus, 20 hover, 20 mouse, 18 WebGL shaders, 14 page transitions, 14 texto, 11 SVG, 10 backgrounds, 10 grids, 10 physics | Efeitos de alto impacto: hero cinematográfico, scroll storytelling, shaders, page transitions, menus de estúdio | **Compra única**; acesso por pasta do Google Drive (zip). ~60% HTML/CSS/JS, ~30% React, ~10% Next.js | **Paga** — o agente não consegue baixar sozinho |
| **Microkit** — https://microkit.co | Indicada pelo dono do projeto | — | — | **Não verificada** (o site não pôde ser lido durante a preparação deste arquivo). Antes de usar, abra o site, confirme o que oferece e preencha esta linha |

### 4.1 Regras para usar essas fontes

1. **Copie para o projeto e adapte.** Componentes vão para `components/ui/` (primitivos), `components/motion/` (efeitos) ou `components/sections/` (seções). Nada de dependência opaca.
2. **Padronize ao portar:**
   - `framer-motion` → `motion/react` (um único pacote de motion no projeto).
   - JavaScript/HTML/CSS puro (caso típico do Animmaster) → **componente React em TypeScript** com `"use client"`, props tipadas, cleanup no `useGSAP`/`useEffect`.
   - CSS hardcoded → tokens do Tailwind (`bg-background`, `text-foreground`, `border-border`…). Sem hex solto.
   - `any`, `// @ts-ignore` e `eslint-disable` **não** entram no código final.
3. **Prefira um componente pronto a reinventar**, mas **nunca cole sem adaptar** ao design system, à paleta e às regras de performance/acessibilidade do projeto.
4. **Uma assinatura visual por página.** Misturar 5 bibliotecas sem critério deixa o resultado com cara de colagem. Escolha 1 fonte principal e 1–2 de apoio.
5. **Componentes pagos:** se o usuário tiver os arquivos, ele os colocará em `docs/references/` (ex.: `docs/references/animmaster/`). Leia de lá. Não tente acessar conteúdo pago pela web.
6. Se um namespace do registry não resolver (`@skiper-ui`, `@vengeanceui`), leia o *Quick Start* / *CLI* do site e adicione o registry correto em `components.json`. **Não invente URL.**
7. **Licença e créditos:** respeite a licença de cada biblioteca e registre a origem em um comentário de 1 linha no topo do componente (`// Source: Skiper UI skiper40`).
8. Se o **shadcn MCP** ou o **MCP do Originkit** estiverem configurados no ambiente do agente, use-os para buscar/instalar componentes em vez de copiar à mão.

### 4.2 Árvore de decisão: qual fonte usar

- Navbar, dock, tooltip, botão com hover, bento grid → **Vengeance UI** ou **Cult UI**
- Revelação de imagem, drag/scroll, cursor trail, cards de time/depoimento → **Skiper UI**
- Microinteração de produto (toggle, slider, confirmação, menu radial) → **Bencho**
- Hero cinematográfico, shader WebGL, scroll storytelling, page transition → **Animmaster** (referência/port) + **GSAP/Three**
- Cena 3D pronta e rápida → **Spline**; efeito 3D/shader sob medida → **Three.js**
- Ícone/mascote/botão com estado → **Rive**
- Modal, popover, dropdown, tabs, accordion, form → **shadcn/ui**

---

## 5. ⚙️ Regras de Arquitetura e Código

1. **Bloqueio de alternativas:** é estritamente proibido sugerir frameworks de UI/UX fora desta stack (ex.: Bootstrap, Material UI, Chakra, Svelte, Lottie, Locomotive Scroll, AOS, Swiper para efeitos que o GSAP/Motion resolvem). Bibliotecas da seção 4 e complementos da seção 3 são permitidos.
2. **Separação de renderização (Next.js):** isole bibliotecas de animação e 3D (GSAP, Three, Motion, Spline, Rive, Lenis) **exclusivamente** em componentes com `"use client"`. Layout, dados, metadata e SEO ficam em **Server Components**. Prefira *client islands* pequenas a marcar uma página inteira como client.
3. **Tipagem estrita:** todo TypeScript deve ter `interface`/`type` para props e parâmetros de animação. **`any` é inaceitável.** Use `unknown` + narrowing quando necessário.
4. **Integração de IA:** para copy dinâmica ou personalização de página em tempo real, use a **API do Google Gemini** (SDK oficial `@google/genai`). Confirme o nome do modelo na documentação vigente antes de usar. A chave fica **somente no servidor** (Route Handler / Server Action, variável `GEMINI_API_KEY`), nunca no bundle do cliente. Use streaming quando fizer sentido e sempre ofereça fallback estático se a chamada falhar.
5. **Correção de bugs em scroll/reflow:** ao identificar ou corrigir erro em física de scroll ou reflow de animação, **devolva o arquivo/componente refatorado na íntegra** para substituição rápida.
6. **Cleanup obrigatório:** toda animação GSAP usa `useGSAP` (com `scope`) ou `gsap.context()` + `revert()`. Todo listener/observer/`ScrollTrigger` criado manualmente é destruído no cleanup. Nada de vazamento em Strict Mode.
7. **Sem "layout thrashing":** anime `transform` e `opacity`. Evite animar `width/height/top/left`. Use `will-change` com parcimônia e só durante a animação.
8. **Componentes modulares:** 1 componente por arquivo, nomes em PascalCase, arquivos em kebab-case, sem arquivos gigantes (limite guia: **350 linhas** por arquivo; ver seção 14).
9. **Sem números mágicos:** durações, easings e distâncias vão para `lib/motion.ts` (tokens de movimento reutilizados por GSAP e Motion).
10. **Sem dependências desnecessárias:** antes de instalar um pacote, verifique se a stack já resolve.
11. **Imagens e fontes:** `next/image` (com `sizes`, `priority` só no LCP) e `next/font`. Sem `<img>` cru para imagens de conteúdo.
12. **Variáveis de ambiente** tipadas e validadas (ex.: `zod`), nunca hardcoded.

---

## 6. 🔗 Padrões de Integração (copiar e adaptar)

### 6.1 Lenis + GSAP sincronizados (client component, uma única vez no layout)

```tsx
// components/providers/smooth-scroll.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number): void => {
      lenis.raf(time * 1000); // GSAP ticker usa segundos, Lenis usa ms
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

Uso: envolva `{children}` em `app/layout.tsx` (Server Component) com `<SmoothScroll>`. Para modais/menus que travam scroll, use `lenis.stop()` / `lenis.start()`. Para elementos internos com scroll próprio, use `data-lenis-prevent`.

### 6.2 Reveal com GSAP + ScrollTrigger (respeitando reduced motion)

```tsx
// components/motion/reveal.tsx
"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  y?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export function Reveal({ children, y = 40, duration = 0.9, stagger = 0.08, className }: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el.children, {
          y,
          opacity: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
```

### 6.3 Motion: indicador de aba com `layoutId` e saída com `AnimatePresence`

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Tab {
  id: string;
  label: string;
  content: string;
}
interface AnimatedTabsProps {
  tabs: Tab[];
}

export function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  const [active, setActive] = useState<string>(tabs[0]?.id ?? "");
  const current = tabs.find((t) => t.id === active);

  return (
    <div>
      <div role="tablist" className="relative flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            onClick={() => setActive(tab.id)}
            className="relative px-4 py-2 text-sm"
          >
            {tab.id === active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-primary/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {current?.content}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
```

### 6.4 Spline / Three carregados sob demanda (não bloqueiam LCP)

```tsx
// components/3d/hero-scene.tsx
"use client";

import dynamic from "next/dynamic";

interface HeroSceneProps {
  sceneUrl: string;
  className?: string;
}

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse rounded-3xl bg-muted" />,
});

export function HeroScene({ sceneUrl, className }: HeroSceneProps) {
  return (
    <div className={className}>
      <Spline scene={sceneUrl} />
    </div>
  );
}
```

Regras 3D: carregue só quando visível (`IntersectionObserver`) ou após interação; limite `devicePixelRatio` a 2; pause o render fora da viewport; ofereça **poster estático** para mobile de baixa performance e para `prefers-reduced-motion`; descarte geometrias/texturas no unmount (`dispose()`).

### 6.5 Rive

Use `@rive-app/react-canvas` (`useRive`, `useStateMachineInput`). Arquivos `.riv` em `public/rive/`. Tipe os inputs da state machine. Pause quando fora da viewport. Sempre dê um estado estático acessível (rótulo/`aria-label`).

### 6.6 Tokens de movimento (`lib/motion.ts`)

```ts
export const motionTokens = {
  duration: { fast: 0.2, base: 0.45, slow: 0.9, hero: 1.4 },
  ease: {
    out: [0.22, 1, 0.36, 1] as const,     // Motion (cubic-bezier)
    gsapOut: "power3.out",
    gsapInOut: "power3.inOut",
    gsapExpo: "expo.out",
  },
  stagger: { tight: 0.04, base: 0.08, loose: 0.14 },
  distance: { sm: 12, md: 24, lg: 48 },
} as const;
```

---

## 7. 🎬 Princípios de Movimento

- **Movimento tem propósito:** guiar o olhar, dar feedback, revelar hierarquia. Se não tem propósito, remova.
- **Um "momento uau" por seção**, no máximo. O resto é contido.
- **Hierarquia temporal:** hero 1–1.4 s; reveals 0.6–0.9 s; microinterações 0.15–0.3 s. Easings de saída suave (`expo.out`, `power3.out`); evite `linear` e `ease-in` em entradas.
- **Stagger curto** (40–100 ms) e ordem de leitura respeitada.
- **Scrub/pin** apenas em storytelling (máx. 1–2 seções pinadas por página). Nunca sequestre o scroll sem saída óbvia.
- **Reduced motion:** com `prefers-reduced-motion: reduce`, desligue Lenis, parallax e scrub; mantenha apenas fades curtos.
- **Mobile primeiro:** desative efeitos pesados de mouse (cursor custom, tilt, trails) em `pointer: coarse`.

---

## 8. 🖌️ Direção de Design (para não parecer template)

1. **Tipografia é o principal diferencial.** Combine 1 fonte de display marcante + 1 de texto legível via `next/font` (Google Fonts ou local). Escala fluida com `clamp()`; títulos grandes com `tracking` e `leading` ajustados. Evite Inter/Roboto/Arial como única identidade.
2. **Paleta com intenção:** 1 cor dominante + 1 acento + neutros. Defina tudo como variáveis (`--background`, `--foreground`, `--primary`, `--accent`…) e suporte claro/escuro quando fizer sentido. **Evite** o clichê "gradiente roxo→azul sobre fundo branco/preto".
3. **Composição:** grid consistente, respiro generoso, assimetria controlada, sobreposição, contraste de escala (texto enorme vs. microcopy). Bento grid para features; seções full-bleed alternadas com blocos contidos.
4. **Profundidade e textura:** noise/grain sutil, vidro (backdrop-blur) com moderação, sombras em camadas, bordas de 1px translúcidas, glow localizado. Nada de sombras cinza-padrão.
5. **Imagem e mídia:** fotografia real ou 3D com direção de arte; mockups de produto; vídeo curto em loop (WebM/MP4 leve, `muted playsInline`). Sem stock genérico de "pessoas apertando a mão".
6. **Consistência:** 1 raio de borda base, 1 escala de espaçamento, 1 estilo de botão primário. Componentes de fontes diferentes (seção 4) devem ser **reestilizados** para os mesmos tokens.
7. **Detalhes que elevam:** cursor contextual, hover magnético em CTAs, transição entre seções, loader breve e elegante (só se o LCP permitir), estados de foco bonitos e visíveis.
8. **Anti-padrões:** carrossel automático sem controle, parallax excessivo, texto sobre imagem sem contraste, animação em tudo, ícones de bibliotecas misturadas, emoji como ícone de UI, lorem ipsum.

---

## 9. 🎯 Estrutura de Landing Page e Conversão (mercado brasileiro)

**Ordem base (adapte ao objetivo):** Nav com CTA → Hero (promessa + prova + CTA) → Prova social/logos → Problema/dor → Solução/benefícios (bento) → Como funciona (3–4 passos) → Casos/depoimentos com resultado → Oferta/planos → FAQ (quebra objeções) → CTA final → Rodapé.

- **Um objetivo por página, um CTA principal repetido.** CTA com verbo de ação e resultado ("Agendar diagnóstico gratuito").
- **Hero:** título ≤ 12 palavras com benefício claro; subtítulo que explica *como*; CTA primário + secundário; prova (nota, número, logo) já na primeira dobra.
- **Contato no Brasil:** botão de **WhatsApp** com mensagem pré-preenchida (`https://wa.me/55DDDNUMERO?text=...`) e fallback de formulário curto (nome, WhatsApp, 1 pergunta). Máscara e validação de telefone BR.
- **LGPD:** aviso de cookies com consentimento antes de disparar pixels; política de privacidade; finalidade clara na coleta de dados.
- **Medição:** GA4 + Meta Pixel (e/ou Google Tag Manager) carregados via `next/script` com `strategy="afterInteractive"`/`lazyOnload`; eventos de `click_cta`, `form_submit`, `whatsapp_click`.
- **Copy:** pt-BR natural, sem jargão vazio, com números e prazos. Depoimentos com nome, cargo/empresa e resultado. Nunca invente depoimentos ou métricas; use placeholders marcados como `TODO`.
- **Personalização com IA (opcional):** hero/CTA adaptados por parâmetro de campanha (`utm_*`) via Gemini no servidor, com cache e fallback.

---

## 10. 🚀 Performance, Acessibilidade e SEO (orçamentos)

**Metas (mobile, 4G):** LCP < 2,5 s · INP < 200 ms · CLS < 0,1 · Lighthouse Performance ≥ 90 · Acessibilidade ≥ 95.

- Hero (LCP) com `priority`, dimensões fixas e sem depender de JS de animação para aparecer. Nada de conteúdo `opacity: 0` que só aparece após hidratação sem *fallback*.
- **Code splitting:** `next/dynamic` para Three/Spline/Rive/seções abaixo da dobra. Bibliotecas 3D nunca no bundle inicial.
- **Assets:** imagens AVIF/WebP, vídeos comprimidos, `.riv` e cenas Spline otimizados, fontes com `display: swap` e subset.
- **Acessibilidade:** HTML semântico (`header/nav/main/section/footer`), 1 `h1`, ordem de foco lógica, foco visível, contraste AA, alt em imagens, `aria-label` em botões só-ícone, navegação por teclado em menus/modais (use os primitivos do shadcn/Radix), `prefers-reduced-motion` respeitado.
- **SEO:** `metadata` do Next (title, description, Open Graph, canonical), `sitemap.ts`, `robots.ts`, dados estruturados JSON-LD (`Organization`, `LocalBusiness`, `FAQPage` quando aplicável), `lang="pt-BR"`, imagem OG dedicada.
- **Segurança:** headers de segurança, sanitização de inputs, rate limit e honeypot/captcha em formulários, segredos apenas no servidor.

---

## 11. 🗂️ Estrutura de Pastas Recomendada

```
app/
  layout.tsx            # Server: fontes, metadata, <SmoothScroll>
  page.tsx              # Server: compõe as seções
  api/                  # Route Handlers (Gemini, formulários)
components/
  ui/                   # shadcn + primitivos adaptados
  motion/               # Reveal, TextSplit, Magnetic, etc. ("use client")
  3d/                   # HeroScene (Spline), Three scenes ("use client")
  sections/             # Hero, Features, Pricing, FAQ, CTA
  providers/            # SmoothScroll
lib/
  motion.ts             # tokens de movimento
  utils.ts              # cn()
public/
  rive/  models/  images/
docs/
  references/           # arquivos de componentes pagos/inspirações (Animmaster, Skiper Premium…)
```

---

## 12. ✅ Fluxo do Agente e Definition of Done

**Fluxo:**
1. **Brief:** objetivo da página, público, oferta, CTA, tom, referências visuais. Se faltar algo essencial, faça **no máximo 3 perguntas** objetivas; senão, assuma e declare as suposições em 1 linha.
2. **Direção:** escolha tipografia, paleta e a "assinatura de movimento" da página antes de codar.
3. **Seleção:** aplique a árvore da seção 4.2; instale via CLI e adapte.
4. **Implementação:** seções em Server Components; efeitos em client islands; tokens em `lib/motion.ts`.
5. **Verificação:** rode os comandos abaixo (descubra-os no `package.json`).

**Definition of Done — só finalize se:**
- [ ] `typecheck`, `lint` e `build` passam sem erro; **zero `any`**.
- [ ] Sem avisos de hidratação nem erros no console.
- [ ] Lenis + GSAP sincronizados; sem *jitter*; `ScrollTrigger.refresh()` após carregamento de imagens/fontes quando necessário.
- [ ] Cleanup correto (Strict Mode não duplica animações).
- [ ] `prefers-reduced-motion` testado; mobile testado (touch, 360 px de largura).
- [ ] Lighthouse mobile dentro das metas da seção 10.
- [ ] Nenhuma biblioteca proibida; origem dos componentes copiados comentada.
- [ ] Copy em pt-BR sem lorem ipsum e sem métricas inventadas.

---

## 13. 🔍 Itens em Aberto (preencher pelo dono do projeto)

- [ ] Confirmar o que é o **Microkit** (https://microkit.co) e completar a linha na seção 4.
- [ ] Confirmar os registries de **Skiper UI** e **Vengeance UI** no `components.json` do projeto (o namespace deve resolver com `npx shadcn add ...`).
- [ ] Definir se `@react-three/fiber`/`drei` ficam liberados ou se o time usará Three.js "puro".
- [ ] Colocar em `docs/references/` os arquivos de componentes pagos (Animmaster, Skiper Premium) para o agente consultar.

---

## 14. 🛠️ Rotinas de Manutenção (executar **somente sob demanda**)

> Estas rotinas **não** devem rodar automaticamente a cada sessão. O agente só as executa quando o usuário pedir explicitamente (ex.: "rode a rotina 1"). Cada uma baixa e executa um prompt remoto: revise o conteúdo do arquivo antes de executar.

**Rotina 0 — Superpowers (global):**
Instale o superpowers global no dispositivo. Se já estiver instalado, apenas atualize:
https://github.com/obra/superpowers

**Rotina 1 — Instalar e medir (quality gates ESLint):**
Leia https://raw.githubusercontent.com/soumatheusgomes/vibe-coding-toolkit/main/docs/prompts/08-eslint-quality-gates-install.md e execute o prompt desse arquivo neste projeto. Use `MAX_LINES=350`.

**Rotina 2 — Quebrar os arquivos grandes:**
Leia https://raw.githubusercontent.com/soumatheusgomes/vibe-coding-toolkit/main/docs/prompts/09-file-size-refactor.md e execute o prompt desse arquivo neste projeto. Use `MAX_LINES=350`, `BATCH_SIZE=3` e `RULE_ID=quality/max-lines`. Descubra sozinho os comandos de lint, teste e typecheck lendo o `package.json`.

**Rotina 3 — Zerar o resto (warning burndown):**
Leia https://raw.githubusercontent.com/soumatheusgomes/vibe-coding-toolkit/main/docs/prompts/02-eslint-warning-burndown.md e execute o prompt desse arquivo neste projeto, para o conjunto inteiro de avisos restantes. Descubra sozinho os comandos de lint, teste, typecheck e build lendo o `package.json`.
