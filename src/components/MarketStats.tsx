import { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, SmilePlus, TrendingUpIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchCryptoData, fetchFearGreedIndex, fetchMarketDominance } from "@/services/cryptoApi";

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

const MarketStats = memo(() => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["marketStatsOverview"],
    queryFn: async () => {
      const [cryptoList, fearGreed, dominance] = await Promise.all([
        fetchCryptoData(),
        fetchFearGreedIndex(),
        fetchMarketDominance(),
      ]);

      return { cryptoList, fearGreed, dominance };
    },
    refetchInterval: 60000,
  });

  const stats = useMemo(() => {
    const dominance = data?.dominance;
    const fearGreed = data?.fearGreed;
    const cryptoList = data?.cryptoList || [];

    const trackedMarketCap = cryptoList.reduce((sum, item) => sum + item.market_cap, 0);
    const trackedVolume = cryptoList.reduce((sum, item) => sum + (item.total_volume || 0), 0);
    const average24h =
      cryptoList.length > 0
        ? cryptoList.reduce((sum, item) => sum + item.price_change_percentage_24h, 0) / cryptoList.length
        : 0;

    return {
      marketCap: dominance?.total_market_cap || trackedMarketCap,
      volume24h: trackedVolume,
      btcDominance: dominance?.btc_dominance || 0,
      altcoinsCap: dominance?.altcoins_cap || 0,
      average24h,
      fearGreedValue: Number(fearGreed?.value || 50),
      fearGreedLabel: fearGreed?.value_classification || t("cards.neutral"),
    };
  }, [data, t]);

  const items = [
    {
      title: t("cards.marketCapTotal"),
      value: formatCompactCurrency(stats.marketCap || 0),
      change: `${stats.average24h >= 0 ? "+" : ""}${stats.average24h.toFixed(2)}%`,
      positive: stats.average24h >= 0,
      icon: TrendingUpIcon,
      caption: t("cards.marketOverview"),
    },
    {
      title: t("cards.volume24h"),
      value: formatCompactCurrency(stats.volume24h || 0),
      change: formatCompactCurrency(stats.altcoinsCap || 0),
      positive: true,
      icon: ArrowUpIcon,
      caption: `${t("cards.altcoinsCap")}: ${formatCompactCurrency(stats.altcoinsCap || 0)}`,
    },
    {
      title: t("cards.btcDominance"),
      value: `${stats.btcDominance.toFixed(2)}%`,
      change: stats.btcDominance >= 50 ? t("cards.strong") : t("cards.weak"),
      positive: stats.btcDominance >= 50,
      icon: stats.btcDominance >= 50 ? ArrowUpIcon : ArrowDownIcon,
      caption: `${t("cards.marketMood")}: ${stats.fearGreedLabel} (${stats.fearGreedValue})`,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 animate-fade-in">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="glass-card rounded-lg p-6 transition-all hover-lift">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
              <div className={`rounded-full p-2 ${item.positive ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 space-y-2">
                <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <span className={`mt-1 flex items-center gap-1 text-sm ${item.positive ? "text-green-500" : "text-orange-500"}`}>
                  {item.positive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                  {item.change}
                </span>
                <p className="mt-3 text-xs text-muted-foreground">{item.caption}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

MarketStats.displayName = "MarketStats";

export default MarketStats;
