import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  fetchCryptoData, 
  fetchFearGreedIndex, 
  fetchHistoricalData,
  calculateTechnicalIndicators,
  type DominanceData 
} from "@/services/cryptoApi";

const AdvancedCharts = () => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [fearGreedHistory, setFearGreedHistory] = useState<any[]>([]);
  const [technicalData, setTechnicalData] = useState<any[]>([]);
  const [dominanceData, setDominanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        // Dados para gráfico de pizza - Dominância BTC
        const cryptos = await fetchCryptoData();
        const btc = cryptos.find(crypto => crypto.symbol === 'btc');
        const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0);
        const btcDominance = btc ? (btc.market_cap / totalMarketCap) * 100 : 0;
        
        setDominanceData([
          { name: 'Bitcoin', value: btcDominance, color: '#f7931a' },
          { name: 'Altcoins', value: 100 - btcDominance, color: '#4f46e5' }
        ]);

        // Dados históricos do Bitcoin para indicadores técnicos
        const btcHistorical = await fetchHistoricalData('bitcoin', 30);
        if (btcHistorical?.prices) {
          const prices = btcHistorical.prices.map((item: [number, number]) => item[1]);
          const indicators = calculateTechnicalIndicators(prices);
          
          const chartData = btcHistorical.prices.slice(-20).map((item: [number, number], index: number) => ({
            date: new Date(item[0]).toLocaleDateString('pt-BR'),
            price: item[1],
            sma50: indicators.sma50,
            sma200: indicators.sma200,
            rsi: indicators.rsi,
            bollingerUpper: indicators.bollingerUpper,
            bollingerLower: indicators.bollingerLower,
            volume: Math.random() * 1000000000, // Simplificado
          }));
          
          setTechnicalData(chartData);
        }

        // Dados para Fear & Greed simulados (API não fornece histórico gratuito)
        const fearGreed = await fetchFearGreedIndex();
        const mockFearGreedHistory = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          value: Math.floor(Math.random() * 100),
          classification: Math.random() > 0.5 ? 'Fear' : 'Greed'
        }));
        setFearGreedHistory(mockFearGreedHistory);

        // Top 5 altcoins para gráfico de barras
        const top5Altcoins = cryptos.slice(1, 6).map(crypto => ({
          name: crypto.name,
          marketCap: crypto.market_cap / 1e9, // Em bilhões
          symbol: crypto.symbol.toUpperCase()
        }));
        setCryptoData(top5Altcoins);

      } catch (error) {
        console.error('Erro ao carregar dados dos gráficos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dominance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dominance">Dominância</TabsTrigger>
          <TabsTrigger value="altcoins">Altcoins</TabsTrigger>
          <TabsTrigger value="feargreed">Fear & Greed</TabsTrigger>
          <TabsTrigger value="technical">Técnicos</TabsTrigger>
        </TabsList>

        <TabsContent value="dominance">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>🔸 Dominância do Bitcoin</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={dominanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dominanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Dominância']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="altcoins">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>📊 Capitalização das Top 5 Altcoins</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cryptoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symbol" />
                  <YAxis label={{ value: 'Bilhões USD', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}B`, 'Market Cap']} />
                  <Bar dataKey="marketCap" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                    {cryptoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 50%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feargreed">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>📈 Índice Fear & Greed (30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={fearGreedHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                  {/* Linhas de referência */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 75} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    strokeWidth={1}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => 25} 
                    stroke="#22c55e" 
                    strokeDasharray="5 5" 
                    strokeWidth={1}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RSI Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>📊 RSI (Relative Strength Index)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={technicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey={() => 70} stroke="#ef4444" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey={() => 30} stroke="#22c55e" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bollinger Bands */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>📈 Bandas de Bollinger</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={technicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                    <Area 
                      type="monotone" 
                      dataKey="bollingerUpper" 
                      stackId="1"
                      stroke="#94a3b8" 
                      fill="#94a3b8" 
                      fillOpacity={0.2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bollingerLower" 
                      stackId="1"
                      stroke="#94a3b8" 
                      fill="#ffffff" 
                      fillOpacity={0.8}
                    />
                    <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Médias Móveis */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>📊 Médias Móveis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={technicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                    <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} name="Preço" />
                    <Line type="monotone" dataKey="sma50" stroke="#3b82f6" strokeWidth={2} name="SMA 50" />
                    <Line type="monotone" dataKey="sma200" stroke="#ef4444" strokeWidth={2} name="SMA 200" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volume */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>📊 Volume de Negociação</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={technicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${(value / 1e9).toFixed(2)}B`, 'Volume']} />
                    <Bar dataKey="volume" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCharts;