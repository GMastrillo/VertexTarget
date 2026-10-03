---
name: graphify
description: >-
  Orienta mapeamento estrutural e consultas de impacto com Graphify quando
  disponível. Use para entender dependências e grafo de conhecimento do projeto;
  sem CLI instalada, faça busca de referências sem afirmar que gerou um grafo.
license: MIT
---

# Graphify — Orientação Estrutural

Adaptação do guia do Vibe Coding Toolkit:
https://github.com/soumatheusgomes/vibe-coding-toolkit,
revisão `13add21194467dfd2fc5b408ddb3398d306a4c78`.
Licença: [MIT](../../licenses/toolkit-LICENSE.txt).

Consulte [o guia de referência](resources/07-graphify.md).
Esta é uma skill consultiva, não uma instalação da CLI `graphifyy`.

## Aplicação neste workspace

1. Confirme disponibilidade e versão da CLI antes de executar comandos.
2. Se houver grafo existente, consulte dependências e verifique sua atualidade.
   Distinga relações extraídas de inferidas.
3. Sem CLI/grafo, use busca de imports, referências e leitura de código. Informe
   a limitação; não invente resultados estruturais.
4. Indexação deve excluir segredos, dependências, artefatos de build e conteúdo
   de terceiros não pertinente. Não envie dados a LLMs ou serviços externos
   sem autorização.
5. `extract`, `update`, hooks, watch e configuração MCP só rodam quando
   solicitados/autorizados e com comandos confirmados na versão instalada.
6. Não execute instalações globais propostas no guia. Uma futura instalação
   deverá ser isolada dentro do projeto e autorizada separadamente.
7. Os comandos `gsd-graphify` pertencem ao framework GSD e não são sinônimos
   desta skill nem prova de que a CLI esteja instalada.
