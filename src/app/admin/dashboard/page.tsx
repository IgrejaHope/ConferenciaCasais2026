"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Users, Download, ArrowLeft, Trash2, MessageCircle, AlertCircle } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

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
        setErrorMsg("Erro ao buscar inscrições.");
      } else if (data) {
        setInscricoes(data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Falha de conexão com o banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  const formatWhatsAppNumber = (phone: string) => {
    return phone.replace(/\D/g, ''); // Remove tudo que não for número
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita.")) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("casais")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Erro ao excluir inscrição.");
        console.error(error);
      } else {
        // Remover da lista local
        setInscricoes((prev) => prev.filter((insc) => insc.id !== id));
      }
    } catch (err) {
      alert("Erro interno ao tentar excluir.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main
      className="min-h-screen bg-[#050505] text-white flex flex-col p-4 md:p-8"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* Background Decorativo */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(124,58,237,0.15) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(162,28,175,0.1) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col h-full flex-1">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-5">
            <div className="hidden md:flex w-16 h-16 bg-white/5 rounded-2xl items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Painel de Controle
              </h1>
              <p className="text-sm text-purple-400 font-medium tracking-wide mt-1 uppercase">
                Conferência de Casais 2026
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Resumo/Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Total de Casais</p>
            <p className="text-4xl font-bold text-white font-mono">{inscricoes.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-purple-400 mb-1">Total de Pessoas</p>
            <p className="text-4xl font-bold text-white font-mono">{inscricoes.length * 2}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-widest text-amber-400 mb-1">Alimentos (Estimativa)</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-white font-mono">{inscricoes.length * 5}</p>
              <p className="text-sm text-gray-400 mb-1">KG</p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Tabela de Inscrições */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col shadow-xl">
          {loading ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
            </div>
          ) : inscricoes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-500">
              <Users className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Nenhuma inscrição registrada ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/60 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Ingresso</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Data</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Marido</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Esposa</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs">Contato (WhatsApp)</th>
                    <th className="px-6 py-4 font-semibold text-gray-300 uppercase tracking-wider text-xs text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inscricoes.map((insc) => (
                    <tr key={insc.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                          {insc.numero_inscricao}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(insc.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{insc.nome_ele}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{insc.cpf_ele}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{insc.nome_ela}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{insc.cpf_ela}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-200">{insc.telefone}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{insc.email}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`https://wa.me/55${formatWhatsAppNumber(insc.telefone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/20"
                            title="Chamar no WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(insc.id)}
                            disabled={deletingId === insc.id}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                            title="Excluir Inscrição"
                          >
                            {deletingId === insc.id ? (
                              <div className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
