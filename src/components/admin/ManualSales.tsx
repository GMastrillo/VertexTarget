"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type ManualSaleItem = {
  id: string;
  clientName: string;
  description: string;
  amountCents: number;
  method: "pix" | "cash" | "transfer" | "other";
  soldAt: string;
};

const METHOD_LABEL: Record<string, string> = { pix: "PIX", cash: "Dinheiro", transfer: "Transferência", other: "Outro" };
const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

function normalize(s: Record<string, unknown>): ManualSaleItem {
  return {
    id: String(s.id),
    clientName: String(s.client_name ?? ""),
    description: String(s.description ?? ""),
    amountCents: Number(s.amount_cents ?? 0),
    method: (s.method ?? "pix") as ManualSaleItem["method"],
    soldAt: String(s.sold_at ?? ""),
  };
}

export function ManualSales({ initialSales, canManage }: { initialSales: ManualSaleItem[]; canManage: boolean }) {
  const [sales, setSales] = useState(initialSales.map(normalize));
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [value, setValue] = useState("R$ ");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("pix");
  const [soldAt, setSoldAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = sales.reduce((sum, s) => sum + s.amountCents, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/manual-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, value, description, method, soldAt }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error ?? "Não foi possível registrar.");
        return;
      }
      setSales((prev) => [normalize(json.sale), ...prev]);
      setOpen(false);
      setClientName("");
      setValue("R$ ");
      setDescription("");
      setMethod("pix");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch("/api/admin/manual-sales", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSales((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Vendas manuais (fora do Stripe)</h2>
          <p className="mt-1 text-xs text-slate-500">PIX, dinheiro e transferências registrados fora do Stripe · total {brl(total)}</p>
        </div>
        {canManage && (
          <button onClick={() => setOpen((v) => !v)} className="admin-primary-btn">
            <Plus size={15} /> Registrar venda
          </button>
        )}
      </div>
      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border border-white/[.08] bg-white/[.02] p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs text-slate-400">Cliente
            <input required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nome do cliente" className="admin-input mt-1" />
          </label>
          <label className="text-xs text-slate-400">Valor
            <input required value={value} onChange={(e) => setValue(e.target.value)} placeholder="R$ 1.500,00" className="admin-input mt-1" />
          </label>
          <label className="text-xs text-slate-400">Forma
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="admin-input mt-1">
              <option value="pix">PIX</option>
              <option value="cash">Dinheiro</option>
              <option value="transfer">Transferência</option>
              <option value="other">Outro</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">Data
            <input type="date" value={soldAt} onChange={(e) => setSoldAt(e.target.value)} className="admin-input mt-1" />
          </label>
          <label className="text-xs text-slate-400">Descrição
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" className="admin-input mt-1" />
          </label>
          {error && <p className="text-xs text-rose-300 sm:col-span-2 lg:col-span-5">{error}</p>}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
            <button disabled={saving} className="admin-primary-btn">{saving ? "Salvando..." : "Salvar venda"}</button>
            <button type="button" onClick={() => setOpen(false)} className="admin-secondary-btn">Cancelar</button>
          </div>
        </form>
      )}
      {sales.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Cliente</th><th>Descrição</th><th>Data</th><th>Forma</th><th className="text-right">Valor</th>{canManage && <th />}</tr></thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium text-slate-200">{s.clientName}</td>
                  <td className="text-slate-400">{s.description || "—"}</td>
                  <td className="text-slate-400">{new Date(s.soldAt + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                  <td>{METHOD_LABEL[s.method] ?? s.method}</td>
                  <td className="text-right font-medium text-slate-200">{brl(s.amountCents)}</td>
                  {canManage && (
                    <td className="text-right">
                      <button onClick={() => remove(s.id)} aria-label="Remover venda" className="admin-icon-btn"><Trash2 size={14} className="text-rose-300" /></button>
                    </td>
                  )}
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="text-right text-xs uppercase tracking-wider text-slate-500">Total manual</td>
                <td className="text-right font-semibold text-emerald-300">{brl(total)}</td>
                {canManage && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
