# VertexTarget global — tema claro, idiomas e vendas internacionais

Data: 2026-10-03
Status: direção e especificação escrita aprovadas pelo usuário na conversa.
Gate seguinte: revisão dos planos de implementação → escolha do método de execução.
Planos: [roteiro dos quatro ciclos](../plans/2026-10-03-global-platform.md).
Não autoriza deploy, alterações em serviços remotos, cobrança real ou instalação global.

## 1. Objetivo e decisões confirmadas

Entregar uma experiência clara legível e consistente e preparar uma versão global da VertexTarget. O escopo confirmado abrange site público, `/plataforma`, autenticação, Vertex OS e todas as áreas do admin, incluindo financeiro e operações.

Idiomas iniciais: português brasileiro, inglês, espanhol, francês, alemão e italiano. Foco comercial: Américas e Europa. Inglês será a opção global para países sem tradução própria; idioma não determina nacionalidade nem moeda.

Vendas internacionais pela Stripe existente, com preço-base comercial aprovado e Adaptive Pricing quando elegível. Não inventar câmbio, preços, benefícios ou disponibilidade por país.

## 2. Evidências do estado atual

- Next.js 15, React 18, TypeScript, Tailwind 4 e npm. Já existem `next-themes`, Motion, GSAP, Lenis e shadcn/Radix; não há necessidade demonstrada de nova biblioteca visual.
- `src/app/globals.css` define tokens `vt-*` e `html.light`, mas várias superfícies usam fundos escuros e texto branco fixos. Reproduzido em `/plataforma`: título branco sobre `rgb(242, 245, 250)` e navegação branca translúcida.
- Os shells da OS e admin fixam cores escuras; `.admin-shell` fixa `color-scheme: dark`. Os primitivos também têm hover/texto incompatíveis com o tema claro.
- O dicionário legado cobre PT/EN/ES/FR/IT somente em partes do site. Preferência em `localStorage`; idioma inicial e metadata em pt-BR, sem rotas públicas localizadas. OS/admin e conteúdo de `/plataforma` possuem copy portuguesa fixa.
- `normalizeBrazilianPhone()` acrescenta `55`; documentos publicados e formulários dependem deste comportamento.
- Payment Links: tipos, validação e banco aceitam BRL/USD/EUR, mas o formulário envia BRL fixo e a listagem formata qualquer link como BRL.
- `getFinanceData()` agrega valores de faturas e assinaturas em moedas distintas em um único total e formata transações como BRL. Vendas manuais também entram no mesmo gráfico.
- A OS só possui plano `free`. Marketing atual apresenta planos/benefícios pagos que não comprovam cobrança ou entitlement implementado. Não vender esses benefícios sem fechar o ciclo do produto.

Graphify 0.9.67 disponível. Grafo existente: 1.649 nós e 3.966 relações, baseado no commit `3368f1d`. As relações consultadas foram marcadas EXTRACTED; arquivos atuais foram lidos para confirmar o impacto. Alterações posteriores e locais não estão automaticamente refletidas no grafo. Nenhuma extração semântica externa autorizada.

## 3. Decomposição e ordem

Quatro ciclos de implementação, cada um com resultado verificável:

1. Tema claro consistente em todas as áreas, preservando o escuro.
2. Idiomas completos e SEO público localizado.
3. Regionalização de perfil, contatos, documentos e geração assistida.
4. Venda internacional e relatórios financeiros por moeda.

Não declarar lançamento global completo com apenas o seletor de idioma ou uma landing traduzida. A correção visual pode ser entregue antes das demais frentes sem simular funcionalidades futuras.

## 4. Direção visual e tema

Preservar marca VertexTarget e fontes Outfit + Inter. Tema claro: fundo neutro levemente frio, superfícies brancas legíveis, bordas definidas, texto escuro e acentos ciano/violeta com contraste suficiente. Reduzir glow e transparência que prejudicam leitura, sem remover identidade.

