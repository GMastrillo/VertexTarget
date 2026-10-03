---
name: two-tier-memory
description: >-
  Mantém memória de projeto em duas camadas: índice curto e notas duráveis por
  tópico. Use quando solicitado registrar aprendizados, configurar memória ou
  reduzir contexto repetido entre sessões sem armazenar segredos.
license: MIT
---

# Two-Tier Memory

Adaptação do Vibe Coding Toolkit:
https://github.com/soumatheusgomes/vibe-coding-toolkit,
revisão `13add21194467dfd2fc5b408ddb3398d306a4c78`.
Licença: [MIT](../../licenses/toolkit-LICENSE.txt).

Consulte [o guia de memória](resources/09-claude-memory-system.md),
[o guia de longo prazo](resources/08-obsidian-memory.md) e
[o roteiro de bootstrap](resources/06-memory-bootstrap.md).

## Aplicação neste workspace

- Procure a memória existente antes de criar arquivos. A instalação desta skill
  não cria `MEMORY.md` nem garante carregamento automático pela IDE.
- Mantenha o índice com teto indicativo de 130 linhas; salve apenas decisões e
  aprendizados duráveis que não sejam óbvios no código ou já estejam nas regras.
- Nunca salve chaves, tokens, dados pessoais, transcrições privadas ou conteúdo
  de outros projetos. Registre a fonte e diferencie fatos de hipóteses.
- Prefira notas locais na estrutura já usada; Obsidian/MCP só se disponível e
  autorizado. Nenhuma integração externa é instalada por esta skill.
- Antes de migrar: busque duplicatas, siga o formato do destino, grave, leia
  de volta e somente então remova a entrada antiga. Nunca perca dados para
  reduzir o índice.
