"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Ticket, ArrowLeft, Search, Calendar, MapPin, Clock, Download } from "lucide-react";
import { Suspense, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function MeuIngressoContent() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get("ticket") || "";
  
  const [ticketInput, setTicketInput] = useState(initialTicket);
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  useEffect(() => {
    if (initialTicket) {
      buscarIngresso(initialTicket);
    }
  }, [initialTicket]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    buscarIngresso(ticketInput);
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || !ticketData) return;
    setIsDownloading(true);

    try {
      const element = ticketRef.current;
      
      // Salvar estilos originais
      const originalBorder = element.style.border;
      const originalBoxShadow = element.style.boxShadow;
      const originalBorderRadius = element.style.borderRadius;
      
      // Remover bordas arredondadas e sombras para o PDF ficar mais limpo
      element.style.borderRadius = "0";
      element.style.boxShadow = "none";
      element.style.border = "none";
      // Temporariamente colocar um fundo sólido preto para evitar transparências estranhas no PDF
      const originalBg = element.style.background;
      element.style.background = "#111111";

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#111111",
        useCORS: true,
        logging: false,
      });

      // Restaurar estilos originais
      element.style.borderRadius = originalBorderRadius;
      element.style.boxShadow = originalBoxShadow;
      element.style.border = originalBorder;
      element.style.background = originalBg;

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Adicionar margem superior
      const margin = 10;

      pdf.setFillColor("#000000");
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), "F");
      
      pdf.addImage(imgData, "JPEG", margin, margin, pdfWidth - (margin * 2), pdfHeight - (margin * 2));
      pdf.save(`Ingresso_${ticketData.numero_inscricao}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Houve um erro ao gerar o PDF do seu ingresso. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-5"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 60%), #050505",
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

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Formulário de Busca */}
        <form onSubmit={handleSearch} className="mb-8 w-full flex gap-2">
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
          <div className="mb-6 w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-400 py-10 w-full">Buscando...</div>
        )}

        {/* Ingresso Encontrado */}
        {ticketData && !loading && (
          <div className="w-full flex flex-col items-center">
            
            {/* O CARD DO INGRESSO (O que será exportado para PDF) */}
            <div 
              ref={ticketRef}
              className="w-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl relative overflow-hidden backdrop-blur-md mb-6"
              style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
            >
              {/* Decoração superior */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
              
              <div className="text-center mb-6 pt-8 px-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400 mb-2 font-semibold">
                  Conferência de Casais 2026
                </p>
                <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", lineHeight: 1.1 }}>
                  Casados &<br/> Aliançados
                </h2>
              </div>

              {/* Seção Código + QR Code */}
              <div className="px-6 mb-6">
                <div className="bg-black/60 rounded-2xl p-5 border border-white/10 flex flex-row items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Código de Inscrição</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-widest bg-purple-500/20 px-2 py-1 rounded inline-block">
                      {ticketData.numero_inscricao}
                    </p>
                  </div>
                  
                  {/* QR Code */}
                  <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg ml-4">
                    <QRCode
                      value={`TICKET:${ticketData.numero_inscricao}`}
                      size={70}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="Q"
                    />
                  </div>
                </div>
              </div>

              {/* Nomes dos Cônjuges */}
              <div className="px-6 mb-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">Marido</p>
                  <p className="text-sm font-semibold text-gray-200 truncate">{ticketData.nome_ele}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">Esposa</p>
                  <p className="text-sm font-semibold text-gray-200 truncate">{ticketData.nome_ela}</p>
                </div>
              </div>

              {/* Divider tracejado */}
              <div className="px-6 relative mb-6">
                <div className="h-px border-t-2 border-dashed border-white/20 w-full" />
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[#050505] rounded-full border-r-2 border-dashed border-white/20 hidden" />
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[#050505] rounded-full border-l-2 border-dashed border-white/20 hidden" />
              </div>

              {/* Infos Adicionais */}
              <div className="px-6 space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">08 de Agosto de 2026</p>
                    <p className="text-xs text-gray-400">Sábado</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-fuchsia-500/10 rounded-lg shrink-0">
                    <Clock className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">18:00h</p>
                    <p className="text-xs text-gray-400">Abertura dos portões</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Igreja Hope (Rede de Casais)</p>
                    <p className="text-xs text-gray-400">Qd 107 Norte, AL 110, Lt 6 — Palmas/TO</p>
                  </div>
                </div>
              </div>
              
              {/* Lembrete de contribuição */}
              <div className="bg-amber-500/10 border-t border-amber-500/20 p-5 text-center">
                <p className="text-[11px] text-amber-400 uppercase tracking-widest mb-1.5 font-bold">
                  Lembrete Importante
                </p>
                <p className="text-xs text-amber-100/70">
                  Apresente este ingresso junto com <strong>5 kg de alimentos não perecíveis</strong> na entrada.
                </p>
              </div>
            </div>
            
            {/* Botão de Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full bg-white text-black font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isDownloading ? "Gerando PDF..." : "Baixar Ingresso em PDF"}
            </button>
          </div>
        )}

        <div className="mt-8 text-center w-full">
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
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <MeuIngressoContent />
    </Suspense>
  );
}
