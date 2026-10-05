import { redirect } from 'next/navigation';
import { getConfirmedIdentity } from '@/lib/os/auth';
import { getWorkspace } from '@/lib/os/workspace-repository';
import { listProspects } from '@/lib/os/prospect-repository';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { ProspectBoard } from '@/components/os/prospect-board';
import type { OsContext } from '@/lib/os/types';

export default async function ProspectsPage() {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    redirect('/os/entrar');
  }

  const workspace = await getWorkspace();
  if (!workspace || workspace.status !== 'active') {
    return null;
  }

  const ctx: OsContext = { ...identity, workspace };
  const [prospects, usage] = await Promise.all([
    listProspects(ctx),
    getUsageSummary(ctx),
  ]);

  return <ProspectBoard initialProspects={prospects} usage={usage} />;
}
