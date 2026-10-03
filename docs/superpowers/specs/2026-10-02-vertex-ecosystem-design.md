# Ecossistema VertexTarget + Vertex OS — especificação de design

Data: 2026-10-02
Status: especificação aprovada pelo usuário em 2026-10-02, incluindo os limites gratuitos propostos.
Execução: não autorizada por este documento. Próximo gate: revisar o plano de implementação e escolher seu método de execução.

## 1. Intenção e sucesso

Transformar a VertexTarget de site de portfólio/serviços em um ecossistema de tecnologia que conecta conhecimento, execução e conexões. A Valyos inspira o fluxo de criação/comercialização de sites; a G4 inspira a organização do ecossistema. Não integrar a conta, API ou marca da Valyos, copiar sua identidade ou revender seu produto.

Decisões aprovadas:
- Duas jornadas: empresas/líderes e profissionais/freelancers/agências.
- Primeira entrega: site reposicionado, captação persistente e Vertex OS própria funcional.
- Cadastro público desde o início, sem convite nem aprovação manual de novos usuários.
- Confirmação de e-mail, espaço de trabalho separado do painel interno e acesso gratuito limitado sem cobrança automática.
- Formação e comunidade começam por apresentação e lista de interesse, sem LMS ou rede social.

Sucesso funcional: uma pessoa nova se cadastra, confirma seu e-mail, cria um projeto, edita e salva a página, reabre após nova sessão, publica uma versão revisada em URL da plataforma e acompanha o negócio no pipeline. Outra conta não consegue acessar ou alterar os dados dela. Um visitante sem conta consegue enviar um interesse que a equipe consegue consultar.

## 2. Recorte de entrega e alternativas

Escolha: evolução integrada no Next.js existente, sem reconstruir o admin. Um ciclo vertical completo, não telas desconectadas. Site e OS compartilham marca, não permissões.

Alternativas descartadas:
- Link/embed/white-label da Valyos: mais rápido, mas não entrega produto próprio nem controle da jornada.
- Nova aplicação e reescrita do admin: aumenta migração e manutenção sem ser necessária ao primeiro lançamento.

Incluído: cadastro/login/recuperação de senha, onboarding, projetos, três templates próprios, editor por campos, prévia, publicação/despublicação, prospects manuais e busca web assistida, pipeline simples, interesse público e consulta interna.

Excluído: cobrança/checkout, planos pagos, domínio próprio, exportação de código, upload de arquivos, geração de imagens, editor livre de HTML/CSS/JavaScript, múltiplos integrantes por workspace, marketplace, mensagens entre membros, cursos/aulas/pagamentos/certificados, contratos jurídicos gerados, campanhas ou mensagens automáticas e integração Google Maps.

## 3. Site e direção de arte

Preservar Outfit + Inter, identidade VertexTarget, tokens `vt-*`, temas existentes e cases válidos. Fundo escuro, ciano como acento principal, superfícies e tipografia editorial; evitar uma nova paleta genérica. Uma assinatura de movimento: transição visual de ideia → execução → resultado, com revelações contidas. Sem novos efeitos 3D pesados no primeiro carregamento.

Home:
1. Navegação: Soluções, Cases, Conhecimento, Comunidade e Vertex OS; entrada cliente distinta de acesso interno.
2. Hero sobre tecnologia aplicada ao crescimento; CTA principal para conhecer/começar na OS e caminho secundário para soluções empresariais.
3. Duas jornadas visíveis: digitalizar o negócio ou construir soluções para clientes.
4. Ecossistema: execução disponível, ferramenta disponível, formação/comunidade em preparação.
5. Demonstração da OS identificada como exemplo, com fluxo e link para cadastro.
6. Serviços/cases existentes, somente com prova verificável. Não validar automaticamente métricas ou depoimentos já presentes.
7. Formação e comunidade com formulário de interesse; sem prometer datas, cursos, mentores, vagas ou membros.
8. FAQ, contato real e rodapé com privacidade e entradas separadas.

`/plataforma` passa a descrever o produto que realmente existe, o limite gratuito e o fluxo. Remover preços Starter/Pro, renda estimada, garantia, categorias e promessas Maps/<1 minuto sem suporte real, inclusive metadata/JSON-LD.

