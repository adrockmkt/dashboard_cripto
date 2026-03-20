import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  Activity, 
  Zap, 
  Users, 
  AlertTriangle,
  RefreshCw,
  Database,
  Network
} from "lucide-react";
import { fetchOnChainSnapshot } from "@/services/onChainService";
import type { DataSource, OnChainHistoryPoint, OnChainOverview } from "@/services/types";

export function OnChainMetrics() {
  const [onChainData, setOnChainData] = useState<OnChainOverview | null>(null);
  const [historicalData, setHistoricalData] = useState<OnChainHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('addresses');
  const [source, setSource] = useState<DataSource>("fallback");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchOnChainSnapshot();
      setOnChainData(result.data?.overview || null);
      setHistoricalData(result.data?.history || []);
      setSource(result.source);
      setError(result.error || null);
      setLoading(false);
    };

    loadData();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [reloadKey]);

  const formatNumber = (num: number, suffix: string = '') => {
    if (!Number.isFinite(num)) return "N/A";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B${suffix}`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M${suffix}`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K${suffix}`;
    return `${num.toFixed(2)}${suffix}`;
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getSourceLabel = (currentSource: DataSource) =>
    currentSource === "real" ? "Fonte real" : currentSource === "simulated" ? "Simulado" : "Fallback";

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="ml-2">Carregando métricas on-chain...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!onChainData) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar métricas on-chain.
          </p>
          {error && <p className="text-xs text-muted-foreground">{error}</p>}
          <Button variant="outline" onClick={() => setReloadKey((prev) => prev + 1)}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant={source === "real" ? "default" : "secondary"}>
          {getSourceLabel(source)}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Dados on-chain vindos de Blockchain.com Charts e mempool.space.
        </span>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Endereços Ativos</p>
                <p className="text-2xl font-bold">
                  {onChainData.activeAddresses === null ? "N/A" : formatNumber(onChainData.activeAddresses)}
                </p>
                <p className="text-xs text-muted-foreground">Último ponto disponível</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hashrate</p>
                <p className="text-2xl font-bold">{onChainData.hashrate?.toFixed(1) ?? "N/A"} EH/s</p>
                <p className="text-xs text-muted-foreground">Série histórica real</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mempool</p>
                <p className="text-2xl font-bold">{formatNumber(onChainData.mempoolTransactions ?? 0)}</p>
                <p className="text-xs text-muted-foreground">Transações pendentes</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
                <p className="text-2xl font-bold">${onChainData.averageFeeUsd?.toFixed(2) ?? "N/A"}</p>
                <p className="text-xs text-muted-foreground">USD por transação</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Taxas Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
                <span className="text-sm">Confirmação rápida</span>
                <span className="font-bold">{onChainData.recommendedFees.fastestFee ?? "N/A"} sat/vB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                <span className="text-sm">Até 30 minutos</span>
                <span className="font-bold">{onChainData.recommendedFees.halfHourFee ?? "N/A"} sat/vB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <span className="text-sm">Até 1 hora</span>
                <span className="font-bold">{onChainData.recommendedFees.hourFee ?? "N/A"} sat/vB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Saúde da Rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getHealthColor(onChainData.networkHealth.score)}`}>
                  {onChainData.networkHealth.score.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Score Geral</p>
              </div>

              <div className="space-y-3">
                {Object.entries(onChainData.networkHealth.factors).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key === "fees" ? "Eficiência de taxas" : key}</span>
                      <span>{value.toFixed(1)}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Históricas (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="addresses">Endereços</TabsTrigger>
              <TabsTrigger value="hashrate">Hashrate</TabsTrigger>
              <TabsTrigger value="flow">Fluxo</TabsTrigger>
              <TabsTrigger value="fees">Taxas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="addresses" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [formatNumber(value), 'Endereços Ativos']} />
                  <Line type="monotone" dataKey="activeAddresses" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="hashrate" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${Number(value).toFixed(2)} EH/s`, 'Hashrate']} />
                  <Area type="monotone" dataKey="hashrate" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="flow" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [formatNumber(value), 'Mempool']} />
                  <Area type="monotone" dataKey="mempoolSize" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="fees" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Taxa Média']} />
                  <Line type="monotone" dataKey="fees" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {onChainData.recommendedFees.fastestFee !== null && onChainData.recommendedFees.fastestFee > 20 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🚨 Alerta de rede:</strong> A taxa recomendada para confirmação rápida está acima de {onChainData.recommendedFees.fastestFee} sat/vB, indicando pressão recente na rede.
          </AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Exchange flow, baleias e fluxo institucional ficaram fora desta primeira integração por dependerem de provedores adicionais ou pagos. Nesta Sprint 1, o módulo foi migrado para métricas on-chain reais e verificáveis.
          {error ? ` Detalhe técnico: ${error}` : ""}
        </AlertDescription>
      </Alert>
    </div>
  );
}
