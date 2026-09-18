/* eslint-disable complexity, max-statements -- payment input validation stays adjacent to the write. */
import { NextResponse } from "next/server";
import { requireTeamUser } from "@/lib/auth";
// This route owns finance-role authorization and validated write operations.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";

const METHODS = ["pix", "cash", "transfer", "other"] as const;
type Method = (typeof METHODS)[number];

function parseAmountCents(raw: unknown): number | null {
  // Accept "1.234,56", "1234.56", "R$ 1.234,56", 1234.56 — store cents as integer.
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.round(raw * 100);
  if (typeof raw !== "string") return null;
  let s = raw.replace(/[R$\s]/gi, "").trim();
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const v = Number(s);
  return Number.isFinite(v) && v > 0 ? Math.round(v * 100) : null;
}

function parseDate(raw: unknown): string {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date().toISOString().slice(0, 10);
  const d = new Date(raw + "T00:00:00Z");
  return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : raw;
}

export async function GET() {
  const auth = await requireTeamUser(["owner", "finance"]);
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });
  const { data, error } = await supabase
    .from("manual_sales")
    .select("id,client_name,description,amount_cents,method,sold_at")
    .order("sold_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: "Falha ao carregar vendas." }, { status: 502 });
  return NextResponse.json({ sales: data ?? [] }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  if (isRateLimited("manual-sales", getClientAddress(request), 30, 60_000)) {
    return NextResponse.json({ error: "Muitas solicitações." }, { status: 429 });
  }
  if (!hasJsonContentType(request)) return NextResponse.json({ error: "Formato inválido." }, { status: 415 });

  const auth = await requireTeamUser(["owner", "finance"]);
  if (!auth.user) return NextResponse.json({ error: "Permissão insuficiente." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<Record<string, unknown>>(request, 2_048);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
  const body = parsed.value;
  const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const amountCents = parseAmountCents(body.value);
  const method = METHODS.includes(body.method as Method) ? (body.method as Method) : null;
  const soldAt = parseDate(body.soldAt);

  if (clientName.length < 1 || clientName.length > 120 || !amountCents || !method) {
    return NextResponse.json({ error: "Preencha cliente, valor e forma de pagamento válidos." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("manual_sales")
    .insert({ client_name: clientName, description: description.slice(0, 240), amount_cents: amountCents, method, sold_at: soldAt, created_by: auth.user.id })
    .select("id,client_name,description,amount_cents,method,sold_at")
    .single();
  if (error || !data) return NextResponse.json({ error: "Não foi possível registrar a venda." }, { status: 502 });
  return NextResponse.json({ sale: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  const auth = await requireTeamUser(["owner", "finance"]);
  if (!auth.user) return NextResponse.json({ error: "Permissão insuficiente." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<{ id?: unknown }>(request, 512);
  const id = parsed.ok && parsed.value && typeof parsed.value === "object" ? parsed.value.id : null;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }
  const { error } = await supabase.from("manual_sales").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Não foi possível remover a venda." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
