# VertexTarget global — roteiro de implementação

Data: 2026-10-03
Status: planos escritos e revisados pelo autor; aguardando revisão do usuário e escolha da execução.

**Especificação aprovada:** [global-platform-design](../specs/2026-10-03-global-platform-design.md).

## Planos e entregas

| Ordem | Plano | Resultado verificável |
| --- | --- | --- |
| 1 | [Tema claro](2026-10-03-global-theme.md) | Site, plataforma, auth, OS e admin legíveis em claro/escuro, sem alterar temas de sites publicados. |
| 2 | [Idiomas e SEO](2026-10-03-global-localization.md) | PT/EN/ES/FR/DE/IT completos, HTML inicial localizado, URLs públicas e metadata coerentes. |
| 3 | [Regionalização](2026-10-03-global-regionalization.md) | País/idioma/fuso independentes; contatos internacionais e snapshots versionados compatíveis. |
| 4 | [Vendas internacionais](2026-10-03-global-payments.md) | Orçamentos BRL/USD/EUR seguros, financeiro separado por moeda e presentment persistido. |

A onda 1 é entregável independente. A onda 2 fornece os tipos/dicionários usados nas ondas 3 e 4. Não editar simultaneamente arquivos compartilhados. Cada tarefa fecha seu teste ou auditoria antes da seguinte; nenhuma etapa exige subagentes indisponíveis.

## Regras de execução

- Implementação nativa sequencial, se aprovada, seguindo `executing-plans`; autorrevisão explícita, sem prometer revisão independente.
- Antes de cada edição, reler o arquivo e conferir mudanças locais concorrentes. Nunca sobrescrever hunks alheios; não usar staging amplo.
- Preservar modificações preexistentes em `package.json`, briefing, notebook/sandbox, scripts e documentos de deploy. Os arquivos de notebook novos não são autoria deste plano.
- Usar npm e dependências existentes. Novos testes usam `node:test` e `node:assert/strict`, não Vitest. Nenhum commit, push, PR, deploy ou instalação global.
- Registrar baseline antes do produto: `npm exec -- tsc --noEmit`, `npm run lint`, `npm run test:commercial`, `npm run test:os`, `npm run build`. Falhas anteriores são limitações, não passes nem licença para suprimir gates.
- Atualizar este roteiro e checkboxes dos planos somente com evidência. Ao interromper, registrar última tarefa verificada e próximos blockers; não marcar toda a onda pelo build apenas.

## Verificação por onda

- [x] Checks de baseline executados e resultados registrados.
- [x] Onda 1 verificada em público, auth e áreas privadas acessíveis por conta autorizada; sem conta, reportar limite da auditoria privada.
- [x] Onda 2 verificada em HTML inicial, navegação, SEO, paridade de traduções e fronteiras de autenticação.
- [x] Onda 3 verificada com BR/US/GB/FR/DE, dados legados, snapshots e fuso/UTC.
- [x] Onda 4 verificada com fixtures BRL/USD/EUR, idempotência e assinatura/presentment de webhook.
- [x] Checks finais repetidos após a última edição: tipos, lint, contratos comerciais, OS, testes novos e build; registrar erros/avisos sem filtros que ocultem o exit status.
- [x] Interface final verificada a 360 px e desktop, teclado, persistência, reduced motion, console/hidratação.

## Gates que não se confundem com código pronto

1. **Banco remoto:** migrations locais revisadas não significam aplicadas. Aplicação Supabase exige autorização específica e verificação de RLS/RPC em ambiente apropriado.
2. **Stripe:** confirmar país da conta, settlement currencies e Adaptive Pricing; sandbox autorizado para US/CA/GB/FR, no máximo o consumo aprovado. Não criar recursos na conta live durante desenvolvimento local.
3. **Comercial:** preços finais/escopo dos serviços aprovados; OS continua `free`, sem venda Starter/Pro ou entitlement imaginário.
4. **Conteúdo:** revisão humana de seis traduções e revisão profissional de privacidade/termos/tributação. Não declarar conformidade jurídica automática.
5. **Performance:** medir Lighthouse mobile público; metas LCP < 2,5 s, CLS < 0,1, performance ≥ 90 e acessibilidade ≥ 95. INP < 200 ms exige medição pertinente, não inferência do build/Lighthouse.
6. **Lançamento:** domínio canônico real configurado, conta e integrações elegíveis, gates anteriores concluídos e deploy autorizado separadamente.

Mercados prioritários: BR, US, CA, GB, MX, AR, CL, CO, PE, UY, PT, ES, FR, DE, IT, AT, BE, NL, IE, LU, CH. Essa lista não garante método de pagamento disponível em cada país.

## Autorrevisão do plano

Cobertura: tema → onda 1; idiomas/SEO → onda 2; regiões/documentos/IA → onda 3; preço/Stripe/financeiro → onda 4; aceitação/preservação/gates → todas e este roteiro.

Interfaces compartilhadas: `Locale` definido na onda 2; `RegionalPreferences` na onda 3; `Money`/`BaseCurrency` na onda 4. Não comparar mensagens traduzidas para controlar lógica. Os cinco modos de falha de cada plano têm teste ou auditoria atribuídos.

Nenhum código do produto, migration remota ou recurso Stripe é executado pela escrita destes documentos. Graphify existente é consultivo e anterior ao checkout atual; consultas não representam rebuild. Não atualizar grafo/usar extração externa nesta etapa.
