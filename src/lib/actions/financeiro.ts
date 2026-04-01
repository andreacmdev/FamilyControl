import { createClient } from "@/lib/supabase/client";
import type { EntryType, FinancialCategory, EntryStatus } from "@/types/database";

// ─── Nota mensal ──────────────────────────────────────────────────────────────

export async function upsertMonthlyNote(year: number, month: number, content: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("monthly_notes")
    .upsert({ year, month, content }, { onConflict: "year,month" });
  if (error) throw new Error(error.message);
}

// ─── Lançamentos financeiros ──────────────────────────────────────────────────

export interface EntryPayload {
  entry_type: EntryType;
  description: string;
  amount: number;
  due_date?: string;
  category: FinancialCategory;
  status: EntryStatus;
  is_recurring: boolean;
  recurring_until?: string;
  notes?: string;
}

/** Gera array de datas mensais entre due_date e recurring_until (formato "YYYY-MM") */
function buildRecurringDates(dueDateStr: string, recurringUntil: string): string[] {
  const [startYear, startMonth, startDay] = dueDateStr.split("-").map(Number);
  const [endYear, endMonth] = recurringUntil.split("-").map(Number);

  const dates: string[] = [];
  let y = startYear;
  let m = startMonth;

  while (y < endYear || (y === endYear && m <= endMonth)) {
    const lastDay = new Date(y, m, 0).getDate();
    const day = Math.min(startDay, lastDay);
    dates.push(`${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }

  return dates;
}

export async function createEntry(payload: EntryPayload) {
  const supabase = createClient();

  if (payload.is_recurring && payload.recurring_until && payload.due_date) {
    const dates = buildRecurringDates(payload.due_date, payload.recurring_until);
    const rows = dates.map((due_date) => ({
      entry_type:   payload.entry_type,
      description:  payload.description,
      amount:       payload.amount,
      due_date,
      category:     payload.category,
      status:       payload.status,
      is_recurring: true,
      notes:        payload.notes || null,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("financial_entries").insert(rows);
    if (error) throw new Error(error.message);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("financial_entries").insert({
      entry_type:   payload.entry_type,
      description:  payload.description,
      amount:       payload.amount,
      due_date:     payload.due_date || null,
      category:     payload.category,
      status:       payload.status,
      is_recurring: payload.is_recurring,
      notes:        payload.notes || null,
    });
    if (error) throw new Error(error.message);
  }
}

export async function updateEntry(id: string, payload: EntryPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_entries")
    .update({
      entry_type:   payload.entry_type,
      description:  payload.description,
      amount:       payload.amount,
      due_date:     payload.due_date || null,
      category:     payload.category,
      status:       payload.status,
      is_recurring: payload.is_recurring,
      notes:        payload.notes || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEntry(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_entries")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleEntryStatus(id: string, currentStatus: EntryStatus) {
  const nextStatus: EntryStatus = currentStatus === "pago" ? "pendente" : "pago";
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_entries")
    .update({
      status:    nextStatus,
      paid_date: nextStatus === "pago" ? new Date().toISOString().split("T")[0] : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