O shell público reutiliza Lenis sincronizado ao GSAP. OS, formulários de autenticação e sites publicados usam rolagem nativa, sem preloader/cursor customizado. Conteúdo principal aparece no HTML inicial, independente da hidratação.

Novas superfícies em pt-BR. Preservar idiomas das áreas não alteradas; nas rotas reposicionadas retirar o seletor de idioma enquanto a nova copy não tiver traduções completas e usar pt-BR coerente, sem misturar o dicionário legado ao conteúdo novo.

## 4. Rotas e fronteiras

| Rota | Responsabilidade |
| --- | --- |
| `/` | Ecossistema, duas jornadas, portfólio e captação |
| `/plataforma` | Apresentação e limites reais da Vertex OS |
| `/os/cadastro` | Cadastro público e aceite de termos/privacidade |
| `/os/entrar` | Login cliente, reenvio de confirmação e link de recuperação |
| `/os/recuperar` e `/os/redefinir-senha` | Recuperação e nova senha usando sessão de recuperação validada |
| `/auth/confirm` | Verificação de e-mail por token hash e redirecionamento seguro |
| `/auth/callback` | Troca do código de recuperação por sessão; destino fixo permitido |
| `/os` | Dashboard autenticado, onboarding e uso disponível |
| `/os/projetos/novo` | Briefing e escolha de template |
| `/os/projetos/[id]` | Editor, prévia, salvamento e publicação |
| `/os/prospects` | Cadastro/busca e pipeline de negócios |
| `/os/configuracoes` | Perfil do workspace, uso e exclusão dos dados próprios |
| `/sites/[slug]` | Renderização pública apenas do snapshot publicado |
| `/privacidade` e `/termos` | Textos operacionais do produto, sujeitos à revisão jurídica antes do lançamento |
| `/admin/interesses` | Leitura de interesses por owner/sales internos |
| `/login` e `/admin/*` | Acesso interno existente, preservado |

APIs separadas: `/api/os/auth/*`, `/api/os/workspace`, `/api/os/projects`, `/api/os/prospects`, `/api/os/ai` e `/api/interesses`. Recursos internos não passam a aceitar clientes públicos. Rotas privadas e respostas com dados pessoais: `private, no-store` e `noindex`.

Server Components compõem páginas e carregam dados via módulos de serviço/repositório. Client islands cuidam de formulários, prévia e estados de UI. Componentes visuais não importam clientes Supabase nem segredos.

## 5. Autenticação e onboarding público

- Reutilizar Supabase Auth/SSR existente; validar identidade no servidor com `getUser()`, nunca apenas `getSession()`.
- Cadastro: nome 2–120 caracteres, e-mail válido até 254, senha 12–128, confirmação de senha, CAPTCHA e aceite explícito da versão dos termos/privacidade. Aceite de comunicação promocional separado e opcional.
- Não persistir senha, CAPTCHA ou tokens em tabelas/logs. Mensagens de cadastro/reenvio/recuperação não revelam se um e-mail já existe.
- Confirmação obrigatória também nos serviços/RPCs; configurar no Supabase, não depender apenas da tela. Criar workspace no primeiro acesso confirmado, em operação idempotente, após nome/jornada e aceite da versão atual dos termos/privacidade. Metadata pode preencher nome, mas nunca comprova autorização ou consentimento: registrar o aceite confirmado pelo serviço no onboarding.
- Um workspace próprio por usuário, sem convites nesta entrega. Jornada é uma escolha de produto, nunca uma role de autorização.
- Retorno após autenticação somente para destinos de uma allowlist `/os`; token/código expirado, reutilizado ou inválido produz estado recuperável, sem open redirect.
- Middleware Next 15 refresca cookies e separa a proteção de `/os` da proteção interna. Preservar cookies refrescados também nas respostas de redirecionamento.
- Nunca criar `team_members` ou `organization_members` para usuários públicos; metadata de cadastro não concede role, plano ou workspace.
- Com banco/Auth indisponível: erro explícito, sem modo demo que simule sessão ou salvamento. Logout invalida sessão; login cliente não chama a rota interna que exige equipe.

## 6. Limites gratuitos propostos para aprovação nesta especificação

