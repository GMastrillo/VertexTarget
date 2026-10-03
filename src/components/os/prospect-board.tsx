'use client';

import React, { useState } from 'react';
import type { OsProspect, ProspectInput, ProspectStatus, SearchSuggestion, UsageSummary } from '@/lib/os/types';
import { ProspectForm } from './prospect-form';
import { SearchProspectsPanel } from './search-results';
import { ProspectColumns } from './prospect-columns';

interface ProspectBoardProps {
  initialProspects: OsProspect[];
  usage: UsageSummary;
}

export function ProspectBoard({ initialProspects, usage }: ProspectBoardProps): React.JSX.Element {
  const [prospects, setProspects] = useState<OsProspect[]>(initialProspects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<OsProspect | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (data: ProspectInput) => {
    setLoading(true);
    setError(null);
    try {
      if (editingProspect) {
        const res = await fetch('/api/os/prospects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProspect.id, data }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Falha ao atualizar');
        setProspects((prev) =>
          prev.map((p) => (p.id === editingProspect.id ? resData.prospect : p))
        );
      } else {
        const res = await fetch('/api/os/prospects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || 'Falha ao cadastrar');
        setProspects((prev) => [resData.prospect, ...prev]);
      }
      setModalOpen(false);
      setEditingProspect(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro na operação');
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromSearch = async (s: SearchSuggestion) => {
    await handleSave({
      name: s.name,
      sector: s.sector,
      city: s.city,
      website: s.website,
      email: '',
      phone: s.phone,
      notes: s.hypothesis,
    });
  };

  const handleMove = async (id: string, status: ProspectStatus) => {
    const previous = [...prospects];
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    try {
      const res = await fetch('/api/os/prospects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) setProspects(previous);
    } catch {
      setProspects(previous);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este prospect?')) return;
    try {
      const res = await fetch('/api/os/prospects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setProspects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Falha ao excluir prospect.');
    }
  };

  return (
    <div className="space-y-8">
      <SearchProspectsPanel
        onImport={handleImportFromSearch}
        usedCount={usage.search.used}
        limitCount={usage.search.limit}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.08] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pipeline de Prospects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize e converta clientes locais em contratos de desenvolvimento web.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400">
            {prospects.length} / 50 cadastrados
          </span>
          <button
            type="button"
            disabled={prospects.length >= 50}
            onClick={() => {
              setEditingProspect(null);
              setModalOpen(true);
            }}
            className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50 transition-all"
          >
            + Novo Prospect
          </button>
        </div>
      </div>

      <ProspectColumns
        prospects={prospects}
        onMove={handleMove}
        onEdit={(target) => {
          setEditingProspect(target);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ProspectForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingProspect}
        loading={loading}
        error={error}
      />
    </div>
  );
}
