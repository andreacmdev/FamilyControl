import type { FinancialCategory, EntryStatus } from "@/types/database";

export const CATEGORY_CONFIG: Record<
  FinancialCategory,
  { label: string; color: string; dot: string }
> = {
  casa:          { label: "Casa",          color: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" },
  saude:         { label: "Saúde",         color: "bg-green-100 text-green-700",   dot: "bg-green-400" },
  transporte:    { label: "Transporte",    color: "bg-blue-100 text-blue-700",     dot: "bg-blue-400" },
  assinaturas:   { label: "Assinaturas",   color: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  igreja:        { label: "Igreja",        color: "bg-violet-100 text-violet-700", dot: "bg-violet-400" },
  mercado:       { label: "Mercado",       color: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
  pessoal:       { label: "Pessoal",       color: "bg-pink-100 text-pink-700",     dot: "bg-pink-400" },
  investimento:  { label: "Investimento",  color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  meta:          { label: "Meta",          color: "bg-cyan-100 text-cyan-700",     dot: "bg-cyan-400" },
  outros:        { label: "Outros",        color: "bg-zinc-100 text-zinc-600",     dot: "bg-zinc-400" },
};

export const STATUS_CONFIG: Record<
  EntryStatus,
  { label: string; color: string }
> = {
  pendente:   { label: "Pendente",  color: "bg-amber-100 text-amber-700" },
  pago:       { label: "Pago",      color: "bg-green-100 text-green-700" },
  cancelado:  { label: "Cancelado", color: "bg-zinc-100 text-zinc-500" },
};

/** Formata valor em Real brasileiro */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Retorna "Janeiro 2025" a partir de year/month */
export function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

/** Formata "2025-03-15" → "15/03" */
export function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}
