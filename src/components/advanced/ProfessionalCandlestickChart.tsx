import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, RefreshCw, Activity } from "lucide-react";

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

export function ProfessionalCandlestickChart() {
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
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  // Gerar dados de velas realistas
  const generateCandleData = (timeframe: string): CandlestickData[] => {
    const intervals = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '1h': 60,
      '4h': 240,
      '1d': 1440
    };

    const interval = intervals[timeframe as keyof typeof intervals] || 60;
    const points = 200;
    const data: CandlestickData[] = [];
    let basePrice = 48000;
    const now = Math.floor(Date.now() / 1000);

    for (let i = 0; i < points; i++) {
      const timestamp = (now - (points - i) * interval * 60) as Time;
      
      const volatility = 0.015;
      const trend = Math.sin(i / 25) * 0.002;
      const noise = (Math.random() - 0.5) * volatility;
      
      basePrice *= (1 + trend + noise);
      
      const open = basePrice;
      const close = open * (1 + (Math.random() - 0.5) * 0.012);
      const high = Math.max(open, close) * (1 + Math.random() * 0.008);
      const low = Math.min(open, close) * (1 - Math.random() * 0.008);

      data.push({
        time: timestamp,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });

      basePrice = close;
    }

    return data;
  };

  // Gerar dados de volume
  const generateVolumeData = (candleData: CandlestickData[]) => {
    return candleData.map(candle => ({
      time: candle.time,
      value: Math.random() * 1000000 + 500000,
      color: candle.close >= candle.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
    }));
  };

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

    const container = chartContainerRef.current;
    
    // Wait for container to have dimensions
    const initializeChart = () => {
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.warn("Container has no dimensions, waiting...");
        setTimeout(initializeChart, 100);
        return;
      }

      setLoading(true);

    // Criar gráfico
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#0F172A' },
        textColor: '#94A3B8',
      },
      grid: {
        vertLines: { color: '#1E293B' },
        horzLines: { color: '#1E293B' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#334155',
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#64748B',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#64748B',
          width: 1,
          style: 3,
        },
      },
    });

    chartRef.current = chart;

    // Adicionar série de candlestick
    const candlestickSeries = chart.addSeries({
      type: 'Candlestick',
      upColor: '#22C55E',
      downColor: '#EF4444',
      borderUpColor: '#22C55E',
      borderDownColor: '#EF4444',
      wickUpColor: '#22C55E',
      wickDownColor: '#EF4444',
    } as any);

    candlestickSeriesRef.current = candlestickSeries;

    // Adicionar série de volume
    const volumeSeries = chart.addSeries({
      type: 'Histogram',
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      priceScale: {
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      },
    } as any);

    volumeSeriesRef.current = volumeSeries;

    // Gerar e definir dados
    const candleData = generateCandleData(timeframe);
    const volumeData = generateVolumeData(candleData);
    
    candlestickSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    // Detectar padrões e suporte/resistência
    const detectedPatterns = detectPatterns(candleData);
    const srLevels = calculateSupportResistance(candleData);
    
    setPatterns(detectedPatterns);
    setSupportResistance(srLevels);

    // Adicionar linhas de suporte e resistência
    srLevels.forEach(sr => {
      const priceLine = candlestickSeries.createPriceLine({
        price: sr.level,
        color: sr.type === 'support' ? '#22C55E' : '#EF4444',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: sr.type === 'support' ? `Suporte ${sr.touches}x` : `Resistência ${sr.touches}x`,
      });
    });

    chart.timeScale().fitContent();

    // Responsividade
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

      window.addEventListener('resize', handleResize);
      setLoading(false);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    };

    initializeChart();
  }, [timeframe]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Gráfico de Velas - Análise Técnica Avançada
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
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
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Indicadores */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Indicadores</Label>
              <div className="space-y-2">
                {Object.entries(indicators).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setIndicators(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                    <Label className="text-xs capitalize">{key}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Alertas</Label>
              <div className="space-y-2">
                {Object.entries(alerts).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setAlerts(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                    <Label className="text-xs capitalize">{key}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Padrões Detectados */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Padrões Detectados</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {patterns.map((pattern, index) => (
                  <Badge
                    key={index}
                    variant={pattern.type === 'bullish' ? 'default' : 
                            pattern.type === 'bearish' ? 'destructive' : 'secondary'}
                    className="text-xs block w-full justify-start"
                  >
                    {pattern.name} ({(pattern.confidence * 100).toFixed(0)}%)
                  </Badge>
                ))}
              </div>
            </div>

            {/* S&R Níveis */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">S&R Níveis</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {supportResistance.map((sr, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className={sr.type === 'support' ? 'text-green-500' : 'text-red-500'}>
                      {sr.type === 'support' ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />} ${sr.level.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {sr.touches}x
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="relative border rounded-lg overflow-hidden bg-slate-900">
            <div ref={chartContainerRef} className="w-full h-[500px]" />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <RefreshCw className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
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
        </CardContent>
      </Card>
    </div>
  );
}
