import "server-only";

export function logError(message: string, detail?: string) {
  // Centralized server-side logging boundary; never include secrets or user payloads.
  process.stderr.write(`[vertex-target] ${message}${detail ? ` ${detail}` : ""}\n`);
}
