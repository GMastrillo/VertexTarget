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
          <span className="text-xs uppercase tracking-wider text-slate-400">Filtrar por jornada:</span>
          <div className="flex rounded-lg border border-white/[.08] bg-white/[.02] p-1">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({interests.length})
            </button>
            <button
              onClick={() => setFilter('business')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === 'business' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Empresas
            </button>
            <button
              onClick={() => setFilter('professional')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filter === 'professional' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Profissionais
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[.08] bg-[#0a0a1a]">
        <table className="w-full text-left text-sm text-slate-300" aria-label="Lista de manifestações de interesse">
          <thead className="border-b border-white/[.08] bg-white/[.02] text-xs uppercase tracking-wider text-slate-400">
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
          <tbody className="divide-y divide-white/[.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
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
                  <tr key={item.id} className="hover:bg-white/[.02]">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{dateStr}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.email}</p>
                      <p className="text-xs text-cyan-400">{item.whatsapp}</p>
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
                    <td className="max-w-xs px-4 py-3 text-xs text-slate-300">
                      {item.message ? (
                        <p className="truncate" title={item.message}>{item.message}</p>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                      {item.source}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                      {item.marketingConsent ? (
                        <span className="text-emerald-400">Sim ({item.noticeVersion})</span>
                      ) : (
                        <span className="text-slate-500">Não</span>
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
