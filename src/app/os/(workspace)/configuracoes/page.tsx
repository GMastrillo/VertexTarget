import { requireOsContext } from '@/lib/os/auth';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { listProspects } from '@/lib/os/prospect-repository';
import { WorkspaceSettings } from '@/components/os/workspace-settings';

export default async function ConfiguracoesPage() {
  const ctx = await requireOsContext();
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