- Corrigir cores na origem por tokens semânticos compartilhados, incluindo estados de sucesso/erro/aviso, overlays, foco, gráficos e botões. Não aplicar inversão, filtros ou CSS global que remapeie indiscriminadamente `text-white`.
- Consolidar tokens CSS/Tailwind para que valores de utilitários acompanhem o tema, evitando divergência entre cores hardcoded no `@theme` e variáveis em `html.light`.
- Aplicar ao site, pricing, navbar/mobile drawer, sandbox externo, auth, onboarding, editor, prospects, configurações, tabelas, gráficos, notificações e modais do admin.
- Preservar notebook/chassi escuro como objeto com direção de arte; o conteúdo demonstrativo dentro dele pode ter tema próprio. Ele não deve forçar o tema da página nem a preferência dos sites publicados.
- Tema do site publicado é escolha do documento, separado do tema do dashboard. Não trocar automaticamente a aparência dos sites dos clientes.
- Expor alternância de tema acessível também na OS/admin; preferência persistente e sem flash indevido ou mismatch de hidratação.
- Tipografia de títulos usa Outfit; corpo Inter. Não acrescentar fontes sem necessidade.
- Não criar novas animações pesadas. Manter separação GSAP/Motion, cleanup, redução de movimento e foco visível.

## 5. Idiomas, rotas e SEO

Códigos públicos: `pt-BR`, `en`, `es`, `fr`, `de`, `it`. Mapear a preferência antiga `pt` para `pt-BR` sem descartar o idioma salvo.

- Rotas públicas indexáveis com prefixo: `/{locale}`, `/{locale}/plataforma`, `/{locale}/cases`, `/{locale}/cases/{slug}`, `/{locale}/privacidade`, `/{locale}/termos`.
- Reaproveitar composição e dados existentes, não duplicar a aplicação por idioma. Labels de rota podem permanecer estáveis nesta primeira versão.
- URLs públicas antigas continuam válidas e redirecionam permanentemente para a equivalente pt-BR, preservando parâmetros necessários; decidir fragmentos nos links do cliente, pois não chegam ao servidor.
- Rota explícita é autoridade para idioma público. Seletor mantém página, slug e parâmetros de campanha permitidos; não troca para a home indiscriminadamente.
- `/os/*`, `/login`, `/admin/*`, `/api/*`, `/auth/*` e `/sites/{slug}` mantêm contratos e URLs atuais. OS/admin/auth recebem preferência validada via cookie disponível no servidor; o cliente parte do mesmo idioma inicial.
- Não modificar as fronteiras de autenticação nem criar redirects abertos. Localização não concede roles/plano nem altera isolamento por organização/workspace.
- Dicionários tipados por domínio, com paridade de chaves nos seis idiomas; carregar somente o idioma/domínios necessários. Remover dependência de `"use client"` dos dados usados pelo servidor.
- Traduzir navegação, títulos, labels, validações, loading, erros, estados vazios, notificações, ações, diálogos, textos acessíveis e copy comercial. Contratos de API mantêm campos/enum estáveis; mensagens localizadas por códigos, não por comparação de strings portuguesas.
- Conteúdo de negócios, nomes, propostas, comentários e textos do usuário não são traduzidos automaticamente.
- `html.lang`, title/description/Open Graph, canonical, alternates/hreflang, sitemap e robots consistentes com rota e domínio canônico configurado. `x-default` aponta para inglês global. Nada de hostname inventado.
- OS/admin/auth não indexáveis. Sites publicados usam o idioma definido no documento e não recebem todas as variantes hreflang sem tradução real.
- Copy em idiomas completos, sem trechos portugueses incidentais; marcas e termos técnicos podem permanecer. Revisão humana das traduções e textos legais é gate de lançamento, não resultado presumido da geração.

## 6. País, fuso, contatos e documento

Mercados prioritários para validação comercial: Brasil, EUA, Canadá, Reino Unido, México, Argentina, Chile, Colômbia, Peru, Uruguai, Portugal, Espanha, França, Alemanha, Itália, Áustria, Bélgica, Países Baixos, Irlanda, Luxemburgo e Suíça.

