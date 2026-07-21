"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Senha simples para controle de acesso (em produção ideal usar auth real)
    setTimeout(() => {
      if (password === "casais2026") {
        // Salvar auth no sessionStorage apenas para a sessão
        sessionStorage.setItem("admin_auth", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Senha incorreta");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-5"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 50%), #000",
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <Image
          src="/logodotitulo.png"
          alt="Conferência de Casais 2026"
          width={200}
          height={100}
          className="w-[180px] h-auto object-contain mb-8"
        />

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3 text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold">Acesso Restrito</h1>
            <p className="text-sm text-gray-400 text-center mt-1">
              Área administrativa da Conferência
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-white text-black font-semibold rounded-xl py-3 transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o site
        </Link>
      </div>
    </main>
  );
}
