import { useState, useEffect } from "react";
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
  CheckCircle
} from "lucide-react";

interface AdvancedAlert {
  id: string;
  name: string;
  type: 'price' | 'technical' | 'onchain' | 'pattern' | 'sentiment';
  conditions: AlertCondition[];
  actions: AlertAction[];
  isActive: boolean;
  triggered: boolean;
  lastTriggered?: Date;
  createdAt: Date;
}

interface AlertCondition {
  metric: string;
  operator: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals';
  value: number;
  timeframe?: string;
}

interface AlertAction {
  type: 'sound' | 'visual' | 'email' | 'webhook';
  config: any;
}

interface TechnicalSignal {
  name: string;
  value: number;
  status: 'bullish' | 'bearish' | 'neutral';
  strength: number;
}

export function AdvancedAlertsSystem() {
  const [alerts, setAlerts] = useState<AdvancedAlert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [technicalSignals, setTechnicalSignals] = useState<TechnicalSignal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    soundEnabled: true,
    visualEnabled: true,
    emailEnabled: false,
    webhookEnabled: false
  });

  // Formulário de novo alerta
  const [newAlert, setNewAlert] = useState({
    name: '',
    type: 'price' as const,
    conditions: [{
      metric: 'btc_price',
      operator: 'above' as const,
      value: 50000,
      timeframe: '1h'
    }],
    actions: [
      { type: 'sound' as const, config: { sound: 'default' } },
      { type: 'visual' as const, config: { duration: 5000 } }
    ]
  });

  // Gerar sinais técnicos simulados
  const generateTechnicalSignals = (): TechnicalSignal[] => {
    return [
      {
        name: 'RSI (14)',
        value: 45 + Math.random() * 40,
        status: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral',
        strength: Math.random() * 100
      },
      {
        name: 'MACD',
        value: (Math.random() - 0.5) * 1000,
        status: Math.random() > 0.5 ? 'bullish' : 'bearish',
        strength: Math.random() * 100
      },
      {
        name: 'Bollinger Bands',
        value: Math.random() * 100,
        status: Math.random() > 0.6 ? 'neutral' : Math.random() > 0.3 ? 'bullish' : 'bearish',
        strength: Math.random() * 100
      },
      {
        name: 'Moving Average Cross',
        value: Math.random() > 0.5 ? 1 : -1,
        status: Math.random() > 0.5 ? 'bullish' : 'bearish',
        strength: 70 + Math.random() * 30
      },
      {
        name: 'Volume Profile',
        value: Math.random() * 1000000,
        status: 'neutral',
        strength: Math.random() * 100
      }
    ];
  };

  // Verificar condições dos alertas
  const checkAlertConditions = (alert: AdvancedAlert): boolean => {
    // Simular verificação de condições
    return Math.random() > 0.8; // 20% chance de disparar
  };

  // Executar ação do alerta
  const executeAlertAction = (alert: AdvancedAlert, action: AlertAction) => {
    switch (action.type) {
      case 'sound':
        if (globalSettings.soundEnabled) {
          console.log(`🔊 Som do alerta: ${alert.name}`);
          // Aqui você adicionaria o código para tocar o som
        }
        break;
      case 'visual':
        if (globalSettings.visualEnabled) {
          setActiveAlerts(prev => [...prev, {
            id: Date.now().toString(),
            alertId: alert.id,
            message: `🚨 ${alert.name} foi disparado!`,
            timestamp: new Date(),
            type: alert.type
          }]);
        }
        break;
      case 'email':
        if (globalSettings.emailEnabled) {
          console.log(`📧 Email enviado para alerta: ${alert.name}`);
        }
        break;
      case 'webhook':
        if (globalSettings.webhookEnabled) {
          console.log(`🔗 Webhook chamado para alerta: ${alert.name}`);
        }
        break;
    }
  };

  // Criar novo alerta
  const createAlert = () => {
    if (!newAlert.name.trim()) return;

    const alert: AdvancedAlert = {
      id: Date.now().toString(),
      name: newAlert.name,
      type: newAlert.type,
      conditions: newAlert.conditions,
      actions: newAlert.actions,
      isActive: true,
      triggered: false,
      createdAt: new Date()
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({
      name: '',
      type: 'price',
      conditions: [{
        metric: 'btc_price',
        operator: 'above',
        value: 50000,
        timeframe: '1h'
      }],
      actions: [
        { type: 'sound' as const, config: { sound: 'default' } },
        { type: 'visual' as const, config: { duration: 5000 } }
      ]
    });
    setShowCreateForm(false);
  };

  // Toggle alerta
  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  // Remover alerta
  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Remover alerta ativo
  const dismissActiveAlert = (activeAlertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== activeAlertId));
  };

  // Verificar alertas periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setTechnicalSignals(generateTechnicalSignals());
      
      alerts.forEach(alert => {
        if (alert.isActive && !alert.triggered && checkAlertConditions(alert)) {
          // Marcar como disparado
          setAlerts(prev => prev.map(a => 
            a.id === alert.id ? { ...a, triggered: true, lastTriggered: new Date() } : a
          ));
          
          // Executar ações
          alert.actions.forEach(action => executeAlertAction(alert, action));
        }
      });
    }, 10000); // Verificar a cada 10 segundos

    return () => clearInterval(interval);
  }, [alerts, globalSettings]);

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'price': return <Target className="w-4 h-4" />;
      case 'technical': return <Activity className="w-4 h-4" />;
      case 'onchain': return <TrendingUp className="w-4 h-4" />;
      case 'pattern': return <AlertTriangle className="w-4 h-4" />;
      case 'sentiment': return <TrendingDown className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case 'price': return 'Preço';
      case 'technical': return 'Técnico';
      case 'onchain': return 'On-Chain';
      case 'pattern': return 'Padrão';
      case 'sentiment': return 'Sentimento';
      default: return 'Geral';
    }
  };

  const getSignalColor = (status: string) => {
    switch (status) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alertas Ativos */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map(alert => (
            <Alert key={alert.id} className="border-orange-500 bg-orange-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissActiveAlert(alert.id)}
                >
                  ✕
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Configurações Globais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema de Alertas Avançado
              {alerts.filter(a => a.isActive).length > 0 && (
                <Badge variant="secondary">
                  {alerts.filter(a => a.isActive).length} ativos
                </Badge>
              )}
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Alerta
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.soundEnabled}
                onCheckedChange={(checked) => 
                  setGlobalSettings(prev => ({ ...prev, soundEnabled: checked }))
                }
              />
              <Label className="flex items-center gap-2">
                {globalSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Som
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.visualEnabled}
                onCheckedChange={(checked) => 
                  setGlobalSettings(prev => ({ ...prev, visualEnabled: checked }))
                }
              />
              <Label className="flex items-center gap-2">
                {globalSettings.visualEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                Visual
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.emailEnabled}
                onCheckedChange={(checked) => 
                  setGlobalSettings(prev => ({ ...prev, emailEnabled: checked }))
                }
              />
              <Label>Email</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={globalSettings.webhookEnabled}
                onCheckedChange={(checked) => 
                  setGlobalSettings(prev => ({ ...prev, webhookEnabled: checked }))
                }
              />
              <Label>Webhook</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Criação */}
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
                  onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: BTC acima de $50k"
                />
              </div>
              
              <div>
                <Label>Tipo</Label>
                <Select 
                  value={newAlert.type} 
                  onValueChange={(value: any) => setNewAlert(prev => ({ ...prev, type: value }))}
                >
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
                  onValueChange={(value) => setNewAlert(prev => ({
                    ...prev,
                    conditions: [{ ...prev.conditions[0], metric: value }]
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc_price">Preço BTC</SelectItem>
                    <SelectItem value="rsi">RSI</SelectItem>
                    <SelectItem value="macd">MACD</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="fear_greed">Fear & Greed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Condição</Label>
                <Select 
                  value={newAlert.conditions[0].operator}
                  onValueChange={(value: any) => setNewAlert(prev => ({
                    ...prev,
                    conditions: [{ ...prev.conditions[0], operator: value }]
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Acima de</SelectItem>
                    <SelectItem value="below">Abaixo de</SelectItem>
                    <SelectItem value="crosses_above">Cruza acima</SelectItem>
                    <SelectItem value="crosses_below">Cruza abaixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  value={newAlert.conditions[0].value}
                  onChange={(e) => setNewAlert(prev => ({
                    ...prev,
                    conditions: [{ ...prev.conditions[0], value: Number(e.target.value) }]
                  }))}
                />
              </div>
              
              <div>
                <Label>Timeframe</Label>
                <Select 
                  value={newAlert.conditions[0].timeframe}
                  onValueChange={(value) => setNewAlert(prev => ({
                    ...prev,
                    conditions: [{ ...prev.conditions[0], timeframe: value }]
                  }))}
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

            <div className="flex gap-2">
              <Button onClick={createAlert}>Criar Alerta</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Meus Alertas</TabsTrigger>
          <TabsTrigger value="signals">Sinais Técnicos</TabsTrigger>
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
                  {alerts.map(alert => (
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
                            <Badge variant="outline">
                              {getAlertTypeName(alert.type)}
                            </Badge>
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
                              <span className="ml-2">
                                • Último: {alert.lastTriggered.toLocaleString('pt-BR')}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => toggleAlert(alert.id)}
                        />
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
              <CardTitle>Sinais Técnicos em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicalSignals.map((signal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{signal.name}</h4>
                      <Badge className={getSignalColor(signal.status)}>
                        {signal.status === 'bullish' ? 'Alta' : 
                         signal.status === 'bearish' ? 'Baixa' : 'Neutro'}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-2">
                      {signal.name.includes('MACD') ? signal.value.toFixed(2) :
                       signal.name.includes('RSI') ? signal.value.toFixed(1) :
                       signal.name.includes('Cross') ? (signal.value > 0 ? 'Bullish' : 'Bearish') :
                       signal.value.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Força:</span>
                      <span className="font-medium">{signal.strength.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}