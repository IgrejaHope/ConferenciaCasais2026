"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, LogOut, X } from "lucide-react";
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

  async function sair() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={sair}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {erro && (
        <p className="mb-6 rounded-xl border border-[#c1121f]/40 bg-[#c1121f]/10 px-4 py-3 text-sm text-red-300">
          {erro}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {reservas.length === 0 ? (
          <p className="p-12 text-center text-gray-500">
            Nenhuma reserva aguardando confirmação.
          </p>
        ) : (
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
                  <tr key={reserva.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <span className="rounded-md border border-[#d4af37]/30 bg-[#d4af37]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#d4af37]">
                        {String(reserva.id).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-white">
                      {reserva.nome_comprador ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {reserva.email_comprador ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                      {formatarData(reserva.data_reserva)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => agir(reserva.id, "confirmar")}
                          disabled={processando !== null}
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
                          disabled={processando !== null}
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
        )}
      </div>
    </>
  );
}
