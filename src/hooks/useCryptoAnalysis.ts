import { useState, useEffect, useCallback } from 'react';
import { 
  fetchCryptoData, 
  fetchFearGreedIndex, 
  fetchMarketDominance, 
  fetchHistoricalData,
  calculateTechnicalIndicators,
  type CryptoData,
  type FearGreedData,
  type DominanceData,
  type TechnicalIndicators 
} from '@/services/cryptoApi';

export interface CryptoAnalysisData {
  cryptoList: CryptoData[];
  fearGreed: FearGreedData | null;
  dominance: DominanceData | null;
  technicalIndicators: TechnicalIndicators | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const useCryptoAnalysis = (autoRefresh: boolean = true) => {
  const [data, setData] = useState<CryptoAnalysisData>({
    cryptoList: [],
    fearGreed: null,
    dominance: null,
    technicalIndicators: null,
    isLoading: true,
    error: null,
    lastUpdate: null
  });

  const loadData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Buscar dados em paralelo para melhor performance
      const [cryptoList, fearGreed, dominance, btcHistorical] = await Promise.allSettled([
        fetchCryptoData(),
        fetchFearGreedIndex(),
        fetchMarketDominance(),
        fetchHistoricalData('bitcoin', 200)
      ]);

      let technicalIndicators: TechnicalIndicators | null = null;
      
      // Processar dados históricos do Bitcoin para indicadores técnicos
      if (btcHistorical.status === 'fulfilled' && btcHistorical.value?.prices) {
        const prices = btcHistorical.value.prices.map((item: [number, number]) => item[1]);
        technicalIndicators = calculateTechnicalIndicators(prices);
      }

      setData({
        cryptoList: cryptoList.status === 'fulfilled' ? cryptoList.value : [],
        fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
        dominance: dominance.status === 'fulfilled' ? dominance.value : null,
        technicalIndicators,
        isLoading: false,
        error: null,
        lastUpdate: new Date()
      });

    } catch (error) {
      console.error('Erro ao carregar dados de análise:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh a cada 5 minutos se habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    ...data,
    refreshData
  };
};

// Hook específico para alertas em tempo real
export const useCryptoAlerts = (technicalIndicators: TechnicalIndicators | null) => {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'warning' | 'success' | 'info';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    if (!technicalIndicators) return;

    const newAlerts = [];
    const now = new Date();

    // Alert RSI
    if (technicalIndicators.rsi > 70) {
      newAlerts.push({
        id: `rsi-overbought-${now.getTime()}`,
        type: 'warning' as const,
        message: `RSI em ${technicalIndicators.rsi.toFixed(2)} - Bitcoin pode estar sobrecomprado`,
        timestamp: now
      });
    } else if (technicalIndicators.rsi < 30) {
      newAlerts.push({
        id: `rsi-oversold-${now.getTime()}`,
        type: 'success' as const,
        message: `RSI em ${technicalIndicators.rsi.toFixed(2)} - Bitcoin pode estar sobrevendido (oportunidade)`,
        timestamp: now
      });
    }

    // Alert Momentum
    if (Math.abs(technicalIndicators.momentum) > 10) {
      newAlerts.push({
        id: `momentum-strong-${now.getTime()}`,
        type: 'info' as const,
        message: `Momentum forte de ${technicalIndicators.momentum.toFixed(2)}% - Tendência ${technicalIndicators.momentum > 0 ? 'alta' : 'baixa'} consolidada`,
        timestamp: now
      });
    }

    // Alert Médias Móveis - Golden Cross ou Death Cross
    if (technicalIndicators.sma50 > technicalIndicators.sma200 * 1.02) {
      newAlerts.push({
        id: `golden-cross-${now.getTime()}`,
        type: 'success' as const,
        message: 'Golden Cross detectado - SMA 50 cruzou acima da SMA 200',
        timestamp: now
      });
    } else if (technicalIndicators.sma50 < technicalIndicators.sma200 * 0.98) {
      newAlerts.push({
        id: `death-cross-${now.getTime()}`,
        type: 'warning' as const,
        message: 'Death Cross detectado - SMA 50 cruzou abaixo da SMA 200',
        timestamp: now
      });
    }

    setAlerts(prev => [...prev.slice(-5), ...newAlerts].slice(-10)); // Manter últimos 10 alertas

  }, [technicalIndicators]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return {
    alerts,
    clearAlerts,
    removeAlert
  };
};