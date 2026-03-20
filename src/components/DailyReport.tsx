import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Clock, RefreshCw, TrendingDown, TrendingUp, Waves } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketInsights } from "@/components/MarketInsights";
import { calculateTechnicalIndicators, fetchHistoricalData } from "@/services/cryptoApi";
import { fetchReportSnapshot, type ReportSnapshot } from "@/services/insightsService";
import type { DataSource, TechnicalIndicators } from "@/services/types";

const DailyReport = () => {
  const [snapshot, setSnapshot] = useState<ReportSnapshot | null>(null);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [source, setSource] = useState<DataSource>("fallback");
  const [error, setError] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia!";
    if (hour < 18) return "Boa tarde!";
    return "Boa noite!";
  };

  const getFearGreedColor = (value: string) => {
    const numValue = Number(value);
    if (numValue >= 75) return "bg-red-500";
    if (numValue >= 55) return "bg-orange-500";
    if (numValue >= 45) return "bg-yellow-500 text-slate-900";
    if (numValue >= 25) return "bg-blue-500";
    return "bg-green-500";
  };

  const sourceLabel = useMemo(() => {
    switch (source) {
      case "real":
        return "Fonte real";
      case "simulated":
        return "Simulado";
      default:
        return "Fallback";
    }
  }, [source]);

  const analysisAlerts = useMemo(() => {
    if (!technicalIndicators) return [];

    const alerts = [];

    if (technicalIndicators.rsi > 70) {
      alerts.push({
        type: "warning",
        message: "RSI acima de 70: o BTC entrou em faixa de sobrecompra e pede mais disciplina na tomada de risco.",
        icon: AlertTriangle,
      });
    } else if (technicalIndicators.rsi < 30) {
      alerts.push({
        type: "success",
        message: "RSI abaixo de 30: o BTC entrou em faixa de sobrevenda e merece monitoramento para reação técnica.",
        icon: TrendingUp,
      });
    }

    if (technicalIndicators.momentum > 5) {
      alerts.push({
        type: "success",
        message: "Momentum positivo: a força recente de preço ainda favorece continuidade no curto prazo.",
        icon: TrendingUp,
      });
    } else if (technicalIndicators.momentum < -5) {
      alerts.push({
        type: "warning",
        message: "Momentum negativo: o mercado entrou em uma fase mais suscetível a pullbacks e stops curtos.",
        icon: TrendingDown,
      });
    }

    return alerts;
  }, [technicalIndicators]);

  const loadData = async () => {
    setLoading(true);

    const [reportResult, historical] = await Promise.all([
      fetchReportSnapshot(),
      fetchHistoricalData("bitcoin", 200),
    ]);

    setSnapshot(reportResult.data);
    setSource(reportResult.source);
    setError(reportResult.error || null);

    if (historical?.prices?.length) {
      const prices = historical.prices.map((item: [number, number]) => item[1]);
      setTechnicalIndicators(calculateTechnicalIndicators(prices));
    } else {
      setTechnicalIndicators(null);
    }

    setLastUpdate(new Date().toLocaleString("pt-BR"));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            <span className="ml-2">Carregando relatório diário...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!snapshot) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Não foi possível montar o relatório diário agora.</p>
          {error ? <p className="mt-2 text-xs text-muted-foreground">Detalhe: {error}</p> : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Clock className="h-6 w-6" />
                {getGreeting()}
              </CardTitle>
              <p className="text-muted-foreground">Relatório diário consolidado com viés, comparativos e leitura tática do mercado cripto.</p>
              <p className="text-sm text-muted-foreground">Última atualização: {lastUpdate}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={source === "real" ? "default" : "secondary"}>{sourceLabel}</Badge>
              <Button onClick={loadData} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Dominância do Bitcoin</h3>
            <p className="text-2xl font-bold">{snapshot.dominance?.btc_dominance?.toFixed(2) || "N/A"}%</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Cap. Altcoins</h3>
            <p className="text-2xl font-bold">
              {snapshot.dominance?.altcoins_cap ? `$${(snapshot.dominance.altcoins_cap / 1e9).toFixed(2)}B` : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Fear & Greed</h3>
            <div className="flex items-center gap-2">
              <Badge className={getFearGreedColor(snapshot.fearGreed?.value || "50")}>{snapshot.fearGreed?.value || "N/A"}</Badge>
              <span className="text-sm">({snapshot.fearGreed?.value_classification || "N/A"})</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Viés Atual</h3>
            <p className="text-2xl font-bold uppercase">{snapshot.recommendation.bias}</p>
            <p className="text-sm text-muted-foreground">Convicção {snapshot.recommendation.confidence}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
            <div className="mb-2 font-semibold text-green-500">Pontos Positivos</div>
            <div className="space-y-2 text-sm">
              {snapshot.positives.length > 0 ? (
                snapshot.positives.map((item) => <p key={item}>{item}</p>)
              ) : (
                <p>O mercado não mostrou gatilhos positivos dominantes neste ciclo de atualização.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="mb-2 font-semibold text-yellow-500">Pontos de Atenção</div>
            <div className="space-y-2 text-sm">
              {snapshot.cautions.length > 0 ? (
                snapshot.cautions.map((item) => <p key={item}>{item}</p>)
              ) : (
                <p>Não houve um gatilho de risco dominante, mas vale manter gestão de posição e stops disciplinados.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
            <div className="mb-2 font-semibold text-blue-500">Leitura Consolidada</div>
            <p className="text-sm">{snapshot.recommendation.summary}</p>
            <div className="mt-4 rounded-lg bg-background/60 p-3">
              <div className="mb-1 flex items-center gap-2 font-medium">
                <Waves className="h-4 w-4" />
                Camada social validada
              </div>
              <p className="text-sm text-muted-foreground">{snapshot.editorialPulse.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {snapshot.editorialPulse.headlineCount} manchetes analisadas • {snapshot.editorialPulse.source === "real" ? "proxy editorial real" : "fallback editorial"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {technicalIndicators ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Indicadores Técnicos do BTC</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">RSI (14)</p>
              <p className="text-lg font-semibold">{technicalIndicators.rsi.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Momentum</p>
              <p className="text-lg font-semibold">{technicalIndicators.momentum.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MFI</p>
              <p className="text-lg font-semibold">{technicalIndicators.mfi.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SMA 50</p>
              <p className="text-lg font-semibold">${technicalIndicators.sma50.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SMA 200</p>
              <p className="text-lg font-semibold">${technicalIndicators.sma200.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bandas de Bollinger</p>
              <p className="text-sm">
                Superior: ${technicalIndicators.bollingerUpper.toFixed(0)}
                <br />
                Inferior: ${technicalIndicators.bollingerLower.toFixed(0)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {analysisAlerts.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Alertas Analíticos</h3>
          {analysisAlerts.map((alert) => (
            <Alert
              key={alert.message}
              className={alert.type === "warning" ? "border-l-4 border-orange-500" : "border-l-4 border-green-500"}
            >
              <alert.icon className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      ) : null}

      <MarketInsights fearGreed={snapshot.fearGreed} dominance={snapshot.dominance} />
    </div>
  );
};

export default DailyReport;
