"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthNavigation } from "@/components/financeiro/month-navigation";
import { SummaryCards } from "@/components/financeiro/summary-cards";
import { MonthlyNote } from "@/components/financeiro/monthly-note";
import { useMonthlyEntries } from "@/hooks/use-financial";

function FinanceiroContent({ year, month }: { year: number; month: number }) {
  const { entries, loading } = useMonthlyEntries(year, month);

  return (
    <div className="space-y-6">
      <SummaryCards entries={entries} loading={loading} />
      <MonthlyNote year={year} month={month} />
    </div>
  );
}

export default function FinanceiroPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  function handleMonthChange(y: number, m: number) {
    setYear(y);
    setMonth(m);
  }

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
        <Button size="sm" className="gap-1.5" disabled>
          <Plus className="w-4 h-4" />
          Novo lançamento
        </Button>
      </div>

      {/* Navegação de mês */}
      <MonthNavigation year={year} month={month} onChange={handleMonthChange} />

      {/* Conteúdo do mês */}
      <FinanceiroContent year={year} month={month} />
    </div>
  );
}
