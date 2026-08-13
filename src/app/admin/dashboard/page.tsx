import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TabelaReservas from "@/components/TabelaReservas";
import { sessaoValida } from "@/lib/admin-auth";
import { criarClienteAdmin } from "@/lib/supabase-admin";
import { formatarReal, META, TOTAL_NUMEROS, VALOR_COTA, type Reserva } from "@/lib/rifa";

export const metadata = {
  title: "Painel · Rifa Solidária",
};

export default async function AdminDashboardPage() {
  if (!(await sessaoValida())) {
    redirect("/admin/login");
  }

  let reservas: Reserva[] = [];
  let todos: { status: string }[] = [];
  let erroBanco = "";

  try {
    const supabase = criarClienteAdmin();

    const [reservasResposta, contagemResposta] = await Promise.all([
      supabase
        .from("rifa_numeros")
        .select("id, status, nome_comprador, email_comprador, data_reserva")
        .eq("status", "reservado")
        .order("data_reserva", { ascending: true }),
      supabase.from("rifa_numeros").select("status"),
    ]);

    const falha = reservasResposta.error ?? contagemResposta.error;
    if (falha) throw falha;

    reservas = (reservasResposta.data ?? []) as Reserva[];
    todos = (contagemResposta.data ?? []) as { status: string }[];
  } catch (erro) {
    console.error("Erro ao carregar o painel:", erro);
    erroBanco =
      erro instanceof Error ? erro.message : "Erro desconhecido ao ler o banco.";
  }

  const pagos = todos.filter((n) => n.status === "pago").length;
  const disponiveis = todos.filter((n) => n.status === "disponivel").length;

  const cartoes = [
    { rotulo: "Aguardando confirmação", valor: String(reservas.length), destaque: "text-amber-400" },
    { rotulo: "Cotas pagas", valor: `${pagos} de ${TOTAL_NUMEROS}`, destaque: "text-emerald-400" },
    { rotulo: "Cotas disponíveis", valor: String(disponiveis), destaque: "text-white" },
    { rotulo: "Arrecadado", valor: formatarReal(pagos * VALOR_COTA), destaque: "text-[#d4af37]" },
  ];

  return (
    <main
      className="min-h-screen bg-[#1a1a1a] p-5 text-white md:p-8"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver o site
          </Link>
          <h1 className="text-2xl font-bold md:text-3xl">Painel da Rifa</h1>
          <p className="mt-1 text-sm text-gray-400">
            Meta de {formatarReal(META)} · {TOTAL_NUMEROS} cotas de{" "}
            {formatarReal(VALOR_COTA)}
          </p>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cartoes.map((cartao) => (
            <div
              key={cartao.rotulo}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                {cartao.rotulo}
              </p>
              <p className={`text-2xl font-bold ${cartao.destaque}`}>{cartao.valor}</p>
            </div>
          ))}
        </div>

        {erroBanco && (
          <div className="mb-6 rounded-xl border border-[#c1121f]/40 bg-[#c1121f]/10 px-4 py-3 text-sm text-red-300">
            <p className="font-semibold">Não foi possível ler o banco.</p>
            <p className="mt-1">
              Confira se a variável <code>SUPABASE_SERVICE_ROLE_KEY</code> está
              definida e se o script <code>supabase/schema.sql</code> já foi
              executado no Supabase.
            </p>
            <p className="mt-2 font-mono text-xs text-red-400/80">{erroBanco}</p>
          </div>
        )}

        <TabelaReservas reservas={reservas} />
      </div>
    </main>
  );
}
