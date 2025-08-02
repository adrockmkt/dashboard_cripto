import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";

const fetchBitcoinPrices = async () => {
  try {
    // Usar CoinCap para dados históricos
    const response = await fetch("https://api.coincap.io/v2/assets/bitcoin/history?interval=d1");
    const data = await response.json();
    
    // Format data for the chart - take last 180 days
    return data.data.slice(-180).map((item: any) => ({
      date: new Date(item.time).toLocaleDateString('en-US', { month: 'short' }),
      price: Math.round(parseFloat(item.priceUsd))
    }));
  } catch (error) {
    console.error('Erro ao buscar preços do Bitcoin:', error);
    // Dados simulados como fallback
    const mockData = [];
    const now = new Date();
    for (let i = 179; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const basePrice = 45000;
      const variation = Math.sin(i / 10) * 5000 + Math.random() * 2000 - 1000;
      mockData.push({
        date: date.toLocaleDateString('en-US', { month: 'short' }),
        price: Math.round(basePrice + variation)
      });
    }
    return mockData;
  }
};

const PortfolioCard = () => {
  const { data: priceData, isLoading } = useQuery({
    queryKey: ['bitcoinPrices'],
    queryFn: fetchBitcoinPrices,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Bitcoin Performance</h2>
        <div className="w-full h-[200px] flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Bitcoin Performance</h2>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <XAxis 
              dataKey="date" 
              stroke="#E6E4DD"
              fontSize={12}
            />
            <YAxis 
              stroke="#E6E4DD"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#3A3935',
                border: '1px solid #605F5B',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#E6E4DD' }}
              itemStyle={{ color: '#8989DE' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8989DE" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioCard;