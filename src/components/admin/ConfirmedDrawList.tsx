"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Copy,
  Check,
  Trophy,
  Mail,
  Phone,
  MessageCircle,
  FileSpreadsheet,
} from "lucide-react";
import { formatarReal, VALOR_COTA, type Reserva } from "@/lib/rifa";

interface ConfirmedDrawListProps {
  cotasPagas: Reserva[];
}

function formatarData(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extrairContato(contato: string | null) {
  if (!contato) return { isEmail: false, isPhone: false, link: null, texto: "—" };
  const ehEmail = contato.includes("@");
  const digitos = contato.replace(/\D/g, "");
  const ehTelefone = !ehEmail && digitos.length >= 8;

  if (ehEmail) {
    return {
      isEmail: true,
      isPhone: false,
      link: `mailto:${contato}`,
      texto: contato,
    };
  }

  if (ehTelefone) {
    const ddi = digitos.length <= 11 ? `55${digitos}` : digitos;
    return {
      isEmail: false,
      isPhone: true,
      link: `https://wa.me/${ddi}`,
      texto: contato,
    };
  }

  return { isEmail: false, isPhone: false, link: null, texto: contato };
}

export default function ConfirmedDrawList({ cotasPagas }: ConfirmedDrawListProps) {
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState(false);

  // Ordena por número da cota crescente
  const cotasOrdenadas = useMemo(() => {
    return [...cotasPagas].sort((a, b) => a.id - b.id);
  }, [cotasPagas]);

  // Filtro instantâneo por nome, e-mail/contato ou número da cota
  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return cotasOrdenadas;

    return cotasOrdenadas.filter((cota) => {
      const numStr = String(cota.id);
      const numPadded = String(cota.id).padStart(2, "0");
      const nome = (cota.nome_comprador || "").toLowerCase();
      const contato = (cota.email_comprador || "").toLowerCase();

      return (
        numStr.includes(termo) ||
        numPadded.includes(termo) ||
        nome.includes(termo) ||
        contato.includes(termo)
      );
    });
  }, [cotasOrdenadas, busca]);

  // Copiar lista formatada no padrão [Número] - [Nome]
  const copiarListaSorteio = async () => {
    if (cotasOrdenadas.length === 0) return;

    const texto = cotasOrdenadas
      .map(
        (c) =>
          `[${String(c.id).padStart(2, "0")}] - ${c.nome_comprador || "Participante"}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback para navegadores sem permissão de clipboard direto
      const textarea = document.createElement("textarea");
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  // Gerar e baixar arquivo CSV para sorteio
  const baixarCSV = () => {
    if (cotasOrdenadas.length === 0) return;

    const cabecalho = "Cota,Nome do Participante,Contato / E-mail,Data Confirmacao\n";
    const linhas = cotasOrdenadas
      .map((c) => {
        const id = `"${String(c.id).padStart(2, "0")}"`;
        const nome = `"${(c.nome_comprador || "").replace(/"/g, '""')}"`;
        const contato = `"${(c.email_comprador || "").replace(/"/g, '""')}"`;
        const data = `"${formatarData(c.data_reserva)}"`;
        return `${id},${nome},${contato},${data}`;
      })
      .join("\n");

    const conteudo = "\uFEFF" + cabecalho + linhas; // BOM para Excel em português
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lista-sorteio-rifa-solidaria-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* ═══════════ Barra de Ações: Busca + Exportação ═══════════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Campo de Busca Instantânea */}
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número, nome ou contato..."
            className="min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#d4af37]/60 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/60"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Botões de Exportação com toque mínimo de 44px */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copiarListaSorteio}
            title="Copiar lista no formato [Número] - [Nome]"
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 text-xs font-semibold text-gray-200 transition-colors hover:bg-white/10 active:scale-[0.98] sm:flex-none"
          >
            {copiado ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Lista Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#d4af37]" />
                <span>Copiar p/ Sorteio</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={baixarCSV}
            title="Baixar planilha CSV com todos os dados"
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 active:scale-[0.98] sm:flex-none"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Baixar CSV</span>
          </button>
        </div>
      </div>

      {/* Status da Filtragem */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Trophy className="h-3.5 w-3.5 text-[#d4af37]" />
          <span>
            {cotasPagas.length} {cotasPagas.length === 1 ? "cota confirmada" : "cotas confirmadas"} no sorteio
          </span>
        </span>
        {busca && (
          <span className="text-amber-400 font-mono">
            {filtradas.length} encontrada{filtradas.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {/* ═══════════ MOBILE: Cartões ═══════════ */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtradas.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-xs text-gray-500">
            Nenhuma cota encontrada com o termo &ldquo;{busca}&rdquo;.
          </div>
        ) : (
          filtradas.map((cota) => {
            const contato = extrairContato(cota.email_comprador);

            return (
              <div
                key={cota.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-emerald-500/15 font-mono text-base font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                    #{String(cota.id).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="truncate text-base font-semibold text-white">
                        {cota.nome_comprador || "Participante"}
                      </h4>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {formatarReal(VALOR_COTA)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Confirmado em {formatarData(cota.data_reserva)}
                    </p>
                  </div>
                </div>

                {contato.link && (
                  <div className="mt-3">
                    <a
                      href={contato.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[40px] items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-gray-300 transition-colors active:bg-white/5"
                    >
                      {contato.isEmail ? (
                        <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      ) : (
                        <MessageCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      )}
                      <span className="truncate font-mono">{contato.texto}</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ═══════════ DESKTOP: Tabela Oficial ═══════════ */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-black/40">
            <tr className="text-xs uppercase tracking-wider text-gray-400">
              <th className="px-5 py-4 font-semibold">Cota</th>
              <th className="px-5 py-4 font-semibold">Participante</th>
              <th className="px-5 py-4 font-semibold">Contato / E-mail</th>
              <th className="px-5 py-4 font-semibold">Valor Pago</th>
              <th className="px-5 py-4 text-right font-semibold">Data Confirmação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Nenhum resultado encontrado para &ldquo;{busca}&rdquo;.
                </td>
              </tr>
            ) : (
              filtradas.map((cota) => {
                const contato = extrairContato(cota.email_comprador);

                return (
                  <tr
                    key={cota.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-400 shadow-sm">
                        #{String(cota.id).padStart(2, "0")}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-white">
                      {cota.nome_comprador || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {contato.link ? (
                        <a
                          href={contato.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                        >
                          {contato.isEmail ? (
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                          ) : (
                            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                          <span className="font-mono">{contato.texto}</span>
                        </a>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-emerald-400">
                      {formatarReal(VALOR_COTA)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right text-gray-400">
                      {formatarData(cota.data_reserva)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
