'use client';

import { Sparkles, MapPin, Building2 } from 'lucide-react';
import { SANDBOX_NICHES } from './laptop-sandbox-generator';

interface LaptopSandboxBarProps {
  businessName: string;
  nicheId: string;
  city: string;
  onNameChange: (val: string) => void;
  onNicheChange: (val: string) => void;
  onCityChange: (val: string) => void;
}

export default function LaptopSandboxBar({
  businessName,
  nicheId,
  city,
  onNameChange,
  onNicheChange,
  onCityChange,
}: LaptopSandboxBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 p-4 sm:p-5 rounded-2xl bg-card backdrop-blur-md border border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.12)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
            Sandbox Interativo — Digite seus dados para ver seu site ao vivo
          </span>
        </div>
        <span className="text-[11px] text-primary font-mono">
          Preview instantâneo sem cadastro
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Input Nome da Empresa */}
        <div className="relative">
          <label className="block text-[11px] font-mono text-muted-foreground mb-1">
            Nome do seu Negócio
          </label>
          <div className="relative flex items-center">
            <Building2 className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={businessName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: Clínica Lumina, Studio Alpha..."
              maxLength={40}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-muted transition-all"
            />
          </div>
        </div>

        {/* Input Cidade */}
        <div className="relative">
          <label className="block text-[11px] font-mono text-muted-foreground mb-1">
            Sua Cidade / Região
          </label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Ex: São Paulo, SP ou Curitiba, PR"
              maxLength={35}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-muted transition-all"
            />
          </div>
        </div>
      </div>

      {/* Seletor de Nichos Rápidos */}
      <div>
        <label className="block text-[11px] font-mono text-muted-foreground mb-2">
          Selecione o Ramo de Atuação:
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SANDBOX_NICHES.map((niche) => {
            const isSelected = niche.id === nicheId;
            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => onNicheChange(niche.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105'
                    : 'bg-muted text-muted-foreground border border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isSelected ? 'var(--primary-foreground)' : 'var(--primary)' }}
                />
                <span>{niche.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
