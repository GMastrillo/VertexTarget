"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Activity, Bell, Bot, BriefcaseBusiness, ChevronLeft, ChevronRight, CircleDollarSign, LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/financeiro", label: "Financeiro", icon: CircleDollarSign },
  { href: "/admin/crm", label: "CRM & Clientes", icon: Users },
  { href: "/admin/projetos", label: "Projetos", icon: BriefcaseBusiness },
  { href: "/admin/ai-logs", label: "AI Lab", icon: Bot },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  async function logout() { await fetch("/api/auth/login", { method: "DELETE" }); router.push("/login"); }
  return <div className="admin-shell min-h-screen bg-[#050510] text-[#e8e8f0]">
    <aside className={`admin-sidebar ${collapsed ? "admin-sidebar-collapsed" : ""} ${mobileOpen ? "admin-sidebar-mobile" : ""}`}>
      <div className="flex h-20 items-center justify-between border-b border-white/[.07] px-5">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-sm font-black text-[#050510]">VT</span><span className="whitespace-nowrap font-[var(--font-heading)] text-lg font-semibold tracking-tight">Vertex<span className="text-cyan-300">Target</span></span></Link>
        <button aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="admin-icon-btn lg:hidden"><X size={18}/></button>
      </div>
      <div className="px-3 pt-8"><p className="admin-nav-label">Workspace</p>{links.map(({ href, label, icon: Icon }) => { const active = href === "/admin" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`admin-nav-link ${active ? "admin-nav-active" : ""}`}><Icon size={19}/><span>{label}</span></Link>; })}</div>
      <div className="mt-auto p-3"><p className="admin-nav-label">Sistema</p><button className="admin-nav-link w-full"><Settings size={19}/><span>Configurações</span></button><button onClick={logout} className="admin-nav-link w-full text-rose-300 hover:text-rose-200"><LogOut size={19}/><span>Sair da conta</span></button></div>
      <button aria-label="Recolher sidebar" onClick={() => setCollapsed(!collapsed)} className="admin-collapse hidden lg:grid">{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button>
    </aside>
    {mobileOpen && <button aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="admin-overlay lg:hidden"/>}
    <main className={`admin-main ${collapsed ? "admin-main-expanded" : ""}`}><header className="admin-header"><button aria-label="Abrir menu" onClick={() => setMobileOpen(true)} className="admin-icon-btn lg:hidden"><Menu size={21}/></button><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><Activity size={14} className="text-emerald-400"/> Todos os sistemas operacionais</div><div className="ml-auto flex items-center gap-3"><button aria-label="Notificações" className="admin-icon-btn relative"><Bell size={18}/><i className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300"/></button><div className="hidden h-7 w-px bg-white/[.08] sm:block"/><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400/80 to-violet-500/80 text-xs font-bold text-white">GM</span><div className="hidden leading-tight sm:block"><p className="text-sm font-medium">Gabriel Mastrillo</p><p className="text-[10px] uppercase tracking-widest text-slate-500">Admin</p></div></div></div></header><div className="admin-content">{children}</div></main>
  </div>;
}