| Recurso | Limite inicial |
| --- | --- |
| Workspace | 1 por conta confirmada |
| Projetos existentes | 1, editável; exclusão permite criar outro |
| Sites publicados simultaneamente | 1, com assinatura discreta Vertex OS |
| Assistências de texto com IA | 3 tentativas externas/mês UTC por workspace |
| Busca web assistida | 1 tentativa externa/mês UTC, até 10 sugestões |
| Prospects armazenados | 50 por workspace |
| Templates | 3 próprios: serviços locais, comércio e consultoria |
| Edição manual e republicação | Não consomem crédito de IA; sujeitas a rate limit |

Não há cartão, assinatura automática ou promessa de uso ilimitado. Mostrar contadores e a data UTC de renovação na interface. Esses números são proposta concreta, não decisão comercial anterior nem valores copiados da Valyos.

Consumo de IA/busca é reservado atomicamente antes de chamar o provedor. Requisição repetida com a mesma chave de idempotência e mesmo hash do payload não gasta novamente nem cria segunda chamada; mesma chave com payload diferente é conflito. Apenas o primeiro executor adquire permissão de envio; reservas em andamento retornam estado pendente e operações já enviadas não são retomadas automaticamente após crash. Reserva de operação que chegou a ser enviada ao provedor conta mesmo se houver timeout/resultado inválido; não liberar automaticamente quando não é possível saber se houve cobrança. Reserva abortada antes do envio pode ser liberada atomicamente. Nenhum limite depende somente de Map em memória.

Freio global mensal proposto: 1.000 assistências de texto e 100 buscas por instalação, alteráveis somente por configuração servidor. Teto por chamada: 2.048 tokens de saída, sem loops/retries automáticos, timeout de 45 s. O teto limita chamadas, não é garantia de valor monetário; configurar orçamento/alertas do provedor antes de produção. Interromper novas operações pagas ao atingir qualquer limite ou se o armazenamento de quota falhar. Edição manual continua disponível.

## 7. Projetos, editor e publicação

Briefing: nome do negócio, setor, cidade, objetivo, descrição, até 6 serviços, e-mail/WhatsApp e escolha de template. Dados do prospect são importados somente após confirmação do usuário.

Contrato de documento versionado: template ID permitido; nome; título até 120; subtítulo até 280; descrição até 1.200; até 6 serviços com título 80 e descrição 240; CTA 40; e-mail/telefone; cidade; tema dentre presets acessíveis. Sem HTML, scripts, CSS ou URLs de mídia arbitrários. Imagens são assets locais curados, com `next/image` e dimensões/sizes. Paleta por presets aprovados, não cores que comprometam contraste.

Editor por campos e prévia com larguras representativas mobile/desktop; não é drag-and-drop livre. Estado `limpo → alterado → salvando → salvo/erro`. Salvamento explícito. Não apagar campos ao falhar; aviso ao abandonar alterações. Atualizações com versão esperada: conflito devolve 409, sem sobrescrever silenciosamente uma sessão concorrente. Resposta de IA vira sugestão para revisão/aplicação; não substitui edição nem publicação automaticamente.

Templates locais tipados compartilham o mesmo renderer usado na prévia e na publicação. Sem `eval`, iframe de código do usuário ou `dangerouslySetInnerHTML` com conteúdo do usuário. Texto é escapado pelo React; contato normalizado e links são gerados por helpers permitidos (`mailto`, `wa.me`). JSON-LD seguro não recebe strings sem escape apropriado para contexto de script.

Publicar cria/atualiza atomicamente snapshot validado e separado do rascunho. Slug gerado pelo servidor com sufixo aleatório e unicidade global; URL sob o host configurado da plataforma, não domínio próprio. Edições posteriores não mudam o site público até nova publicação. Despublicar/excluir retira imediatamente a resolução pública; primeira versão usa renderização dinâmica sem cache persistente para evitar vazamento após remoção.

Snapshot contém só campos públicos aprovados. Não inclui usuário, workspace, briefing privado, notas, pipeline, créditos ou logs. Resolução pública por função de leitura restrita, não acesso anônimo à tabela inteira. Slug não prova autorização para editar. Um recurso estrangeiro responde 404, sem revelar sua existência.

Publicação exige aceite de responsabilidade pelo conteúdo e contatos. Conta suspensa e publicação bloqueada não podem ser reativadas pelo cliente. Denúncias usam contato real da VertexTarget; suspensão/despublicação operacional por acesso administrativo autorizado ao banco, sem um novo painel de moderação nesta entrega.

