import { notFound } from 'next/navigation';
import { requireOsContext } from '@/lib/os/auth';
import { getProject } from '@/lib/os/project-repository';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { getWorkspacePublication } from '@/lib/os/publication-repository';
import { ProjectEditor } from '@/components/os/project-editor';

interface ProjetoPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { id } = await params;
  const ctx = await requireOsContext();
  const [project, usage, publication] = await Promise.all([
    getProject(ctx, id),
    getUsageSummary(ctx),
    getWorkspacePublication(ctx),
  ]);

  if (!project) {
    notFound();
  }

  return <ProjectEditor project={project} usage={usage} publication={publication} />;
}
