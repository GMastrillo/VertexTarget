'use client';

import { DEMO_SITES } from './laptop-data';

interface LaptopShowcaseTabsProps {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

export default function LaptopShowcaseTabs({
  activeIndex,
  onSelectIndex,
}: LaptopShowcaseTabsProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 px-2">
      {DEMO_SITES.map((site, index) => {
        const isSelected = index === activeIndex;
        return (
          <button
            key={site.id}
            type="button"
            onClick={() => onSelectIndex(index)}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isSelected
                ? 'bg-muted text-foreground border border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'bg-muted text-muted-foreground border border-border hover:text-foreground hover:bg-muted'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full transition-transform duration-300"
              style={{
                background: site.accent,
                transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                boxShadow: isSelected ? `0 0 8px ${site.accent}` : 'none',
              }}
            />
            <span>{site.name}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              ({site.niche})
            </span>
          </button>
        );
      })}
    </div>
  );
}