## 8. Prospects e pipeline

Cadastrar negócio manualmente é sempre possível. Campos: nome, setor, cidade, website opcional, telefone/e-mail opcionais, notas privadas e origem. Estados fixos: Novo, Contatado, Em proposta, Fechado e Descartado. Alteração por controle acessível; drag-and-drop não é requisito. Fechado não cria cobrança, cliente interno ou métrica de receita automaticamente.

Busca opcional assistida usa Google Search grounding, não Maps nem scraping. Exibir sugestões com fontes consultáveis, data e indicação de verificação manual. Site ausente/desatualizado é hipótese, nunca fato confirmado pela IA. Não inventar contatos, empresas, scores de confiabilidade ou fontes; sugestões sem fonte verificável são descartadas. Nenhum resultado cria prospect automaticamente; usuário revisa e escolhe quais salvar dentro do limite de 50. Estados vazios e falha do provedor não retornam negócios fictícios.

A integração deve respeitar os requisitos atuais de atribuição/search suggestions do Google. Se exigir HTML do provedor, isolá-lo em apresentação sandbox sem scripts/acesso ao documento, nunca misturar com templates publicados. Ler fontes não autoriza fetch de URLs arbitrárias no servidor. Confirmar suporte real do SDK ao limite de tool calls; se custo/atribuição não puderem ser controlados, bloquear a busca com mensagem explícita até resolver, sem anunciar integração concluída.

## 9. IA e configuração

Novo serviço usa SDK oficial `@google/genai`, exclusivamente servidor. Modelo inicial: `gemini-3.8-flash`, listado na documentação oficial consultada em 2026-10-02; reconfirmar disponibilidade e capacidades na implementação. `GEMINI_MODEL` permite somente modelos previamente validados, não input do cliente.

Chave canônica `GEMINI_API_KEY`. Compatibilidade temporária servidor com `GOOGLE_GEMINI_API_KEY` existente, com precedência documentada; nenhum segredo `NEXT_PUBLIC`. Validar configuração e exigir URL canônica HTTPS de produção, não derivar links de publicação/retorno de Host não confiável. Usar chave restrita ao produto e orçamento do provedor quando disponível.

Copy em JSON estruturado, validada pelo mesmo contrato dos documentos. Nenhum número de clientes, depoimento, prêmio, preço ou resultado é inventado. Briefing e conteúdo web são dados não confiáveis; não podem redefinir instruções nem solicitar segredos. Conteúdo privado só é enviado após ação explícita com aviso da finalidade.

Timeout/erro/JSON inválido retorna estado claro e preserva rascunho, com fallback manual. Respostas/logs não incluem erro bruto do provedor, prompt completo, tokens de sessão ou chave. Log mínimo: operação, resultado, modelo, duração, uso e código sanitizado. Sem streaming de documento incompleto: resultado só pode ser aplicado após validação completa.

O endpoint público de demo `/api/gemini` não pode continuar uma via ilimitada paralela ao freio global. Na entrega, a demonstração pública usa exemplo estático identificado; novas chamadas externas de IA exigem conta confirmada e passam pelo mesmo serviço de quotas. Preservar a interface da demonstração com CTA para a OS, sem execução cara anônima.

## 10. Dados e isolamento

Migrações novas versionadas localmente, após 008; não editar histórico aplicado nem assumir que 003–008 já estão no remoto.

Tabelas próprias, sem reutilizar as permissões do CRM interno:
- `os_workspaces`: owner único referenciando Auth, nome, jornada, status ativo/suspenso/excluído, plano gratuito controlado pelo servidor; workspace excluído conserva só a referência mínima de owner/status para bloquear recriação automática e permitir reativação consciente, sem restaurar conteúdo.
- `os_projects`: workspace, briefing/documento versionados, versão de concorrência, timestamps; máximo 1 vigente.
- `os_publications`: projeto/workspace, slug único, snapshot público e estado ativo/bloqueado; máximo 1 ativo/workspace.
- `os_prospects`: workspace, campos comerciais mínimos, origem/fontes e estado.
- `os_usage_operations`: usuário Auth estável, referência opcional ao workspace, operação, período, chave idempotente e estado reservado/enviado/concluído/falhou; excluir workspace não remove o consumo.
- `os_usage_counters`: contadores por identidade Auth/global/período, atualizados em transação com locks; a UI apresenta o consumo do workspace associado à identidade.
- `os_consents`: usuário, referência opcional ao workspace, versão, finalidade e instante do aceite; retenção mínima do aceite documentada separadamente do conteúdo excluído.
- `public_interests`: nome, e-mail, WhatsApp opcional, jornada, interesse (`solutions`, `education`, `community`), mensagem, consentimento opcional de marketing, versão do aviso, origem, chave de idempotência com hash do payload e timestamps; replay idêntico recebe confirmação genérica, payload diferente com a mesma chave é rejeitado, sem expor dados anteriores.
- `public_request_limits`: buckets e identificadores com hash para limites de formulário independentes da instância do servidor.

