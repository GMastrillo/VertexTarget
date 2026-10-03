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
      <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
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
                ? 'border-cyan-400 bg-cyan-500/10 text-white'
                : 'border-white/[.08] bg-white/[.02] text-slate-400 hover:text-white hover:bg-white/[.04]'
            }`}
          >
            <p className="text-xs font-semibold mb-1">{tpl.label}</p>
            <p className="text-[11px] text-slate-400 leading-snug">{tpl.desc}</p>
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
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Serviços ou Destaques ({services.length}/6)
        </label>
        {services.length < 6 && (
          <button
            type="button"
            onClick={addService}
            className="text-xs text-cyan-400 hover:underline"
          >
            + Adicionar serviço
          </button>
        )}
      </div>

      <div className="space-y-3">
        {services.map((svc, i) => (
          <div key={i} className="flex gap-3 items-start rounded-xl border border-white/[.08] bg-white/[.02] p-3">
            <span className="text-xs text-slate-500 font-mono mt-2">{i + 1}.</span>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                required
                maxLength={80}
                placeholder="Título do serviço (ex.: Consultoria Tributária)"
                value={svc.title}
                onChange={(e) => updateService(i, 'title', e.target.value)}
                className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
              <textarea
                rows={2}
                maxLength={240}
                placeholder="Descrição resumida do serviço ou benefício..."
                value={svc.description}
                onChange={(e) => updateService(i, 'description', e.target.value)}
                className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>
            {services.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeService(i)}
                className="text-slate-500 hover:text-rose-400 h-8 px-2 text-xs"
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
