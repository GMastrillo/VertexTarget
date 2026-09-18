"use client";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Session guard: only the temporary first-login session belongs on this page.
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      router.replace("/login");
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
      else if (user.user_metadata?.password_must_change !== true) router.replace("/admin");
    });
  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error || "Não foi possível atualizar a senha.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao serviço de autenticação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050510] px-5 py-10 text-[#e8e8f0]">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet-600/15 blur-[140px]" />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[.035] p-8 shadow-2xl shadow-violet-950/20 backdrop-blur-2xl sm:p-10">
        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-sm font-black text-[#050510]">VT</span>
            <span className="text-xl font-semibold">Vertex<span className="text-cyan-300">Target</span></span>
          </div>
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[.2em] text-violet-300">
            <KeyRound size={14} /> Segurança da conta
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Defina sua nova senha</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Por segurança, o acesso temporário precisa ser substituído antes de entrar no painel.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300">Nova senha</span>
            <input
              required
              minLength={10}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 10 caracteres"
              autoComplete="new-password"
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-300">Confirmar nova senha</span>
            <input
              required
              minLength={10}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              className="admin-input"
            />
          </label>
          <p className="text-[11px] leading-5 text-slate-500">Use ao menos 10 caracteres, combinando letras e números.</p>
          {error && <p className="text-xs text-rose-300">{error}</p>}
          <button disabled={loading} className="admin-primary-btn mt-2 w-full">
            {loading ? "Atualizando..." : "Salvar e entrar no painel"}
            <ArrowRight size={17} />
          </button>
        </form>
        <div className="mt-8 flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldCheck size={14} className="text-emerald-400" /> Sua sessão permanece ativa durante a troca.
        </div>
      </div>
    </main>
  );
}
