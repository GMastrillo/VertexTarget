/* eslint-disable complexity, max-statements -- AI request validation and persistence form one guarded transaction. */
import { NextResponse } from "next/server";
import { requireTeamUser } from "@/lib/auth";
// This route owns prospect authorization and persists only validated AI output.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";
import { logAiRun } from "@/lib/operations-repository";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `Você é um agente de prospecção da VertexTarget, agência de sites, automação IA e tráfego.
Sua tarefa: encontrar empresas REAIS que provavelmente NÃO têm site próprio ou têm site muito ruim, usando a busca do Google.
Regras:
- Use a ferramenta de busca para pesquisar empresas reais. NUNCA invente empresas.
- Prefira negócios que aparecem no Google Maps/guia comercial sem link de site, ou cujo site citado é facebook/instagram ou claramente desatualizado.
- Cada empresa precisa de: name, category, city, region (estado), country, opportunity (por que precisa de site, 1 frase), score 0-100 (maior = melhor oportunidade).
- Se achar telefone ou site real, inclua; senão string vazia.
- Responda SOMENTE com um array JSON válido, sem markdown, sem comentários.`;

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { return null; }
}

export async function GET() {
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });
  let query = supabase
    .from("prospects")
    .select("id,company_name,category,city,region,country,website,phone,opportunity,score,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Falha ao carregar prospecções." }, { status: 502 });
  return NextResponse.json({ prospects: data ?? [] }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  if (isRateLimited("prospects", getClientAddress(request), 6, 60_000)) {
    return NextResponse.json({ error: "Muitas buscas seguidas. Aguarde um minuto." }, { status: 429 });
  }
  if (!hasJsonContentType(request)) return NextResponse.json({ error: "Formato inválido." }, { status: 415 });

  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Chave da IA não configurada (GOOGLE_GEMINI_API_KEY)." }, { status: 503 });

  const parsed = await parseJsonBody<{ sector?: unknown; city?: unknown; region?: unknown; country?: unknown; maxResults?: unknown }>(request, 2_048);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }
  const b = parsed.value;
  const sector = typeof b.sector === "string" ? b.sector.trim().slice(0, 80) : "";
  const city = typeof b.city === "string" ? b.city.trim().slice(0, 80) : "";
  const region = typeof b.region === "string" ? b.region.trim().slice(0, 80) : "";
  const country = typeof b.country === "string" && b.country.trim() ? b.country.trim().slice(0, 80) : "Brasil";
  const maxResults = Math.min(Math.max(Number(b.maxResults) || 8, 3), 15);
  if (!sector || !city) return NextResponse.json({ error: "Informe setor e cidade/região." }, { status: 400 });

  const userPrompt = `Setor: ${sector}\nCidade/Região: ${city}${region ? ", " + region : ""}\nPaís: ${country}\nEncontre até ${maxResults} empresas reais deste setor nesta região que provavelmente não têm site ou têm presença digital fraca.`;

  const startedAt = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50_000);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.4 },
        }),
      },
    );
    clearTimeout(timeout);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const apiMessage = typeof json?.error?.message === "string" ? json.error.message.slice(0, 200) : "";
      await logAiRun({ automation: "prospectar-empresas", model: MODEL, status: "error", tokens: 0, latencyMs: Date.now() - startedAt, errorCode: String(res.status) });
      if (res.status === 429) return NextResponse.json({ error: "Cota da API do Gemini excedida. Verifique o faturamento no Google AI Studio e tente novamente." }, { status: 502 });
      return NextResponse.json({ error: `IA indisponível (${res.status}). ${apiMessage}` }, { status: 502 });
    }

    const candidate = json?.candidates?.[0];
    const text = candidate?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
    const searchQueries: string[] = candidate?.groundingMetadata?.webSearchQueries ?? [];
    const tokens = Number(json?.usageMetadata?.totalTokenCount ?? 0);

    const arr = extractJson(text);
    if (!Array.isArray(arr)) {
      await logAiRun({ automation: "prospectar-empresas", model: MODEL, status: "error", tokens, latencyMs: Date.now() - startedAt, errorCode: "bad_json" });
      return NextResponse.json({ error: "A IA não retornou dados utilizáveis. Tente refinar o termo." }, { status: 502 });
    }

    const rows = arr
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) => ({
        company_name: String(item.name ?? "").trim().slice(0, 160),
        category: String(item.category ?? sector).trim().slice(0, 120),
        city: String(item.city ?? city).trim().slice(0, 120),
        region: String(item.region ?? region).trim().slice(0, 120),
        country: String(item.country ?? country).trim().slice(0, 120),
        website: typeof item.website === "string" ? item.website.trim().slice(0, 300) : "",
        phone: typeof item.phone === "string" ? item.phone.trim().slice(0, 40) : "",
        opportunity: String(item.opportunity ?? item.why ?? "").trim().slice(0, 400),
        score: Math.min(Math.max(Number(item.score) || 50, 0), 100),
        status: "new",
        source_query: searchQueries.slice(0, 3).join(" | ").slice(0, 500),
      }))
      .filter((row) => row.company_name.length >= 1)
      .slice(0, maxResults);

    if (!rows.length) {
      await logAiRun({ automation: "prospectar-empresas", model: MODEL, status: "error", tokens, latencyMs: Date.now() - startedAt, errorCode: "empty" });
      return NextResponse.json({ error: "Nenhuma empresa encontrada. Tente outro setor ou região." }, { status: 502 });
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });
    const scopedRows = rows.map((row) => auth.user?.organizationId ? { ...row, organization_id: auth.user.organizationId } : row);
    const { data, error } = await supabase.from("prospects").insert(scopedRows).select();
    if (error) return NextResponse.json({ error: "Não foi possível salvar as prospecções." }, { status: 502 });

    await logAiRun({ automation: "prospectar-empresas", model: MODEL, status: "success", tokens, latencyMs: Date.now() - startedAt, errorCode: null });
    return NextResponse.json({ prospects: data, searchQueries }, { status: 201 });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    await logAiRun({ automation: "prospectar-empresas", model: MODEL, status: "error", tokens: 0, latencyMs: Date.now() - startedAt, errorCode: aborted ? "timeout" : "exception" });
    return NextResponse.json({ error: aborted ? "A busca demorou demais. Tente novamente." : "Falha inesperada na busca." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<{ id?: unknown; status?: unknown }>(request, 512);
  const value = parsed.ok ? parsed.value : null;
  const id = typeof value?.id === "string" ? value.id : "";
  const status = typeof value?.status === "string" ? value.status : "";
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["new", "contacted", "client", "discarded"].includes(status)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  let query = supabase.from("prospects").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { error } = await query;
  if (error) return NextResponse.json({ error: "Não foi possível atualizar." }, { status: 502 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Banco não configurado." }, { status: 503 });

  const parsed = await parseJsonBody<{ id?: unknown }>(request, 512);
  const id = parsed.ok && typeof parsed.value?.id === "string" ? parsed.value.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  let query = supabase.from("prospects").delete().eq("id", id);
  if (auth.user.organizationId) query = query.eq("organization_id", auth.user.organizationId);
  const { error } = await query;
  if (error) return NextResponse.json({ error: "Não foi possível remover." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
