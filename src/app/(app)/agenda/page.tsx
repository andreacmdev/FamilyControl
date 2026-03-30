import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgendaCalendar } from "@/components/agenda/agenda-calendar";
import { UpcomingEvents } from "@/components/agenda/upcoming-events";

export default function AgendaPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Agenda</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Eventos e compromissos da família
          </p>
        </div>
        <Button size="sm" className="gap-1.5" disabled>
          <Plus className="w-4 h-4" />
          Novo evento
        </Button>
      </div>

      {/* Layout: calendário + próximos eventos */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <AgendaCalendar />
        <UpcomingEvents />
      </div>
    </div>
  );
}
