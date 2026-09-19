import { NextResponse } from "next/server";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createSupportTicket, getInboxSnapshot, sendConversationMessage, updateConversation, updateSupportTicket } from "@/lib/inbox-repository";
import { parseInboxAction, type InboxAction } from "@/lib/inbox-validation";

export async function GET() {
  if (!await getAuthenticatedTeamUser()) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  try { return NextResponse.json(await getInboxSnapshot()); }
  catch { return NextResponse.json({ error: "Não foi possível carregar o Inbox." }, { status: 500 }); }
}

async function execute(action: InboxAction) {
  if (action.action === "message.send") return sendConversationMessage(action.conversationId, action.body, action.internalNote === true);
  if (action.action === "conversation.update") return updateConversation(action.conversationId, { status: action.status, assigneeId: action.assigneeId });
  if (action.action === "ticket.create") return createSupportTicket(action);
  return updateSupportTicket(action.ticketId, { status: action.status, assigneeId: action.assigneeId });
}

export async function POST(request: Request) {
  if (!await getAuthenticatedTeamUser()) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  try {
    const parsed = parseInboxAction(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: "Dados inválidos.", reason: parsed.reason }, { status: 400 });
    const data = await execute(parsed.value);
    return NextResponse.json(data === undefined ? { ok: true } : { data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível concluir a operação.";
    return NextResponse.json({ error: message }, { status: message.includes("não encontrada") ? 404 : 400 });
  }
}
