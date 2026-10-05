'use client';

import React, { useState } from 'react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  publishing: boolean;
  error: string | null;
}

export function PublishModal({
  isOpen,
  onClose,
  onConfirm,
  publishing,
  error,
}: PublishModalProps): React.JSX.Element | null {
  const [contentAccepted, setContentAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-foreground">Publicar Site</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Seu site será disponibilizado publicamente com URL única. Você pode atualizar ou despublicar a qualquer
          momento.
        </p>

        <label className="mt-4 flex items-start gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={contentAccepted}
            onChange={(e) => setContentAccepted(e.target.checked)}
            className="mt-0.5 rounded border-input bg-card text-primary"
          />
          <span>Confirmo que as informações do site são verídicas e não violam os termos de uso.</span>
        </label>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-xs text-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!contentAccepted || publishing}
            onClick={onConfirm}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary disabled:opacity-50"
          >
            {publishing ? 'Publicando...' : 'Confirmar Publicação'}
          </button>
        </div>
      </div>
    </div>
  );
}
