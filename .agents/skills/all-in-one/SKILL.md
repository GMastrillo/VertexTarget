---
name: all-in-one
description: >-
  Orquestra desenvolvimento de ponta a ponta com contexto, Brainstorming,
  Ponytail, design de interface, planejamento, TDD, execução segura,
  documentos e verificação. Use quando o usuário solicitar All-in-One,
  /all-in-one ou um ciclo completo de implementação, correção, refatoração,
  auditoria ou exportação de dados.
---

# All-in-One — Orquestrador Mestre de Desenvolvimento

Fonte: template da seção 5 do anexo `ALL_IN_ONE_SKILL_MASTER.md` fornecido pelo usuário.
Adaptado para este workspace, sem dependência de caminhos absolutos de outra máquina.

## Escopo e ativação

- Leia esta skill quando solicitada por nome ou por `/all-in-one <objetivo>` em um cliente que suporte skills como comandos.
- O roteiro do comando está em [resources/all-in-one.md](resources/all-in-one.md).
- Siga `AGENTS.md` e as instruções do ambiente. Esta skill complementa, não substitui, as regras do projeto.
- Consulte o [catálogo local](../../SKILLS.md) e o [registro de versões](../../skills-lock.json): 27 skills públicas/adaptadores foram instalados separadamente. MCPs, CLIs, Vitest e bibliotecas de documentos não foram instalados.
- Leia os [limites locais das skills](../AGENTS.md). XLSX/PDF/DOCX têm restrições de licença, GSD está bloqueado por compatibilidade e dev-lp/dev-imobiliaria não possuem fonte pública verificada.
- Verifique quais recursos estão presentes antes de usá-los. Não afirme ativação de ferramentas indisponíveis.
- Não instale ferramentas globais, execute rotinas de manutenção, faça commit, push, PR, merge ou deploy sem solicitação/autorização do usuário.

## As 7 leis de engenharia

1. **Contexto antes da ação:** leia as regras, os arquivos relevantes e `package.json`. Consulte `MEMORY.md`, Graphify e documentação atual quando disponíveis e pertinentes.
2. **Escada Ponytail:** pare na primeira solução válida: YAGNI → reuso → biblioteca padrão/framework → recurso nativo → dependência existente → uma linha → mínimo código novo.
3. **Plano verificável:** mudanças com dois ou mais passos exigem um plano com arquivos, dependências e verificações explícitas.
4. **TDD para lógica:** para lógica de negócio, cálculos e serviços, escreva um teste que falha antes da implementação. Use o mecanismo de testes existente; não introduza Vitest automaticamente.
5. **Ondas paralelas seguras:** delegue apenas tarefas com arquivos disjuntos e sem dependência de estado. Se não houver subagentes, execute sequencialmente. Nenhum agente comita sem pedido do usuário.
6. **Fronteiras arquiteturais:** preserve tipagem estrita, isolamento de dados fora dos componentes visuais e limite de 350 linhas para código novo, conforme as regras locais.
7. **Evidência antes da declaração:** execute verificações aplicáveis, leia os resultados e reporte falhas, avisos e bloqueios. Nunca trate verificações não executadas como aprovadas.

## Esteira em 8 fases

### Fase 1 — Inteligência e contexto estrutural

- Leia `AGENTS.md`, `package.json`, o lockfile e os arquivos envolvidos.
- Consulte `MEMORY.md` se existir; sua ausência não bloqueia a tarefa.
- A skill local `graphify` é consultiva e não instala a CLI. Se a CLI estiver disponível e houver `graphify-out/`, consulte o grafo para mapear impactos. Caso contrário, use busca de referências e leitura do código.
- Descubra as ferramentas realmente disponíveis. Use Context7 se conectado; sem ele, consulte documentação oficial pelas ferramentas de pesquisa do ambiente.
- Não assuma versões do catálogo: a referência de versão é o projeto atual.

### Fase 2 — Concepção e escopo crítico

- Use `brainstorming` e `ponytail` se as respectivas skills estiverem instaladas.
- Esclareça apenas ambiguidades essenciais com a ferramenta de perguntas disponível.
- Aplique a escada Ponytail, priorizando reuso e a menor alteração que resolva o pedido.
- Não transforme uma instalação de Markdown ou mudança trivial em uma reestruturação da aplicação.

### Fase 3 — Direção de arte e conformidade de UI

Execute apenas para tarefas de frontend.