RLS em todas. Leitura privada só para owner confirmado do workspace ativo. Cliente não grava diretamente em quotas, publicação, plano, status, consentimentos ou interesses; mutações passam por serviço autorizado e funções transacionais com execute restrito ao serviço servidor. Sem grants padrão para `anon`/`authenticated` em funções privilegiadas. Funções SECURITY DEFINER têm search_path fixo, parâmetros validados e permissões revogadas por padrão.

Serviço servidor deriva user/workspace da identidade verificada; não aceita owner, plano, status de conta ou workspace enviados pelo cliente. Service role fica restrita à camada de dados, com autorização explícita antes de cada operação e verificação transacional do owner confirmado/ativo. Leitura do snapshot público é função específica de campos permitidos, sem privilégio para consultar rascunhos.

FKs compostas e validação transacional impedem ligar prospect/projeto/publicação de workspaces diferentes. Criação, quotas e publicação são atômicas: duplo clique/corrida não ultrapassam limites nem duplicam workspace. Erro de tabela/policy é bloqueio, nunca fallback para organização global.

Exclusão de um projeto também despublica sua versão. Configurações oferecem excluir workspace/dados próprios após reautenticação; a conta pode continuar existindo, sem renascer o workspace automaticamente fora do onboarding. Exclusão da identidade Auth é solicitação operacional pelo contato de privacidade, explicitada na política. Não resetar consumo mensal ao excluir/recriar workspace: contador de consumo também vinculado à identidade Auth estável. Rotinas de retenção não rodam sem autorização.

## 11. Captação, LGPD e antiabuso

Um formulário reutilizável para soluções, formação e comunidade: nome, e-mail, WhatsApp opcional com máscara/normalização BR, jornada, interesse e mensagem breve. Limites de campo/enum no servidor; jornada/interesse/origem por allowlist; sem importação automática ao CRM nem vinculação a uma organização escolhida pelo visitante.

Sucesso só após persistência. Erro preserva campos e oferece nova tentativa. Idempotência impede duplicata por retry. Nenhum insert/select anônimo direto de interesses. Equipe owner/sales consulta `/admin/interesses`; demais roles e clientes não podem listar. Inbox/WhatsApp/Stripe existentes não são ampliados nesta entrega.

Antispam: honeypot, CAPTCHA validado servidor e limites persistentes de 5 envios por 15 minutos por IP com HMAC e 3 por hora por e-mail normalizado com HMAC, usando segredo servidor `REQUEST_LIMIT_SECRET`; rejeição 429 com retry orientado. Endereço do cliente vem somente de headers sanitizados por proxy conhecido do ambiente; sem essa garantia, o freio por IP não é apresentado como confiável. Dados de rate limit expiram logicamente; operações não gravam IP bruto nem segredos. Usar CAPTCHA hCaptcha, suportado pelo Supabase, com widget via script oficial sob demanda e sem pacote React extra. Auth valida o token pelo Supabase; captação valida por siteverify e confere hostname/sitekey. Não reutilizar um token já consumido.

Configuração proposta: `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`, segredo servidor `HCAPTCHA_SECRET_KEY` para captação e segredo configurado no Supabase Auth. Separar sitekeys se a política do provedor exigir; a mesma credencial não dispensa tokens novos para cada submissão. Sem CAPTCHA/configuração necessária em produção, cadastro/captação bloqueiam com aviso; jamais liberar silenciosamente. Testes locais usam chaves oficiais de teste e hostname de desenvolvimento, não alterações no sistema operacional. Configurar proteção também nos endpoints diretos do Auth; limite em memória da aplicação não substitui proteção do provedor.

