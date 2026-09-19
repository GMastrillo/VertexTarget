import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !serviceKey || !publishableKey) throw new Error("Supabase env incompleto.");

const serviceHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };
const publicHeaders = { apikey: publishableKey, "Content-Type": "application/json" };
const rest = (table, query = "", headers = serviceHeaders, options = {}) => fetch(`${url}/rest/v1/${table}${query}`, { headers, ...options });
const check = (name, value) => {
  console.log(`${value ? "✓" : "✗"} ${name}`);
  if (!value) throw new Error(name);
};

let temporaryUserId;
let temporaryOrganizationId;
let temporaryClientId;
let accessToken;
const password = `RlsTest-${randomUUID()}!`;
const email = `rls-test-${randomUUID()}@example.invalid`;
const initialOrganizationId = "00000000-0000-0000-0000-000000000001";

try {
  const schema = await rest("organizations", "?select=id&limit=1");
  const clients = await rest("clients", "?select=id,organization_id&limit=1");
  check("migration 003 criou organizations", schema.ok);
  check("migration 003 adicionou clients.organization_id", clients.ok);

  const orgResponse = await rest("organizations", "", serviceHeaders, {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=representation" },
    body: JSON.stringify({ name: "RLS Validation Workspace", slug: `rls-validation-${Date.now()}` }),
  });
  const [organization] = await orgResponse.json();
  temporaryOrganizationId = organization.id;

  const userResponse = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: serviceHeaders,
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { test_user: true } }),
  });
  const user = await userResponse.json();
  temporaryUserId = user.id;

  const membershipResponse = await rest("organization_members", "", serviceHeaders, {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ organization_id: temporaryOrganizationId, user_id: temporaryUserId, role: "owner", active: true }),
  });
  check("usuário temporário recebeu membership somente no workspace de teste", membershipResponse.ok);

  const clientResponse = await rest("clients", "", serviceHeaders, {
    method: "POST",
    headers: { ...serviceHeaders, Prefer: "return=representation" },
    body: JSON.stringify({ organization_id: temporaryOrganizationId, name: "RLS Test Client", service: "Isolation test", email, value_cents: 1, billing_type: "project" }),
  });
  const [client] = await clientResponse.json();
  temporaryClientId = client.id;

  const tokenResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: publicHeaders,
    body: JSON.stringify({ email, password }),
  });
  const token = await tokenResponse.json();
  accessToken = token.access_token;
  check("usuário temporário conseguiu autenticar", tokenResponse.ok && Boolean(accessToken));

  const userHeaders = { apikey: publishableKey, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };
  const ownRowsResponse = await rest("clients", `?select=id,organization_id&id=eq.${temporaryClientId}`, userHeaders);
  const ownRows = await ownRowsResponse.json();
  check("usuário consegue ler o cliente do próprio workspace", ownRowsResponse.ok && ownRows.length === 1 && ownRows[0].organization_id === temporaryOrganizationId);

  const foreignRowsResponse = await rest("clients", `?select=id,organization_id&organization_id=eq.${initialOrganizationId}`, userHeaders);
  const foreignRows = await foreignRowsResponse.json();
  check("usuário não consegue ler clientes do workspace VertexTarget", foreignRowsResponse.ok && foreignRows.length === 0);

  const forgedResponse = await rest("clients", "", userHeaders, {
    method: "POST",
    headers: { ...userHeaders, Prefer: "return=representation" },
    body: JSON.stringify({ organization_id: initialOrganizationId, name: "Forged Cross Org", service: "Should fail", email, value_cents: 1, billing_type: "project" }),
  });
  check("usuário não consegue inserir cliente em outro workspace", forgedResponse.status === 401 || forgedResponse.status === 403);

  console.log("\nISOLAMENTO MULTI-ORGANIZAÇÃO VALIDADO");
} finally {
  if (temporaryClientId) await rest("clients", `?id=eq.${temporaryClientId}`, serviceHeaders, { method: "DELETE" });
  if (temporaryOrganizationId) await rest("organizations", `?id=eq.${temporaryOrganizationId}`, serviceHeaders, { method: "DELETE" });
  if (temporaryUserId) await fetch(`${url}/auth/v1/admin/users/${temporaryUserId}`, { method: "DELETE", headers: serviceHeaders });
}