A lista é priorização de lançamento, não prova de disponibilidade de todo método de pagamento. Países adicionais podem usar inglês e contatos internacionais sem anunciar suporte comercial antes da validação.

- Idioma, país ISO 3166-1 alpha-2 e fuso IANA são preferências distintas. Não inferir país definitivo do idioma nem usar geolocalização para restringir acesso silenciosamente.
- Datas/números via `Intl`, com fuso definido. Limites de uso continuam renovando em UTC; apenas a exibição é localizada e deve explicitar essa regra.
- Telefones novos em formato internacional com código do país explícito. Não completar um telefone estrangeiro com `55`; validar estrutura E.164 e explicar que validação estrutural não verifica existência.
- Dados brasileiros legados continuam funcionando por compatibilidade explícita, não por reinterpretação silenciosa de todos os telefones. Regressões para telefone/email/WhatsApp devem ser testadas.
- Perfil do workspace e briefing incluem país e idioma de saída; a IA recebe instruções coerentes e não inventa localização ou traduz dados pessoais. Não consumir APIs pagas para testar sem autorização específica.
- Publicação persiste idioma e contatos normalizados no snapshot. Evolução de schema versionada, leitura compatível com documentos anteriores e sem migração destrutiva.
- Atualizações de Supabase são migrations aditivas revisáveis localmente. Aplicação remota fica para autorização explícita; nenhuma mudança em dados reais nesta fase.

## 7. Vendas internacionais com Stripe

Reutilizar SDK servidor e fluxo de Payment Links; sem trocar de provedor, exigir chave no chat ou criar recursos remotos durante desenvolvimento local.

### Preço e apresentação

- Preço-base vem de decisão comercial/configuração validada no servidor. Para serviços orçados no admin, a equipe autorizada define valor/moeda; para planos públicos futuros, o cliente só escolhe um identificador de oferta, nunca o preço ou entitlement.
- Adaptive Pricing fica sob autoridade da Stripe. Não simular cotação no frontend. Exibir preço-base com ISO da moeda e aviso de que total/moeda locais são confirmados no checkout.
- Preservar BRL/USD/EUR existentes; ampliar moedas fixas de orçamento somente quando necessário e aprovado, com migration/type/validação alinhados. Moedas locais apresentadas pela Stripe não exigem fingir que o preço-base foi criado em todas elas.
- Não oferecer Pix ou parcelamento como regra mundial. Expor apenas opções elegíveis para a moeda/conta; não aceitar combinações arbitrárias pelo navegador.
- Confirmar no lançamento: país da conta Stripe, moedas de liquidação, elegibilidade do fluxo, métodos locais e taxas. Adaptive Pricing pode adicionar 2–4% ao preço do comprador, conforme documentação vigente.

### Persistência, segurança e financeiro

- Todo valor financeiro carrega sua moeda e unidade monetária mínima. Não somar USD/EUR/BRL nem renomear um saldo estrangeiro como reais. Agregações e gráficos por moeda; consolidação futura só com taxa, origem e data de câmbio explícitas.
- Armazenar separadamente moeda/valor da integração e moeda/valor apresentados ao comprador quando fornecidos por eventos da Stripe. Nunca calcular dados ausentes por heurística.
- Formatar links, faturas, dashboards e listas com a moeda real e idioma ativo. Vendas manuais legadas permanecem BRL até uma evolução explícita do registro.
- MRR considera intervalo e quantidade sem misturar moedas. Reconciliar filtros/intervalos e resultados paginados; não declarar total global se a consulta retorna apenas um recorte limitado.
- Manter autorização de equipe/organização, assinatura de webhook e idempotência. Não conceder benefício pago pelo redirect de sucesso; cobrança/entitlement exigem confirmação confiável no servidor.
- Corrigir opções incompatíveis sem casts que escondam incompatibilidade no SDK. Testes de repetição/erro não devem criar produtos duplicados silenciosamente.

