"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingEvents } from "@/hooks/use-agenda-events";
import {
  CATEGORY_CONFIG,
  formatEventDate,
  formatEventTime,
  isToday,
} from "@/lib/agenda";
import { CalendarDays, Clock } from "lucide-react";

export function UpcomingEvents() {
  const { events, loading } = useUpcomingEvents(8);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Próximos eventos</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum evento agendado por enquanto.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => {
            const cat = CATEGORY_CONFIG[event.category];
            const time = formatEventTime(event.event_time);
            const today = isToday(event.event_date);

            return (
              <div
                key={event.id}
                className="rounded-xl border border-border/60 bg-card p-3 space-y-1 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
                    <p className="text-sm font-medium text-foreground truncate">
                      {event.title}
                    </p>
                  </div>
                  <Badge className={`text-xs shrink-0 ${cat.color} border-0`}>
                    {cat.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 pl-4 text-xs text-muted-foreground">
                  <span className={today ? "text-primary font-medium" : ""}>
                    {today ? "Hoje" : formatEventDate(event.event_date)}
                  </span>
                  {time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