Exibir finalidade e link de privacidade na coleta. Marketing opcional desmarcado. Termos/privacidade descrevem IA, CAPTCHA, hospedagem de páginas e responsabilidade sobre dados de prospects; não apresentar texto como parecer jurídico. WhatsApp institucional somente quando número válido for configurado, sem fallback fictício. Sem número, usar formulário/e-mail real.

Não adicionar GA4/Meta Pixel sem IDs e autorização. Nenhum pixel/analytics opcional dispara antes do consentimento. Eventos de CTA/formulário/WhatsApp podem ser definidos sem carregar trackers; ativação posterior respeita consentimento e não envia campos pessoais. Sem trackers opcionais não há banner fictício para cookies inexistentes.

## 12. Componentes, dependências e manutenção

Reutilizar shells, cases e tokens quando compatíveis. Não refatorar CRM/financeiro/inbox. Novos módulos sob `src/lib/os/`, componentes sob `src/components/os/` e seções de ecossistema dentro da estrutura atual. Guia de 350 linhas por arquivo; contratos/validadores puros separados de acesso ao banco e UI.

Dependências propostas, ainda não instaladas:
- `motion` substitui `framer-motion`, atualizando todos os imports existentes para manter um único motor Motion. Verificar compatibilidade em templates, cursor e cases, sem redesenhar áreas não relacionadas.
- `@google/genai` para o produto novo; remover SDK antigo somente quando nenhum import depender dele.
- Primitivos shadcn acessíveis estritamente necessários para diálogos, tabs e accordion. Não existe `components.json`; validar CLI/documentação antes de criá-lo. Adaptar tokens ao design existente, sem instalar catálogos inteiros.

GSAP controla scroll/reveal; Motion controla presença e estado, sem disputar a mesma propriedade. Lenis apenas no shell público, com cleanup, reação a reduced-motion e scroll de modais corretamente bloqueado. Corrigir componentes reaproveitados que ignoram reduced-motion quando impactarem essas rotas. Fontes/imagens carregadas podem exigir refresh do ScrollTrigger. Three/Rive existentes não justificam novos assets pesados ou arquivos inventados.

## 13. Segurança e estados de erro

Novas mutações validam origem canônica, content-type, bytes antes de acumular corpo completo, schema estrito e autorização. Sem casts genéricos usados como validação. Retornos padronizados: 400 inválido; 401 sessão ausente; 403 ação proibida; 404 recurso indisponível/estrangeiro; 409 conflito/limite de projeto; 413 excesso de corpo; 415 formato; 429 quota/rate; 503 dependência/configuração ausente.

Limites de corpo: auth/interesses 8 KiB; briefing/documento 32 KiB; ações de prospect/publicação 8 KiB. Sem seleção de tabela/coluna, URLs de fetch ou instruções de modelo por input. Headers de segurança para as novas superfícies com CSP compatível com Next/GSAP/CAPTCHA, `nosniff`, referrer policy e restrição de framing; testar em vez de quebrar o widget ou a prévia.

Sem configurações externas: estrutura local e testes continuam possíveis, mas nenhuma interface anuncia cadastro, IA, persistência ou publicação real funcionando. Nunca substituir falha por sucesso simulado.

## 14. Critérios de aceite e evidências

| Área | Critério obrigatório |
| --- | --- |
| Site | Duas jornadas claras; cases preservados; formação/comunidade identificadas como preparação; sem oferta ou métrica inventada |
| Cadastro | Cadastro público, confirmação/reenvio/recuperação/logout, token inválido e e-mail duplicado tratados; nenhuma role interna criada |
| Isolamento | A/B não listam/leem/editam/publicam/excluem dados uma da outra por UI, API, RPC e leitura direta Supabase; anon não lê privado; cliente não entra no admin |
| Quotas | Chamadas concorrentes não ultrapassam teto; idem não duplica execução; falha de quota bloqueia chamada externa; exclusão/recriação não renova créditos |
| Editor | Três templates próprios; salvamento real e nova sessão; falha não perde texto; conflito 409; payload/links maliciosos rejeitados |
| IA | JSON validado, timeout/429/ausência de configuração, sugestões revisáveis, contagem e fallback manual; nenhum segredo no bundle/log |
| Prospecção | Manual funciona sem IA; busca com fontes/atribuição; nenhum contato inventado ou importado automaticamente; ausência de Maps declarada |
| Publicação | Anon só vê snapshot; editar draft não altera público; republicar atualiza; despublicar/excluir/suspender retira; colisão de slug tratada |
| Captação | Sucesso só após insert; consulta interna restrita; retry idempotente; CAPTCHA/hostname/honeypot/rate e telefone BR verificados |
| UI | Teclado, foco, rótulos, leitor de tela e contraste; 360 px e touch; sem scroll horizontal; reduced-motion antes/depois da montagem; sem erros de console/hidratação |
| SEO/performance | Metadata/canonical/robots/sitemap coerentes, áreas privadas noindex, snapshot sem PII privada; Lighthouse mobile medido, sem alegar metas não verificadas |

