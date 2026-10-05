# Vendas internacionais e financeiro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir venda internacional de serviços pelo fluxo Stripe existente e eliminar totais que misturam moedas.

**Architecture:** Valores numéricos e moeda permanecem juntos em contratos puros; agregação por moeda precede formatação. Payment Links continuam com preços-base BRL/USD/EUR definidos por equipe autorizada; Stripe determina presentment/Adaptive Pricing. Repository de webhook persiste eventos e pagamentos idempotentemente após assinatura, sem conceder planos OS.

**Tech Stack:** Stripe SDK 22.6.2 existente, Supabase, Next.js 15, TypeScript, Intl, Recharts existente, npm, node:test; nenhuma dependência nova.

**Spec:** [global-platform-design](../specs/2026-10-03-global-platform-design.md), seção 7 e aceite financeiro. Consumes `Locale` da onda 2, preferências/formatDate da onda 3; [roteiro](2026-10-03-global-platform.md).

## Global Constraints

- Todo valor financeiro carrega sua moeda e unidade monetária mínima.
- Não somar USD/EUR/BRL nem renomear um saldo estrangeiro como reais.
- Vendas manuais legadas permanecem BRL até uma evolução explícita do registro.
- Adaptive Pricing fica sob autoridade da Stripe. Não simular cotação no frontend.
- Nesta entrega, viabilizar venda internacional de serviços pelo fluxo existente. OS permanece `free`; não vender Starter/Pro sem cobrança/entitlements implementados.
- Sem recursos remotos, cobrança real, chave no chat, migration remota, deploy, commit ou API paga sem autorização específica.
- Preservar isolamento por organização, assinatura de webhook e idempotência; nenhum cast/supressão que oculte incompatibilidade do SDK; arquivos novos ≤ 350 linhas.

## Review Focus

1. BRL/USD/EUR ou moeda zero-decimal exibida com divisor errado: usar minor units e moeda real (tarefa 1).
2. MRR interval_count/quantity/invoice parcial produz total falso: fórmula explícita e coverage por moeda (tarefas 1/2).
3. Browser altera organização/preço/capacidade ou retry duplica produtos: servidor autoriza input/idempotência (tarefa 3).
4. Presentment ausente vira câmbio inventado; repetição/concorrência dupla conta receita: persistência separada e unicidade transacional (tarefa 4).
5. Conta não elegível/consulta falha aparece como zero ou suporte global garantido: erro/coverage honesto e gate de conta live (tarefas 2/5).

---

### Tarefa 1: Dinheiro e agregação pura

**Files:** Create `src/lib/finance/types.ts`, `src/lib/finance/money.ts`, `src/lib/finance/aggregate.ts`, `scripts/tests/finance-money.test.mjs`, `scripts/tests/finance-aggregate.test.mjs`; modify `src/lib/payment-link-format.ts`, `src/lib/payment-link-validation.ts`.

**Interfaces:** `BaseCurrency = 'brl' | 'usd' | 'eur'`; `Money = { amountMinor: number; currency: string }`. `formatMoney(money: Money, locale: Locale): string` Intl com expoente da moeda suportada e indicação ISO quando necessário; não aceitar moeda inválida ou inteiro inseguro. `parseBaseAmount(value: string, locale: Locale, currency: BaseCurrency): {ok:true; amountMinor:number} | {ok:false; code:'format'|'range'}` usa separadores do locale ativo e escala2 das três moedas, rejeita formato ambíguo/incompatível, negativos e >100_000_000_00. `FinanceInvoice = {id:string; organizationId:string; currency:string; amountPaidMinor:number; amountRemainingMinor:number; paidAt:string|null; status:string}`. `FinanceSubscriptionItem = {currency:string; unitAmountMinor:number|null; quantity:number; interval:'month'|'year'|'week'|'day'; intervalCount:number}`. `aggregateFinance(input: { invoices: readonly FinanceInvoice[]; subscriptionItems: readonly FinanceSubscriptionItem[]; manualSales: readonly {amountMinor:number;soldAt:string}[]; now:Date; timeZone:string }): FinanceCurrencyGroup[]`; groups `{currency,mrrMinor,grossThisMonthMinor,overdueMinor,manualThisMonthMinor,manualTotalMinor,revenue: {monthKey:string;amountMinor:number}[],mrrCoverage:'complete'|'unsupported_interval'}`. Só month/year normalizados: month divisor intervalCount, year divisor12*intervalCount, quantidade aplicada e arredondamento final do grupo; week/day/null unit_amount não são chamados MRR completo.

