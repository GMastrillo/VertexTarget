import type { ThemeId } from '@/lib/os/types';

export interface ThemeStyles {
  wrapper: string;
  card: string;
  primaryButton: string;
  secondaryButton: string;
  heading: string;
  subtext: string;
  badge: string;
  border: string;
}

export const THEME_STYLES: Record<ThemeId, ThemeStyles> = {
  'cyan-dark': {
    wrapper: 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black',
    card: 'bg-slate-900/80 border-slate-800 text-slate-200 shadow-lg shadow-black/40',
    primaryButton: 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 font-semibold shadow-md shadow-cyan-950/50',
    secondaryButton: 'border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800',
    heading: 'text-white font-bold',
    subtext: 'text-slate-400',
    badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    border: 'border-slate-800',
  },
  'warm-light': {
    wrapper: 'bg-[#faf8f5] text-stone-900 selection:bg-amber-200 selection:text-stone-900',
    card: 'bg-white/90 border-stone-200/80 text-stone-800 shadow-md shadow-stone-200/50',
    primaryButton: 'bg-stone-900 text-amber-50 hover:bg-stone-800 font-semibold shadow-md shadow-stone-300',
    secondaryButton: 'border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200',
    heading: 'text-stone-900 font-serif font-bold',
    subtext: 'text-stone-600',
    badge: 'bg-amber-50 text-amber-900 border-amber-200',
    border: 'border-stone-200',
  },
  'forest-light': {
    wrapper: 'bg-[#f4f7f4] text-emerald-950 selection:bg-emerald-300 selection:text-emerald-950',
    card: 'bg-white/95 border-emerald-100 text-emerald-900 shadow-md shadow-emerald-900/5',
    primaryButton: 'bg-emerald-700 text-emerald-50 hover:bg-emerald-800 font-semibold shadow-md shadow-emerald-950/20',
    secondaryButton: 'border-emerald-200 bg-emerald-50/50 text-emerald-900 hover:bg-emerald-100',
    heading: 'text-emerald-950 font-bold',
    subtext: 'text-emerald-800/80',
    badge: 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
    border: 'border-emerald-100',
  },
};
