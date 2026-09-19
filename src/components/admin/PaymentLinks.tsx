"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { PaymentLink } from "@/lib/payment-link-types";
import type { PaymentLinkAction } from "@/lib/payment-link-validation";
import { PaymentLinkForm } from "@/components/admin/PaymentLinkForm";
import { PaymentLinkList } from "@/components/admin/PaymentLinkList";

type Option = { id: string; name: string };
type Props = { initialLinks: PaymentLink[]; initialError?: string; clients: Option[]; deals: Option[]; canManage: boolean };

export function PaymentLinks({ initialLinks, initialError = "", clients, deals, canManage }: Props) {
  const [links, setLinks] = useState(initialLinks);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState("");
  const blocked = Boolean(initialError || error);

  useEffect(() => {
    if (blocked) setOpen(false);
  }, [blocked]);

  async function create(input: PaymentLinkAction) {
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/payment-links", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Não foi possível criar o link.");
      setLinks((previous) => [body.link, ...previous]);
      setSuccess("Payment Link criado com sucesso.");
      setOpen(false);
    } catch (cause) {
      setOpen(false);
      setError(cause instanceof Error ? cause.message : "Não foi possível criar o link.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="admin-eyebrow">Stripe / cobrança</p>
          <h2 className="font-[var(--font-heading)] text-lg">Payment Links</h2>
          <p className="mt-1 text-xs text-slate-500">Crie links avulsos ou recorrentes com preço definido no servidor.</p>
        </div>
        {canManage && !blocked && <button onClick={() => { setOpen((value) => !value); setError(""); }} className="admin-primary-btn"><Plus size={15}/> Criar link</button>}
      </div>
      {blocked && <p role="alert" className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/[.05] p-3 text-xs text-amber-200">{error || initialError}</p>}
      {success && <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[.05] p-3 text-xs text-emerald-200">{success}</p>}
      {!blocked && open && <PaymentLinkForm clients={clients} deals={deals} onSubmit={create} onCancel={() => setOpen(false)} />}
      <PaymentLinkList links={links}/>
    </div>
  );
}
