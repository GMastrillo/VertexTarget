'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { HcaptchaWidget } from '@/components/contact/hcaptcha-widget';
import {
  executeAuthSubmit,
  AuthNameInput,
  AuthEmailInput,
  AuthPasswordInput,
  AuthConfirmPasswordInput,
  AuthTermsCheckbox,
} from './auth-form-fields';

interface AuthFormProps {
  mode: 'signup' | 'login' | 'recover' | 'password';
  next?: string;
  initialEmail?: string;
}

function getSuccessText(mode: 'signup' | 'login' | 'recover' | 'password'): string {
  if (mode === 'signup') return 'Conta criada com sucesso! Redirecionando para o login...';
  if (mode === 'recover') return 'Se o e-mail estiver cadastrado, você receberá as instruções em instantes.';
  if (mode === 'password') return 'Senha redefinida com sucesso! Redirecionando...';
  return '';
}

function getSubmitButtonLabel(mode: string, loading: boolean): string {
  if (loading) return 'Processando...';
  if (mode === 'signup') return 'Criar Conta';
  if (mode === 'login') return 'Entrar';
  if (mode === 'recover') return 'Recuperar Senha';
  return 'Salvar Nova Senha';
}

function AuthFormInputs({
  mode,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  termsAccepted,
  setTermsAccepted,
}: {
  mode: 'signup' | 'login' | 'recover' | 'password';
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
}) {
  return (
    <>
      {mode === 'signup' && <AuthNameInput value={name} onChange={setName} />}
      {mode !== 'password' && <AuthEmailInput value={email} onChange={setEmail} />}
      {mode !== 'recover' && <AuthPasswordInput mode={mode} value={password} onChange={setPassword} />}
      {mode === 'password' && <AuthConfirmPasswordInput value={confirmPassword} onChange={setConfirmPassword} />}
      {mode === 'signup' && <AuthTermsCheckbox checked={termsAccepted} onChange={setTermsAccepted} />}
    </>
  );
}

export function AuthForm({ mode, next = '/os', initialEmail = '' }: AuthFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCaptcha = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'password' && password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    const result = await executeAuthSubmit(mode, {
      action: mode,
      name,
      email,
      password,
      termsAccepted: mode === 'signup' ? termsAccepted : undefined,
      noticeVersion: mode === 'signup' ? '2026-10-02' : undefined,
      captchaToken: captchaToken || 'dev-token',
    });

    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Falha na autenticação.');
      setResetKey((prev) => prev + 1);
      return;
    }

    const msg = getSuccessText(mode);
    if (msg) setSuccessMessage(msg);

    if (mode === 'signup') {
      setTimeout(() => {
        window.location.href = `/os/entrar?email=${encodeURIComponent(email)}`;
      }, 1200);
    } else if (mode === 'password') {
      setTimeout(() => { window.location.href = '/os/entrar'; }, 1500);
    } else if (mode === 'login') {
      window.location.href = next;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive" role="alert">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs text-primary" role="status">
          {successMessage}
        </div>
      )}

      <AuthFormInputs
        mode={mode}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
      />

      {mode !== 'password' && <HcaptchaWidget onToken={handleCaptcha} resetKey={resetKey} />}

      <Button type="submit" className="w-full" disabled={loading}>
        {getSubmitButtonLabel(mode, loading)}
      </Button>
    </form>
  );
}
