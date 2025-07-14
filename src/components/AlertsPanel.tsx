import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCryptoAlerts } from "@/hooks/useCryptoAnalysis";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Bell, 
  BellOff,
  Trash2 
} from "lucide-react";
import { type TechnicalIndicators } from "@/services/cryptoApi";

interface AlertsPanelProps {
  technicalIndicators: TechnicalIndicators | null;
}

const AlertsPanel = ({ technicalIndicators }: AlertsPanelProps) => {
  const { alerts, clearAlerts, removeAlert } = useCryptoAlerts(technicalIndicators);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'info':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return "border-orange-500 bg-orange-500/10";
      case 'success':
        return "border-green-500 bg-green-500/10";
      case 'info':
      default:
        return "border-blue-500 bg-blue-500/10";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return "destructive";
      case 'success':
        return "default";
      case 'info':
      default:
        return "secondary";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertas em Tempo Real
            {alerts.length > 0 && (
              <Badge variant="secondary">{alerts.length}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
            {alerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAlerts}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Nenhum alerta ativo no momento. Os alertas aparecerão automaticamente 
              quando condições específicas do mercado forem detectadas.
            </AlertDescription>
          </Alert>
        ) : (
          alerts.map((alert) => (
            <Alert key={alert.id} className={`${getAlertColor(alert.type)} border-l-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertDescription className="font-medium">
                      {alert.message}
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                    {alert.type === 'warning' ? 'Atenção' : 
                     alert.type === 'success' ? 'Oportunidade' : 'Info'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlert(alert.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Alert>
          ))
        )}

        {/* Resumo dos indicadores principais */}
        {technicalIndicators && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm mb-3">Resumo Rápido</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span>RSI:</span>
                <span className={
                  technicalIndicators.rsi > 70 ? "text-red-500 font-semibold" :
                  technicalIndicators.rsi < 30 ? "text-green-500 font-semibold" :
                  "text-muted-foreground"
                }>
                  {technicalIndicators.rsi.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Momentum:</span>
                <span className={
                  technicalIndicators.momentum > 5 ? "text-green-500 font-semibold" :
                  technicalIndicators.momentum < -5 ? "text-red-500 font-semibold" :
                  "text-muted-foreground"
                }>
                  {technicalIndicators.momentum.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>SMA 50/200:</span>
                <span className={
                  technicalIndicators.sma50 > technicalIndicators.sma200 ? 
                  "text-green-500 font-semibold" : "text-red-500 font-semibold"
                }>
                  {technicalIndicators.sma50 > technicalIndicators.sma200 ? "Bullish" : "Bearish"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sinal Geral:</span>
                <span className={
                  (technicalIndicators.rsi < 70 && technicalIndicators.momentum > 0 && 
                   technicalIndicators.sma50 > technicalIndicators.sma200) ? 
                   "text-green-500 font-semibold" : 
                   (technicalIndicators.rsi > 70 || technicalIndicators.momentum < -5) ?
                   "text-red-500 font-semibold" : "text-yellow-500 font-semibold"
                }>
                  {(technicalIndicators.rsi < 70 && technicalIndicators.momentum > 0 && 
                    technicalIndicators.sma50 > technicalIndicators.sma200) ? "Compra" : 
                    (technicalIndicators.rsi > 70 || technicalIndicators.momentum < -5) ? "Venda" : "Neutro"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;