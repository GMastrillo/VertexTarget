import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Serviço | VertexTarget',
  description: 'Condições gerais de uso da plataforma VertexTarget e do sistema operacional Vertex OS.',
};

export default function TermosPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="border-b border-border px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            VertexTarget
          </Link>
          <Link href="/os/entrar" className="text-xs font-semibold text-primary hover:underline">
            Acessar Vertex OS →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Termos de Serviço
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Última atualização: Outubro de 2026 · Válido para a plataforma VertexTarget e o sistema Vertex OS.
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">1. Objeto e Aceitação</h2>
          <p>
            Estes Termos de Serviço regem o acesso e a utilização dos serviços de desenvolvimento de landing pages sob
            medida e da plataforma de software Vertex OS fornecidos pela VertexTarget. Ao criar uma conta ou utilizar
            qualquer funcionalidade do sistema, você concorda integralmente com estes termos.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">2. Plano Gratuito e Quotas Operacionais</h2>
          <p>
            O Vertex OS oferece uma camada gratuita com limites mensais claros para permitir experimentação transparente
            sem surpresas ou cobranças automáticas:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Workspaces e Projetos:</strong> Limite de 1 workspace ativo e 1 projeto com persistência de dados.
            </li>
            <li>
              <strong>Publicação:</strong> 1 site publicado simultaneamente com URL segura gerada pelo sistema.
            </li>
            <li>
              <strong>Pipeline Comercial:</strong> Até 50 prospects cadastrados com campos estruturados e etapas visuais.
            </li>
            <li>
              <strong>Geração de Copy com IA:</strong> Até 3 gerações de copy por mês (ano-mês civil UTC) com revisão
              humana obrigatória antes da aplicação ao projeto.
            </li>
            <li>
              <strong>Busca Grounded de Mercado:</strong> Até 1 busca por mês retornando até 10 sugestões estruturadas com
              fontes públicas verificáveis.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">3. Política de Uso Aceitável</h2>
          <p>
            O usuário se compromete a utilizar a plataforma em conformidade com as leis brasileiras vigentes. É
            estritamente proibido:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>Publicar páginas com conteúdo enganoso, fraudulento, de phishing ou que violem direitos de terceiros.</li>
            <li>Utilizar métodos automatizados (bots, scrapers abusivos ou ataques de negação de serviço) contra as APIs.</li>
            <li>Contornar deliberadamente os mecanismos de quota, autenticação ou segurança da plataforma.</li>
            <li>Disseminar spam, mensagens não solicitadas ou divulgar contatos sem base legal adequada.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">4. Inteligência Artificial e Verificação de Fontes</h2>
          <p>
            As funcionalidades de IA utilizam modelos avançados integrados pelo servidor. O usuário reconhece que
            sugestões de copy e dados de busca de mercado devem ser revisados e validados pelo responsável antes de
            qualquer publicação ou abordagem comercial. A VertexTarget não assume responsabilidade por dados imprecisos
            gerados por modelos probabilísticos.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">5. Cancelamento e Exclusão de Dados</h2>
          <p>
            Você pode encerrar sua conta a qualquer momento. A exclusão de um workspace exclui permanentemente todos os
            projetos, publicações e prospects associados, mediante reautenticação com senha de segurança.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground">6. Legislação Aplicável e Foro</h2>
          <p className="text-xs">
            Estes termos são regidos pelas leis da República Federativa do Brasil, em particular o Marco Civil da
            Internet e a Lei Geral de Proteção de Dados. Fica eleito o foro da comarca de domicílio da prestadora de
            serviços para dirimir quaisquer controvérsias.
          </p>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} VertexTarget. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
