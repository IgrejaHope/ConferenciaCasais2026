"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Users, Download, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Inscricao = {
  id: number;
  nome_ele: string;
  cpf_ele: string;
  nome_ela: string;
  cpf_ela: string;
  email: string;
  telefone: string;
  numero_inscricao: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar auth
    const auth = sessionStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("casais")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar dados:", error);
      } else if (data) {
        setInscricoes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  if (!isAuthenticated) return null;

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col p-4 md:p-8"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Image
            src="/logodotitulo.png"
            alt="Logo"
            width={120}
            height={60}
            className="w-[100px] h-auto object-contain hidden md:block"
          />
          <div>
            <h1 className="text-xl font-bold">Painel de Inscrições</h1>
            <p className="text-sm text-gray-400">Total: {inscricoes.length} casais</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 md:px-4 md:py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Ver Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 md:px-4 md:py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : inscricoes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-500">
            <Users className="w-12 h-12 mb-4 opacity-20" />
            <p>Nenhuma inscrição encontrada até o momento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-black/40 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Ticket</th>
                  <th className="px-6 py-4 font-medium">Marido</th>
                  <th className="px-6 py-4 font-medium">Esposa</th>
                  <th className="px-6 py-4 font-medium">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inscricoes.map((insc, idx) => (
                  <tr key={insc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(insc.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                        {insc.numero_inscricao}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{insc.nome_ele}</p>
                      <p className="text-xs text-gray-500">{insc.cpf_ele}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{insc.nome_ela}</p>
                      <p className="text-xs text-gray-500">{insc.cpf_ela}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300">{insc.telefone}</p>
                      <p className="text-xs text-gray-500">{insc.email}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
