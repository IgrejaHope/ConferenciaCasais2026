"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

// ── Validação ──────────────────────────────────────────────
const formSchema = z.object({
  nome_ele: z.string().min(3, "Nome muito curto"),
  cpf_ele: z.string().length(14, "CPF inválido"),
  nome_ela: z.string().min(3, "Nome muito curto"),
  cpf_ela: z.string().length(14, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
});

type FormValues = z.infer<typeof formSchema>;

// ── Estilos reutilizáveis ──────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: "14px",
  fontFamily: "var(--font-inter)",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#9ca3af",
  fontFamily: "var(--font-inter)",
};

// ── Máscaras ───────────────────────────────────────────────
const maskCPF = (v: string) =>
  v.replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");

const maskPhone = (v: string) =>
  v.replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");

const generateTicket = () =>
  `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// ── Componente de campo ────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && (
        <p style={{ marginTop: 4, fontSize: 12, color: "#f87171", fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Divisor de seção ───────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 4px" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#a78bfa",
        fontFamily: "var(--font-inter)",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

// ── Página principal ───────────────────────────────────────
export default function InscricaoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setErrorMsg("");
    const ticketNumber = generateTicket();

    const { error } = await supabase.from("casais").insert({
      ...values,
      numero_inscricao: ticketNumber,
    });

    if (error) {
      setIsLoading(false);
      if (error.code === "23505" || error.message.includes("unique")) {
        setErrorMsg("Um dos CPFs informados já está cadastrado.");
      } else {
        setErrorMsg("Erro ao salvar. Tente novamente.");
      }
      return;
    }

    router.push(`/sucesso?ticket=${ticketNumber}`);
  }

  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* ── Fundo com gradiente ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(162,28,175,0.12) 0%, transparent 55%), #000",
        }}
      />

      {/* ── Cabeçalho ── */}
      <header className="relative z-10 w-full px-5 pt-8 pb-2 flex justify-center">
        <Link href="/">
          <Image
            src="/logodotitulo.png"
            alt="Conferência de Casais 2026"
            width={200}
            height={100}
            className="h-14 w-auto object-contain"
          />
        </Link>
      </header>

      {/* ── Conteúdo ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pb-16 pt-4">
        <div className="w-full max-w-lg">

          {/* Título */}
          <div className="text-center mb-8">
            <h1
              className="text-white mb-2"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(26px, 7vw, 38px)",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Inscrições Encerradas
            </h1>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(15px, 4vw, 18px)",
              color: "#9ca3af",
              fontStyle: "italic",
            }}>
              Agradecemos pelo grande interesse! As vagas para a Conferência de Casais 2026 foram totalmente preenchidas.
            </p>
          </div>

          {/* Card de Inscrições Encerradas */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 20,
              padding: "36px 24px",
              backdropFilter: "blur(12px)",
              textAlign: "center",
            }}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
              🔒
            </div>

            <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Vagas Esgotadas
            </h2>

            <p className="text-sm text-gray-300 mb-6 leading-relaxed" style={{ fontFamily: "var(--font-inter)" }}>
              Não estamos mais aceitando novos cadastros no momento. Caso você já tenha se inscrito, pode visualizar e baixar seu ingresso a qualquer momento.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/meu-ingresso"
                className="w-full py-3.5 px-4 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 text-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a21caf)",
                  boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                🎟️ CONSULTAR MEU INGRESSO
              </Link>

              <Link
                href="/"
                className="w-full py-3.5 px-4 rounded-full text-sm font-medium text-gray-300 transition-all hover:bg-white/10 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                ← Voltar para a Página Inicial
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Estilo de focus nos inputs */}
      <style>{`
        .focus-input:focus {
          border-color: rgba(124,58,237,0.7) !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }
        .focus-input::placeholder { color: #4b5563; }
        .focus-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #0a0a0a inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </main>
  );
}
