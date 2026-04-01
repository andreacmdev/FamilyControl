"use client";

import { useState } from "react";
import { MonthNavigation } from "@/components/financeiro/month-navigation";
import { SummaryCards } from "@/components/financeiro/summary-cards";
import { MonthlyNote } from "@/components/financeiro/monthly-note";
import { EntriesPanel } from "@/components/financeiro/entries-panel";
import { GoalsPanel } from "@/components/financeiro/goals-panel";
import { useMonthlyEntries } from "@/hooks/use-financial";

function FinanceiroContent({ year, month }: { year: number; month: number }) {
  const { entries, loading, refetch } = useMonthlyEntries(year, month);

  const defaultDueDate = `${year}-${String(month).padStart(2, "0")}-01`;

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <SummaryCards entries={entries} loading={loading} />

      {/* Painéis de lançamentos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EntriesPanel
          type="receita"
          entries={entries}
          loading={loading}
          defaultDueDate={defaultDueDate}
          onRefetch={refetch}
        />
        <EntriesPanel
          type="despesa"
          entries={entries}
          loading={loading}
          defaultDueDate={defaultDueDate}
          onRefetch={refetch}
        />
      </div>

      {/* Metas financeiras */}
      <div className="rounded-xl border bg-card p-4">
        <GoalsPanel />
      </div>

      {/* Observações do mês */}
      <MonthlyNote year={year} month={month} />
    </div>
  );
}

export default function FinanceiroPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Financeiro</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Controle de receitas, despesas e metas
          </p>
        </div>
        <MonthNavigation year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </div>

      <FinanceiroContent year={year} month={month} />
    </div>
  );
}
