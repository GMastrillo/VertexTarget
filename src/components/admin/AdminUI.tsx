"use client";
import { ArrowDownRight, ArrowUpRight, Bot, CheckCircle2, CircleAlert, CircleDollarSign, Clock3, CreditCard, FolderKanban, ShieldAlert, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="admin-eyebrow">{eyebrow}</p><h1 className="admin-title">{title}</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p></div>{action}</div>; }
const kpiIcons = { revenue: CircleDollarSign, users: Users, projects: FolderKanban, bot: Bot, card: CreditCard, alert: ShieldAlert };
export function KpiCard({ label, value, change, icon, accent = "cyan" }: { label: string; value: string; change: string; icon: keyof typeof kpiIcons; accent?: "cyan" | "violet" | "orange" | "green" }) { const Icon = kpiIcons[icon]; return <div className="admin-card relative overflow-hidden"><div className="admin-kpi-glow bg-primary/10"/><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-3 font-heading text-2xl font-semibold tracking-tight">{value}</p><p className={`mt-2 flex items-center gap-1 text-[11px] ${change.startsWith("-") ? "text-destructive" : "text-success"}`}>{change.startsWith("-") ? <ArrowDownRight size={13}/> : <ArrowUpRight size={13}/>} {change} <span className="text-muted-foreground">vs. mês anterior</span></p></div><span className={`grid h-9 w-9 place-items-center rounded-xl ${accent === "cyan" ? "bg-primary/10 text-primary" : accent === "violet" ? "bg-accent/10 text-accent" : accent === "orange" ? "bg-warm/10 text-warm" : "bg-success/10 text-success"}`}><Icon size={18}/></span></div></div>; }
export function StatusBadge({ status }: { status: string }) { const success = ["Ativo", "Pago", "Sucesso", "Entregue"].includes(status); const warn = ["Em negociação", "QA", "Design"].includes(status); return <span className={`admin-badge ${success ? "admin-badge-success" : warn ? "admin-badge-warn" : "admin-badge-muted"}`}>{success ? <CheckCircle2 size={12}/> : warn ? <Clock3 size={12}/> : <CircleAlert size={12}/>} {status}</span>; }
export function RevenueChart({
  data,
  currency = "brl",
}: {
  data: { month: string; value: number }[];
  currency?: string;
}) {
  const curr = currency.toUpperCase();
  const formatY = (v: number) => `${curr} ${(v / 100000).toFixed(0)}k`;
  return (
    <div className="h-[285px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={formatY} />
          <Tooltip
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--popover-foreground)", fontSize: 12 }}
            formatter={(val) => [`${curr} ${(Number(val ?? 0) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "Faturamento"]}
          />
          <Area type="monotone" dataKey="value" stroke="url(#revenueGradient)" strokeWidth={2.5} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function SectionTitle({ title, meta }: { title: string; meta?: React.ReactNode }) { return <div className="mb-5 flex items-center justify-between"><h2 className="font-heading text-lg font-medium">{title}</h2>{meta && <span className="text-xs text-muted-foreground">{meta}</span>}</div>; }
