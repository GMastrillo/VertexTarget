'use client';

import { Sparkles, Laptop } from 'lucide-react';

interface LaptopModeHeaderProps {
  mode: 'showcase' | 'sandbox';
  onModeChange: (m: 'showcase' | 'sandbox') => void;
}

export default function LaptopModeHeader({ mode, onModeChange }: LaptopModeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
      <button
        type="button"
        onClick={() => onModeChange('showcase')}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
          mode === 'showcase'
            ? 'bg-muted text-foreground border border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
            : 'bg-muted text-muted-foreground border border-border hover:text-foreground'
        }`}
      >
        <Laptop className="w-3.5 h-3.5" />
        <span>Exemplos em Destaque</span>
      </button>

      <button
        type="button"
        onClick={() => onModeChange('sandbox')}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
          mode === 'sandbox'
            ? 'bg-primary text-primary-foreground border border-primary shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105'
            : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>⚡ Testar no Seu Negócio (Sandbox)</span>
      </button>
    </div>
  );
}
