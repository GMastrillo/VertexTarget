# Verificação da Onda 4 — Vendas Internacionais e Financeiro Multi-moeda

**Data:** 2026-10-04  
**Status:** Implementado e Verificado Localmente  
**Escopo:** Onda 4 do Roteiro de Plataforma Global (`docs/superpowers/plans/2026-10-03-global-payments.md`)

---

## 1. Sumário Executivo

A Onda 4 viabiliza vendas internacionais de serviços através da infraestrutura Stripe existente com total segregação de moedas, conformidade de unidades mínimas (cents/minor units), idempotência e separação rigorosa entre moeda de integração e moeda de presentment do comprador (Adaptive Pricing).

Todas as interfaces e contratos operam local-first com cobertura automatizada via `node:test` e TypeScript estrito (0 `any`, 0 supressões ad-hoc).

---

## 2. Tarefas e Artefatos Implementados

| Tarefa | Artefatos Principais | Status |
|---|---|---|
| **1. Dinheiro e agregação pura** | `src/lib/finance/types.ts`<br>`src/lib/finance/money.ts`<br>`src/lib/finance/aggregate.ts`<br>`scripts/tests/finance-money.test.mjs`<br>`scripts/tests/finance-aggregate.test.mjs` | **100% Pass** (6/6 testes) |
| **2. Dados completos e dashboard por moeda** | `src/lib/finance/stripe-source.ts`<br>`src/lib/finance/manual-source.ts`<br>`src/lib/finance/repository.ts`<br>`src/components/admin/FinanceiroWorkspace.tsx`<br>`scripts/tests/finance-repository.test.mjs` | **100% Pass** (4/4 testes) |
| **3. Criação segura de Payment Link** | `src/lib/finance/payment-capabilities.ts`<br>`src/lib/payment-link-service.ts`<br>`supabase/migrations/018_global_payment_links.sql`<br>`src/components/admin/PaymentLinkForm.tsx`<br>`scripts/tests/payment-links-global.test.mjs` | **100% Pass** (3/3 testes) |
| **4. Webhook, pagamentos e presentment** | `src/lib/stripe-event-validation.ts`<br>`src/lib/stripe-webhook-repository.ts`<br>`src/lib/stripe-webhook-service.ts`<br>`supabase/migrations/019_stripe_presentment.sql`<br>`src/app/api/stripe/webhook/route.ts`<br>`scripts/tests/stripe-webhook-global.test.mjs` | **100% Pass** (4/4 testes) |
| **5. Aceite comercial e lançamento condicionado** | `src/components/plataforma/PlataformaPricing.tsx`<br>`src/components/plataforma/PlataformaHero.tsx`<br>`docs/superpowers/plans/2026-10-03-global-platform.md`<br>`docs/verification/2026-10-03-global-payments.md` | **Concluído** |

---

## 3. Matriz de Verificação de Segurança e Regras Globais

1. **Sem Consolidação Cruzada Falsa:**
   - Valores em BRL, USD e EUR nunca são somados em uma única variável escalar.
   - Vendas manuais legadas são atribuídas exclusivamente ao grupo `brl`.
   - O gráfico de faturamento e os cards de KPI filtram e exibem cada moeda isoladamente.

2. **Unidades Mínimas e Divisores Honestos:**
   - Moedas de 2 casas decimais (BRL, USD, EUR) operam estritamente em centavos inteiros (`amountMinor`).
   - Moedas zero-decimal (e.g. JPY, CLP) possuem tratamento nativo via `getCurrencyExponent` sem divisão espúria por 100.
   - Valores negativos, zero e excessivos (> 100.000.000,00) são bloqueados na validação.

3. **Idempotência de Payment Links e Retries:**
   - A tabela `stripe_payment_link_operations` (Migration 018) possui restrição de unicidade `(organization_id, request_id)`.
   - O serviço gera chaves de idempotência determinísticas para cada etapa (`product`, `price`, `link`) baseadas no ID da operação.
   - Submissões repetidas com o mesmo payload retornam o link existente sem duplicação de recursos no Stripe.
   - Payloads conflitantes com mesmo `requestId` geram erro 409 Conflict.

4. **Webhooks e Presentment Segregados:**
   - A tabela `stripe_checkout_payments` (Migration 019) armazena `amount_cents` + `currency` (integração) e `presentment_amount_cents` + `presentment_currency` (presentment) em colunas separadas.
   - Presentment ausente permanece `null`, sem conversões cambiais inventadas no cliente.
   - Eventos de checkout recurring não alteram planos do Vertex OS nem desativam links reutilizáveis.

5. **Marketing Honesto:**
   - O Vertex OS permanece gratuito (`R$ 0`) com limites de IA mensais claros.
   - Nenhum plano Starter/Pro com assinatura fictícia é comercializado sem os devidos entitlements e cobrança implementados.
   - Serviços sob medida são apresentados como orçamento transparente.

---

## 4. Gates de Lançamento em Produção (Checklist de Deploy)

- [ ] Executar migrations `018_global_payment_links.sql` e `019_stripe_presentment.sql` no banco Supabase de produção (ou via Supabase MCP).
- [ ] Configurar webhook endpoint no Stripe Dashboard apontando para `/api/stripe/webhook` com os eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `invoice.payment_failed`.
- [ ] Confirmar moeda de settlement da conta Stripe e verificar ativação do Adaptive Pricing no dashboard oficial da Stripe.
- [ ] Realizar teste em modo Sandbox com cartões de teste internacionais (US, CA, GB, EU).
