"use client";

import { Cake } from "lucide-react";
import { useMembers } from "@/hooks/use-members";
import { MemberAvatar } from "@/components/membros/members-panel";

function calcularIdade(birthDate: string): number {
  const hoje = new Date();
  const nasc = new Date(birthDate + "T00:00:00");
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

function diasParaAniversario(birthDate: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const nasc = new Date(birthDate + "T00:00:00");
  const proximo = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
  if (proximo < hoje) proximo.setFullYear(hoje.getFullYear() + 1);
  return Math.round((proximo.getTime() - hoje.getTime()) / 86400000);
}

export function AniversariosWidget() {
  const { members, loading } = useMembers();

  const comAniversario = members
    .filter((m) => m.birth_date)
    .map((m) => ({ ...m, dias: diasParaAniversario(m.birth_date!), idade: calcularIdade(m.birth_date!) + 1 }))
    .filter((m) => m.dias <= 30)
    .sort((a, b) => a.dias - b.dias);

  if (loading || comAniversario.length === 0) return null;

  return (
    <div className="rounded-xl border bg-pink-50/60 dark:bg-pink-950/20 p-4 space-y-3">
      <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
        <Cake className="size-4 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wide">Aniversários próximos</span>
      </div>

      <div className="space-y-2">
        {comAniversario.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <MemberAvatar member={m} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.nickname ?? m.name}</p>
              <p className="text-xs text-muted-foreground">
                {m.dias === 0
                  ? `Hoje! ${m.idade} anos 🎉`
                  : m.dias === 1
                  ? `Amanhã — ${m.idade} anos`
                  : `Em ${m.dias} dias — ${m.idade} anos`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
