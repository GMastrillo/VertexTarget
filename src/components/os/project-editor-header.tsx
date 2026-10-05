'use client';

import React from 'react';
import Link from 'next/link';
import type { PublishedSite } from '@/lib/os/types';
import type { DraftStatus } from '@/lib/os/editor-state';

interface HeaderProps {
  businessName: string;
  version: number;
  dirty: boolean;
  status: DraftStatus;
  activeTab: 'editor' | 'preview';
  publication: PublishedSite | null;
  generatingAi: boolean;
  aiUsed: number;
  aiLimit: number;
  onSelectTab: (tab: 'editor' | 'preview') => void;
  onSave: () => void;
  onOpenPublish: () => void;
  onUnpublish: () => void;
  onGenerateAiCopy: () => void;
}

export function ProjectEditorHeader({
  businessName,
  version,
  dirty,
  status,
  activeTab,
  publication,
  generatingAi,
  aiUsed,
  aiLimit,
  onSelectTab,
  onSave,
  onOpenPublish,
  onUnpublish,
  onGenerateAiCopy,
}: HeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link href="/os" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Voltar
        </Link>
        <div className="h-4 w-px bg-muted" />
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          {businessName || 'Projeto sem nome'}
        </h1>
        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          v{version}
        </span>
        {dirty && (
          <span className="rounded-full bg-warning/10 border border-warning/30 px-2 py-0.5 text-[11px] font-medium text-warning">
            Não salvo
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Editor / Preview Tabs */}
        <div className="flex rounded-lg border border-border bg-card p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onSelectTab('editor')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'editor' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Conteúdo
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('preview')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'preview' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Prévia
          </button>
        </div>

        {/* AI Copy Button */}
        <button
          type="button"
          disabled={generatingAi || aiUsed >= aiLimit}
          onClick={onGenerateAiCopy}
          className="rounded-lg border border-primary/30 bg-primary/40 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/40 disabled:opacity-50 transition-all"
        >
          {generatingAi ? 'Gerando...' : `Gerar com IA (${aiUsed}/${aiLimit})`}
        </button>

        {/* Save Button */}
        <button
          type="button"
          disabled={!dirty || status === 'saving'}
          onClick={onSave}
          className="rounded-lg border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 transition-all"
        >
          {status === 'saving' ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        {/* Publish / Unpublish Buttons */}
        {publication ? (
          <div className="flex items-center gap-2">
            <a
              href={`/sites/${publication.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-success/10 border border-success/30 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/20 transition-all"
            >
              Ver Site ↗
            </a>
            <button
              type="button"
              onClick={onUnpublish}
              className="rounded-lg border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-all"
            >
              Despublicar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenPublish}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary transition-all"
          >
            Publicar Site
          </button>
        )}
      </div>
    </header>
  );
}
