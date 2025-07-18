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

// Dados de fallback para quando a API falha
const fallbackCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 67000,
    market_cap: 1300000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3500,
    market_cap: 420000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    current_price: 1.00,
    market_cap: 120000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.1
  }
];

// CoinGecko API com proxy CORS e fallback
export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    console.log('Buscando dados de criptomoedas...');
    
    // Tenta primeiro com proxy CORS
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const url = encodeURIComponent('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
    
    const response = await fetch(`${corsProxy}${url}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('CoinGecko response:', data);
    
    if (!Array.isArray(data)) {
      console.error('Resposta inesperada da API:', data);
      console.log('Usando dados de fallback...');
      return fallbackCryptoData;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do CoinGecko:', error);
    console.log('Usando dados de fallback...');
    return fallbackCryptoData;
  }
};

// Dados históricos de fallback
const generateFallbackHistoricalData = (days: number = 30) => {
  const prices = [];
  const basePrice = 67000;
  const now = Date.now();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = basePrice * (1 + variation);
    prices.push([timestamp, price]);
  }
  
  return { prices };
};

export const fetchHistoricalData = async (coinId: string, days: number = 30) => {
  try {
    console.log(`Buscando dados históricos para ${coinId}...`);
    
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const url = encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    
    const response = await fetch(`${corsProxy}${url}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados históricos recebidos:', data);
    
    if (!data.prices || !Array.isArray(data.prices)) {
      console.error('Dados históricos inválidos:', data);
      console.log('Usando dados históricos de fallback...');
      return generateFallbackHistoricalData(days);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados históricos:', error);
    console.log('Usando dados históricos de fallback...');
    return generateFallbackHistoricalData(days);
  }
};

// Alternative.me Fear & Greed Index
export const fetchFearGreedIndex = async (): Promise<FearGreedData | null> => {
  try {
    console.log('Buscando Fear & Greed Index...');
    const response = await fetch('https://api.alternative.me/fng/', {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fear & Greed response:', data);
    
    if (data?.data && Array.isArray(data.data) && data.data[0]) {
      return data.data[0];
    }
    
    console.error('Dados de Fear & Greed inválidos:', data);
    return null;
  } catch (error) {
    console.error('Erro ao buscar Fear & Greed Index:', error);
    return null;
  }
};

// Dados de fallback para dominância
const fallbackDominanceData: DominanceData = {
  btc_dominance: 54.2,
  altcoins_cap: 1200000000000,
  total_market_cap: 2600000000000
};

// Usar CoinGecko para dominância com proxy CORS e fallback
export const fetchMarketDominance = async (): Promise<DominanceData | null> => {
  try {
    console.log('Buscando dominância via CoinGecko...');
    
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const url = encodeURIComponent('https://api.coingecko.com/api/v3/global');
    
    const response = await fetch(`${corsProxy}${url}`, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('CoinGecko global response:', data);
    
    if (data?.data?.market_cap_percentage?.btc && data?.data?.total_market_cap?.usd) {
      const btcDominance = data.data.market_cap_percentage.btc;
      const totalMarketCap = data.data.total_market_cap.usd;
      
      return {
        btc_dominance: btcDominance,
        altcoins_cap: totalMarketCap * (100 - btcDominance) / 100,
        total_market_cap: totalMarketCap
      };
    }
    
    console.error('Dados de dominância inválidos:', data);
    console.log('Usando dados de dominância de fallback...');
    return fallbackDominanceData;
  } catch (error) {
    console.error('Erro ao buscar dominância de mercado:', error);
    console.log('Usando dados de dominância de fallback...');
    return fallbackDominanceData;
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