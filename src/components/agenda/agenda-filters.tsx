"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG } from "@/lib/agenda";
import type { AgendaCategory } from "@/types/database";
import { X } from "lucide-react";

export interface AgendaFilters {
  categories: AgendaCategory[];
}

interface AgendaFiltersProps {
  filters: AgendaFilters;
  onChange: (filters: AgendaFilters) => void;
}

export const EMPTY_FILTERS: AgendaFilters = { categories: [] };

export function isFiltersActive(filters: AgendaFilters) {
  return filters.categories.length > 0;
}

export function AgendaFiltersBar({ filters, onChange }: AgendaFiltersProps) {
  function toggleCategory(cat: AgendaCategory) {
    const already = filters.categories.includes(cat);
    onChange({
      ...filters,
      categories: already
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    });
  }

  function clearFilters() {
    onChange(EMPTY_FILTERS);
  }

  const active = isFiltersActive(filters);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground shrink-0">Categoria:</span>

      <div className="flex items-center gap-1.5 flex-wrap">
        {(Object.entries(CATEGORY_CONFIG) as [AgendaCategory, typeof CATEGORY_CONFIG[AgendaCategory]][]).map(
          ([key, cfg]) => {
            const selected = filters.categories.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border
                  ${selected
                    ? `${cfg.color} border-transparent shadow-sm`
                    : "bg-background text-muted-foreground border-border/60 hover:border-border"
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            );
          }
        )}
      </div>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground"
          onClick={clearFilters}
        >
          <X className="w-3 h-3" />
          Limpar
        </Button>
      )}
    </div>
  );
}
