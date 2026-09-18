import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase-config";

export async function middleware(request: NextRequest) {
  const config = getSupabaseConfig();
  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);

  if (!config) {
    login.searchParams.set("error", "auth-config");
    return NextResponse.redirect(login);
  }

  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) return NextResponse.redirect(login);

  const { data: member } = await supabase
    .from("team_members")
    .select("active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!member?.active) return NextResponse.redirect(login);

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
