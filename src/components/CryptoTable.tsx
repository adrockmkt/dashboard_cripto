import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  fetchCryptoData, 
  fetchHistoricalData,
  calculateTechnicalIndicators,
  type CryptoData,
  type TechnicalIndicators 
} from "@/services/cryptoApi";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

interface CryptoWithIndicators extends CryptoData {
  indicators?: TechnicalIndicators;
  isLoading?: boolean;
}

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState<CryptoWithIndicators[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return "destructive";
    if (rsi <= 30) return "secondary";
    return "outline";
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum > 5) return "secondary";
    if (momentum < -5) return "destructive";
    return "outline";
  };

  const loadCryptoData = async () => {
    setLoading(true);
    try {
      console.log('Carregando dados das top 20 cryptos...');
      
      // Buscar top 20 cryptos
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
      );
      const cryptoData: CryptoData[] = await response.json();
      
      // Inicializar com dados básicos
      setCryptos(cryptoData.map(crypto => ({ ...crypto, isLoading: true })));
      
      // Carregar indicadores técnicos para cada crypto em paralelo (limitado a 5 por vez para evitar rate limit)
      const chunks = [];
      for (let i = 0; i < cryptoData.length; i += 5) {
        chunks.push(cryptoData.slice(i, i + 5));
      }
      
      for (const chunk of chunks) {
        const indicatorsPromises = chunk.map(async (crypto) => {
          try {
            const historicalData = await fetchHistoricalData(crypto.id, 100);
            if (historicalData?.prices) {
              const prices = historicalData.prices.map((item: [number, number]) => item[1]);
              return {
                ...crypto,
                indicators: calculateTechnicalIndicators(prices),
                isLoading: false
              };
            }
            return { ...crypto, isLoading: false };
          } catch (error) {
            console.error(`Erro ao carregar indicadores para ${crypto.name}:`, error);
            return { ...crypto, isLoading: false };
          }
        });
        
        const results = await Promise.all(indicatorsPromises);
        
        setCryptos(prev => 
          prev.map(crypto => {
            const updated = results.find(r => r.id === crypto.id);
            return updated || crypto;
          })
        );
        
        // Pequeno delay entre chunks para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch (error) {
      console.error('Erro ao carregar dados das cryptos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
    // Atualizar a cada 10 minutos
    const interval = setInterval(loadCryptoData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && cryptos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando dados das cryptos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>🏆 Top 20 Criptomoedas - Análise Técnica</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {lastUpdate && `Última atualização: ${lastUpdate}`}
            </p>
          </div>
          <Button 
            onClick={loadCryptoData} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Crypto</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">24h %</TableHead>
                <TableHead className="text-center">RSI</TableHead>
                <TableHead className="text-center">Momentum</TableHead>
                <TableHead className="text-right">SMA 50</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptos.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell className="font-medium">
                    {crypto.market_cap_rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://assets.coingecko.com/coins/images/${crypto.id.replace(/-/g, '')}/small/1.png`}
                        alt={crypto.name}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/24/3B82F6/FFFFFF?text=${crypto.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${crypto.current_price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      crypto.price_change_percentage_24h >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {crypto.isLoading ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                    ) : crypto.indicators ? (
                      <Badge variant={getRSIColor(crypto.indicators.rsi)}>
                        {crypto.indicators.rsi.toFixed(0)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {crypto.isLoading ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                    ) : crypto.indicators ? (
                      <Badge variant={getMomentumColor(crypto.indicators.momentum)}>
                        {crypto.indicators.momentum.toFixed(1)}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {crypto.indicators && crypto.indicators.sma50 > 0 ? (
                      `$${crypto.indicators.sma50.toLocaleString()}`
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    ${(crypto.market_cap / 1e9).toFixed(2)}B
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoTable;