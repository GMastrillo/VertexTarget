export type InboxStatus = "open" | "pending" | "resolved";
export type InboxPriority = "low" | "normal" | "high" | "urgent";
export type InboxMessage = { id: string; body: string; messageType: "message" | "internal_note"; authorId: string | null; createdAt: string };
export type InboxConversation = { id: string; subject: string; status: InboxStatus; priority: InboxPriority; companyName: string; contactName: string; assigneeId: string | null; lastMessageAt: string; messages: InboxMessage[] };
export type SupportTicket = { id: string; title: string; status: InboxStatus; priority: InboxPriority; conversationId: string | null; assigneeId: string | null; slaDueAt: string | null; createdAt: string };
export type InboxSnapshot = { conversations: InboxConversation[]; tickets: SupportTicket[] };
