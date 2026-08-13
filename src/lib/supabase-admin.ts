import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com a service role key — ignora RLS e enxerga a tabela inteira,
 * inclusive nome e e-mail dos compradores.
 *
 * Só pode ser importado de Route Handlers e Server Components. Nunca de um
 * arquivo com "use client", senão a chave vaza para o navegador.
 */
export function criarClienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidas."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
