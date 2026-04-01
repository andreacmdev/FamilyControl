"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AgendaEvent } from "@/types/database";

interface UseAgendaEventsOptions {
  month?: Date;
}

interface UseAgendaEventsReturn {
  events: AgendaEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAgendaEvents({ month }: UseAgendaEventsOptions = {}): UseAgendaEventsReturn {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);

  const fetchEvents = useCallback(async () => {
    // Só mostra skeleton na primeira carga
    if (initialLoad.current) setLoading(true);
    setError(null);

    const supabase = createClient();
    let query = supabase
      .from("agenda_events")
      .select("*")
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true, nullsFirst: true });

    if (month) {
      const year = month.getFullYear();
      const m = month.getMonth() + 1;
      const firstDay = `${year}-${String(m).padStart(2, "0")}-01`;
      const lastDay = new Date(year, m, 0);
      const lastDayStr = `${year}-${String(m).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;
      query = query.gte("event_date", firstDay).lte("event_date", lastDayStr);
    }

    const { data, error: err } = await query;

    if (err) {
      setError(err.message);
    } else {
      setEvents(data ?? []);
    }

    setLoading(false);
    initialLoad.current = false;
  }, [month]);

  // Carga inicial
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Realtime: atualiza automaticamente quando o banco muda
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("agenda_events_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agenda_events" },
        () => { fetchEvents(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

/** Retorna eventos a partir de hoje */
export function useUpcomingEvents(limit = 8): UseAgendaEventsReturn {
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);

  const fetchEvents = useCallback(async () => {
    if (initialLoad.current) setLoading(true);
    setError(null);

    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data, error: err } = await supabase
      .from("agenda_events")
      .select("*")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true, nullsFirst: true })
      .limit(limit);

    if (err) {
      setError(err.message);
    } else {
      setEvents(data ?? []);
    }

    setLoading(false);
    initialLoad.current = false;
  }, [limit]);

  // Carga inicial
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Realtime: canal separado para a lista de próximos eventos
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("upcoming_events_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agenda_events" },
        () => { fetchEvents(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
