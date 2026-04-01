"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FinancialEntry, MonthlyNote } from "@/types/database";

interface UseMonthlyEntriesReturn {
  entries: FinancialEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMonthlyEntries(
  year: number,
  month: number
): UseMonthlyEntriesReturn {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);

  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay  = `${year}-${String(month).padStart(2, "0")}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`;

  const fetchEntries = useCallback(async () => {
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("financial_entries")
      .select("*")
      .gte("due_date", firstDay)
      .lte("due_date", lastDay)
      .order("due_date", { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setEntries(data ?? []);
    }
    setLoading(false);
    initialLoad.current = false;
  }, [firstDay, lastDay]);

  // Fetch inicial + ao mudar mês
  useEffect(() => {
    initialLoad.current = true;
    setLoading(true);
    fetchEntries();
  }, [fetchEntries]);

  // Realtime: aplica o delta diretamente no estado, sem refetch
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`financial_entries_${year}_${month}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "financial_entries" },
        ({ new: row }) => {
          const entry = row as FinancialEntry;
          if (entry.due_date && entry.due_date >= firstDay && entry.due_date <= lastDay) {
            setEntries((prev) =>
              [...prev, entry].sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "financial_entries" },
        ({ new: row }) => {
          const entry = row as FinancialEntry;
          // Se saiu do mês, remove; senão, atualiza
          if (!entry.due_date || entry.due_date < firstDay || entry.due_date > lastDay) {
            setEntries((prev) => prev.filter((e) => e.id !== entry.id));
          } else {
            setEntries((prev) =>
              prev.map((e) => (e.id === entry.id ? entry : e))
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "financial_entries" },
        ({ old: row }) => {
          setEntries((prev) => prev.filter((e) => e.id !== (row as { id: string }).id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [year, month, firstDay, lastDay]);

  return { entries, loading, error, refetch: fetchEntries };
}

interface UseMonthlyNoteReturn {
  note: MonthlyNote | null;
  loading: boolean;
  refetch: () => void;
}

export function useMonthlyNote(year: number, month: number): UseMonthlyNoteReturn {
  const [note, setNote] = useState<MonthlyNote | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNote = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("monthly_notes")
      .select("*")
      .eq("year", year)
      .eq("month", month)
      .maybeSingle();

    setNote(data ?? null);
    setLoading(false);
  }, [year, month]);

  useEffect(() => { fetchNote(); }, [fetchNote]);

  return { note, loading, refetch: fetchNote };
}
