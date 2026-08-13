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
    console.error("Falha na verificação da senha do admin:", erro);
    return Response.json(
      { erro: "Painel não configurado. Defina ADMIN_PASSWORD no ambiente." },
      { status: 500 }
    );
  }

  await abrirSessao();
  return Response.json({ ok: true });
}
