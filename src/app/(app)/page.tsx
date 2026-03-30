import { CalendarDays, Wallet, Users, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const modules = [
  {
    title: "Agenda",
    description: "Próximos compromissos e eventos da família",
    href: "/agenda",
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Financeiro",
    description: "Contas, metas e controle mensal",
    href: "/financeiro",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Boas-vindas */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">
            Olá, família!
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Este é o nosso espaço. Organizado com carinho para facilitar o dia a dia.
        </p>
      </div>

      {/* Módulos */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer border-border/60">
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-xl ${mod.bg} flex items-center justify-center mb-3`}>
                  <mod.icon className={`w-5 h-5 ${mod.color}`} />
                </div>
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                  {mod.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{mod.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Placeholder futuro */}
      <div className="rounded-2xl border border-dashed border-border/80 p-6 text-center space-y-2">
        <Users className="w-8 h-8 text-muted-foreground/50 mx-auto" />
        <p className="text-sm text-muted-foreground">
          Em breve: versículos, aniversários e muito mais.
        </p>
      </div>
    </div>
  );
}
