"use client";

import { useState, useMemo } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgendaEvents } from "@/hooks/use-agenda-events";
import { CATEGORY_CONFIG, formatEventTime, isToday } from "@/lib/agenda";
import { deleteEvent } from "@/lib/actions/agenda";
import { EventDialog } from "./event-dialog";
import type { AgendaFilters } from "./agenda-filters";
import { isFiltersActive } from "./agenda-filters";
import type { AgendaEvent } from "@/types/database";
import type { DayButtonProps } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { Clock, Pencil, Trash2 } from "lucide-react";

interface AgendaCalendarProps {
  filters?: AgendaFilters;
}

export function AgendaCalendar({ filters }: AgendaCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | undefined>();

  const { events, loading, refetch } = useAgendaEvents({ month: currentMonth });

  const filteredEvents = useMemo(() => {
    if (!filters || !isFiltersActive(filters)) return events;
    return events.filter((e) =>
      filters.categories.length === 0 || filters.categories.includes(e.category)
    );
  }, [events, filters]);

  const eventDays = useMemo(() => {
    return new Set(filteredEvents.map((e) => e.event_date));
  }, [filteredEvents]);

  const selectedDateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : null;

  const selectedEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return filteredEvents.filter((e) => e.event_date === selectedDateStr);
  }, [filteredEvents, selectedDateStr]);

  function handleEdit(event: AgendaEvent) {
    setEditingEvent(event);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingEvent(undefined);
  }

  return (
    <div className="space-y-4">
      {/* Calendário */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={ptBR}
          classNames={{
            root: "w-full",
            month: "w-full",
            month_grid: "w-full",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
            day_today: "font-semibold text-primary",
          }}
          components={{
            DayButton: ({ day, modifiers, children, ...props }: DayButtonProps) => {
              const str = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`;
              const hasEvents = eventDays.has(str);
              return (
                <CalendarDayButton day={day} modifiers={modifiers} locale={ptBR} {...props}>
                  {children}
                  {hasEvents && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />
      </div>

      {/* Eventos do dia selecionado */}
      {selectedDate && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
            {selectedDateStr && isToday(selectedDateStr)
              ? "Hoje"
              : selectedDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
          </p>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : selectedEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum evento neste dia.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => handleEdit(event)}
                  onDelete={refetch}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <EventDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        event={editingEvent}
        defaultDate={selectedDateStr ?? undefined}
        onSuccess={refetch}
      />
    </div>
  );
}

function EventCard({
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
    <div className="rounded-xl border border-border/60 bg-card p-3 space-y-1.5 hover:shadow-sm transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground leading-snug">{event.title}</p>
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
      {time && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {time}
        </div>
      )}
      {event.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
      )}
    </div>
  );
}
