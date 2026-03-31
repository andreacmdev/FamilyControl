"use client";

import { MembersPanel } from "@/components/membros/members-panel";

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personalize o sistema para a sua família
        </p>
      </div>

      {/* Membros */}
      <div className="rounded-xl border bg-card p-5">
        <MembersPanel />
      </div>
    </div>
  );
}
