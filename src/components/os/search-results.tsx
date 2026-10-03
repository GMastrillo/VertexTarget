'use client';

import React, { useState } from 'react';
import type { SearchResult, SearchSuggestion } from '@/lib/os/types';

interface SearchProspectsPanelProps {
  onImport: (suggestion: SearchSuggestion) => Promise<void>;
  usedCount: number;
  limitCount: number;
}

export function SearchProspectsPanel({
  onImport,
  usedCount,
  limitCount,
}: SearchProspectsPanelProps): React.JSX.Element {
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importingIndex, setImportingIndex] = useState<number | null>(null);
  const [importedIndices, setImportedIndices] = useState<Set<number>>(new Set());

  const canSearch = usedCount < limitCount;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch('/api/os/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          sector,
          city,
          key: crypto.randomUUID(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha na busca.');
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro na pesquisa');
    } finally {
      setSearching(false);
    }
  };

  const handleImport = async (suggestion: SearchSuggestion, index: number) => {
    setImportingIndex(index);
    try {
      await onImport(suggestion);
      setImportedIndices((prev) => new Set(prev).add(index));
    } finally {
      setImportingIndex(null);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[.08] bg-[#0a0a1a] p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.08] pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Busca Inteligente de Prospects</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pesquisa em tempo real com fontes verificadas pelo Google Search.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Cota Mensal: <span className="text-cyan-400 font-bold">{usedCount} / {limitCount}</span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          required
          placeholder="Setor (ex: Odontologia, Padarias)"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
        />
        <input
          type="text"
          required
          placeholder="Cidade / Estado (ex: Santos - SP)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
        />
        <button
          type="submit"
          disabled={searching || !canSearch || !sector.trim() || !city.trim()}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
        >
          {searching ? 'Pesquisando...' : 'Buscar Oportunidades'}
        </button>
      </form>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      {result && result.suggestions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/[.08]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {result.suggestions.length} Oportunidades Encontradas
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.suggestions.map((s, idx) => {
              const isImported = importedIndices.has(idx);
              return (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-white">{s.name}</h4>
                    <button
                      type="button"
                      disabled={isImported || importingIndex === idx}
                      onClick={() => handleImport(s, idx)}
                      className="rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-cyan-400 hover:bg-slate-700 disabled:opacity-50"
                    >
                      {isImported ? 'Importado ✓' : importingIndex === idx ? 'Salvando...' : '+ Importar'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">{s.hypothesis}</p>
                  {s.sources && s.sources.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                      <span className="font-medium">Fonte: </span>
                      <a
                        href={s.sources[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        {s.sources[0].title || 'Verificar na web ↗'}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
