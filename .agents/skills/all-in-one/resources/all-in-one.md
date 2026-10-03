---
description: >-
  Executa o ciclo de desenvolvimento com All-in-One: contexto, Brainstorming,
  Ponytail, design, plano, TDD, documentos, quality gates e verificação.
argument-hint: <descrição do objetivo, feature ou tarefa>
---

# /all-in-one — Orquestrador Mestre de Desenvolvimento

Fonte: comando `all-in-one.md` anexado pelo usuário, adaptado ao projeto atual.

Leia a [Skill All-in-One](../SKILL.md) e aplique o roteiro abaixo ao objetivo informado em `/all-in-one <objetivo>`.

Este arquivo é um recurso da skill, não um registro autônomo de comando. Em clientes compatíveis, a descoberta da skill em `.agents/skills/all-in-one/SKILL.md` permite sua invocação por nome. Se o cliente não suportar slash commands, peça explicitamente: “Use a skill all-in-one para <objetivo>”.

A execução segue `AGENTS.md`, as permissões do ambiente e as ferramentas existentes. Consulte o [catálogo instalado](../../../SKILLS.md) e os [limites locais](../../AGENTS.md). Referências a MCPs e CLIs não significam que estejam instalados. Commit, push, PR, merge, deploy e instalações globais exigem pedido/autorização do usuário.

## Fase 1 — Inteligência e contexto estrutural

- Leia regras, `package.json`, lockfile e arquivos relevantes.
- Consulte `MEMORY.md` se existir e Graphify se instalado; sem eles, mapeie impactos por busca de referências.
- Valide APIs na documentação oficial, usando Context7 somente se conectado.

## Fase 2 — Concepção e escopo crítico

- Use Brainstorming e Ponytail quando disponíveis.
- Esclareça ambiguidades essenciais e aplique YAGNI: precisa existir? Já existe? O framework, recurso nativo ou dependência instalada resolve?

## Fase 3 — Direção de arte e padrões de UI

Somente para frontend:

- Use as diretrizes locais de `landing-pages-premium` e os tokens de `src/app/globals.css`.
- Reaproveite componentes permitidos e disponíveis; preserve identidade, foco visível, acessibilidade, `tabular-nums` e movimento reduzido.
- Não importe a paleta ou dependências do projeto de origem.

## Fase 4 — Plano granular

- Registre passos, arquivos, dependências e verificações na ferramenta de planejamento.
- Para mudanças extensas, salve o plano em `docs/superpowers/plans/`.
- Use apenas comandos confirmados no projeto.

## Fase 5 — Implementação disciplinada

- Para lógica, escreva testes antes da implementação com o mecanismo existente.
- Implemente o mínimo necessário e refatore mantendo testes verdes.
- Delegue apenas arquivos disjuntos; sem subagentes disponíveis, execute sequencialmente.

## Fase 6 — Dados e documentos

Somente para relatórios e planilhas:

- XLSX/PDF/DOCX Anthropic não foram instaladas por restrições de licença. Use apenas recursos existentes ou fontes com permissão verificável de uso local.
- Valide fórmulas, integridade, glifos e layout usando recursos disponíveis, sem inventar dados nem instalar bibliotecas automaticamente.

## Fase 7 — Quality gates

- Execute `npm run lint`.
- Preserve isolamento de dados fora da apresentação e limite local de 350 linhas.
- Não desative regras nem execute rotinas de manutenção sem pedido.

## Fase 8 — Verificação final

Confira os scripts atuais. Os comandos disponíveis na instalação são:

```bash
npm exec -- tsc --noEmit
npm run lint
npm run test:commercial
npm run build
```

Execute as verificações aplicáveis e reporte resultados, avisos e bloqueios. Não há scripts genéricos `test` e `typecheck` nesta versão. Atualize o grafo somente se disponível e pertinente. Entregue evidências e links dos arquivos alterados, sem afirmar medições não realizadas.
