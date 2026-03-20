export type DataSource = "real" | "fallback" | "simulated";

export interface ServiceResult<T> {
  data: T | null;
  source: DataSource;
  updatedAt: string;
  error?: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
  total_volume?: number;
}

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

export interface DominanceData {
  btc_dominance: number;
  altcoins_cap: number;
  total_market_cap: number;
}

export interface TechnicalIndicators {
  rsi: number;
  momentum: number;
  mfi: number;
  sma50: number;
  sma100: number;
  sma200: number;
  bollingerUpper: number;
  bollingerLower: number;
  fibonacciLevels: number[];
}

export interface CryptoNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: "bitcoin" | "ethereum" | "market" | "regulation" | "technology";
}

export interface OHLCVPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OnChainOverview {
  activeAddresses: number | null;
  hashrate: number | null;
  mempoolTransactions: number | null;
  averageFeeUsd: number | null;
  recommendedFees: {
    fastestFee: number | null;
    halfHourFee: number | null;
    hourFee: number | null;
  };
  networkHealth: {
    score: number;
    factors: {
      security: number;
      activity: number;
      adoption: number;
      fees: number;
    };
  };
}

export interface OnChainHistoryPoint {
  date: string;
  timestamp: number;
  activeAddresses: number | null;
  hashrate: number | null;
  mempoolSize: number | null;
  fees: number | null;
}

export interface OnChainSnapshot {
  overview: OnChainOverview;
  history: OnChainHistoryPoint[];
}
