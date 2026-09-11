import { Activity } from "lucide-react";

interface MarketBriefProps {
  fearGreedLabel?: string;
  fearGreedValue?: string | number;
  btcDominance?: number;
}

export function MarketBrief({ fearGreedLabel, fearGreedValue, btcDominance }: MarketBriefProps) {
  const sentiment = fearGreedLabel ? `${fearGreedLabel}${fearGreedValue ? ` (${fearGreedValue})` : ""}` : "indisponível";
  const dominance = typeof btcDominance === "number" ? `${btcDominance.toFixed(1)}%` : "indisponível";

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm" aria-labelledby="market-brief-title">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary"><Activity className="h-4 w-4" /></div>
        <div>
          <h2 id="market-brief-title" className="font-semibold">Leitura rápida do mercado</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Sentimento agregado: <strong className="text-foreground">{sentiment}</strong>. Dominância do Bitcoin: <strong className="text-foreground">{dominance}</strong>. Use estes sinais como contexto, não como recomendação de investimento.
          </p>
        </div>
      </div>
    </section>
  );
}
