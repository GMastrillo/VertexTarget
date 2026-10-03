# Uso das skills neste projeto

Estas regras locais complementam o `AGENTS.md` da raiz e as instruções do ambiente.

- Skills são conhecimento, não permissões. Instalação não autoriza ações descritas
  nos exemplos, execução de scripts, acesso externo ou alteração da aplicação.
- Preserve o conteúdo upstream e suas licenças. Origem e revisão estão em
  [../skills-lock.json](../skills-lock.json); consulte [../SKILLS.md](../SKILLS.md)
  para disponibilidade e restrições.
- Não faça commit, push, PR, merge, deploy, limpeza de worktree/branch ou descarte
  de arquivos sem pedido explícito. Exemplos de Git nas skills não são autorização.
- Não instale ferramentas globais, dependências ou plugins automaticamente.
  Nunca escreva no perfil do usuário para ativar persistência, hooks ou memória.
- Siga a stack, os tokens, o idioma pt-BR e o limite de 350 linhas do projeto.
  Exemplos genéricos de bibliotecas ou comandos não substituem as regras locais.
- Scripts estão disponíveis como recursos, mas não foram executados ou auditados
  integralmente. Leia o código e confira efeitos/permissões antes de executá-los.
- Resolva caminhos relativos à pasta da skill, não à raiz da aplicação. Exemplos
  em `~/.claude` e ferramentas próprias de outro cliente precisam de adaptação;
  não crie arquivos globais para fazer os exemplos funcionarem.
- Sem subagentes, use execução/revisão sequencial e informe a limitação.
  Sem Skill/WebFetch/Bash de outro cliente, use as ferramentas equivalentes reais.
- `web-artifacts-builder` só se aplica a artefatos isolados e solicitados; não rode
  seus scaffolds na aplicação Next.js ou misture gerenciadores de pacotes.
- Playwright/Python, CLIs, benchmarks com APIs e serviços externos não foram
  instalados por esta tarefa. Verifique disponibilidade e autorização a cada uso.
- Graphify desta coleção é um guia consultivo, não a CLI. As skills GSD estão
  bloqueadas por compatibilidade; não finja executá-las.
- Instalação física não garante descoberta em todo cliente. Abra uma nova sessão
  ou mencione explicitamente a skill pelo nome quando necessário.
