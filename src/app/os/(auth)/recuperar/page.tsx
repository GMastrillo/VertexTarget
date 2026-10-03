import Link from 'next/link';
import { AuthForm } from '@/components/os/auth-form';

export const metadata = {
  title: 'Recuperar Senha — Vertex OS',
  description: 'Recupere o acesso ao seu workspace na Vertex OS.',
};

interface RecuperarPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function RecuperarPage({ searchParams }: RecuperarPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-white">Recuperar Senha</h1>
        <p className="text-xs text-slate-400">
          Informe seu e-mail para enviarmos as instruções de redefinição com segurança.
        </p>
      </div>

      {params.error === 'recovery_expired' && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
          O link de recuperação expirou ou já foi utilizado. Solicite uma nova redefinição abaixo.
        </div>
      )}

      <AuthForm mode="recover" />

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/[.06]">
        Lembrou a senha?{' '}
        <Link href="/os/entrar" className="text-cyan-400 hover:underline font-medium">
          Voltar para login
        </Link>
      </div>
    </div>
  );
}
