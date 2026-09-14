import { Link } from "react-router-dom";
import { AdPlaceholder } from "@/components/public/AdPlaceholder";
import { PublicLayout } from "@/components/public/PublicLayout";
import { RiskDisclosure } from "@/components/public/RiskDisclosure";
import { SourceList } from "@/components/public/SourceList";

export interface ToolGuide {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  intro: string;
  steps: string[];
  interpretation: string;
  limitations: string;
  dashboardHref: string;
  relatedLinks: Array<{ label: string; href: string }>;
  sources: Array<{ label: string; url: string }>;
}

export function ToolGuideLayout({ guide }: { guide: ToolGuide }) {
  return (
    <PublicLayout title={guide.title} updatedAt={guide.updatedAt}>
      <p className="text-lg text-foreground">{guide.description}</p>
      <p>{guide.intro}</p>

      <section>
        <h2 className="text-xl font-semibold text-foreground">Como usar</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {guide.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <Link
          className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          to={guide.dashboardHref}
        >
          Abrir ferramenta
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">Como interpretar</h2>
        <p className="mt-2">{guide.interpretation}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">Limites e cuidados</h2>
        <p className="mt-2">{guide.limitations}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground">Conteúdos relacionados</h2>
        <ul className="mt-3 space-y-2">
          {guide.relatedLinks.map((link) => (
            <li key={link.href}><Link className="font-medium text-primary underline underline-offset-4" to={link.href}>{link.label}</Link></li>
          ))}
        </ul>
      </section>

      <AdPlaceholder />
      <SourceList sources={guide.sources} />
      <RiskDisclosure />
    </PublicLayout>
  );
}