### Produto pago e limites

A OS atual só tem `plan: free`. Nesta entrega, viabilizar venda internacional de serviços pelo fluxo existente. Planos Starter/Pro da OS não serão ofertados como compráveis sem definição e implementação de quotas, acesso, cobrança, cancelamento e revisão comercial própria. Copy/JSON-LD devem refletir o que existe, em todos os idiomas.

Tributação, registro fiscal, privacidade e direitos do consumidor dependem da operação e de revisão profissional. Não habilitar Stripe Tax nem presumir conformidade jurídica como efeito de traduzir a interface.

## 8. Verificação e critérios de aceite

### Tema

- Claro/escuro nas páginas públicas e nos fluxos OS/admin representativos; contrastes AA para texto, foco e controles. Sem título branco sobre fundo claro ou diálogo com cores de outro tema.
- Desktop e 360 px: navegação, formulários, tabelas com rolagem própria e textos longos; sem conteúdo essencial cortado.
- Alternância/persistência/reload, teclado e prefers-reduced-motion; sem erros de console/hidratação. Fixtures de UI não autorizam acesso privado nem usam dados reais de clientes.

### Idiomas/região

- Paridade de dicionários e referências válidas; testes de locale inválido, preferência legada, caminho/slug preservado, redirect e callback seguro.
- Verificar HTML inicial e metadata nos seis idiomas, não apenas DOM após hidratação. Rotas protegidas permanecem protegidas.
- Telefones BR/US/GB/FR/DE, código explícito, input inválido, links seguros, dados legados e leitura de snapshots antigos. Testar fuso e virada UTC sem alterar quotas.

### Dinheiro/pagamentos

- Testes de unidade/repositório com faturas BRL/USD/EUR: grupos corretos, ausência de total misturado e exibição da moeda real. Cobrir recorrência, valores inválidos, repetição e opções de pagamento incompatíveis.
- Webhook assinado, duplicado e inválido; diferenças entre integração e presentment, e ausência desses campos.
- Quando autorizado, sandbox Stripe com compradores simulados dos EUA, Canadá, Reino Unido e França, sem transação real e sem dados pessoais. Testes locais não comprovam disponibilidade na conta live.

### Gates do projeto

`npm exec -- tsc --noEmit`, `npm run lint`, `npm run test:commercial`, `npm run test:os`, testes novos pertinentes e `npm run build`. Não alterar baseline, enfraquecer assertions ou introduzir suppressions para passar.

Medir Lighthouse mobile nos fluxos públicos alterados; metas: LCP < 2,5 s, INP < 200 ms, CLS < 0,1, performance ≥ 90 e acessibilidade ≥ 95. Lighthouse isolado não mede INP real em produção; informar medidas/lacunas honestamente.

## 9. Fronteiras e preservação do checkout

- Não retomar a tarefa patrocinada de Sim; ela não faz parte deste pedido.
- Preservar alterações locais preexistentes em `package.json`, componentes de briefing e sandbox/notebook, scripts e documentos de deploy.
- Não alterar as especificações/planos anteriores como se representassem este pedido novo.
- Sem commit, push, PR, deploy, recursos externos, alterações de conta Stripe/Supabase, envio de arquivos ou uso de API paga sem autorização específica.
- Graphify: leitura local do grafo nesta fase. Consultas podem atualizar o cache de consulta; não afirmar que reconstruíram o grafo. Atualização futura somente local/code-only, se necessária e autorizada, excluindo segredos/dependências/build/terceiros.

## 10. Fontes consultadas

- Catálogo Gravity: Stripe existente, SDK já instalado; não instalar o boilerplate recomendado pelo catálogo.
- Adaptive Pricing: https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing
- Preços manuais por moeda: https://docs.stripe.com/payments/checkout/localize-prices/manual-currency-prices

Essas fontes explicam capacidades gerais. A elegibilidade da conta e os preços comerciais da VertexTarget ainda precisam ser confirmados antes de lançamento/venda real.
