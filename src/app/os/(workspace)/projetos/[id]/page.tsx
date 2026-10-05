import { notFound, redirect } from 'next/navigation';
import { getConfirmedIdentity } from '@/lib/os/auth';
import { getWorkspace } from '@/lib/os/workspace-repository';
import { getProject } from '@/lib/os/project-repository';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { getWorkspacePublication } from '@/lib/os/publication-repository';
import { ProjectEditor } from '@/components/os/project-editor';
import type { OsContext } from '@/lib/os/types';

interface ProjetoPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { id } = await params;
  const identity = await getConfirmedIdentity();
  if (!identity) {
    redirect('/os/entrar');
  }

  const workspace = await getWorkspace();
  if (!workspace || workspace.status !== 'active') {
    return null;
  }

  const ctx: OsContext = { ...identity, workspace };
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
