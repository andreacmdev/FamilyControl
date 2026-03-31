"use client";

import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyNote } from "@/hooks/use-financial";
import { upsertMonthlyNote } from "@/lib/actions/financeiro";
import { NotebookPen, Check, Loader2 } from "lucide-react";

interface MonthlyNoteProps {
  year: number;
  month: number;
}

type SaveState = "idle" | "saving" | "saved";

export function MonthlyNote({ year, month }: MonthlyNoteProps) {
  const { note, loading, refetch } = useMonthlyNote(year, month);
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstSync = useRef(true);

  // Sincroniza quando a nota carrega ou o mês muda
  useEffect(() => {
    setContent(note?.content ?? "");
    isFirstSync.current = true;
  }, [note, year, month]);

  function handleChange(value: string) {
    setContent(value);

    if (isFirstSync.current) {
      isFirstSync.current = false;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setSaveState("saving");
    debounceRef.current = setTimeout(async () => {
      try {
        await upsertMonthlyNote(year, month, value);
        setSaveState("saved");
        refetch();
        setTimeout(() => setSaveState("idle"), 2000);
      } catch {
        setSaveState("idle");
      }
    }, 800);
  }

  if (loading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NotebookPen className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Observações do mês
          </span>
        </div>

        <div className="h-5 flex items-center">
          {saveState === "saving" && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Salvando...
            </span>
          )}
          {saveState === "saved" && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="w-3 h-3" />
              Salvo
            </span>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Anotações, lembretes ou observações sobre o mês..."
        rows={4}
        className="w-full resize-none rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
      />
    </div>
  );
}
