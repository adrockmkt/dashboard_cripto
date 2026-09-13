import { Activity, Flame } from "lucide-react";

interface MarketBriefProps {
  fearGreedLabel?: string;
  fearGreedValue?: string | number;
  btcDominance?: number;
}

export function MarketBrief({ fearGreedLabel, fearGreedValue, btcDominance }: MarketBriefProps) {
  const sentiment = fearGreedLabel ? `${fearGreedLabel}${fearGreedValue ? ` (${fearGreedValue})` : ""}` : "indisponível";
  const dominance = typeof btcDominance === "number" ? `${btcDominance.toFixed(1)}%` : "indisponível";

  return (
    <section className="adrock-panel overflow-hidden p-5 md:p-6" aria-labelledby="market-brief-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-primary"><Flame className="h-5 w-5" aria-hidden="true" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cripto Dashboard</p>
            <h2 id="market-brief-title" className="mt-1 text-xl font-bold tracking-tight">Visão de mercado</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Sentimento agregado: <strong className="text-foreground">{sentiment}</strong>. Dominância do Bitcoin: <strong className="text-foreground">{dominance}</strong>. Use estes sinais como contexto, não como recomendação de investimento.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
          Dados de mercado em atualização
        </div>
      </div>
    </section>
  );
}
