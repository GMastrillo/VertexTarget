// E2E Stripe webhook validation against a real production server.
// Generates CLI-equivalent signed events (t=...,v1=HMAC-SHA256) with a TEST webhook secret.
// Makes zero calls to the Stripe API and never touches the live webhook secret.
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=/);
  if (m) env[m[1]] = line.slice(line.indexOf("=") + 1).trim();
}

const BASE = "http://127.0.0.1:3025";
const TEST_SECRET = "whsec_test_e2e_" + "0".repeat(24); // test-only secret, injected into the server process below

// --- Sign exactly like the Stripe CLI: v1 = HMAC-SHA256("{timestamp}.{payload}", secret)
function signedHeaders(payloadString, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const v1 = createHmac("sha256", secret).update(`${timestamp}.${payloadString}`, "utf8").digest("hex");
  return { "Content-Type": "application/json", "stripe-signature": `t=${timestamp},v1=${v1}` };
}

const invoiceEvent = (type, invoice) =>
  JSON.stringify({ id: `evt_test_${type}_${invoice.id}`, object: "event", api_version: "2025-03-31.basil", created: Math.floor(Date.now() / 1000), data: { object: invoice }, livemode: false, pending_webhooks: 1, request: { id: null, idempotency_key: null }, type });

const baseInvoice = (id, extra = {}) => ({
  id, object: "invoice", amount_due: 35000, amount_paid: 35000, amount_remaining: 0,
  currency: "brl", customer: "cus_test_vertex", status: "paid",
  status_transitions: { paid_at: 1757913600 }, ...extra, // 1757913600 → 2025-09-15T06:40:00.000Z
});

const restHeaders = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json" };

async function invoicesFor(prefix) {
  const r = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/invoices?stripe_invoice_id=like.${prefix}*&select=stripe_invoice_id,amount_cents,currency,status,paid_at&order=stripe_invoice_id`, { headers: restHeaders });
  return r.json();
}

const cleanup = async () => {
  await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/invoices?stripe_invoice_id=like.in_test_e2e_*`, { method: "DELETE", headers: restHeaders });
};

// --- Start production server with the TEST webhook secret (same mechanics as `stripe listen`)
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3025"], {
  stdio: "ignore", detached: true,
  env: { ...process.env, STRIPE_WEBHOOK_SECRET: TEST_SECRET },
});
server.unref();

const post = async (payloadString, headers) =>
  fetch(`${BASE}/api/stripe/webhook`, { method: "POST", headers, body: payloadString }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

let failed = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`); if (!ok) failed++; };

await new Promise((r) => setTimeout(r, 6000));
await cleanup();

try {
  // 1. invoice.paid assinado → 200 e persiste como paid
  const paidPayload = invoiceEvent("invoice.paid", baseInvoice("in_test_e2e_paid"));
  let r = await post(paidPayload, signedHeaders(paidPayload, TEST_SECRET));
  check("invoice.paid assinado aceito", r.status === 200 && r.body?.received === true, JSON.stringify(r.body));
  let rows = await invoicesFor("in_test_e2e_paid");
  check("invoice.paid persistido", rows.length === 1 && rows[0].status === "paid" && rows[0].amount_cents === 35000 && rows[0].currency === "brl", JSON.stringify(rows[0] ?? rows));
  check("paid_at convertido de unix para o instante correto", rows[0]?.paid_at != null && Date.parse(rows[0].paid_at) === 1757913600 * 1000, rows[0]?.paid_at);

  // 2. Reenvio do mesmo invoice.paid com valor atualizado → upsert idempotente (1 linha, valor novo)
  const paidUpdatePayload = invoiceEvent("invoice.paid", baseInvoice("in_test_e2e_paid", { amount_paid: 42000, amount_due: 42000 }));
  r = await post(paidUpdatePayload, signedHeaders(paidUpdatePayload, TEST_SECRET));
  check("reenvio aceito", r.status === 200);
  rows = await invoicesFor("in_test_e2e_paid");
  check("upsert idempotente: 1 linha com valor atualizado", rows.length === 1 && rows[0].amount_cents === 42000, JSON.stringify(rows[0] ?? rows));

  // 3. invoice.payment_failed → status payment_failed
  const failedPayload = invoiceEvent("invoice.payment_failed", baseInvoice("in_test_e2e_failed", { status: "open", amount_paid: 0, amount_remaining: 35000, status_transitions: { paid_at: null } }));
  r = await post(failedPayload, signedHeaders(failedPayload, TEST_SECRET));
  rows = await invoicesFor("in_test_e2e_failed");
  check("invoice.payment_failed persistido como payment_failed", r.status === 200 && rows.length === 1 && rows[0].status === "payment_failed" && rows[0].paid_at === null, JSON.stringify(rows[0] ?? rows));

  // 4. invoice.finalized → status open
  const finalizedPayload = invoiceEvent("invoice.finalized", baseInvoice("in_test_e2e_finalized", { status: "open" }));
  r = await post(finalizedPayload, signedHeaders(finalizedPayload, TEST_SECRET));
  rows = await invoicesFor("in_test_e2e_finalized");
  check("invoice.finalized persistido como open", r.status === 200 && rows.length === 1 && rows[0].status === "open", JSON.stringify(rows[0] ?? rows));

  // 5. Assinatura inválida (segredo errado) → 400
  const evilPayload = invoiceEvent("invoice.paid", baseInvoice("in_test_e2e_evil", { amount_paid: 99999999 }));
  r = await post(evilPayload, signedHeaders(evilPayload, "whsec_attacker_" + "1".repeat(24)));
  check("assinatura inválida rejeitada", r.status === 400, JSON.stringify(r.body));
  rows = await invoicesFor("in_test_e2e_evil");
  check("evento forjado NÃO persistiu", rows.length === 0, JSON.stringify(rows));

  // 6. Timestamp fora da tolerância (6 min) → 400
  r = await post(paidPayload, signedHeaders(paidPayload, TEST_SECRET, Math.floor(Date.now() / 1000) - 360));
  check("timestamp antigo (fora da tolerância) rejeitado", r.status === 400, String(r.status));

  // 7. Total persistido = exatamente os 3 eventos válidos
  rows = await invoicesFor("in_test_e2e_");
  check("tabela invoices contém exatamente os 3 eventos válidos", rows.length === 3, `rows=${rows.length}`);
} finally {
  await cleanup();
  const final = await invoicesFor("in_test_e2e_");
  check("cleanup: linhas de teste removidas", final.length === 0, `rows=${final.length}`);
  try {
    process.kill(-server.pid);
  } catch {
    // Windows does not support process groups; fall back to the child PID.
    try {
      process.kill(server.pid);
    } catch {
      // The test server may already have exited.
    }
  }
}

console.log(failed === 0 ? "\nTODOS OS CHECKS DO WEBHOOK PASSARAM" : `\n${failed} CHECK(S) FALHARAM`);
process.exit(failed === 0 ? 0 : 1);
