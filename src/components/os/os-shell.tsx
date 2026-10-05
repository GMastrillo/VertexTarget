'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/layout/ThemeToggle';
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="border-b border-border bg-popover backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/os" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-xs font-black text-primary-foreground">
                VT
              </span>
              <span className="font-heading text-lg font-bold tracking-tight">
                Vertex<span className="text-primary">OS</span>
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1" aria-label="Navegação do workspace">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    item.active
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden md:block text-right text-xs">
              <p className="font-medium text-foreground truncate max-w-[160px]">{workspace.name}</p>
              <p className="text-[11px] text-muted-foreground">{userEmail}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-border hover:bg-muted text-foreground"
            >
              Sair
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 sm:hidden" aria-label="Navegação do workspace no celular">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined} className={`shrink-0 rounded-lg px-3 py-2 text-xs ${item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
