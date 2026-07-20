import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-purple-900/10 to-black text-white flex flex-col items-center justify-center p-4 pb-32">
      
      {/* Efeitos Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-10">
        
        {/* Cabeçalho */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="text-xs sm:text-sm font-medium text-gray-300 tracking-wider uppercase">
            Igreja Hope | Rede de Casais
          </span>
        </div>

        {/* Títulos */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 pb-2">
          CONFERÊNCIA DE CASAIS 2026
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-2 max-w-2xl mx-auto font-light">
          Tema: <strong className="font-semibold text-white">Casados e Aliançados: Um casamento com propósito.</strong>
        </p>

        {/* Cards de Atrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-3xl">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center transform transition-all hover:scale-[1.02] hover:bg-white/10">
            <h3 className="text-xl font-bold text-fuchsia-300 mb-2">Um Casal Cheio da Graça</h3>
            <p className="text-gray-300 text-sm sm:text-base">Pr. Alan & Pra. Graciele Daniel</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center transform transition-all hover:scale-[1.02] hover:bg-white/10">
            <h3 className="text-xl font-bold text-purple-300 mb-2">Louvor e Festa</h3>
            <p className="text-gray-300 text-sm sm:text-base">DJ Pescadora</p>
          </div>
        </div>

        {/* Informações Práticas */}
        <div className="mt-12 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8 text-left bg-black/40 p-6 sm:p-8 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-white">Dia 08/08</p>
              <p className="text-sm text-gray-400">Sábado</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-fuchsia-500/20 text-fuchsia-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-white">Horário</p>
              <p className="text-sm text-gray-400">18:00h</p>
            </div>
          </div>

          <div className="flex items-start gap-4 sm:col-span-2">
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-white">Local</p>
              <p className="text-sm text-gray-400">Qd 107 Norte, AL 110, Lt 6, Palmas TO<br/>(Ao Lado do Shopping Capim Dourado)</p>
            </div>
          </div>

          <div className="flex items-start gap-4 sm:col-span-2">
            <div className="p-3 rounded-full bg-green-500/20 text-green-400 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-white">Entrada</p>
              <p className="text-sm text-gray-400">5kg de alimentos não perecíveis por casal</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full max-w-md mt-14 mb-8">
          <Link 
            href="/inscricao"
            className="inline-block w-full text-center text-lg sm:text-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-5 sm:py-6 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105 border-0"
          >
            Inscrever-se Grátis
          </Link>
        </div>
        
      </div>
    </main>
  );
}
