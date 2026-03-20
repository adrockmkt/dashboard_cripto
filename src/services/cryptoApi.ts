export type {
  CryptoData,
  DominanceData,
  FearGreedData,
  TechnicalIndicators,
} from "@/services/types";

export {
  calculateTechnicalIndicators,
  fetchCryptoData,
  fetchFearGreedIndex,
  fetchHistoricalData,
  fetchMarketDominance,
} from "@/services/marketService";
