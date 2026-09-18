"use client";

import { FormEvent, useMemo, useState } from "react";
import { Mail, Plus, Search, X } from "lucide-react";
import type { Client } from "@/lib/admin-data";
import { StatusBadge } from "./AdminUI";

export function CRMTable({ clients: initialClients, canCreate }: { clients: Client[]; canCreate: boolean }) {
  const [clients, setClients] = useState(initialClients);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const filtered = useMemo(() => clients.filter((client) => `${client.name} ${client.service} ${client.status}`.toLowerCase().includes(query.toLowerCase())), [clients, query]);

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      service: String(form.get("service") ?? ""),
      email: String(form.get("email") ?? ""),
      description: String(form.get("description") ?? ""),
      valueCents: Math.round(Number(form.get("value") ?? 0) * 100),
      billingType: form.get("billingType"),
    };

    try {
      const response = await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => null) as { client?: Client; error?: string } | null;
      if (!response.ok || !result?.client) throw new Error(result?.error ?? "Não foi possível criar o cliente.");
      setClients((current) => [result.client!, ...current]);
      setCreating(false);
      event.currentTarget.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível criar o cliente.");
    } finally {
      setSaving(false);
    }
  }

  return <>
    <div className="admin-card">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="font-[var(--font-heading)] text-lg font-medium">Todos os clientes</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} de {clients.length} registros</p></div>
        <div className="flex gap-2">
          {canCreate && <button type="button" onClick={() => { setError(""); setCreating(true); }} className="admin-primary-btn h-10"><Plus size={15} /> Novo cliente</button>}
          <label className="relative block w-full sm:w-64"><span className="sr-only">Filtrar clientes</span><Search size={16} className="absolute left-3 top-3 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar clientes..." className="admin-input h-10 pl-10 text-xs" /></label>
        </div>
      </div>
      <div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Cliente</th><th>Serviço contratado</th><th>Status</th><th className="text-right">Valor mensal/projeto</th></tr></thead><tbody>{filtered.map((client) => <tr key={client.id} onClick={() => setSelected(client)} className="cursor-pointer"><td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-[10px] font-bold text-cyan-200">{client.initials}</span><div><p className="font-medium text-slate-200">{client.name}</p><p className="text-[11px] text-slate-500">Cliente desde {client.since}</p></div></div></td><td>{client.service}</td><td><StatusBadge status={client.status} /></td><td className="text-right font-medium text-slate-200">{client.value}</td></tr>)}</tbody></table></div>
      {!filtered.length && <p className="py-8 text-center text-sm text-slate-500">Nenhum cliente encontrado.</p>}
    </div>

    {creating && <><button aria-label="Fechar formulário" onClick={() => setCreating(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" /><aside className="admin-sheet"><div className="flex items-center justify-between border-b border-white/[.08] p-6"><div><p className="admin-eyebrow">CRM</p><h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold">Novo cliente</h2></div><button aria-label="Fechar" onClick={() => setCreating(false)} className="admin-icon-btn"><X size={18} /></button></div><form onSubmit={createClient} className="space-y-4 p-6"><label className="block text-xs text-slate-300">Nome<input name="name" required minLength={2} maxLength={120} className="admin-input mt-2" /></label><label className="block text-xs text-slate-300">Serviço<input name="service" required minLength={2} maxLength={160} className="admin-input mt-2" /></label><label className="block text-xs text-slate-300">E-mail<input name="email" required type="email" maxLength={320} className="admin-input mt-2" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs text-slate-300">Valor<input name="value" required type="number" min="0" step="0.01" className="admin-input mt-2" /></label><label className="block text-xs text-slate-300">Cobrança<select name="billingType" defaultValue="monthly" className="admin-input mt-2"><option value="monthly">Mensal</option><option value="project">Projeto</option></select></label></div><label className="block text-xs text-slate-300">Descrição<textarea name="description" maxLength={2000} className="admin-input mt-2 min-h-24" /></label>{error && <p role="alert" className="text-xs text-rose-300">{error}</p>}<button disabled={saving} className="admin-primary-btn w-full">{saving ? "Salvando..." : "Criar cliente"}</button></form></aside></>}

    {selected && <><button aria-label="Fechar detalhes" onClick={() => setSelected(null)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" /><aside className="admin-sheet"><div className="flex items-center justify-between border-b border-white/[.08] p-6"><div><p className="admin-eyebrow">Detalhes do contrato</p><h2 className="mt-2 font-[var(--font-heading)] text-2xl font-semibold">{selected.name}</h2></div><button aria-label="Fechar" onClick={() => setSelected(null)} className="admin-icon-btn"><X size={18} /></button></div><div className="space-y-7 p-6"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 font-semibold text-cyan-200">{selected.initials}</span><div><p className="text-sm font-medium">{selected.service}</p><StatusBadge status={selected.status} /></div></div><p className="text-sm leading-7 text-slate-400">{selected.description}</p><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-[10px] uppercase tracking-wider text-slate-500">Valor</p><p className="mt-2 text-sm font-medium">{selected.value}</p></div><div className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-[10px] uppercase tracking-wider text-slate-500">Desde</p><p className="mt-2 text-sm font-medium">{selected.since}</p></div></div><a href={`mailto:${selected.email}`} className="admin-primary-btn w-full"><Mail size={16} /> Enviar e-mail</a></div></aside></>}
  </>;
}
