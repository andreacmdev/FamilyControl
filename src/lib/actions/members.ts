import { createClient } from "@/lib/supabase/client";

export interface MemberPayload {
  name: string;
  nickname?: string;
  color?: string;
  birth_date?: string;
}

export async function createMember(payload: MemberPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("family_members").insert({
    name:       payload.name,
    nickname:   payload.nickname || null,
    color:      payload.color || null,
    birth_date: payload.birth_date || null,
  });
  if (error) throw new Error(error.message);
}

export async function updateMember(id: string, payload: MemberPayload) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("family_members")
    .update({
      name:       payload.name,
      nickname:   payload.nickname || null,
      color:      payload.color || null,
      birth_date: payload.birth_date || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMember(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("family_members")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
