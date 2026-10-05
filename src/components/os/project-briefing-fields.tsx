import { Button } from '@/components/ui/button';
import type { TemplateId, SiteService } from '@/lib/os/types';

export function TemplateSelector({
  templateId,
  onChange,
}: {
  templateId: TemplateId;
  onChange: (t: TemplateId) => void;
}) {
  const templates: Array<{ id: TemplateId; label: string; desc: string }> = [
    {
      id: 'consulting',
      label: 'Consultoria & Serviços Corporativos',
      desc: 'Foco em autoridade, apresentação metodológica e proposta comercial.',
    },
    {
      id: 'local-services',
      label: 'Atendimento & Serviços Locais',
      desc: 'Ideal para negócios presenciais, clínicas, estúdios e especialistas.',
    },
    {
      id: 'commerce',
      label: 'Comércio & Produtos',
      desc: 'Destaque visual para catálogo, destaques e contato direto via WhatsApp.',
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Template Visual
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onChange(tpl.id)}
            className={`text-left rounded-xl border p-3.5 transition-colors ${
              templateId === tpl.id
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <p className="text-xs font-semibold mb-1">{tpl.label}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{tpl.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ServicesEditor({
  services,
  onChange,
}: {
  services: SiteService[];
  onChange: (s: SiteService[]) => void;
}) {
  function updateService(index: number, field: 'title' | 'description', value: string) {
    const updated = [...services];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      onChange(updated);
    }
  }

  function addService() {
    if (services.length < 6) {
      onChange([...services, { title: '', description: '' }]);
    }
  }

  function removeService(index: number) {
    if (services.length > 1) {
      onChange(services.filter((_, i) => i !== index));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Serviços ou Destaques ({services.length}/6)
        </label>
        {services.length < 6 && (
          <button
            type="button"
            onClick={addService}
            className="text-xs text-primary hover:underline"
          >
            + Adicionar serviço
          </button>
        )}
      </div>

      <div className="space-y-3">
        {services.map((svc, i) => (
          <div key={i} className="flex gap-3 items-start rounded-xl border border-border bg-muted p-3">
            <span className="text-xs text-muted-foreground font-mono mt-2">{i + 1}.</span>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                required
                maxLength={80}
                placeholder="Título do serviço (ex.: Consultoria Tributária)"
                value={svc.title}
                onChange={(e) => updateService(i, 'title', e.target.value)}
                className="w-full rounded-lg border border-input bg-muted px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <textarea
                rows={2}
                maxLength={240}
                placeholder="Descrição resumida do serviço ou benefício..."
                value={svc.description}
                onChange={(e) => updateService(i, 'description', e.target.value)}
                className="w-full rounded-lg border border-input bg-muted px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
              />
            </div>
            {services.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeService(i)}
                className="text-muted-foreground hover:text-destructive h-8 px-2 text-xs"
              >
                &times;
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BriefingBasicFields({
  businessName,
  setBusinessName,
  sector,
  setSector,
  city,
  setCity,
  email,
  setEmail,
  whatsapp,
  setWhatsapp,
  objective,
  setObjective,
}: {
  businessName: string;
  setBusinessName: (v: string) => void;
  sector: string;
  setSector: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
  objective: string;
  setObjective: (v: string) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Nome do Negócio</label>
          <input
            type="text"
            required
            maxLength={120}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="Ex.: Studio Lumina"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Setor de Atuação</label>
          <input
            type="text"
            required
            maxLength={120}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="Ex.: Odontologia Estética"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Cidade / Região</label>
          <input
            type="text"
            required
            maxLength={120}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="Ex.: Curitiba, PR"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">E-mail de Contato</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="contato@negocio.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">WhatsApp Comercial</label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            placeholder="(41) 99999-8888"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Objetivo Principal do Site</label>
        <textarea
          rows={2}
          maxLength={280}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
          placeholder="Ex.: Apresentar diferenciais de atendimento e captar novos pacientes residenciais..."
        />
      </div>
    </>
  );
}

