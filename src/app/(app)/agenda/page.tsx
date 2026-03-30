import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AgendaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header da página */}
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

      {/* Estado vazio — módulo em construção */}
      <Card className="border-dashed border-border/80">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <CalendarDays className="w-7 h-7 text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Módulo em construção</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Em breve você poderá visualizar o calendário, cadastrar eventos
              e organizar os compromissos da família.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
