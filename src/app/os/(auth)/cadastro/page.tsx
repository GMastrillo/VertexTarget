import Link from 'next/link';
import { AuthForm } from '@/components/os/auth-form';

export const metadata = {
  title: 'Cadastro Gratuito — Vertex OS',
  description: 'Crie seu workspace gratuito na Vertex OS.',
};

export default function CadastroPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-white">Criar Conta Gratuita</h1>
        <p className="text-xs text-slate-400">
          Inicie seu workspace próprio na Vertex OS com recursos gratuitos sem cartão.
        </p>
      </div>

      <AuthForm mode="signup" />

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/[.06]">
        Já possui uma conta?{' '}
        <Link href="/os/entrar" className="text-cyan-400 hover:underline font-medium">
          Entrar
        </Link>
      </div>
    </div>
  );
}
