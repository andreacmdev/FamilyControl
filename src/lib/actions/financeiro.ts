"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EntryType, FinancialCategory, EntryStatus } from "@/types/database";

// ─── Nota mensal ──────────────────────────────────────────────────────────────

export async function upsertMonthlyNote(year: number, month: number, content: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("monthly_notes")
    .upsert({ year, month, content }, { onConflict: "year,month" });
  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
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
  notes?: string;
}

export async function createEntry(payload: EntryPayload) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("financial_entries").insert({
    entry_type: payload.entry_type,
    description: payload.description,
    amount: payload.amount,
    due_date: payload.due_date || null,
    category: payload.category,
    status: payload.status,
    is_recurring: payload.is_recurring,
    notes: payload.notes || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}

export async function updateEntry(id: string, payload: EntryPayload) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_entries")
    .update({
      entry_type: payload.entry_type,
      description: payload.description,
      amount: payload.amount,
      due_date: payload.due_date || null,
      category: payload.category,
      status: payload.status,
      is_recurring: payload.is_recurring,
      notes: payload.notes || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_entries")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}

export async function toggleEntryStatus(id: string, currentStatus: EntryStatus) {
  const nextStatus: EntryStatus = currentStatus === "pago" ? "pendente" : "pago";
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_entries")
    .update({
      status: nextStatus,
      paid_date: nextStatus === "pago" ? new Date().toISOString().split("T")[0] : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}
