import { PageHeader } from "@/components/admin/AdminUI";
import { InboxWorkspace } from "@/components/admin/InboxWorkspace";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { getInboxSnapshot } from "@/lib/inbox-repository";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const [user, data] = await Promise.all([getAuthenticatedTeamUser(), getInboxSnapshot()]);
  if (!user) return null;
  return <div><PageHeader eyebrow="Atendimento / operação" title="Inbox & suporte" description="Centralize conversas, notas internas e tickets do workspace atual com controle de SLA." /><InboxWorkspace initial={data} currentUserId={user.id} /></div>;
}
