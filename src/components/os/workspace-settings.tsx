'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { OsWorkspace, UsageSummary } from '@/lib/os/types';
import { WorkspaceDeleteModal } from './workspace-delete-modal';

interface WorkspaceSettingsProps {
  workspace: OsWorkspace;
  usage: UsageSummary;
  prospectsCount: number;
}

export function WorkspaceSettings({
  workspace,
  usage,
  prospectsCount,
}: WorkspaceSettingsProps): React.JSX.Element {
  const router = useRouter();
  const [name, setName] = useState(workspace.name);
  const [journey, setJourney] = useState(workspace.journey);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/os/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, journey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao atualizar workspace');
      setSaveMessage('Workspace atualizado com sucesso.');
    } catch (err: unknown) {
      setSaveMessage(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (password: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/os/workspace', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao excluir workspace');
      router.push('/os/entrar');
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Erro na reautenticação');
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Workspace</h1>
        <p className="text-xs text-slate-400 mt-1">Gerencie seu perfil, limites de uso e preferências de conta.</p>
      </div>

      <section className="rounded-2xl border border-white/[.08] bg-[#0a0a1a] p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Perfil do Workspace</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="ws-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Nome do Workspace
            </label>
            <input
              id="ws-name"
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label htmlFor="ws-journey" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Jornada Principal
            </label>
            <select
              id="ws-journey"
              value={journey}
              onChange={(e) => setJourney(e.target.value as 'business' | 'professional')}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white"
            >
              <option value="business">Empresa Própria (Quero meu site profissional)</option>
              <option value="professional">Prestador / Agência (Quero criar sites para clientes)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Plano: <span className="font-semibold text-cyan-400 uppercase">Gratuito (Free)</span>
            </span>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
          {saveMessage && <p className="text-xs text-cyan-400">{saveMessage}</p>}
        </form>
      </section>

      <section className="rounded-2xl border border-white/[.08] bg-[#0a0a1a] p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Consumo & Quotas Mensais</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs text-slate-400">Copywriting com IA</span>
            <p className="mt-1 text-xl font-bold text-white">
              {usage.copy.used} / {usage.copy.limit}
            </p>
            <span className="text-[10px] text-slate-500">Renovação mensal UTC</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs text-slate-400">Busca Grounded</span>
            <p className="mt-1 text-xl font-bold text-white">
              {usage.search.used} / {usage.search.limit}
            </p>
            <span className="text-[10px] text-slate-500">10 sugestões por busca</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-xs text-slate-400">Prospects Salvos</span>
            <p className="mt-1 text-xl font-bold text-white">{prospectsCount} / 50</p>
            <span className="text-[10px] text-slate-500">Limite total do plano</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-rose-900/30 bg-rose-950/10 p-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-400">Zona de Perigo</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Excluir o workspace remove permanentemente seus projetos, publicações e prospects.
        </p>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="rounded-lg border border-rose-500/40 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
        >
          Excluir Workspace
        </button>
      </section>

      <WorkspaceDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        deleting={deleting}
        error={deleteError}
      />
    </div>
  );
}
