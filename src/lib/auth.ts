import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function isTeamEmail(email: string | undefined | null) {
  const allowed = (process.env.VERTEX_TEAM_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && allowed.length > 0 && allowed.includes(email.toLowerCase()));
}

export async function getAuthenticatedTeamUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user && Boolean(user.email_confirmed_at) && isTeamEmail(user.email) ? user : null;
}
