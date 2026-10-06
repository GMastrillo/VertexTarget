'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Journey } from '@/lib/os/types';
import type { Locale } from '@/lib/i18n/types';

interface JourneySelectorProps {
  journey: Journey;
  onSelect: (journey: Journey) => void;
}

function JourneySelector({ journey, onSelect }: JourneySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Perfil de Uso
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
            journey === 'business'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-muted text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onSelect('business')}
        >
          Líder / Empresa
        </button>
        <button
          type="button"
          className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
            journey === 'professional'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-muted text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onSelect('professional')}
        >
          Profissional / Agência
        </button>
      </div>
    </div>
  );
}

interface RegionFieldsProps {
  locale: Locale;
  country: string;
  onLocaleChange: (locale: Locale) => void;
  onCountryChange: (country: string) => void;
}

function RegionFields({ locale, country, onLocaleChange, onCountryChange }: RegionFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-1">
      <div>
        <label htmlFor="ws-onboarding-locale" className="block text-xs font-medium text-foreground mb-1">
          Idioma
        </label>
        <select
          id="ws-onboarding-locale"
          value={locale}
          onChange={(e) => onLocaleChange(e.target.value as Locale)}
          className="w-full rounded-lg border border-input bg-muted px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="pt-BR">Português (BR)</option>
          <option value="en">English (US)</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </div>

      <div>
        <label htmlFor="ws-onboarding-country" className="block text-xs font-medium text-foreground mb-1">
          País
        </label>
        <select
          id="ws-onboarding-country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value.toUpperCase())}
          className="w-full rounded-lg border border-input bg-muted px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="BR">Brasil</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="PT">Portugal</option>
          <option value="ES">España</option>
          <option value="FR">France</option>
          <option value="DE">Deutschland</option>
          <option value="IT">Italia</option>
          <option value="MX">México</option>
        </select>
      </div>
    </div>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [journey, setJourney] = useState<Journey>('business');
  const [locale, setLocale] = useState<Locale>('pt-BR');
  const [country, setCountry] = useState('BR');
  const timeZone = 'UTC';
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
          regionalPreferences: {
            locale,
            country,
            timeZone,
          },
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
    <div className="max-w-md mx-auto my-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
      <div className="space-y-2 mb-6 text-center">
        <h2 className="text-xl font-semibold text-foreground">Bem-vindo à Vertex OS</h2>
        <p className="text-xs text-muted-foreground">
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
          <label htmlFor="ws-name" className="text-xs font-medium text-foreground">
            Nome do seu Workspace ou Negócio
          </label>
          <input
            id="ws-name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="Ex.: Studio Arquitetura Vertex"
          />
        </div>

        <JourneySelector journey={journey} onSelect={setJourney} />
        <RegionFields
          locale={locale}
          country={country}
          onLocaleChange={setLocale}
          onCountryChange={setCountry}
        />

        <div className="flex items-start gap-2.5 pt-2">
          <input
            id="ws-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-input bg-muted text-primary focus:ring-ring"
          />
          <label htmlFor="ws-terms" className="text-xs text-muted-foreground leading-relaxed">
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
