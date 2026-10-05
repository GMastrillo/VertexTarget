import Link from 'next/link';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function OsAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4 py-12 relative overflow-hidden">
      <div className="absolute right-4 top-4 z-20"><ThemeToggle /></div>
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-xs font-black text-primary-foreground">
              VT
            </span>
            <span className="font-heading text-xl font-bold tracking-tight">
              Vertex<span className="text-primary">OS</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {children}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          VertexTarget Ecossistema &bull;{' '}
          <Link href="/" className="text-muted-foreground hover:text-foreground underline">
            Voltar ao site principal
          </Link>
        </p>
      </div>
    </div>
  );
}
