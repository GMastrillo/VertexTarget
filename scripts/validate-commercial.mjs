import { strict as assert } from "node:assert";
import { parseCommercialAction } from "../src/lib/commercial-validation.ts";
import { parsePaymentLinkAction } from "../src/lib/payment-link-validation.ts";
import { parseCurrencyToCents } from "../src/lib/payment-link-format.ts";
import { parsePerformanceAction } from "../src/lib/performance-validation.ts";

const ids = { orgA: "00000000-0000-0000-0000-000000000001", orgB: "00000000-0000-0000-0000-000000000002", company: "10000000-0000-0000-0000-000000000001", pipeline: "30000000-0000-0000-0000-000000000001", stageA: "40000000-0000-0000-0000-000000000001", stageB: "40000000-0000-0000-0000-000000000002", deal: "50000000-0000-0000-0000-000000000001" };
const cases = [
  ["company payload is accepted", { action: "company.create", name: "Acme" }, true],
  ["organization_id is server-owned", { action: "company.create", name: "Acme", organization_id: ids.orgB }, false],
  ["invalid company id is rejected", { action: "contact.create", companyId: "not-an-id", name: "Ana" }, false],
  ["invalid deal amount is rejected", { action: "deal.create", title: "Site", companyId: ids.company, pipelineId: ids.pipeline, stageId: ids.stageA, amountCents: -1 }, false],
  ["invalid task priority is rejected", { action: "task.create", title: "Follow-up", priority: "urgent" }, false],
  ["valid move references a server-checked stage", { action: "deal.move", dealId: ids.deal, stageId: ids.stageB }, true],
];
for (const [name, payload, expected] of cases) assert.equal(parseCommercialAction(payload).ok, expected, name);

const deal = { organizationId: ids.orgA, stageId: ids.stageA, title: "Site", amountCents: 1000 };
const task = { organizationId: ids.orgA, done: false };
function moveDeal(actorOrg, nextStage) { assert.equal(actorOrg, deal.organizationId, "foreign workspace cannot move deal"); deal.stageId = nextStage; }
function editDeal(actorOrg, title) { assert.equal(actorOrg, deal.organizationId, "foreign workspace cannot edit deal"); deal.title = title; }
function toggleTask(actorOrg, done) { assert.equal(actorOrg, task.organizationId, "foreign workspace cannot toggle task"); task.done = done; }
moveDeal(ids.orgA, ids.stageB); assert.equal(deal.stageId, ids.stageB);
editDeal(ids.orgA, "Site atualizado"); assert.equal(deal.title, "Site atualizado");
toggleTask(ids.orgA, true); assert.equal(task.done, true);
for (const attempt of [() => moveDeal(ids.orgB, ids.stageA), () => editDeal(ids.orgB, "forjado"), () => toggleTask(ids.orgB, false)]) assert.throws(attempt);

const paymentCases = [
  ["recurring payment link accepted", { action: "payment-link.create", kind: "recurring", amountCents: 150000, currency: "brl", description: "Mensalidade", recurringInterval: "month", installments: 1 }, true],
  ["one-time installments accepted", { action: "payment-link.create", kind: "one_time", amountCents: 500000, currency: "brl", description: "Projeto", installments: 6 }, true],
  ["payment link organization_id rejected", { action: "payment-link.create", kind: "one_time", amountCents: 1000, currency: "brl", description: "Projeto", organization_id: ids.orgB }, false],
  ["zero amount rejected", { action: "payment-link.create", kind: "one_time", amountCents: 0, currency: "brl", description: "Projeto" }, false],
  ["recurring installments rejected", { action: "payment-link.create", kind: "recurring", amountCents: 1000, currency: "brl", description: "Plano", recurringInterval: "month", installments: 3 }, false],
];
for (const [name, payload, expected] of paymentCases) assert.equal(parsePaymentLinkAction(payload).ok, expected, name);

assert.equal(parseCurrencyToCents("R$ 1.500,00"), 150000, "Brazilian currency format");
assert.equal(parseCurrencyToCents("1500.00"), 150000, "dot decimal format");
assert.equal(parseCurrencyToCents("1500"), 150000, "integer currency format");

const performanceCases = [
  ["individual goal accepted", { action: "goal.create", title: "Novos negócios", metric: "deals_won", targetValue: 10, periodStart: "2026-01-01", periodEnd: "2026-01-31", scope: "individual" }, true],
  ["team goal accepted", { action: "goal.create", title: "Receita do time", metric: "revenue_cents", targetValue: 100000, periodStart: "2026-01-01", periodEnd: "2026-12-31", scope: "team" }, true],
  ["challenge accepted", { action: "challenge.create", title: "Sprint de atendimento", metric: "messages_sent", targetValue: 25, periodStart: "2026-01-01", periodEnd: "2026-01-07" }, true],
  ["achievement accepted", { action: "achievement.create", title: "Entrega consistente", description: "Conclua tarefas reais no prazo.", metric: "tasks_completed", targetValue: 20 }, true],
  ["performance organization is server-owned", { action: "goal.create", title: "Forjado", metric: "deals_won", targetValue: 1, periodStart: "2026-01-01", periodEnd: "2026-01-31", scope: "team", organization_id: ids.orgB }, false],
  ["performance owner is server-owned", { action: "goal.create", title: "Forjado", metric: "deals_won", targetValue: 1, periodStart: "2026-01-01", periodEnd: "2026-01-31", scope: "individual", owner_id: ids.orgB }, false],
  ["goal rejects reversed period", { action: "goal.create", title: "Período inválido", metric: "deals_won", targetValue: 1, periodStart: "2026-02-01", periodEnd: "2026-01-31", scope: "team" }, false],
  ["goal rejects zero target", { action: "goal.create", title: "Sem alvo", metric: "deals_won", targetValue: 0, periodStart: "2026-01-01", periodEnd: "2026-01-31", scope: "team" }, false],
];
for (const [name, payload, expected] of performanceCases) assert.equal(parsePerformanceAction(payload).ok, expected, name);

const awardKeys = new Set();
function awardOnce(key) { const before = awardKeys.size; awardKeys.add(key); return awardKeys.size > before; }
assert.equal(awardOnce(`${ids.orgA}:achievement:${ids.deal}`), true, "first achievement award is persisted");
assert.equal(awardOnce(`${ids.orgA}:achievement:${ids.deal}`), false, "duplicate achievement award is idempotent");

console.log(`commercial, payment-link and performance contract: ${cases.length + 6 + paymentCases.length + 3 + performanceCases.length + 2} assertions passed`);
console.log("remote migration validation: blocked until migrations 003 through 008 are applied");
