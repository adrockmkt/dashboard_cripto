import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { fetchCryptoData, type CryptoData } from "@/services/cryptoApi";
import { useFavorites } from "@/hooks/useFavorites";
import { VirtualizedCryptoTable } from "@/components/VirtualizedCryptoTable";
import { ExportMenu } from "@/components/ExportMenu";

const CryptoList = () => {
  const { data: cryptoList, isLoading, refetch } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 60000,
  });

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteToggle = (crypto: CryptoData) => {
    if (isFavorite(crypto.id)) {
      removeFromFavorites(crypto.id);
    } else {
      addToFavorites({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        price: crypto.current_price,
        change24h: crypto.price_change_percentage_24h
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Top Cryptocurrencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cryptoList || cryptoList.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Top Cryptocurrencies
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Não foi possível carregar os dados das criptomoedas. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Top Cryptocurrencies</CardTitle>
        <div className="flex items-center gap-2">
          <ExportMenu 
            data={{
              title: 'Top Criptomoedas',
              filename: `top-cryptos-${new Date().toISOString().split('T')[0]}`,
              headers: ['Rank', 'Nome', 'Símbolo', 'Preço', 'Mudança 24h', 'Market Cap'],
              rows: cryptoList.slice(0, 20).map(crypto => [
                crypto.market_cap_rank.toString(),
                crypto.name,
                crypto.symbol.toUpperCase(),
                formatPrice(crypto.current_price),
                formatPercentage(crypto.price_change_percentage_24h),
                formatPrice(crypto.market_cap)
              ])
            }}
          />
          <Button variant="outline" size="sm" onClick={() => refetch()} aria-label="Atualizar dados">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <VirtualizedCryptoTable 
          data={cryptoList.slice(0, 50)} 
          favorites={cryptoList.filter(c => isFavorite(c.id)).map(c => c.id)}
          onToggleFavorite={handleFavoriteToggle}
        />
      </CardContent>
    </Card>
  );
};

export default CryptoList;
