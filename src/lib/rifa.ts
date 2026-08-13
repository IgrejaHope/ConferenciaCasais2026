export const TOTAL_NUMEROS = 50;
export const VALOR_COTA = 1000;
export const META = TOTAL_NUMEROS * VALOR_COTA;

export const PIX = {
  chave: "538.811.171-72",
  tipoChave: "CPF",
  titular: "Sebastião Tertuliano Filho",
  banco: "Banco do Brasil",
} as const;

export type StatusNumero = "disponivel" | "reservado" | "pago";

export type NumeroPublico = {
  id: number;
  status: StatusNumero;
};

export type Reserva = {
  id: number;
  status: StatusNumero;
  nome_comprador: string | null;
  email_comprador: string | null;
  data_reserva: string | null;
};

export function formatarReal(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
