// Serviços de APIs para análise cripto
const getApiKeys = () => {
  return {
    coingecko: localStorage.getItem('coingecko_api_key') || '',
    coinmarketcap: localStorage.getItem('coinmarketcap_api_key') || ''
  };
};

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
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

// CoinGecko API
export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    const { coingecko } = getApiKeys();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&x_cg_demo_api_key=${coingecko}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados do CoinGecko:', error);
    return [];
  }
};

export const fetchHistoricalData = async (coinId: string, days: number = 30) => {
  try {
    const { coingecko } = getApiKeys();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&x_cg_demo_api_key=${coingecko}`
    );
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados históricos:', error);
    return null;
  }
};

// Alternative.me Fear & Greed Index
export const fetchFearGreedIndex = async (): Promise<FearGreedData | null> => {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error('Erro ao buscar Fear & Greed Index:', error);
    return null;
  }
};

// CoinMarketCap para dominância
export const fetchMarketDominance = async (): Promise<DominanceData | null> => {
  try {
    const { coinmarketcap } = getApiKeys();
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': coinmarketcap,
          'Accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    return {
      btc_dominance: data.data.btc_dominance_percentage,
      altcoins_cap: data.data.altcoin_market_cap,
      total_market_cap: data.data.quote.USD.total_market_cap
    };
  } catch (error) {
    console.error('Erro ao buscar dominância de mercado:', error);
    return null;
  }
};

// Cálculo de indicadores técnicos
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
    
    for (let i = data.length - period; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
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
      upper: sma + (stdDev * multiplier),
      lower: sma - (stdDev * multiplier)
    };
  };

  const currentPrice = prices[prices.length - 1];
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  
  // Níveis de Fibonacci
  const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786].map(ratio => 
    high - (high - low) * ratio
  );

  const bollinger = calculateBollingerBands(prices);

  return {
    rsi: calculateRSI(prices),
    momentum: calculateMomentum(prices),
    mfi: calculateRSI(prices, 14), // Simplificado, normalmente usa volume
    sma50: calculateSMA(prices, 50),
    sma100: calculateSMA(prices, 100),
    sma200: calculateSMA(prices, 200),
    bollingerUpper: bollinger.upper,
    bollingerLower: bollinger.lower,
    fibonacciLevels: fibLevels
  };
};