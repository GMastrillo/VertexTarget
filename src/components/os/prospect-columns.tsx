'use client';

import React from 'react';
import type { OsProspect, ProspectStatus } from '@/lib/os/types';
import { ProspectCard } from './prospect-card';

const COLUMNS: { id: ProspectStatus; title: string }[] = [
  { id: 'new', title: 'Novos' },
  { id: 'contacted', title: 'Contatados' },
  { id: 'proposal', title: 'Proposta Enviada' },
  { id: 'closed', title: 'Fechados / Ganhos' },
  { id: 'discarded', title: 'Descartados' },
];

interface ProspectColumnsProps {
  prospects: OsProspect[];
  onMove: (id: string, status: ProspectStatus) => void;
  onEdit: (prospect: OsProspect) => void;
  onDelete: (id: string) => void;
}

export function ProspectColumns({
  prospects,
  onMove,
  onEdit,
  onDelete,
}: ProspectColumnsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {COLUMNS.map((col) => {
        const columnProspects = prospects.filter((p) => p.status === col.id);
        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl border border-white/[.08] bg-[#0a0a1a] p-3 min-h-[420px]"
          >
            <div className="flex items-center justify-between border-b border-white/[.08] pb-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {col.title}
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                {columnProspects.length}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {columnProspects.map((p) => (
                <ProspectCard
                  key={p.id}
                  prospect={p}
                  onMove={onMove}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
