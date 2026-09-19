import { PageHeader } from "@/components/admin/AdminUI";
import { PerformanceWorkspace } from "@/components/admin/PerformanceWorkspace";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { getPerformanceSnapshot } from "@/lib/performance-repository";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const user = await getAuthenticatedTeamUser();
  if (!user) return null;
  try { return <div><PageHeader eyebrow="Performance / resultados" title="Metas & performance" description="Acompanhe objetivos com base em receita, negócios, tarefas e atendimento reais — sem pontos artificiais." /><PerformanceWorkspace initial={await getPerformanceSnapshot()} /></div>; }
  catch (error) { return <div><PageHeader eyebrow="Performance / resultados" title="Metas & performance" description="Acompanhe objetivos com base em dados reais do workspace." /><div role="alert" className="rounded-xl border border-amber-300/20 bg-amber-300/[.05] p-5 text-sm text-amber-100">{error instanceof Error ? error.message : "Performance indisponível."}</div></div>; }
}
