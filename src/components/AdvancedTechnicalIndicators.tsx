import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface AdvancedIndicatorsProps {
  technicalIndicators: any
}

// Candlestick pattern detection
const detectCandlestickPatterns = (prices: number[]) => {
  if (prices.length < 4) return []
  
  const patterns = []
  const recent = prices.slice(-4)
  
  // Simulate OHLC data from prices
  const candles = recent.map((price, i) => ({
    open: i > 0 ? recent[i-1] : price,
    high: price * (1 + Math.random() * 0.02),
    low: price * (1 - Math.random() * 0.02),
    close: price
  }))
  
  const lastCandle = candles[candles.length - 1]
  const prevCandle = candles[candles.length - 2]
  
  // Doji pattern
  if (Math.abs(lastCandle.close - lastCandle.open) / lastCandle.open < 0.001) {
    patterns.push({ name: "Doji", type: "neutral", strength: "medium" })
  }
  
  // Hammer pattern
  const bodySize = Math.abs(lastCandle.close - lastCandle.open)
  const lowerShadow = lastCandle.open - lastCandle.low
  const upperShadow = lastCandle.high - lastCandle.close
  
  if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.5) {
    patterns.push({ name: "Hammer", type: "bullish", strength: "strong" })
  }
  
  // Engulfing patterns
  if (prevCandle.close < prevCandle.open && lastCandle.close > lastCandle.open) {
    if (lastCandle.close > prevCandle.open && lastCandle.open < prevCandle.close) {
      patterns.push({ name: "Bullish Engulfing", type: "bullish", strength: "strong" })
    }
  }
  
  return patterns
}

// Ichimoku Cloud calculation
const calculateIchimoku = (prices: number[]) => {
  if (prices.length < 52) return null
  
  const tenkanSen = (Math.max(...prices.slice(-9)) + Math.min(...prices.slice(-9))) / 2
  const kijunSen = (Math.max(...prices.slice(-26)) + Math.min(...prices.slice(-26))) / 2
  const senkouSpanA = (tenkanSen + kijunSen) / 2
  const senkouSpanB = (Math.max(...prices.slice(-52)) + Math.min(...prices.slice(-52))) / 2
  const currentPrice = prices[prices.length - 1]
  
  let signal = "neutral"
  if (currentPrice > Math.max(senkouSpanA, senkouSpanB) && tenkanSen > kijunSen) {
    signal = "bullish"
  } else if (currentPrice < Math.min(senkouSpanA, senkouSpanB) && tenkanSen < kijunSen) {
    signal = "bearish"
  }
  
  return {
    tenkanSen,
    kijunSen,
    senkouSpanA,
    senkouSpanB,
    signal
  }
}

// Wave analysis (simplified Elliott Wave)
const analyzeWaves = (prices: number[]) => {
  if (prices.length < 8) return null
  
  const recent = prices.slice(-8)
  const peaks = []
  const troughs = []
  
  for (let i = 1; i < recent.length - 1; i++) {
    if (recent[i] > recent[i-1] && recent[i] > recent[i+1]) {
      peaks.push(i)
    }
    if (recent[i] < recent[i-1] && recent[i] < recent[i+1]) {
      troughs.push(i)
    }
  }
  
  const waveCount = peaks.length + troughs.length
  let wavePhase = "unknown"
  
  if (waveCount >= 5) {
    const trend = recent[recent.length-1] > recent[0] ? "uptrend" : "downtrend"
    wavePhase = waveCount % 2 === 1 ? "impulse" : "corrective"
    
    return {
      phase: wavePhase,
      trend,
      waveCount,
      confidence: Math.min(waveCount / 5 * 100, 100)
    }
  }
  
  return null
}

