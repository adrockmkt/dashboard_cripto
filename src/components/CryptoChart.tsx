import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchHistoricalData } from '@/services/cryptoApi';

const CryptoChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        console.log('🚀 Carregando dados do gráfico Bitcoin...');
        const data = await fetchHistoricalData('bitcoin', 30);
        console.log('📊 Dados recebidos:', data);
        
        if (data?.prices) {
          const formattedData = data.prices.map((item: [number, number]) => ({
            date: new Date(item[0]).toLocaleDateString(),
            price: item[1]
          }));
          console.log('✅ Dados formatados para o gráfico:', formattedData.length, 'pontos');
          setChartData(formattedData);
        } else {
          console.error('❌ Dados inválidos recebidos:', data);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados do gráfico:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Bitcoin Price Chart (30 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
              />
              <YAxis 
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Preço BTC']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#f7931a" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, stroke: '#f7931a', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Dados não disponíveis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoChart;