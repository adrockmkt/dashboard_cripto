import { EditorialMeta } from "@/components/public/EditorialMeta";
import { PublicLayout } from "@/components/public/PublicLayout";
import { RiskDisclosure } from "@/components/public/RiskDisclosure";
import { SourceList } from "@/components/public/SourceList";
import type { EditorialPage } from "@/content/editorial";

export function EditorialArticlePage({ page }: { page: EditorialPage }) {
  return (
    <PublicLayout title={page.title} updatedAt={page.updatedAt}>
      <EditorialMeta author={page.author} />
      <p>{page.description}</p>
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
          <p className="mt-2">{section.body}</p>
        </section>
      ))}
      <SourceList sources={page.sources} />
      <RiskDisclosure />
    </PublicLayout>
  );
}
