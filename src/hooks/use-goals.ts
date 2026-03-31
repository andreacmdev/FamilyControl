"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FinancialGoal } from "@/types/database";

interface UseGoalsReturn {
  goals: FinancialGoal[];
  loading: boolean;
  error: string | null;
}

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchGoals = async () => {
      const { data, error: err } = await supabase
        .from("financial_goals")
        .select("*")
        .order("is_completed", { ascending: true })
        .order("created_at", { ascending: true });

      if (err) setError(err.message);
      else setGoals(data ?? []);
      setLoading(false);
    };

    fetchGoals();

    const channel = supabase
      .channel("financial_goals")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "financial_goals" },
        ({ new: row }) => {
          setGoals((prev) => [...prev, row as FinancialGoal]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "financial_goals" },
        ({ new: row }) => {
          setGoals((prev) =>
            prev
              .map((g) => (g.id === (row as FinancialGoal).id ? (row as FinancialGoal) : g))
              .sort((a, b) => Number(a.is_completed) - Number(b.is_completed))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "financial_goals" },
        ({ old: row }) => {
          setGoals((prev) => prev.filter((g) => g.id !== (row as { id: string }).id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { goals, loading, error };
}
