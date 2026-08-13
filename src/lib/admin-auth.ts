import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const NOME_COOKIE = "rifa_admin";
const DURACAO_SEGUNDOS = 60 * 60 * 8; // 8 horas

function senhaConfigurada() {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha) {
    throw new Error("ADMIN_PASSWORD precisa estar definida no ambiente.");
  }
  return senha;
}

/** Token derivado da senha. Sem conhecer ADMIN_PASSWORD não dá para forjar. */
function tokenDaSessao() {
  return createHmac("sha256", senhaConfigurada())
    .update("rifa-admin-v1")
    .digest("hex");
}

function comparaSeguro(a: string, b: string) {
  // Passa pelo HMAC antes de comparar para que os buffers tenham sempre o
  // mesmo tamanho — timingSafeEqual lança exceção com tamanhos diferentes.
  const ha = createHmac("sha256", "comparacao").update(a).digest();
  const hb = createHmac("sha256", "comparacao").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function senhaConfere(entrada: string) {
  return comparaSeguro(entrada, senhaConfigurada());
}

export async function abrirSessao() {
  const jar = await cookies();
  jar.set(NOME_COOKIE, tokenDaSessao(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_SEGUNDOS,
  });
}

export async function encerrarSessao() {
  const jar = await cookies();
  jar.delete(NOME_COOKIE);
}

export async function sessaoValida() {
  const valor = (await cookies()).get(NOME_COOKIE)?.value;
  if (!valor) return false;

  try {
    return comparaSeguro(valor, tokenDaSessao());
  } catch {
    return false;
  }
}
