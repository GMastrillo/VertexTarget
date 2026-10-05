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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-foreground">Confirmar Exclusão</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Esta ação é irreversível. Para sua segurança, digite sua senha atual para reautenticar.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            required
            placeholder="Sua senha atual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-destructive"
          />
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
              disabled={deleting || !password}
              className="rounded-lg bg-destructive px-4 py-2 text-xs font-bold text-foreground hover:bg-destructive disabled:opacity-50"
            >
              {deleting ? 'Excluindo...' : 'Confirmar e Excluir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
