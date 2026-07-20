import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden">

        {/* Foto de fundo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/fotomaisfundopreto.jpg"
            alt="Fundo do evento"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Gradiente sobre a foto para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/90" />
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center px-4 pt-10 pb-16 text-center">

          {/* Badge da Igreja */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-200 tracking-wider uppercase">
              Igreja Hope · Rede de Casais
            </span>
          </div>

          {/* Logo do título (PNG com transparência) */}
          <div className="w-[80%] max-w-sm mx-auto mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
            <Image
              src="/logodotitulo.png"
              alt="Conferência de Casais 2026"
              width={480}
              height={240}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Subtítulo / Tema */}
          <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-xs mx-auto">
            Tema:{" "}
            <strong className="font-semibold text-white">
              Casados e Aliançados: Um casamento com propósito.
            </strong>
          </p>

          {/* ── Informações do Evento ── */}
          <div className="mt-8 w-full grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-3">
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-sm">08/08/2026</p>
                <p className="text-xs text-gray-400">Sábado</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-3">
              <div className="p-2 rounded-full bg-fuchsia-500/20 text-fuchsia-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-sm">18:00h</p>
                <p className="text-xs text-gray-400">Abertura dos portões</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 col-span-2">
              <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-sm">Qd 107 Norte, AL 110, Lt 6 — Palmas/TO</p>
                <p className="text-xs text-gray-400">Ao lado do Shopping Capim Dourado</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 col-span-2">
              <div className="p-2 rounded-full bg-green-500/20 text-green-400 shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white text-sm">5kg de alimentos não perecíveis</p>
                <p className="text-xs text-gray-400">Entrada por casal</p>
              </div>
            </div>
          </div>

          {/* ── Botão CTA ── */}
          <Link
            href="/inscricao"
            className="mt-8 inline-block w-full text-center text-lg font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-5 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105 active:scale-95"
          >
            ✨ Inscrever-se Grátis
          </Link>

          {/* ── Cards de Atrações ── */}
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-purple-500/30 rounded-2xl p-5 text-center hover:bg-white/10 transition-all">
              <span className="text-2xl mb-2 block">🎤</span>
              <h3 className="text-base font-bold text-fuchsia-300 mb-1">Um Casal Cheio da Graça</h3>
              <p className="text-gray-300 text-sm">Pr. Alan & Pra. Graciele Daniel</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-5 text-center hover:bg-white/10 transition-all">
              <span className="text-2xl mb-2 block">🎵</span>
              <h3 className="text-base font-bold text-purple-300 mb-1">Louvor e Festa</h3>
              <p className="text-gray-300 text-sm">DJ Pescadora</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEÇÃO: QUEM SÃO ── */}
      <section className="bg-zinc-950 w-full px-4 py-14 flex flex-col items-center">
        <div className="w-full max-w-lg mx-auto">

          {/* Título da seção */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">Conheça os Ministros</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-6 leading-tight">
            Quem são o{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">
              Casal Cheio da Graça?
            </span>
          </h3>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed text-center mb-10">
            <strong className="text-white">Pastor Alan Daniel</strong> e{" "}
            <strong className="text-white">Pastora Graciele Daniel</strong> são líderes da Igreja do
            Evangelho Quadrangular em Sorocaba (SP). Além de pastorear a congregação local, Alan já
            serviu como coordenador regional do ministério de homens e Graciele como coordenadora
            regional do ministério de adolescentes, funções que lhes conferem abrangência ministerial
            em toda a região metropolitana de Sorocaba.
          </p>

          {/* ── Dois Shorts do YouTube ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Short 1 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                style={{ aspectRatio: "9/16", maxHeight: 500 }}
              >
                <iframe
                  src="https://www.youtube.com/embed/fI_Jh6UboS0"
                  title="Um Casal Cheio da Graça - Short 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Short 2 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                style={{ aspectRatio: "9/16", maxHeight: 500 }}
              >
                <iframe
                  src="https://www.youtube.com/embed/TAxO_R3UTJQ"
                  title="Um Casal Cheio da Graça - Short 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* CTA secundário */}
          <Link
            href="/inscricao"
            className="mt-10 inline-block w-full text-center text-base font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white py-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105 active:scale-95"
          >
            Quero me Inscrever →
          </Link>
        </div>
      </section>

      {/* ── RODAPÉ ── */}
      <footer className="bg-black border-t border-white/5 py-8 px-4 flex flex-col items-center gap-4">
        <Image
          src="/logoigreja.png"
          alt="Logo Igreja Hope"
          width={120}
          height={60}
          className="h-12 w-auto object-contain opacity-80"
        />
        <p className="text-xs text-gray-500 text-center">
          © 2026 Igreja Hope · Rede de Casais · Todos os direitos reservados
        </p>
      </footer>

    </main>
  );
}
