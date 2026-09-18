import { NextResponse } from "next/server";
import { requireTeamUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function serialize(row: Record<string, unknown>) {
  const name = String(row.name ?? "Cliente");
  const valueCents = Number(row.value_cents ?? 0);
  const billingType = row.billing_type === "monthly" ? "mês" : "projeto";
  return {
    id: String(row.id),
    name,
    initials: initials(name),
    service: String(row.service ?? "Serviço não informado"),
    status: row.status === "active" ? "Ativo" : row.status === "paused" ? "Pausado" : "Em negociação",
    value: `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valueCents / 100)}/${billingType}`,
    email: String(row.email ?? ""),
    since: new Date(String(row.created_at)).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    description: String(row.description ?? ""),
  };
}

export async function GET() {
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const { data, error } = await supabase.from("clients").select("id,name,service,status,value_cents,billing_type,email,description,created_at").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Não foi possível carregar os clientes." }, { status: 502 });
  return NextResponse.json({ clients: (data ?? []).map((row) => serialize(row as Record<string, unknown>)) }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  if (isRateLimited("admin-clients", getClientAddress(request), 30, 60_000)) return NextResponse.json({ error: "Muitas solicitações. Tente novamente em instantes." }, { status: 429 });
  if (!hasJsonContentType(request)) return NextResponse.json({ error: "Formato inválido." }, { status: 415 });

  const auth = await requireTeamUser(["owner", "sales"]);
  if (!auth.user) return NextResponse.json({ error: "Permissão insuficiente." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<Record<string, unknown>>(request, 8_192);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
  const body = parsed.value;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const service = typeof body?.service === "string" ? body.service.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const valueCents = typeof body?.valueCents === "number" && Number.isSafeInteger(body.valueCents) ? body.valueCents : -1;
  const billingType = body?.billingType === "monthly" || body?.billingType === "project" ? body.billingType : null;

  if (name.length < 2 || name.length > 120 || service.length < 2 || service.length > 160 || !emailPattern.test(email) || email.length > 320 || valueCents < 0 || !billingType) {
    return NextResponse.json({ error: "Dados do cliente inválidos." }, { status: 400 });
  }

  const { data, error } = await supabase.from("clients").insert({ name, service, email, description, value_cents: valueCents, billing_type: billingType, status: "negotiating" }).select("id,name,service,status,value_cents,billing_type,email,description,created_at").single();
  if (error || !data) return NextResponse.json({ error: "Não foi possível criar o cliente." }, { status: 502 });
  return NextResponse.json({ client: serialize(data as Record<string, unknown>) }, { status: 201 });
}
