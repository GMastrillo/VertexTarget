"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Project, ProjectStage } from "@/lib/admin-data";

const columns: ProjectStage[] = ["Backlog", "Design", "Desenvolvimento", "QA", "Entregue"];
const stageToApi: Record<ProjectStage, string> = { Backlog: "backlog", Design: "design", Desenvolvimento: "development", QA: "qa", Entregue: "delivered" };
const colors: Record<ProjectStage, string> = { Backlog: "bg-slate-400", Design: "bg-violet-400", Desenvolvimento: "bg-cyan-300", QA: "bg-orange-300", Entregue: "bg-emerald-400" };
const priorityTone: Record<string, string> = { Alta: "text-rose-300", Média: "text-orange-300", Baixa: "text-slate-500" };

export function ProjectsBoard({ initialProjects, clients }: { initialProjects: Project[]; clients: { id: string; name: string }[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState("Web");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, clientId: clientId || null, type, priority, dueDate: dueDate || null, stage: "backlog" }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) { setError(json?.error ?? "Falha ao criar projeto."); return; }
      // Attach the chosen client name optimistically (API returns "Sem cliente").
      const project = { ...json.project, client: clients.find((c) => c.id === clientId)?.name ?? json.project.client };
      setProjects((prev) => [project, ...prev]);
      setOpen(false);
      setTitle("");
      setClientId("");
      setType("Web");
      setPriority("medium");
      setDueDate("");
    } finally {
      setSaving(false);
    }
  }

  async function move(id: string, stage: ProjectStage) {
    const previous = projects;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, stage } : p)));
    const res = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage: stageToApi[stage] }),
    });
    if (!res.ok) setProjects(previous); // rollback on failure
  }

  async function remove(id: string) {
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    const res = await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) setProjects(previous);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{projects.length} projetos no pipeline</p>
        <button onClick={() => setOpen((v) => !v)} className="admin-primary-btn"><Plus size={15} /> Novo projeto</button>
      </div>
      {open && (
        <form onSubmit={createProject} className="mt-4 grid gap-3 rounded-xl border border-white/[.08] bg-white/[.02] p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs text-slate-400 sm:col-span-2">Título
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Landing Page + Agendamento" className="admin-input mt-1" />
          </label>
          <label className="text-xs text-slate-400">Cliente
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="admin-input mt-1">
              <option value="">Sem cliente</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-xs text-slate-400">Tipo
            <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Next.js / IA" className="admin-input mt-1" />
          </label>
          <label className="text-xs text-slate-400">Prazo
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="admin-input mt-1" />
          </label>
          <label className="text-xs text-slate-400">Prioridade
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="admin-input mt-1">
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </label>
          {error && <p className="text-xs text-rose-300 sm:col-span-2 lg:col-span-5">{error}</p>}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
            <button disabled={saving} className="admin-primary-btn">{saving ? "Criando..." : "Criar projeto"}</button>
            <button type="button" onClick={() => setOpen(false)} className="admin-secondary-btn">Cancelar</button>
          </div>
        </form>
      )}
      <div className="kanban-grid mt-6">
        {columns.map((column) => (
          <section key={column} className="kanban-column">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className={`h-2 w-2 rounded-full ${colors[column]}`} />
                <h2 className="text-sm font-medium">{column}</h2>
                <span className="rounded-md bg-white/[.07] px-1.5 py-0.5 text-[10px] text-slate-400">{projects.filter((p) => p.stage === column).length}</span>
              </div>
            </div>
            <div className="space-y-3">
              {projects.filter((p) => p.stage === column).map((project) => (
                <article key={project.id} className="kanban-card">
                  <div className="mb-3 flex justify-between gap-2">
                    <span className="rounded-md border border-white/[.08] px-2 py-1 text-[10px] text-slate-400">{project.type}</span>
                    <span className={`text-[10px] ${priorityTone[project.priority] ?? "text-slate-500"}`}>{project.priority}</span>
                  </div>
                  <h3 className="text-sm font-medium leading-5">{project.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{project.client}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[.06] pt-3">
                    <span className="text-[10px] text-slate-500">Prazo {project.due}</span>
                    <select
                      aria-label="Mover projeto de etapa"
                      value={project.stage}
                      onChange={(e) => move(project.id, e.target.value as ProjectStage)}
                      className="rounded-md border border-white/[.08] bg-[#0a0a1a] px-1.5 py-1 text-[10px] text-slate-300"
                    >
                      {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => remove(project.id)} aria-label="Remover projeto" className="admin-icon-btn"><Trash2 size={13} className="text-rose-300/70" /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
