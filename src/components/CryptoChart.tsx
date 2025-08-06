import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { fetchHistoricalData } from '@/services/cryptoApi';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

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
        <div className="h-[400px] w-full">
          <AdvancedRealTimeChart symbol="BINANCE:BTCUSDT" theme="dark" autosize />
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;