
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw, Heart } from "lucide-react";
import { fetchCryptoData, type CryptoData } from "@/services/cryptoApi";
import { useFavorites } from "@/hooks/useFavorites";

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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Top Cryptocurrencies
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptoList.slice(0, 10).map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute -top-1 -right-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 ${
                        isFavorite(crypto.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                      onClick={() => handleFavoriteToggle(crypto)}
                    >
                      <Heart className={`w-3 h-3 ${isFavorite(crypto.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{crypto.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {crypto.symbol.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rank #{crypto.market_cap_rank}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-lg">
                  {formatPrice(crypto.current_price)}
                </div>
                <div className="flex items-center space-x-1">
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoList;
