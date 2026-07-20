"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Validação com Zod
const formSchema = z.object({
  nome_ele: z.string().min(3, "Nome muito curto"),
  cpf_ele: z.string().length(14, "CPF inválido (14 caracteres)"),
  nome_ela: z.string().min(3, "Nome muito curto"),
  cpf_ela: z.string().length(14, "CPF inválido (14 caracteres)"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
});

export default function InscricaoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_ele: "",
      cpf_ele: "",
      nome_ela: "",
      cpf_ela: "",
      email: "",
      telefone: "",
    },
  });

  // Funções de máscara
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const generateTicket = () => {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${part1}-${part2}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMsg("");

    const ticketNumber = generateTicket();

    const { data, error } = await supabase.from("casais").insert({
      nome_ele: values.nome_ele,
      cpf_ele: values.cpf_ele,
      nome_ela: values.nome_ela,
      cpf_ela: values.cpf_ela,
      email: values.email,
      telefone: values.telefone,
      numero_inscricao: ticketNumber,
    });

    if (error) {
      setIsLoading(false);
      // Checar erro de unique
      if (error.code === "23505" || error.message.includes("unique")) {
        setErrorMsg("Um dos CPFs informados já está cadastrado.");
      } else {
        setErrorMsg("Ocorreu um erro ao salvar a inscrição. Tente novamente.");
      }
      return;
    }

    router.push(`/sucesso?ticket=${ticketNumber}`);
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-purple-900/10 to-black text-white flex flex-col items-center p-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="bg-zinc-950/60 backdrop-blur-md border-white/10 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
              Inscrição do Casal
            </CardTitle>
            <CardDescription className="text-gray-300">
              Preencha os dados abaixo para garantir a vaga na conferência.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {errorMsg && (
                  <div className="p-4 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-center text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300 border-b border-white/10 pb-2">
                    👨 Dados do Marido
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome_ele"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome dele" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf_ele"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">CPF</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="000.000.000-00" 
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                              {...field} 
                              onChange={(e) => field.onChange(maskCPF(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-fuchsia-300 border-b border-white/10 pb-2">
                    👩 Dados da Esposa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome_ela"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome dela" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf_ela"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">CPF</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="000.000.000-00" 
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                              {...field} 
                              onChange={(e) => field.onChange(maskCPF(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-300 border-b border-white/10 pb-2">
                    📞 Contato do Casal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="casal@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">WhatsApp</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(00) 00000-0000" 
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                              {...field} 
                              onChange={(e) => field.onChange(maskPhone(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-auto text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all border-0 disabled:opacity-50"
                >
                  {isLoading ? "Salvando inscrição..." : "Finalizar Inscrição"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
