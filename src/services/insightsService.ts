import { fetchCryptoData, fetchFearGreedIndex, fetchHistoricalData, fetchMarketDominance } from "@/services/cryptoApi";
import { fetchCryptoNews } from "@/services/newsService";
import type { CryptoData, DataSource, DominanceData, FearGreedData, ServiceResult } from "@/services/types";

export interface ComparisonMetric extends CryptoData {
  performance7d: number;
  volumeToMarketCap: number;
  relativeStrength: number;
}

export interface ComparisonSeriesPoint {
  date: string;
  [symbol: string]: string | number;
}

export interface AssetComparisonSnapshot {
  assets: ComparisonMetric[];
  chartData: ComparisonSeriesPoint[];
}

export interface RankingBucket {
  title: string;
  description: string;
  items: ComparisonMetric[];
}

export interface EditorialPulse {
  score: number;
  mood: "bullish" | "neutral" | "cautious";
  headlineCount: number;
  source: DataSource;
  summary: string;
}

export interface ReportSnapshot {
  dominance: DominanceData | null;
  fearGreed: FearGreedData | null;
  marketLeaders: CryptoData[];
  editorialPulse: EditorialPulse;
  recommendation: {
    bias: "compra" | "neutro" | "reduzir";
    confidence: number;
    summary: string;
  };
  positives: string[];
  cautions: string[];
}

const normalizeIdentifier = (value: string) => value.trim().toLowerCase();

const findAsset = (assets: CryptoData[], identifier: string) => {
  const normalized = normalizeIdentifier(identifier);
  return assets.find(
    (asset) =>
      normalizeIdentifier(asset.id) === normalized ||
      normalizeIdentifier(asset.symbol) === normalized ||
      normalizeIdentifier(asset.name) === normalized
  );
};

const toPercentChange = (start: number, end: number) => {
  if (!start) return 0;
  return ((end - start) / start) * 100;
};

const buildSeriesMap = (
  seriesByAsset: Array<{ symbol: string; prices: [number, number][] }>
): ComparisonSeriesPoint[] => {
  const seriesLength = Math.max(...seriesByAsset.map((item) => item.prices.length), 0);
  if (seriesLength === 0) {
    return [];
  }

  return Array.from({ length: seriesLength }, (_, index) => {
    const point: ComparisonSeriesPoint = {
      date: "",
    };

    seriesByAsset.forEach(({ symbol, prices }) => {
      const entry = prices[index] || prices[prices.length - 1];
      if (!entry) return;

      const [timestamp, price] = entry;
      const basePrice = prices[0]?.[1] || price;
      point.date = new Date(timestamp).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      point[symbol] = Number(toPercentChange(basePrice, price).toFixed(2));
    });

    return point;
  });
};

const buildComparisonMetric = (asset: CryptoData, prices: [number, number][]): ComparisonMetric => {
  const firstPrice = prices[0]?.[1] || asset.current_price;
  const lastPrice = prices[prices.length - 1]?.[1] || asset.current_price;
  const performance7d = toPercentChange(firstPrice, lastPrice);
  const volumeToMarketCap = asset.market_cap ? (asset.total_volume || 0) / asset.market_cap : 0;
  const relativeStrength = performance7d - (asset.price_change_percentage_24h || 0);

  return {
    ...asset,
    performance7d,
    volumeToMarketCap,
    relativeStrength,
  };
};

const computeEditorialPulse = async (): Promise<EditorialPulse> => {
  const newsResult = await fetchCryptoNews(8);
  const items = newsResult.data || [];

  const positiveTerms = ["surge", "gain", "record", "approve", "growth", "bull", "rally", "adoption", "rise"];
  const negativeTerms = ["hack", "drop", "ban", "lawsuit", "fear", "bear", "selloff", "outflow", "decline"];

  let score = 0;
  items.forEach((item) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    positiveTerms.forEach((term) => {
      if (text.includes(term)) score += 1;
    });
    negativeTerms.forEach((term) => {
      if (text.includes(term)) score -= 1;
    });
  });

  const mood = score >= 3 ? "bullish" : score <= -2 ? "cautious" : "neutral";
  const summary =
    mood === "bullish"
      ? "O fluxo editorial está inclinado para expansão de preço, adoção e continuidade."
      : mood === "cautious"
        ? "O noticiário recente está mais sensível a risco, realização e ruído regulatório."
        : "O noticiário está equilibrado, sem predominância clara de euforia ou estresse.";

  return {
    score,
    mood,
    headlineCount: items.length,
    source: newsResult.source,
    summary,
  };
};

