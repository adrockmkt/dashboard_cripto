import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from "recharts";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  AlertTriangle,
  Info,
  Zap,
  Activity
} from "lucide-react";

interface S2FData {
  date: Date;
  actualPrice: number;
  s2fPrice: number;
  stockToFlow: number;
  deviation: number;
  phase: 'undervalued' | 'fair' | 'overvalued';
}

interface HalvingEvent {
  date: Date;
  blockHeight: number;
  newReward: number;
  priceAtHalving: number;
  description: string;
}

interface S2FPrediction {
  date: Date;
  predictedPrice: number;
  confidence: number;
  scenario: 'conservative' | 'base' | 'optimistic';
}

export function StockToFlowModel() {
  const [s2fData, setS2fData] = useState<S2FData[]>([]);
  const [predictions, setPredictions] = useState<S2FPrediction[]>([]);
  const [halvingEvents, setHalvingEvents] = useState<HalvingEvent[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    currentS2F: 0,
    modelPrice: 0,
    actualPrice: 0,
    deviation: 0,
    nextHalving: null as Date | null,
    daysToHalving: 0
  });
  const [loading, setLoading] = useState(true);

  // Eventos de halving históricos e futuros
  const generateHalvingEvents = (): HalvingEvent[] => {
    return [
      {
        date: new Date('2012-11-28'),
        blockHeight: 210000,
        newReward: 25,
        priceAtHalving: 12.35,
        description: 'Primeiro Halving - Recompensa: 50 → 25 BTC'
      },
      {
        date: new Date('2016-07-09'),
        blockHeight: 420000,
        newReward: 12.5,
        priceAtHalving: 650,
        description: 'Segundo Halving - Recompensa: 25 → 12.5 BTC'
      },
      {
        date: new Date('2020-05-11'),
        blockHeight: 630000,
        newReward: 6.25,
        priceAtHalving: 8821,
        description: 'Terceiro Halving - Recompensa: 12.5 → 6.25 BTC'
      },
      {
        date: new Date('2024-04-20'),
        blockHeight: 840000,
        newReward: 3.125,
        priceAtHalving: 64000,
        description: 'Quarto Halving - Recompensa: 6.25 → 3.125 BTC'
      },
      {
        date: new Date('2028-05-15'),
        blockHeight: 1050000,
        newReward: 1.5625,
        priceAtHalving: 0, // Previsão
        description: 'Próximo Halving - Recompensa: 3.125 → 1.5625 BTC'
      }
    ];
  };

  // Calcular Stock-to-Flow
  const calculateStockToFlow = (date: Date): number => {
    const bitcoinLaunch = new Date('2009-01-03');
    const daysSinceLaunch = Math.floor((date.getTime() - bitcoinLaunch.getTime()) / (1000 * 60 * 60 * 24));
    
    // Aproximação do supply total baseado nos halvings
    let totalSupply = 0;
    let currentReward = 50;
    let blocksProcessed = 0;
    
    const halvingIntervals = [210000, 210000, 210000, 210000]; // Blocos entre halvings
    
    for (let i = 0; i < halvingIntervals.length && blocksProcessed < (daysSinceLaunch * 144); i++) {
      const blocksInThisPeriod = Math.min(halvingIntervals[i], (daysSinceLaunch * 144) - blocksProcessed);
      totalSupply += blocksInThisPeriod * currentReward;
      blocksProcessed += blocksInThisPeriod;
      currentReward /= 2;
    }
    
    // Fluxo anual (novos bitcoins por ano)
    const currentAnnualFlow = currentReward * 144 * 365; // blocos por dia * dias por ano
    
    // Stock-to-Flow = Stock / Flow
    return totalSupply / currentAnnualFlow;
  };

  // Calcular preço do modelo S2F
  const calculateS2FPrice = (stockToFlow: number): number => {
    // Fórmula do modelo S2F: ln(Price) = 3.3 * ln(S2F) - 14.6
    // Ou: Price = exp(3.3 * ln(S2F) - 14.6)
    return Math.exp(3.3 * Math.log(stockToFlow) - 14.6);
  };

  // Gerar dados históricos do S2F
  const generateS2FData = (): S2FData[] => {
    const data: S2FData[] = [];
    const startDate = new Date('2010-01-01');
    const endDate = new Date();
    
    let currentDate = new Date(startDate);
    let basePrice = 0.1;
    
    while (currentDate <= endDate) {
      const stockToFlow = calculateStockToFlow(currentDate);
      const s2fPrice = calculateS2FPrice(stockToFlow);
      
      // Simular preço real com volatilidade
      const timeProgress = (currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime());
      const trend = Math.pow(timeProgress, 2) * 60000; // Crescimento exponencial
      const volatility = (Math.random() - 0.5) * 0.3;
      const cyclical = Math.sin(timeProgress * Math.PI * 8) * 0.2; // Ciclos de 4 anos
      
      basePrice = Math.max(0.1, trend * (1 + volatility + cyclical));
      
      // Ajustar para eventos de halving
      const halvingEffect = halvingEvents.reduce((effect, halving) => {
        const daysSinceHalving = (currentDate.getTime() - halving.date.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceHalving > 0 && daysSinceHalving < 365) {
          return effect * (1 + (365 - daysSinceHalving) / 365 * 0.5); // Boost pós-halving
        }
        return effect;
      }, 1);
      
      const actualPrice = basePrice * halvingEffect;
      const deviation = ((actualPrice - s2fPrice) / s2fPrice) * 100;
      
      let phase: 'undervalued' | 'fair' | 'overvalued' = 'fair';
      if (deviation < -20) phase = 'undervalued';
      else if (deviation > 20) phase = 'overvalued';
      
      data.push({
        date: new Date(currentDate),
        actualPrice,
        s2fPrice,
        stockToFlow,
        deviation,
        phase
      });
      
      // Próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return data;
  };

  // Gerar previsões futuras
  const generatePredictions = (): S2FPrediction[] => {
    const predictions: S2FPrediction[] = [];
    const startDate = new Date();
    const endDate = new Date('2030-12-31');
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const stockToFlow = calculateStockToFlow(currentDate);
      const basePrice = calculateS2FPrice(stockToFlow);
      
      // Diferentes cenários
      const scenarios = [
        { name: 'conservative', multiplier: 0.7, confidence: 85 },
        { name: 'base', multiplier: 1.0, confidence: 70 },
        { name: 'optimistic', multiplier: 1.5, confidence: 55 }
      ];
      
      scenarios.forEach(scenario => {
        predictions.push({
          date: new Date(currentDate),
          predictedPrice: basePrice * scenario.multiplier,
          confidence: scenario.confidence,
          scenario: scenario.name as 'conservative' | 'base' | 'optimistic'
        });
      });
      
      // Próximos 3 meses
      currentDate.setMonth(currentDate.getMonth() + 3);
    }
    
    return predictions;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const halvings = generateHalvingEvents();
      const s2fHistorical = generateS2FData();
      const futurePredictions = generatePredictions();
      
      setHalvingEvents(halvings);
      setS2fData(s2fHistorical);
      setPredictions(futurePredictions);
      
      // Calcular métricas atuais
      const latestData = s2fHistorical[s2fHistorical.length - 1];
      const nextHalving = halvings.find(h => h.date > new Date());
      const daysToHalving = nextHalving 
        ? Math.floor((nextHalving.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      
      setCurrentMetrics({
        currentS2F: latestData.stockToFlow,
        modelPrice: latestData.s2fPrice,
        actualPrice: latestData.actualPrice,
        deviation: latestData.deviation,
        nextHalving: nextHalving?.date || null,
        daysToHalving
      });
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price.toFixed(2)}`;
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'undervalued': return 'text-green-500';
      case 'overvalued': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'undervalued': return 'Subvalorizado';
      case 'overvalued': return 'Sobrevalorizado';
      default: return 'Justo';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando modelo Stock-to-Flow...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Atuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">S2F Atual</p>
                <p className="text-2xl font-bold">{currentMetrics.currentS2F.toFixed(1)}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preço do Modelo</p>
                <p className="text-2xl font-bold">{formatPrice(currentMetrics.modelPrice)}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Desvio do Modelo</p>
                <p className={`text-2xl font-bold ${
                  currentMetrics.deviation > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {currentMetrics.deviation > 0 ? '+' : ''}{currentMetrics.deviation.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximo Halving</p>
                <p className="text-2xl font-bold">{currentMetrics.daysToHalving}</p>
                <p className="text-xs text-muted-foreground">dias</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Status Atual do Modelo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Badge className={getPhaseColor(s2fData[s2fData.length - 1]?.phase || 'fair')}>
                {getPhaseLabel(s2fData[s2fData.length - 1]?.phase || 'fair')}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Fase Atual do Mercado
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">
                {((currentMetrics.actualPrice / currentMetrics.modelPrice) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">
                do Preço do Modelo
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {currentMetrics.nextHalving ? 
                  currentMetrics.nextHalving.getFullYear() : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Ano do Próximo Halving
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <Tabs defaultValue="historical" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="historical">Histórico</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="halvings">Halvings</TabsTrigger>
        </TabsList>

        <TabsContent value="historical">
          <Card>
            <CardHeader>
              <CardTitle>Modelo Stock-to-Flow vs Preço Real</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={s2fData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).getFullYear().toString()}
                  />
                  <YAxis 
                    scale="log" 
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => formatPrice(value)}
                  />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                    formatter={(value: number, name: string) => [
                      formatPrice(value),
                      name === 'actualPrice' ? 'Preço Real' : 'Preço S2F'
                    ]}
                  />
                  <Legend />
                  
                  {/* Linhas de halving */}
                  {halvingEvents.filter(h => h.date <= new Date()).map((halving, index) => (
                    <ReferenceLine 
                      key={index}
                      x={halving.date.getTime()} 
                      stroke="#f59e0b" 
                      strokeDasharray="5 5"
                      label={`Halving ${index + 1}`}
                    />
                  ))}
                  
                  <Line 
                    type="monotone" 
                    dataKey="s2fPrice" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Modelo S2F"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actualPrice" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Preço Real"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Previsões do Modelo S2F</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).getFullYear().toString()}
                  />
                  <YAxis 
                    scale="log"
                    tickFormatter={(value) => formatPrice(value)}
                  />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                    formatter={(value: number) => [formatPrice(value), 'Previsão']}
                  />
                  <Legend />
                  
                  {/* Linhas de previsão por cenário */}
                  <Line 
                    data={predictions.filter(p => p.scenario === 'conservative')}
                    type="monotone" 
                    dataKey="predictedPrice" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Conservador"
                    strokeDasharray="5 5"
                  />
                  <Line 
                    data={predictions.filter(p => p.scenario === 'base')}
                    type="monotone" 
                    dataKey="predictedPrice" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Base"
                  />
                  <Line 
                    data={predictions.filter(p => p.scenario === 'optimistic')}
                    type="monotone" 
                    dataKey="predictedPrice" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Otimista"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['conservative', 'base', 'optimistic'].map(scenario => {
                  const scenarioData = predictions.filter(p => p.scenario === scenario);
                  const price2028 = scenarioData.find(p => p.date.getFullYear() === 2028)?.predictedPrice || 0;
                  
                  return (
                    <div key={scenario} className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold capitalize mb-2">{
                        scenario === 'conservative' ? 'Conservador' :
                        scenario === 'base' ? 'Base' : 'Otimista'
                      }</h4>
                      <p className="text-2xl font-bold">{formatPrice(price2028)}</p>
                      <p className="text-sm text-muted-foreground">Previsão 2028</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="halvings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Eventos de Halving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {halvingEvents.map((halving, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${
                        halving.date <= new Date() ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <h4 className="font-semibold">{halving.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {halving.date.toLocaleDateString('pt-BR')} • Bloco #{halving.blockHeight.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {halving.priceAtHalving > 0 ? formatPrice(halving.priceAtHalving) : 'TBD'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {halving.date <= new Date() ? 'Preço no halving' : 'Previsão'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Como funciona o Halving:</strong> A cada ~4 anos (210.000 blocos), 
                  a recompensa por bloco minerado é reduzida pela metade, diminuindo a oferta 
                  de novos bitcoins e historicamente levando a aumentos de preço.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alertas e Insights */}
      {currentMetrics.deviation < -30 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🟢 Oportunidade de Compra:</strong> O Bitcoin está {Math.abs(currentMetrics.deviation).toFixed(1)}% 
            abaixo do preço sugerido pelo modelo S2F. Historicamente, estes níveis representam boas oportunidades de acumulação.
          </AlertDescription>
        </Alert>
      )}
      
      {currentMetrics.deviation > 50 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🔴 Zona de Risco:</strong> O Bitcoin está {currentMetrics.deviation.toFixed(1)}% 
            acima do preço do modelo S2F. Considere estratégias de realização de lucros ou redução de exposição.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}