'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Journey } from '@/lib/os/types';

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [journey, setJourney] = useState<Journey>('business');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!termsAccepted) {
      setError('É necessário aceitar os termos para prosseguir.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/os/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Meu Workspace',
          journey,
          termsAccepted: true,
          noticeVersion: '2026-10-02',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao criar workspace.');
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao inicializar workspace.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 rounded-2xl border border-white/[.08] bg-[#0a0a1a] p-6 sm:p-8 shadow-2xl">
      <div className="space-y-2 mb-6 text-center">
        <h2 className="text-xl font-semibold text-white">Bem-vindo à Vertex OS</h2>
        <p className="text-xs text-slate-400">
          Configure seu workspace gratuito para começar a criar seu site e gerenciar oportunidades.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="ws-name" className="text-xs font-medium text-slate-300">
            Nome do seu Workspace ou Negócio
          </label>
          <input
            id="ws-name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            placeholder="Ex.: Studio Arquitetura Vertex"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Perfil de Uso
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                journey === 'business'
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/[.1] bg-white/[.02] text-slate-400 hover:text-white'
              }`}
              onClick={() => setJourney('business')}
            >
              Líder / Empresa
            </button>
            <button
              type="button"
              className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                journey === 'professional'
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/[.1] bg-white/[.02] text-slate-400 hover:text-white'
              }`}
              onClick={() => setJourney('professional')}
            >
              Profissional / Agência
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-2">
          <input
            id="ws-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/[.2] bg-white/[.04] text-cyan-400 focus:ring-cyan-400"
          />
          <label htmlFor="ws-terms" className="text-xs text-slate-400 leading-relaxed">
            Concordo com as diretrizes e limites gratuitos da Vertex OS (1 projeto, 1 site publicado, quotas mensais de IA).
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Inicializando...' : 'Criar Meu Workspace'}
        </Button>
      </form>
    </div>
  );
}
