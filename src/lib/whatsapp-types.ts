export type WhatsAppProvider = "official" | "unofficial";
export type WhatsAppInstance = { id: string; provider: WhatsAppProvider; name: string; phoneNumber: string; externalId: string; status: string; lastError: string; lastSeenAt: string | null };