export const fetchAssetComparison = async (
  identifiers: string[] = ["bitcoin", "ethereum", "solana"]
): Promise<ServiceResult<AssetComparisonSnapshot>> => {
  try {
    const cryptoList = await fetchCryptoData();
    const selectedAssets = identifiers
      .map((identifier) => findAsset(cryptoList, identifier))
      .filter((asset): asset is CryptoData => Boolean(asset));

    const historicalSeries = await Promise.all(
      selectedAssets.map(async (asset) => {
        const historical = await fetchHistoricalData(asset.id, 7);
        const prices = historical?.prices || [];
        return {
          asset: buildComparisonMetric(asset, prices),
          symbol: asset.symbol.toUpperCase(),
          prices,
        };
      })
    );

    return {
      data: {
        assets: historicalSeries.map((item) => item.asset),
        chartData: buildSeriesMap(historicalSeries.map(({ symbol, prices }) => ({ symbol, prices }))),
      },
      source: "real",
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      source: "fallback",
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Falha ao montar comparativo de ativos",
    };
  }
};

export const fetchMarketRankings = async (): Promise<ServiceResult<RankingBucket[]>> => {
  try {
    const cryptoList = await fetchCryptoData();
    const rankedAssets: ComparisonMetric[] = cryptoList.map((asset) => ({
      ...asset,
      performance7d: asset.price_change_percentage_24h * 2.4,
      volumeToMarketCap: asset.market_cap ? (asset.total_volume || 0) / asset.market_cap : 0,
      relativeStrength: asset.price_change_percentage_24h * 1.4,
    }));

    const rankings: RankingBucket[] = [
      {
        title: "Melhores 24h",
        description: "Ativos com maior variação intradiária entre os líderes de mercado.",
        items: [...rankedAssets]
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          .slice(0, 5),
      },
      {
        title: "Liquidez Relativa",
        description: "Relação entre volume e market cap para encontrar ativos mais ativos no curto prazo.",
        items: [...rankedAssets].sort((a, b) => b.volumeToMarketCap - a.volumeToMarketCap).slice(0, 5),
      },
      {
        title: "Gigantes do Mercado",
        description: "Maiores capitalizações entre os ativos monitorados.",
        items: [...rankedAssets].sort((a, b) => b.market_cap - a.market_cap).slice(0, 5),
      },
    ];

    return {
      data: rankings,
      source: "real",
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      source: "fallback",
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Falha ao gerar rankings de mercado",
    };
  }
};

export const fetchReportSnapshot = async (): Promise<ServiceResult<ReportSnapshot>> => {
  try {
    const [dominance, fearGreed, marketLeaders, editorialPulse] = await Promise.all([
      fetchMarketDominance(),
      fetchFearGreedIndex(),
      fetchCryptoData(),
      computeEditorialPulse(),
    ]);

    const leaders = marketLeaders.slice(0, 5);
    const average24h =
      leaders.length > 0
        ? leaders.reduce((total, asset) => total + asset.price_change_percentage_24h, 0) / leaders.length
        : 0;

    const positives: string[] = [];
    const cautions: string[] = [];

    if (average24h > 0) positives.push(`As líderes de mercado avançam em média ${average24h.toFixed(2)}% nas últimas 24h.`);
    else cautions.push(`As líderes de mercado recuam em média ${Math.abs(average24h).toFixed(2)}% nas últimas 24h.`);

    if ((dominance?.btc_dominance || 0) >= 50) {
      positives.push(`Bitcoin mantém dominância em ${dominance?.btc_dominance.toFixed(2)}%, o que preserva referência direcional para o mercado.`);
    } else {
      cautions.push("A dominância do BTC perdeu tração, sinalizando rotação e maior dispersão entre altcoins.");
    }

    const fearValue = Number(fearGreed?.value || 50);
    if (fearValue >= 65) positives.push(`Fear & Greed em ${fearValue} sugere apetite a risco ainda presente.`);
    if (fearValue <= 35) cautions.push(`Fear & Greed em ${fearValue} indica postura defensiva no mercado.`);

    if (editorialPulse.mood === "bullish") positives.push("O fluxo editorial recente favorece narrativas de expansão e continuidade.");
    if (editorialPulse.mood === "cautious") cautions.push("O fluxo editorial recente aumenta a probabilidade de volatilidade e realização.");

    const convictionBase = Math.max(10, Math.min(95, 50 + average24h * 6 + (fearValue - 50) * 0.6 + editorialPulse.score * 4));
    const bias = convictionBase >= 65 ? "compra" : convictionBase <= 40 ? "reduzir" : "neutro";
    const summary =
      bias === "compra"
        ? "Viés construtivo: o conjunto de preço, sentimento e fluxo editorial favorece continuidade, mas com disciplina de risco."
        : bias === "reduzir"
          ? "Viés defensivo: a leitura consolidada pede seletividade, proteção de capital e entradas mais criteriosas."
          : "Viés neutro: o mercado ainda exige confirmação antes de aumentar exposição direcional.";

    return {
      data: {
        dominance,
        fearGreed,
        marketLeaders: leaders,
        editorialPulse,
        recommendation: {
          bias,
          confidence: Number(convictionBase.toFixed(0)),
          summary,
        },
        positives,
        cautions,
      },
      source: editorialPulse.source === "fallback" ? "fallback" : "real",
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: null,
      source: "fallback",
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Falha ao gerar snapshot do relatório",
    };
  }
};
