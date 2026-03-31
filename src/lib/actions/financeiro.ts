"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function upsertMonthlyNote(
  year: number,
  month: number,
  content: string
) {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("monthly_notes")
    .upsert({ year, month, content }, { onConflict: "year,month" });

  if (error) throw new Error(error.message);
  revalidatePath("/financeiro");
}
