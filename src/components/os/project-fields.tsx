'use client';

import React from 'react';
import type { SiteDocument, TemplateId, ThemeId } from '@/lib/os/types';
import { ProjectServicesFields, ProjectContactFields } from './project-fields-services';

interface ProjectFieldsProps {
  document: SiteDocument;
  onChange: (doc: SiteDocument) => void;
  disabled?: boolean;
}

export function ProjectFields({ document, onChange, disabled = false }: ProjectFieldsProps): React.JSX.Element {
  const updateField = <K extends keyof SiteDocument>(key: K, value: SiteDocument[K]) => {
    onChange({ ...document, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Template & Theme Selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="field-template" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Modelo / Template
          </label>
          <select
            id="field-template"
            value={document.templateId}
            disabled={disabled}
            onChange={(e) => updateField('templateId', e.target.value as TemplateId)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="consulting">Consultoria & Estratégia (Editorial)</option>
            <option value="local-services">Serviços Locais & Atendimento</option>
            <option value="commerce">Comércio & Ofertas de Produtos</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-theme" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Tema Visual
          </label>
          <select
            id="field-theme"
            value={document.themeId}
            disabled={disabled}
            onChange={(e) => updateField('themeId', e.target.value as ThemeId)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="cyan-dark">Cyan Dark (Alta Tecnologia)</option>
            <option value="warm-light">Warm Light (Editorial Prestígio)</option>
            <option value="forest-light">Forest Light (Orgânico & Bem-estar)</option>
          </select>
        </div>
      </div>

      {/* Main Copy Fields */}
      <div className="space-y-4">
        <div>
          <label htmlFor="field-business-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Nome do Negócio
          </label>
          <input
            id="field-business-name"
            type="text"
            value={document.businessName}
            disabled={disabled}
            maxLength={100}
            onChange={(e) => updateField('businessName', e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="field-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Título Principal (Hero)
          </label>
          <input
            id="field-title"
            type="text"
            value={document.title}
            disabled={disabled}
            maxLength={120}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="field-subtitle" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Subtítulo / Selo
          </label>
          <input
            id="field-subtitle"
            type="text"
            value={document.subtitle}
            disabled={disabled}
            maxLength={120}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="field-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Descrição do Valor
          </label>
          <textarea
            id="field-description"
            rows={3}
            value={document.description}
            disabled={disabled}
            maxLength={600}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <ProjectServicesFields
        services={document.services}
        onChange={(services) => updateField('services', services)}
        disabled={disabled}
      />

      <ProjectContactFields
        document={document}
        onChange={updateField}
        disabled={disabled}
      />
    </div>
  );
}
