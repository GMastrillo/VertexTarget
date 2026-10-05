'use client';

import { useState } from 'react';
import type { InterestRecord } from '@/lib/interests/types';

interface InterestsTableProps {
  initialInterests: InterestRecord[];
}

export function InterestsTable({ initialInterests }: InterestsTableProps) {
  const [interests] = useState<InterestRecord[]>(initialInterests);
  const [filter, setFilter] = useState<'all' | 'business' | 'professional'>('all');

  const filtered = interests.filter((item) => {
    if (filter === 'all') return true;
    return item.journey === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Filtrar por jornada:</span>
          <div className="flex rounded-lg border border-border bg-muted p-1">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos ({interests.length})
            </button>
            <button
              onClick={() => setFilter('business')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === 'business' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Empresas
            </button>
            <button
              onClick={() => setFilter('professional')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === 'professional' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Profissionais
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm text-foreground" aria-label="Lista de manifestações de interesse">
          <thead className="border-b border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Data</th>
              <th scope="col" className="px-4 py-3 font-medium">Nome / Contato</th>
              <th scope="col" className="px-4 py-3 font-medium">Jornada</th>
              <th scope="col" className="px-4 py-3 font-medium">Interesse</th>
              <th scope="col" className="px-4 py-3 font-medium">Mensagem</th>
              <th scope="col" className="px-4 py-3 font-medium">Origem</th>
              <th scope="col" className="px-4 py-3 font-medium">Consentimento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhuma manifestação de interesse encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const dateStr = new Date(item.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={item.id} className="hover:bg-muted">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{dateStr}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                      <p className="text-xs text-primary">{item.whatsapp}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        item.journey === 'business'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {item.journey === 'business' ? 'Empresa' : 'Profissional'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      <span className="capitalize">{item.interest}</span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-xs text-foreground">
                      {item.message ? (
                        <p className="truncate" title={item.message}>{item.message}</p>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {item.source}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {item.marketingConsent ? (
                        <span className="text-success">Sim ({item.noticeVersion})</span>
                      ) : (
                        <span className="text-muted-foreground">Não</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
