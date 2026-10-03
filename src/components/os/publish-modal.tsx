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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">Publicar Site</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Seu site será disponibilizado publicamente com URL única. Você pode atualizar ou despublicar a qualquer
          momento.
        </p>

        <label className="mt-4 flex items-start gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={contentAccepted}
            onChange={(e) => setContentAccepted(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500"
          />
          <span>Confirmo que as informações do site são verídicas e não violam os termos de uso.</span>
        </label>

        {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!contentAccepted || publishing}
            onClick={onConfirm}
            className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
          >
            {publishing ? 'Publicando...' : 'Confirmar Publicação'}
          </button>
        </div>
      </div>
    </div>
  );
}
