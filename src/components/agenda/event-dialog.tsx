"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./event-form";
import type { AgendaEvent } from "@/types/database";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se passado, entra em modo edição */
  event?: AgendaEvent;
  /** Data pré-selecionada ao abrir para criar */
  defaultDate?: string;
  onSuccess?: () => void;
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
  onSuccess,
}: EventDialogProps) {
  function handleSuccess() {
    onOpenChange(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? "Editar evento" : "Novo evento"}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          event={event}
          defaultDate={defaultDate}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