- Reaproveite a skill local `landing-pages-premium` e os componentes existentes em `src/components/`.
- Leia `src/app/globals.css` e preserve os tokens da marca; não imponha a paleta Spice Red do projeto de origem.
- Consulte `frontend-design` e `web-interface-guidelines` se instaladas.
- Use shadcn/ui e as fontes permitidas por `AGENTS.md`, verificando documentação, disponibilidade e licença. Não instale componentes de catálogos incompatíveis com a stack local.
- Garanta semântica, foco visível, nomes acessíveis, contraste, `prefers-reduced-motion` e `tabular-nums` onde pertinente.

### Fase 4 — Plano granular

- Divida o trabalho em tarefas pequenas, com arquivos e dependências explícitos.
- Use a ferramenta de planejamento do ambiente. Para mudanças extensas, registre o plano em `docs/superpowers/plans/`.
- Associe a cada etapa um critério de verificação e um comando real, quando houver.
- Reutilize `writing-plans` se instalada, sem inventar scripts ausentes.

### Fase 5 — Implementação disciplinada

- Aplique vermelho → verde → refatoração em lógica nova ou corrigida.
- Use os testes existentes e implemente o mínimo necessário para passarem.
- Reutilize `test-driven-development` e `parallel-subagent-driven-development` se disponíveis.
- Paralelize somente escopos de arquivos disjuntos; revise os resultados antes de integrá-los.
- Preserve alterações de outros agentes e do usuário. Não instale dependências apenas por constarem no blueprint.

### Fase 6 — Dados e documentos

Execute apenas para relatórios, planilhas ou documentos.

- As skills Anthropic `xlsx`, `pdf` e `docx` não foram copiadas porque suas licenças atuais restringem retenção e reprodução fora dos serviços. Informe essa limitação e use apenas recursos existentes ou fontes cuja licença permita o uso local; autorização do usuário não substitui permissão do titular.
- **XLSX:** prefira fórmulas nativas, documente suposições, formate moedas e valide integridade e recálculo quando possível.
- **PDF:** preserve glifos e layout; use `pdf-lib` ou outro recurso indicado pela skill somente se disponível e compatível com o projeto.
- **DOCX:** respeite estilos e dimensões explícitas de tabelas.
- Não invente dados de negócio, métricas ou resultados de validação.

### Fase 7 — Quality gates

- Execute `npm run lint` e leia erros e avisos.
- Respeite o limite de 350 linhas e o isolamento de acesso a dados definidos no ESLint local.
- Não altere baselines, desabilite regras ou execute rotinas de burndown sem solicitação.

### Fase 8 — Verificação final e entrega

Descubra novamente os comandos em `package.json`, pois podem mudar. Na instalação desta skill, o projeto usa npm e possui:

| Verificação | Comando disponível |
| --- | --- |
| Tipagem | `npm exec -- tsc --noEmit` |
| Lint | `npm run lint` |
| Contratos comerciais | `npm run test:commercial` |
| Build | `npm run build` |

- Não há scripts `test` ou `typecheck` nem Vitest instalado nesta versão; não execute comandos inexistentes.
- Os contratos comerciais não substituem testes específicos de uma nova funcionalidade ou E2E.
- Rode as verificações pertinentes à alteração e o Definition of Done de `AGENTS.md`; informe qualquer etapa não aplicável ou bloqueada.
- Para UI, verifique console, hidratação, teclado, mobile e movimento reduzido; não afirme metas Lighthouse sem medição.
- Atualize o grafo apenas se Graphify estiver disponível, a estrutura de código tiver mudado e a operação for permitida pelo ambiente.
- Entregue um resumo conciso em pt-BR, com links relativos aos arquivos e evidências das verificações.

## Roteamento de tarefas

| Tipo | Fluxo principal | Evidência esperada |
| --- | --- | --- |
| Feature | Contexto → concepção → plano → TDD → implementação | Testes relevantes, tipos, lint e build |
| Bug | Reprodução → causa raiz → regressão → correção mínima | Teste de regressão e verificações pertinentes |
| Refatoração | Referências/grafo → plano → escopos disjuntos → revisão | Comportamento preservado e gates aplicáveis |
| UI | Tokens → design → implementação → auditoria visual | Acessibilidade, mobile, console e performance medida |
| Documentos | Skill específica → dados reais → geração → validação | Integridade e inspeção do arquivo gerado |
| Skills/Markdown | Fontes → instalação local → revisão de metadados e links | Frontmatter válido, caminhos portáveis e escopo preservado |
