"use client";

import { Button } from "@/components/ui/button";
import { formatMonthLabel } from "@/lib/financeiro";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthNavigationProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthNavigation({ year, month, onChange }: MonthNavigationProps) {
  function prev() {
    if (month === 1) onChange(year - 1, 12);
    else onChange(year, month - 1);
  }

  function next() {
    if (month === 12) onChange(year + 1, 1);
    else onChange(year, month + 1);
  }

  const isCurrentMonth =
    year === new Date().getFullYear() && month === new Date().getMonth() + 1;

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <button
        onClick={() => {
          const now = new Date();
          onChange(now.getFullYear(), now.getMonth() + 1);
        }}
        className="min-w-[160px] text-center text-sm font-semibold text-foreground capitalize hover:text-primary transition-colors"
      >
        {formatMonthLabel(year, month)}
      </button>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
        <ChevronRight className="w-4 h-4" />
      </Button>

      {!isCurrentMonth && (
        <button
          onClick={() => {
            const now = new Date();
            onChange(now.getFullYear(), now.getMonth() + 1);
          }}
          className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
        >
          hoje
        </button>
      )}
    </div>
  );
}
