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
  const [locale, setLocale] = useState(workspace.regionalPreferences?.locale || 'pt-BR');
  const [country, setCountry] = useState(workspace.regionalPreferences?.country || 'BR');
  const [timeZone, setTimeZone] = useState(workspace.regionalPreferences?.timeZone || 'UTC');
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
        body: JSON.stringify({
          name,
          journey,
          regionalPreferences: {
            locale,
            country,
            timeZone,
          },
        }),
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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Configurações do Workspace</h1>
        <p className="text-xs text-muted-foreground mt-1">Gerencie seu perfil, limites de uso e preferências de conta.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Perfil do Workspace</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="ws-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Nome do Workspace
            </label>
            <input
              id="ws-name"
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label htmlFor="ws-journey" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Jornada Principal
            </label>
            <select
              id="ws-journey"
              value={journey}
              onChange={(e) => setJourney(e.target.value as 'business' | 'professional')}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value="business">Empresa Própria (Quero meu site profissional)</option>
              <option value="professional">Prestador / Agência (Quero criar sites para clientes)</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div>
              <label htmlFor="ws-locale" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Idioma
              </label>
              <select
                id="ws-locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value as typeof locale)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
              </select>
            </div>

            <div>
              <label htmlFor="ws-country" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                País
              </label>
              <select
                id="ws-country"
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="BR">Brasil (BR)</option>
                <option value="US">United States (US)</option>
                <option value="CA">Canada (CA)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="PT">Portugal (PT)</option>
                <option value="ES">España (ES)</option>
                <option value="FR">France (FR)</option>
                <option value="DE">Deutschland (DE)</option>
                <option value="IT">Italia (IT)</option>
                <option value="MX">México (MX)</option>
                <option value="AR">Argentina (AR)</option>
                <option value="CL">Chile (CL)</option>
                <option value="CO">Colombia (CO)</option>
                <option value="UY">Uruguay (UY)</option>
                <option value="CH">Schweiz / Suisse (CH)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ws-tz" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Fuso Horário
              </label>
              <select
                id="ws-tz"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="UTC">UTC (Universal)</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo (BRT)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                <option value="Europe/Lisbon">Europe/Lisbon (WET/WEST)</option>
                <option value="Europe/Rome">Europe/Rome (CET/CEST)</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Quotas e limites mensais renovam em UTC; as datas e horas da interface seguem o fuso horário configurado.
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Plano: <span className="font-semibold text-primary uppercase">Gratuito (Free)</span>
            </span>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
          {saveMessage && <p className="text-xs text-primary">{saveMessage}</p>}
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Consumo & Quotas Mensais</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Copywriting com IA</span>
            <p className="mt-1 text-xl font-bold text-foreground">
              {usage.copy.used} / {usage.copy.limit}
            </p>
            <span className="text-[10px] text-muted-foreground">Renovação mensal UTC</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Busca Grounded</span>
            <p className="mt-1 text-xl font-bold text-foreground">
              {usage.search.used} / {usage.search.limit}
            </p>
            <span className="text-[10px] text-muted-foreground">10 sugestões por busca</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">Prospects Salvos</span>
            <p className="mt-1 text-xl font-bold text-foreground">{prospectsCount} / 50</p>
            <span className="text-[10px] text-muted-foreground">Limite total do plano</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-destructive">Zona de Perigo</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Excluir o workspace remove permanentemente seus projetos, publicações e prospects.
        </p>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="rounded-lg border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
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
