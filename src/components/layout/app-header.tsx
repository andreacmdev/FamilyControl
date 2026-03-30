"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Início", subtitle: "Bom ver você por aqui" },
  "/agenda": { title: "Agenda", subtitle: "Nossos compromissos" },
  "/financeiro": { title: "Financeiro", subtitle: "Cuidando das finanças da família" },
  "/configuracoes": { title: "Configurações", subtitle: "Ajustes do sistema" },
};

function getPageInfo(pathname: string) {
  if (pathname === "/") return pageTitles["/"];
  const match = Object.keys(pageTitles).find(
    (key) => key !== "/" && pathname.startsWith(key)
  );
  return match ? pageTitles[match] : { title: "Família", subtitle: "" };
}

export function AppHeader() {
  const pathname = usePathname();
  const { title, subtitle } = getPageInfo(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
    </header>
  );
}
