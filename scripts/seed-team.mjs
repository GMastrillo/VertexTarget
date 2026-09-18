// Seeds/updates VertexTarget team members.
// Usage: node scripts/seed-team.mjs "email1@vertex.com" "email2@vertex.com" ...
// Reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env.local. Server-side only.
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=/);
  if (m) env[m[1]] = line.slice(line.indexOf("=") + 1).trim();
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const emails = process.argv.slice(2);
if (emails.length === 0) {
  console.error("Usage: node scripts/seed-team.mjs email1 [email2 ...]");
  process.exit(1);
}

const TEMP_PASSWORD = process.env.TEMP_TEAM_PASSWORD ?? "12345678";
const api = (path, init = {}) =>
  fetch(`${url}/auth/v1/${path}`, {
    ...init,
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };

// The ?email= filter is unreliable across GoTrue versions — page through all users and match locally.
async function findUserByEmail(email) {
  const target = email.trim().toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const list = await api(`admin/users?page=${page}&per_page=200`);
    const users = list.body?.users ?? [];
    const hit = users.find((u) => (u.email ?? "").trim().toLowerCase() === target);
    if (hit) return hit;
    if (users.length < 200) return null;
  }
  return null;
}

for (const email of emails) {
  const name = email.split("@")[0].replace(/[._-].*$/, "");
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  // 1. Find or create the auth user.
  const existing = await findUserByEmail(email);
  let userId = existing?.id;

  if (!userId) {
    const created = await api("admin/users", {
      method: "POST",
      body: JSON.stringify({ email, password: TEMP_PASSWORD, email_confirm: true, user_metadata: { full_name: displayName, password_must_change: true } }),
    });
    if (created.status !== 201 && !created.body?.id) {
      console.error(`✗ ${email}: could not create auth user →`, created.status, JSON.stringify(created.body));
      continue;
    }
    userId = created.body.id;
    console.log(`✓ ${email}: auth user created (${userId})`);
  } else {
    const updated = await api(`admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: displayName, password_must_change: true },
      }),
    });
    console.log(updated.status === 200 ? `✓ ${email}: auth user reset (${userId})` : `✗ ${email}: update failed → ${updated.status} ${JSON.stringify(updated.body)}`);
    if (updated.status !== 200) continue;
  }

  // 2. Upsert the owner membership (service role bypasses RLS).
  const upsert = await fetch(`${url}/rest/v1/team_members`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: userId, email, display_name: displayName, role: "owner", active: true }),
  });
  console.log(upsert.ok ? `✓ ${email}: team_members owner` : `✗ ${email}: team_members upsert failed → ${upsert.status}`);
}

console.log("\nDone. Users must change their password on first login.");
