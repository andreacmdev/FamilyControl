import type { AgendaCategory } from "@/types/database";

export const CATEGORY_CONFIG: Record<
  AgendaCategory,
  { label: string; color: string; dot: string }
> = {
  familia:    { label: "Família",    color: "bg-rose-100 text-rose-700",     dot: "bg-rose-400" },
  igreja:     { label: "Igreja",     color: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  saude:      { label: "Saúde",      color: "bg-green-100 text-green-700",   dot: "bg-green-400" },
  trabalho:   { label: "Trabalho",   color: "bg-blue-100 text-blue-700",     dot: "bg-blue-400" },
  financeiro: { label: "Financeiro", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  casa:       { label: "Casa",       color: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" },
  outros:     { label: "Outros",     color: "bg-zinc-100 text-zinc-600",     dot: "bg-zinc-400" },
};

/** Formata "2025-03-30" → "30 de março" */
export function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });
}

/** Formata "2025-03-30" → "dom., 30/03" */
export function formatEventDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

/** Formata "14:30:00" → "14:30" */
export function formatEventTime(timeStr: string | null): string | null {
  if (!timeStr) return null;
  return timeStr.slice(0, 5);
}

/** Retorna true se a data (YYYY-MM-DD) é hoje */
export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}
