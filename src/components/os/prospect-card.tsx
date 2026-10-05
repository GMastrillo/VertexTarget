'use client';

import React from 'react';
import Link from 'next/link';
import type { OsProspect, ProspectStatus } from '@/lib/os/types';

interface ProspectCardProps {
  prospect: OsProspect;
  onMove: (id: string, status: ProspectStatus) => void;
  onEdit: (prospect: OsProspect) => void;
  onDelete: (id: string) => void;
}

const STAGES: { id: ProspectStatus; label: string }[] = [
  { id: 'new', label: 'Novo' },
  { id: 'contacted', label: 'Contatado' },
  { id: 'proposal', label: 'Proposta' },
  { id: 'closed', label: 'Fechado' },
  { id: 'discarded', label: 'Descartado' },
];

export function ProspectCard({ prospect, onMove, onEdit, onDelete }: ProspectCardProps): React.JSX.Element {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground text-sm tracking-tight">{prospect.name}</h3>
        <select
          value={prospect.status}
          onChange={(e) => onMove(prospect.id, e.target.value as ProspectStatus)}
          aria-label={`Alterar estágio de ${prospect.name}`}
          className="rounded border border-input bg-card px-2 py-0.5 text-[11px] text-foreground focus:outline-none"
        >
          {STAGES.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
        {prospect.sector && <p>Setor: <span className="text-foreground">{prospect.sector}</span></p>}
        {prospect.city && <p>Cidade: <span className="text-foreground">{prospect.city}</span></p>}
        {prospect.phone && <p>Tel: <span className="text-foreground">{prospect.phone}</span></p>}
        {prospect.email && <p>E-mail: <span className="text-foreground">{prospect.email}</span></p>}
      </div>

      {prospect.notes && (
        <p className="mt-2 line-clamp-2 text-[11px] italic text-muted-foreground border-t border-border pt-1.5">
          &ldquo;{prospect.notes}&rdquo;
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs">
        <Link
          href={`/os/projetos/novo?name=${encodeURIComponent(prospect.name)}&sector=${encodeURIComponent(
            prospect.sector
          )}&city=${encodeURIComponent(prospect.city)}&phone=${encodeURIComponent(
            prospect.phone
          )}&email=${encodeURIComponent(prospect.email)}`}
          className="text-primary hover:underline font-medium"
        >
          Criar Site →
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(prospect)}
            className="text-muted-foreground hover:text-foreground"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(prospect.id)}
            className="text-destructive hover:text-destructive"
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
