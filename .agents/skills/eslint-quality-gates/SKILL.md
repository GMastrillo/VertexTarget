---
name: eslint-quality-gates
description: >-
  Orienta análise e manutenção de quality gates ESLint, limite de arquivos e
  isolamento de dados na apresentação. Use para pedidos explícitos de auditoria,
  instalação ou manutenção de gates, sem executar burndown automaticamente.
license: MIT
---

# ESLint Quality Gates

Adaptação da documentação do Vibe Coding Toolkit:
https://github.com/soumatheusgomes/vibe-coding-toolkit,
revisão `13add21194467dfd2fc5b408ddb3398d306a4c78`.
Licença: [MIT](../../licenses/toolkit-LICENSE.txt).

Leia [o guia oficial](resources/06-eslint-biome-quality-gates.md).

## Aplicação neste workspace

- Confira `package.json`, `eslint.config.mjs`, `eslint.typed.config.mjs` e
  `eslint-rules/` antes de propor mudanças. Os gates já existem neste projeto.
- Preserve `MAX_LINES=350`, isolamento de dados e o gerenciador npm.
- Meça com `npm run lint`; use `npm run lint:types` quando pertinente.
- Diferencie erros, avisos existentes e regressões. Não esconda findings,
  flexibilize limites ou altere baselines para fazer checks passarem.
- Instalação de gates, refatoração por tamanho e warning burndown são ações
  separadas. As rotinas de `AGENTS.md` só rodam sob pedido explícito.
- Não introduza Biome, hooks ou novas dependências apenas porque o guia cita
  essas opções. Esta instalação disponibiliza conhecimento, não altera o lint.
