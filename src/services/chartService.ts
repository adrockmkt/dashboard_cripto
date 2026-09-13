import type { OHLCVPoint, ServiceResult } from "@/services/types";
import { getMarketJson } from "@/services/marketGateway";

type ChartTimeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

const coinIds: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum" };
const timeframeDays: Record<ChartTimeframe, number> = { "1m": 1, "5m": 1, "15m": 1, "1h": 7, "4h": 14, "1d": 30 };

const generateSimulatedCandles = (points: number = 200): OHLCVPoint[] => {
  const data: OHLCVPoint[] = [];
  let basePrice = 48000;
  const now = Math.floor(Date.now() / 1000);
  const step = 60 * 60;

  for (let i = points; i >= 0; i -= 1) {
    const time = now - i * step;
    const volatility = 0.015;
    const trend = Math.sin(i / 25) * 0.002;
    const noise = (Math.random() - 0.5) * volatility;

    basePrice *= 1 + trend + noise;

    const open = basePrice;
    const close = open * (1 + (Math.random() - 0.5) * 0.012);
    const high = Math.max(open, close) * (1 + Math.random() * 0.008);
    const low = Math.min(open, close) * (1 - Math.random() * 0.008);

    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round(Math.random() * 1000000 + 500000),
    });

    basePrice = close;
  }

  return data;
};

export const fetchOHLCVData = async (
  symbol: string = "BTC",
  timeframe: ChartTimeframe = "1h",
  limit: number = 200
): Promise<ServiceResult<OHLCVPoint[]>> => {
  try {
    const coinId = coinIds[symbol.toUpperCase()] || symbol.toLowerCase();
    const query = new URLSearchParams({ vs_currency: "usd", days: String(timeframeDays[timeframe]), precision: "2" });
    const payload = await getMarketJson<{ prices?: Array<[number, number]> }>(
      `/cripto-dashboard/api/market/coingecko/coins/${encodeURIComponent(coinId)}/market_chart?${query}`
    );
    const rawPoints = payload.prices?.slice(-limit);

    if (!rawPoints?.length) {
      throw new Error("Nenhum candle retornado pela API");
    }

    const points = rawPoints
      .filter(([, price]) => Number.isFinite(price))
      .map(([timestamp, close], index, prices) => {
        const open = prices[Math.max(0, index - 1)][1];
        return {
          time: Math.floor(timestamp / 1000),
          open,
          high: Math.max(open, close),
          low: Math.min(open, close),
          close,
          volume: 0,
        };
      });

    return {
      data: points,
      source: "real",
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      data: generateSimulatedCandles(limit),
      source: "simulated",
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Falha ao carregar candles",
    };
  }
};
