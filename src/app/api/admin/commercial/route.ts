import { NextResponse } from "next/server";
import { getAuthenticatedTeamUser } from "@/lib/auth";
import { createCompany, createContact, createDeal, createTask, getCommercialSnapshot, moveDeal, toggleTask, updateDeal } from "@/lib/commercial-repository";
import { parseCommercialAction, type CommercialAction } from "@/lib/commercial-validation";

export async function GET() {
  try {
    if (!await getAuthenticatedTeamUser()) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    return NextResponse.json(await getCommercialSnapshot());
  } catch { return NextResponse.json({ error: "Não foi possível carregar o núcleo comercial." }, { status: 500 }); }
}

async function execute(action: CommercialAction) {
  if (action.action === "company.create") return createCompany(action);
  if (action.action === "contact.create") return createContact(action);
  if (action.action === "deal.create") return createDeal(action);
  if (action.action === "deal.update") return updateDeal(action.dealId, action);
  if (action.action === "deal.move") return moveDeal(action.dealId, action.stageId);
  if (action.action === "task.create") return createTask(action);
  return toggleTask(action.taskId, action.done);
}

export async function POST(request: Request) {
  try {
    if (!await getAuthenticatedTeamUser()) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    const parsed = parseCommercialAction(await request.json());
    if (!parsed.ok) return NextResponse.json({ error: "Dados inválidos.", reason: parsed.reason }, { status: 400 });
    const data = await execute(parsed.value);
    return NextResponse.json(data === undefined ? { ok: true } : { data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível concluir a operação.";
    const status = message.includes("não encontrado") || message.includes("inválida") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
