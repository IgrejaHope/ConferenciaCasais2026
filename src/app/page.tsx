import Image from "next/image";
import { Anchor, CalendarDays, Cog, HeartHandshake } from "lucide-react";
import PainelRifa from "@/components/PainelRifa";
import { formatarReal, META, TOTAL_NUMEROS, VALOR_COTA } from "@/lib/rifa";

const ESPECIFICACOES = [
  { icone: CalendarDays, rotulo: "Ano", valor: "2026" },
  { icone: Cog, rotulo: "Motor", valor: "Tohatsu 18HP" },
  { icone: Anchor, rotulo: "Estado", valor: "Pouco uso" },
];

const GALERIA = [
  { src: "/canoa01.webp", alt: "Canoa completa sobre a carreta, vista frontal" },
  { src: "/canoa02.jpeg", alt: "Vista traseira da canoa com o motor de popa" },
  { src: "/canoa03.jpeg", alt: "Detalhe do motor Tohatsu 18HP" },
  { src: "/canoa04.jpeg", alt: "Vista lateral da embarcação" },
  { src: "/canoa05.jpeg", alt: "Interior e proa da canoa" },
  { src: "/canoa06.jpeg", alt: "Roda e estrutura da carreta" },
];

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col bg-[#1a1a1a] text-white"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative bg-[url('/Capa-canoa.webp')] bg-cover bg-center bg-no-repeat">
        {/* Camadas escuras: leitura do texto + fusão com o fundo da página */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#1a1a1a]" />

        <div className="relative mx-auto flex min-h-[82svh] w-full max-w-4xl flex-col items-center justify-center px-5 py-16 text-center md:min-h-[80vh] md:py-20">
          {/* whitespace-nowrap + tipografia menor no mobile: em duas linhas
              a pílula arredondada fica com a última palavra órfã. */}
          <span className="mb-7 inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-[#d4af37]/50 bg-black/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d4af37] backdrop-blur-sm sm:px-4 sm:text-xs sm:tracking-[0.15em]">
            <HeartHandshake className="h-3.5 w-3.5 shrink-0" />
            Embarcação Nova 2026 · {formatarReal(VALOR_COTA)} a cota
          </span>

          <h1
            className="text-5xl font-bold uppercase leading-[0.95] tracking-tight text-[#d4af37] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] sm:text-6xl md:text-8xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Rifa
            <br />
            Solidária
          </h1>

          <p
            className="mt-6 max-w-2xl text-xl font-light italic leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-2xl md:text-3xl"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Uma cota. Uma corrente de fé por Joselete.
          </p>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">
            {TOTAL_NUMEROS} cotas concorrendo a uma canoa completa. Meta de{" "}
            {formatarReal(META)} para o tratamento contra o câncer.
          </p>

          <a
            href="#numeros"
            className="mt-9 rounded-xl bg-[#c1121f] px-8 py-4 font-semibold text-white shadow-lg shadow-black/40 transition-colors hover:bg-[#a50f1a]"
          >
            Escolher minha cota
          </a>

          <p className="mt-3 text-xs text-gray-300/90 sm:text-sm">
            O sorteio ocorrerá mediante a venda total das cotas.
          </p>
        </div>
      </section>

      {/*
        O PainelRifa é um Client Component (grade, modal e dados ao vivo).
        As seções abaixo são estáticas, então vão como children e continuam
        sendo renderizadas no servidor.
      */}
      <PainelRifa>
        <section className="border-y border-white/5 bg-black/25">
          <div className="mx-auto w-full max-w-5xl px-5 py-14 md:py-20">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl">
                  Sobre a <span className="text-[#d4af37]">causa</span>
                </h2>
                <div className="space-y-4 leading-relaxed text-gray-300">
                  <p>
                    A Joselete está enfrentando um tratamento contra o câncer, e
                    os custos envolvidos vão muito além do que uma família
                    consegue sustentar sozinha: consultas, exames, medicamentos e
                    deslocamentos que não podem esperar.
                  </p>
                  <p>
                    Foi daí que nasceu esta rifa. São {TOTAL_NUMEROS} cotas de{" "}
                    {formatarReal(VALOR_COTA)}, com meta de {formatarReal(META)},
                    e cada cota concorre à embarcação. Todo o valor arrecadado é
                    destinado ao tratamento.
                  </p>
                  <p className="text-[#d4af37]">
                    Participar é mais do que concorrer a um prêmio. É entrar numa
                    corrente de fé por uma vida.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl">
                  O <span className="text-[#d4af37]">prêmio</span>
                </h2>
                <p className="mb-6 leading-relaxed text-gray-300">
                  Uma canoa em excelente estado de conservação, pronta para uso.
                </p>

                <ul className="space-y-3">
                  {ESPECIFICACOES.map(({ icone: Icone, rotulo, valor }) => (
                    <li
                      key={rotulo}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
                    >
                      <Icone className="h-5 w-5 shrink-0 text-[#d4af37]" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                          {rotulo}
                        </p>
                        <p className="font-semibold text-white">{valor}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ─────────────── Galeria ─────────────── */}
            <div className="mt-16">
              <h2 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
                Conheça a <span className="text-[#d4af37]">embarcação</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-center text-gray-400">
                Fotos reais do prêmio desta rifa.
              </p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {GALERIA.map((foto, indice) => (
                  <div
                    key={foto.src}
                    className="group relative aspect-4/3 overflow-hidden rounded-xl border border-white/10"
                  >
                    <Image
                      src={foto.src}
                      alt={foto.alt}
                      fill
                      loading={indice < 2 ? "eager" : "lazy"}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </PainelRifa>

      {/* ══════════════════════ RODAPÉ ══════════════════════ */}
      <footer className="mt-auto border-t border-white/5 px-5 py-10 text-center">
        <p className="text-sm text-gray-500">
          Rifa Solidária por Joselete · Toda a arrecadação é destinada ao
          tratamento.
        </p>
      </footer>
    </main>
  );
}
