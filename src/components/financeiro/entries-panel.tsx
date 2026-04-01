"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryConfig, STATUS_CONFIG, formatCurrency, formatShortDate } from "@/lib/financeiro";
import { deleteEntry, toggleEntryStatus } from "@/lib/actions/financeiro";
import { EntryDialog } from "./entry-dialog";
import type { FinancialEntry, EntryType } from "@/types/database";
import { Plus, Pencil, Trash2, CheckCircle2, Circle, RefreshCw } from "lucide-react";

interface EntriesPanelProps {
  type: EntryType;
  entries: FinancialEntry[];
  loading: boolean;
  defaultDueDate?: string;
  onRefetch?: () => void;
}

export function EntriesPanel({ type, entries, loading, defaultDueDate, onRefetch }: EntriesPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | undefined>();

  const filtered = entries.filter((e) => e.entry_type === type);
  const total = filtered.reduce((acc, e) => acc + Number(e.amount), 0);
  const isReceita = type === "receita";

  function handleEdit(entry: FinancialEntry) {
    setEditingEntry(entry);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingEntry(undefined);
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Cabeçalho do painel */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-border/60 ${isReceita ? "bg-emerald-50/60" : "bg-red-50/60"}`}>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isReceita ? "Receitas" : "Despesas"}
          </p>
          <p className={`text-xs font-medium ${isReceita ? "text-emerald-600" : "text-red-500"}`}>
            {formatCurrency(total)}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 h-7 text-xs"
          onClick={() => { setEditingEntry(undefined); setDialogOpen(true); }}
        >
          <Plus className="w-3 h-3" />
          {isReceita ? "Receita" : "Despesa"}
        </Button>
      </div>

      {/* Lista */}
      <div className="divide-y divide-border/40">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum{isReceita ? "a receita" : "a despesa"} neste mês.
            </p>
          </div>
        ) : (
          filtered.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onEdit={() => handleEdit(entry)}
              onRefetch={onRefetch}
            />
          ))
        )}
      </div>

      <EntryDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        entry={editingEntry}
        defaultType={type}
        defaultDueDate={defaultDueDate}
        onSuccess={onRefetch}
      />
    </div>
  );
}

function EntryRow({ entry, onEdit, onRefetch }: { entry: FinancialEntry; onEdit: () => void; onRefetch?: () => void }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cat = getCategoryConfig(entry.category, entry.entry_type);
  const statusCfg = STATUS_CONFIG[entry.status];
  const isPago = entry.status === "pago";

  async function handleToggle() {
    setToggling(true);
    try {
      await toggleEntryStatus(entry.id, entry.status);
      onRefetch?.();
    } finally { setToggling(false); }
  }

  async function handleDelete() {
    if (!confirm(`Excluir "${entry.description}"?`)) return;
    setDeleting(true);
    try {
      await deleteEntry(entry.id);
      onRefetch?.();
    } finally { setDeleting(false); }
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 group transition-colors hover:bg-muted/30 ${isPago ? "opacity-60" : ""}`}>
      {/* Toggle pago */}
      <button
        onClick={handleToggle}
        disabled={toggling || entry.status === "cancelado"}
        className="shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
        title={isPago ? "Marcar como pendente" : "Marcar como pago"}
      >
        {isPago
          ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          : <Circle className="w-5 h-5" />
        }
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={`text-sm font-medium truncate ${isPago ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {entry.description}
          </p>
          {entry.is_recurring && (
            <span title="Recorrente">
              <RefreshCw className="w-3 h-3 text-muted-foreground shrink-0" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${cat.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </span>
          {entry.due_date && (
            <span className="text-xs text-muted-foreground">
              {formatShortDate(entry.due_date)}
            </span>
          )}
          {entry.status === "cancelado" && (
            <Badge className={`text-xs border-0 ${statusCfg.color}`}>Cancelado</Badge>
          )}
        </div>
      </div>

      {/* Valor + ações */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-sm font-semibold ${entry.entry_type === "receita" ? "text-emerald-600" : "text-foreground"}`}>
          {formatCurrency(Number(entry.amount))}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
            <Pencil className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost" size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={handleDelete} disabled={deleting}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
