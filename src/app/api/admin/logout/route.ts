import { encerrarSessao } from "@/lib/admin-auth";

export async function POST() {
  await encerrarSessao();
  return Response.json({ ok: true });
}
