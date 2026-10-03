# Skills públicas — catálogo local

Foram adicionadas **27 skills** em `.agents/skills/`: **22 pacotes originais**
com todos os seus arquivos e **5 adaptadores locais** baseados em fontes públicas.
As skills anteriores `all-in-one`, `autorun` e `landing-pages-premium` foram preservadas.

- Escopo: somente este projeto; nenhuma instalação global, hook ou MCP ativado.
- Revisões e checksums: [skills-lock.json](skills-lock.json).
- Licenças preservadas: [licenses/README.md](licenses/README.md).
- Limites de execução: [skills/AGENTS.md](skills/AGENTS.md).
- Os scripts distribuídos são recursos; não foram executados nesta instalação.

## Fontes verificadas

| Origem oficial | Licença dos materiais instalados | Revisão |
| --- | --- | --- |
| [obra/superpowers](https://github.com/obra/superpowers) | MIT | `8ca22dba9a94f28898bbce59f2537ff4d87c747d` |
| [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 nas cinco skills selecionadas | `8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4` |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | MIT | `e3ba2aa6f1e6f0bc4d69eb09c9f0d0a93af56156` |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Apache-2.0 na revisão baixada | `b39c90862855ad2f0813ce775b8bf07a9d6d2a50` |
| [soumatheusgomes/vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit) | MIT | `13add21194467dfd2fc5b408ddb3398d306a4c78` |
| [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) | MIT | `e3d624baaf29dc1fc645aff3e38f03e564d2d6b1` |

Superpowers é de Jesse Vincent/Prime Radiant, não um repositório da Anthropic;
estar no marketplace oficial não muda sua autoria.

## Superpowers — 15 skills originais

| Skill | Uso |
| --- | --- |
| [using-superpowers](skills/using-superpowers/SKILL.md) | Descoberta e seleção de skills |
| [brainstorming](skills/brainstorming/SKILL.md) | Exploração de requisitos e alternativas |
| [writing-plans](skills/writing-plans/SKILL.md) | Plano granular com verificação |
| [executing-plans](skills/executing-plans/SKILL.md) | Execução inline de um plano |
| [subagent-driven-development](skills/subagent-driven-development/SKILL.md) | Implementação e revisão por tarefa |
| [dispatching-parallel-agents](skills/dispatching-parallel-agents/SKILL.md) | Delegação de tarefas independentes |
| [test-driven-development](skills/test-driven-development/SKILL.md) | Vermelho, verde e refatoração |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | Reprodução e causa raiz |
| [verification-before-completion](skills/verification-before-completion/SKILL.md) | Evidências antes de conclusão |
| [requesting-code-review](skills/requesting-code-review/SKILL.md) | Preparação de revisão |
| [receiving-code-review](skills/receiving-code-review/SKILL.md) | Avaliação técnica dos apontamentos |
| [using-git-worktrees](skills/using-git-worktrees/SKILL.md) | Isolamento quando solicitado |
| [finishing-a-development-branch](skills/finishing-a-development-branch/SKILL.md) | Encerramento de branch autorizado |
| [writing-skills](skills/writing-skills/SKILL.md) | Estrutura e autoria de skills |
| [diagnosing-superpowers](skills/diagnosing-superpowers/SKILL.md) | Diagnóstico do fluxo do agente |

As pastas completas foram preservadas: scripts, referências e templates internos
não foram reduzidos a apenas `SKILL.md`. Hooks do plugin e autoativação de sessão
não foram instalados. O visual companion opcional possui comunicação externa/
telemetria segundo o README upstream; só deve ser iniciado com autorização.

## Anthropic — 5 skills originais Apache-2.0

| Skill | Uso |
| --- | --- |
| [frontend-design](skills/frontend-design/SKILL.md) | Direção de arte e design deliberado |
| [skill-creator](skills/skill-creator/SKILL.md) | Criação e avaliação de skills |
| [mcp-builder](skills/mcp-builder/SKILL.md) | Desenvolvimento de servidores MCP |
| [web-artifacts-builder](skills/web-artifacts-builder/SKILL.md) | Artefatos HTML isolados |
| [webapp-testing](skills/webapp-testing/SKILL.md) | Testes de aplicações com Playwright |

Cada pasta contém `LICENSE.txt`; avisos de terceiros do repositório foram
preservados. Instalação não instala Python, Playwright, SDKs ou CLIs. Não execute
scaffolding de artefatos na raiz da aplicação nem substitua o Next.js existente.

## Personas — 2 skills originais

- [ponytail](skills/ponytail/SKILL.md) — anti-overengineering, MIT.
- [caveman](skills/caveman/SKILL.md) — comunicação concisa, Apache-2.0.

Somente as skills citadas no catálogo foram adicionadas, não os plugins completos,
proxies, hooks, modos globais ou as skills extras desses repositórios.

## Toolkit e Vercel — 5 adaptadores locais

Esses itens eram guias/regras/comandos, não pacotes `SKILL.md` oficiais.
Os adaptadores estão identificados como locais, com os recursos originais
preservados e limitações compatíveis com o projeto.

- [parallel-subagent-driven-development](skills/parallel-subagent-driven-development/SKILL.md)
  — ondas com arquivos disjuntos; commits somente quando pedidos.
- [eslint-quality-gates](skills/eslint-quality-gates/SKILL.md)
  — consulta aos gates existentes, sem disparar rotinas de manutenção.
- [two-tier-memory](skills/two-tier-memory/SKILL.md)
  — política de índice curto e notas duráveis; não cria memória automaticamente.
- [graphify](skills/graphify/SKILL.md)
  — guia consultivo do Toolkit; **não instala nem habilita a CLI Graphify**.
- [web-interface-guidelines](skills/web-interface-guidelines/SKILL.md)
  — empacota o comando e guia MIT oficiais da Vercel.

## Itens não instalados

### XLSX, PDF e DOCX — restrição de licença

O [README Anthropic](https://github.com/anthropics/skills) classifica essas skills
como source-available, não open source. A licença atual proíbe manter cópias fora
dos serviços, reprodução, derivados e distribuição. Por isso não foram copiadas,
nem substituídas por forks com licença presumida.

Evidências consultadas:

- [XLSX LICENSE.txt](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/xlsx/LICENSE.txt)
- [PDF LICENSE.txt](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/pdf/LICENSE.txt)
- [DOCX LICENSE.txt](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/docx/LICENSE.txt)

### Dev LP e Dev Imobiliária — fonte não verificável

`dev-lp` e `dev-imobiliaria` só aparecem no anexo como arquivos particulares de
outra máquina. Não foi encontrada fonte pública oficial com licença verificável.
As diretrizes de landing pages já existentes continuam disponíveis.

### GSD — compatibilidade de runtime

Fonte identificada pelos nomes específicos do catálogo:
[open-gsd/gsd-core](https://github.com/open-gsd/gsd-core), MIT,
revisão `957faa55b6f71c4f96f2fb0861924c5aab6917be`, versão `1.15.0`.

- O pacote exige Node `>=24.0.0`; este workspace usa `22.16.0`.
- O autor exige o [instalador oficial](https://github.com/open-gsd/gsd-core/blob/957faa55b6f71c4f96f2fb0861924c5aab6917be/docs/how-to/install-on-your-runtime.md)
  para transformar caminhos, metadados, ferramentas e layout por cliente.
- Freebuff não é listado como runtime suportado. Não foi escolhido outro cliente
  arbitrariamente nem executado um instalador que poderia registrar hooks.
- Nenhuma skill `gsd-*` foi marcada como instalada; não foram criados prompts com
  referências globais quebradas. Concluir essa instalação exige um runtime
  compatível e decisão explícita do usuário sobre o cliente de destino.

## Verificação da instalação

- 27 skills: frontmatter YAML, nomes únicos, licenças e hashes SHA-256 aprovados.
- 136 arquivos locais contabilizados; 126 arquivos upstream comparados com as
  revisões oficiais, permitindo apenas normalização de finais de linha CRLF.
- 59 links locais do catálogo, da All-in-One e dos adaptadores conferidos.
- Tipagem (`npm exec -- tsc --noEmit`) e build (`npm run build`) aprovados.
- Lint (`npm run lint`): zero erros e 16 avisos preexistentes na aplicação.
- Contratos (`npm run test:commercial`): 30 verificações aprovadas. O próprio
  teste informa que validação remota de migrações permanece bloqueada.
- Clones temporários da pesquisa removidos; recursos instalados preservados.
- Nenhum script upstream, hook, benchmark com API ou instalador global executado.
- Testes visuais, Lighthouse e descoberta em outras IDEs não foram realizados:
  esta tarefa não altera a interface nem configura esses clientes.

## Uso

Em uma nova sessão, peça por exemplo:

- “Use all-in-one para implementar esta funcionalidade.”
- “Use systematic-debugging para investigar este erro.”
- “Use web-interface-guidelines para auditar esta interface.”

A descoberta e slash commands dependem do cliente; não foram testados em todas
as IDEs. Ler uma skill não torna suas ferramentas disponíveis nem autoriza ações
externas. Esta coleção não instala MCPs, bibliotecas de aplicação ou ferramentas
globais e não executa manutenção, commits ou publicação.
