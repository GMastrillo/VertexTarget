---
name: web-interface-guidelines
description: >-
  Audita interfaces conforme Web Interface Guidelines da Vercel, cobrindo
  acessibilidade, foco, formulários, animação, layout, performance e hidratação.
  Use para revisão de UI/UX, acessibilidade ou conformidade de interfaces.
license: MIT
---

# Web Interface Guidelines

Adaptação local de https://github.com/vercel-labs/web-interface-guidelines,
revisão `e3d624baaf29dc1fc645aff3e38f03e564d2d6b1`.
Licença: [MIT](../../licenses/vercel-LICENSE.txt).

O upstream publica `command.md`, não uma pasta de skill. Os arquivos oficiais
estão preservados sem alterações nos recursos abaixo.

1. Leia [o roteiro oficial de auditoria](resources/command.md).
2. Consulte [as diretrizes completas](resources/README.md).
3. Inspecione os arquivos solicitados, incluindo estados vazios, erros, loading,
   teclado, mobile, foco visível, movimento reduzido e hidratação.
4. Relate achados por arquivo e linha, com gravidade e correção sugerida.
5. Não declare medições ou testes de navegador que não realizou.

## Compatibilidade local

- `AGENTS.md`, a stack e os tokens existentes prevalecem sobre sugestões de
  bibliotecas, convenções de copy ou preferências de animação do guia.
- Responda em pt-BR com links relativos aos arquivos do workspace.
- Reutilize `next/image`, `next/font` e os componentes existentes; não instale
  alternativas ou dependências para executar apenas uma auditoria.
- Corrija achados somente se a tarefa pedir implementação, não só revisão.
