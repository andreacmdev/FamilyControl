"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/financeiro";
import type { FinancialEntry } from "@/types/database";
import { TrendingUp, TrendingDown, Wallet, Clock } from "lucide-react";

interface SummaryCardsProps {
  entries: FinancialEntry[];
  loading: boolean;
}

export function SummaryCards({ entries, loading }: SummaryCardsProps) {
  const summary = useMemo(() => {
    const receitas = entries.filter((e) => e.entry_type === "receita");
    const despesas = entries.filter((e) => e.entry_type === "despesa");

    const totalReceitas = receitas.reduce((acc, e) => acc + Number(e.amount), 0);
    const totalDespesas = despesas.reduce((acc, e) => acc + Number(e.amount), 0);
    const saldo = totalReceitas - totalDespesas;

    const pendentesDespesas = despesas
      .filter((e) => e.status === "pendente")
      .reduce((acc, e) => acc + Number(e.amount), 0);

    return { totalReceitas, totalDespesas, saldo, pendentesDespesas };
  }, [entries]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Receitas",
      value: summary.totalReceitas,
      icon: TrendingUp,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-50",
      valueClass: "text-emerald-600",
    },
    {
      label: "Despesas",
      value: summary.totalDespesas,
      icon: TrendingDown,
      iconClass: "text-red-400",
      bgClass: "bg-red-50",
      valueClass: "text-red-500",
    },
    {
      label: "Saldo disponível",
      value: summary.saldo,
      icon: Wallet,
      iconClass: summary.saldo >= 0 ? "text-blue-500" : "text-red-400",
      bgClass: summary.saldo >= 0 ? "bg-blue-50" : "bg-red-50",
      valueClass: summary.saldo >= 0 ? "text-blue-600" : "text-red-500",
    },
    {
      label: "A pagar",
      value: summary.pendentesDespesas,
      icon: Clock,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-50",
      valueClass: "text-amber-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {card.label}
                </p>
                <p className={`text-xl font-bold ${card.valueClass}`}>
                  {formatCurrency(card.value)}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-xl ${card.bgClass} flex items-center justify-center shrink-0`}>
                <card.icon className={`w-4 h-4 ${card.iconClass}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
