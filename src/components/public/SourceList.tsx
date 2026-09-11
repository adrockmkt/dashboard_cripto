interface SourceListProps {
  sources: Array<{ label: string; url: string }>;
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="text-xl font-semibold text-foreground">Fontes</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {sources.map((source) => (
          <li key={source.url}>
            <a className="text-primary underline-offset-4 hover:underline" href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noreferrer" : undefined}>
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
