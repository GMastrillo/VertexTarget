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
      <label htmlFor="auth-name" className="text-xs font-medium text-foreground">Nome Completo</label>
      <input
        id="auth-name"
        type="text"
        required
        autoComplete="name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
      <label htmlFor="auth-email" className="text-xs font-medium text-foreground">E-mail</label>
      <input
        id="auth-email"
        type="email"
        required
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
        <label htmlFor="auth-password" className="text-xs font-medium text-foreground">{label}</label>
        {mode === 'login' && (
          <Link href="/os/recuperar" className="text-xs text-primary hover:underline">
            Esqueceu?
          </Link>
        )}
      </div>
      <input
        id="auth-password"
        type="password"
        required
        autoComplete={autoComp}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
      <label htmlFor="auth-confirm-password" className="text-xs font-medium text-foreground">Confirmar Nova Senha</label>
      <input
        id="auth-confirm-password"
        type="password"
        required
        autoComplete="new-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-muted px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
        className="mt-1 h-4 w-4 rounded border-input bg-muted text-primary focus:ring-ring"
      />
      <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
        Concordo com os{' '}
        <Link href="/termos" className="text-primary hover:underline" target="_blank">
          Termos de Uso
        </Link>{' '}
        e a{' '}
        <Link href="/privacidade" className="text-primary hover:underline" target="_blank">
          Política de Privacidade
        </Link>.
      </label>
    </div>
  );
}
