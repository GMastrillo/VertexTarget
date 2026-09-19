import "server-only";

export type WhatsAppProvider = "official" | "unofficial";
export type WhatsAppConfig = { provider: WhatsAppProvider; configured: boolean; reason?: string };
export type WhatsAppHealth = { connected: boolean; phoneNumber?: string; externalId?: string; detail?: string };

type Adapter = { config: WhatsAppConfig; health: (externalId: string) => Promise<WhatsAppHealth>; send: (externalId: string, recipient: string, body: string) => Promise<{ providerMessageId: string }> };

function env(name: string) { return process.env[name]?.trim() || ""; }
function jsonHeaders(token: string) { return { "content-type": "application/json", authorization: `Bearer ${token}` }; }

const official: Adapter = {
  config: { provider: "official", configured: Boolean(env("WHATSAPP_META_ACCESS_TOKEN") && env("WHATSAPP_META_PHONE_NUMBER_ID")), reason: "Defina WHATSAPP_META_ACCESS_TOKEN e WHATSAPP_META_PHONE_NUMBER_ID." },
  async health(externalId) {
    const token = env("WHATSAPP_META_ACCESS_TOKEN");
    if (!token) return { connected: false, externalId, detail: "API oficial não configurada." };
    const response = await fetch(`https://graph.facebook.com/v20.0/${encodeURIComponent(externalId)}?fields=display_phone_number,verified_name`, { headers: jsonHeaders(token), cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { connected: false, externalId, detail: "Meta recusou a consulta da linha." };
    return { connected: true, externalId, phoneNumber: data.display_phone_number, detail: data.verified_name };
  },
  async send(externalId, recipient, body) {
    const token = env("WHATSAPP_META_ACCESS_TOKEN");
    if (!token) throw new Error("API oficial não configurada.");
    const response = await fetch(`https://graph.facebook.com/v20.0/${encodeURIComponent(externalId)}/messages`, { method: "POST", headers: jsonHeaders(token), body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: recipient, type: "text", text: { preview_url: false, body } }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error("Meta recusou o envio da mensagem.");
    return { providerMessageId: String(data.messages?.[0]?.id ?? "") };
  },
};

const unofficial: Adapter = {
  config: { provider: "unofficial", configured: Boolean(env("WHATSAPP_UNOFFICIAL_BASE_URL") && env("WHATSAPP_UNOFFICIAL_API_KEY")), reason: "Defina WHATSAPP_UNOFFICIAL_BASE_URL e WHATSAPP_UNOFFICIAL_API_KEY." },
  async health(externalId) {
    const base = env("WHATSAPP_UNOFFICIAL_BASE_URL");
    const key = env("WHATSAPP_UNOFFICIAL_API_KEY");
    if (!base || !key) return { connected: false, externalId, detail: "Adapter não oficial não configurado." };
    const response = await fetch(`${base.replace(/\/$/, "")}/instances/${encodeURIComponent(externalId)}/health`, { headers: { authorization: `Bearer ${key}` }, cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    return { connected: response.ok && data.connected === true, externalId, phoneNumber: data.phoneNumber, detail: response.ok ? data.detail : "Provider não oficial indisponível." };
  },
  async send(externalId, recipient, body) {
    const base = env("WHATSAPP_UNOFFICIAL_BASE_URL");
    const key = env("WHATSAPP_UNOFFICIAL_API_KEY");
    if (!base || !key) throw new Error("Adapter não oficial não configurado.");
    const response = await fetch(`${base.replace(/\/$/, "")}/instances/${encodeURIComponent(externalId)}/messages`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` }, body: JSON.stringify({ to: recipient, body }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error("Provider não oficial recusou o envio.");
    return { providerMessageId: String(data.id ?? data.messageId ?? "") };
  },
};

export function getWhatsAppAdapter(provider: WhatsAppProvider): Adapter { return provider === "official" ? official : unofficial; }
export function getWhatsAppConfigurations(): WhatsAppConfig[] { return [official.config, unofficial.config]; }