TDD para validação, quotas, concorrência, autorização, transições e publicação. Usar Node/assert/`node:test` já disponível, sem instalar Vitest automaticamente. Testes devem invocar lógica real, não simular isolamento com um objeto desconectado do serviço. Quotas/RLS necessitam testes de integração em banco isolado autorizado, incluindo SQL concorrente e chamadas como anon/authenticated; contratos puros não comprovam RLS.

Gates confirmados no projeto: `npm exec -- tsc --noEmit`, `npm run lint`, `npm run test:commercial`, `npm run build`. Acrescentar teste específico da OS no plano. Avisos preexistentes ficam explícitos; não desabilitar regras nem alterar baseline para esconder problemas.

Metas mobile/4G do projeto: LCP < 2,5 s, INP < 200 ms, CLS < 0,1, Lighthouse Performance ≥ 90 e Acessibilidade ≥ 95. Lighthouse não comprova sozinho INP de usuários reais: separar medição de laboratório de métricas de campo. Sem ferramenta/dados, registrar a etapa bloqueada, não concluir a meta.

## 15. Dependências externas e autorização de lançamento

Esta especificação e o futuro plano não autorizam aplicar migrations, mudar Supabase Auth, criar conta CAPTCHA, consumir APIs pagas, cadastrar produtos Stripe ou fazer deploy.

Antes de lançar publicamente, com autorização específica:
1. Confirmar projeto/ambiente e estado real das migrations; testar novas migrations/RLS em banco isolado antes de aplicação remota.
2. Configurar confirmação de e-mail, SMTP de produção, allowlist de URLs, templates de confirmação/recuperação, CAPTCHA e limites do Supabase Auth. SMTP real é condição de cadastro público utilizável.
3. Configurar hostname de teste/produção no hCaptcha, segredos, domínio canônico, contato/WhatsApp reais e Gemini com orçamento/limites e atribuição verificados.
4. Revisar termos/privacidade, política de conteúdo e canal de denúncia; configurar operação de suspensão/remoção e retenção de interesses/logs (proposta: 12 meses para interesses e 90 dias para logs operacionais, com exceções legais documentadas).
5. Executar E2E com duas contas de teste sem dados de produção, auditoria visual, gates e desempenho medido.
6. Autorizar deploy separadamente. Se algum requisito obrigatório estiver bloqueado, entregar código e evidências locais, identificando o bloqueio; não chamar o produto de lançado.

## 16. Fontes e limites da pesquisa

- [Valyos](https://valyos.com.br/): referência funcional e comercial, não integração nem prova de resultados VertexTarget.
- [G4](https://g4business.com/): referência de organização de conhecimento, execução e conexões, sem copiar marcas/conteúdo.
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs) e [confirmação](https://supabase.com/docs/guides/auth/auth-email-templates): identidade verificada e confirmação por token; adaptar middleware ao Next 15 deste projeto.
- [Supabase CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha) e [hCaptcha](https://docs.hcaptcha.com/): proteção de Auth e validação servidor para formulário.
- [Modelos Gemini](https://ai.google.dev/gemini-api/docs/models) e [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search): modelo oficial, SDK, fontes, sugestões e cobrança por queries. Consultados em 2026-10-02; acesso real da conta ainda não testado.

Auto-revisão documental: separar decisões aprovadas dos limites propostos; distinguir código existente de funcionalidades novas; explicitar segurança, erros, testes e bloqueios externos; nenhum compromisso de produção ou implementação antes dos gates de aprovação.
