export type CommercialCompany = { id: string; name: string; industry: string; email: string; phone: string; website: string };
export type CommercialContact = { id: string; companyId: string; companyName: string; name: string; email: string; phone: string; jobTitle: string };
export type CommercialStage = { id: string; name: string; position: number; probability: number };
export type CommercialPipeline = { id: string; name: string; stages: CommercialStage[] };
export type CommercialDeal = { id: string; title: string; amountCents: number; status: string; companyId: string; companyName: string; contactId: string | null; contactName: string; ownerId: string | null; pipelineId: string; stageId: string; stageName: string; expectedCloseDate: string | null };
export type CommercialTask = { id: string; title: string; status: "open" | "done"; priority: string; dueDate: string | null; companyName: string; dealTitle: string; assigneeId: string | null };
export type CommercialActivity = { id: string; type: string; body: string; createdAt: string; actorId: string | null; dealTitle: string; companyName: string };
export type CommercialSnapshot = { companies: CommercialCompany[]; contacts: CommercialContact[]; pipelines: CommercialPipeline[]; deals: CommercialDeal[]; tasks: CommercialTask[]; activities: CommercialActivity[] };
