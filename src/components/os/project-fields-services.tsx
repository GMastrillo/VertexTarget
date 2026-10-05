'use client';

import React from 'react';
import type { SiteDocument, SiteService } from '@/lib/os/types';

interface ServicesProps {
  services: SiteService[];
  onChange: (services: SiteService[]) => void;
  disabled?: boolean;
}

export function ProjectServicesFields({ services, onChange, disabled = false }: ServicesProps): React.JSX.Element {
  const updateService = (index: number, key: keyof SiteService, val: string) => {
    const nextServices = [...services];
    nextServices[index] = { ...nextServices[index], [key]: val };
    onChange(nextServices);
  };

  const addService = () => {
    if (services.length >= 6) return;
    onChange([
      ...services,
      { title: `Novo Serviço ${services.length + 1}`, description: 'Descrição da solução oferecida.' },
    ]);
  };

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Serviços / Ofertas ({services.length}/6)
        </label>
        {services.length < 6 && (
          <button
            type="button"
            disabled={disabled}
            onClick={addService}
            className="rounded bg-muted px-2.5 py-1 text-xs font-medium text-primary hover:bg-muted"
          >
            + Adicionar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Serviço 0{index + 1}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeService(index)}
                className="text-xs text-destructive hover:underline"
              >
                Remover
              </button>
            </div>
            <input
              type="text"
              placeholder="Título do serviço"
              value={service.title}
              disabled={disabled}
              maxLength={60}
              onChange={(e) => updateService(index, 'title', e.target.value)}
              className="w-full rounded border border-input bg-card px-2.5 py-1.5 text-xs text-foreground"
            />
            <textarea
              rows={2}
              placeholder="Descrição resumida do serviço"
              value={service.description}
              disabled={disabled}
              maxLength={200}
              onChange={(e) => updateService(index, 'description', e.target.value)}
              className="w-full rounded border border-input bg-card px-2.5 py-1.5 text-xs text-foreground"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface ContactProps {
  document: SiteDocument;
  onChange: <K extends keyof SiteDocument>(key: K, value: SiteDocument[K]) => void;
  disabled?: boolean;
}

export function ProjectContactFields({ document, onChange, disabled = false }: ContactProps): React.JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border">
      <div>
        <label htmlFor="field-cta" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Texto do Botão (CTA)
        </label>
        <input
          id="field-cta"
          type="text"
          value={document.ctaLabel}
          disabled={disabled}
          maxLength={40}
          onChange={(e) => onChange('ctaLabel', e.target.value)}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
        />
      </div>
      <div>
        <label htmlFor="field-city" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Cidade / Região
        </label>
        <input
          id="field-city"
          type="text"
          value={document.city}
          disabled={disabled}
          maxLength={60}
          onChange={(e) => onChange('city', e.target.value)}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
        />
      </div>
      <div>
        <label htmlFor="field-whatsapp" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          WhatsApp para Contato
        </label>
        <input
          id="field-whatsapp"
          type="tel"
          value={document.whatsapp}
          disabled={disabled}
          onChange={(e) => onChange('whatsapp', e.target.value)}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
        />
      </div>
      <div>
        <label htmlFor="field-email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          E-mail
        </label>
        <input
          id="field-email"
          type="email"
          value={document.email}
          disabled={disabled}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
        />
      </div>
    </div>
  );
}
