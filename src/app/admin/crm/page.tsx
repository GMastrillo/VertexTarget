import { PageHeader } from "@/components/admin/AdminUI";
import { CRMTable } from "@/components/admin/CRMTable";
import { getClients } from "@/lib/admin-repository";
import { getAuthenticatedTeamUser } from "@/lib/auth";

export default async function CRMPage() {
  const [clientRows, user] = await Promise.all([getClients(), getAuthenticatedTeamUser()]);
  const active = clientRows.filter((client) => client.status === "Ativo").length;
  const pipeline = clientRows.filter((client) => client.status === "Em negociação").length;

  return <div>
    <PageHeader eyebrow="Customer relationship management" title="Clientes & contratos" description="Acompanhe o relacionamento, escopo e valor de cada conta da VertexTarget." />
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <div className="admin-mini-stat"><span>Contas ativas</span><strong>{active}</strong><small>Fonte: Supabase</small></div>
      <div className="admin-mini-stat"><span>Pipeline</span><strong>{pipeline}</strong><small>Em negociação</small></div>
      <div className="admin-mini-stat"><span>Total de contas</span><strong>{clientRows.length}</strong><small>Atualizado agora</small></div>
    </div>
    <CRMTable clients={clientRows} canCreate={user?.role === "owner" || user?.role === "sales"} />
  </div>;
}
