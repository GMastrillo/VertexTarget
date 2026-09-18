# VertexTarget — Engenharia Digital de Alto Impacto

> Experiências digitais imersivas, automação com inteligência artificial e estratégias de alta conversão.

## 🚀 Sobre a VertexTarget
A **VertexTarget** é uma empresa de tecnologia e marketing digital de alta performance, sob a direção executiva de:
- **Gabriel Mastrillo** — CEO & CTO (Engenharia de Software, Arquitetura & Inteligência Artificial)
- **Denis Braghin** — Co-CEO (Vendas, Estratégia Comercial & Growth)

---

## 🛠️ Stack Tecnológica
- **Framework:** Next.js 15 (App Router, Server Components)
- **Linguagem:** TypeScript (Strict Mode)
- **Estilização:** Tailwind CSS v4 + Vanilla CSS Tokens
- **3D & Shaders:** Three.js (WebGL, Shaders GLSL customizados)
- **Animações:** GSAP (ScrollTrigger, Timeline) + Framer Motion
- **Smooth Scroll:** Lenis Scroll sincronizado com ticker GSAP
- **IA Integrada:** Google Gemini API

---

## 💼 Cases em Produção Integrados
1. **ClinicFlow** — SaaS de automação odontológica com IA ([clinicflow-dashboard-two.vercel.app](https://clinicflow-dashboard-two.vercel.app/))
2. **Absoluto Soluções Integradas** — Engenharia de climatização e monitoramento por IA ([cliente-absoluto.vercel.app](https://cliente-absoluto.vercel.app/))
3. **Ale Rei Jet Ski & Marine** — Showroom náutico e e-commerce de luxo ([jetski-gold.vercel.app](https://jetski-gold.vercel.app/))
4. **Autobelle Multimarcas** — Plataforma automotiva com laudo cautelar 100% ([autobelle-multimarcas.vercel.app](https://autobelle-multimarcas.vercel.app/))
5. **CACCIA Energia Solar** — Engenharia fotovoltaica e CleanTech ([caccia-energia-solar.vercel.app](https://caccia-energia-solar.vercel.app/))

---

## 📦 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Iniciar ambiente de desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start
```

---

## 🔐 Painel interno: Supabase, Stripe e Gemini

1. Copie `.env.example` para `.env.local` e preencha apenas com credenciais novas/rotacionadas.
2. Execute `supabase/migrations/001_internal_operations.sql` no SQL Editor do projeto Supabase.
3. No Supabase Auth, crie/confirme o usuário da equipe e insira seu `user_id` em `team_members` com a role adequada.
4. Configure o endpoint Stripe `/api/stripe/webhook` no Dashboard Stripe e use `STRIPE_WEBHOOK_SECRET` para validar a assinatura.
5. Configure `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e `GOOGLE_GEMINI_API_KEY` somente em variáveis server-side. Nunca use esses valores com o prefixo `NEXT_PUBLIC_`.

Sem essas variáveis, a aplicação mantém dados mockados apenas nas telas de desenvolvimento; rotas protegidas e mutações continuam negando acesso.

## 🚀 Deploy na Vercel
Este projeto está 100% otimizado para deploy imediato na **Vercel** através do repositório conectado.
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
