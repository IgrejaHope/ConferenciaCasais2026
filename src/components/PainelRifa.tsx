"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, Copy, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  formatarReal,
  META,
  PIX,
  TOTAL_NUMEROS,
  VALOR_COTA,
  type NumeroPublico,
  type StatusNumero,
} from "@/lib/rifa";

const INTERVALO_ATUALIZACAO = 20_000;

const ESTILO_NUMERO: Record<StatusNumero, string> = {
  disponivel:
    "bg-emerald-600 text-white border-emerald-400/40 hover:bg-emerald-500 hover:border-[#d4af37] hover:-translate-y-0.5 cursor-pointer",
  reservado:
    "bg-amber-500 text-black border-amber-300/40 cursor-not-allowed opacity-90",
  pago: "bg-[#c1121f] text-white/70 border-[#c1121f] cursor-not-allowed opacity-80",
};

const ROTULO_STATUS: Record<StatusNumero, string> = {
  disponivel: "Disponível",
  reservado: "Reservado — aguardando pagamento",
  pago: "Cota paga",
};

type EtapaModal = "formulario" | "pagamento";

const ERRO_CARGA =
  "Não foi possível carregar os números. Tente recarregar a página.";

async function buscarNumeros() {
  const { data, error } = await supabase
    .from("rifa_numeros_publico")
    .select("id, status")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data ?? []) as NumeroPublico[];
}

