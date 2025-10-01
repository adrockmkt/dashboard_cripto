import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type CryptoData as APICryptoData } from '@/services/cryptoApi';

interface VirtualizedCryptoTableProps {
  data: APICryptoData[];
  favorites: string[];
  onToggleFavorite: (crypto: APICryptoData) => void;
}

export const VirtualizedCryptoTable = ({ 
  data, 
  favorites, 
  onToggleFavorite 
}: VirtualizedCryptoTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  };

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-lg border"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const crypto = data[virtualRow.index];
          const isFavorite = favorites.includes(crypto.id);
          const isPositive = crypto.price_change_percentage_24h >= 0;

          return (
            <div
              key={crypto.id}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(crypto)}
                  className="shrink-0"
                  aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    )}
                  />
                </Button>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{crypto.name}</p>
                    <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-mono font-semibold">{formatPrice(crypto.current_price)}</p>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>

                <div className="hidden md:block text-right shrink-0 w-24">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="font-semibold">{formatNumber(crypto.market_cap)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
