import type { CryptoNewsItem, ServiceResult } from "@/services/types";

const fallbackNews: CryptoNewsItem[] = [
  {
    id: "fallback-1",
    title: "Bitcoin mantém atenção do mercado com foco em fluxo e liquidez",
    description:
      "O mercado segue monitorando preço, liquidez e sentimento de curto prazo, com investidores atentos à reação do BTC em zonas técnicas relevantes.",
    url: "https://www.coingecko.com/",
    source: "Fallback editorial",
    publishedAt: new Date(),
    category: "bitcoin",
  },
  {
    id: "fallback-2",
    title: "Ethereum e altcoins continuam sensíveis ao apetite por risco",
    description:
      "Movimentos das principais altcoins seguem acompanhando o comportamento macro do mercado cripto, com destaque para rotação entre BTC e ETH.",
    url: "https://www.coingecko.com/",
    source: "Fallback editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45),
    category: "ethereum",
  },
  {
    id: "fallback-3",
    title: "Sentimento e taxas de rede seguem no radar dos traders",
    description:
      "Fear & Greed, atividade on-chain e custos de transação continuam sendo sinais complementares para leitura do contexto de mercado.",
    url: "https://mempool.space/",
    source: "Fallback editorial",
    publishedAt: new Date(Date.now() - 1000 * 60 * 90),
    category: "market",
  },
];

const categorizeNews = (title: string, body: string, categories?: string): CryptoNewsItem["category"] => {
  const text = `${title} ${body} ${categories || ""}`.toLowerCase();

  if (text.includes("bitcoin") || text.includes("btc")) return "bitcoin";
  if (text.includes("ethereum") || text.includes("eth")) return "ethereum";
  if (text.includes("regulation") || text.includes("sec") || text.includes("law")) return "regulation";
  if (text.includes("defi") || text.includes("technology") || text.includes("protocol")) return "technology";
  return "market";
};

export const fetchCryptoNews = async (limit: number = 10): Promise<ServiceResult<CryptoNewsItem[]>> => {
  try {
    const response = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = await response.json();
    const rawItems = Array.isArray(payload?.Data) ? payload.Data.slice(0, limit) : [];
    const items = rawItems.map((item: any, index: number) => ({
      id: item.id?.toString() || `${item.guid || "news"}-${index}`,
      title: item.title || "Sem título",
      description: item.body || item.source_info?.name || "Sem descrição disponível",
      url: item.url || "#",
      source: item.source_info?.name || item.source || "CryptoCompare",
      publishedAt: new Date((item.published_on || Math.floor(Date.now() / 1000)) * 1000),
      category: categorizeNews(item.title || "", item.body || "", item.categories),
    }));

    if (items.length === 0) {
      return {
        data: fallbackNews.slice(0, limit),
        source: "fallback",
        updatedAt: new Date().toISOString(),
        error: "A fonte principal não retornou notícias.",
      };
    }

    return {
      data: items,
      source: "real",
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: fallbackNews.slice(0, limit),
      source: "fallback",
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Falha ao carregar notícias",
    };
  }
};
