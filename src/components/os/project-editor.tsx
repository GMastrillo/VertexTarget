'use client';

import React, { useState } from 'react';
import type { OsProject, PublishedSite, SiteDocument, UsageSummary } from '@/lib/os/types';
import { useProjectDraft } from './use-project-draft';
import { ProjectFields } from './project-fields';
import { ProjectPreview } from './project-preview';
import { ProjectEditorHeader } from './project-editor-header';
import { PublishModal } from './publish-modal';
import { AiCopyReviewModal } from './ai-copy-review-modal';

interface ProjectEditorProps {
  project: OsProject;
  usage: UsageSummary;
  publication: PublishedSite | null;
}

export function ProjectEditor({
  project,
  usage,
  publication: initialPublication,
}: ProjectEditorProps): React.JSX.Element {
  const draft = useProjectDraft(project);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [publication, setPublication] = useState<PublishedSite | null>(initialPublication);
  const [publishing, setPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // AI Copy State
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<SiteDocument | null>(null);
  const [aiUsed, setAiUsed] = useState(usage.copy.used);

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      if (draft.dirty) {
        const saved = await draft.save();
        if (!saved) {
          setPublishError('Salve as alterações pendentes antes de publicar.');
          setPublishing(false);
          return;
        }
      }

      const res = await fetch('/api/os/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          expectedVersion: draft.version,
          contentAccepted: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || 'Falha ao publicar site.');
      } else {
        setPublication(data.publication);
        setPublishModalOpen(false);
      }
    } catch {
      setPublishError('Erro de conexão ao tentar publicar.');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm('Deseja realmente despublicar seu site?')) return;
    try {
      const res = await fetch('/api/os/publications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      });
      if (res.ok) {
        setPublication(null);
      }
    } catch {
      alert('Falha ao despublicar site.');
    }
  };

  const handleGenerateAiCopy = async () => {
    if (draft.dirty) {
      alert('Salve as alterações pendentes antes de gerar copy com IA.');
      return;
    }
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/os/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'copy',
          projectId: project.id,
          expectedVersion: draft.version,
          key: crypto.randomUUID(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao gerar copy.');
      setAiSuggestion(data.document);
      setAiModalOpen(true);
      setAiUsed((prev) => prev + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao gerar copy.');
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ProjectEditorHeader
        businessName={draft.document.businessName}
        version={draft.version}
        dirty={draft.dirty}
        status={draft.status}
        activeTab={activeTab}
        publication={publication}
        generatingAi={generatingAi}
        aiUsed={aiUsed}
        aiLimit={usage.copy.limit}
        onSelectTab={setActiveTab}
        onSave={() => void draft.save()}
        onOpenPublish={() => setPublishModalOpen(true)}
        onUnpublish={() => void handleUnpublish()}
        onGenerateAiCopy={() => void handleGenerateAiCopy()}
      />

      {draft.status === 'conflict' && (
        <div className="border-b border-warning/30 bg-warning/10 px-6 py-2.5 text-xs text-warning">
          <strong>Atenção:</strong> {draft.errorMessage} Salve novamente ou recarregue a página para sincronizar.
        </div>
      )}
      {draft.status === 'error' && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-6 py-2.5 text-xs text-destructive">
          <strong>Erro:</strong> {draft.errorMessage}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {activeTab === 'editor' ? (
          <div className="mx-auto max-w-3xl p-6 md:p-8">
            <ProjectFields document={draft.document} onChange={draft.update} disabled={draft.status === 'saving'} />
          </div>
        ) : (
          <ProjectPreview document={draft.document} />
        )}
      </div>

      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handlePublish}
        publishing={publishing}
        error={publishError}
      />

      <AiCopyReviewModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onAccept={draft.acceptSuggestion}
        suggestion={aiSuggestion}
      />
    </div>
  );
}
