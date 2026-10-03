---
name: parallel-subagent-driven-development
description: >-
  Organiza implementação em ondas paralelas com arquivos disjuntos e dependências
  explícitas. Use para planos com tarefas independentes ou coordenação segura
  de subagentes, evitando colisões de arquivo e de commit.
license: MIT
---

# Parallel Subagent-Driven Development

Adaptação do Vibe Coding Toolkit de Matheus Gomes:
https://github.com/soumatheusgomes/vibe-coding-toolkit,
revisão `13add21194467dfd2fc5b408ddb3398d306a4c78`.
Licença: [MIT](../../licenses/toolkit-LICENSE.txt).

Leia [o protocolo original](resources/parallel-subagent-driven-development.md).

## Aplicação neste workspace

1. Para cada tarefa, registre `Files`, `Depends-on` e critério de verificação.
2. Monte uma onda somente se arquivos forem disjuntos e não houver dependência
   entre tarefas. Na dúvida, execute sequencialmente.
3. Despache implementadores somente se houver suporte real a subagentes.
   Sem esse recurso, aplique o mesmo plano sequencialmente.
4. Implementadores não fazem commit; entregam arquivos alterados e evidências.
5. O controlador revisa os resultados e registra um único resumo por onda.
6. Diferentemente do protocolo original, commits não são etapa automática:
   exigem solicitação do usuário. Sem pedido de commit, revise alterações
   no working tree em vez de criar ranges artificiais no histórico.
7. Criação de worktree, branch, PR, merge ou descarte exige autorização e deve
   preservar mudanças de outras sessões.

Use `subagent-driven-development` para os contratos de implementação/revisão,
respeitando as permissões do ambiente e as regras de `AGENTS.md`.
