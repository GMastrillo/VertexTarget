import Link from 'next/link';
import { requireOsContext } from '@/lib/os/auth';
import { listProjects } from '@/lib/os/project-repository';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { UsageSummary } from '@/components/os/usage-summary';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Workspace — Vertex OS',
  description: 'Gerencie seus projetos e publicações na Vertex OS.',
};

export default async function WorkspaceDashboardPage() {
  const ctx = await requireOsContext();
  const [projects, usage] = await Promise.all([
    listProjects(ctx),
    getUsageSummary(ctx),
  ]);

  const hasProject = projects.length > 0;
  const project = projects[0];

  return (
    <div className="space-y-8">
      {/* Top Banner & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
            <span>Plano Gratuito Ativo</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {ctx.workspace.name}
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Crie, edite e publique seu site de alta conversão. Seu plano inclui 1 projeto ativo, publicação simultânea e créditos mensais de IA.
          </p>
        </div>

        <div>
          <UsageSummary usage={usage} />
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Seu Projeto ({projects.length}/1)
          </h2>

          {!hasProject && (
            <Link href="/os/projetos/novo">
              <Button size="sm" className="text-xs">
                + Criar Meu Projeto
              </Button>
            </Link>
          )}
        </div>

        {!hasProject ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted p-12 text-center">
            <h3 className="text-base font-semibold text-foreground mb-2">Você ainda não possui nenhum projeto</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
              Inicie com o briefing do seu negócio para gerar automaticamente uma landing page completa e pronta para edição.
            </p>
            <Link href="/os/projetos/novo">
              <Button>Criar Primeiro Projeto</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 hover:border-border transition-colors">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] text-primary uppercase tracking-wider font-semibold">
                  Versão {project.version}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{project.briefing.businessName}</h3>
                <p className="text-xs text-muted-foreground">{project.briefing.sector} &bull; {project.briefing.city}</p>
                <p className="text-xs text-muted-foreground pt-1">
                  Template: <span className="text-foreground font-mono">{project.document.templateId}</span> &bull;{' '}
                  Atualizado em {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/os/projetos/${project.id}`}>
                  <Button size="sm">
                    Abrir Editor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
