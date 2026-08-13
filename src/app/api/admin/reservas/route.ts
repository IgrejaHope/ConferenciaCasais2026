import { sessaoValida } from "@/lib/admin-auth";
import { criarClienteAdmin } from "@/lib/supabase-admin";

type Acao = "confirmar" | "cancelar";

export async function PATCH(request: Request) {
  if (!(await sessaoValida())) {
    return Response.json({ erro: "Não autorizado." }, { status: 401 });
  }

  let id: unknown;
  let acao: unknown;

  try {
    const corpo = await request.json();
    id = corpo?.id;
    acao = corpo?.acao;
  } catch {
    return Response.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || id > 50) {
    return Response.json({ erro: "Número inválido." }, { status: 400 });
  }

  if (acao !== "confirmar" && acao !== "cancelar") {
    return Response.json({ erro: "Ação inválida." }, { status: 400 });
  }

  const alteracao =
    (acao as Acao) === "confirmar"
      ? { status: "pago" as const }
      : {
          status: "disponivel" as const,
          nome_comprador: null,
          email_comprador: null,
          data_reserva: null,
        };

  const supabase = criarClienteAdmin();

  // O filtro por status = 'reservado' impede que um duplo clique (ou uma aba
  // com a lista desatualizada) mexa num número que já mudou de estado.
  const { data, error } = await supabase
    .from("rifa_numeros")
    .update(alteracao)
    .eq("id", id)
    .eq("status", "reservado")
    .select("id");

  if (error) {
    console.error("Erro ao atualizar reserva:", error);
    return Response.json({ erro: "Erro ao atualizar o número." }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return Response.json(
      { erro: `O número ${id} não está mais reservado. Atualize a página.` },
      { status: 409 }
    );
  }

  return Response.json({ ok: true });
}
