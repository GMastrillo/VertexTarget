import type { UsageSummary as UsageSummaryType } from '@/lib/os/types';

interface UsageSummaryProps {
  usage: UsageSummaryType;
}

export function UsageSummary({ usage }: UsageSummaryProps) {
  const renewsDate = new Date(usage.renewsAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  });

  return (
    <div className="rounded-xl border border-white/[.08] bg-white/[.02] p-4 text-xs">
      <div className="flex items-center justify-between border-b border-white/[.06] pb-2 mb-3">
        <span className="font-medium text-slate-300">Quotas do Mês (UTC)</span>
        <span className="text-[11px] text-slate-500">Renova em {renewsDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-slate-400 mb-1">Textos com IA</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-white">{usage.copy.used}</span>
            <span className="text-slate-500">/ {usage.copy.limit}</span>
          </div>
        </div>

        <div>
          <p className="text-slate-400 mb-1">Busca Web</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold text-white">{usage.search.used}</span>
            <span className="text-slate-500">/ {usage.search.limit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
