import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isTeamEmail } from "@/lib/auth";

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
  // Login/logout are state-changing cookie operations; reject cross-origin requests.
  if (!isSameOrigin(request)) return json({ error: "Origem inválida." }, 403);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.VERTEX_TEAM_EMAILS) {
    return json({ error: "Autenticação não configurada." }, 503);
  }

  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 256) {
    return json({ error: "Credenciais inválidas." }, 400);
  }
  if (!isTeamEmail(email)) return json({ error: "Credenciais inválidas." }, 401);

  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  // Do not disclose whether the account exists or which credential failed.
  if (error) return json({ error: "Credenciais inválidas." }, 401);
  return json({ ok: "true" });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Origem inválida." }, 403);
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
    });
    await supabase.auth.signOut();
  }
  return NextResponse.json({ ok: true });
}
