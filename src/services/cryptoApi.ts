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

// APIs alternativas gratuitas e confiáveis
export const fetchCryptoData = async (): Promise<CryptoData[]> => {
  try {
    console.log('🚀 Buscando dados de criptomoedas via CoinCap...');
    
    // Primeira alternativa: CoinCap API (100% gratuita, sem limitações)
    try {
      const response = await fetch('https://api.coincap.io/v2/assets?limit=20');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ CoinCap funcionou! Recebidos:', data.data?.length || 0, 'cryptos');
        
        // Converter formato CoinCap para nosso formato
        const cryptos = data.data.map((coin: any, index: number) => ({
          id: coin.id,
          symbol: coin.symbol.toLowerCase(),
          name: coin.name,
          image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
          current_price: parseFloat(coin.priceUsd),
          market_cap: parseFloat(coin.marketCapUsd || 0),
          market_cap_rank: index + 1,
          price_change_percentage_24h: parseFloat(coin.changePercent24Hr || 0),
          total_volume: parseFloat(coin.volumeUsd24Hr || 0)
        }));
        
        return cryptos;
      }
    } catch (error) {
      console.log('❌ CoinCap falhou, tentando CryptoCompare...', error);
    }

    // Segunda alternativa: CryptoCompare API (gratuita)
    try {
      console.log('🔄 Tentando CryptoCompare...');
      const response = await fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ CryptoCompare funcionou! Recebidos:', data.Data?.length || 0, 'cryptos');
        
        const cryptos = data.Data.map((item: any, index: number) => {
          const coin = item.CoinInfo;
          const display = item.DISPLAY?.USD || {};
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
            total_volume: raw.VOLUME24HOUR || 0
          };
        });
        
        return cryptos;
      }
    } catch (error) {
      console.log('❌ CryptoCompare falhou:', error);
    }

    console.log('⚠️ Todas as APIs falharam, usando dados de exemplo...');
    return fallbackCryptoData;
    
  } catch (error) {
    console.error('❌ Erro geral ao buscar dados:', error);
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
    console.log(`📈 Buscando dados históricos para ${coinId} (${days} dias)...`);
    
    // Mapear IDs para CoinCap
    const coinMap: { [key: string]: string } = {
      'bitcoin': 'bitcoin',
      'ethereum': 'ethereum',
      'sui': 'sui',
      'wrapped-beacon-eth': 'ethereum',
      'bitcoin-cash': 'bitcoin-cash', 
      'chainlink': 'chainlink',
      'hedera-hashgraph': 'hedera-hashgraph'
    };
    
    const mappedCoinId = coinMap[coinId] || coinId;
    
    // Primeira alternativa: CoinCap API para dados históricos  
    try {
      const endTime = Date.now();
      const startTime = endTime - (days * 24 * 60 * 60 * 1000);
      const interval = days <= 7 ? 'h6' : 'd1';
      
      const response = await fetch(
        `https://api.coincap.io/v2/assets/${mappedCoinId}/history?interval=${interval}&start=${startTime}&end=${endTime}`
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('📊 Resposta CoinCap:', result);
        
        if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
          const prices: [number, number][] = result.data.map((item: any) => [
            parseInt(item.time),
            parseFloat(item.priceUsd)
          ]);
          
          console.log(`✅ CoinCap histórico OK: ${prices.length} pontos`);
          return { prices };
        }
      }
    } catch (error) {
      console.log('❌ CoinCap histórico falhou:', error);
    }

    // Segunda alternativa: gerar dados baseados no preço atual
    console.log('🔄 Gerando dados históricos simulados baseados no preço atual...');
    
    // Buscar preço atual
    let currentPrice = 45000; // Default para Bitcoin
    try {
      const currentResponse = await fetch(`https://api.coincap.io/v2/assets/${coinId}`);
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        currentPrice = parseFloat(currentData.data?.priceUsd || currentPrice);
        console.log(`💰 Preço atual de ${coinId}: $${currentPrice}`);
      }
    } catch (e) {
      console.log('⚠️ Usando preço padrão');
    }
    
    // Gerar dados históricos realistas
    const prices: [number, number][] = [];
    const now = Date.now();
    const pointsPerDay = days <= 7 ? 24 : days <= 30 ? 4 : 1;
    const totalPoints = days * pointsPerDay;
    const intervalMs = (24 * 60 * 60 * 1000) / pointsPerDay;
    
    let basePrice = currentPrice * (0.90 + Math.random() * 0.20); // Começar entre 90-110% do preço atual
    
    for (let i = 0; i < totalPoints; i++) {
      const timestamp = now - ((totalPoints - 1 - i) * intervalMs);
      
      // Simular movimento mais realista com tendências
      const progress = i / totalPoints;
      const trend = Math.sin(progress * Math.PI * 2) * 0.01; // Oscilação suave
      const volatility = (Math.random() - 0.5) * 0.02; // Volatilidade 2%
      const growth = (progress * 0.1) - 0.05; // Crescimento até o preço atual
      
      basePrice *= (1 + trend + volatility + (growth / totalPoints));
      basePrice = Math.max(basePrice, currentPrice * 0.5); // Não deixar cair muito
      
      prices.push([timestamp, basePrice]);
    }
    
    // Ajustar último preço para o preço atual
    if (prices.length > 0) {
      prices[prices.length - 1][1] = currentPrice;
    }
    
    console.log(`📊 Dados simulados gerados: ${prices.length} pontos para ${coinId}`);
    return { prices };
    
  } catch (error) {
    console.error(`❌ Erro geral ao buscar dados históricos para ${coinId}:`, error);
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

// Usar dados simulados realistas para dominância 
export const fetchMarketDominance = async (): Promise<DominanceData | null> => {
  try {
    console.log('Calculando dominância do mercado...');
    
    // Buscar dados do Bitcoin via CoinCap
    const btcResponse = await fetch('https://api.coincap.io/v2/assets/bitcoin');
    if (!btcResponse.ok) {
      throw new Error(`HTTP error! status: ${btcResponse.status}`);
    }
    
    const btcData = await btcResponse.json();
    const btcMarketCap = parseFloat(btcData.data.marketCapUsd);
    
    // Buscar dados gerais do mercado via CoinCap
    const assetsResponse = await fetch('https://api.coincap.io/v2/assets?limit=100');
    if (!assetsResponse.ok) {
      throw new Error(`HTTP error! status: ${assetsResponse.status}`);
    }
    
    const assetsData = await assetsResponse.json();
    const totalMarketCap = assetsData.data.reduce((total: number, asset: any) => {
      return total + parseFloat(asset.marketCapUsd || 0);
    }, 0);
    
    const btcDominance = (btcMarketCap / totalMarketCap) * 100;
    const altcoinMarketCap = totalMarketCap - btcMarketCap;
    
    console.log(`✅ Dominância calculada: BTC ${btcDominance.toFixed(2)}%`);
    
    return {
      btc_dominance: btcDominance,
      altcoins_cap: altcoinMarketCap,
      total_market_cap: totalMarketCap
    };
    
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