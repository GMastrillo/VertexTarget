import Link from "next/link";
import { Bot, CheckCircle2, Clock3, Cpu, Radar, Zap } from "lucide-react";
import { PageHeader, SectionTitle, StatusBadge } from "@/components/admin/AdminUI";
import { getAiLogs } from "@/lib/admin-repository";
import { isSupabaseConfigured } from "@/lib/supabase-config";

export const dynamic = "force-dynamic";

export default async function AILogsPage() {
  const aiLogs = await getAiLogs();
  const successCount = aiLogs.filter((log) => log.status === "Sucesso").length;
  const successRate = aiLogs.length ? Math.round((successCount / aiLogs.length) * 100) : 0;
  const totalTokens = aiLogs.reduce((sum, log) => sum + (Number(log.tokens.replace(/\D/g, "")) || 0), 0);

  const tools = [
    { name: "Prospecção de empresas", desc: "Gemini + Google Search: encontra empresas sem site", href: "/admin/prospecting", icon: Radar },
  ];

  return <div>
    <PageHeader eyebrow="VertexTarget / intelligence layer" title="AI Lab & automações" description="Toda chamada de IA das ferramentas internas é registrada aqui: modelo, tokens, latência e resultado." action={<span className="admin-live-pill"><i /> {aiLogs.length} execuções registradas</span>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Bot size={18} /></span></div><p className="mt-4 text-xs text-slate-400">Execuções registradas</p><p className="mt-1 text-2xl font-semibold">{aiLogs.length}</p></div>
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><Zap size={18} /></span><span className="text-[10px] text-emerald-300">{successRate}%</span></div><p className="mt-4 text-xs text-slate-400">Taxa de sucesso</p><p className="mt-1 text-2xl font-semibold">{successCount}</p></div>
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-400/10 text-orange-300"><Clock3 size={18} /></span></div><p className="mt-4 text-xs text-slate-400">Tokens consumidos</p><p className="mt-1 text-2xl font-semibold">{totalTokens.toLocaleString("pt-BR")}</p></div>
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><Cpu size={18} /></span><span className="text-[10px] text-slate-500">gemini-3.6-flash</span></div><p className="mt-4 text-xs text-slate-400">Modelo em uso</p><p className="mt-1 text-2xl font-semibold">{isSupabaseConfigured() ? "Google IA" : "—"}</p></div>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.7fr]">
      <div className="admin-card">
        <SectionTitle title="Ferramentas com IA" meta="Ação direta" />
        <div className="space-y-2">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-white/[.03]">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><tool.icon size={15} /></span>
              <div className="flex-1"><p className="text-xs font-medium">{tool.name}</p><p className="mt-1 text-[10px] text-slate-600">{tool.desc}</p></div>
              <CheckCircle2 size={14} className="text-cyan-300" />
            </Link>
          ))}
        </div>
        <p className="mt-4 rounded-lg border border-white/[.06] bg-white/[.02] p-3 text-[11px] leading-5 text-slate-500">Cada busca de prospecção, análise ou geração executada nas ferramentas internas grava automaticamente um log nesta página.</p>
      </div>
      <div className="admin-card">
        <SectionTitle title="Logs recentes · Gemini API" meta="Supabase / ai_runs" />
        <div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Horário</th><th>Automação</th><th>Modelo</th><th>Tokens</th><th>Latência</th><th>Status</th></tr></thead><tbody>{aiLogs.map((log, i) => <tr key={`${log.time}-${log.automation}-${i}`}><td className="font-mono text-xs text-slate-500">{log.time}</td><td><p className="text-sm text-slate-200">{log.automation}</p><p className="text-[10px] text-slate-600">{log.client}</p></td><td className="font-mono text-[10px] text-slate-500">{log.model}</td><td>{log.tokens}</td><td>{log.latency}</td><td><StatusBadge status={log.status} /></td></tr>)}</tbody></table></div>
        {!aiLogs.length && <p className="py-8 text-center text-sm text-slate-500">Nenhuma execução ainda. Rode uma busca na <Link className="text-cyan-300" href="/admin/prospecting">Prospecção IA</Link> para gerar o primeiro log real.</p>}
      </div>
    </div>
  </div>;
}
