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

  const fetchEntries = useCallback(async () => {
    if (initialLoad.current) setLoading(true);
    setError(null);

    const supabase = createClient();
    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDayDate = new Date(year, month, 0);
    const lastDay = `${year}-${String(month).padStart(2, "0")}-${String(lastDayDate.getDate()).padStart(2, "0")}`;

    const { data, error: err } = await supabase
      .from("financial_entries")
      .select("*")
      .or(`due_date.gte.${firstDay},due_date.is.null`)
      .or(`due_date.lte.${lastDay},due_date.is.null`)
      .order("due_date", { ascending: true, nullsFirst: false });

    if (err) {
      setError(err.message);
    } else {
      // Filtra apenas lançamentos do mês (due_date dentro do mês ou null)
      const filtered = (data ?? []).filter((e: FinancialEntry) => {
        if (!e.due_date) return false;
        return e.due_date >= firstDay && e.due_date <= lastDay;
      });
      setEntries(filtered);
    }

    setLoading(false);
    initialLoad.current = false;
  }, [year, month]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // Realtime
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`financial_entries_${year}_${month}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "financial_entries" }, fetchEntries)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchEntries, year, month]);

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
