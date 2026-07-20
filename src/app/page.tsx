import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col" style={{ fontFamily: "var(--font-inter)" }}>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative w-full flex flex-col items-center overflow-hidden" style={{ minHeight: "100svh" }}>

        {/* ── Foto de fundo — sem blur ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/fotomaisfundopreto.jpg"
            alt="Pastor Alan e Pastora Graciele Daniel"
            fill
            className="object-cover object-top"
            priority
            quality={100}
          />
          {/* Gradiente suave apenas na parte inferior */}
          <div className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.98) 100%)",
            }}
          />
        </div>

        {/* ── Conteúdo posicionado na metade inferior ── */}
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center px-5"
          style={{ paddingTop: "52svh" }}>

          {/* Logo do evento — sem efeitos, só a imagem limpa */}
          <div className="w-[75%] max-w-[300px] mx-auto mb-5">
            <Image
              src="/logodotitulo.png"
              alt="Conferência de Casais 2026"
              width={420}
              height={210}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Tema */}
          <p
            className="text-center text-sm sm:text-base text-gray-300 mb-6 leading-relaxed"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(14px, 4vw, 18px)" }}
          >
            <em>"Casados e Aliançados: Um casamento com propósito."</em>
          </p>

          {/* ── Countdown ── */}
          <div className="mb-6">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-gray-400 mb-3"
              style={{ fontFamily: "var(--font-inter)" }}>
              Contagem Regressiva
            </p>
            <Countdown />
          </div>

          {/* ── Info do Evento ── */}
          <div className="w-full space-y-2.5 mb-7">
            {/* Data + Hora */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Data</p>
                <p className="text-sm font-semibold text-white">08 de Agosto</p>
                <p className="text-xs text-gray-400">Sábado · 2026</p>
              </div>
              <div className="rounded-xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Horário</p>
                <p className="text-sm font-semibold text-white">18h00</p>
                <p className="text-xs text-gray-400">Abertura dos portões</p>
              </div>
            </div>

            {/* Local */}
            <div className="rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Local</p>
              <p className="text-sm font-semibold text-white">Qd 107 Norte, AL 110, Lt 6 — Palmas/TO</p>
              <p className="text-xs text-gray-400">Ao lado do Shopping Capim Dourado</p>
            </div>

            {/* Entrada */}
            <div className="rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Contribuição</p>
              <p className="text-sm font-semibold text-white">5 kg de alimentos não perecíveis</p>
              <p className="text-xs text-gray-400">Por casal · entrada solidária</p>
            </div>
          </div>

          {/* ── Botão CTA ── */}
          <Link
            href="/inscricao"
            className="w-full text-center font-bold text-white py-4 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 mb-8"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "1rem",
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, #7c3aed, #a21caf)",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.45)",
            }}
          >
            INSCREVER-SE GRATUITAMENTE
          </Link>

          {/* ── Cards de Atrações ── */}
          <div className="w-full grid grid-cols-2 gap-3 pb-14">
            <div className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)" }}>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2">Ministério</p>
              <h3 className="text-sm font-semibold text-white leading-snug mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Um Casal Cheio da Graça
              </h3>
              <p className="text-xs text-gray-400">Pr. Alan &amp; Pra. Graciele Daniel</p>
            </div>
            <div className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(162,28,175,0.1)", border: "1px solid rgba(162,28,175,0.3)" }}>
              <p className="text-[10px] uppercase tracking-widest text-fuchsia-400 mb-2">Louvor</p>
              <h3 className="text-sm font-semibold text-white leading-snug mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Louvor e Festa
              </h3>
              <p className="text-xs text-gray-400">DJ Pescadora</p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════
          SEÇÃO: CONHEÇA O CASAL
      ══════════════════════════════ */}
      <section className="bg-zinc-950 w-full px-5 py-16 flex flex-col items-center">
        <div className="w-full max-w-lg mx-auto">

          {/* Divider decorativo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-700/60 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-purple-400"
              style={{ fontFamily: "var(--font-inter)" }}>
              Pregadores Convidados
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-700/60 to-transparent" />
          </div>

          <h2
            className="text-center mb-3 text-white"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(26px, 7vw, 38px)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Um Casal Cheio da Graça
          </h2>
          <h3
            className="text-center mb-8 text-gray-400"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(16px, 5vw, 20px)",
              fontStyle: "italic",
            }}
          >
            Pr. Alan Daniel &amp; Pra. Graciele Daniel
          </h3>

          <p
            className="text-gray-300 leading-relaxed text-center mb-10"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(15px, 4.5vw, 19px)",
              lineHeight: 1.8,
            }}
          >
            <strong className="text-white font-semibold">Pastor Alan Daniel</strong> e{" "}
            <strong className="text-white font-semibold">Pastora Graciele Daniel</strong> são líderes da
            Igreja do Evangelho Quadrangular em Sorocaba (SP). Além de pastorear a congregação local,
            Alan já serviu como coordenador regional do ministério de homens e Graciele como
            coordenadora regional do ministério de adolescentes, funções que lhes conferem abrangência
            ministerial em toda a região metropolitana de Sorocaba.
          </p>

          {/* ── Dois YouTube Shorts ── */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "9/16",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/fI_Jh6UboS0"
                title="Um Casal Cheio da Graça"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "9/16",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/TAxO_R3UTJQ"
                title="Um Casal Cheio da Graça 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* CTA secundário */}
          <Link
            href="/inscricao"
            className="block w-full text-center font-semibold text-white py-4 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #7c3aed, #a21caf)",
              boxShadow: "0 8px 24px rgba(124, 58, 237, 0.35)",
            }}
          >
            GARANTIR MINHA INSCRIÇÃO
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════
          RODAPÉ
      ══════════════════════════════ */}
      <footer className="bg-black border-t border-white/5 py-10 px-5 flex flex-col items-center gap-5">
        <Image
          src="/logoigreja.png"
          alt="Igreja Hope"
          width={130}
          height={65}
          className="h-14 w-auto object-contain opacity-75"
        />
        <div className="h-px w-24 bg-white/10" />
        <p
          className="text-xs text-gray-600 text-center"
          style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.05em" }}
        >
          © 2026 Igreja Hope · Rede de Casais · Todos os direitos reservados
        </p>
      </footer>

    </main>
  );
}
