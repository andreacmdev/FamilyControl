"use client";

import { Heart } from "lucide-react";
import { VersiculoWidget } from "@/components/home/versiculo-widget";
import { AniversariosWidget } from "@/components/home/aniversarios-widget";
import { ProximosEventosWidget } from "@/components/home/proximos-eventos-widget";
import { ResumoFinanceiroWidget } from "@/components/home/resumo-financeiro-widget";

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Boas-vindas */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Olá, família Machado!</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Este é o nosso espaço. Organizado com carinho para facilitar o dia a dia da nossa família.
        </p>
      </div>

      {/* Versículo do dia */}
      <VersiculoWidget />

      {/* Aniversários próximos (só aparece se houver) */}
      <AniversariosWidget />

      {/* Próximos eventos + Resumo financeiro */}
      <div className="grid gap-4 md:grid-cols-2">
        <ProximosEventosWidget />
        <ResumoFinanceiroWidget />
      </div>
    </div>
  );
}
