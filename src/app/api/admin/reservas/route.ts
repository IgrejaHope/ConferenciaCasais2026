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
    .select("id, status");

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

  return Response.json({ ok: true, id, status: alteracao.status });
}

export async function POST(request: Request) {
  if (!(await sessaoValida())) {
    return Response.json({ erro: "Não autorizado." }, { status: 401 });
  }

  let id: unknown;
  let nome: unknown;
  let email: unknown;
  let status: unknown;

  try {
    const corpo = await request.json();
    id = corpo?.id;
    nome = corpo?.nome;
    email = corpo?.email;
    status = corpo?.status;
  } catch {
    return Response.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || id > 50) {
    return Response.json({ erro: "Número de cota inválido." }, { status: 400 });
  }

  const nomeLimpo = typeof nome === "string" ? nome.trim() : "";
  if (nomeLimpo.length < 2) {
    return Response.json(
      { erro: "Informe o nome do comprador (pelo menos 2 caracteres)." },
      { status: 400 }
    );
  }

  const contatoLimpo = typeof email === "string" ? email.trim() : "";
  const statusDefinido = status === "reservado" ? "reservado" : "pago";
  const dataAgora = new Date().toISOString();

  const supabase = criarClienteAdmin();

  const { data, error } = await supabase
    .from("rifa_numeros")
    .update({
      status: statusDefinido,
      nome_comprador: nomeLimpo,
      email_comprador: contatoLimpo || null,
      data_reserva: dataAgora,
    })
    .eq("id", id)
    .eq("status", "disponivel")
    .select("id, status, nome_comprador, email_comprador, data_reserva");

  if (error) {
    console.error("Erro ao registrar cota manual:", error);
    return Response.json({ erro: "Erro ao registrar a cota no banco." }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return Response.json(
      { erro: `O número ${id} já não está mais disponível. Atualize a página.` },
      { status: 409 }
    );
  }

  return Response.json({ ok: true, reserva: data[0] });
}
