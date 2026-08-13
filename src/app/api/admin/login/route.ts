import { abrirSessao, senhaConfere } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let senha = "";

  try {
    const corpo = await request.json();
    senha = typeof corpo?.senha === "string" ? corpo.senha : "";
  } catch {
    return Response.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  if (!senha) {
    return Response.json({ erro: "Informe a senha." }, { status: 400 });
  }

  try {
    if (!senhaConfere(senha)) {
      return Response.json({ erro: "Senha incorreta." }, { status: 401 });
    }
  } catch (erro) {
    // O detalhe técnico fica no log do servidor; quem está na tela vê algo
    // que dá para entender e agir.
    console.error(
      "ADMIN_PASSWORD não está definida no ambiente — o login não tem como funcionar.",
      erro
    );
    return Response.json(
      {
        erro: "O painel ainda não foi liberado neste site. Fale com quem cuida da página.",
      },
      { status: 503 }
    );
  }

  await abrirSessao();
  return Response.json({ ok: true });
}
