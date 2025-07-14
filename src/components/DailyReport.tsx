import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  fetchCryptoData, 
  fetchFearGreedIndex, 
  fetchMarketDominance, 
  fetchHistoricalData,
  calculateTechnicalIndicators,
  type TechnicalIndicators,
  type FearGreedData,
  type DominanceData 
} from "@/services/cryptoApi";
import { AlertTriangle, TrendingUp, TrendingDown, Clock } from "lucide-react";

const DailyReport = () => {
  const [dominanceData, setDominanceData] = useState<DominanceData | null>(null);
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia!";
    if (hour < 18) return "Boa tarde!";
    return "Boa noite!";
  };

  const getFearGreedColor = (value: string) => {
    const numValue = parseInt(value);
    if (numValue >= 75) return "bg-red-500";
    if (numValue >= 55) return "bg-orange-500";
    if (numValue >= 45) return "bg-yellow-500";
    if (numValue >= 25) return "bg-blue-500";
    return "bg-green-500";
  };

  const generateAlerts = (indicators: TechnicalIndicators) => {
    const alerts = [];
    
    if (indicators.rsi > 70) {
      alerts.push({
        type: "warning",
        message: "RSI indica sobrecompra - possível correção em vista",
        icon: AlertTriangle
      });
    } else if (indicators.rsi < 30) {
      alerts.push({
        type: "success", 
        message: "RSI indica sobrevenda - possível recuperação",
        icon: TrendingUp
      });
    }

    if (indicators.momentum > 5) {
      alerts.push({
        type: "success",
        message: "Momentum positivo - tendência de alta",
        icon: TrendingUp
      });
    } else if (indicators.momentum < -5) {
      alerts.push({
        type: "warning",
        message: "Momentum negativo - tendência de baixa", 
        icon: TrendingDown
      });
    }

    return alerts;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Buscar dados em paralelo
        const [dominance, fearGreed, btcHistorical] = await Promise.all([
          fetchMarketDominance(),
          fetchFearGreedIndex(),
          fetchHistoricalData('bitcoin', 200)
        ]);

        setDominanceData(dominance);
        setFearGreedData(fearGreed);

        if (btcHistorical?.prices) {
          const prices = btcHistorical.prices.map((item: [number, number]) => item[1]);
          const indicators = calculateTechnicalIndicators(prices);
          setTechnicalIndicators(indicators);
        }

        setLastUpdate(new Date().toLocaleString('pt-BR'));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando relatório diário...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Relatório */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6" />
            {getGreeting()}
          </CardTitle>
          <p className="text-muted-foreground">
            Aqui está o relatório diário do mercado cripto:
          </p>
          <p className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate}
          </p>
        </CardHeader>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              🔹 Dominância do Bitcoin
            </h3>
            <p className="text-2xl font-bold">
              {dominanceData?.btc_dominance?.toFixed(2) || "N/A"}%
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              🔹 Cap. Altcoins (Total)
            </h3>
            <p className="text-2xl font-bold">
              ${dominanceData?.altcoins_cap ? 
                (dominanceData.altcoins_cap / 1e9).toFixed(2) + "B" : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              🔹 Fear & Greed Index
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={getFearGreedColor(fearGreedData?.value || "50")}>
                {fearGreedData?.value || "N/A"}
              </Badge>
              <span className="text-sm">
                ({fearGreedData?.value_classification || "N/A"})
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              🔹 Market Cap Total
            </h3>
            <p className="text-2xl font-bold">
              ${dominanceData?.total_market_cap ? 
                (dominanceData.total_market_cap / 1e12).toFixed(2) + "T" : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores Técnicos */}
      {technicalIndicators && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>📊 Indicadores Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">✅ RSI (14):</p>
                <p className="text-lg font-semibold">
                  {technicalIndicators.rsi.toFixed(2)}
                  {technicalIndicators.rsi > 70 && <span className="text-red-500 ml-2">⚠️</span>}
                  {technicalIndicators.rsi < 30 && <span className="text-green-500 ml-2">✅</span>}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">✅ Momentum:</p>
                <p className="text-lg font-semibold">
                  {technicalIndicators.momentum.toFixed(2)}%
                  {technicalIndicators.momentum > 0 ? 
                    <TrendingUp className="inline w-4 h-4 ml-2 text-green-500" /> :
                    <TrendingDown className="inline w-4 h-4 ml-2 text-red-500" />
                  }
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">✅ MFI:</p>
                <p className="text-lg font-semibold">{technicalIndicators.mfi.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">✅ SMA 50:</p>
                <p className="text-lg font-semibold">${technicalIndicators.sma50.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">✅ SMA 200:</p>
                <p className="text-lg font-semibold">${technicalIndicators.sma200.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">✅ Bollinger:</p>
                <p className="text-sm">
                  Superior: ${technicalIndicators.bollingerUpper.toFixed(0)}<br/>
                  Inferior: ${technicalIndicators.bollingerLower.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas Dinâmicos */}
      {technicalIndicators && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">🚨 Alertas Dinâmicos</h3>
          {generateAlerts(technicalIndicators).map((alert, index) => (
            <Alert key={index} className={`border-l-4 ${
              alert.type === 'warning' ? 'border-orange-500' : 'border-green-500'
            }`}>
              <alert.icon className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyReport;