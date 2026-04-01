import { createClient } from "@/lib/supabase/client";

export interface GoalPayload {
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
}

export async function createGoal(payload: GoalPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("financial_goals").insert({
    title:          payload.title,
    description:    payload.description || null,
    target_amount:  payload.target_amount,
    current_amount: payload.current_amount,
    target_date:    payload.target_date || null,
    is_completed:   false,
  });
  if (error) throw new Error(error.message);
}

export async function updateGoal(id: string, payload: GoalPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_goals")
    .update({
      title:          payload.title,
      description:    payload.description || null,
      target_amount:  payload.target_amount,
      current_amount: payload.current_amount,
      target_date:    payload.target_date || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteGoal(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_goals")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleGoalCompleted(id: string, current: boolean) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("financial_goals")
    .update({ is_completed: !current })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
