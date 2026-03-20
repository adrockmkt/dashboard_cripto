import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Settings,
  CheckCircle,
  RefreshCw,
  Link2,
  MonitorSmartphone,
} from "lucide-react";
import { useAdvancedAlerts } from "@/hooks/useAdvancedAlerts";
import type { AdvancedAlert } from "@/services/advancedAlertsEngine";
import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
} from "@/services/browserNotifications";

const metricOptions = [
  { value: "btc_price", label: "Preço BTC" },
  { value: "btc_change_24h", label: "Variação 24h BTC" },
  { value: "rsi", label: "RSI" },
  { value: "momentum", label: "Momentum" },
  { value: "fear_greed", label: "Fear & Greed" },
  { value: "active_addresses", label: "Endereços Ativos" },
  { value: "hashrate", label: "Hashrate" },
  { value: "mempool", label: "Mempool" },
  { value: "avg_fee_usd", label: "Taxa Média USD" },
];

const formatMetricValue = (value: number | null | undefined) =>
  value === null || value === undefined || Number.isNaN(value) ? "N/A" : value.toFixed(2);

export function AdvancedAlertsSystem() {
  const {
    alerts,
    activeAlerts,
    history,
    snapshot,
    loading,
    error,
    globalSettings,
    setGlobalSettings,
    createAlert,
    toggleAlert,
    removeAlert,
    dismissActiveAlert,
    refreshSnapshot,
  } = useAdvancedAlerts();
  const [browserPermission, setBrowserPermission] = useState(getBrowserNotificationPermission());

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: "",
    type: "price" as AdvancedAlert["type"],
    conditions: [
      {
        metric: "btc_price",
        operator: "above" as const,
        value: 50000,
        timeframe: "1h",
      },
    ],
    actions: [
      { type: "sound" as const, config: { sound: "default" } },
      { type: "visual" as const, config: { duration: 5000 } },
    ],
    webhookUrl: "",
  });

  const enableBrowserNotifications = async () => {
    const permission = await requestBrowserNotificationPermission();
    setBrowserPermission(permission);
    if (permission === "granted") {
      setGlobalSettings((prev) => ({ ...prev, browserNotificationsEnabled: true }));
      return;
    }

    if (permission !== "unsupported") {
      setGlobalSettings((prev) => ({ ...prev, browserNotificationsEnabled: false }));
    }
  };

  const technicalSignals = useMemo(() => {
    if (!snapshot) return [];
    return [
      { name: "RSI", value: snapshot.rsi, status: snapshot.rsi !== null ? (snapshot.rsi > 70 ? "bearish" : snapshot.rsi < 30 ? "bullish" : "neutral") : "neutral" },
      { name: "Momentum", value: snapshot.momentum, status: snapshot.momentum !== null ? (snapshot.momentum > 0 ? "bullish" : snapshot.momentum < 0 ? "bearish" : "neutral") : "neutral" },
      { name: "Fear & Greed", value: snapshot.fear_greed, status: snapshot.fear_greed !== null ? (snapshot.fear_greed > 75 ? "bearish" : snapshot.fear_greed < 25 ? "bullish" : "neutral") : "neutral" },
      { name: "Hashrate", value: snapshot.hashrate, status: snapshot.hashrate !== null ? "bullish" : "neutral" },
      { name: "Mempool", value: snapshot.mempool, status: snapshot.mempool !== null && snapshot.mempool > 50000 ? "bearish" : "neutral" },
    ];
  }, [snapshot]);

  const handleCreateAlert = () => {
    if (!newAlert.name.trim()) return;

    const actions = [...newAlert.actions];
    if (newAlert.webhookUrl.trim()) {
      actions.push({
        type: "webhook",
        config: {
          url: newAlert.webhookUrl.trim(),
          method: "POST",
        },
      });
    }

    createAlert({
      name: newAlert.name,
      type: newAlert.type,
      conditions: newAlert.conditions,
      actions,
      isActive: true,
    });

    setNewAlert({
      name: "",
      type: "price",
      conditions: [
        {
          metric: "btc_price",
          operator: "above",
          value: 50000,
          timeframe: "1h",
        },
      ],
      actions: [
        { type: "sound", config: { sound: "default" } },
        { type: "visual", config: { duration: 5000 } },
      ],
      webhookUrl: "",
    });
    setShowCreateForm(false);
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "price":
        return <Target className="w-4 h-4" />;
      case "technical":
        return <Activity className="w-4 h-4" />;
      case "onchain":
        return <TrendingUp className="w-4 h-4" />;
      case "pattern":
        return <AlertTriangle className="w-4 h-4" />;
      case "sentiment":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case "price":
        return "Preço";
      case "technical":
        return "Técnico";
      case "onchain":
        return "On-Chain";
      case "pattern":
        return "Padrão";
      case "sentiment":
        return "Sentimento";
      default:
        return "Geral";
    }
  };

  const getSignalColor = (status: string) => {
    switch (status) {
      case "bullish":
        return "text-green-500";
      case "bearish":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="space-y-6">
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <Alert key={alert.id} className="border-orange-500 bg-orange-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                <Button variant="ghost" size="sm" onClick={() => dismissActiveAlert(alert.id)}>
                  ✕
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema de Alertas Avançado
              {alerts.filter((alert) => alert.isActive).length > 0 && (
                <Badge variant="secondary">{alerts.filter((alert) => alert.isActive).length} ativos</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={refreshSnapshot} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Alerta
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.soundEnabled}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, soundEnabled: checked }))}
              />
              <Label className="flex items-center gap-2">
                {globalSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Som
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.visualEnabled}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, visualEnabled: checked }))}
              />
              <Label className="flex items-center gap-2">
                {globalSettings.visualEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                Visual
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.emailEnabled}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, emailEnabled: checked }))}
              />
              <Label>Email</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.webhookEnabled}
                onCheckedChange={(checked) => setGlobalSettings((prev) => ({ ...prev, webhookEnabled: checked }))}
              />
              <Label className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                Webhook
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-lg border border-border/60 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex items-center gap-2 font-medium">
                <MonitorSmartphone className="h-4 w-4" />
                Notificações do navegador
                <Badge variant={browserPermission === "granted" ? "default" : "secondary"}>
                  {browserPermission === "granted"
                    ? "Permitidas"
                    : browserPermission === "denied"
                      ? "Bloqueadas"
                      : browserPermission === "unsupported"
                        ? "Indisponíveis"
                        : "Não configuradas"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Ativa avisos nativos quando um alerta disparar, mesmo que você esteja em outra aba do navegador.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={globalSettings.browserNotificationsEnabled}
                disabled={browserPermission === "denied" || browserPermission === "unsupported"}
                onCheckedChange={(checked) =>
                  setGlobalSettings((prev) => ({ ...prev, browserNotificationsEnabled: checked }))
                }
              />
              <Button variant="outline" size="sm" onClick={enableBrowserNotifications}>
                Permitir
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">BTC:</span> {formatMetricValue(snapshot?.btc_price)}
            </div>
            <div>
              <span className="text-muted-foreground">RSI:</span> {formatMetricValue(snapshot?.rsi)}
            </div>
            <div>
              <span className="text-muted-foreground">Fear & Greed:</span> {formatMetricValue(snapshot?.fear_greed)}
            </div>
            <div>
              <span className="text-muted-foreground">Hashrate:</span> {formatMetricValue(snapshot?.hashrate)}
            </div>
          </div>

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Alerta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome do Alerta</Label>
                <Input
                  value={newAlert.name}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: BTC acima de $50k"
                />
              </div>

              <div>
                <Label>Tipo</Label>
                <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert((prev) => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Preço</SelectItem>
                    <SelectItem value="technical">Indicador Técnico</SelectItem>
                    <SelectItem value="onchain">Métrica On-Chain</SelectItem>
                    <SelectItem value="pattern">Padrão Gráfico</SelectItem>
                    <SelectItem value="sentiment">Sentimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Métrica</Label>
                <Select
                  value={newAlert.conditions[0].metric}
                  onValueChange={(value) =>
                    setNewAlert((prev) => ({
                      ...prev,
                      conditions: [{ ...prev.conditions[0], metric: value }],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {metricOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Condição</Label>
                <Select
                  value={newAlert.conditions[0].operator}
                  onValueChange={(value: any) =>
                    setNewAlert((prev) => ({
                      ...prev,
                      conditions: [{ ...prev.conditions[0], operator: value }],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Acima de</SelectItem>
                    <SelectItem value="below">Abaixo de</SelectItem>
                    <SelectItem value="crosses_above">Cruza acima</SelectItem>
                    <SelectItem value="crosses_below">Cruza abaixo</SelectItem>
                    <SelectItem value="equals">Igual a</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  value={newAlert.conditions[0].value}
                  onChange={(e) =>
                    setNewAlert((prev) => ({
                      ...prev,
                      conditions: [{ ...prev.conditions[0], value: Number(e.target.value) }],
                    }))
                  }
                />
              </div>

              <div>
                <Label>Timeframe</Label>
                <Select
                  value={newAlert.conditions[0].timeframe}
                  onValueChange={(value) =>
                    setNewAlert((prev) => ({
                      ...prev,
                      conditions: [{ ...prev.conditions[0], timeframe: value }],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1m</SelectItem>
                    <SelectItem value="5m">5m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="4h">4h</SelectItem>
                    <SelectItem value="1d">1d</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Webhook URL (opcional)</Label>
              <Input
                value={newAlert.webhookUrl}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://example.com/webhook"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAlert}>Criar Alerta</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Meus Alertas</TabsTrigger>
          <TabsTrigger value="signals">Sinais</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Configurados</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">Nenhum alerta configurado</p>
                  <p className="text-sm text-muted-foreground">
                    Crie alertas personalizados para monitorar o mercado
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getAlertTypeIcon(alert.type)}
                          {alert.isActive ? (
                            <Bell className="w-4 h-4 text-green-500" />
                          ) : (
                            <BellOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{alert.name}</span>
                            <Badge variant="outline">{getAlertTypeName(alert.type)}</Badge>
                            {alert.triggered && (
                              <Badge variant="destructive">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Disparado
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.conditions[0].metric} {alert.conditions[0].operator} {alert.conditions[0].value}
                            {alert.lastTriggered && (
                              <span className="ml-2">• Último: {new Date(alert.lastTriggered).toLocaleString("pt-BR")}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch checked={alert.isActive} onCheckedChange={() => toggleAlert(alert.id)} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAlert(alert.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle>Sinais Reais Avaliados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicalSignals.map((signal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{signal.name}</h4>
                      <Badge className={getSignalColor(signal.status)}>
                        {signal.status === "bullish" ? "Alta" : signal.status === "bearish" ? "Baixa" : "Neutro"}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-2">{formatMetricValue(signal.value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Disparos</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum alerta disparado ainda.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{entry.alertName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.triggeredAt).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{entry.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