- [x] Escrever testes `mixed_currency`: BRL10000/USD20000/EUR30000 geram três grupos, venda manual5000 só BRL, nenhum total geral; invoice deste mês usa paidAt, não created. `monthly_vs_all_time`: venda antiga entra histórico/all-time, nunca receita deste mês.
- [x] Escrever `mrr_interval_count`: 12000 minor anual quantidade2/count1 → 2000 mensal; trimestral9000/count3 → 3000; item metered/null/week/day sinaliza incomplete, não inventa MRR. Seis buckets com ano/fuso corretos.
- [x] Escrever `money_units`: USD12345 → equivalente USD123.45 em en; JPY12345 não divide100; BRL formato pt-BR e EUR de; moeda/valor inválidos rejeitados. `amount_locale`: pt-BR1.234,56/en1,234.56/de1.234,56 →123456; formato cruzado/zeros/negativo/excesso rejeitado, não parser heurístico que adivinha locale.
```js
assert.deepEqual(parseBaseAmount('1.234,56', 'pt-BR', 'brl'), {ok:true,amountMinor:123456});
assert.deepEqual(parseBaseAmount('1,234.56', 'en', 'usd'), {ok:true,amountMinor:123456});
assert.equal(parseBaseAmount('-1', 'en', 'usd').ok, false);
assert.equal(parseBaseAmount('0', 'en', 'usd').ok, false);
assert.equal(parseBaseAmount('1.234,56', 'en', 'usd').ok, false);
```

- [x] Rodar `node --experimental-strip-types --test scripts/tests/finance-money.test.mjs scripts/tests/finance-aggregate.test.mjs`; confirmar RED.
- [x] Implementar núcleos puros e adaptar parser legado somente onde contratos permitam; baseCurrency validada servidor, não lista irrestrita de moedas.
- [x] Reexecutar testes e typecheck; confirmar ausência de scalar total de moedas distintas no contrato.

### Tarefa 2: Dados completos e dashboard por moeda

**Files:** Create `src/lib/finance/repository.ts`, `src/lib/finance/stripe-source.ts`, `src/lib/finance/manual-source.ts`, `scripts/tests/finance-repository.test.mjs`; modify `src/lib/stripe.ts`, `src/app/admin/page.tsx`, `src/app/admin/financeiro/page.tsx`, `src/components/admin/AdminUI.tsx`, `src/components/admin/ManualSales.tsx`, `src/components/admin/PaymentLinkList.tsx`.

**Interfaces:** Preserve `getStripeClient()`. `getFinanceData(): Promise<FinanceData>` redefine `FinanceData = {groups:FinanceCurrencyGroup[]; transactions:{id:string;client:string;method:string;paidAt:string;money:Money;status:string}[]; coverage:{stripe:'complete'|'unconfigured'|'error';manual:'complete'|'error';errorCode?:string}}`; não retorna zeros para falha como se consulta completa. `FinanceSources = { invoices: FinanceInvoice[]; subscriptionItems: FinanceSubscriptionItem[]; manualSales: {amountMinor:number;soldAt:string}[]; coverage: FinanceData['coverage'] }`; `loadFinanceSources(context: {organizationId:string;userId:string}, now:Date): Promise<FinanceSources>` servidor recebe organização autorizada; pagina Stripe/Supabase até completar. Stripe scope por metadata/mapeamento validado da organização, nunca lista account-wide exposta ao tenant. Customers/quantidades, se mantidos, são scoped e não rotulados como globais.

- [x] Escrever teste com stub de duas páginas >100 Stripe/>500 manuais: todos considerados, sem truncamento; fatura de outra organização excluída; organização ausente não consulta conta. Stub de erro apresenta coverage error, não sucesso zero.
- [x] Executar `node --experimental-strip-types --test scripts/tests/finance-repository.test.mjs`; confirmar RED.
- [x] Implementar repositories, queries scoped e pagination explícita; usar paid_at para receita, período local definido por preferências e calendário da venda manual. Ausência de chave resulta unconfigured, não `mock` com aparência de dados fictícios.
- [x] Substituir scalar sums da overview/financeiro por grupos/seletor de moeda; Receita do mês usa manualThisMonthMinor, não manualTotalMinor. Tooltip/eixo/lista formatam com moeda real e locale ativo, chart não mistura séries de moedas. Valores transacionais numéricos são formatados na apresentação.
- [x] Reexecutar teste, finance aggregate, tipos e contratos comerciais; UI autorizada com fixture de três moedas mostra grupos reais sem total consolidado. Sem conta, registrar visual privado pendente.

