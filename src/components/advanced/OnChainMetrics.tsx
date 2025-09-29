import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Activity, 
  Zap, 
  ArrowUpDown, 
  Users, 
  Wallet, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Database,
  Network
} from "lucide-react";

interface OnChainData {
  activeAddresses: number;
  hashrate: number;
  exchangeInflow: number;
  exchangeOutflow: number;
  mempoolSize: number;
  avgFee: number;
  whaleMovements: WhaleMovement[];
  networkHealth: NetworkHealth;
  institutionalFlow: InstitutionalFlow;
}

interface WhaleMovement {
  amount: number;
  type: 'inflow' | 'outflow';
  exchange: string;
  timestamp: Date;
  significance: 'low' | 'medium' | 'high';
}

interface NetworkHealth {
  score: number;
  factors: {
    decentralization: number;
    security: number;
    activity: number;
    adoption: number;
  };
}

interface InstitutionalFlow {
  weeklyFlow: number;
  monthlyFlow: number;
  trend: 'accumulating' | 'distributing' | 'neutral';
  confidence: number;
}

export function OnChainMetrics() {
  const [onChainData, setOnChainData] = useState<OnChainData | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('addresses');

  // Simular dados on-chain realistas
  const generateOnChainData = (): OnChainData => {
    const baseActiveAddresses = 800000;
    const baseHashrate = 450; // EH/s
    
    return {
      activeAddresses: baseActiveAddresses + Math.floor(Math.random() * 100000),
      hashrate: baseHashrate + (Math.random() - 0.5) * 50,
      exchangeInflow: Math.random() * 5000,
      exchangeOutflow: Math.random() * 8000,
      mempoolSize: Math.floor(Math.random() * 200000),
      avgFee: 15 + Math.random() * 30,
      whaleMovements: generateWhaleMovements(),
      networkHealth: {
        score: 85 + Math.random() * 10,
        factors: {
          decentralization: 88 + Math.random() * 8,
          security: 95 + Math.random() * 5,
          activity: 75 + Math.random() * 20,
          adoption: 80 + Math.random() * 15
        }
      },
      institutionalFlow: {
        weeklyFlow: (Math.random() - 0.5) * 10000,
        monthlyFlow: (Math.random() - 0.5) * 50000,
        trend: Math.random() > 0.6 ? 'accumulating' : Math.random() > 0.3 ? 'distributing' : 'neutral',
        confidence: 70 + Math.random() * 25
      }
    };
  };

  const generateWhaleMovements = (): WhaleMovement[] => {
    const movements: WhaleMovement[] = [];
    const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'OKX'];
    
    for (let i = 0; i < 10; i++) {
      const amount = 100 + Math.random() * 2000;
      movements.push({
        amount,
        type: Math.random() > 0.5 ? 'inflow' : 'outflow',
        exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        significance: amount > 1000 ? 'high' : amount > 500 ? 'medium' : 'low'
      });
    }
    
    return movements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const generateHistoricalData = () => {
    const data = [];
    const now = Date.now();
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const basePrice = 45000;
      const price = basePrice + (Math.random() - 0.5) * 10000;
      
      data.push({
        date: new Date(timestamp).toLocaleDateString('pt-BR'),
        timestamp,
        price,
        activeAddresses: 750000 + Math.random() * 150000,
        hashrate: 400 + Math.random() * 100,
        exchangeFlow: (Math.random() - 0.5) * 10000,
        mempoolSize: Math.random() * 300000,
        fees: 10 + Math.random() * 40,
        whaleActivity: Math.random() * 100
      });
    }
    
    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOnChainData(generateOnChainData());
      setHistoricalData(generateHistoricalData());
      setLoading(false);
    };

    loadData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, suffix: string = '') => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B${suffix}`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M${suffix}`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K${suffix}`;
    return `${num.toFixed(2)}${suffix}`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getFlowTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accumulating':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'distributing':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <ArrowUpDown className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading || !onChainData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="ml-2">Carregando métricas on-chain...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Endereços Ativos</p>
                <p className="text-2xl font-bold">{formatNumber(onChainData.activeAddresses)}</p>
                <p className="text-xs text-green-500">+2.3% (24h)</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hashrate</p>
                <p className="text-2xl font-bold">{onChainData.hashrate.toFixed(1)} EH/s</p>
                <p className="text-xs text-green-500">+1.8% (24h)</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mempool</p>
                <p className="text-2xl font-bold">{formatNumber(onChainData.mempoolSize)}</p>
                <p className="text-xs text-red-500">+15.2% (1h)</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
                <p className="text-2xl font-bold">${onChainData.avgFee.toFixed(2)}</p>
                <p className="text-xs text-yellow-500">-5.1% (24h)</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fluxo de Exchanges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Fluxo de Exchanges (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Entrada (Inflow)</span>
                </div>
                <span className="font-bold text-red-500">
                  {formatNumber(onChainData.exchangeInflow)} BTC
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Saída (Outflow)</span>
                </div>
                <span className="font-bold text-green-500">
                  {formatNumber(onChainData.exchangeOutflow)} BTC
                </span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fluxo Líquido:</span>
                  <span className={`font-bold ${
                    onChainData.exchangeOutflow > onChainData.exchangeInflow 
                      ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {onChainData.exchangeOutflow > onChainData.exchangeInflow ? '+' : '-'}
                    {formatNumber(Math.abs(onChainData.exchangeOutflow - onChainData.exchangeInflow))} BTC
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {onChainData.exchangeOutflow > onChainData.exchangeInflow 
                    ? '🟢 Sinal bullish - Retirada de exchanges' 
                    : '🔴 Sinal bearish - Acúmulo em exchanges'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saúde da Rede */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Saúde da Rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getHealthColor(onChainData.networkHealth.score)}`}>
                  {onChainData.networkHealth.score.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Score Geral</p>
              </div>

              <div className="space-y-3">
                {Object.entries(onChainData.networkHealth.factors).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key}</span>
                      <span>{value.toFixed(1)}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movimentações de Baleias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Movimentações de Baleias (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {onChainData.whaleMovements.map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    movement.type === 'inflow' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">
                      {formatNumber(movement.amount)} BTC
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {movement.exchange} • {movement.timestamp.toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    movement.type === 'inflow' ? 'destructive' : 'default'
                  }>
                    {movement.type === 'inflow' ? 'Entrada' : 'Saída'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {movement.significance === 'high' ? '🔥 Alto' : 
                     movement.significance === 'medium' ? '⚠️ Médio' : '📊 Baixo'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fluxo Institucional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Fluxo Institucional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fluxo Semanal</p>
              <p className={`text-2xl font-bold ${
                onChainData.institutionalFlow.weeklyFlow > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {onChainData.institutionalFlow.weeklyFlow > 0 ? '+' : ''}
                {formatNumber(onChainData.institutionalFlow.weeklyFlow)} BTC
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fluxo Mensal</p>
              <p className={`text-2xl font-bold ${
                onChainData.institutionalFlow.monthlyFlow > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {onChainData.institutionalFlow.monthlyFlow > 0 ? '+' : ''}
                {formatNumber(onChainData.institutionalFlow.monthlyFlow)} BTC
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tendência</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {getFlowTrendIcon(onChainData.institutionalFlow.trend)}
                <span className="font-bold capitalize">
                  {onChainData.institutionalFlow.trend === 'accumulating' ? 'Acumulando' :
                   onChainData.institutionalFlow.trend === 'distributing' ? 'Distribuindo' : 'Neutro'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Confiança: {onChainData.institutionalFlow.confidence.toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Históricas (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="addresses">Endereços</TabsTrigger>
              <TabsTrigger value="hashrate">Hashrate</TabsTrigger>
              <TabsTrigger value="flow">Fluxo</TabsTrigger>
              <TabsTrigger value="fees">Taxas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="addresses" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [formatNumber(value), 'Endereços Ativos']} />
                  <Line type="monotone" dataKey="activeAddresses" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="hashrate" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} EH/s`, 'Hashrate']} />
                  <Area type="monotone" dataKey="hashrate" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="flow" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [formatNumber(value), 'Fluxo de Exchange']} />
                  <Bar dataKey="exchangeFlow" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="fees" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Taxa Média']} />
                  <Line type="monotone" dataKey="fees" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Alertas Importantes */}
      {onChainData.exchangeOutflow > onChainData.exchangeInflow * 2 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🚨 Alerta de Fluxo:</strong> Saída massiva de BTC das exchanges detectada! 
            Fluxo líquido de +{formatNumber(onChainData.exchangeOutflow - onChainData.exchangeInflow)} BTC 
            pode indicar acúmulo institucional.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}