export default function PainelRifa({ children }: { children?: React.ReactNode }) {
  const [numeros, setNumeros] = useState<NumeroPublico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");

  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [etapa, setEtapa] = useState<EtapaModal>("formulario");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroForm, setErroForm] = useState("");
  const [copiado, setCopiado] = useState(false);

  const primeiroCampo = useRef<HTMLInputElement>(null);

  /** Recarga manual, disparada logo depois de uma reserva. */
  const atualizar = useCallback(async () => {
    try {
      setNumeros(await buscarNumeros());
      setErroCarga("");
    } catch (erro) {
      console.error("Erro ao carregar os números:", erro);
      setErroCarga(ERRO_CARGA);
    }
  }, []);

  useEffect(() => {
    let ignorar = false;

    async function sincronizar() {
      try {
        const dados = await buscarNumeros();
        if (ignorar) return;
        setNumeros(dados);
        setErroCarga("");
      } catch (erro) {
        if (ignorar) return;
        console.error("Erro ao carregar os números:", erro);
        setErroCarga(ERRO_CARGA);
      } finally {
        if (!ignorar) setCarregando(false);
      }
    }

    sincronizar();

    const timer = setInterval(sincronizar, INTERVALO_ATUALIZACAO);
    const aoVoltar = () => {
      if (document.visibilityState === "visible") sincronizar();
    };
    document.addEventListener("visibilitychange", aoVoltar);

    return () => {
      ignorar = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, []);

  const { pagos, reservados, disponiveis, arrecadado, progresso } = useMemo(() => {
    const pagos = numeros.filter((n) => n.status === "pago").length;
    const reservados = numeros.filter((n) => n.status === "reservado").length;
    return {
      pagos,
      reservados,
      disponiveis: numeros.length - pagos - reservados,
      arrecadado: pagos * VALOR_COTA,
      progresso: (pagos / TOTAL_NUMEROS) * 100,
    };
  }, [numeros]);

  const fecharModal = useCallback(() => {
    setSelecionado(null);
    setEtapa("formulario");
    setNome("");
    setEmail("");
    setErroForm("");
    setCopiado(false);
  }, []);

  useEffect(() => {
    if (selecionado === null) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !enviando) fecharModal();
    };
    document.addEventListener("keydown", aoTeclar);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [selecionado, enviando, fecharModal]);

  useEffect(() => {
    if (selecionado !== null && etapa === "formulario") {
      primeiroCampo.current?.focus();
    }
  }, [selecionado, etapa]);

  function abrirModal(numero: NumeroPublico) {
    if (numero.status !== "disponivel") return;
    setSelecionado(numero.id);
    setEtapa("formulario");
    setErroForm("");
  }

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (selecionado === null || enviando) return;

    setErroForm("");
    setEnviando(true);

    const { data, error } = await supabase.rpc("reservar_numero", {
      p_id: selecionado,
      p_nome: nome,
      p_email: email,
    });

    setEnviando(false);

    if (error) {
      console.error("Erro ao reservar:", error);
      setErroForm("Falha de conexão. Verifique sua internet e tente de novo.");
      return;
    }

    const resultado = data as { ok: boolean; erro?: string };

    if (!resultado?.ok) {
      setErroForm(resultado?.erro ?? "Não foi possível reservar este número.");
      atualizar();
      return;
    }

    setEtapa("pagamento");
    atualizar();
  }

  async function copiarChave() {
    try {
      await navigator.clipboard.writeText(PIX.chave);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setErroForm("Não foi possível copiar. Anote a chave manualmente.");
    }
  }

  return (
    <>
      {/* ─────────────── Resumo e progresso ─────────────── */}
      <section id="cotas" className="w-full max-w-5xl mx-auto px-5 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl border border-[#d4af37]/25 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              Valor da cota
            </p>
            <p className="text-3xl md:text-4xl font-bold text-[#d4af37]">
              {formatarReal(VALOR_COTA)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#d4af37]/25 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              Meta da ação
            </p>
            <p className="text-3xl md:text-4xl font-bold text-[#d4af37]">
              {formatarReal(META)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                Arrecadado
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {formatarReal(arrecadado)}
              </p>
            </div>
            <p className="text-sm text-gray-400">
              <span className="text-[#d4af37] font-semibold">{pagos}</span> de{" "}
              {TOTAL_NUMEROS} cotas confirmadas
            </p>
          </div>

          <div
            className="h-4 w-full rounded-full bg-black/60 border border-white/10 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progresso)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso da arrecadação"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c1121f] to-[#d4af37] transition-[width] duration-700 ease-out"
              style={{ width: `${progresso}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
            <span>
              <span className="text-emerald-400 font-semibold">{disponiveis}</span>{" "}
              disponíveis
            </span>
            <span>
              <span className="text-amber-400 font-semibold">{reservados}</span>{" "}
              reservadas
            </span>
            <span>
              <span className="text-[#c1121f] font-semibold">{pagos}</span> pagas
            </span>
          </div>
        </div>
      </section>

      {/* Seção "Sobre" — renderizada no servidor e recebida como children */}
      {children}

      {/* ─────────────── Grade de números ─────────────── */}
      <section id="numeros" className="w-full max-w-5xl mx-auto px-5 py-14 md:py-20">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-3">
          Escolha sua <span className="text-[#d4af37]">cota</span>
        </h2>
        <p className="text-center text-gray-400 mb-8 max-w-xl mx-auto">
          Clique em um número verde para reservá-lo. A confirmação do pagamento é
          feita manualmente pela organização.
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm">
          <span className="flex items-center gap-2 text-gray-300">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600" /> Disponível
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <span className="w-3.5 h-3.5 rounded bg-amber-500" /> Reservado
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <span className="w-3.5 h-3.5 rounded bg-[#c1121f]" /> Pago
          </span>
        </div>

        {erroCarga && (
          <p className="mb-6 rounded-xl border border-[#c1121f]/40 bg-[#c1121f]/10 px-4 py-3 text-center text-sm text-red-300">
            {erroCarga}
          </p>
        )}

        {carregando ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
            {numeros.map((numero) => (
              <button
                key={numero.id}
                type="button"
                onClick={() => abrirModal(numero)}
                disabled={numero.status !== "disponivel"}
                aria-label={`Número ${numero.id} — ${ROTULO_STATUS[numero.status]}`}
                title={ROTULO_STATUS[numero.status]}
                className={`aspect-square rounded-xl border font-bold text-base sm:text-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
                  ESTILO_NUMERO[numero.status]
                }`}
              >
                {String(numero.id).padStart(2, "0")}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────── Modal ─────────────── */}
      {selecionado !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget && !enviando) fecharModal();
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#d4af37]/30 bg-[#1a1a1a] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={fecharModal}
              disabled={enviando}
              aria-label="Fechar"
              className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>

            {etapa === "formulario" ? (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Cota número
                </p>
                <p
                  id="titulo-modal"
                  className="text-5xl font-bold text-[#d4af37] mb-1"
                >
                  {String(selecionado).padStart(2, "0")}
                </p>
                <p className="text-gray-400 mb-6">
                  {formatarReal(VALOR_COTA)} — preencha seus dados para reservar.
                </p>

                <form onSubmit={reservar} className="space-y-4">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm text-gray-300 mb-1.5"
                    >
                      Nome completo
                    </label>
                    <input
                      id="nome"
                      ref={primeiroCampo}
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      minLength={3}
                      maxLength={120}
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-300 mb-1.5"
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={160}
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="voce@email.com"
                    />
                  </div>

                  {erroForm && (
                    <p className="rounded-xl border border-[#c1121f]/40 bg-[#c1121f]/10 px-4 py-3 text-sm text-red-300">
                      {erroForm}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-[#c1121f] py-3.5 font-semibold text-white transition-colors hover:bg-[#a50f1a] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {enviando && <Loader2 className="w-4 h-4 animate-spin" />}
                    {enviando ? "Reservando..." : "Reservar esta cota"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                  <h3 id="titulo-modal" className="text-xl font-bold text-white">
                    Cota {String(selecionado).padStart(2, "0")} reservada!
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Agora faça o Pix de {formatarReal(VALOR_COTA)} para garantir
                    seu número.
                  </p>
                </div>

                {/* Aviso antes do QR: o valor NÃO vem embutido no código. */}
                <div className="mb-5 rounded-xl border-2 border-amber-400 bg-amber-400/15 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-amber-300">
                        Atenção
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-amber-100">
                        Ao escanear o QR Code no seu aplicativo do banco, você
                        precisará digitar o valor de{" "}
                        <strong className="font-bold text-white">
                          {formatarReal(VALOR_COTA)}
                        </strong>{" "}
                        manualmente. O QR Code não possui o valor embutido.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fundo branco garante o contraste que o leitor de QR precisa. */}
                <div className="mx-auto mb-5 w-52 max-w-full rounded-xl bg-white p-3">
                  <Image
                    src="/qrcode.webp"
                    alt={`QR Code do Pix para ${PIX.titular}`}
                    width={580}
                    height={580}
                    className="h-auto w-full"
                  />
                </div>

                <dl className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Chave Pix ({PIX.tipoChave})</dt>
                    <dd className="font-mono text-base font-semibold text-[#d4af37]">
                      {PIX.chave}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Titular</dt>
                    <dd className="font-medium text-white">{PIX.titular}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Banco</dt>
                    <dd className="font-medium text-white">{PIX.banco}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={copiarChave}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 py-3 font-semibold text-[#d4af37] transition-colors hover:bg-[#d4af37]/20"
                >
                  {copiado ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiado ? "Chave copiada!" : "Copiar Chave Pix"}
                </button>

                <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                  Feito o pagamento, é só aguardar. A confirmação é manual — assim
                  que a organização identificar o Pix, seu número passa a constar
                  como pago no site.
                </p>

                <button
                  type="button"
                  onClick={fecharModal}
                  className="mt-5 w-full rounded-xl border border-white/15 py-3 font-medium text-white transition-colors hover:bg-white/5"
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
