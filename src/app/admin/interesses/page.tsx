import { PageHeader } from '@/components/admin/AdminUI';
import { InterestsTable } from '@/components/admin/interests-table';
import { getAuthenticatedTeamUser } from '@/lib/auth';
import { listTeamInterests } from '@/lib/interests/service';
import type { InterestRecord } from '@/lib/interests/types';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminInteressesPage() {
  const user = await getAuthenticatedTeamUser();
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'owner' && user.role !== 'sales') {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg font-medium text-white mb-2">Acesso Restrito</p>
        <p className="text-sm">Esta seção é reservada exclusivamente para gestores comerciais e proprietários.</p>
      </div>
    );
  }

  let interests: InterestRecord[] = [];
  try {
    interests = await listTeamInterests();
  } catch {
    interests = [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Captação & Leads"
        title="Interesses Públicos"
        description="Manifestações de interesse registradas no site oficial para Soluções, Educação e Comunidade."
      />
      <InterestsTable initialInterests={interests} />
    </div>
  );
}
