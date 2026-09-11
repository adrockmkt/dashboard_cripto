import { editorialPages } from "@/content/editorial";
import { EditorialArticlePage } from "./EditorialArticlePage";

export function EthereumTodayPage() {
  return <EditorialArticlePage page={editorialPages["ethereum-hoje"]} />;
}
