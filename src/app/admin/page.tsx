import { redirect } from "next/navigation";
import { sessaoValida } from "@/lib/admin-auth";

/** Atalho: /admin leva direto ao painel, ou ao login se a sessão expirou. */
export default async function AdminPage() {
  redirect((await sessaoValida()) ? "/admin/dashboard" : "/admin/login");
}
