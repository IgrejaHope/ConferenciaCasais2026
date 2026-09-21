"use client";

import React, { useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  Target,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CreditCard,
  QrCode,
  Banknote,
} from "lucide-react";
import { formatarReal, META, TOTAL_NUMEROS, VALOR_COTA, type Reserva } from "@/lib/rifa";

interface FinancialSummaryProps {
  cotasPagas: Reserva[];
}

function formatarDataHora(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FinancialSummary({ cotasPagas }: FinancialSummaryProps) {
  const totalArrecadado = cotasPagas.length * VALOR_COTA;
  const porcentagemMeta = Math.min(
    100,
    Math.round((totalArrecadado / META) * 100)
  );
  const faltante = Math.max(0, META - totalArrecadado);
  const cotasRestantes = Math.max(0, TOTAL_NUMEROS - cotasPagas.length);

  // Compradores únicos
  const compradoresUnicos = useMemo(() => {
    const nomes = new Set<string>();
    cotasPagas.forEach((c) => {
      if (c.nome_comprador) nomes.add(c.nome_comprador.trim().toLowerCase());
    });
    return nomes.size || (cotasPagas.length > 0 ? 1 : 0);
  }, [cotasPagas]);

  const ticketMedioPorComprador =
    compradoresUnicos > 0 ? totalArrecadado / compradoresUnicos : VALOR_COTA;

  // Transações ordenadas da mais recente para a mais antiga
  const transacoesRecentes = useMemo(() => {
    return [...cotasPagas].sort((a, b) => {
      const dataA = a.data_reserva ? new Date(a.data_reserva).getTime() : 0;
      const dataB = b.data_reserva ? new Date(b.data_reserva).getTime() : 0;
      return dataB - dataA;
    });
  }, [cotasPagas]);

  return (
    <div className="space-y-6">
      {/* ═══════════ Barra de Progresso da Meta ═══════════ */}
      <div className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-white/[0.04] to-[#d4af37]/[0.02] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
              Progresso da Meta
            </span>
            <h3 className="mt-0.5 text-2xl font-bold text-white sm:text-3xl">
              {formatarReal(totalArrecadado)}{" "}
              <span className="text-sm font-normal text-gray-400">
                de {formatarReal(META)}
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1 font-mono text-sm font-bold text-[#d4af37]">
            <TrendingUp className="h-4 w-4" />
            <span>{porcentagemMeta}% Concluído</span>
          </div>
        </div>

        {/* Barra Visual */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-black/50 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#d4af37] to-emerald-400 transition-all duration-500"
            style={{ width: `${porcentagemMeta}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between text-xs text-gray-400">
          <span>{cotasPagas.length} de {TOTAL_NUMEROS} cotas pagas</span>
          <span>Faltam {formatarReal(faltante)} ({cotasRestantes} cotas)</span>
        </div>
      </div>

      {/* ═══════════ Cards de Indicadores Financeiros ═══════════ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Ticket Médio por Cota */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <DollarSign className="h-4 w-4 text-[#d4af37]" />
            <span>Valor por Cota</span>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {formatarReal(VALOR_COTA)}
          </p>
          <p className="mt-1 text-xs text-gray-400">Preço fixo de cada número</p>
        </div>

        {/* Ticket Médio por Comprador */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <Users className="h-4 w-4 text-emerald-400" />
            <span>Média p/ Participante</span>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {formatarReal(ticketMedioPorComprador)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {compradoresUnicos} {compradoresUnicos === 1 ? "participante único" : "participantes únicos"}
          </p>
        </div>

        {/* Faltante para 100% */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <Target className="h-4 w-4 text-amber-400" />
            <span>Restante para a Meta</span>
          </div>
          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {formatarReal(faltante)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {cotasRestantes} {cotasRestantes === 1 ? "cota restante" : "cotas restantes"}
          </p>
        </div>
      </div>

      {/* ═══════════ Histórico Cronológico de Transações ═══════════ */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#d4af37]" />
            <h4 className="text-sm font-semibold text-white sm:text-base">
              Histórico de Entradas Confirmadas
            </h4>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {transacoesRecentes.length} {transacoesRecentes.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        {transacoesRecentes.length === 0 ? (
          <p className="py-6 text-center text-xs text-gray-500">
            Nenhuma entrada confirmada até o momento.
          </p>
        ) : (
          <div className="space-y-2.5">
            {transacoesRecentes.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/30 p-3 text-xs transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-400">
                    #{String(t.id).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {t.nome_comprador || "Participante"}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {formatarDataHora(t.data_reserva)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    +{formatarReal(VALOR_COTA)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">
                    <QrCode className="h-2.5 w-2.5 text-[#d4af37]" />
                    <span>PIX / Venda</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
