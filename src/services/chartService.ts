import type { OHLCVPoint, ServiceResult } from "@/services/types";

type ChartTimeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

const timeframeConfig: Record<ChartTimeframe, { endpoint: string; aggregate: number }> = {
  "1m": { endpoint: "histominute", aggregate: 1 },
  "5m": { endpoint: "histominute", aggregate: 5 },
  "15m": { endpoint: "histominute", aggregate: 15 },
  "1h": { endpoint: "histohour", aggregate: 1 },
  "4h": { endpoint: "histohour", aggregate: 4 },
  "1d": { endpoint: "histoday", aggregate: 1 },
};

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
  const config = timeframeConfig[timeframe];

  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/${config.endpoint}?fsym=${symbol}&tsym=USD&limit=${limit}&aggregate=${config.aggregate}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = await response.json();
    const rawPoints = payload?.Data?.Data;

    if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
      throw new Error("Nenhum candle retornado pela API");
    }

    const points = rawPoints
      .filter((item: any) => item.open && item.high && item.low && item.close)
      .map((item: any) => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volumefrom || item.volumeto || 0,
      }));

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
