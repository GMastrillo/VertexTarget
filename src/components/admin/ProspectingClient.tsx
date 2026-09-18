"use client";

import { useState } from "react";
import { Globe, Loader2, MapPin, Search, Sparkles, Trash2 } from "lucide-react";
import type { Prospect } from "@/lib/operations-repository";

const STATUS_LABEL: Record<Prospect["status"], string> = { new: "Novo", contacted: "Contatado", client: "Cliente", discarded: "Descartado" };
const STATUS_TONE: Record<Prospect["status"], string> = {
  new: "text-cyan-300 border-cyan-300/30 bg-cyan-300/10",
  contacted: "text-violet-300 border-violet-300/30 bg-violet-300/10",
  client: "text-emerald-300 border-emerald-300/30 bg-emerald-300/10",
  discarded: "text-slate-500 border-white/10 bg-white/[.04]",
};

export function ProspectingClient({ initialProspects }: { initialProspects: Prospect[] }) {
  const [prospects, setProspects] = useState(initialProspects);
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [maxResults, setMaxResults] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [justFound, setJustFound] = useState<Set<string>>(new Set());

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearchQueries([]);
    try {
      const res = await fetch("/api/admin/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector, city, region, country, maxResults }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) { setError(json?.error ?? "Falha na busca."); return; }
      const found: Prospect[] = json.prospects ?? [];
      setProspects((prev) => [...found, ...prev]);
      setJustFound(new Set(found.map((p) => p.id)));
      setSearchQueries(json.searchQueries ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: Prospect["status"]) {
    const previous = prospects;
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    const res = await fetch("/api/admin/prospects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) setProspects(previous);
  }

  async function remove(id: string) {
    const previous = prospects;
    setProspects((prev) => prev.filter((p) => p.id !== id));
    const res = await fetch("/api/admin/prospects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) setProspects(previous);
  }

  return (
    <div>
      <form onSubmit={search} className="grid gap-3 rounded-2xl border border-white/[.08] bg-white/[.02] p-5 sm:grid-cols-2 lg:grid-cols-6">
        <label className="text-xs text-slate-400 lg:col-span-2">Setor / nicho
          <input required value={sector} onChange={(e) => setSector(e.target.value)} placeholder="Ex: Clínicas odontológicas" className="admin-input mt-1" />
        </label>
        <label className="text-xs text-slate-400">Cidade
          <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Cascavel" className="admin-input mt-1" />
        </label>
        <label className="text-xs text-slate-400">Estado
          <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="PR" className="admin-input mt-1" />
        </label>
        <label className="text-xs text-slate-400">País
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="admin-input mt-1" />
        </label>
        <label className="text-xs text-slate-400">Qtd.
          <select value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))} className="admin-input mt-1">
            {[5, 8, 10, 15].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-6">
          <button disabled={loading} className="admin-primary-btn w-full sm:w-auto">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Buscando empresas reais...</> : <><Sparkles size={15} /> Prospectar com IA + Google</>}
          </button>
          <span className="ml-3 text-[11px] text-slate-600">A IA pesquisa empresas reais na web — leva ~20s.</span>
        </div>
      </form>

      {error && <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {searchQueries.length > 0 && <p className="mt-3 text-[11px] text-slate-600">Buscas realizadas: {searchQueries.join(" · ")}</p>}

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {prospects.map((p) => (
          <article key={p.id} className={`admin-card ${justFound.has(p.id) ? "border-cyan-300/30" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{p.companyName}</h3>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><MapPin size={11} />{[p.city, p.region, p.country].filter(Boolean).join(", ") || "—"}</span>
                  {p.category && <span>· {p.category}</span>}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-white/[.08] bg-white/[.03] text-[10px] text-slate-400">
                <strong className={p.score >= 70 ? "text-emerald-300" : p.score >= 40 ? "text-orange-300" : "text-slate-400"}>{p.score}</strong>
                score
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">{p.opportunity || "—"}</p>
            {(p.website || p.phone) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                {p.website && <a href={p.website.startsWith("http") ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-300 hover:underline"><Globe size={11} /> site</a>}
                {p.phone && <span className="text-slate-500">☎ {p.phone}</span>}
              </div>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-white/[.06] pt-3">
              <select
                aria-label="Status da prospecção"
                value={p.status}
                onChange={(e) => updateStatus(p.id, e.target.value as Prospect["status"])}
                className={`rounded-lg border bg-[#0a0a1a] px-2 py-1.5 text-[11px] ${STATUS_TONE[p.status]}`}
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button onClick={() => remove(p.id)} aria-label="Remover prospecção" className="admin-icon-btn"><Trash2 size={13} className="text-rose-300/70" /></button>
            </div>
          </article>
        ))}
      </div>
      {prospects.length === 0 && !loading && (
        <div className="mt-6 rounded-2xl border border-dashed border-white/[.1] p-10 text-center">
          <Search size={22} className="mx-auto text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">Nenhuma prospecção ainda.</p>
          <p className="mt-1 text-xs text-slate-600">Use o formulário acima: informe setor e cidade, e a IA busca empresas reais sem site.</p>
        </div>
      )}
    </div>
  );
}
