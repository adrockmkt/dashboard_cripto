interface EditorialMetaProps {
  author: string;
  updatedAt: string;
}

export function EditorialMeta({ author, updatedAt }: EditorialMetaProps) {
  return (
    <p className="text-sm text-muted-foreground">
      Por {author} · Atualizado em {updatedAt}
    </p>
  );
}
