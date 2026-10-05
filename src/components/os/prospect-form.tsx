'use client';

import React, { useState } from 'react';
import type { OsProspect, ProspectInput } from '@/lib/os/types';

interface ProspectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProspectInput) => Promise<void>;
  initialData?: OsProspect | null;
  loading: boolean;
  error: string | null;
}

function getInitialForm(data?: OsProspect | null): ProspectInput {
  if (!data) {
    return { name: '', sector: '', city: '', website: '', email: '', phone: '', notes: '' };
  }
  return {
    name: data.name,
    sector: data.sector,
    city: data.city,
    website: data.website,
    email: data.email,
    phone: data.phone,
    notes: data.notes,
  };
}

export function ProspectForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  error,
}: ProspectFormProps): React.JSX.Element | null {
  const [form, setForm] = useState<ProspectInput>(() => getInitialForm(initialData));

  if (!isOpen) return null;

  const update = (key: keyof ProspectInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-foreground">
          {initialData ? 'Editar Prospect' : 'Adicionar Novo Prospect'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="prospect-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Nome da Empresa / Cliente *
            </label>
            <input
              id="prospect-name"
              type="text"
              required
              maxLength={120}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="prospect-sector" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Setor / Ramo
              </label>
              <input
                id="prospect-sector"
                type="text"
                maxLength={80}
                value={form.sector}
                onChange={(e) => update('sector', e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label htmlFor="prospect-city" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Cidade
              </label>
              <input
                id="prospect-city"
                type="text"
                maxLength={80}
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="prospect-phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Telefone / WhatsApp
              </label>
              <input
                id="prospect-phone"
                type="tel"
                placeholder="+55 11 99999-9999 ou +1 202-555-0123"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label htmlFor="prospect-email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                E-mail
              </label>
              <input
                id="prospect-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prospect-website" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Website Atual (se houver)
            </label>
            <input
              id="prospect-website"
              type="url"
              placeholder="https://exemplo.com.br"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
          </div>

          <div>
            <label htmlFor="prospect-notes" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Anotações Internas Privadas
            </label>
            <textarea
              id="prospect-notes"
              rows={2}
              maxLength={2000}
              placeholder="Observações sobre reunião, dor principal ou proposta..."
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Prospect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
