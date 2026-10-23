"use client";

import Link from "next/link";
import { Camera, ArrowLeft, LockKeyhole } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível entrar.");
      // Recarrega o documento para aplicar a sessão também às rotas pré-carregadas.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/biblioteca");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha na conexão. Tente novamente.");
      setPending(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-slate-100">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft size={16} />Voltar à apresentação</Link>
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-9">
          <Camera className="mb-7 text-cyan-300" size={36} />
          <p className="mb-2 text-xs font-bold tracking-widest text-cyan-300">HUMANLY × JOVI</p>
          <h1 className="text-3xl font-bold">Seu espaço de memórias.</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">Entre para organizar os momentos da sua rotina.</p>
          <form className="mt-7 grid gap-5" onSubmit={login}>
            <label className="grid gap-2 text-sm font-medium">E-mail<input className="w-full px-3 py-3 text-slate-900" name="email" type="email" autoComplete="username" required maxLength={254} /></label>
            <label className="grid gap-2 text-sm font-medium">Senha<input className="w-full px-3 py-3 text-slate-900" name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>
            {error && <p role="alert" className="rounded-lg border border-rose-500/50 bg-rose-950 p-3 text-sm text-rose-100">{error}</p>}
            <button type="submit" disabled={pending} className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 font-bold text-white hover:bg-blue-500 disabled:opacity-60"><LockKeyhole size={17} />{pending ? "Entrando…" : "Entrar na biblioteca"}</button>
          </form>
          <div className="mt-7 rounded-lg border border-slate-700 p-4 text-sm leading-relaxed text-slate-300">
            <strong className="text-white">Acesso de demonstração</strong>
            <p className="mt-1 break-all">E-mail: professor@humanly.com</p><p>Senha: Humanly@2026</p>
            <p className="mt-2 text-xs">Conta compartilhada para avaliação. Use somente dados fictícios. As alterações ficam neste navegador.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
