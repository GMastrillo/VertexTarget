import { NextResponse } from "next/server";
import { requireTeamUser } from "@/lib/auth";
import { getClientAddress, hasJsonContentType, isRateLimited, isSameOriginRequest, parseJsonBody } from "@/lib/request-security";
import { workspaceCookieName } from "@/lib/workspace";

export async function PATCH(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
  if (isRateLimited("workspace", getClientAddress(request), 30, 60_000)) return NextResponse.json({ error: "Muitas solicitações." }, { status: 429 });
  if (!hasJsonContentType(request)) return NextResponse.json({ error: "Formato inválido." }, { status: 415 });

  const auth = await requireTeamUser();
  if (!auth.user) return NextResponse.json({ error: "Não autorizado." }, { status: auth.status });

  const parsed = await parseJsonBody<{ organizationId?: unknown }>(request, 512);
  const organizationId = parsed.ok && typeof parsed.value?.organizationId === "string" ? parsed.value.organizationId : "";
  if (!organizationId || !auth.user.organizations.some((organization) => organization.id === organizationId)) {
    return NextResponse.json({ error: "Workspace inválido." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(workspaceCookieName(), organizationId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
