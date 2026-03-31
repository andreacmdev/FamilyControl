"use client";

import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyEntries } from "@/hooks/use-financial";
import { formatCurrency, formatMonthLabel } from "@/lib/financeiro";

export function ResumoFinanceiroWidget() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const { entries, loading } = useMonthlyEntries(year, month);

  const totalReceitas = entries
    .filter((e) => e.entry_type === "receita")
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalDespesas = entries
    .filter((e) => e.entry_type === "despesa")
    .reduce((s, e) => s + Number(e.amount), 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Wallet className="size-4 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Financeiro — {formatMonthLabel(year, month)}
          </span>
        </div>
        <Link href="/financeiro" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
          Ver detalhes <ArrowRight className="size-3" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2.5 space-y-0.5">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3" />
              <span className="text-xs">Receitas</span>
            </div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">
              {formatCurrency(totalReceitas)}
            </p>
          </div>

          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-2.5 space-y-0.5">
            <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <TrendingDown className="size-3" />
              <span className="text-xs">Despesas</span>
            </div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 tabular-nums">
              {formatCurrency(totalDespesas)}
            </p>
          </div>

          <div className={`rounded-lg p-2.5 space-y-0.5 ${saldo >= 0 ? "bg-blue-50 dark:bg-blue-950/30" : "bg-orange-50 dark:bg-orange-950/30"}`}>
            <span className={`text-xs ${saldo >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>
              Saldo
            </span>
            <p className={`text-sm font-semibold tabular-nums ${saldo >= 0 ? "text-blue-700 dark:text-blue-300" : "text-orange-700 dark:text-orange-300"}`}>
              {formatCurrency(Math.abs(saldo))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
