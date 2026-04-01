import { createClient } from "@/lib/supabase/client";
import type { AgendaCategory } from "@/types/database";

export interface EventPayload {
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  category: AgendaCategory;
  responsible_member?: string;
  notes?: string;
}

export async function createEvent(payload: EventPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("agenda_events").insert({
    title:              payload.title,
    description:        payload.description || null,
    event_date:         payload.event_date,
    event_time:         payload.event_time || null,
    category:           payload.category,
    responsible_member: payload.responsible_member || null,
    notes:              payload.notes || null,
  });
  if (error) throw new Error(error.message);
}

export async function updateEvent(id: string, payload: EventPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("agenda_events")
    .update({
      title:              payload.title,
      description:        payload.description || null,
      event_date:         payload.event_date,
      event_time:         payload.event_time || null,
      category:           payload.category,
      responsible_member: payload.responsible_member || null,
      notes:              payload.notes || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEvent(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("agenda_events")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
