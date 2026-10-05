import type { Journey } from "./types.ts";
import type { RegionalPreferences } from "../region/types.ts";
import { parseRegionalPreferences } from "../region/validation.ts";

export interface WorkspaceInput {
  name: string;
  journey: Journey;
  regionalPreferences?: RegionalPreferences;
  noticeVersion?: string;
  termsAccepted?: true;
}

export type WorkspaceInputErrorCode =
  | "name"
  | "journey"
  | "terms"
  | "region"
  | "extra_keys"
  | "invalid_input";

export type WorkspaceInputParseResult =
  | { ok: true; value: WorkspaceInput }
  | { ok: false; code: WorkspaceInputErrorCode };

const ALLOWED_CREATE_KEYS = new Set([
  "name",
  "journey",
  "termsAccepted",
  "noticeVersion",
  "regionalPreferences",
]);

const ALLOWED_UPDATE_KEYS = new Set([
  "name",
  "journey",
  "regionalPreferences",
]);

function hasOnlyValidKeys(record: Record<string, unknown>, mode: "create" | "update"): boolean {
  const allowedKeys = mode === "create" ? ALLOWED_CREATE_KEYS : ALLOWED_UPDATE_KEYS;
  for (const key of Object.keys(record)) {
    if (!allowedKeys.has(key)) {
      return false;
    }
  }
  return true;
}

function parseRegionField(record: Record<string, unknown>): { ok: true; value?: RegionalPreferences } | { ok: false; code: "region" } {
  if (!("regionalPreferences" in record) || record.regionalPreferences === undefined) {
    return { ok: true };
  }
  const regResult = parseRegionalPreferences(record.regionalPreferences);
  if (!regResult.ok) {
    return { ok: false, code: "region" };
  }
  return { ok: true, value: regResult.value };
}

function validateCreateTerms(record: Record<string, unknown>): boolean {
  if (record.termsAccepted !== true) {
    return false;
  }
  return typeof record.noticeVersion === "string" && record.noticeVersion.trim().length > 0;
}

function validateIdentity(record: Record<string, unknown>): { ok: true; name: string; journey: Journey } | { ok: false; code: "name" | "journey" } {
  if (typeof record.name !== "string" || record.name.trim().length < 2 || record.name.trim().length > 100) {
    return { ok: false, code: "name" };
  }
  if (record.journey !== "business" && record.journey !== "professional") {
    return { ok: false, code: "journey" };
  }
  return { ok: true, name: record.name.trim(), journey: record.journey as Journey };
}

export function parseWorkspaceInput(
  input: unknown,
  mode: "create" | "update",
): WorkspaceInputParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, code: "invalid_input" };
  }

  const record = input as Record<string, unknown>;

  if (!hasOnlyValidKeys(record, mode)) {
    return { ok: false, code: "extra_keys" };
  }

  const identity = validateIdentity(record);
  if (!identity.ok) {
    return identity;
  }

  if (mode === "create" && !validateCreateTerms(record)) {
    return { ok: false, code: "terms" };
  }

  const regionParsed = parseRegionField(record);
  if (!regionParsed.ok) {
    return regionParsed;
  }

  const output: WorkspaceInput = {
    name: (record.name as string).trim(),
    journey: record.journey as Journey,
    ...(regionParsed.value ? { regionalPreferences: regionParsed.value } : {}),
    ...(mode === "create"
      ? {
          termsAccepted: true as const,
          noticeVersion: (record.noticeVersion as string).trim(),
        }
      : {}),
  };

  return { ok: true, value: output };
}
