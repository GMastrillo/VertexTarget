import Link from 'next/link';
import { AuthForm } from '@/components/os/auth-form';

export const metadata = {
  title: 'Entrar — Vertex OS',
  description: 'Acesse seu workspace na Vertex OS.',
};

interface EntrarPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const params = await searchParams;
  const next = params.next || '/os';

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Acessar Workspace</h1>
        <p className="text-xs text-muted-foreground">
          Entre com suas credenciais para gerenciar seus projetos e publicações.
        </p>
      </div>

      {params.error === 'confirm_failed' && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
          O link de confirmação é inválido ou expirou. Solicite um novo reenvio se necessário.
        </div>
      )}

      {params.error === 'auth-config' && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
          Serviço de autenticação temporariamente indisponível.
        </div>
      )}

      <AuthForm mode="login" next={next} />

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Ainda não tem conta?{' '}
        <Link href="/os/cadastro" className="text-primary hover:underline font-medium">
          Criar conta gratuita
        </Link>
      </div>
    </div>
  );
}
