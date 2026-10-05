import Link from 'next/link';
import { requireOsContext } from '@/lib/os/auth';
import { listProjects } from '@/lib/os/project-repository';
import { ProjectBriefingForm } from '@/components/os/project-briefing';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Novo Projeto — Vertex OS',
  description: 'Inicie a criação de um novo site preenchendo o briefing.',
};

interface NovoProjetoPageProps {
  searchParams: Promise<{
    prospectId?: string;
    name?: string;
    sector?: string;
    city?: string;
  }>;
}

export default async function NovoProjetoPage({ searchParams }: NovoProjetoPageProps) {
  const ctx = await requireOsContext();
  const [projects, params] = await Promise.all([
    listProjects(ctx),
    searchParams,
  ]);

  if (projects.length >= 1) {
    return (
      <div className="max-w-md mx-auto my-12 rounded-2xl border border-border bg-card p-8 text-center space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Limite do Plano Atingido</h2>
        <p className="text-xs text-muted-foreground">
          O plano gratuito permite 1 projeto ativo por workspace. Para iniciar um novo negócio, edite o projeto existente ou remova-o.
        </p>
        <Link href={`/os/projetos/${projects[0].id}`}>
          <Button>Abrir Projeto Existente</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/os" className="hover:text-foreground">Workspace</Link>
          <span>&rsaquo;</span>
          <span className="text-foreground">Novo Projeto</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Briefing do Projeto</h1>
        <p className="text-xs text-muted-foreground">
          Informe os dados essenciais da sua empresa. Nosso motor estruturará os blocos e serviços ideais para o seu modelo de atuação.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        <ProjectBriefingForm
          prospectId={params.prospectId}
          initialBusinessName={params.name}
          initialSector={params.sector}
          initialCity={params.city}
        />
      </div>
    </div>
  );
}
