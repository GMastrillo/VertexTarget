import Link from 'next/link';

export async function executeAuthSubmit(
  mode: 'signup' | 'login' | 'recover' | 'password',
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const endpoints: Record<string, string> = {
    signup: '/api/os/auth/signup',
    login: '/api/os/auth/login',
    recover: '/api/os/auth/recover',
    password: '/api/os/auth/password',
  };

  try {
    const res = await fetch(endpoints[mode], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.error || 'Erro na autenticação.' };
    }
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'Falha na conexão.' };
  }
}

export function AuthNameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-300">Nome Completo</label>
      <input
        type="text"
        required
        autoComplete="name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        placeholder="Seu nome"
      />
    </div>
  );
}

export function AuthEmailInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-300">E-mail</label>
      <input
        type="email"
        required
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        placeholder="seu@email.com"
      />
    </div>
  );
}

export function AuthPasswordInput({
  mode,
  value,
  onChange,
}: {
  mode: 'signup' | 'login' | 'password';
  value: string;
  onChange: (v: string) => void;
}) {
  const isReset = mode === 'password';
  const label = isReset ? 'Nova Senha (mín. 12 caracteres)' : 'Senha';
  const autoComp = isReset || mode === 'signup' ? 'new-password' : 'current-password';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">{label}</label>
        {mode === 'login' && (
          <Link href="/os/recuperar" className="text-xs text-cyan-400 hover:underline">
            Esqueceu?
          </Link>
        )}
      </div>
      <input
        type="password"
        required
        autoComplete={autoComp}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        placeholder="••••••••••••"
      />
    </div>
  );
}

export function AuthConfirmPasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-300">Confirmar Nova Senha</label>
      <input
        type="password"
        required
        autoComplete="new-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[.1] bg-white/[.04] px-3.5 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
        placeholder="••••••••••••"
      />
    </div>
  );
}

export function AuthTermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-2.5 pt-1">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-white/[.2] bg-white/[.04] text-cyan-400 focus:ring-cyan-400"
      />
      <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed">
        Concordo com os{' '}
        <Link href="/termos" className="text-cyan-400 hover:underline" target="_blank">
          Termos de Uso
        </Link>{' '}
        e a{' '}
        <Link href="/privacidade" className="text-cyan-400 hover:underline" target="_blank">
          Política de Privacidade
        </Link>.
      </label>
    </div>
  );
}
