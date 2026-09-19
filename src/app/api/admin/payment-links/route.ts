import { NextResponse } from "next/server";
import { requireTeamUser, getAuthenticatedTeamUser } from "@/lib/auth";
import { listPaymentLinks } from "@/lib/payment-link-repository";
import { createStripePaymentLink } from "@/lib/stripe-payment-links";
import { parsePaymentLinkAction } from "@/lib/payment-link-validation";

export async function GET() { const user = await getAuthenticatedTeamUser(); if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 }); try { return NextResponse.json({ links: await listPaymentLinks() }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível carregar links." }, { status: 500 }); } }
export async function POST(request: Request) {
  const auth = await requireTeamUser(["owner", "finance"]);
  if (!auth.user) return NextResponse.json({ error: auth.status === 401 ? "Não autenticado." : "Permissão insuficiente." }, { status: auth.status });
  try { const parsed = parsePaymentLinkAction(await request.json()); if (!parsed.ok) return NextResponse.json({ error: "Dados inválidos.", reason: parsed.reason }, { status: 400 }); return NextResponse.json({ link: await createStripePaymentLink({ ...parsed.value, installments: parsed.value.installments ?? 1 }) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível criar o Payment Link." }, { status: 400 }); }
}
