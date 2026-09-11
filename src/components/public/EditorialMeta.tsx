interface EditorialMetaProps {
  author: string;
}

export function EditorialMeta({ author }: EditorialMetaProps) {
  return (
    <p className="text-sm text-muted-foreground">
      Por {author}
    </p>
  );
}
