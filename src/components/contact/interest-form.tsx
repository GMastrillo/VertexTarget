'use client';

import { useState, useId, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { HcaptchaWidget } from './hcaptcha-widget';
import {
  JourneySelector,
  InterestTopicSelector,
  InterestContactInputs,
  InterestSuccessState,
} from './interest-form-fields';
import type { Journey } from '@/lib/os/types';

interface InterestFormProps {
  initialJourney?: Journey;
  initialInterest?: 'solutions' | 'education' | 'community';
  source?: 'home-contact' | 'education' | 'community' | 'platform';
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
}

export function InterestForm({
  initialJourney = 'business',
  initialInterest = 'solutions',
  source = 'home-contact',
}: InterestFormProps) {
  const formId = useId();
  const [journey, setJourney] = useState<Journey>(initialJourney);
  const [interest, setInterest] = useState<'solutions' | 'education' | 'community'>(initialInterest);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [idempotencyKey, setIdempotencyKey] = useState(generateUuid);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCaptchaToken = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/interesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          journey,
          interest,
          message,
          marketingConsent,
          noticeVersion: '2026-10-02',
          source,
          idempotencyKey,
          honeypot,
          captchaToken: captchaToken || 'dev-token',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar manifestação de interesse.');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setWhatsapp('');
      setMessage('');
      setMarketingConsent(false);
      setIdempotencyKey(generateUuid());
      setResetKey((prev) => prev + 1);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao processar solicitação.');
      setResetKey((prev) => prev + 1);
    }
  }

  if (status === 'success') {
    return <InterestSuccessState onReset={() => setStatus('idle')} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-hp`}>Não preencha este campo</label>
        <input
          id={`${formId}-hp`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <JourneySelector journey={journey} setJourney={setJourney} />
      <InterestTopicSelector formId={formId} interest={interest} setInterest={setInterest} />
      <InterestContactInputs
        formId={formId}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        whatsapp={whatsapp}
        setWhatsapp={setWhatsapp}
      />

      <div className="space-y-1.5">
        <label htmlFor={`${formId}-message`} className="text-xs font-medium text-foreground">
          Mensagem ou Contexto do Projeto (opcional)
        </label>
        <textarea
          id={`${formId}-message`}
          rows={3}
          maxLength={1200}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-border bg-card/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          placeholder="Compartilhe os principais desafios ou objetivos..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={`${formId}-consent`}
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor={`${formId}-consent`} className="text-xs text-muted-foreground leading-relaxed">
          Aceito receber novidades e comunicações estratégicas da VertexTarget conforme nossa{' '}
          <a href="/privacidade" className="underline hover:text-foreground" target="_blank" rel="noreferrer">
            Política de Privacidade
          </a>.
        </label>
      </div>

      <HcaptchaWidget onToken={handleCaptchaToken} resetKey={resetKey} />

      {status === 'error' && errorMessage && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
          {errorMessage}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Enviando...' : 'Registrar Interesse'}
      </Button>
    </form>
  );
}
