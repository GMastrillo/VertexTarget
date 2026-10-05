import { Button } from '@/components/ui/button';
import type { Journey } from '@/lib/os/types';

export function JourneySelector({
  journey,
  setJourney,
}: {
  journey: Journey;
  setJourney: (j: Journey) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Sua Jornada
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            journey === 'business'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card/40 text-muted-foreground hover:bg-card/70'
          }`}
          onClick={() => setJourney('business')}
        >
          Líder / Empresa
        </button>
        <button
          type="button"
          className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            journey === 'professional'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card/40 text-muted-foreground hover:bg-card/70'
          }`}
          onClick={() => setJourney('professional')}
        >
          Profissional / Agência
        </button>
      </div>
    </div>
  );
}

export function InterestTopicSelector({
  formId,
  interest,
  setInterest,
}: {
  formId: string;
  interest: 'solutions' | 'education' | 'community';
  setInterest: (v: 'solutions' | 'education' | 'community') => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={`${formId}-interest`} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Área de Interesse
      </label>
      <select
        id={`${formId}-interest`}
        value={interest}
        onChange={(e) => setInterest(e.target.value as 'solutions' | 'education' | 'community')}
        className="w-full rounded-lg border border-input bg-card/40 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
      >
        <option value="solutions">Vertex Solutions (Projetos Customizados e Plataforma)</option>
        <option value="education">Vertex Education (Formação e Metodologias)</option>
        <option value="community">Vertex Community (Rede de Especialistas)</option>
      </select>
    </div>
  );
}

export function InterestContactInputs({
  formId,
  name,
  setName,
  email,
  setEmail,
  whatsapp,
  setWhatsapp,
}: {
  formId: string;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor={`${formId}-name`} className="text-xs font-medium text-foreground">
            Nome Completo
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-card/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${formId}-email`} className="text-xs font-medium text-foreground">
            E-mail Corporativo ou Pessoal
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-card/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            placeholder="voce@empresa.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${formId}-whatsapp`} className="text-xs font-medium text-foreground">
          WhatsApp com DDD ou Internacional (+país)
        </label>
        <input
          id={`${formId}-whatsapp`}
          type="tel"
          required
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-lg border border-input bg-card/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          placeholder="(11) 98765-4321 ou +1 202-555-0123"
        />
      </div>
    </>
  );
}

export function InterestSuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center" role="status">
      <h3 className="text-xl font-semibold text-foreground mb-2">Interesse registrado com sucesso!</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Nossa equipe analisará sua solicitação e entrará em contato pelo canal informado.
      </p>
      <Button variant="outline" onClick={onReset}>
        Enviar outra manifestação
      </Button>
    </div>
  );
}
