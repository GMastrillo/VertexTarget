/* eslint-disable complexity, max-statements -- authentication checks must remain ordered in one handler. */
import { NextResponse } from "next/server";
// Authentication must use the request-bound Supabase session client.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";

const json = (body: Record<string, string | boolean>, status = 200) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return json({ error: "Origem inválida." }, 403);
  if (isRateLimited("login", getClientAddress(request), 10, 60_000)) return json({ error: "Muitas tentativas. Tente novamente em instantes." }, 429);
  if (!hasJsonContentType(request)) return json({ error: "Formato inválido." }, 415);

  const supabase = await createSupabaseServerClient();
  if (!supabase) return json({ error: "Autenticação não configurada." }, 503);

  const parsed = await parseJsonBody<{ email?: unknown; password?: unknown }>(request, 4_096);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) return json({ error: "Payload inválido." }, 400);
  const email = typeof parsed.value.email === "string" ? parsed.value.email.trim().toLowerCase() : "";
  const password = typeof parsed.value.password === "string" ? parsed.value.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 256) {
    return json({ error: "Credenciais inválidas." }, 400);
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return json({ error: "Credenciais inválidas." }, 401);

  const { data: { user } } = await supabase.auth.getUser();
  const { data: member } = user
    ? await supabase.from("team_members").select("active").eq("user_id", user.id).maybeSingle()
    : { data: null };

  if (!user?.email_confirmed_at || !member?.active) {
    await supabase.auth.signOut();
    return json({ error: "Credenciais inválidas." }, 401);
  }

  // First login: the session is valid, but the user must rotate the temporary password before entering.
  if (user.user_metadata?.password_must_change === true) {
    return json({ mustChangePassword: true });
  }

  return json({ ok: "true" });
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) return json({ error: "Origem inválida." }, 403);
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  return json({ ok: "true" });
}