### Tarefa 3: Criação segura de Payment Link

**Files:** Create `src/lib/finance/payment-capabilities.ts`, `src/lib/payment-link-service.ts`, `scripts/tests/payment-links-global.test.mjs`, `supabase/migrations/018_global_payment_links.sql`; modify `src/lib/payment-link-types.ts`, `payment-link-validation.ts`, `payment-link-repository.ts`, `stripe-payment-links.ts`, `src/components/admin/PaymentLinkForm.tsx`, `PaymentLinks.tsx`, `PaymentLinkList.tsx`, `src/app/api/admin/payment-links/route.ts`.

**Interfaces:** `PaymentLinkAction` preserva action/kind/amountCents/currency e adiciona `requestId` UUID para idempotência em callers novos. Client gera um requestId por submissão, reutilizado no retry do mesmo payload. `PaymentCapabilities = {baseCurrencies: readonly BaseCurrency[]; installmentsAllowed:false}` nesta entrega enquanto nenhuma capacidade comprovada; parcelas permanecem1 e recorrência month/year. Não manter cast de parcelas suportadas ficticiamente. `createPaymentLink(input: PaymentLinkAction, dependencies: PaymentLinkServiceDependencies): Promise<PaymentLink>` núcleo injetável sem imports de rede nos testes. `PaymentLinkServiceDependencies` expõe `authorize(input): Promise<{organizationId:string;userId:string}>`, `claimOperation(context,requestId,payloadHash): Promise<{operationId:string;completedLink:PaymentLink|null;executor:boolean}>`, `createProduct(input,idempotencyKey): Promise<{id:string}>`, `createPrice(input,productId,idempotencyKey): Promise<{id:string}>`, `createLink(input,priceId,idempotencyKey): Promise<{id:string;url:string}>`, `completeOperation(context,operationId,resourceIds,input): Promise<PaymentLink>` e `failOperation(context,operationId,errorCode): Promise<void>`; todos os parâmetros tipados no módulo, `context` tem organização/usuário confirmados e `resourceIds` contém productId/priceId/linkId/url. A tarefa define os tipos auxiliares `PaymentOperationContext` e `PaymentResourceIds` com essas propriedades, nunca `any`. Operação pending de outro executor retorna conflito retryable, não inicia segunda criação. `createStripePaymentLink` wrapper servidor usa SDK e contexto existente. Operação única `(organization_id, request_id)` com hash de payload e estados pending/completed/failed; reaproveitar Stripe idempotency keys por operação+etapa, nunca aleatórias a cada retry. Payload diferente com mesmo requestId gera conflito.

- [x] Escrever testes BRL/USD/EUR válidos, preço menor1/maior100_000_000_00 e moeda não aprovada inválidos; installments>1 rejeitados servidor; organização do browser/refs cruzadas rejeitadas antes de chamar SDK.
- [x] Escrever retry/concurrency stub: mesmo requestId/payload faz no máximo uma criação por etapa; requestId com payload distinto falha; failure persistência não é sucesso, retry reconcilia mesmo link e reporta compensation falha sem swallow. Não deletar recursos remotos para esconder erro.
- [x] Executar `node --experimental-strip-types --test scripts/tests/payment-links-global.test.mjs`; confirmar RED.
- [x] Implementar validação, operação persistida com lease/retomada e SDK idempotente. Migration018 cria tabela de operações scoped/RLS, não modifica migration007; autorização permanece servidor. Conferir capacidades SDK22 real: nenhum `as unknown` para opções não tipadas, não inventar campo Adaptive Pricing em Payment Link.
- [x] Formulário escolhe base BRL/USD/EUR e valor segundo locale ativo, confirma ISO moeda; lista usa currency real. Texto avisa que moeda/total locais são confirmados no checkout Stripe, sem cotação própria nem Pix/parcelamento universal.
- [x] Reexecutar testes e contratos comerciais/OS/tipos; formulário com repetição/erro de rede mantém mesma operação e mostra erro localizado. Sem conta elegível, não apresentar venda live habilitada por este check local.

### Tarefa 4: Webhook, pagamentos e presentment

**Files:** Create `src/lib/stripe-event-validation.ts`, `src/lib/stripe-webhook-repository.ts`, `src/lib/stripe-webhook-service.ts`, `supabase/migrations/019_stripe_presentment.sql`, `scripts/tests/stripe-webhook-global.test.mjs`; modify `src/app/api/stripe/webhook/route.ts` e `src/lib/payment-link-types.ts`.

