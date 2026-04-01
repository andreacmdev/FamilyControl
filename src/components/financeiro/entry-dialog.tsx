"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EntryForm } from "./entry-form";
import type { FinancialEntry, EntryType } from "@/types/database";

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: FinancialEntry;
  defaultType?: EntryType;
  defaultDueDate?: string;
  onSuccess?: () => void;
}

export function EntryDialog({ open, onOpenChange, entry, defaultType, defaultDueDate, onSuccess }: EntryDialogProps) {
  function handleSuccess() {
    onOpenChange(false);
    onSuccess?.();
  }

  const title = entry
    ? "Editar lançamento"
    : defaultType === "receita"
    ? "Nova receita"
    : "Nova despesa";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <EntryForm
          entry={entry}
          defaultType={defaultType}
          defaultDueDate={defaultDueDate}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
