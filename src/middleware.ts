import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase-config";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import {
  resolveI18nRouting,
  COOKIE_LOCALE_NAME,
  HEADER_LOCALE_NAME,
  HEADER_SITE_SLUG_NAME,
} from "@/lib/i18n/request-context";

async function handleAdminAuth(
  request: NextRequest,
  supabase: SupabaseClient,
  user: User | null,
  response: NextResponse
): Promise<NextResponse> {
  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);

  if (!user?.email || !user.email_confirmed_at) {
    return NextResponse.redirect(login);
  }

  const { data: member } = await supabase
    .from("team_members")
    .select("active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member?.active) {
    return NextResponse.redirect(login);
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .eq("active", true);

  if (!membershipsError && !memberships?.length) {
    return NextResponse.redirect(login);
  }

  if (user.user_metadata?.password_must_change === true) {
    return NextResponse.redirect(new URL("/login/trocar-senha", request.url));
  }

  return response;
}

function handleOsAuth(
  request: NextRequest,
  user: User | null,
  response: NextResponse
): NextResponse {
  const pathname = request.nextUrl.pathname;
  const publicAuthPaths = ["/os/entrar", "/os/cadastro", "/os/recuperar", "/os/redefinir-senha"];
  const isPublicAuth = publicAuthPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isPublicAuth) {
    if (user?.email && user.email_confirmed_at && pathname !== "/os/redefinir-senha") {
      return NextResponse.redirect(new URL("/os", request.url));
    }
    return response;
  }

  if (!user?.email || !user.email_confirmed_at) {
    const loginUrl = new URL("/os/entrar", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

function applyRoutingHeaders(request: NextRequest, locale: string): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_LOCALE_NAME, locale);

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/sites/")) {
    const slug = pathname.slice("/sites/".length).split("/")[0];
    if (slug && /^[a-z0-9-]+$/i.test(slug)) {
      requestHeaders.set(HEADER_SITE_SLUG_NAME, slug);
    }
  }

  return requestHeaders;
}

async function handleProtectedRoutes(
  request: NextRequest,
  requestHeaders: Headers,
  locale: string,
): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(HEADER_LOCALE_NAME, locale);

  const config = getSupabaseConfig();
  if (!config) {
    if (pathname.startsWith("/admin")) {
      const login = new URL("/login", request.url);
      login.searchParams.set("error", "auth-config");
      return NextResponse.redirect(login);
    }
    return response;
  }

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        response.headers.set(HEADER_LOCALE_NAME, locale);
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request, supabase, user, response);
  }

  if (pathname.startsWith("/os")) {
    return handleOsAuth(request, user, response);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const cookieLocale = request.cookies.get(COOKIE_LOCALE_NAME)?.value;

  const decision = resolveI18nRouting({ pathname, search, cookieLocale });

  if (decision.type === "redirect") {
    const redirectUrl = new URL(decision.destination, request.url);
    return NextResponse.redirect(redirectUrl, decision.statusCode);
  }

  const requestHeaders = applyRoutingHeaders(request, decision.locale);
  return handleProtectedRoutes(request, requestHeaders, decision.locale);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|map)$).*)",
  ],
};
