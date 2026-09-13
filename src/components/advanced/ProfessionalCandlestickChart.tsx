import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, Time, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, RefreshCw, Activity } from "lucide-react";
import { fetchOHLCVData } from "@/services/chartService";
import { trackEvent } from "@/lib/analytics";
import { TradingControlsSheet } from "@/components/dashboard/TradingControlsSheet";
import type { DataSource } from "@/services/types";

interface TechnicalPattern {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
}

interface SupportResistance {
  level: number;
  type: 'support' | 'resistance';
  strength: number;
  touches: number;
}

interface ProfessionalCandlestickChartProps {
  symbol?: string;
}

export function ProfessionalCandlestickChart({ symbol = "BTC" }: ProfessionalCandlestickChartProps) {
  const [timeframe, setTimeframe] = useState('1h');
  const [patterns, setPatterns] = useState<TechnicalPattern[]>([]);
  const [supportResistance, setSupportResistance] = useState<SupportResistance[]>([]);
  const [indicators, setIndicators] = useState({
    rsi: true,
    macd: true,
    bollinger: true,
    fibonacci: false,
    volume: true
  });
  const [alerts, setAlerts] = useState({
    sound: true,
    visual: true,
    patterns: true,
    breakouts: true
  });
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<DataSource>("fallback");
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  // Detectar padrões técnicos
  const detectPatterns = (data: CandlestickData[]): TechnicalPattern[] => {
    const patterns: TechnicalPattern[] = [];
    
    for (let i = 10; i < data.length - 1; i += 15) {
      const current = data[i];
      const prev = data[i - 1];
      
      const bodySize = Math.abs(current.close - current.open);
      const candleRange = current.high - current.low;
      
      // Doji
      if (bodySize / candleRange < 0.1) {
        patterns.push({
          name: 'Doji',
          type: 'neutral',
          confidence: 0.7,
          description: 'Indecisão do mercado'
        });
      }
      
      // Martelo
      const lowerShadow = Math.min(current.open, current.close) - current.low;
      const upperShadow = current.high - Math.max(current.open, current.close);
      if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.5) {
        patterns.push({
          name: 'Martelo',
          type: 'bullish',
          confidence: 0.8,
          description: 'Reversão bullish'
        });
      }
      
      // Engolfo Bullish
      if (prev.close < prev.open && current.close > current.open &&
          current.close > prev.open && current.open < prev.close) {
        patterns.push({
          name: 'Engolfo Bullish',
          type: 'bullish',
          confidence: 0.85,
          description: 'Forte reversão para alta'
        });
      }

      // Triângulo Ascendente
      if (i > 20 && i % 30 === 0) {
        const recentData = data.slice(i - 20, i);
        const highs = recentData.map(d => d.high);
        const lows = recentData.map(d => d.low);
        
        const highsFlat = highs.every(h => Math.abs(h - highs[0]) / highs[0] < 0.02);
        const lowsRising = lows[lows.length - 1] > lows[0] * 1.01;
        
        if (highsFlat && lowsRising) {
          patterns.push({
            name: 'Triângulo Ascendente',
            type: 'bullish',
            confidence: 0.75,
            description: 'Continuação bullish'
          });
        }
      }
    }

    return patterns.slice(0, 8);
  };

  // Calcular suporte e resistência
  const calculateSupportResistance = (data: CandlestickData[]): SupportResistance[] => {
    const levels: SupportResistance[] = [];
    const priceFrequency: { [key: number]: number } = {};
    
    data.forEach(candle => {
      const roundedHigh = Math.round(candle.high / 100) * 100;
      const roundedLow = Math.round(candle.low / 100) * 100;
      
      priceFrequency[roundedHigh] = (priceFrequency[roundedHigh] || 0) + 1;
      priceFrequency[roundedLow] = (priceFrequency[roundedLow] || 0) + 1;
    });

    Object.entries(priceFrequency).forEach(([price, frequency]) => {
      if (frequency >= 4) {
        const priceLevel = parseFloat(price);
        const currentPrice = data[data.length - 1].close;
        
        levels.push({
          level: priceLevel,
          type: priceLevel > currentPrice ? 'resistance' : 'support',
          strength: Math.min(frequency / 12, 1),
          touches: frequency
        });
      }
    });

    return levels.sort((a, b) => b.strength - a.strength).slice(0, 5);
  };

  // Inicializar gráfico
  useEffect(() => {
    if (!chartContainerRef.current) return;

    setLoading(true);
    let isDisposed = false;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    // Criar gráfico
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#101114' },
        textColor: '#d9d5ce',
      },
      grid: {
        vertLines: { color: '#28231f' },
        horzLines: { color: '#28231f' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#3b322b',
      },
      rightPriceScale: {
        borderColor: '#3b322b',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#8b8177',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#8b8177',
          width: 1,
          style: 3,
        },
      },
    });

    chartRef.current = chart;

    // Adicionar série de candlestick
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22C55E',
      downColor: '#EF4444',
      borderUpColor: '#22C55E',
      borderDownColor: '#EF4444',
      wickUpColor: '#22C55E',
      wickDownColor: '#EF4444',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Adicionar série de volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#f97316',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    // Apply scale margins to volume series
    chart.priceScale('').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeriesRef.current = volumeSeries;

    window.addEventListener('resize', handleResize);

    const loadCandles = async () => {
      const result = await fetchOHLCVData(symbol, timeframe as any, 200);
      if (isDisposed) return;

      setSource(result.source);
      setError(result.error || null);

      const candleData: CandlestickData[] = (result.data || []).map((item) => ({
        time: item.time as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      const sortedData = candleData.sort((a, b) => (a.time as number) - (b.time as number));
      const uniqueData = sortedData.filter((item, index, array) => {
        if (index === 0) return true;
        return item.time !== array[index - 1].time;
      });

      const volumeData = (result.data || []).map((candle) => ({
        time: candle.time as Time,
        value: candle.volume,
        color: candle.close >= candle.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
      }));

      candlestickSeries.setData(uniqueData);
      volumeSeries.setData(volumeData);

      const detectedPatterns = detectPatterns(uniqueData);
      const srLevels = calculateSupportResistance(uniqueData);

      setPatterns(detectedPatterns);
      setSupportResistance(srLevels);

      srLevels.forEach(sr => {
        candlestickSeries.createPriceLine({
          price: sr.level,
          color: sr.type === 'support' ? '#22C55E' : '#EF4444',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: sr.type === 'support' ? `Suporte ${sr.touches}x` : `Resistência ${sr.touches}x`,
        });
      });

      chart.timeScale().fitContent();
      setLoading(false);
    };

    loadCandles();

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeframe, refreshKey, symbol]);

  const getSourceLabel = () => {
    switch (source) {
      case "real":
        return "Fonte real";
      case "simulated":
        return "Simulado";
      default:
        return "Fallback";
    }
  };

  const renderControls = () => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Indicadores</Label>
        <div className="space-y-2">
          {Object.entries(indicators).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={(checked) => setIndicators((current) => ({ ...current, [key]: checked }))} />
              <Label className="text-xs capitalize">{key}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Alertas</Label>
        <div className="space-y-2">
          {Object.entries(alerts).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch checked={value} onCheckedChange={(checked) => setAlerts((current) => ({ ...current, [key]: checked }))} />
              <Label className="text-xs capitalize">{key}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Padrões detectados</Label>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {patterns.map((pattern, index) => (
            <Badge key={`${pattern.name}-${index}`} variant={pattern.type === "bullish" ? "default" : pattern.type === "bearish" ? "destructive" : "secondary"} className="block w-full justify-start text-xs">
              {pattern.name} ({(pattern.confidence * 100).toFixed(0)}%)
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Suportes e resistências</Label>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {supportResistance.map((sr, index) => (
            <div key={`${sr.level}-${index}`} className="flex items-center justify-between text-xs">
              <span className={sr.type === "support" ? "text-success" : "text-danger"}>
                {sr.type === "support" ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />} ${sr.level.toLocaleString()}
              </span>
              <Badge variant="outline" className="text-xs">{sr.touches}x</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="adrock-panel overflow-hidden">
        <CardHeader className="border-b border-border/80 bg-background/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Trading Pro</p>
                <CardTitle className="mt-1 text-xl">{symbol} / BRL</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Gráfico de velas e análise técnica</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-border bg-background/60 text-muted-foreground">
                {getSourceLabel()}
              </Badge>
              <Select value={timeframe} onValueChange={(value) => {
                setTimeframe(value);
                trackEvent("chart_timeframe_change", { timeframe: value });
              }}>
                <SelectTrigger className="w-24 border-border bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1m</SelectItem>
                  <SelectItem value="5m">5m</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="4h">4h</SelectItem>
                  <SelectItem value="1d">1d</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setRefreshKey((prev) => prev + 1)} aria-label="Atualizar gráfico" title="Atualizar gráfico">
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div data-testid="trading-chart" className="relative overflow-hidden rounded-xl border border-border bg-background">
            <div ref={chartContainerRef} className="w-full h-[500px]" />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/85">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" aria-label="Carregando gráfico" />
              </div>
            )}
          </div>

          <div className="mt-4">
            <TradingControlsSheet>{renderControls()}</TradingControlsSheet>
            <div className="mt-4 hidden lg:block">{renderControls()}</div>
          </div>

          {/* Alertas */}
          {patterns.length > 0 && alerts.visual && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Padrões Detectados:</strong> {patterns.length} padrão(ões) identificado(s) no gráfico atual.
                {patterns.filter(p => p.confidence > 0.8).length > 0 && (
                  <span className="text-green-600 font-semibold ml-1">
                    ({patterns.filter(p => p.confidence > 0.8).length} com alta confiança)
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                A API principal de candles falhou e o gráfico usou um caminho alternativo. Detalhe: {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
