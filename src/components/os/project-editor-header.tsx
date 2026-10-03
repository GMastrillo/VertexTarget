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
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link href="/os" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Voltar
        </Link>
        <div className="h-4 w-px bg-slate-800" />
        <h1 className="text-lg font-bold text-white tracking-tight">
          {businessName || 'Projeto sem nome'}
        </h1>
        <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
          v{version}
        </span>
        {dirty && (
          <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium text-amber-400">
            Não salvo
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Editor / Preview Tabs */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => onSelectTab('editor')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'editor' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Conteúdo
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('preview')}
            className={`rounded px-3 py-1 font-medium transition-colors ${
              activeTab === 'preview' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
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
          className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 disabled:opacity-50 transition-all"
        >
          {generatingAi ? 'Gerando...' : `Gerar com IA (${aiUsed}/${aiLimit})`}
        </button>

        {/* Save Button */}
        <button
          type="button"
          disabled={!dirty || status === 'saving'}
          onClick={onSave}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-all"
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
              className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              Ver Site ↗
            </a>
            <button
              type="button"
              onClick={onUnpublish}
              className="rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              Despublicar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenPublish}
            className="rounded-lg bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-all"
          >
            Publicar Site
          </button>
        )}
      </div>
    </header>
  );
}
