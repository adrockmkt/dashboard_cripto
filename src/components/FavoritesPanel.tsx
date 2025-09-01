
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, TrendingUp, TrendingDown, Star, RefreshCw } from "lucide-react"
import { useFavorites } from "@/hooks/useFavorites"

export function FavoritesPanel() {
  const { favorites, isLoading, removeFromFavorites, refreshFavorites } = useFavorites()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Carregando favoritos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Favoritos
            {favorites.length > 0 && (
              <Badge variant="secondary">{favorites.length}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshFavorites}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-6">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">Nenhum favorito ainda</p>
            <p className="text-sm text-muted-foreground">
              Adicione suas criptomoedas favoritas clicando no ❤️ na lista de moedas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{crypto.symbol}</span>
                      <span className="text-sm text-muted-foreground">{crypto.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-sm">{formatPrice(crypto.price)}</span>
                      <div className="flex items-center gap-1">
                        {crypto.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(crypto.change24h)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromFavorites(crypto.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
