"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GoalForm } from "./goal-form";
import { deleteGoal, toggleGoalCompleted } from "@/lib/actions/goals";
import { formatCurrency } from "@/lib/financeiro";
import { useGoals } from "@/hooks/use-goals";
import type { FinancialGoal } from "@/types/database";

function GoalCard({ goal }: { goal: FinancialGoal }) {
  const [editOpen, setEditOpen] = useState(false);
  const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { month: "short", year: "numeric" });

  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-opacity ${goal.is_completed ? "opacity-60" : ""}`}>
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <button
            onClick={() => toggleGoalCompleted(goal.id, goal.is_completed)}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
            title={goal.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
          >
            {goal.is_completed
              ? <CheckCircle2 className="size-5 text-emerald-500" />
              : <Circle className="size-5" />}
          </button>
          <div className="min-w-0">
            <p className={`font-medium text-sm leading-tight ${goal.is_completed ? "line-through text-muted-foreground" : ""}`}>
              {goal.title}
            </p>
            {goal.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{goal.description}</p>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 shrink-0">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger className="inline-flex items-center justify-center size-7 rounded-md hover:bg-accent transition-colors">
              <Pencil className="size-3.5" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar meta</DialogTitle>
              </DialogHeader>
              <GoalForm goal={goal} onSuccess={() => setEditOpen(false)} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center justify-center size-7 rounded-md hover:bg-accent text-destructive transition-colors">
              <Trash2 className="size-3.5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
                <AlertDialogDescription>
                  &quot;{goal.title}&quot; será removida permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => deleteGoal(goal.id)}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1">
        <Progress value={pct} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(goal.current_amount)} acumulado</span>
          <span className="font-medium text-foreground">{pct}%</span>
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Meta: {formatCurrency(goal.target_amount)}</span>
        <div className="flex items-center gap-3">
          {remaining > 0 && <span>Faltam {formatCurrency(remaining)}</span>}
          {goal.target_date && <span>{formatDate(goal.target_date)}</span>}
        </div>
      </div>
    </div>
  );
}

export function GoalsPanel() {
  const { goals, loading } = useGoals();
  const [addOpen, setAddOpen] = useState(false);

  const active    = goals.filter((g) => !g.is_completed);
  const completed = goals.filter((g) => g.is_completed);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-amber-500" />
          <h3 className="font-semibold text-sm">Metas</h3>
          {!loading && goals.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {completed.length}/{goals.length} concluídas
            </span>
          )}
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger className="inline-flex items-center justify-center size-7 rounded-md hover:bg-accent transition-colors">
            <Plus className="size-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova meta</DialogTitle>
            </DialogHeader>
            <GoalForm onSuccess={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <Trophy className="size-8 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma meta cadastrada</p>
          <p className="text-xs text-muted-foreground mt-1">Clique em + para adicionar sua primeira meta</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((g) => <GoalCard key={g.id} goal={g} />)}
          {completed.length > 0 && (
            <>
              {active.length > 0 && <div className="border-t" />}
              {completed.map((g) => <GoalCard key={g.id} goal={g} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
