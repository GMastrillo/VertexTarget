'use client';

import React, { useState } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  deleting: boolean;
  error: string | null;
}

export function WorkspaceDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
  error,
}: DeleteModalProps): React.JSX.Element | null {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    await onConfirm(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">Confirmar Exclusão</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Esta ação é irreversível. Para sua segurança, digite sua senha atual para reautenticar.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            required
            placeholder="Sua senha atual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-rose-500"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={deleting || !password}
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
            >
              {deleting ? 'Excluindo...' : 'Confirmar e Excluir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
