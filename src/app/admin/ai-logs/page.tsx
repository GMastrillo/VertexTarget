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
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Bot size={18} /></span></div><p className="mt-4 text-xs text-muted-foreground">Execuções registradas</p><p className="mt-1 text-2xl font-semibold">{aiLogs.length}</p></div>
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent"><Zap size={18} /></span><span className="text-[10px] text-success">{successRate}%</span></div><p className="mt-4 text-xs text-muted-foreground">Taxa de sucesso</p><p className="mt-1 text-2xl font-semibold">{successCount}</p></div>
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-warm/10 text-warm"><Clock3 size={18} /></span></div><p className="mt-4 text-xs text-muted-foreground">Tokens consumidos</p><p className="mt-1 text-2xl font-semibold">{totalTokens.toLocaleString("pt-BR")}</p></div>
      <div className="admin-card"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success"><Cpu size={18} /></span><span className="text-[10px] text-muted-foreground">gemini-3.6-flash</span></div><p className="mt-4 text-xs text-muted-foreground">Modelo em uso</p><p className="mt-1 text-2xl font-semibold">{isSupabaseConfigured() ? "Google IA" : "—"}</p></div>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.7fr]">
      <div className="admin-card">
        <SectionTitle title="Ferramentas com IA" meta="Ação direta" />
        <div className="space-y-2">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-muted">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><tool.icon size={15} /></span>
              <div className="flex-1"><p className="text-xs font-medium">{tool.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{tool.desc}</p></div>
              <CheckCircle2 size={14} className="text-primary" />
            </Link>
          ))}
        </div>
        <p className="mt-4 rounded-lg border border-border bg-muted p-3 text-[11px] leading-5 text-muted-foreground">Cada busca de prospecção, análise ou geração executada nas ferramentas internas grava automaticamente um log nesta página.</p>
      </div>
      <div className="admin-card">
        <SectionTitle title="Logs recentes · Gemini API" meta="Supabase / ai_runs" />
        <div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Horário</th><th>Automação</th><th>Modelo</th><th>Tokens</th><th>Latência</th><th>Status</th></tr></thead><tbody>{aiLogs.map((log, i) => <tr key={`${log.time}-${log.automation}-${i}`}><td className="font-mono text-xs text-muted-foreground">{log.time}</td><td><p className="text-sm text-foreground">{log.automation}</p><p className="text-[10px] text-muted-foreground">{log.client}</p></td><td className="font-mono text-[10px] text-muted-foreground">{log.model}</td><td>{log.tokens}</td><td>{log.latency}</td><td><StatusBadge status={log.status} /></td></tr>)}</tbody></table></div>
        {!aiLogs.length && <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma execução ainda. Rode uma busca na <Link className="text-primary" href="/admin/prospecting">Prospecção IA</Link> para gerar o primeiro log real.</p>}
      </div>
    </div>
  </div>;
}
