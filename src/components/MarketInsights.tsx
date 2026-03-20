import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, CandlestickChart, RefreshCw, Trophy } from "lucide-react";
import { fetchCryptoData } from "@/services/cryptoApi";
import {
  fetchAssetComparison,
  fetchMarketRankings,
  type AssetComparisonSnapshot,
  type ComparisonMetric,
  type RankingBucket,
} from "@/services/insightsService";
import type { CryptoData, DataSource, DominanceData, FearGreedData } from "@/services/types";

interface MarketInsightsProps {
  fearGreed: FearGreedData | null;
  dominance: DominanceData | null;
}

const colorPalette = ["#3b82f6", "#22c55e", "#f59e0b"];

export const MarketInsights = ({ fearGreed, dominance }: MarketInsightsProps) => {
  const [availableAssets, setAvailableAssets] = useState<CryptoData[]>([]);
  const [selectedAssets, setSelectedAssets] = useState(["bitcoin", "ethereum", "solana"]);
  const [comparison, setComparison] = useState<AssetComparisonSnapshot | null>(null);
  const [rankings, setRankings] = useState<RankingBucket[]>([]);
  const [comparisonSource, setComparisonSource] = useState<DataSource>("fallback");
  const [rankingsSource, setRankingsSource] = useState<DataSource>("fallback");
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [rankingsError, setRankingsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInsights = async (identifiers: string[]) => {
    setLoading(true);

    const [assets, comparisonResult, rankingsResult] = await Promise.all([
      fetchCryptoData(),
      fetchAssetComparison(identifiers),
      fetchMarketRankings(),
    ]);

    setAvailableAssets(assets);
    setComparison(comparisonResult.data);
    setComparisonSource(comparisonResult.source);
    setComparisonError(comparisonResult.error || null);
    setRankings(rankingsResult.data || []);
    setRankingsSource(rankingsResult.source);
    setRankingsError(rankingsResult.error || null);
    setLoading(false);
  };

  useEffect(() => {
    loadInsights(selectedAssets);
  }, [selectedAssets.join("|")]);

  const learningCards = useMemo(() => {
    const fearValue = Number(fearGreed?.value || 50);
    const dominanceValue = dominance?.btc_dominance || 0;

    return [
      {
        title: "Dominância BTC",
        description: "Mostra quanto do valor total do mercado está concentrado no Bitcoin.",
        insight:
          dominanceValue >= 50
            ? `Hoje o BTC concentra ${dominanceValue.toFixed(2)}% do mercado, o que ajuda a manter direção macro mais estável.`
            : "Com dominância abaixo de 50%, a leitura de altcoins tende a ficar mais dispersa e seletiva.",
      },
      {
        title: "Fear & Greed",
        description: "Ajuda a identificar euforia ou medo excessivo no curto prazo.",
        insight:
          fearValue >= 65
            ? `O índice está em ${fearValue}, sugerindo apetite a risco elevado e chance maior de volatilidade por excesso de confiança.`
            : fearValue <= 35
              ? `O índice está em ${fearValue}, indicando mercado mais defensivo e possível estresse de curto prazo.`
              : `O índice está em ${fearValue}, sinalizando equilíbrio relativo entre otimismo e cautela.`,
      },
      {
        title: "Volume / Market Cap",
        description: "Relação útil para encontrar ativos que estão movimentando capital de forma mais intensa.",
        insight:
          "Quanto maior essa razão, maior tende a ser a atividade recente em relação ao tamanho do ativo. Isso ajuda a filtrar onde o mercado está realmente girando.",
      },
    ];
  }, [dominance, fearGreed]);

  const getAssetLabel = (asset: ComparisonMetric) => `${asset.name} (${asset.symbol.toUpperCase()})`;

  const updateSelectedAsset = (index: number, value: string) => {
    setSelectedAssets((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const sourceLabel = (source: DataSource) => {
    switch (source) {
      case "real":
        return "Fonte real";
      case "simulated":
        return "Simulado";
      default:
        return "Fallback";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CandlestickChart className="h-5 w-5" />
              Inteligência de Mercado
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparativo entre ativos, rankings acionáveis e leitura educacional do contexto atual.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadInsights(selectedAssets)} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={comparisonSource === "real" ? "default" : "secondary"}>{sourceLabel(comparisonSource)}</Badge>
          <Badge variant={rankingsSource === "real" ? "default" : "secondary"}>{sourceLabel(rankingsSource)}</Badge>
          {comparison?.assets?.length ? <Badge variant="outline">{comparison.assets.length} ativos comparados</Badge> : null}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="comparison" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="learn">Aprender</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {selectedAssets.map((asset, index) => (
                <Select key={`${asset}-${index}`} value={asset} onValueChange={(value) => updateSelectedAsset(index, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Ativo ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssets.slice(0, 15).map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} ({option.symbol.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>

            {comparisonError ? (
              <Alert>
                <AlertDescription>{comparisonError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparison?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Performance 7d"]} />
                  <Legend />
                  {(comparison?.assets || []).map((asset, index) => (
                    <Line
                      key={asset.id}
                      type="monotone"
                      dataKey={asset.symbol.toUpperCase()}
                      name={asset.symbol.toUpperCase()}
                      stroke={colorPalette[index % colorPalette.length]}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {(comparison?.assets || []).map((asset) => (
                <Card key={asset.id} className="border-border/60">
                  <CardContent className="space-y-3 p-4">
                    <div>
                      <div className="font-semibold">{getAssetLabel(asset)}</div>
                      <div className="text-sm text-muted-foreground">Rank #{asset.market_cap_rank}</div>
                    </div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: asset.current_price < 1 ? 4 : 2,
                        maximumFractionDigits: asset.current_price < 1 ? 6 : 2,
                      }).format(asset.current_price)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">24h</div>
                        <div className={asset.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
                          {asset.price_change_percentage_24h >= 0 ? "+" : ""}
                          {asset.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">7 dias</div>
                        <div className={asset.performance7d >= 0 ? "text-green-500" : "text-red-500"}>
                          {asset.performance7d >= 0 ? "+" : ""}
                          {asset.performance7d.toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Vol/Cap</div>
                        <div>{(asset.volumeToMarketCap * 100).toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Força Relativa</div>
                        <div>{asset.relativeStrength >= 0 ? "+" : ""}{asset.relativeStrength.toFixed(2)} pts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rankings" className="space-y-4">
            {rankingsError ? (
              <Alert>
                <AlertDescription>{rankingsError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {rankings.map((bucket) => (
                <Card key={bucket.title} className="border-border/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-4 w-4" />
                      {bucket.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{bucket.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bucket.items.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                        <div>
                          <div className="font-medium">
                            #{index + 1} {item.symbol.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{item.price_change_percentage_24h >= 0 ? "+" : ""}{item.price_change_percentage_24h.toFixed(2)}%</div>
                          <div className="text-muted-foreground">
                            {(item.volumeToMarketCap * 100).toFixed(2)}% vol/cap
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {learningCards.map((card) => (
                <Card key={card.title} className="border-border/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-4 w-4" />
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground">{card.description}</p>
                    <div className="rounded-lg bg-muted/40 p-3">
                      <div className="font-medium">Leitura de hoje</div>
                      <p className="mt-1 text-muted-foreground">{card.insight}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
