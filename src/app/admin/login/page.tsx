"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        setErro(corpo.erro ?? "Não foi possível entrar.");
        setCarregando(false);
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
      setCarregando(false);
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] p-5 text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[#d4af37]/25 bg-white/[0.03] p-6">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#c1121f]/20 text-[#d4af37]">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">Acesso Restrito</h1>
            <p className="mt-1 text-sm text-gray-400">
              Painel da Rifa Solidária
            </p>
          </div>

          <form onSubmit={entrar} className="space-y-4">
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-white placeholder:text-gray-600 focus:border-[#d4af37] focus:outline-none transition-colors"
            />

            {erro && (
              <p className="rounded-xl border border-[#c1121f]/40 bg-[#c1121f]/10 px-4 py-3 text-center text-sm text-red-300">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando || !senha}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c1121f] py-3 font-semibold text-white transition-colors hover:bg-[#a50f1a] disabled:opacity-50"
            >
              {carregando && <Loader2 className="h-4 w-4 animate-spin" />}
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o site
        </Link>
      </div>
    </main>
  );
}
