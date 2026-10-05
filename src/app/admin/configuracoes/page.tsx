import { CheckCircle2, KeyRound, ShieldCheck, XCircle } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/admin/AdminUI";
import { getAuthenticatedTeamUser, type TeamRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase-config";
import { getStripeClient } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const ROLE_DESCRIPTION: Record<TeamRole, string> = {
  owner: "Acesso total: financeiro, CRM, prospecção, projetos, IA e configurações.",
  finance: "Financeiro completo e vendas manuais; leitura no restante.",
  sales: "CRM e criação de clientes; leitura no restante.",
  operations: "Projetos e entrega; leitura no restante.",
  ai_lab: "Prospecção IA e logs do AI Lab.",
};

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
      <span className="text-sm text-foreground">{label}</span>
      {ok ? <span className="flex items-center gap-2 text-xs text-success"><CheckCircle2 size={14} /> Conectado</span> : <span className="flex items-center gap-2 text-xs text-warning"><XCircle size={14} /> Não configurado</span>}
    </div>
  );
}

export default async function ConfiguracoesPage() {
  const user = await getAuthenticatedTeamUser();
  const integrations = [
    { label: "Supabase (banco de dados e autenticação)", ok: isSupabaseConfigured() },
    { label: "Stripe (pagamentos)", ok: Boolean(getStripeClient()) },
    { label: "Google Gemini (IA e prospecção)", ok: Boolean(process.env.GOOGLE_GEMINI_API_KEY) },
  ];

  return (
    <div>
      <PageHeader eyebrow="Sistema / conta e integrações" title="Configurações" description="Sua conta, permissões da equipe e status das integrações conectadas." />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="admin-card">
          <SectionTitle title="Sua conta" />
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
              <div><p className="text-sm text-foreground">Nome</p><p className="mt-0.5 font-medium">{user?.name}</p></div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
              <div><p className="text-sm text-foreground">E-mail</p><p className="mt-0.5 font-medium">{user?.email}</p></div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
              <div><p className="text-sm text-foreground">Papel na equipe</p><p className="mt-0.5 font-medium capitalize">{user?.role}</p></div>
              <ShieldCheck size={18} className="text-success" />
            </div>
            <p className="px-1 text-xs leading-5 text-muted-foreground"><KeyRound size={12} className="mr-1 inline" />A senha é gerenciada pelo login seguro (Supabase Auth). Para trocá-la, utilize &quot;Esqueceu minha senha&quot; na tela de login.</p>
          </div>
        </div>
        <div className="admin-card">
          <SectionTitle title="Integrações" meta="Variáveis de ambiente" />
          <div className="space-y-3">
            {integrations.map((item) => <StatusDot key={item.label} {...item} />)}
          </div>
        </div>
        <div className="admin-card xl:col-span-2">
          <SectionTitle title="Papéis da equipe" meta="Definem o que cada membro acessa" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(ROLE_DESCRIPTION) as TeamRole[]).map((role) => (
              <div key={role} className="rounded-xl border border-border bg-muted p-4">
                <p className="text-sm font-medium capitalize text-primary">{role}</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{ROLE_DESCRIPTION[role]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
