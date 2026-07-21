"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Ticket, ArrowLeft, Search, Calendar, MapPin, Clock } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function MeuIngressoContent() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get("ticket") || "";
  
  const [ticketInput, setTicketInput] = useState(initialTicket);
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarIngresso = async (ticketToSearch: string) => {
    if (!ticketToSearch) return;
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase
        .from("casais")
        .select("*")
        .eq("numero_inscricao", ticketToSearch)
        .single();
        
      if (error || !data) {
        setError("Ingresso não encontrado. Verifique o código digitado.");
        setTicketData(null);
      } else {
        setTicketData(data);
      }
    } catch (err) {
      setError("Erro ao buscar ingresso.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar automaticamente se o ticket veio na URL
  useEffect(() => {
    if (initialTicket) {
      buscarIngresso(initialTicket);
    }
  }, [initialTicket]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    buscarIngresso(ticketInput);
  };

  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col items-center p-5"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 60%), #000",
        }}
      />

      {/* Cabeçalho */}
      <header className="relative z-10 w-full pt-8 pb-6 flex flex-col items-center">
        <Link href="/">
          <Image
            src="/logodotitulo.png"
            alt="Conferência de Casais 2026"
            width={180}
            height={90}
            className="h-12 w-auto object-contain mb-8"
          />
        </Link>
        <h1
          className="text-white mb-2 text-center"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: 700,
          }}
        >
          Meu Ingresso
        </h1>
      </header>

      <div className="relative z-10 w-full max-w-md flex flex-col">
        {/* Formulário de Busca */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="text"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
            placeholder="Digite o código (ex: XHGK-VC97)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors uppercase"
          />
          <button
            type="submit"
            disabled={loading || !ticketInput}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl px-4 py-3 flex items-center justify-center transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400 py-10">Buscando...</div>
        )}

        {/* Ingresso Encontrado */}
        {ticketData && !loading && (
          <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
            {/* Decoração superior */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
            
            <div className="text-center mb-6 pt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400 mb-1">
                Conferência de Casais 2026
              </p>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                Casados & Aliançados
              </h2>
            </div>

            {/* Código e Nomes */}
            <div className="bg-black/40 rounded-2xl p-5 mb-6 border border-white/5">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Código</p>
                  <p className="text-xl font-mono font-bold text-white tracking-widest">{ticketData.numero_inscricao}</p>
                </div>
                <Ticket className="w-8 h-8 text-fuchsia-400 opacity-80" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Marido</p>
                  <p className="text-sm font-semibold">{ticketData.nome_ele}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Esposa</p>
                  <p className="text-sm font-semibold">{ticketData.nome_ela}</p>
                </div>
              </div>
            </div>

            {/* Infos Adicionais */}
            <div className="space-y-4 mb-2">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">08 de Agosto de 2026</p>
                  <p className="text-xs text-gray-400">Sábado</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">18:00h</p>
                  <p className="text-xs text-gray-400">Abertura dos portões</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Igreja Hope (Rede de Casais)</p>
                  <p className="text-xs text-gray-400">Qd 107 Norte, AL 110, Lt 6 — Palmas/TO</p>
                </div>
              </div>
            </div>
            
            {/* Lembrete de contribuição */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-[11px] text-amber-300 uppercase tracking-widest mb-1 font-semibold">
                Lembrete Importante
              </p>
              <p className="text-xs text-gray-300">
                Apresente este ingresso junto com <strong>5kg de alimentos não perecíveis</strong> na entrada.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function MeuIngressoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <MeuIngressoContent />
    </Suspense>
  );
}
