import { editorialPages } from "@/content/editorial";
import { EditorialArticlePage } from "./EditorialArticlePage";

export function GlossaryIndexPage() {
  return <EditorialArticlePage page={editorialPages["glossario-cripto"]} />;
}
