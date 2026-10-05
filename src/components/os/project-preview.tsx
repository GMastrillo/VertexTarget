'use client';

import React, { useState } from 'react';
import type { SiteDocument } from '@/lib/os/types';
import { SiteRenderer } from './site-renderer';

interface ProjectPreviewProps {
  document: SiteDocument;
}

export function ProjectPreview({ document }: ProjectPreviewProps): React.JSX.Element {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="flex h-full flex-col">
      {/* Device Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2 text-xs">
        <span className="font-medium text-muted-foreground">Prévia em Tempo Real</span>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              device === 'desktop' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              device === 'mobile' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mobile (360px)
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative flex-1 overflow-auto bg-card p-4">
        {device === 'mobile' ? (
          <div className="mx-auto w-[360px] overflow-hidden rounded-2xl border-4 border-border bg-card shadow-2xl">
            <div className="h-[740px] overflow-y-auto">
              <SiteRenderer document={document} preview={true} />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <SiteRenderer document={document} preview={true} />
          </div>
        )}
      </div>
    </div>
  );
}
