
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Plus, Trash2, Bell, BellOff } from "lucide-react"
import { useCustomAlerts } from "@/hooks/useCustomAlerts"
import { useToast } from "@/hooks/use-toast"

export function CustomAlertsPanel() {
  const { alerts, createAlert, toggleAlert, deleteAlert } = useCustomAlerts()
  const { toast } = useToast()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    cryptoId: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    type: "price_above" as const,
    value: "",
    isActive: true
  })

  const handleCreateAlert = () => {
    if (!newAlert.value) {
      toast({
        title: "Erro",
        description: "Digite um valor para o alerta",
        variant: "destructive"
      })
      return
    }

    createAlert({
      cryptoId: newAlert.cryptoId,
      symbol: newAlert.symbol,
      name: newAlert.name,
      type: newAlert.type,
      value: parseFloat(newAlert.value),
      isActive: newAlert.isActive
    })

    setNewAlert({
      cryptoId: "bitcoin",
      symbol: "BTC", 
      name: "Bitcoin",
      type: "price_above",
      value: "",
      isActive: true
    })
    setShowCreateForm(false)
    
    toast({
      title: "Alerta criado",
      description: `Alerta para ${newAlert.symbol} criado com sucesso`
    })
  }

  const getAlertDescription = (alert: any) => {
    const formatValue = alert.type.includes('price') 
      ? `$${alert.value.toLocaleString()}` 
      : `${alert.value}%`
    
    switch (alert.type) {
      case 'price_above':
        return `Preço acima de ${formatValue}`
      case 'price_below':
        return `Preço abaixo de ${formatValue}`
      case 'change_above':
        return `Variação acima de ${formatValue}`
      case 'change_below':
        return `Variação abaixo de ${formatValue}`
      default:
        return 'Alerta personalizado'
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas Personalizados
            {alerts.length > 0 && (
              <Badge variant="secondary">{alerts.length}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Alerta
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCreateForm && (
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-semibold">Criar Novo Alerta</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Criptomoeda</Label>
                <Select value={newAlert.cryptoId} onValueChange={(value) => {
                  const cryptos = [
                    { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
                    { id: "ethereum", symbol: "ETH", name: "Ethereum" },
                    { id: "cardano", symbol: "ADA", name: "Cardano" },
                    { id: "solana", symbol: "SOL", name: "Solana" }
                  ]
                  const crypto = cryptos.find(c => c.id === value)
                  if (crypto) {
                    setNewAlert({...newAlert, cryptoId: value, symbol: crypto.symbol, name: crypto.name})
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                    <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                    <SelectItem value="solana">Solana (SOL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Alerta</Label>
                <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert({...newAlert, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_above">Preço Acima de</SelectItem>
                    <SelectItem value="price_below">Preço Abaixo de</SelectItem>
                    <SelectItem value="change_above">Variação Acima de</SelectItem>
                    <SelectItem value="change_below">Variação Abaixo de</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                step="any"
                placeholder={newAlert.type.includes('price') ? "0.00" : "0.0"}
                value={newAlert.value}
                onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newAlert.isActive}
                  onCheckedChange={(checked) => setNewAlert({...newAlert, isActive: checked})}
                />
                <Label>Ativo</Label>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAlert}>
                  Criar Alerta
                </Button>
              </div>
            </div>
          </div>
        )}

        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">Nenhum alerta personalizado</p>
            <p className="text-sm text-muted-foreground">
              Crie alertas para monitorar preços e variações específicas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {alert.isActive ? (
                      <Bell className="w-4 h-4 text-green-500" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{alert.symbol}</span>
                      <Badge variant={alert.triggered ? "destructive" : "secondary"}>
                        {alert.triggered ? "Disparado" : "Ativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getAlertDescription(alert)}
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
                    onClick={() => deleteAlert(alert.id)}
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
  )
}
