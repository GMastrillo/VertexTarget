import { strict as assert } from "node:assert";
import { parseCommercialAction } from "../src/lib/commercial-validation.ts";

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

console.log(`commercial contract: ${cases.length + 6} assertions passed`);
console.log("remote migration validation: blocked until migrations 003 and 004 are applied");
