import test from 'node:test';
import assert from 'node:assert/strict';

import { reduceDraft, initialDraftState } from '../../src/lib/os/editor-state.ts';
import { validDocument } from './os-fixtures.mjs';

test('initialDraftState initializes with clean state and dirty=false', () => {
  const state = initialDraftState(validDocument, 1);
  assert.equal(state.dirty, false);
  assert.equal(state.status, 'idle');
  assert.equal(state.version, 1);
  assert.deepEqual(state.current, validDocument);
  assert.deepEqual(state.persisted, validDocument);
});

test('EDIT event updates current and marks state as dirty', () => {
  const initial = initialDraftState(validDocument, 1);
  const updatedDoc = { ...validDocument, title: 'Novo Título Editado' };

  const state = reduceDraft(initial, { type: 'EDIT', document: updatedDoc });

  assert.equal(state.dirty, true);
  assert.equal(state.current.title, 'Novo Título Editado');
  assert.equal(state.persisted.title, validDocument.title);
});

test('SAVE_START transitions status to saving without losing uncommitted changes', () => {
  const initial = initialDraftState(validDocument, 1);
  const edited = reduceDraft(initial, {
    type: 'EDIT',
    document: { ...validDocument, title: 'Em Edição' },
  });

  const saving = reduceDraft(edited, { type: 'SAVE_START' });

  assert.equal(saving.status, 'saving');
  assert.equal(saving.dirty, true);
  assert.equal(saving.current.title, 'Em Edição');
});

test('SAVE_SUCCESS without intermediate edits marks dirty=false and updates version', () => {
  const initial = initialDraftState(validDocument, 1);
  const editedDoc = { ...validDocument, title: 'Commit V1' };
  const edited = reduceDraft(initial, { type: 'EDIT', document: editedDoc });
  const saving = reduceDraft(edited, { type: 'SAVE_START' });

  const saved = reduceDraft(saving, {
    type: 'SAVE_SUCCESS',
    savedDocument: editedDoc,
    newVersion: 2,
  });

  assert.equal(saved.status, 'saved');
  assert.equal(saved.dirty, false);
  assert.equal(saved.version, 2);
  assert.deepEqual(saved.persisted, editedDoc);
});

test('User editing during save keeps dirty=true when previous save succeeds', () => {
  const initial = initialDraftState(validDocument, 1);
  const v1Doc = { ...validDocument, title: 'Primeira Edição' };
  const state1 = reduceDraft(initial, { type: 'EDIT', document: v1Doc });
  const saving = reduceDraft(state1, { type: 'SAVE_START' });

  // User types more while save is in flight:
  const v2Doc = { ...validDocument, title: 'Segunda Edição Durante Save' };
  const duringSave = reduceDraft(saving, { type: 'EDIT', document: v2Doc });
  assert.equal(duringSave.status, 'saving');

  // Server confirms v1Doc save:
  const resolved = reduceDraft(duringSave, {
    type: 'SAVE_SUCCESS',
    savedDocument: v1Doc,
    newVersion: 2,
  });

  // Current must keep the new text, and dirty must remain true
  assert.equal(resolved.current.title, 'Segunda Edição Durante Save');
  assert.equal(resolved.dirty, true, 'new unpersisted edit must preserve dirty flag');
  assert.equal(resolved.version, 2);
});

test('SAVE_ERROR preserves current text and dirty flag with error message', () => {
  const initial = initialDraftState(validDocument, 1);
  const edited = reduceDraft(initial, {
    type: 'EDIT',
    document: { ...validDocument, title: 'Tentativa que Falhou' },
  });
  const saving = reduceDraft(edited, { type: 'SAVE_START' });

  const failed = reduceDraft(saving, {
    type: 'SAVE_ERROR',
    error: 'Falha de conexão',
  });

  assert.equal(failed.status, 'error');
  assert.equal(failed.dirty, true);
  assert.equal(failed.current.title, 'Tentativa que Falhou');
  assert.equal(failed.errorMessage, 'Falha de conexão');
});

test('SAVE_CONFLICT sets status conflict and prevents overwriting server state', () => {
  const initial = initialDraftState(validDocument, 1);
  const edited = reduceDraft(initial, {
    type: 'EDIT',
    document: { ...validDocument, title: 'Edição Conflitante' },
  });
  const saving = reduceDraft(edited, { type: 'SAVE_START' });

  const conflict = reduceDraft(saving, {
    type: 'SAVE_CONFLICT',
    error: 'O projeto foi modificado por outra sessão.',
  });

  assert.equal(conflict.status, 'conflict');
  assert.equal(conflict.dirty, true);
  assert.equal(conflict.current.title, 'Edição Conflitante');
});

test('ACCEPT_SUGGESTION updates current document and sets status to idle', () => {
  const initial = initialDraftState(validDocument, 1);
  const suggestion = { ...validDocument, title: 'Sugestão da IA Aceita' };

  const state = reduceDraft(initial, { type: 'ACCEPT_SUGGESTION', suggestion });

  assert.equal(state.current.title, 'Sugestão da IA Aceita');
  assert.equal(state.dirty, true);
  assert.equal(state.status, 'idle');
});
