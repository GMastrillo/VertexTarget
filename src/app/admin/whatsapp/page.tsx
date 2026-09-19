import { PageHeader } from "@/components/admin/AdminUI";
import { WhatsAppWorkspace } from "@/components/admin/WhatsAppWorkspace";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { getWhatsAppSnapshot } from "@/lib/whatsapp-repository";

export const dynamic = "force-dynamic";

export default async function WhatsAppPage() {
  const [user, data] = await Promise.all([getAuthenticatedTeamUser(), getWhatsAppSnapshot()]);
  if (!user) return null;
  return <div><PageHeader eyebrow="Canais / mensageria" title="WhatsApp" description="Gerencie linhas oficiais Meta e adapters não oficiais por workspace, com health check e envio controlado." /><WhatsAppWorkspace initial={data} /></div>;
}
