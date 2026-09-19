"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Activity, Bell, Bot, BriefcaseBusiness, ChevronLeft, ChevronRight, MessageSquare,
  CircleDollarSign, LayoutDashboard, LogOut, Menu, Radar, Settings, Users, X,
} from "lucide-react";
import type { TeamUser } from "@/lib/auth";
import { WorkspaceSwitcher } from "@/components/admin/WorkspaceSwitcher";

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/financeiro", label: "Financeiro", icon: CircleDollarSign },
  { href: "/admin/crm", label: "CRM & Clientes", icon: Users },
  { href: "/admin/comercial", label: "Pipeline comercial", icon: BriefcaseBusiness },
  { href: "/admin/inbox", label: "Inbox & suporte", icon: MessageSquare },
  { href: "/admin/prospecting", label: "Prospecção IA", icon: Radar },
  { href: "/admin/projetos", label: "Projetos", icon: BriefcaseBusiness },
  { href: "/admin/ai-logs", label: "AI Lab", icon: Bot },
];

type ActivityItem = { time: string; automation: string; status: string };

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || items) return;
    fetch("/api/admin/activity")
      .then((r) => (r.ok ? r.json() : { runs: [] }))
      .then((j) => setItems(j.runs ?? []))
      .catch(() => setItems([]));
  }, [open, items]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button aria-label="Notificações" onClick={() => setOpen((v) => !v)} className="admin-icon-btn relative">
        <Bell size={18} />
        {items && items.length > 0 && <i className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-white/[.08] bg-[#0a0a1a] p-2 shadow-2xl">
          <p className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-slate-500">Atividade de IA recente</p>
          {items === null && <p className="px-2 py-3 text-xs text-slate-500">Carregando...</p>}
          {items?.length === 0 && <p className="px-2 py-3 text-xs text-slate-500">Nenhuma execução de IA ainda.</p>}
          {items?.slice(0, 6).map((item, i) => (
            <Link key={i} href="/admin/ai-logs" onClick={() => setOpen(false)} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-white/[.04]">
              <span className="min-w-0 truncate text-xs text-slate-300">{item.automation}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className={`text-[10px] ${item.status === "Sucesso" ? "text-emerald-300" : "text-rose-300"}`}>{item.status}</span>
                <span className="text-[10px] text-slate-600">{item.time}</span>
              </span>
            </Link>
          ))}
          {items && items.length > 0 && <Link href="/admin/ai-logs" onClick={() => setOpen(false)} className="mt-1 block rounded-lg px-2 py-2 text-[11px] text-cyan-300 hover:bg-white/[.04]">Ver todos os logs →</Link>}
        </div>
      )}
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function AdminShell({ children, user }: { children: React.ReactNode; user: TeamUser }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="admin-shell min-h-screen bg-[#050510] text-[#e8e8f0]">
      <aside className={`admin-sidebar ${collapsed ? "admin-sidebar-collapsed" : ""} ${mobileOpen ? "admin-sidebar-mobile" : ""}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/[.07] px-5">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-sm font-black text-[#050510]">VT</span>
            <span className="min-w-0"><span className="block whitespace-nowrap font-[var(--font-heading)] text-lg font-semibold tracking-tight">Vertex<span className="text-cyan-300">Target</span></span>{user.organizationId && user.organizations.length > 0 && <WorkspaceSwitcher current={user.organizations.find((organization) => organization.id === user.organizationId) ?? user.organizations[0]} organizations={user.organizations} />}</span>
          </Link>
          <button aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="admin-icon-btn lg:hidden"><X size={18} /></button>
        </div>
        <div className="px-3 pt-8">
          <p className="admin-nav-label">Workspace</p>
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`admin-nav-link ${active ? "admin-nav-active" : ""}`}><Icon size={19} /><span>{label}</span></Link>;
          })}
        </div>
        <div className="mt-auto p-3">
          <p className="admin-nav-label">Sistema</p>
          <Link href="/admin/configuracoes" className={`admin-nav-link w-full ${pathname.startsWith("/admin/configuracoes") ? "admin-nav-active" : ""}`}><Settings size={19} /><span>Configurações</span></Link>
          <button onClick={logout} className="admin-nav-link w-full text-rose-300 hover:text-rose-200"><LogOut size={19} /><span>Sair da conta</span></button>
        </div>
        <button aria-label="Recolher sidebar" onClick={() => setCollapsed(!collapsed)} className="admin-collapse hidden lg:grid">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
      </aside>
      {mobileOpen && <button aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="admin-overlay lg:hidden" />}
      <main className={`admin-main ${collapsed ? "admin-main-expanded" : ""}`}>
        <header className="admin-header">
          <button aria-label="Abrir menu" onClick={() => setMobileOpen(true)} className="admin-icon-btn lg:hidden"><Menu size={21} /></button>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><Activity size={14} className="text-emerald-400" /> Todos os sistemas operacionais</div>
          <div className="ml-auto flex items-center gap-3">
            <NotificationsBell />
            <div className="hidden h-7 w-px bg-white/[.08] sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400/80 to-violet-500/80 text-xs font-bold text-white">{initials(user.name)}</span>
              <div className="hidden leading-tight sm:block"><p className="text-sm font-medium">{user.name}</p><p className="text-[10px] uppercase tracking-widest text-slate-500">{user.role} · {user.organizationName ?? "Workspace"}</p></div>
            </div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