export function AdvancedTechnicalIndicators({ technicalIndicators }: AdvancedIndicatorsProps) {
  if (!technicalIndicators) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Técnicos Avançados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando indicadores...</p>
        </CardContent>
      </Card>
    )
  }

  // Generate sample price data for advanced analysis
  const samplePrices = Array.from({ length: 100 }, (_, i) => {
    const basePrice = 45000
    const trend = Math.sin(i / 10) * 2000
    const noise = (Math.random() - 0.5) * 1000
    return basePrice + trend + noise
  })

  const candlestickPatterns = detectCandlestickPatterns(samplePrices)
  const ichimoku = calculateIchimoku(samplePrices)
  const waveAnalysis = analyzeWaves(samplePrices)

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return "text-red-500"
    if (rsi < 30) return "text-green-500"
    return "text-yellow-500"
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Technical Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">RSI (14)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getRSIColor(technicalIndicators.rsi)}`}>
                  {technicalIndicators.rsi.toFixed(1)}
                </span>
                <Badge variant={technicalIndicators.rsi > 70 ? "destructive" : technicalIndicators.rsi < 30 ? "default" : "secondary"}>
                  {technicalIndicators.rsi > 70 ? "Sobrecomprado" : technicalIndicators.rsi < 30 ? "Sobrevendido" : "Neutro"}
                </Badge>
              </div>
              <Progress value={technicalIndicators.rsi} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Momentum (10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${technicalIndicators.momentum >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {technicalIndicators.momentum >= 0 ? '+' : ''}{technicalIndicators.momentum.toFixed(2)}%
                </span>
                {getSignalIcon(technicalIndicators.momentum > 5 ? "bullish" : technicalIndicators.momentum < -5 ? "bearish" : "neutral")}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.abs(technicalIndicators.momentum) > 10 ? "Forte" : Math.abs(technicalIndicators.momentum) > 5 ? "Moderado" : "Fraco"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Bandas de Bollinger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Superior:</span>
                  <span className="font-mono">${technicalIndicators.bollingerUpper.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inferior:</span>
                  <span className="font-mono">${technicalIndicators.bollingerLower.toLocaleString()}</span>
                </div>
              </div>
              <Badge variant="outline" className="w-full justify-center">
                Volatilidade: {((technicalIndicators.bollingerUpper - technicalIndicators.bollingerLower) / technicalIndicators.sma200 * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ichimoku Cloud */}
      {ichimoku && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ichimoku Cloud</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tenkan-sen (9):</span>
                  <span className="font-mono">${ichimoku.tenkanSen.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kijun-sen (26):</span>
                  <span className="font-mono">${ichimoku.kijunSen.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Senkou Span A:</span>
                  <span className="font-mono">${ichimoku.senkouSpanA.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Senkou Span B:</span>
                  <span className="font-mono">${ichimoku.senkouSpanB.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getSignalIcon(ichimoku.signal)}
                  </div>
                  <Badge 
                    variant={ichimoku.signal === "bullish" ? "default" : ichimoku.signal === "bearish" ? "destructive" : "secondary"}
                    className="text-sm"
                  >
                    {ichimoku.signal === "bullish" ? "Alta" : ichimoku.signal === "bearish" ? "Baixa" : "Neutro"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candlestick Patterns */}
      {candlestickPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Padrões Candlestick</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {candlestickPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{pattern.name}</p>
                    <p className="text-sm text-muted-foreground">Força: {pattern.strength}</p>
                  </div>
                  <Badge 
                    variant={pattern.type === "bullish" ? "default" : pattern.type === "bearish" ? "destructive" : "secondary"}
                  >
                    {pattern.type === "bullish" ? "Alta" : pattern.type === "bearish" ? "Baixa" : "Neutro"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elliott Wave Analysis */}
      {waveAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise de Ondas (Elliott)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Fase Atual</p>
                <p className="text-xl font-bold capitalize">{waveAnalysis.phase}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tendência</p>
                <div className="flex items-center justify-center">
                  {getSignalIcon(waveAnalysis.trend === "uptrend" ? "bullish" : "bearish")}
                  <span className="ml-2 font-medium capitalize">{waveAnalysis.trend === "uptrend" ? "Alta" : "Baixa"}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Confiança</p>
                <p className="text-xl font-bold">{waveAnalysis.confidence.toFixed(0)}%</p>
                <Progress value={waveAnalysis.confidence} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moving Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Médias Móveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">SMA 50</p>
              <p className="text-xl font-bold">${technicalIndicators.sma50.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">SMA 100</p>
              <p className="text-xl font-bold">${technicalIndicators.sma100.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">SMA 200</p>
              <p className="text-xl font-bold">${technicalIndicators.sma200.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {technicalIndicators.sma50 > technicalIndicators.sma200 * 1.02 && (
              <Badge className="w-full justify-center">
                🚀 Golden Cross Detectado - SMA 50 maior que SMA 200
              </Badge>
            )}
            {technicalIndicators.sma50 < technicalIndicators.sma200 * 0.98 && (
              <Badge variant="destructive" className="w-full justify-center">
                💀 Death Cross Detectado - SMA 50 menor que SMA 200
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}