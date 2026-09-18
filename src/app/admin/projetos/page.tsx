import { PageHeader } from "@/components/admin/AdminUI";
import { ProjectsBoard } from "@/components/admin/ProjectsBoard";
import { getClients, getProjects } from "@/lib/admin-repository";

export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  const [projects, clients] = await Promise.all([getProjects(), getClients()]);
  return (
    <div>
      <PageHeader
        eyebrow="Operations / delivery pipeline"
        title="Projetos"
        description="Do primeiro briefing ao deploy: crie projetos, mova entre etapas e acompanhe o fluxo de entrega da equipe."
      />
      <ProjectsBoard initialProjects={projects} clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
