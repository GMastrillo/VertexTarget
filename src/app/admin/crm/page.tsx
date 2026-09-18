import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminUI";
import { CRMTable } from "@/components/admin/CRMTable";
import { clients } from "@/lib/admin-data";

export default function CRMPage() { return <div><PageHeader eyebrow="Customer relationship management" title="Clientes & contratos" description="Acompanhe o relacionamento, escopo e valor de cada conta da VertexTarget." action={<button className="admin-primary-btn"><UserPlus size={16}/> Novo cliente</button>}/><div className="mb-6 grid gap-4 sm:grid-cols-3"><div className="admin-mini-stat"><span>Contas ativas</span><strong>12</strong><small>+2 este mês</small></div><div className="admin-mini-stat"><span>Pipeline</span><strong>R$ 28.400</strong><small>3 oportunidades</small></div><div className="admin-mini-stat"><span>Churn rate</span><strong>2,4%</strong><small className="text-emerald-300">-0,8% vs. anterior</small></div></div><CRMTable clients={clients}/></div>; }
