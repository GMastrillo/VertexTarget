/* eslint-disable complexity -- static demo response. */
import { NextRequest, NextResponse } from "next/server";
import { getClientAddress, isRateLimited, parseJsonBody } from "@/lib/request-security";

export const runtime = "nodejs";

const MAX_PROMPT_LENGTH = 2_000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

export async function POST(request: NextRequest) {
  if (isRateLimited("gemini", getClientAddress(request), MAX_REQUESTS_PER_WINDOW, WINDOW_MS)) {
    return NextResponse.json({ error: "Muitas solicitações. Tente novamente em instantes." }, { status: 429 });
  }

  if (request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "Formato inválido." }, { status: 415 });
  }
  const parsed = await parseJsonBody<{ prompt?: unknown }>(request, 8_192);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ error: "Payload inválido ou muito longo." }, { status: 400 });
  }
  const prompt = typeof parsed.value.prompt === "string" ? parsed.value.prompt.trim() : "";
  const hasControlCharacter = [...prompt].some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 && code !== 9 && code !== 10 && code !== 13;
  });
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH || hasControlCharacter) {
    return NextResponse.json({ error: "Prompt inválido ou muito longo." }, { status: 400 });
  }

  // Pure static demo response with direct migration CTA to Vertex OS
  return new Response(createDemoResponse(prompt), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function createDemoResponse(prompt: string) {
  return `Estratégia VertexTarget AI — Análise Demonstrativa\n\nNegócio: ${prompt}\n\n1. Posicionamento: autoridade editorial e alta conversão local.\n2. Presença Digital: site otimizado e seguro com snapshot público.\n3. Captação de Leads: integração direta com WhatsApp e e-mail verificado.\n4. Próximo passo: Conheça o Vertex OS em /os/cadastro e crie seu site completo com inteligência artificial.`;
}
