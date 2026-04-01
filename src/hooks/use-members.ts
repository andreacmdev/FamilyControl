"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FamilyMember } from "@/types/database";

interface UseMembersReturn {
  members: FamilyMember[];
  loading: boolean;
  refetch: () => void;
}

export function useMembers(): UseMembersReturn {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("family_members")
      .select("*")
      .order("created_at", { ascending: true });
    setMembers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("family_members")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "family_members" },
        ({ new: row }) => setMembers((prev) => [...prev, row as FamilyMember])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "family_members" },
        ({ new: row }) => setMembers((prev) => prev.map((m) => m.id === (row as FamilyMember).id ? row as FamilyMember : m))
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "family_members" },
        ({ old: row }) => setMembers((prev) => prev.filter((m) => m.id !== (row as { id: string }).id))
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { members, loading, refetch: fetchMembers };
}
