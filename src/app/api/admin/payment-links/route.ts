import { NextResponse } from "next/server";
import { getAuthenticatedTeamUser, requireTeamUser } from "@/lib/auth";
import { listPaymentLinks } from "@/lib/payment-link-repository";
import { createStripePaymentLink } from "@/lib/stripe-payment-links";
import { parsePaymentLinkAction } from "@/lib/payment-link-validation";

export async function GET() {
  const user = await getAuthenticatedTeamUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  try {
    const links = await listPaymentLinks();
    return NextResponse.json({ links });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível carregar links." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireTeamUser(["owner", "finance"]);
  if (!auth.user) {
    return NextResponse.json(
      { error: auth.status === 401 ? "Não autenticado." : "Permissão insuficiente." },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();
    const parsed = parsePaymentLinkAction(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: "Dados inválidos.", reason: parsed.reason },
        { status: 400 }
      );
    }

    const link = await createStripePaymentLink(parsed.value);
    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o Payment Link.";
    const status = message.toLowerCase().includes("conflict") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
