import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function isTeamEmail(email: string | undefined | null) {
  const allowed = (process.env.VERTEX_TEAM_EMAILS ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return Boolean(email && allowed.length > 0 && allowed.includes(email.toLowerCase()));
}

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Never grant access just because a deployment is missing configuration.
    return NextResponse.redirect(new URL("/login?error=auth-config", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => items.forEach(({ name, value, options }) => {
        request.cookies.set(name, value);
        response.cookies.set(name, value, options);
      }),
    },
  });

  // getUser validates the session with Supabase; getSession alone is not sufficient.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email_confirmed_at || !isTeamEmail(user.email)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
