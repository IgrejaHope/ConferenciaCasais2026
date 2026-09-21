"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  id: string;
  rotulo: string;
  valor: string;
  destaque: string;
  icone?: LucideIcon;
  subtexto?: string;
  ativo: boolean;
  aoClicar: () => void;
  isMonetario?: boolean;
}

export default function MetricCard({
  id,
  rotulo,
  valor,
  destaque,
  icone: Icone,
  subtexto,
  ativo,
  aoClicar,
  isMonetario,
}: MetricCardProps) {
  // Para valores monetários, separamos o "R$" do valor numérico para tipografia fluida
  const formatarValorMonetario = (texto: string) => {
    if (!isMonetario) return <span className="truncate">{texto}</span>;

    const limpo = texto.replace("R$", "").trim();
    return (
      <span className="inline-flex min-w-0 items-baseline gap-1 truncate">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
          R$
        </span>
        <span className="truncate text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
          {limpo}
        </span>
      </span>
    );
  };

  return (
    <button
      id={`tab-${id}`}
      type="button"
      role="tab"
      aria-selected={ativo}
      aria-controls={`panel-${id}`}
      onClick={aoClicar}
      className={`group relative flex min-h-[96px] w-full flex-col justify-between overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-200 sm:p-4 md:p-5 ${
        ativo
          ? "border-[#d4af37]/80 bg-white/[0.08] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/60"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
      } active:scale-[0.99]`}
    >
      {/* Indicador de aba ativa */}
      {ativo && (
        <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4af37] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
        </span>
      )}

      {/* Cabeçalho do Card */}
      <div className="flex w-full items-center justify-between gap-1.5">
        <p className="line-clamp-1 text-[11px] font-medium uppercase tracking-wider text-gray-400 sm:text-xs">
          {rotulo}
        </p>
        {Icone && (
          <Icone
            className={`h-4 w-4 shrink-0 transition-colors ${
              ativo ? "text-[#d4af37]" : "text-gray-500 group-hover:text-gray-300"
            }`}
          />
        )}
      </div>

      {/* Valor Principal com proteção total contra overflow */}
      <div className="mt-2 min-w-0 max-w-full">
        <div
          className={`flex max-w-full items-baseline ${
            !isMonetario ? "text-xl font-bold sm:text-2xl" : ""
          } ${destaque}`}
        >
          {formatarValorMonetario(valor)}
        </div>

        {subtexto && (
          <p className="mt-1 truncate text-[11px] text-gray-400 sm:text-xs">
            {subtexto}
          </p>
        )}
      </div>

      {/* Linha indicadora inferior quando ativo */}
      <div
        className={`mt-2 h-0.5 w-full rounded-full transition-all duration-200 ${
          ativo ? "bg-gradient-to-r from-[#d4af37] to-amber-500" : "bg-transparent"
        }`}
      />
    </button>
  );
}
