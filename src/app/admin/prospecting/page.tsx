import { PageHeader } from "@/components/admin/AdminUI";
import { ProspectingClient } from "@/components/admin/ProspectingClient";
import { listProspects } from "@/lib/operations-repository";

export const dynamic = "force-dynamic";

export default async function ProspectingPage() {
  const prospects = await listProspects();
  return (
    <div>
      <PageHeader
        eyebrow="Growth / prospecção assistida por IA"
        title="Prospecção"
        description="A IA pesquisa empresas reais no Google (Maps, guias comerciais, redes sociais) que não têm site — oportunidades prontas para contato."
      />
      <ProspectingClient initialProspects={prospects} />
    </div>
  );
}
