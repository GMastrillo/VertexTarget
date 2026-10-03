'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { OsWorkspace } from '@/lib/os/types';

interface OsShellProps {
  workspace: OsWorkspace;
  userEmail: string;
  children: React.ReactNode;
}

export function OsShell({ workspace, userEmail, children }: OsShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/os/auth/logout', { method: 'POST' });
    router.push('/os/entrar');
    router.refresh();
  }

  const navItems = [
    { href: '/os', label: 'Projetos', active: pathname === '/os' || pathname.startsWith('/os/projetos') },
    { href: '/os/prospects', label: 'Prospects', active: pathname.startsWith('/os/prospects') },
    { href: '/os/configuracoes', label: 'Configurações', active: pathname.startsWith('/os/configuracoes') },
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-[#e8e8f0]">
      {/* Top Navbar */}
      <header className="border-b border-white/[.08] bg-[#070716]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/os" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-xs font-black text-[#050510]">
                VT
              </span>
              <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight">
                Vertex<span className="text-cyan-300">OS</span>
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1" aria-label="Navegação do workspace">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    item.active
                      ? 'bg-white/[.08] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/[.04]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right text-xs">
              <p className="font-medium text-white truncate max-w-[160px]">{workspace.name}</p>
              <p className="text-[11px] text-slate-500">{userEmail}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-white/[.1] hover:bg-white/[.04] text-slate-300"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
