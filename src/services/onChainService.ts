import type {
  OnChainOverview,
  OnChainHistoryPoint,
  OnChainSnapshot,
  ServiceResult,
} from "@/services/types";

interface BlockchainChartResponse {
  values?: Array<{ x: number; y: number }>;
}

const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString("pt-BR");

const normalizeToPercent = (value: number | null, min: number, max: number) => {
  if (value === null || max === min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

const fetchBlockchainChart = async (chartName: string, timespan: string = "30days") => {
  const endpoints = [
    `https://api.blockchain.info/charts/${chartName}?timespan=${timespan}&format=json&sampled=true&cors=true`,
    `https://blockchain.info/charts/${chartName}?timespan=${timespan}&format=json&sampled=true&cors=true`,
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Falha ao carregar ${chartName}: ${response.status}`);
      }

      const data = (await response.json()) as BlockchainChartResponse;
      return Array.isArray(data.values) ? data.values : [];
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Falha desconhecida");
    }
  }

  throw lastError || new Error(`Falha ao carregar ${chartName}`);
};

const buildFallbackHistory = (): OnChainHistoryPoint[] => {
  const history: OnChainHistoryPoint[] = [];
  const now = Math.floor(Date.now() / 1000);

  for (let i = 29; i >= 0; i -= 1) {
    const timestamp = now - i * 24 * 60 * 60;
    history.push({
      date: formatDate(timestamp),
      timestamp,
      activeAddresses: 650000 + i * 3500,
      hashrate: 520 - i * 1.2,
      mempoolSize: 18000 + i * 250,
      fees: 2.5 + (i % 7) * 0.25,
    });
  }

  return history;
};

const mergeSeriesIntoHistory = (
  history: OnChainHistoryPoint[],
  points: Array<{ x: number; y: number }>,
  field: keyof Omit<OnChainHistoryPoint, "date" | "timestamp">
) => {
  const historyByDay = new Map(
    history.map((point) => [
      new Date(point.timestamp * 1000).toLocaleDateString("en-CA"),
      point,
    ])
  );

  points.forEach((point) => {
    const key = new Date(point.x * 1000).toLocaleDateString("en-CA");
    const target = historyByDay.get(key);
    if (target) {
      target[field] = point.y;
    }
  });

  return history;
};

const buildOverviewFromHistory = (
  history: OnChainHistoryPoint[],
  recommendedFees: OnChainOverview["recommendedFees"]
): OnChainOverview => {
  const latest = history.at(-1);
  const activeAddressesRange = history.map((point) => point.activeAddresses ?? 0);
  const hashrateRange = history.map((point) => point.hashrate ?? 0);
  const mempoolRange = history.map((point) => point.mempoolSize ?? 0);
  const feeRange = history.map((point) => point.fees ?? 0);

  const adoption = normalizeToPercent(
    latest?.activeAddresses ?? null,
    Math.min(...activeAddressesRange),
    Math.max(...activeAddressesRange)
  );
  const security = normalizeToPercent(
    latest?.hashrate ?? null,
    Math.min(...hashrateRange),
    Math.max(...hashrateRange)
  );
  const activity = normalizeToPercent(
    latest?.mempoolSize ?? null,
    Math.min(...mempoolRange),
    Math.max(...mempoolRange)
  );
  const feeComfort = 100 - normalizeToPercent(
    latest?.fees ?? null,
    Math.min(...feeRange),
    Math.max(...feeRange)
  );
  const score = (adoption + security + activity + feeComfort) / 4;

  return {
    activeAddresses: latest?.activeAddresses ?? null,
    hashrate: latest?.hashrate ?? null,
    mempoolTransactions: latest?.mempoolSize ?? null,
    averageFeeUsd: latest?.fees ?? null,
    recommendedFees,
    networkHealth: {
      score,
      factors: {
        security,
        activity,
        adoption,
        fees: feeComfort,
      },
    },
  };
};

export const fetchOnChainSnapshot = async (): Promise<ServiceResult<OnChainSnapshot>> => {
  const chartResults = await Promise.allSettled([
      fetchBlockchainChart("n-unique-addresses"),
      fetchBlockchainChart("hash-rate"),
      fetchBlockchainChart("mempool-count", "30days"),
      fetchBlockchainChart("fees-usd-per-transaction"),
    ]);

  const recommendedFeesResult = await fetch("https://mempool.space/api/v1/fees/recommended")
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Falha ao carregar taxas recomendadas: ${response.status}`);
      }
      return response.json();
    })
    .catch(() => null);

  const recommendedFees = {
    fastestFee: recommendedFeesResult?.fastestFee ?? 12,
    halfHourFee: recommendedFeesResult?.halfHourFee ?? 8,
    hourFee: recommendedFeesResult?.hourFee ?? 5,
  };

  const [addressesResult, hashrateResult, mempoolResult, feesResult] = chartResults;
  const addresses = addressesResult.status === "fulfilled" ? addressesResult.value : [];
  const hashrate = hashrateResult.status === "fulfilled" ? hashrateResult.value : [];
  const mempool = mempoolResult.status === "fulfilled" ? mempoolResult.value : [];
  const fees = feesResult.status === "fulfilled" ? feesResult.value : [];

  let history = buildFallbackHistory();
  history = mergeSeriesIntoHistory(history, addresses, "activeAddresses");
  history = mergeSeriesIntoHistory(history, hashrate, "hashrate");
  history = mergeSeriesIntoHistory(history, mempool, "mempoolSize");
  history = mergeSeriesIntoHistory(history, fees, "fees");

  let source: ServiceResult<OnChainSnapshot>["source"] = "real";
  const errors: string[] = [];

  if (addressesResult.status === "rejected") errors.push(addressesResult.reason?.message || "Falha em endereços ativos");
  if (hashrateResult.status === "rejected") errors.push(hashrateResult.reason?.message || "Falha em hashrate");
  if (mempoolResult.status === "rejected") errors.push(mempoolResult.reason?.message || "Falha em mempool");
  if (feesResult.status === "rejected") errors.push(feesResult.reason?.message || "Falha em fees");
  if (!recommendedFeesResult) errors.push("Falha em taxas recomendadas");

  if (errors.length > 0) {
    source = "fallback";
  }

  return {
    data: {
      overview: buildOverviewFromHistory(history, recommendedFees),
      history,
    },
    source,
    updatedAt: new Date().toISOString(),
    error: errors.length > 0 ? errors.join(" | ") : undefined,
  };
};
