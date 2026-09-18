import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { KpiCard, PageHeader, SectionTitle, StatusBadge } from "@/components/admin/AdminUI";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { getClients, getProjects } from "@/lib/admin-repository";
import { listAiRunsOverview } from "@/lib/operations-repository";
import { getFinanceData } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [user, clients, projects, runs, finance] = await Promise.all([
    getAuthenticatedTeamUser(),
    getClients(),
    getProjects(),
    listAiRunsOverview(),
    getFinanceData(),
  ]);

  const manualTotalCents = finance.manualTotalCents;
  const monthLabel = finance.manualThisMonthCents > 0 ? "Stripe + manual este mês" : "Atual";

  return <div>
    <PageHeader
      eyebrow="Workspace / overview"
      title={`Bom dia, ${user?.name ?? "equipe"}.`}
      description="Pulso real da operação: receita consolidada, pipeline e execuções de IA — sem dados de demonstração."
      action={<Link href="/admin/prospecting" className="admin-secondary-btn">Prospectar clientes <ArrowUpRight size={16} /></Link>}
    />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Receita do mês (Stripe + manual)" value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((finance.grossThisMonth + manualTotalCents) / 100)} change={monthLabel} icon="revenue" />
      <KpiCard label="Clientes no CRM" value={String(clients.length)} change={`${clients.filter((c) => c.status === "Ativo").length} ativos`} icon="users" accent="violet" />
      <KpiCard label="Projetos em andamento" value={String(projects.filter((p) => p.stage !== "Entregue").length)} change={`${projects.length} no total`} icon="projects" accent="orange" />
      <KpiCard label="Execuções IA (24h)" value={String(runs.total24h)} change={`${runs.success24h} sucesso(s)`} icon="bot" accent="green" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
      <div className="admin-card">
        <SectionTitle title="Projetos recentes" meta={<Link href="/admin/projetos" className="text-cyan-300 hover:underline">Ver todos →</Link>} />
        <div className="divide-y divide-white/[.06]">
          {projects.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
              <div className="min-w-0"><p className="truncate text-sm font-medium">{p.title}</p><p className="mt-1 text-xs text-slate-500">{p.client} · {p.type}</p></div>
              <StatusBadge status={p.stage} />
            </div>
          ))}
          {!projects.length && <p className="py-6 text-sm text-slate-500">Nenhum projeto ainda. <Link className="text-cyan-300" href="/admin/projetos">Criar o primeiro →</Link></p>}
        </div>
      </div>
      <div className="admin-card">
        <SectionTitle title="Atividade do AI Lab" meta={<Link href="/admin/ai-logs" className="text-cyan-300 hover:underline">Ver logs →</Link>} />
        <div className="space-y-4">
          {runs.recent.map((log) => (
            <div key={log.key} className="flex gap-3">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${log.status === "Sucesso" ? "bg-cyan-300 shadow-[0_0_10px_#00f0ff]" : "bg-rose-400"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2"><p className="truncate text-sm">{log.automation}</p><span className="text-[10px] text-slate-600">{log.time}</span></div>
                <p className="mt-1 text-xs text-slate-500">{log.model} · <span className={log.status === "Sucesso" ? "text-emerald-300" : "text-rose-300"}>{log.status}</span></p>
              </div>
            </div>
          ))}
          {!runs.recent.length && <p className="py-6 text-sm text-slate-500">Nenhuma execução de IA ainda. Use a <Link className="text-cyan-300" href="/admin/prospecting">Prospecção IA</Link>.</p>}
        </div>
      </div>
    </div>
    <div className="admin-card mt-6">
      <SectionTitle title="Carteira de clientes" meta={<Link href="/admin/crm" className="text-cyan-300 hover:underline">{clients.length} no CRM →</Link>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {clients.slice(0, 5).map((c) => (
          <Link href="/admin/crm" key={c.id} className="rounded-xl border border-white/[.06] bg-white/[.02] p-4 transition hover:border-cyan-300/30">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-xs font-semibold text-cyan-200">{c.initials}</span>
            <p className="mt-3 truncate text-sm font-medium">{c.name}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{c.service}</p>
          </Link>
        ))}
        {!clients.length && <p className="py-4 text-sm text-slate-500">Nenhum cliente cadastrado ainda.</p>}
      </div>
    </div>
  </div>;
}
