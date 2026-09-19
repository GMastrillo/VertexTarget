import { NextResponse } from "next/server";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { checkWhatsAppInstance, createWhatsAppInstance, getWhatsAppSnapshot, sendWhatsAppMessage } from "@/lib/whatsapp-repository";
import { parseWhatsAppAction, type WhatsAppAction } from "@/lib/whatsapp-validation";

export async function GET() {
  if (!await getAuthenticatedTeamUser()) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  try { return NextResponse.json(await getWhatsAppSnapshot()); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível carregar WhatsApp." }, { status: 500 }); }
}
async function execute(action: WhatsAppAction) { if (action.action === "instance.create") return createWhatsAppInstance(action); if (action.action === "instance.check") return checkWhatsAppInstance(action.instanceId); return sendWhatsAppMessage(action.instanceId, action.recipient, action.body, action.conversationId); }
export async function POST(request: Request) {
  if (!await getAuthenticatedTeamUser()) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  try { const parsed = parseWhatsAppAction(await request.json()); if (!parsed.ok) return NextResponse.json({ error: "Dados inválidos.", reason: parsed.reason }, { status: 400 }); return NextResponse.json({ data: await execute(parsed.value) }, { status: 201 }); }
  catch (error) { const message = error instanceof Error ? error.message : "Não foi possível concluir a operação."; return NextResponse.json({ error: message }, { status: message.includes("não encontrada") ? 404 : 400 }); }
}
