export type PerformanceMetric = "revenue_cents" | "deals_won" | "tasks_completed" | "messages_sent";
export type PerformanceStatus = "active" | "completed" | "archived";
export type PerformanceProgress = { metric: PerformanceMetric; value: number; target: number; percentage: number };
export type PerformanceGoal = { id: string; ownerId: string | null; title: string; metric: PerformanceMetric; targetValue: number; currentValue: number; periodStart: string; periodEnd: string; status: PerformanceStatus; progress: PerformanceProgress };
export type PerformanceChallenge = { id: string; title: string; metric: PerformanceMetric; targetValue: number; currentValue: number; periodStart: string; periodEnd: string; status: PerformanceStatus; progress: PerformanceProgress };
export type PerformanceAchievement = { id: string; title: string; description: string; metric: PerformanceMetric; targetValue: number; awardedToCurrentUser: boolean; currentValue: number };
export type PerformanceRanking = { userId: string; name: string; score: number; dealsWon: number; tasksCompleted: number };
export type PerformanceSnapshot = { goals: PerformanceGoal[]; challenges: PerformanceChallenge[]; achievements: PerformanceAchievement[]; ranking: PerformanceRanking[]; hasRealEvents: boolean };
