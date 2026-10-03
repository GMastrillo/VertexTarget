'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TemplateSelector, ServicesEditor } from './project-briefing-fields';
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Nome do Negócio</label>
          <input
            type="text"
            required
            maxLength={120}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            placeholder="Ex.: Studio Lumina"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Setor de Atuação</label>
          <input
            type="text"
            required
            maxLength={120}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            placeholder="Ex.: Odontologia Estética"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Cidade / Região</label>
          <input
            type="text"
            required
            maxLength={120}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            placeholder="Ex.: Curitiba, PR"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">E-mail de Contato</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            placeholder="contato@negocio.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">WhatsApp Comercial</label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            placeholder="(41) 99999-8888"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300">Objetivo Principal do Site</label>
        <textarea
          rows={2}
          maxLength={280}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
          placeholder="Ex.: Apresentar diferenciais de atendimento e captar novos pacientes residenciais..."
        />
      </div>

      <TemplateSelector templateId={templateId} onChange={setTemplateId} />

      <ServicesEditor services={services} onChange={setServices} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Criando Projeto...' : 'Salvar e Abrir Editor'}
      </Button>
    </form>
  );
}
