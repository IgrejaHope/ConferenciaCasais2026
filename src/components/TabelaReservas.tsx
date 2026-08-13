"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, LogOut, Mail, RefreshCw, X } from "lucide-react";
import { formatarReal, VALOR_COTA, type Reserva } from "@/lib/rifa";

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

export default function TabelaReservas({ reservas }: { reservas: Reserva[] }) {
  const router = useRouter();
  const [processando, setProcessando] = useState<number | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  async function agir(id: number, acao: "confirmar" | "cancelar") {
    const pergunta =
      acao === "confirmar"
        ? `Confirmar o pagamento de ${formatarReal(VALOR_COTA)} da cota ${id}?`
        : `Cancelar a reserva da cota ${id}? O número volta a ficar disponível e os dados do comprador serão apagados.`;

    if (!confirm(pergunta)) return;

    setErro("");
    setProcessando(id);

    try {
      const resposta = await fetch("/api/admin/reservas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, acao }),
      });

      if (resposta.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        setErro(corpo.erro ?? "Não foi possível concluir a ação.");
        return;
      }

      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setProcessando(null);
    }
  }

  function atualizar() {
    setErro("");
    setAtualizando(true);
    router.refresh();
    // O refresh é assíncrono e não devolve promessa; o intervalo curto só
    // serve para o botão dar sinal de vida no toque.
    setTimeout(() => setAtualizando(false), 900);
  }

  async function sair() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const ocupado = processando !== null;

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={atualizar}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-300 transition-colors hover:bg-white/10 active:scale-95"
        >
          <RefreshCw
            className={`h-4 w-4 ${atualizando ? "animate-spin" : ""}`}
          />
          Atualizar
        </button>

        <button
          type="button"
          onClick={sair}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-300 transition-colors hover:bg-white/10 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {erro && (
        <p className="mb-5 rounded-xl border border-[#c1121f]/40 bg-[#c1121f]/10 px-4 py-3 text-sm text-red-300">
          {erro}
        </p>
      )}

      {reservas.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-gray-500">
          Nenhuma reserva aguardando confirmação.
        </div>
      ) : (
        <>
          {/* ═══════════ MOBILE: cartões ═══════════ */}
          <ul className="flex flex-col gap-3 md:hidden">
            {reservas.map((reserva) => (
              <li
                key={reserva.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 font-mono text-lg font-bold text-[#d4af37]">
                    {String(reserva.id).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-white">
                      {reserva.nome_comprador ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Reservou em {formatarData(reserva.data_reserva)}
                    </p>
                  </div>
                </div>

                {reserva.email_comprador && (
                  <a
                    href={`mailto:${reserva.email_comprador}`}
                    className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-gray-300 transition-colors active:bg-white/5"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-gray-500" />
                    <span className="min-w-0 break-all">
                      {reserva.email_comprador}
                    </span>
                  </a>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => agir(reserva.id, "confirmar")}
                    disabled={ocupado}
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white transition-colors active:scale-[0.98] disabled:opacity-40"
                  >
                    {processando === reserva.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                    Confirmar
                  </button>

                  <button
                    type="button"
                    onClick={() => agir(reserva.id, "cancelar")}
                    disabled={ocupado}
                    className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-[#c1121f]/50 bg-[#c1121f]/10 px-4 font-semibold text-red-300 transition-colors active:scale-[0.98] disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* ═══════════ DESKTOP: tabela ═══════════ */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-black/40">
                  <tr className="text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-4 font-semibold">Nº</th>
                    <th className="px-5 py-4 font-semibold">Comprador</th>
                    <th className="px-5 py-4 font-semibold">E-mail</th>
                    <th className="px-5 py-4 font-semibold">Data da reserva</th>
                    <th className="px-5 py-4 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservas.map((reserva) => (
                    <tr
                      key={reserva.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <span className="rounded-md border border-[#d4af37]/30 bg-[#d4af37]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#d4af37]">
                          {String(reserva.id).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-white">
                        {reserva.nome_comprador ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-gray-300">
                        {reserva.email_comprador ? (
                          <a
                            href={`mailto:${reserva.email_comprador}`}
                            className="hover:text-[#d4af37] hover:underline"
                          >
                            {reserva.email_comprador}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                        {formatarData(reserva.data_reserva)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => agir(reserva.id, "confirmar")}
                            disabled={ocupado}
                            title="Confirmar pagamento"
                            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:opacity-40"
                          >
                            {processando === reserva.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => agir(reserva.id, "cancelar")}
                            disabled={ocupado}
                            title="Cancelar reserva"
                            className="flex items-center gap-1.5 rounded-lg border border-[#c1121f]/40 bg-[#c1121f]/15 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-[#c1121f]/25 disabled:opacity-40"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
