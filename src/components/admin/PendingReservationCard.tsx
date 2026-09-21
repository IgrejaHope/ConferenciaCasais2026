"use client";

import React, { useState } from "react";
import { Check, Loader2, Mail, Phone, MessageCircle, X, AlertCircle } from "lucide-react";
import { formatarReal, VALOR_COTA, type Reserva } from "@/lib/rifa";

interface PendingReservationCardProps {
  reservas: Reserva[];
  onConfirm: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  processandoId: number | null;
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
  // Extrai apenas dígitos
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

export default function PendingReservationCard({
  reservas,
  onConfirm,
  onCancel,
  processandoId,
}: PendingReservationCardProps) {
  const [modalConfirmacao, setModalConfirmacao] = useState<{
    id: number;
    nome: string | null;
    acao: "confirmar" | "cancelar";
  } | null>(null);

  const executarAcaoModal = async () => {
    if (!modalConfirmacao) return;
    const { id, acao } = modalConfirmacao;
    setModalConfirmacao(null);
    if (acao === "confirmar") {
      await onConfirm(id);
    } else {
      await onCancel(id);
    }
  };

  if (reservas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center sm:p-14">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-white sm:text-lg">
          Nenhuma reserva pendente
        </h3>
        <p className="mt-1 max-w-sm text-xs text-gray-400 sm:text-sm">
          Todas as cotas reservadas foram confirmadas ou liberadas. As novas reservas feitas pelos compradores aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ═══════════ MOBILE VIEW: Cartões Otimizados ═══════════ */}
      <div className="flex flex-col gap-3.5 md:hidden">
        {reservas.map((reserva) => {
          const contato = extrairContato(reserva.email_comprador);
          const ocupado = processandoId === reserva.id;

          return (
            <div
              key={reserva.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-200"
            >
              <div className="flex items-start gap-3.5">
                {/* Badge circular em destaque com o número da cota */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/50 bg-amber-400/10 font-mono text-lg font-bold text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
                  #{String(reserva.id).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate text-base font-semibold text-white">
                      {reserva.nome_comprador || "Comprador sem nome"}
                    </h4>
                    <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                      Pendente
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Reservou em {formatarData(reserva.data_reserva)}
                  </p>
                </div>
              </div>

              {/* Contato do Comprador com Acesso Rápido */}
              {contato.link ? (
                <div className="mt-3.5">
                  <a
                    href={contato.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-gray-200 transition-colors hover:bg-white/5 active:scale-[0.99]"
                  >
                    {contato.isEmail ? (
                      <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                    ) : (
                      <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                    )}
                    <span className="min-w-0 flex-1 truncate font-mono">
                      {contato.texto}
                    </span>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {contato.isEmail ? "Enviar E-mail" : "WhatsApp"}
                    </span>
                  </a>
                </div>
              ) : (
                <div className="mt-3.5 flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Nenhum contato informado</span>
                </div>
              )}

              {/* Botões de Ação Direta com altura de toque segura */}
              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  disabled={processandoId !== null}
                  onClick={() =>
                    setModalConfirmacao({
                      id: reserva.id,
                      nome: reserva.nome_comprador,
                      acao: "confirmar",
                    })
                  }
                  className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-md shadow-emerald-950/40 transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-40"
                >
                  {ocupado ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>Confirmar</span>
                </button>

                <button
                  type="button"
                  disabled={processandoId !== null}
                  onClick={() =>
                    setModalConfirmacao({
                      id: reserva.id,
                      nome: reserva.nome_comprador,
                      acao: "cancelar",
                    })
                  }
                  className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 font-semibold text-red-300 transition-all hover:bg-red-500/20 active:scale-[0.98] disabled:opacity-40"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════ DESKTOP VIEW: Tabela Elegante ═══════════ */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-black/40">
            <tr className="text-xs uppercase tracking-wider text-gray-400">
              <th className="px-5 py-4 font-semibold">Cota</th>
              <th className="px-5 py-4 font-semibold">Comprador</th>
              <th className="px-5 py-4 font-semibold">Contato / Acesso</th>
              <th className="px-5 py-4 font-semibold">Data da Reserva</th>
              <th className="px-5 py-4 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reservas.map((reserva) => {
              const contato = extrairContato(reserva.email_comprador);
              const ocupado = processandoId === reserva.id;

              return (
                <tr
                  key={reserva.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  {/* Badge circular da Cota */}
                  <td className="px-5 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/50 bg-amber-400/10 font-mono text-sm font-bold text-amber-400 shadow-sm">
                      #{String(reserva.id).padStart(2, "0")}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-medium text-white">
                    {reserva.nome_comprador || "—"}
                  </td>

                  <td className="px-5 py-4">
                    {contato.link ? (
                      <a
                        href={contato.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-amber-400/40 hover:text-amber-300"
                      >
                        {contato.isEmail ? (
                          <Mail className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        <span className="font-mono">{contato.texto}</span>
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                    {formatarData(reserva.data_reserva)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={processandoId !== null}
                        onClick={() =>
                          setModalConfirmacao({
                            id: reserva.id,
                            nome: reserva.nome_comprador,
                            acao: "confirmar",
                          })
                        }
                        className="flex min-h-[38px] items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 active:scale-95 disabled:opacity-40"
                      >
                        {ocupado ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>Confirmar</span>
                      </button>

                      <button
                        type="button"
                        disabled={processandoId !== null}
                        onClick={() =>
                          setModalConfirmacao({
                            id: reserva.id,
                            nome: reserva.nome_comprador,
                            acao: "cancelar",
                          })
                        }
                        className="flex min-h-[38px] items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/15 px-3.5 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/25 active:scale-95 disabled:opacity-40"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmação Rápida */}
      {modalConfirmacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  modalConfirmacao.acao === "confirmar"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {modalConfirmacao.acao === "confirmar" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white">
                {modalConfirmacao.acao === "confirmar"
                  ? "Confirmar Pagamento?"
                  : "Cancelar Reserva?"}
              </h3>
            </div>

            <p className="text-sm leading-relaxed text-gray-300">
              {modalConfirmacao.acao === "confirmar" ? (
                <>
                  Deseja confirmar o pagamento da cota{" "}
                  <strong className="font-mono text-amber-400">
                    #{String(modalConfirmacao.id).padStart(2, "0")}
                  </strong>{" "}
                  para{" "}
                  <strong className="text-white">
                    {modalConfirmacao.nome || "o comprador"}
                  </strong>{" "}
                  no valor de{" "}
                  <strong className="text-emerald-400">
                    {formatarReal(VALOR_COTA)}
                  </strong>
                  ? O participante entrará na lista oficial do sorteio.
                </>
              ) : (
                <>
                  Deseja cancelar a reserva da cota{" "}
                  <strong className="font-mono text-amber-400">
                    #{String(modalConfirmacao.id).padStart(2, "0")}
                  </strong>
                  ? O número voltará imediatamente a ficar disponível para novos compradores.
                </>
              )}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalConfirmacao(null)}
                className="min-h-[44px] flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={executarAcaoModal}
                className={`min-h-[44px] flex-1 rounded-xl text-sm font-semibold text-white shadow-md ${
                  modalConfirmacao.acao === "confirmar"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {modalConfirmacao.acao === "confirmar"
                  ? "Sim, Confirmar"
                  : "Sim, Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
