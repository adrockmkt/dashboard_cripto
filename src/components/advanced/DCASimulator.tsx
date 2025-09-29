import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  Share,
  Target,
  Percent,
  PiggyBank
} from "lucide-react";

interface DCAResult {
  totalInvested: number;
  totalBTC: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  averagePrice: number;
  purchases: DCAPurchase[];
}

interface DCAPurchase {
  date: Date;
  amount: number;
  btcPrice: number;
  btcBought: number;
  totalBTC: number;
  totalInvested: number;
  currentValue: number;
}

interface DCAScenario {
  name: string;
  weeklyAmount: number;
  startDate: Date;
  description: string;
}

export function DCASimulator() {
  const [weeklyAmount, setWeeklyAmount] = useState(100);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<DCAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('custom');

  // Cenários pré-definidos
  const scenarios: DCAScenario[] = [
    {
      name: 'Conservador',
      weeklyAmount: 50,
      startDate: new Date('2023-01-01'),
      description: 'R$ 50 por semana - Estratégia conservadora'
    },
    {
      name: 'Moderado',
      weeklyAmount: 100,
      startDate: new Date('2023-01-01'),
      description: 'R$ 100 por semana - Estratégia equilibrada'
    },
    {
      name: 'Agressivo',
      weeklyAmount: 250,
      startDate: new Date('2023-01-01'),
      description: 'R$ 250 por semana - Estratégia agressiva'
    },
    {
      name: 'Bear Market',
      weeklyAmount: 150,
      startDate: new Date('2022-01-01'),
      description: 'R$ 150/semana desde o bear market'
    }
  ];

  // Gerar dados históricos de preço do Bitcoin
  const generateHistoricalPrices = (startDate: Date, endDate: Date) => {
    const prices: { date: Date; price: number }[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let currentPrice = 16000; // Preço inicial aproximado
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Simular movimento de preço mais realista
      const dayOfYear = (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24);
      const yearProgress = dayOfYear / 365;
      
      // Tendência geral de alta com volatilidade
      const trend = Math.sin(yearProgress * Math.PI * 2) * 0.001 + 0.0005;
      const volatility = (Math.random() - 0.5) * 0.05;
      const weeklyPattern = Math.sin(i / 7 * Math.PI * 2) * 0.01;
      
      currentPrice *= (1 + trend + volatility + weeklyPattern);
      
      // Eventos específicos (halvings, crashes, etc.)
      if (date.getMonth() === 2 && date.getDate() === 15) { // Crash simulado em março
        currentPrice *= 0.85;
      }
      if (date.getMonth() === 10 && date.getDate() === 1) { // Rally simulado em novembro
        currentPrice *= 1.15;
      }
      
      prices.push({ date: new Date(date), price: Math.max(currentPrice, 15000) });
    }
    
    return prices;
  };

  // Calcular DCA
  const calculateDCA = (weeklyAmount: number, startDate: string, endDate: string): DCAResult => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const historicalPrices = generateHistoricalPrices(start, end);
    
    const purchases: DCAPurchase[] = [];
    let totalInvested = 0;
    let totalBTC = 0;
    
    // Compras semanais
    let currentDate = new Date(start);
    while (currentDate <= end) {
      // Encontrar preço mais próximo da data
      const closestPrice = historicalPrices.reduce((prev, curr) => {
        return Math.abs(curr.date.getTime() - currentDate.getTime()) < 
               Math.abs(prev.date.getTime() - currentDate.getTime()) ? curr : prev;
      });
      
      const btcBought = weeklyAmount / closestPrice.price;
      totalBTC += btcBought;
      totalInvested += weeklyAmount;
      
      const currentBTCPrice = historicalPrices[historicalPrices.length - 1].price;
      const currentValue = totalBTC * currentBTCPrice;
      
      purchases.push({
        date: new Date(currentDate),
        amount: weeklyAmount,
        btcPrice: closestPrice.price,
        btcBought,
        totalBTC,
        totalInvested,
        currentValue
      });
      
      // Próxima semana
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    const finalPrice = historicalPrices[historicalPrices.length - 1].price;
    const currentValue = totalBTC * finalPrice;
    const profit = currentValue - totalInvested;
    const profitPercentage = (profit / totalInvested) * 100;
    const averagePrice = totalInvested / totalBTC;
    
    return {
      totalInvested,
      totalBTC,
      currentValue,
      profit,
      profitPercentage,
      averagePrice,
      purchases
    };
  };

  // Executar simulação
  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      const dcaResult = calculateDCA(weeklyAmount, startDate, endDate);
      setResult(dcaResult);
      setLoading(false);
    }, 1000);
  };

  // Aplicar cenário pré-definido
  const applyScenario = (scenarioName: string) => {
    const scenario = scenarios.find(s => s.name === scenarioName);
    if (scenario) {
      setWeeklyAmount(scenario.weeklyAmount);
      setStartDate(scenario.startDate.toISOString().split('T')[0]);
      setSelectedScenario(scenarioName);
    } else {
      setSelectedScenario('custom');
    }
  };

  // Exportar dados
  const exportToCSV = () => {
    if (!result) return;
    
    const csvContent = [
      ['Data', 'Valor Investido', 'Preço BTC', 'BTC Comprado', 'BTC Total', 'Valor Atual'],
      ...result.purchases.map(p => [
        p.date.toLocaleDateString('pt-BR'),
        p.amount.toFixed(2),
        p.btcPrice.toFixed(2),
        p.btcBought.toFixed(8),
        p.totalBTC.toFixed(8),
        p.currentValue.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dca-simulation-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    if (weeklyAmount > 0 && startDate && endDate) {
      runSimulation();
    }
  }, [weeklyAmount, startDate, endDate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatBTC = (value: number) => {
    return `${value.toFixed(8)} BTC`;
  };

  return (
    <div className="space-y-6">
      {/* Configurações da Simulação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Simulador DCA (Dollar Cost Averaging)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cenários Pré-definidos */}
            <div className="space-y-2">
              <Label>Cenário</Label>
              <Select value={selectedScenario} onValueChange={applyScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cenário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Personalizado</SelectItem>
                  {scenarios.map(scenario => (
                    <SelectItem key={scenario.name} value={scenario.name}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Valor Semanal */}
            <div className="space-y-2">
              <Label>Valor Semanal (R$)</Label>
              <Input
                type="number"
                value={weeklyAmount}
                onChange={(e) => {
                  setWeeklyAmount(Number(e.target.value));
                  setSelectedScenario('custom');
                }}
                min="1"
                step="10"
              />
            </div>

            {/* Data Inicial */}
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSelectedScenario('custom');
                }}
              />
            </div>

            {/* Data Final */}
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Cenários Rápidos */}
          <div className="mt-4 flex flex-wrap gap-2">
            {scenarios.map(scenario => (
              <Button
                key={scenario.name}
                variant={selectedScenario === scenario.name ? "default" : "outline"}
                size="sm"
                onClick={() => applyScenario(scenario.name)}
              >
                {scenario.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Simulação */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Calculando simulação DCA...</span>
            </div>
          </CardContent>
        </Card>
      ) : result ? (
        <>
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investido</p>
                    <p className="text-2xl font-bold">{formatCurrency(result.totalInvested)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">BTC Acumulado</p>
                    <p className="text-2xl font-bold">{formatBTC(result.totalBTC)}</p>
                  </div>
                  <PiggyBank className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Atual</p>
                    <p className="text-2xl font-bold">{formatCurrency(result.currentValue)}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
                    <p className={`text-2xl font-bold ${result.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(result.profit)}
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${result.profit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Retorno %</p>
                    <p className={`text-2xl font-bold ${result.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {result.profitPercentage >= 0 ? '+' : ''}{result.profitPercentage.toFixed(2)}%
                    </p>
                  </div>
                  <Percent className={`w-8 h-8 ${result.profitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Preço Médio de Compra</p>
                  <p className="text-xl font-bold">{formatCurrency(result.averagePrice)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total de Compras</p>
                  <p className="text-xl font-bold">{result.purchases.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="text-xl font-bold">
                    {Math.floor(result.purchases.length / 4.33)} meses
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <Tabs defaultValue="evolution" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evolution">Evolução</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="comparison">Comparação</TabsTrigger>
            </TabsList>

            <TabsContent value="evolution">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Investimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={result.purchases}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                        formatter={(value: number, name: string) => [
                          name === 'totalInvested' ? formatCurrency(value) : formatCurrency(value),
                          name === 'totalInvested' ? 'Total Investido' : 'Valor Atual'
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalInvested" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Total Investido"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="currentValue" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        name="Valor Atual"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Compras</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={result.purchases.slice(-20)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                        formatter={(value: number) => [formatBTC(value), 'BTC Comprado']}
                      />
                      <Bar dataKey="btcBought" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <Card>
                <CardHeader>
                  <CardTitle>Comparação de Estratégias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-green-600">✅ DCA (Sua Estratégia)</h4>
                        <p className="text-2xl font-bold">{formatCurrency(result.currentValue)}</p>
                        <p className="text-sm text-muted-foreground">
                          Retorno: {result.profitPercentage.toFixed(2)}%
                        </p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-blue-600">📊 Compra Única (Lump Sum)</h4>
                        <p className="text-2xl font-bold">
                          {formatCurrency(result.totalInvested * (67000 / result.averagePrice))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Se tivesse comprado tudo no início
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">📈 Vantagens do DCA:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Reduz o risco de timing do mercado</li>
                        <li>• Suaviza a volatilidade através da média de preços</li>
                        <li>• Disciplina de investimento regular</li>
                        <li>• Menor stress emocional</li>
                        <li>• Acessível para qualquer orçamento</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ações */}
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}