"use client";

import { BookOpen } from "lucide-react";

const VERSICULOS = [
  { texto: "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.", referencia: "Jeremias 29:11" },
  { texto: "Entrega o teu caminho ao Senhor; confia nele, e ele agirá.", referencia: "Salmos 37:5" },
  { texto: "Tudo posso naquele que me fortalece.", referencia: "Filipenses 4:13" },
  { texto: "O Senhor é o meu pastor; nada me faltará.", referencia: "Salmos 23:1" },
  { texto: "Mas os que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, caminham e não se cansam.", referencia: "Isaías 40:31" },
  { texto: "Não anseie pelo que é melhor para você apenas; pense no que é melhor para os outros também.", referencia: "Filipenses 2:4" },
  { texto: "E sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.", referencia: "Romanos 8:28" },
  { texto: "Sede bondosos e compassivos uns para com os outros, perdoando-vos mutuamente, assim como Deus os perdoou em Cristo.", referencia: "Efésios 4:32" },
  { texto: "Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.", referencia: "Colossenses 3:14" },
  { texto: "A família que ora unida permanece unida.", referencia: "Provérbio popular" },
  { texto: "Honra teu pai e tua mãe, para que se prolonguem os teus dias na terra.", referencia: "Êxodo 20:12" },
  { texto: "Instrua a criança no caminho em que deve andar, e mesmo quando for idosa não se desviará dele.", referencia: "Provérbios 22:6" },
  { texto: "Não se inquietem com nada, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.", referencia: "Filipenses 4:6" },
  { texto: "Porque onde dois ou três se reúnem em meu nome, ali estou eu no meio deles.", referencia: "Mateus 18:20" },
];

function getDailyVerse() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return VERSICULOS[dayOfYear % VERSICULOS.length];
}

export function VersiculoWidget() {
  const { texto, referencia } = getDailyVerse();

  return (
    <div className="rounded-xl border bg-amber-50/60 dark:bg-amber-950/20 p-4 space-y-2">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <BookOpen className="size-4 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wide">Versículo do dia</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed italic">&ldquo;{texto}&rdquo;</p>
      <p className="text-xs text-muted-foreground font-medium">{referencia}</p>
    </div>
  );
}
