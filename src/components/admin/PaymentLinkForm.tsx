"use client";

import { useRef, useState } from "react";
import type { PaymentLinkAction } from "@/lib/payment-link-validation";
import type { BaseCurrency } from "@/lib/finance/types";
import { parseBaseAmount } from "@/lib/finance/money";

type Option = { id: string; name: string };
type Props = {
  clients: Option[];
  deals: Option[];
  onSubmit: (input: PaymentLinkAction) => Promise<void>;
  onCancel: () => void;
};

export function PaymentLinkForm({ clients, deals, onSubmit, onCancel }: Props) {
  const [kind, setKind] = useState<"one_time" | "recurring">("one_time");
  const [currency, setCurrency] = useState<BaseCurrency>("brl");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [clientId, setClientId] = useState("");
  const [dealId, setDealId] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const requestIdRef = useRef<string>(crypto.randomUUID());

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg("");
    const parsed = parseBaseAmount(amount, "pt-BR", currency);
    if (!parsed.ok) {
      setErrorMsg(parsed.code === "range" ? "Valor fora do limite (1 a 100.000.000)." : "Formato inválido (ex: 1.500,00).");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        action: "payment-link.create",
        kind,
        amountCents: parsed.amountMinor,
        currency,
        description: description.trim(),
        recurringInterval: kind === "recurring" ? interval : undefined,
        installments: 1,
        clientId: clientId || undefined,
        dealId: dealId || undefined,
        requestId: requestIdRef.current,
      });
      requestIdRef.current = crypto.randomUUID();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Falha ao criar Payment Link.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 grid gap-3 rounded-xl border border-border bg-muted p-4 md:grid-cols-2">
      <label className="text-xs text-muted-foreground">Tipo
        <select value={kind} onChange={(e) => setKind(e.target.value as "one_time" | "recurring")} className="admin-input mt-1">
          <option value="one_time">Projeto avulso</option>
          <option value="recurring">Recorrência</option>
        </select>
      </label>
      <label className="text-xs text-muted-foreground">Moeda base
        <select value={currency} onChange={(e) => setCurrency(e.target.value as BaseCurrency)} className="admin-input mt-1">
          <option value="brl">BRL (R$ — Real)</option>
          <option value="usd">USD ($ — Dólar)</option>
          <option value="eur">EUR (€ — Euro)</option>
        </select>
      </label>
      <label className="text-xs text-muted-foreground">Valor ({currency.toUpperCase()})
        <input required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={currency === "brl" ? "1.500,00" : "250,00"} className="admin-input mt-1" />
      </label>
      {kind === "recurring" ? (
        <label className="text-xs text-muted-foreground">Periodicidade
          <select value={interval} onChange={(e) => setInterval(e.target.value as "month" | "year")} className="admin-input mt-1">
            <option value="month">Mensal</option>
            <option value="year">Anual</option>
          </select>
        </label>
      ) : (
        <label className="text-xs text-muted-foreground">Condição
          <select disabled value="1" className="admin-input mt-1 opacity-70"><option value="1">À vista (1x)</option></select>
        </label>
      )}
      <label className="text-xs text-muted-foreground md:col-span-2">Descrição do serviço
        <input required maxLength={240} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Consultoria técnica ou desenvolvimento" className="admin-input mt-1" />
      </label>
      <label className="text-xs text-muted-foreground">Cliente (opcional)
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="admin-input mt-1">
          <option value="">Nenhum</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="text-xs text-muted-foreground">Negócio (opcional)
        <select value={dealId} onChange={(e) => setDealId(e.target.value)} className="admin-input mt-1">
          <option value="">Nenhum</option>
          {deals.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </label>
      <p className="text-[11px] text-muted-foreground md:col-span-2">O Stripe é a autoridade do preço. Moeda e total locais são confirmados no checkout Stripe.</p>
      {errorMsg && <p role="alert" className="text-xs text-destructive md:col-span-2">{errorMsg}</p>}
      <div className="flex gap-2 md:col-span-2">
        <button disabled={saving} className="admin-primary-btn">{saving ? "Criando…" : "Criar Payment Link"}</button>
        <button type="button" onClick={onCancel} className="admin-secondary-btn">Cancelar</button>
      </div>
    </form>
  );
}
