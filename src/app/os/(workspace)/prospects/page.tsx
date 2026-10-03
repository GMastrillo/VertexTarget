import { requireOsContext } from '@/lib/os/auth';
import { listProspects } from '@/lib/os/prospect-repository';
import { getUsageSummary } from '@/lib/os/usage-repository';
import { ProspectBoard } from '@/components/os/prospect-board';

export default async function ProspectsPage() {
  const ctx = await requireOsContext();
  const [prospects, usage] = await Promise.all([
    listProspects(ctx),
    getUsageSummary(ctx),
  ]);

  return <ProspectBoard initialProspects={prospects} usage={usage} />;
}
