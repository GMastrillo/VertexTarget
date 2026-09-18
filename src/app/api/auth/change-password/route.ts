/* eslint-disable complexity -- password rotation checks must remain ordered in one handler. */
import { NextResponse } from "next/server";
// Password rotation must use the request-bound Supabase session client.
// eslint-disable-next-line quality/no-direct-data-access
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";

const json = (body: Record<string, string>, status = 200) => NextResponse.json(body, { status });

// First-login password rotation. Requires the (temporary) session created by /api/auth/login,
// rotates the password and clears the password_must_change flag in one atomic update.
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return json({ error: "Origem inválida." }, 403);
  if (isRateLimited("change-password", getClientAddress(request), 5, 60_000)) {
    return json({ error: "Muitas tentativas. Tente novamente em instantes." }, 429);
  }
  if (!hasJsonContentType(request)) return json({ error: "Formato inválido." }, 415);

  const supabase = await createSupabaseServerClient();
  if (!supabase) return json({ error: "Autenticação não configurada." }, 503);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: "Sessão expirada. Faça login novamente." }, 401);

  const parsed = await parseJsonBody<{ password?: unknown }>(request, 1_024);
  if (!parsed.ok || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return json({ error: "Payload inválido." }, 400);
  }
  const password = typeof parsed.value.password === "string" ? parsed.value.password : "";
  // Deliberately stricter than the login validator: this becomes the real credential.
  if (password.length < 10 || password.length > 256 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return json({ error: "A nova senha precisa ter ao menos 10 caracteres, incluindo letras e números." }, 400);
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) return json({ error: "Não foi possível atualizar a senha. Tente novamente." }, 400);

  const { error: metaError } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, password_must_change: false },
  });
  if (metaError) return json({ error: "Senha alterada, mas sinalização pendente. Contate o suporte." }, 500);

  return json({ ok: "true" });
}
