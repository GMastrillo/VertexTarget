'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TemplateSelector, ServicesEditor, BriefingBasicFields } from './project-briefing-fields';
import type { TemplateId, SiteService } from '@/lib/os/types';

interface ProjectBriefingProps {
  prospectId?: string;
  initialBusinessName?: string;
  initialSector?: string;
  initialCity?: string;
}

export function ProjectBriefingForm({
  prospectId,
  initialBusinessName = '',
  initialSector = '',
  initialCity = '',
}: ProjectBriefingProps) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [sector, setSector] = useState(initialSector);
  const [city, setCity] = useState(initialCity);
  const [objective, setObjective] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [templateId, setTemplateId] = useState<TemplateId>('consulting');
  const [services, setServices] = useState<SiteService[]>([
    { title: 'Serviço Principal', description: 'Atendimento e execução de alta precisão.' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBusinessName) return;
    try {
      const raw = sessionStorage.getItem('vertex_sandbox_draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.businessName && typeof draft.businessName === 'string') {
          setBusinessName(draft.businessName);
        }
        if (draft.sector && typeof draft.sector === 'string') {
          setSector(draft.sector);
        }
        if (draft.city && typeof draft.city === 'string') {
          setCity(draft.city);
        }
        if (draft.templateId && ['services', 'commerce', 'consulting'].includes(draft.templateId)) {
          setTemplateId(draft.templateId as TemplateId);
        }
        if (Array.isArray(draft.services) && draft.services.length > 0) {
          setServices(draft.services);
        }
      }
    } catch {
      // sessionStorage indisponível ou formato inválido
    }
  }, [initialBusinessName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/os/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefing: {
            businessName: businessName.trim(),
            sector: sector.trim(),
            city: city.trim(),
            objective: objective.trim(),
            description: `${businessName} em ${city} especializada em ${sector}.`,
            services,
            email: email.trim(),
            whatsapp: whatsapp.trim(),
            templateId,
          },
          prospectId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao criar projeto.');
      }

      router.push(`/os/projetos/${data.project.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao submeter briefing.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
          {error}
        </div>
      )}

      <BriefingBasicFields
        businessName={businessName}
        setBusinessName={setBusinessName}
        sector={sector}
        setSector={setSector}
        city={city}
        setCity={setCity}
        email={email}
        setEmail={setEmail}
        whatsapp={whatsapp}
        setWhatsapp={setWhatsapp}
        objective={objective}
        setObjective={setObjective}
      />

      <TemplateSelector templateId={templateId} onChange={setTemplateId} />

      <ServicesEditor services={services} onChange={setServices} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Criando Projeto...' : 'Salvar e Abrir Editor'}
      </Button>
    </form>
  );
}
