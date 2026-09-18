import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const json = (body: Record<string, string>, status = 200) => NextResponse.json(body, { status });

function isSameOrigin(request: Request) {
  const originHeader = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!originHeader || !host) return false;

  try {
    const origin = new URL(originHeader);
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const protocol = forwardedProto?.split(",")[0]?.trim() || origin.protocol.replace(":", "");
    return origin.host === host && origin.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Origem inválida." }, 403);

  const supabase = await createSupabaseServerClient();
  if (!supabase) return json({ error: "Autenticação não configurada." }, 503);

  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
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

  return json({ ok: "true" });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Origem inválida." }, 403);
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  return json({ ok: "true" });
}
