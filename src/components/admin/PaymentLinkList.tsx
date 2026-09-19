"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { PaymentLink } from "@/lib/payment-link-types";

const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
export function PaymentLinkList({ links }: { links: PaymentLink[] }) {
  const [copied, setCopied] = useState("");
  async function copy(url: string, id: string) { await navigator.clipboard.writeText(url); setCopied(id); setTimeout(() => setCopied(""), 1800); }
  if (links.length === 0) return <p className="mt-5 text-sm text-slate-500">Nenhum Payment Link criado neste workspace.</p>;
  return <div className="mt-5 grid gap-2">{links.map((link) => <div key={link.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-white/[.06] p-3"><span className={`rounded-full px-2 py-1 text-[10px] ${link.kind === "recurring" ? "bg-violet-300/10 text-violet-200" : "bg-cyan-300/10 text-cyan-200"}`}>{link.kind === "recurring" ? "Recorrente" : "Projeto"}</span><span className="min-w-[150px] flex-1 text-sm text-slate-200">{link.description}</span><span className="text-sm font-medium text-slate-300">{brl(link.amountCents)}{link.kind === "recurring" ? `/${link.recurringInterval === "year" ? "ano" : "mês"}` : ""}</span><span className="text-xs text-slate-500">{link.status}</span><button onClick={() => void copy(link.url, link.id)} className="admin-secondary-btn text-xs">{copied === link.id ? <Check size={13}/> : <Copy size={13}/>} {copied === link.id ? "Copiado" : "Copiar URL"}</button><a href={link.url} target="_blank" rel="noreferrer" className="admin-icon-btn" aria-label="Abrir Payment Link"><ExternalLink size={14}/></a></div>)}</div>;
}
