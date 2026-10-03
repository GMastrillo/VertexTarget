import type { SiteDocument } from './types.ts';

export type DraftStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';

export interface DraftState {
  current: SiteDocument;
  persisted: SiteDocument;
  version: number;
  dirty: boolean;
  status: DraftStatus;
  errorMessage?: string;
}

export type DraftEvent =
  | { type: 'EDIT'; document: SiteDocument }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; savedDocument: SiteDocument; newVersion: number }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'SAVE_CONFLICT'; error: string }
  | { type: 'ACCEPT_SUGGESTION'; suggestion: SiteDocument };

export function initialDraftState(document: SiteDocument, version: number): DraftState {
  return {
    current: document,
    persisted: document,
    version,
    dirty: false,
    status: 'idle',
  };
}

function documentsEqual(a: SiteDocument, b: SiteDocument): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function reduceDraft(state: DraftState, event: DraftEvent): DraftState {
  switch (event.type) {
    case 'EDIT':
      return {
        ...state,
        current: event.document,
        dirty: !documentsEqual(event.document, state.persisted),
        status: state.status === 'saving' ? 'saving' : 'idle',
        errorMessage: undefined,
      };

    case 'SAVE_START':
      return {
        ...state,
        status: 'saving',
        errorMessage: undefined,
      };

    case 'SAVE_SUCCESS':
      return {
        ...state,
        persisted: event.savedDocument,
        version: event.newVersion,
        dirty: !documentsEqual(state.current, event.savedDocument),
        status: 'saved',
        errorMessage: undefined,
      };

    case 'SAVE_ERROR':
      return {
        ...state,
        status: 'error',
        errorMessage: event.error,
      };

    case 'SAVE_CONFLICT':
      return {
        ...state,
        status: 'conflict',
        errorMessage: event.error,
      };

    case 'ACCEPT_SUGGESTION':
      return {
        ...state,
        current: event.suggestion,
        dirty: !documentsEqual(event.suggestion, state.persisted),
        status: 'idle',
        errorMessage: undefined,
      };
  }
}