**Interfaces:** `CheckoutPayment = {sessionId:string;paymentLinkId:string|null;integration:Money;presentment:Money|null;paymentStatus:string}`; `parseCheckoutPayment(input: unknown): CheckoutPayment | null` não infere presentment se campos ausentes. `StripeWebhookRepository` expõe `resolveOrganization(event: Stripe.Event): Promise<string | null>` e `applyEvent(input: {eventId:string;eventType:string;organizationId:string;payload:Record<string,unknown>}): Promise<{duplicate:boolean}>`; `processStripeEvent(event: Stripe.Event, repository: StripeWebhookRepository): Promise<{duplicate:boolean}>`. Payload passa por validação antes da RPC. Persistência de pagamento por `checkout_session_id` único, moeda e valor de integração e presentment separados. RPC transacional `stripe_apply_event(p_event_id text, p_event_type text, p_organization_id uuid, p_payload jsonb)` somente service role: valida vínculo interno de org/link, faz upserts e registra evento no mesmo commit. Migration019 adiciona tabela `stripe_checkout_payments`, campos presentment nullable com par valor/moeda consistente e RLS por organização; não reescreve migrations existentes.

- [x] Escrever testes usando `Stripe.webhooks.generateTestHeaderString` local com segredo só fixture: assinatura inválida/body adulterado nunca chama repository; válida processa evento. Nenhuma chave real ou rede.
- [x] Escrever eventos USD10000 com EUR9200 presentment → campos separados; presentment ausente →null, nunca conversão; currency/amount malformados rejeitados. Checkout recurring não desativa link reutilizável nem concede plano OS; `checkout.session.completed` com unpaid não vira pagamento liquidado; cobrir `checkout.session.async_payment_succeeded` para métodos assíncronos.
- [x] Escrever duplicate/concurrency stub e falha persistência: mesmo eventId/sessionId não duplica receita, retry de falha funciona; org do metadata não sobrepõe vínculo conhecido do link, fallback só é permitido para eventos legados vinculados inequivocamente à organização existente.
- [x] Rodar `node --experimental-strip-types --test scripts/tests/stripe-webhook-global.test.mjs`; confirmar RED.
- [x] Implementar serviço/repository e route fina: raw body → assinatura → parser → persistência. Erros não são marcados recebidos; zero direct data access na route nova, zero suppressions adicionadas. Invoice paid/failed/finalized continuam com amount/currency/status coerentes.
- [x] Reexecutar teste e tipos/contratos. Revisar SQL local; concorrência real/RLS/transação no banco continua gate remoto não comprovado por stub.

### Tarefa 5: Aceite comercial e lançamento condicionado

**Files:** Create `docs/verification/2026-10-03-global-payments.md`; modify copy/JSON-LD em `src/components/plataforma/PlataformaPricing.tsx`, `src/app/[locale]/plataforma/page.tsx`, `src/lib/i18n/messages/{pt-BR,en,es,fr,de,it}/platform.ts` somente onde apresentar preço/benefícios; update roteiro.

**Interfaces:** Relatório diferencia verificações locais, capabilities confirmadas da conta, sandbox e revisão fiscal/comercial. Nenhuma oferta pública cliente envia amount/entitlement como fonte de verdade.

- [x] Conferir marketing: free real + serviços orçados, nenhum Starter/Pro comprável, número/métrica/garantia sem prova ou JSON-LD preço fictício. Rótulos internacionais não anunciam método/país elegível sem confirmação.
- [x] Rodar todos os testes finance/payment/webhook, tipos, lint, commercial, OS e build após a última edição. Verificar UI autorizada nos dois temas, 360 px, moeda/locale distintos e erro/coverage.
- [x] Registrar gate Stripe: confirmação do país da conta/moedas settlement, Adaptive Pricing, métodos e possível taxa comprador2–4% conforme docs oficiais. Não habilitar Stripe Tax nem presumir conformidade fiscal por tradução.
- [x] Somente após autorização específica, executar sandbox US/CA/GB/FR com comprador simulado, nenhum dado pessoal/transação live; comparar checkout e webhook/presentment persistido. Sem autorização, marcar não executado.
- [x] Entregar resultado local com migrations revisáveis e blockers de lançamento; não afirmar disponibilidade comercial global ou deploy a partir de testes locais.

Fontes oficiais já consultadas: [Adaptive Pricing](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing), [preços por moeda](https://docs.stripe.com/payments/checkout/localize-prices/manual-currency-prices). Revalidar docs/conta durante execução; não recomendar provedor novo.
