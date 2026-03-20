import type {
  CryptoData,
  DominanceData,
  FearGreedData,
  TechnicalIndicators,
} from "@/services/types";

const fallbackCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    current_price: 67000,
    market_cap: 1300000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    total_volume: 24000000000,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    current_price: 3500,
    market_cap: 420000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    total_volume: 16000000000,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    current_price: 1.0,
    market_cap: 120000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.1,
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    total_volume: 50000000000,
  },
];

const fallbackDominanceData: DominanceData = {
  btc_dominance: 54.2,
  altcoins_cap: 1200000000000,
  total_market_cap: 2600000000000,
};

const generateFallbackHistoricalData = (days: number = 30) => {
  const prices = [];
  const basePrice = 67000;
  const now = Date.now();

  for (let i = days; i >= 0; i -= 1) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    const variation = (Math.random() - 0.5) * 0.1;
    const price = basePrice * (1 + variation);
    prices.push([timestamp, price]);
  }

  return { prices };
};

export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h"
    );

    if (response.ok) {
      const data = await response.json();
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toLowerCase(),
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        total_volume: coin.total_volume || 0,
      }));
    }
  } catch (error) {
    console.log("CoinGecko falhou, tentando CryptoCompare...", error);
  }

  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD"
    );

    if (response.ok) {
      const data = await response.json();
      return data.Data.map((item: any, index: number) => {
        const coin = item.CoinInfo;
        const raw = item.RAW?.USD || {};

        return {
          id: coin.Name.toLowerCase(),
          symbol: coin.Name.toLowerCase(),
          name: coin.FullName,
          image: `https://www.cryptocompare.com${coin.ImageUrl}`,
          current_price: raw.PRICE || 0,
          market_cap: raw.MKTCAP || 0,
          market_cap_rank: index + 1,
          price_change_percentage_24h: raw.CHANGEPCT24HOUR || 0,
          total_volume: raw.VOLUME24HOUR || 0,
        };
      });
    }
  } catch (error) {
    console.log("CryptoCompare falhou:", error);
  }

  return fallbackCryptoData;
};

export const fetchHistoricalData = async (coinId: string, days: number = 30) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily&precision=2`
    );

    if (response.ok) {
      const result = await response.json();

      if (result?.prices && Array.isArray(result.prices) && result.prices.length > 0) {
        const prices: [number, number][] = result.prices.map(
          ([timestamp, price]: [number, number]) => [timestamp, price]
        );
        return { prices };
      }
    }
  } catch (error) {
    console.log("CoinGecko histórico falhou:", error);
  }

  try {
    let currentPrice = 45000;
    const currentResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );

    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      currentPrice = currentData[coinId]?.usd || currentPrice;
    }

    const prices: [number, number][] = [];
    const now = Date.now();
    const pointsPerDay = days <= 7 ? 24 : days <= 30 ? 4 : 1;
    const totalPoints = days * pointsPerDay;
    const intervalMs = (24 * 60 * 60 * 1000) / pointsPerDay;

    let basePrice = currentPrice * (0.9 + Math.random() * 0.2);

    for (let i = 0; i < totalPoints; i += 1) {
      const timestamp = now - (totalPoints - 1 - i) * intervalMs;
      const progress = i / totalPoints;
      const trend = Math.sin(progress * Math.PI * 2) * 0.01;
      const volatility = (Math.random() - 0.5) * 0.02;
      const growth = progress * 0.1 - 0.05;

      basePrice *= 1 + trend + volatility + growth / totalPoints;
      basePrice = Math.max(basePrice, currentPrice * 0.5);
      prices.push([timestamp, basePrice]);
    }

    if (prices.length > 0) {
      prices[prices.length - 1][1] = currentPrice;
    }

    return { prices };
  } catch (error) {
    console.error(`Erro ao buscar dados históricos para ${coinId}:`, error);
    return generateFallbackHistoricalData(days);
  }
};

export const fetchFearGreedIndex = async (): Promise<FearGreedData | null> => {
  try {
    const response = await fetch("https://api.alternative.me/fng/", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.[0] || null;
  } catch (error) {
    console.error("Erro ao buscar Fear & Greed Index:", error);
    return null;
  }
};

export const fetchMarketDominance = async (): Promise<DominanceData | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://api.coingecko.com/api/v3/global", {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const globalData = data.data;

    if (globalData?.market_cap_percentage && globalData?.total_market_cap) {
      const btcDominance = globalData.market_cap_percentage.btc;
      const totalMarketCap = globalData.total_market_cap.usd;
      const altcoinMarketCap = totalMarketCap * (1 - btcDominance / 100);

      return {
        btc_dominance: btcDominance,
        altcoins_cap: altcoinMarketCap,
        total_market_cap: totalMarketCap,
      };
    }
  } catch (error) {
    console.log("Erro ao buscar dominância de mercado:", error);
  }

  return fallbackDominanceData;
};

export const calculateTechnicalIndicators = (prices: number[]): TechnicalIndicators => {
  const calculateSMA = (data: number[], period: number): number => {
    if (data.length < period) return 0;
    const sum = data.slice(-period).reduce((acc, price) => acc + price, 0);
    return sum / period;
  };

  const calculateRSI = (data: number[], period: number = 14): number => {
    if (data.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = data.length - period; i < data.length; i += 1) {
      const change = data[i] - data[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  };

  const calculateMomentum = (data: number[], period: number = 10): number => {
    if (data.length < period) return 0;
    return ((data[data.length - 1] - data[data.length - period]) / data[data.length - period]) * 100;
  };

  const calculateBollingerBands = (data: number[], period: number = 20, multiplier: number = 2) => {
    const sma = calculateSMA(data, period);
    const slice = data.slice(-period);
    const variance = slice.reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    return {
      upper: sma + stdDev * multiplier,
      lower: sma - stdDev * multiplier,
    };
  };

  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const fibonacciLevels = [0.236, 0.382, 0.5, 0.618, 0.786].map(
    (ratio) => high - (high - low) * ratio
  );
  const bollinger = calculateBollingerBands(prices);

  return {
    rsi: calculateRSI(prices),
    momentum: calculateMomentum(prices),
    mfi: calculateRSI(prices, 14),
    sma50: calculateSMA(prices, 50),
    sma100: calculateSMA(prices, 100),
    sma200: calculateSMA(prices, 200),
    bollingerUpper: bollinger.upper,
    bollingerLower: bollinger.lower,
    fibonacciLevels,
  };
};
