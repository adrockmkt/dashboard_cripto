import { calculateTechnicalIndicators, fetchCryptoData, fetchFearGreedIndex, fetchHistoricalData } from "@/services/marketService";
import { fetchOnChainSnapshot } from "@/services/onChainService";

export interface AdvancedAlert {
  id: string;
  name: string;
  type: "price" | "technical" | "onchain" | "pattern" | "sentiment";
  conditions: AlertCondition[];
  actions: AlertAction[];
  isActive: boolean;
  triggered: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export interface AlertCondition {
  metric: string;
  operator: "above" | "below" | "crosses_above" | "crosses_below" | "equals";
  value: number;
  timeframe?: string;
}

export interface AlertAction {
  type: "sound" | "visual" | "email" | "webhook";
  config: Record<string, any>;
}

export interface AlertHistoryEntry {
  id: string;
  alertId: string;
  alertName: string;
  message: string;
  triggeredAt: string;
  metricValues: Record<string, number | null>;
}

export interface AlertEvaluationSnapshot {
  btc_price: number | null;
  btc_change_24h: number | null;
  rsi: number | null;
  momentum: number | null;
  fear_greed: number | null;
  active_addresses: number | null;
  hashrate: number | null;
  mempool: number | null;
  avg_fee_usd: number | null;
}

const isFiniteNumber = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const buildAlertSnapshot = async (): Promise<AlertEvaluationSnapshot> => {
  const [marketData, fearGreed, btcHistorical, onChain] = await Promise.all([
    fetchCryptoData(),
    fetchFearGreedIndex(),
    fetchHistoricalData("bitcoin", 200),
    fetchOnChainSnapshot(),
  ]);

  const btc = marketData.find((item) => item.id === "bitcoin" || item.symbol === "btc") || null;
  const prices = btcHistorical?.prices?.map((item: [number, number]) => item[1]) || [];
  const indicators = prices.length > 20 ? calculateTechnicalIndicators(prices) : null;

  return {
    btc_price: btc?.current_price ?? null,
    btc_change_24h: btc?.price_change_percentage_24h ?? null,
    rsi: indicators?.rsi ?? null,
    momentum: indicators?.momentum ?? null,
    fear_greed: fearGreed?.value ? Number(fearGreed.value) : null,
    active_addresses: onChain.data?.overview.activeAddresses ?? null,
    hashrate: onChain.data?.overview.hashrate ?? null,
    mempool: onChain.data?.overview.mempoolTransactions ?? null,
    avg_fee_usd: onChain.data?.overview.averageFeeUsd ?? null,
  };
};

const compareValues = (
  operator: AlertCondition["operator"],
  currentValue: number | null,
  previousValue: number | null,
  targetValue: number
) => {
  if (!isFiniteNumber(currentValue)) return false;

  switch (operator) {
    case "above":
      return currentValue > targetValue;
    case "below":
      return currentValue < targetValue;
    case "equals":
      return Math.abs(currentValue - targetValue) < 0.0001;
    case "crosses_above":
      return isFiniteNumber(previousValue) && previousValue <= targetValue && currentValue > targetValue;
    case "crosses_below":
      return isFiniteNumber(previousValue) && previousValue >= targetValue && currentValue < targetValue;
    default:
      return false;
  }
};

export const evaluateAlert = (
  alert: AdvancedAlert,
  snapshot: AlertEvaluationSnapshot,
  previousSnapshot: AlertEvaluationSnapshot | null
) => {
  const metrics: Record<string, number | null> = {};

  const passed = alert.conditions.every((condition) => {
    const currentValue = snapshot[condition.metric as keyof AlertEvaluationSnapshot] ?? null;
    const previousValue = previousSnapshot?.[condition.metric as keyof AlertEvaluationSnapshot] ?? null;
    metrics[condition.metric] = currentValue;

    return compareValues(condition.operator, currentValue, previousValue, condition.value);
  });

  return {
    passed,
    metrics,
  };
};

export const buildAlertMessage = (alert: AdvancedAlert, metrics: Record<string, number | null>) => {
  const firstCondition = alert.conditions[0];
  const currentValue = metrics[firstCondition.metric];
  const currentLabel = isFiniteNumber(currentValue) ? currentValue.toFixed(2) : "N/A";
  return `${alert.name} disparado: ${firstCondition.metric} ${firstCondition.operator} ${firstCondition.value} (atual: ${currentLabel})`;
};
