import { redirect } from 'next/navigation';
import { getConfirmedIdentity } from '@/lib/os/auth';
import { getWorkspace } from '@/lib/os/workspace-repository';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { listProspects } from '@/lib/os/prospect-repository';
import { WorkspaceSettings } from '@/components/os/workspace-settings';
import type { OsContext } from '@/lib/os/types';

export default async function ConfiguracoesPage() {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    redirect('/os/entrar');
  }

  const workspace = await getWorkspace();
  if (!workspace || workspace.status !== 'active') {
    return null;
  }

  const ctx: OsContext = { ...identity, workspace };
  const [usage, prospects] = await Promise.all([
    getUsageSummary(ctx),
    listProspects(ctx),
  ]);

  return (
    <WorkspaceSettings
      workspace={ctx.workspace}
      usage={usage}
      prospectsCount={prospects.length}
    />
  );
}
