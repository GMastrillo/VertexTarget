import { getConfirmedIdentity } from '@/lib/os/auth';
import { getWorkspace } from '@/lib/os/workspace-repository';
import { OsShell } from '@/components/os/os-shell';
import { OnboardingForm } from '@/components/os/onboarding-form';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const identity = await getConfirmedIdentity();
  if (!identity) {
    redirect('/os/entrar');
  }

  const workspace = await getWorkspace();
  if (!workspace || workspace.status === 'deleted') {
    return (
      <div className="min-h-screen bg-[#050510] text-[#e8e8f0] px-4 py-8">
        <OnboardingForm />
      </div>
    );
  }

  if (workspace.status === 'suspended') {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">Workspace Suspenso</h2>
          <p className="text-xs text-slate-300">
            Este workspace foi temporariamente suspenso por moderação ou violação dos termos. Entre em contato com o suporte para mais informações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <OsShell workspace={workspace} userEmail={identity.email}>
      {children}
    </OsShell>
  );
}
