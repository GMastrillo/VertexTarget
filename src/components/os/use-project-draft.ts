'use client';

import { useReducer, useEffect, useCallback } from 'react';
import type { OsProject, SiteDocument } from '@/lib/os/types';
import {
  reduceDraft,
  initialDraftState,
  type DraftStatus,
} from '@/lib/os/editor-state';

export interface UseProjectDraftReturn {
  document: SiteDocument;
  persisted: SiteDocument;
  version: number;
  dirty: boolean;
  status: DraftStatus;
  errorMessage?: string;
  update: (doc: SiteDocument) => void;
  save: () => Promise<boolean>;
  acceptSuggestion: (doc: SiteDocument) => void;
}

export function useProjectDraft(project: OsProject): UseProjectDraftReturn {
  const [state, dispatch] = useReducer(
    reduceDraft,
    initialDraftState(project.document, project.version)
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.dirty]);

  const update = useCallback((doc: SiteDocument) => {
    dispatch({ type: 'EDIT', document: doc });
  }, []);

  const acceptSuggestion = useCallback((doc: SiteDocument) => {
    dispatch({ type: 'ACCEPT_SUGGESTION', suggestion: doc });
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    dispatch({ type: 'SAVE_START' });
    try {
      const res = await fetch('/api/os/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          expectedVersion: state.version,
          document: state.current,
        }),
      });

      const data = await res.json();
      if (res.status === 409) {
        dispatch({
          type: 'SAVE_CONFLICT',
          error: data.error || 'Conflito de versão. Recarregue para obter os dados mais recentes.',
        });
        return false;
      }

      if (!res.ok) {
        dispatch({
          type: 'SAVE_ERROR',
          error: data.error || 'Falha ao salvar rascunho.',
        });
        return false;
      }

      dispatch({
        type: 'SAVE_SUCCESS',
        savedDocument: data.project.document,
        newVersion: data.project.version,
      });
      return true;
    } catch {
      dispatch({
        type: 'SAVE_ERROR',
        error: 'Erro de rede ao salvar. Suas alterações foram mantidas localmente.',
      });
      return false;
    }
  }, [project.id, state.version, state.current]);

  return {
    document: state.current,
    persisted: state.persisted,
    version: state.version,
    dirty: state.dirty,
    status: state.status,
    errorMessage: state.errorMessage,
    update,
    save,
    acceptSuggestion,
  };
}
