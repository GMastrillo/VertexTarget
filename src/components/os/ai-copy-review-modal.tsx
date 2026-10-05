'use client';

import React from 'react';
import type { SiteDocument } from '@/lib/os/types';

interface AiCopyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (doc: SiteDocument) => void;
  suggestion: SiteDocument | null;
}

export function AiCopyReviewModal({
  isOpen,
  onClose,
  onAccept,
  suggestion,
}: AiCopyReviewModalProps): React.JSX.Element | null {
  if (!isOpen || !suggestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[85vh] flex flex-col">
        <h2 className="text-lg font-bold text-foreground">Revisar Sugestão da IA</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A IA gerou a seguinte proposta de copy. Você pode aceitar para aplicar ao seu rascunho ou descartar.
        </p>

        <div className="mt-4 flex-1 overflow-y-auto space-y-4 rounded-xl border border-border bg-card p-4 text-xs">
          <div>
            <span className="font-semibold text-primary">Título: </span>
            <span className="text-foreground font-medium">{suggestion.title}</span>
          </div>
          <div>
            <span className="font-semibold text-primary">Subtítulo: </span>
            <span className="text-foreground">{suggestion.subtitle}</span>
          </div>
          <div>
            <span className="font-semibold text-primary">Descrição: </span>
            <p className="mt-1 text-foreground leading-relaxed">{suggestion.description}</p>
          </div>
          <div>
            <span className="font-semibold text-primary">Chamada para Ação (CTA): </span>
            <span className="text-foreground">{suggestion.ctaLabel}</span>
          </div>
          {suggestion.services && suggestion.services.length > 0 && (
            <div>
              <span className="font-semibold text-primary">Serviços Propostos:</span>
              <ul className="mt-2 space-y-2">
                {suggestion.services.map((s, idx) => (
                  <li key={idx} className="rounded border border-border bg-card p-2.5">
                    <strong className="text-foreground">{s.title}: </strong>
                    <span className="text-foreground">{s.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-xs text-foreground hover:bg-muted"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={() => {
              onAccept(suggestion);
              onClose();
            }}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary"
          >
            Aceitar e Aplicar ao Rascunho
          </button>
        </div>
      </div>
    </div>
  );
}
