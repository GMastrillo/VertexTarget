import { cookies } from 'next/headers';
import Link from 'next/link';
import { AuthForm } from '@/components/os/auth-form';
import { RECOVERY_COOKIE_NAME, verifyRecoveryProof } from '@/lib/os/auth-service';

export const metadata = {
  title: 'Redefinir Senha — Vertex OS',
  description: 'Defina sua nova senha de acesso à Vertex OS.',
};

export default async function RedefinirSenhaPage() {
  const cookieStore = await cookies();
  const proofToken = cookieStore.get(RECOVERY_COOKIE_NAME)?.value;
  const verified = verifyRecoveryProof(proofToken);

  if (!verified) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">Sessão Expirada</h1>
        <p className="text-xs text-muted-foreground">
          O link de recuperação expirou ou a sessão de alteração não é mais válida.
        </p>
        <div className="pt-2">
          <Link
            href="/os/recuperar"
            className="inline-block rounded-lg bg-primary/20 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/30"
          >
            Solicitar nova recuperação
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Definir Nova Senha</h1>
        <p className="text-xs text-muted-foreground">
          Crie uma nova senha de 12 a 128 caracteres para a conta de {verified.email}.
        </p>
      </div>

      <AuthForm mode="password" />
    </div>
  );
}
