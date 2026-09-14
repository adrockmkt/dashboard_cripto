import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/public/PublicLayout";
import { toolGuides } from "@/content/toolGuides";

const guideOrder = ["metricas-on-chain", "alertas-cripto", "simulador-dca", "grafico-bitcoin"];

export function ToolsHubPage() {
  return (
    <PublicLayout title="Ferramentas cripto: guias para usar o dashboard" updatedAt="14 de setembro de 2026">
      <p>
        Estes guias explicam como usar as ferramentas públicas do Cripto Dashboard, quais dados observar e quais limites considerar antes de interpretar um resultado.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {guideOrder.map((slug) => {
          const guide = toolGuides[slug];
          return (
            <section key={guide.slug} className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">{guide.title}</h2>
              <p className="mt-2 text-sm">{guide.description}</p>
              <Link className="mt-4 inline-flex font-medium text-primary underline underline-offset-4" to={`/ferramentas/${guide.slug}`}>
                Ler guia de {guide.slug === "metricas-on-chain" ? "métricas on-chain" : guide.slug === "simulador-dca" ? "simulador DCA" : guide.slug === "alertas-cripto" ? "alertas cripto" : "gráfico Bitcoin"}
              </Link>
            </section>
          );
        })}
      </div>
    </PublicLayout>
  );
}
