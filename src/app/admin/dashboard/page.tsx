import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { sessaoValida } from "@/lib/admin-auth";
import { criarClienteAdmin } from "@/lib/supabase-admin";
import { formatarReal, META, TOTAL_NUMEROS, VALOR_COTA, type Reserva } from "@/lib/rifa";

export const metadata = {
  title: "Painel · Rifa Solidária",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await sessaoValida())) {
    redirect("/admin/login");
  }

  let todosNumeros: Reserva[] = [];
  let erroBanco = "";

  try {
    const supabase = criarClienteAdmin();

    const { data, error } = await supabase
      .from("rifa_numeros")
      .select("id, status, nome_comprador, email_comprador, data_reserva")
      .order("id", { ascending: true });

    if (error) throw error;
    todosNumeros = (data ?? []) as Reserva[];
  } catch (erro) {
    console.error("Erro ao carregar o painel:", erro);
    erroBanco =
      erro instanceof Error ? erro.message : "Erro desconhecido ao ler o banco.";
  }

  return (
    <main
      className="min-h-screen bg-[#1a1a1a] p-4 text-white sm:p-6 md:p-8"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ver o site</span>
          </Link>
          <h1 className="text-2xl font-bold md:text-3xl text-white">
            Painel da Rifa
          </h1>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            Meta de {formatarReal(META)} · {TOTAL_NUMEROS} cotas de{" "}
            {formatarReal(VALOR_COTA)}
          </p>
        </header>

        {erroBanco && (
          <div className="mb-6 rounded-2xl border border-[#c1121f]/40 bg-[#c1121f]/10 p-4 text-sm text-red-300">
            <p className="font-semibold">Não foi possível ler o banco de dados.</p>
            <p className="mt-1 text-xs">
              Confira se a variável <code>SUPABASE_SERVICE_ROLE_KEY</code> está
              definida no ambiente.
            </p>
            <p className="mt-2 font-mono text-xs text-red-400/80">{erroBanco}</p>
          </div>
        )}

        <AdminDashboardClient numerosIniciais={todosNumeros} />
      </div>
    </main>
  );
}
