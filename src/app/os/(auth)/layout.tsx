import Link from 'next/link';

export default function OsAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#050510] text-[#e8e8f0] px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-xs font-black text-[#050510]">
              VT
            </span>
            <span className="font-[var(--font-heading)] text-xl font-bold tracking-tight">
              Vertex<span className="text-cyan-300">OS</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[.08] bg-[#0a0a1a]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {children}
        </div>

        <p className="text-center text-xs text-slate-500">
          VertexTarget Ecossistema &bull;{' '}
          <Link href="/" className="text-slate-400 hover:text-white underline">
            Voltar ao site principal
          </Link>
        </p>
      </div>
    </div>
  );
}
