import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Settings,
  Target,
  Activity
} from "lucide-react";

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalPattern {
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  description: string;
  position: { x: number; y: number };
}

interface SupportResistance {
  level: number;
  type: 'support' | 'resistance';
  strength: number;
  touches: number;
}

export function CandlestickChart() {
  const [timeframe, setTimeframe] = useState('1h');
  const [candleData, setCandleData] = useState<CandleData[]>([]);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gerar dados de velas simulados
  const generateCandleData = (timeframe: string) => {
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
    const data: CandleData[] = [];
    let basePrice = 45000;
    const now = Date.now();

    for (let i = 0; i < points; i++) {
      const timestamp = now - (points - i) * interval * 60 * 1000;
      
      // Simular movimento de preço mais realista
      const volatility = 0.02;
      const trend = Math.sin(i / 20) * 0.001;
      const noise = (Math.random() - 0.5) * volatility;
      
      basePrice *= (1 + trend + noise);
      
      const open = basePrice;
      const close = open * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      const volume = Math.random() * 1000000;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume
      });

      basePrice = close;
    }

    return data;
  };

  // Detectar padrões de candlestick
  const detectCandlestickPatterns = (data: CandleData[]): TechnicalPattern[] => {
    const patterns: TechnicalPattern[] = [];
    
    for (let i = 2; i < data.length - 1; i++) {
      const prev2 = data[i - 2];
      const prev = data[i - 1];
      const current = data[i];
      const next = data[i + 1];

      // Doji
      const bodySize = Math.abs(current.close - current.open);
      const candleRange = current.high - current.low;
      if (bodySize / candleRange < 0.1) {
        patterns.push({
          name: 'Doji',
          type: 'neutral',
          confidence: 0.7,
          description: 'Indecisão do mercado - possível reversão',
          position: { x: i, y: current.close }
        });
      }

      // Martelo (Hammer)
      const lowerShadow = Math.min(current.open, current.close) - current.low;
      const upperShadow = current.high - Math.max(current.open, current.close);
      if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.5) {
        patterns.push({
          name: 'Martelo',
          type: 'bullish',
          confidence: 0.8,
          description: 'Padrão de reversão bullish',
          position: { x: i, y: current.low }
        });
      }

      // Engolfo Bullish
      if (prev.close < prev.open && current.close > current.open &&
          current.close > prev.open && current.open < prev.close) {
        patterns.push({
          name: 'Engolfo Bullish',
          type: 'bullish',
          confidence: 0.85,
          description: 'Forte sinal de reversão para alta',
          position: { x: i, y: current.close }
        });
      }

      // Triângulo Ascendente (simplificado)
      if (i > 10) {
        const recentData = data.slice(i - 10, i);
        const highs = recentData.map(d => d.high);
        const lows = recentData.map(d => d.low);
        
        const highsFlat = highs.every(h => Math.abs(h - highs[0]) / highs[0] < 0.02);
        const lowsRising = lows[lows.length - 1] > lows[0];
        
        if (highsFlat && lowsRising) {
          patterns.push({
            name: 'Triângulo Ascendente',
            type: 'bullish',
            confidence: 0.75,
            description: 'Padrão de continuação bullish',
            position: { x: i, y: current.high }
          });
        }
      }
    }

    return patterns;
  };

  // Calcular suporte e resistência
  const calculateSupportResistance = (data: CandleData[]): SupportResistance[] => {
    const levels: SupportResistance[] = [];
    const priceRanges = data.map(d => ({ high: d.high, low: d.low }));
    
    // Encontrar níveis de preço frequentes
    const priceFrequency: { [key: number]: number } = {};
    
    priceRanges.forEach(range => {
      const roundedHigh = Math.round(range.high / 100) * 100;
      const roundedLow = Math.round(range.low / 100) * 100;
      
      priceFrequency[roundedHigh] = (priceFrequency[roundedHigh] || 0) + 1;
      priceFrequency[roundedLow] = (priceFrequency[roundedLow] || 0) + 1;
    });

    // Identificar níveis significativos
    Object.entries(priceFrequency).forEach(([price, frequency]) => {
      if (frequency >= 3) {
        const priceLevel = parseFloat(price);
        const currentPrice = data[data.length - 1].close;
        
        levels.push({
          level: priceLevel,
          type: priceLevel > currentPrice ? 'resistance' : 'support',
          strength: Math.min(frequency / 10, 1),
          touches: frequency
        });
      }
    });

    return levels.sort((a, b) => b.strength - a.strength).slice(0, 6);
  };

  // Desenhar gráfico de velas no canvas
  const drawCandlestickChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || candleData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Configurações do gráfico
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const prices = candleData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Função para converter preço em coordenada Y
    const priceToY = (price: number) => {
      return padding + (maxPrice - price) / priceRange * chartHeight;
    };

    // Função para converter índice em coordenada X
    const indexToX = (index: number) => {
      return padding + (index / (candleData.length - 1)) * chartWidth;
    };

    // Desenhar grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Desenhar suporte e resistência
    supportResistance.forEach(sr => {
      const y = priceToY(sr.level);
      ctx.strokeStyle = sr.type === 'support' ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Desenhar velas
    candleData.forEach((candle, index) => {
      const x = indexToX(index);
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);

      const isBullish = candle.close > candle.open;
      const candleWidth = Math.max(2, chartWidth / candleData.length * 0.8);

      // Desenhar sombras
      ctx.strokeStyle = isBullish ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Desenhar corpo da vela
      ctx.fillStyle = isBullish ? '#22c55e' : '#ef4444';
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      if (bodyHeight < 1) {
        // Doji - linha horizontal
        ctx.fillRect(x - candleWidth / 2, bodyY - 0.5, candleWidth, 1);
      } else {
        ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
      }
    });

    // Desenhar padrões detectados
    patterns.forEach(pattern => {
      const x = indexToX(pattern.position.x);
      const y = priceToY(pattern.position.y);
      
      ctx.fillStyle = pattern.type === 'bullish' ? '#22c55e' : 
                     pattern.type === 'bearish' ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Label do padrão
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.fillText(pattern.name, x + 10, y - 10);
    });
  };

  useEffect(() => {
    setLoading(true);
    const data = generateCandleData(timeframe);
    setCandleData(data);
    setPatterns(detectCandlestickPatterns(data));
    setSupportResistance(calculateSupportResistance(data));
    setLoading(false);
  }, [timeframe]);

  useEffect(() => {
    if (!loading) {
      drawCandlestickChart();
    }
  }, [candleData, patterns, supportResistance, loading]);

  const handlePatternAlert = (pattern: TechnicalPattern) => {
    if (alerts.sound) {
      // Simular som de alerta
      console.log(`🔊 Alerta sonoro: ${pattern.name} detectado!`);
    }
    
    if (alerts.visual) {
      // Trigger visual alert
      console.log(`🚨 Alerta visual: ${pattern.name} - ${pattern.description}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles do Gráfico */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
            {/* Indicadores Técnicos */}
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

            {/* Configurações de Alertas */}
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

            {/* Suporte e Resistência */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">S&R Níveis</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {supportResistance.map((sr, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className={sr.type === 'support' ? 'text-green-500' : 'text-red-500'}>
                      {sr.type === 'support' ? '🟢' : '🔴'} ${sr.level.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {sr.touches}x
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas do Gráfico */}
          <div className="relative border rounded-lg bg-gray-900 p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <RefreshCw className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Alertas de Padrões */}
          {patterns.length > 0 && alerts.visual && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Padrões Detectados:</strong> {patterns.length} padrão(ões) identificado(s) no gráfico atual.
                {patterns.filter(p => p.confidence > 0.8).length > 0 && (
                  <span className="text-green-600 font-semibold">
                    {' '}({patterns.filter(p => p.confidence > 0.8).length} com alta confiança)
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