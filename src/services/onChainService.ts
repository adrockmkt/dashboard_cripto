import type {
  OnChainOverview,
  OnChainHistoryPoint,
  OnChainSnapshot,
  ServiceResult,
} from "@/services/types";
import { getMarketJson } from "@/services/marketGateway";

interface BlockchainChartResponse {
  values?: Array<{ x: number; y: number }>;
}

const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString("pt-BR");

const normalizeToPercent = (value: number | null, min: number, max: number) => {
  if (value === null || max === min) return 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

const fetchBlockchainChart = async (chartName: string, timespan: string = "30days") => {
  const query = new URLSearchParams({ timespan, format: "json", sampled: "true" });
  const data = await getMarketJson<BlockchainChartResponse>(
    `/cripto-dashboard/api/market/blockchain/charts/${chartName}?${query}`
  );
  return Array.isArray(data.values) ? data.values : [];
};

const buildHistoryFromSeries = (
  series: Array<{
    points: Array<{ x: number; y: number }>;
    field: keyof Omit<OnChainHistoryPoint, "date" | "timestamp">;
  }>
) => {
  const historyByDay = new Map<string, OnChainHistoryPoint>();

  series.forEach(({ points, field }) => {
    points.forEach((point) => {
      const key = new Date(point.x * 1000).toLocaleDateString("en-CA");
      const entry = historyByDay.get(key) ?? {
        date: formatDate(point.x),
        timestamp: point.x,
        activeAddresses: null,
        hashrate: null,
        mempoolSize: null,
        fees: null,
      };
      entry[field] = point.y;
      historyByDay.set(key, entry);
    });
  });

  return Array.from(historyByDay.values())
    .sort((left, right) => left.timestamp - right.timestamp)
    .slice(-30);
};

const buildOverviewFromHistory = (
  history: OnChainHistoryPoint[],
  recommendedFees: OnChainOverview["recommendedFees"]
): OnChainOverview | null => {
  if (history.length === 0) return null;

  const latest = history.at(-1);
  const activeAddressesRange = history.flatMap((point) => point.activeAddresses === null ? [] : [point.activeAddresses]);
  const hashrateRange = history.flatMap((point) => point.hashrate === null ? [] : [point.hashrate]);
  const mempoolRange = history.flatMap((point) => point.mempoolSize === null ? [] : [point.mempoolSize]);
  const feeRange = history.flatMap((point) => point.fees === null ? [] : [point.fees]);

  const adoption = normalizeToPercent(
    latest?.activeAddresses ?? null,
    activeAddressesRange.length ? Math.min(...activeAddressesRange) : 0,
    activeAddressesRange.length ? Math.max(...activeAddressesRange) : 0
  );
  const security = normalizeToPercent(
    latest?.hashrate ?? null,
    hashrateRange.length ? Math.min(...hashrateRange) : 0,
    hashrateRange.length ? Math.max(...hashrateRange) : 0
  );
  const activity = normalizeToPercent(
    latest?.mempoolSize ?? null,
    mempoolRange.length ? Math.min(...mempoolRange) : 0,
    mempoolRange.length ? Math.max(...mempoolRange) : 0
  );
  const feeComfort = 100 - normalizeToPercent(
    latest?.fees ?? null,
    feeRange.length ? Math.min(...feeRange) : 0,
    feeRange.length ? Math.max(...feeRange) : 0
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
      fetchBlockchainChart("transaction-fees-usd"),
    ]);

  const recommendedFeesResult = await getMarketJson<any>("/cripto-dashboard/api/market/mempool/api/v1/fees/recommended")
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

  const history = buildHistoryFromSeries([
    { points: addresses, field: "activeAddresses" },
    { points: hashrate, field: "hashrate" },
    { points: mempool, field: "mempoolSize" },
    { points: fees, field: "fees" },
  ]);

  let source: ServiceResult<OnChainSnapshot>["source"] = "real";
  const unavailableMetrics: string[] = [];
  if (addressesResult.status === "rejected" || addresses.length === 0) unavailableMetrics.push("Endereços ativos");
  if (hashrateResult.status === "rejected" || hashrate.length === 0) unavailableMetrics.push("Hashrate");
  if (mempoolResult.status === "rejected" || mempool.length === 0) unavailableMetrics.push("Mempool");
  if (feesResult.status === "rejected" || fees.length === 0) unavailableMetrics.push("Taxa média");
  if (!recommendedFeesResult) unavailableMetrics.push("Taxas recomendadas");

  const availability = history.length === 0
    ? "unavailable"
    : unavailableMetrics.length === 0
      ? "complete"
      : "partial";

  if (availability !== "complete") source = "fallback";

  return {
    data: {
      overview: buildOverviewFromHistory(history, recommendedFees),
      history,
      availability,
      unavailableMetrics,
    },
    source,
    updatedAt: new Date().toISOString(),
    error: availability === "unavailable" ? "Métricas on-chain indisponíveis no momento." : undefined,
  };
};
