"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  Ticket,
  Coins,
  RefreshCw,
  LogOut,
  AlertCircle,
  Layers,
} from "lucide-react";
import MetricCard from "./MetricCard";
import PendingReservationCard from "./PendingReservationCard";
import ConfirmedDrawList from "./ConfirmedDrawList";
import AvailableNumbersGrid from "./AvailableNumbersGrid";
import FinancialSummary from "./FinancialSummary";
import { formatarReal, META, TOTAL_NUMEROS, VALOR_COTA, type Reserva } from "@/lib/rifa";

type Aba = "aguardando" | "pagas" | "disponiveis" | "arrecadado";

interface AdminDashboardClientProps {
  numerosIniciais: Reserva[];
}

export default function AdminDashboardClient({
  numerosIniciais,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [numeros, setNumeros] = useState<Reserva[]>(numerosIniciais);
  const [abaAtiva, setAbaAtiva] = useState<Aba>(() => {
    const temPendentes = numerosIniciais.some((n) => n.status === "reservado");
    return temPendentes ? "aguardando" : "pagas";
  });

  const [processandoAcaoId, setProcessandoAcaoId] = useState<number | null>(null);
  const [processandoManual, setProcessandoManual] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [toastSucesso, setToastSucesso] = useState("");

  const exibirToast = (msg: string) => {
    setToastSucesso(msg);
    setTimeout(() => setToastSucesso(""), 3500);
  };

  // Separação em listas calculadas em tempo real
  const { aguardando, pagas, disponiveis, arrecadado } = useMemo(() => {
    const aguardando = numeros.filter((n) => n.status === "reservado");
    const pagas = numeros.filter((n) => n.status === "pago");
    const disponiveis = numeros.filter((n) => n.status === "disponivel");
    const arrecadado = pagas.length * VALOR_COTA;

    return { aguardando, pagas, disponiveis, arrecadado };
  }, [numeros]);

  // Alternar aba com suporte a voltar para o estado padrão ao clicar na aba ativa
  const alternarAba = (abaClicada: Aba) => {
    if (abaAtiva === abaClicada) {
      // Se clicar no já ativo, volta para "aguardando" (se houver pendentes) ou "pagas"
      const padrao: Aba = aguardando.length > 0 ? "aguardando" : "pagas";
      setAbaAtiva(padrao);
    } else {
      setAbaAtiva(abaClicada);
    }
  };

  // Ação otimista: Confirmar pagamento
  const handleConfirmar = async (id: number) => {
    setMensagemErro("");
    setProcessandoAcaoId(id);

    // Salva estado anterior para rollback em caso de falha
    const estadoAnterior = [...numeros];

    // Atualização otimista
    setNumeros((antigo) =>
      antigo.map((n) => (n.id === id ? { ...n, status: "pago" } : n))
    );

    try {
      const res = await fetch("/api/admin/reservas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, acao: "confirmar" }),
      });

      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!res.ok) {
        const corpo = await res.json().catch(() => ({}));
        setNumeros(estadoAnterior);
        setMensagemErro(corpo.erro || "Falha ao confirmar cota.");
        return;
      }

      exibirToast(`Cota #${id} confirmada com sucesso!`);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setNumeros(estadoAnterior);
      setMensagemErro("Falha de conexão ao confirmar cota.");
    } finally {
      setProcessandoAcaoId(null);
    }
  };

  // Ação otimista: Cancelar reserva
  const handleCancelar = async (id: number) => {
    setMensagemErro("");
    setProcessandoAcaoId(id);

    const estadoAnterior = [...numeros];

    // Atualização otimista: volta para disponível e limpa dados
    setNumeros((antigo) =>
      antigo.map((n) =>
        n.id === id
          ? {
              ...n,
              status: "disponivel",
              nome_comprador: null,
              email_comprador: null,
              data_reserva: null,
            }
          : n
      )
    );

    try {
      const res = await fetch("/api/admin/reservas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, acao: "cancelar" }),
      });

      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!res.ok) {
        const corpo = await res.json().catch(() => ({}));
        setNumeros(estadoAnterior);
        setMensagemErro(corpo.erro || "Falha ao cancelar reserva.");
        return;
      }

      exibirToast(`Reserva da cota #${id} cancelada. Número liberado!`);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setNumeros(estadoAnterior);
      setMensagemErro("Falha de conexão ao cancelar reserva.");
    } finally {
      setProcessandoAcaoId(null);
    }
  };

  // Ação: Reserva Manual Direta pelo Admin
  const handleReservaManual = async (
    id: number,
    nome: string,
    email: string,
    status: "pago" | "reservado"
  ): Promise<boolean> => {
    setMensagemErro("");
    setProcessandoManual(true);

    try {
      const res = await fetch("/api/admin/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nome, email, status }),
      });

      if (res.status === 401) {
        router.replace("/admin/login");
        return false;
      }

      const corpo = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMensagemErro(corpo.erro || "Falha ao registrar cota.");
        return false;
      }

      // Atualiza lista com o registro retornado
      const novoItem: Reserva = corpo.reserva || {
        id,
        status,
        nome_comprador: nome,
        email_comprador: email || null,
        data_reserva: new Date().toISOString(),
      };

      setNumeros((antigo) =>
        antigo.map((n) => (n.id === id ? novoItem : n))
      );

      exibirToast(
        `Cota #${id} registrada como ${
          status === "pago" ? "Paga" : "Reservada"
        } com sucesso!`
      );

      startTransition(() => {
        router.refresh();
      });

      return true;
    } catch {
      setMensagemErro("Erro de rede ao registrar cota manual.");
      return false;
    } finally {
      setProcessandoManual(false);
    }
  };

  const handleAtualizar = () => {
    setMensagemErro("");
    setAtualizando(true);
    startTransition(() => {
      router.refresh();
    });
    setTimeout(() => {
      setAtualizando(false);
      exibirToast("Painel sincronizado.");
    }, 800);
  };

  const handleSair = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="w-full space-y-6">
      {/* ═══════════ Cards de Métricas Interativos (Tabs) ═══════════ */}
      <div
        role="tablist"
        aria-label="Filtros e Métricas do Painel"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4"
      >
        <MetricCard
          id="aguardando"
          rotulo="Aguardando Confirmação"
          valor={String(aguardando.length)}
          destaque="text-amber-400"
          icone={Clock}
          subtexto={aguardando.length === 1 ? "1 reserva pendente" : `${aguardando.length} reservas`}
          ativo={abaAtiva === "aguardando"}
          aoClicar={() => alternarAba("aguardando")}
        />

        <MetricCard
          id="pagas"
          rotulo="Cotas Pagas"
          valor={`${pagas.length} de ${TOTAL_NUMEROS}`}
          destaque="text-emerald-400"
          icone={CheckCircle2}
          subtexto="Lista oficial sorteio"
          ativo={abaAtiva === "pagas"}
          aoClicar={() => alternarAba("pagas")}
        />

        <MetricCard
          id="disponiveis"
          rotulo="Cotas Disponíveis"
          valor={String(disponiveis.length)}
          destaque="text-white"
          icone={Ticket}
          subtexto="Venda manual / livre"
          ativo={abaAtiva === "disponiveis"}
          aoClicar={() => alternarAba("disponiveis")}
        />

        <MetricCard
          id="arrecadado"
          rotulo="Arrecadado"
          valor={formatarReal(arrecadado)}
          destaque="text-[#d4af37]"
          icone={Coins}
          subtexto={`Meta: ${formatarReal(META)}`}
          ativo={abaAtiva === "arrecadado"}
          aoClicar={() => alternarAba("arrecadado")}
          isMonetario
        />
      </div>

      {/* ═══════════ Barra de Ações Rápidas (Atualizar / Sair) ═══════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Indicador da Aba Ativa */}
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#d4af37]" />
          <span className="text-sm font-semibold text-gray-200">
            {abaAtiva === "aguardando" && "Reservas Aguardando Confirmação"}
            {abaAtiva === "pagas" && "Cotas Pagas · Lista Oficial para Sorteio"}
            {abaAtiva === "disponiveis" && "Grade de Cotas Disponíveis"}
            {abaAtiva === "arrecadado" && "Extrato Financeiro e Transações"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAtualizar}
            disabled={atualizando || isPending}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${atualizando || isPending ? "animate-spin" : ""}`}
            />
            <span>Atualizar</span>
          </button>

          <button
            type="button"
            onClick={handleSair}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* ═══════════ Mensagens de Feedback (Erro e Sucesso) ═══════════ */}
      {mensagemErro && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Atenção</p>
            <p className="mt-0.5 text-xs">{mensagemErro}</p>
          </div>
          <button
            type="button"
            onClick={() => setMensagemErro("")}
            className="text-xs text-red-400 hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      {toastSucesso && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-xs font-medium text-emerald-300 shadow-lg">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{toastSucesso}</span>
        </div>
      )}

      {/* ═══════════ Painel de Conteúdo Contextual ═══════════ */}
      <div
        role="tabpanel"
        id={`panel-${abaAtiva}`}
        aria-labelledby={`tab-${abaAtiva}`}
        className="transition-opacity duration-200"
      >
        {abaAtiva === "aguardando" && (
          <PendingReservationCard
            reservas={aguardando}
            onConfirm={handleConfirmar}
            onCancel={handleCancelar}
            processandoId={processandoAcaoId}
          />
        )}

        {abaAtiva === "pagas" && (
          <ConfirmedDrawList cotasPagas={pagas} />
        )}

        {abaAtiva === "disponiveis" && (
          <AvailableNumbersGrid
            todosNumeros={numeros}
            onManualReserve={handleReservaManual}
            processando={processandoManual}
          />
        )}

        {abaAtiva === "arrecadado" && (
          <FinancialSummary cotasPagas={pagas} />
        )}
      </div>
    </div>
  );
}
