"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingEvents } from "@/hooks/use-agenda-events";
import { CATEGORY_CONFIG, formatEventDate, formatEventTime, isToday } from "@/lib/agenda";
import { deleteEvent } from "@/lib/actions/agenda";
import { EventDialog } from "./event-dialog";
import type { AgendaFilters } from "./agenda-filters";
import { isFiltersActive } from "./agenda-filters";
import type { AgendaEvent } from "@/types/database";
import { CalendarDays, Clock, Pencil, Trash2 } from "lucide-react";

interface UpcomingEventsProps {
  filters?: AgendaFilters;
}

export function UpcomingEvents({ filters }: UpcomingEventsProps) {
  const { events, loading, refetch } = useUpcomingEvents(8);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | undefined>();

  function handleEdit(event: AgendaEvent) {
    setEditingEvent(event);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingEvent(undefined);
  }

  const filteredEvents = useMemo(() => {
    if (!filters || !isFiltersActive(filters)) return events;
    return events.filter((e) =>
      filters.categories.length === 0 || filters.categories.includes(e.category)
    );
  }, [events, filters]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          Próximos eventos
          {filters && isFiltersActive(filters) && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({filteredEvents.length})
            </span>
          )}
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {filters && isFiltersActive(filters)
              ? "Nenhum evento encontrado com esses filtros."
              : "Nenhum evento agendado por enquanto."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEvents.map((event) => (
            <UpcomingEventCard
              key={event.id}
              event={event}
              onEdit={() => handleEdit(event)}
              onDelete={refetch}
            />
          ))}
        </div>
      )}

      <EventDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        event={editingEvent}
        onSuccess={refetch}
      />
    </div>
  );
}

function UpcomingEventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: AgendaEvent;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cat = CATEGORY_CONFIG[event.category];
  const time = formatEventTime(event.event_time);
  const today = isToday(event.event_date);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir "${event.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteEvent(event.id);
      onDelete();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1 hover:shadow-sm transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
          <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge className={`text-xs ${cat.color} border-0`}>{cat.label}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
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
}
