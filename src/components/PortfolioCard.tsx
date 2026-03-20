import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchHistoricalData } from "@/services/cryptoApi";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const fetchBitcoinPrices = async () => {
  const historical = await fetchHistoricalData("bitcoin", 90);

  if (!historical?.prices?.length) {
    return [];
  }

  return historical.prices.map(([timestamp, price]: [number, number], index: number, array: [number, number][]) => ({
    timestamp,
    date: new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
    price: Number(price.toFixed(2)),
    baseline: Number((array[0]?.[1] || price).toFixed(2)),
    change: Number((((price - (array[0]?.[1] || price)) / (array[0]?.[1] || price || 1)) * 100).toFixed(2)),
    isLast: index === array.length - 1,
  }));
};

const PortfolioCard = () => {
  const { data: priceData = [], isLoading, isError } = useQuery({
    queryKey: ["bitcoinPrices", "90d"],
    queryFn: fetchBitcoinPrices,
    refetchInterval: 60000,
  });

  const summary = useMemo(() => {
    if (!priceData.length) {
      return null;
    }

    const first = priceData[0];
    const last = priceData[priceData.length - 1];
    const min = priceData.reduce((current, point) => (point.price < current.price ? point : current), priceData[0]);
    const max = priceData.reduce((current, point) => (point.price > current.price ? point : current), priceData[0]);

    return {
      first,
      last,
      min,
      max,
      totalChange: Number((((last.price - first.price) / first.price) * 100).toFixed(2)),
    };
  }, [priceData]);

  if (isLoading) {
    return (
      <Card className="glass-card mb-8 animate-fade-in">
        <CardHeader>
          <CardTitle>Bitcoin Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-[280px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !summary) {
    return (
      <Card className="glass-card mb-8 animate-fade-in">
        <CardHeader>
          <CardTitle>Bitcoin Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
            Não foi possível carregar o gráfico de performance do Bitcoin.
          </div>
        </CardContent>
      </Card>
    );
  }

  const positive = summary.totalChange >= 0;

  return (
    <Card className="glass-card mb-8 animate-fade-in overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Bitcoin Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Evolução do BTC nos últimos 90 dias com faixa de preço e variação acumulada.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={positive ? "default" : "destructive"} className="gap-1">
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? "+" : ""}
              {summary.totalChange.toFixed(2)}%
            </Badge>
            <Badge variant="outline">{formatCurrency(summary.last.price)}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6 pt-2">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Atual</div>
            <div className="mt-1 text-lg font-semibold">{formatCurrency(summary.last.price)}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Início</div>
            <div className="mt-1 text-lg font-semibold">{formatCurrency(summary.first.price)}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Máxima</div>
            <div className="mt-1 text-lg font-semibold">{formatCurrency(summary.max.price)}</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Mínima</div>
            <div className="mt-1 text-lg font-semibold">{formatCurrency(summary.min.price)}</div>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="btcPerformanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f7931a" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f7931a" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                minTickGap={28}
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                width={90}
                fontSize={12}
                tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "price" ? "Preço BTC" : name,
                ]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <ReferenceLine
                y={summary.first.price}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                opacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f7931a"
                strokeWidth={3}
                fill="url(#btcPerformanceFill)"
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
