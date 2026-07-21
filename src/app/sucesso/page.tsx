"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Ticket, ArrowRight, Download } from "lucide-react";
import { Suspense } from "react";

function SucessoContent() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get("ticket");

  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-5"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), #000",
        }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Ícone de Sucesso */}
        <div className="mb-6 rounded-full bg-green-500/20 p-4 border border-green-500/30">
          <CheckCircle2 className="w-16 h-16 text-green-400" />
        </div>

        <h1
          className="text-white mb-3"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px, 8vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Inscrição Confirmada!
        </h1>
        
        <p style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(16px, 5vw, 20px)",
          color: "#d1d5db",
          fontStyle: "italic",
          marginBottom: "2rem"
        }}>
          Sua presença na Conferência de Casais 2026 está garantida.
        </p>

        {ticket && (
          <div 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md"
            style={{ boxShadow: "0 8px 32px rgba(124,58,237,0.15)" }}
          >
            <p className="text-xs uppercase tracking-widest text-purple-400 mb-2">
              Seu Número de Inscrição
            </p>
            <div className="text-3xl font-bold tracking-wider text-white mb-4" style={{ fontFamily: "var(--font-inter)" }}>
              {ticket}
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              Não se esqueça da contribuição de <strong>5 kg de alimentos não perecíveis</strong> por casal no dia do evento.
            </p>

            <Link
              href={`/meu-ingresso?ticket=${ticket}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full font-semibold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a21caf)",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
              }}
            >
              <Ticket className="w-4 h-4" />
              Ver Meu Ingresso
            </Link>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Voltar para o início
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SucessoContent />
    </Suspense>
  );
}
