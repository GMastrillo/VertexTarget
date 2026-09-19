import { PageHeader } from "@/components/admin/AdminUI";
import { CommercialWorkspace } from "@/components/admin/CommercialWorkspace";
import { getCommercialSnapshot } from "@/lib/commercial-repository";

export const dynamic = "force-dynamic";

export default async function ComercialPage() {
  const data = await getCommercialSnapshot();
  return <div><PageHeader eyebrow="CRM / núcleo comercial" title="Pipeline comercial" description="Gerencie empresas, contatos, negócios, tarefas e a atividade do workspace atual." /><CommercialWorkspace initial={data} /></div>;
}
