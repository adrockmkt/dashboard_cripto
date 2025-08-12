import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchCryptoData = async () => {
  console.log("Buscando dados da CoinCap...");
  try {
    // Usar CoinCap API primeiro
    const response = await fetch('https://api.coincap.io/v2/assets?limit=5');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Mapa local para principais moedas
    const iconMap: Record<string, string> = {
      bitcoin: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      ethereum: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      binancecoin: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
      bnb: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
      solana: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      cardano: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
    };

    return await Promise.all(data.data.map(async (crypto: any) => {
      let imageUrl = "";
      // try {
      //   const coingeckoResp = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto.id}`);
      //   if (coingeckoResp.ok) {
      //     const coingeckoData = await coingeckoResp.json();
      //     imageUrl = coingeckoData.image?.large || coingeckoData.image?.thumb || "";
      //   }
      // } catch (e) {
      //   // ignora erro
      // }
      imageUrl = iconMap[crypto.id] || iconMap[crypto.symbol.toLowerCase()] || "/placeholder.png";
      return {
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        current_price: parseFloat(crypto.priceUsd),
        price_change_percentage_24h: parseFloat(crypto.changePercent24Hr),
        total_volume: parseFloat(crypto.volumeUsd24Hr) || 0,
        image: imageUrl,
      };
    }));
  } catch (error) {
    console.warn("API falhou. Retornando dados mock.");
    // Dados mock como fallback
    return [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 45000, price_change_percentage_24h: 2.5, total_volume: 1000000000, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3000, price_change_percentage_24h: -1.2, total_volume: 500000000, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
      { id: 'binancecoin', symbol: 'BNB', name: 'BNB', current_price: 300, price_change_percentage_24h: 0.8, total_volume: 200000000, image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
      { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 100, price_change_percentage_24h: 3.2, total_volume: 150000000, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', current_price: 0.5, price_change_percentage_24h: -0.5, total_volume: 80000000, image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" }
    ];
  }
};

const CryptoList = () => {
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return <div className="glass-card rounded-lg p-6 animate-pulse">Loading...</div>;
  }

  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <p className="text-xs text-muted-foreground mb-2">{cryptos[0]?.current_price === 45000 ? "Mock ativo" : "Dados da API CoinCap"}</p>
      <h2 className="text-xl font-semibold mb-6">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Name</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">24h Change</th>
              <th className="pb-4">Volume</th>
            </tr>
          </thead>
          <tbody>
            {cryptos?.map((crypto) => (
              <tr key={crypto.symbol} className="border-t border-secondary">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">${crypto.current_price.toLocaleString()}</td>
                <td className="py-4">
                  <span
                    className={`flex items-center gap-1 ${
                      crypto.price_change_percentage_24h >= 0 ? "text-success" : "text-warning"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="py-4">${(crypto.total_volume / 1e9).toFixed(1)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;