"use client";

import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingEvents } from "@/hooks/use-agenda-events";
import { CATEGORY_CONFIG, formatEventDateShort, formatEventTime, isToday } from "@/lib/agenda";

export function ProximosEventosWidget() {
  const { events, loading } = useUpcomingEvents(5);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <CalendarDays className="size-4 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wide">Próximos eventos</span>
        </div>
        <Link href="/agenda" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
          Ver todos <ArrowRight className="size-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-3">Nenhum evento próximo</p>
      ) : (
        <div className="space-y-1.5">
          {events.map((ev) => {
            const cat = CATEGORY_CONFIG[ev.category];
            const time = formatEventTime(ev.event_time);
            const today = isToday(ev.event_date);
            return (
              <div key={ev.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-accent/40 transition-colors">
                <span className={`size-2 rounded-full shrink-0 ${cat.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-tight">{ev.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-medium ${today ? "text-primary" : "text-muted-foreground"}`}>
                    {today ? "Hoje" : formatEventDateShort(ev.event_date)}
                  </p>
                  {time && <p className="text-xs text-muted-foreground">{time}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
