import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header da página */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Configurações</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personalize o sistema para a sua família
        </p>
      </div>

      {/* Estado vazio — módulo em construção */}
      <Card className="border-dashed border-border/80">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Settings className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">Em breve</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Aqui você poderá gerenciar membros da família, preferências
              e integrações do sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
