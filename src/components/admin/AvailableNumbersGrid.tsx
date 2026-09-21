"use client";

import React, { useState } from "react";
import {
  Check,
  PlusCircle,
  X,
  Loader2,
  Sparkles,
  UserPlus,
  HelpCircle,
  Filter,
} from "lucide-react";
import { formatarReal, TOTAL_NUMEROS, VALOR_COTA, type Reserva } from "@/lib/rifa";

interface AvailableNumbersGridProps {
  todosNumeros: Reserva[];
  onManualReserve: (
    id: number,
    nome: string,
    email: string,
    status: "pago" | "reservado"
  ) => Promise<boolean>;
  processando: boolean;
}

export default function AvailableNumbersGrid({
  todosNumeros,
  onManualReserve,
  processando,
}: AvailableNumbersGridProps) {
  // Modo de exibição: "apenas_vagos" ou "visao_geral"
  const [modo, setModo] = useState<"apenas_vagos" | "visao_geral">("apenas_vagos");
  const [cotaParaReservar, setCotaParaReservar] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [statusInicial, setStatusInicial] = useState<"pago" | "reservado">("pago");
  const [erroForm, setErroForm] = useState("");

  const mapaStatus = new Map<number, Reserva>();
  todosNumeros.forEach((n) => mapaStatus.set(n.id, n));

  // Lista dos números 1..50
  const listaCompleta = Array.from({ length: TOTAL_NUMEROS }, (_, i) => {
    const id = i + 1;
    const item = mapaStatus.get(id);
    return {
      id,
      status: item?.status || "disponivel",
      nome: item?.nome_comprador || null,
    };
  });

  const disponiveis = listaCompleta.filter((n) => n.status === "disponivel");

  const abrirModalReserva = (id: number) => {
    setCotaParaReservar(id);
    setNome("");
    setContato("");
    setStatusInicial("pago");
    setErroForm("");
  };

  const fecharModal = () => {
    if (processando) return;
    setCotaParaReservar(null);
    setErroForm("");
  };

  const submeterReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cotaParaReservar) return;

    if (!nome.trim()) {
      setErroForm("Por favor, informe o nome do comprador.");
      return;
    }

    setErroForm("");
    const sucesso = await onManualReserve(
      cotaParaReservar,
      nome.trim(),
      contato.trim(),
      statusInicial
    );

    if (sucesso) {
      fecharModal();
    } else {
      setErroForm("Não foi possível reservar. O número pode ter sido ocupado.");
    }
  };

  const listaExibida = modo === "apenas_vagos" ? disponiveis : listaCompleta;

  return (
    <div className="space-y-4">
      {/* ═══════════ Cabeçalho com Filtro e Legenda ═══════════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white sm:text-lg">
            {disponiveis.length} {disponiveis.length === 1 ? "cota disponível" : "cotas disponíveis"}
          </h3>
          <p className="text-xs text-gray-400">
            Clique em qualquer cota vaga para registrar uma venda manual direta (dinheiro, PIX ou depósito).
          </p>
        </div>

        {/* Seletor de Modo */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs">
          <button
            type="button"
            onClick={() => setModo("apenas_vagos")}
            className={`min-h-[36px] rounded-lg px-3 font-medium transition-all ${
              modo === "apenas_vagos"
                ? "bg-[#d4af37] text-black shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Apenas Vagas ({disponiveis.length})
          </button>
          <button
            type="button"
            onClick={() => setModo("visao_geral")}
            className={`min-h-[36px] rounded-lg px-3 font-medium transition-all ${
              modo === "visao_geral"
                ? "bg-[#d4af37] text-black shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Grade 1 a 50
          </button>
        </div>
      </div>

      {/* Legenda quando em Visão Geral */}
      {modo === "visao_geral" && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-600" /> Disponível (clicável)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500" /> Reservado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#c1121f]" /> Pago
          </span>
        </div>
      )}

      {/* ═══════════ Grade Numérica Compacta e Responsiva ═══════════ */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:gap-2.5">
        {listaExibida.map((item) => {
          const isDisponivel = item.status === "disponivel";
          const isPago = item.status === "pago";
          const isReservado = item.status === "reservado";

          return (
            <button
              key={item.id}
              type="button"
              disabled={!isDisponivel}
              onClick={() => isDisponivel && abrirModalReserva(item.id)}
              title={
                isDisponivel
                  ? `Cota #${item.id} disponível - Clique para registrar manualmente`
                  : `Cota #${item.id} (${item.status}) - ${item.nome || "Ocupada"}`
              }
              className={`group relative flex min-h-[52px] flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all sm:min-h-[56px] ${
                isDisponivel
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-[#d4af37] hover:bg-emerald-500/25 hover:text-white active:scale-95 shadow-sm"
                  : isReservado
                  ? "cursor-not-allowed border-amber-500/30 bg-amber-500/10 text-amber-400/80"
                  : "cursor-not-allowed border-red-500/30 bg-red-500/10 text-red-400/70"
              }`}
            >
              <span className="font-mono text-base font-bold">
                {String(item.id).padStart(2, "0")}
              </span>

              {isDisponivel && (
                <span className="text-[9px] font-normal text-emerald-500/90 group-hover:text-emerald-300">
                  Vaga
                </span>
              )}
            </button>
          );
        })}
      </div>

      {disponiveis.length === 0 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center text-sm font-semibold text-emerald-300">
          🎉 Incrível! Todas as 50 cotas foram vendidas ou reservadas!
        </div>
      )}

      {/* ═══════════ Modal de Reserva Manual para o Admin ═══════════ */}
      {cotaParaReservar !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Registrar Cota #{String(cotaParaReservar).padStart(2, "0")}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Valor da cota: {formatarReal(VALOR_COTA)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submeterReserva} className="space-y-4">
              {erroForm && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
                  {erroForm}
                </div>
              )}

              <div>
                <label
                  htmlFor="nome_comprador_admin"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  Nome Completo do Comprador *
                </label>
                <input
                  id="nome_comprador_admin"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="min-h-[44px] w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contato_comprador_admin"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300"
                >
                  WhatsApp ou E-mail (Opcional)
                </label>
                <input
                  id="contato_comprador_admin"
                  type="text"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder="Ex: (63) 99999-9999 ou joao@email.com"
                  className="min-h-[44px] w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-sm text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">
                  Status da Cota
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusInicial("pago")}
                    className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      statusInicial === "pago"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm"
                        : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>Pago (Confirmado)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusInicial("reservado")}
                    className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                      statusInicial === "reservado"
                        ? "border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm"
                        : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>Reservado (Aguardar)</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={processando}
                  className="min-h-[44px] flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={processando}
                  className="min-h-[44px] flex-1 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-40"
                >
                  {processando ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                    </span>
                  ) : (
                    "Registrar Cota"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
