import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | VertexTarget',
  description: 'Transparência sobre o tratamento de dados pessoais, cookies, autenticação e quotas no Vertex OS.',
};

export default function PrivacidadePage(): React.JSX.Element {
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
            Política de Privacidade
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Última atualização: Outubro de 2026 · Em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">1. Informações que Coletamos</h2>
          <p>
            Coletamos apenas as informações estritamente necessárias para a prestação dos nossos serviços de
            desenvolvimento sob medida e para a operação do sistema Vertex OS:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Dados de Contato e Interesse:</strong> Nome, e-mail corporativo e número de WhatsApp informados
              voluntariamente no formulário de contato para diagnóstico e propostas comerciais.
            </li>
            <li>
              <strong>Dados de Conta e Acesso:</strong> E-mail e credenciais de acesso criptografadas para autenticação e
              gerenciamento do seu workspace no Vertex OS.
            </li>
            <li>
              <strong>Dados de Conteúdo:</strong> Informações de briefing, textos e contatos inseridos em projetos para
              geração e publicação de landing pages.
            </li>
            <li>
              <strong>Registros de Uso e Quotas:</strong> Contadores agregados de operações mensais (gerações de copy e
              buscas) vinculados à sua identidade de acesso para prevenção de abusos.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">2. Provedores e Infraestrutura</h2>
          <p>
            Para garantir segurança, confiabilidade e proteção dos dados, utilizamos infraestrutura de ponta:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>Banco de Dados e Autenticação:</strong> Supabase (com isolamento multi-tenant garantido por Row
              Level Security e RPCs com verificação rigorosa de titularidade).
            </li>
            <li>
              <strong>Inteligência Artificial:</strong> Google Gemini API (executado exclusivamente pelo servidor, sem
              exposição de chaves no cliente e sem armazenamento de dados para treinamento de modelos de terceiros).
            </li>
            <li>
              <strong>Segurança e Anti-abuso:</strong> hCaptcha (validação de desafios para prevenção de automações
              indesejadas e bots maliciosos).
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground">
          <h2 className="text-xl font-bold text-foreground">3. Seus Direitos (LGPD)</h2>
          <p>
            Como titular dos dados, você possui total controle sobre suas informações pessoais:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>Acesso, consulta e alteração dos dados do seu perfil através do painel de Configurações do workspace.</li>
            <li>
              Exclusão definitiva de workspaces, projetos e prospects mediante reautenticação de segurança diretamente no
              painel.
            </li>
            <li>
              Revogação de consentimento e solicitação de informações através do nosso canal de atendimento oficial.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-foreground border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground">4. Contato</h2>
          <p className="text-xs">
            Para dúvidas sobre o tratamento de dados pessoais ou exercer seus direitos de titular, entre em contato
            conosco através da seção de contato em nossa página principal.
          </p>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} VertexTarget. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
