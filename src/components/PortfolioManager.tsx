import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase, type Portfolio } from "@/lib/supabase"

interface PortfolioItem {
  id: string
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  pnl: number
  pnlPercentage: number
}

interface PortfolioStats {
  totalValue: number
  totalInvested: number
  totalPnL: number
  totalPnLPercentage: number
  bestPerformer: PortfolioItem | null
  worstPerformer: PortfolioItem | null
}

export function PortfolioManager() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvested: 0,
    totalPnL: 0,
    totalPnLPercentage: 0,
    bestPerformer: null,
    worstPerformer: null
  })
  const [newAsset, setNewAsset] = useState({
    symbol: "",
    quantity: "",
    avgPrice: ""
  })
  const { toast } = useToast()

  // Load portfolio from Supabase
  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar portfolio:', error)
        // Fallback para localStorage
        const savedPortfolio = localStorage.getItem("crypto-portfolio")
        if (savedPortfolio) {
          const portfolioData = JSON.parse(savedPortfolio)
          setPortfolio(portfolioData)
          updatePricesAndStats(portfolioData)
        }
        return
      }

      if (data) {
        const portfolioData = data.map(item => ({
          id: item.id,
          symbol: item.symbol,
          name: item.name,
          quantity: item.quantity,
          avgPrice: item.avg_price,
          currentPrice: item.current_price,
          totalValue: item.total_value,
          pnl: item.pnl,
          pnlPercentage: item.pnl_percentage
        }))
        setPortfolio(portfolioData)
        updatePricesAndStats(portfolioData)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
      // Fallback para localStorage
      const savedPortfolio = localStorage.getItem("crypto-portfolio")
      if (savedPortfolio) {
        const portfolioData = JSON.parse(savedPortfolio)
        setPortfolio(portfolioData)
        updatePricesAndStats(portfolioData)
      }
    }
  }

  // Update current prices and calculate stats
  const updatePricesAndStats = async (portfolioData: PortfolioItem[]) => {
    if (portfolioData.length === 0) return

    try {
      // Simulate price updates - in real app, fetch from API
      const updatedPortfolio = portfolioData.map(item => {
        // Simulate price change (±5%)
        const priceChange = (Math.random() - 0.5) * 0.1
        const currentPrice = item.avgPrice * (1 + priceChange)
        const totalValue = currentPrice * item.quantity
        const totalInvested = item.avgPrice * item.quantity
        const pnl = totalValue - totalInvested
        const pnlPercentage = (pnl / totalInvested) * 100

        return {
          ...item,
          currentPrice,
          totalValue,
          pnl,
          pnlPercentage
        }
      })

      // Calculate stats
      const totalValue = updatedPortfolio.reduce((sum, item) => sum + item.totalValue, 0)
      const totalInvested = updatedPortfolio.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0)
      const totalPnL = totalValue - totalInvested
      const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

      const bestPerformer = updatedPortfolio.reduce((best, item) => 
        !best || item.pnlPercentage > best.pnlPercentage ? item : best, null as PortfolioItem | null)
      
      const worstPerformer = updatedPortfolio.reduce((worst, item) => 
        !worst || item.pnlPercentage < worst.pnlPercentage ? item : worst, null as PortfolioItem | null)

      setPortfolio(updatedPortfolio)
      setStats({
        totalValue,
        totalInvested,
        totalPnL,
        totalPnLPercentage,
        bestPerformer,
        worstPerformer
      })

      // Save updated portfolio to Supabase and localStorage
      await savePortfolioToSupabase(updatedPortfolio)
      localStorage.setItem("crypto-portfolio", JSON.stringify(updatedPortfolio))
    } catch (error) {
      console.error("Error updating portfolio:", error)
    }
  }

  const addAsset = async () => {
    if (!newAsset.symbol || !newAsset.quantity || !newAsset.avgPrice) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      })
      return
    }

    const asset: PortfolioItem = {
      id: Date.now().toString(),
      symbol: newAsset.symbol.toUpperCase(),
      name: newAsset.symbol.toUpperCase(), // In real app, fetch from API
      quantity: parseFloat(newAsset.quantity),
      avgPrice: parseFloat(newAsset.avgPrice),
      currentPrice: parseFloat(newAsset.avgPrice), // Will be updated
      totalValue: parseFloat(newAsset.quantity) * parseFloat(newAsset.avgPrice),
      pnl: 0,
      pnlPercentage: 0
    }

    const updatedPortfolio = [...portfolio, asset]
    setPortfolio(updatedPortfolio)
    
    // Save to Supabase
    await saveAssetToSupabase(asset)
    localStorage.setItem("crypto-portfolio", JSON.stringify(updatedPortfolio))
    
    setNewAsset({ symbol: "", quantity: "", avgPrice: "" })
    updatePricesAndStats(updatedPortfolio)
    
    toast({
      title: "Sucesso",
      description: `${asset.symbol} adicionado ao portfolio`
    })
  }

  const removeAsset = async (id: string) => {
    try {
      // Remove from Supabase
      await supabase.from('portfolio').delete().eq('id', id)
    } catch (error) {
      console.error('Erro ao remover do Supabase:', error)
    }
    
    const updatedPortfolio = portfolio.filter(item => item.id !== id)
    setPortfolio(updatedPortfolio)
    localStorage.setItem("crypto-portfolio", JSON.stringify(updatedPortfolio))
    updatePricesAndStats(updatedPortfolio)
    
    toast({
      title: "Removido",
      description: "Asset removido do portfolio"
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const saveAssetToSupabase = async (asset: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .insert({
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          quantity: asset.quantity,
          avg_price: asset.avgPrice,
          current_price: asset.currentPrice,
          total_value: asset.totalValue,
          pnl: asset.pnl,
          pnl_percentage: asset.pnlPercentage
        })

      if (error) {
        console.error('Erro ao salvar no Supabase:', error)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }
  }

  const savePortfolioToSupabase = async (portfolioData: PortfolioItem[]) => {
    try {
      // Update existing records
      for (const item of portfolioData) {
        const { error } = await supabase
          .from('portfolio')
          .upsert({
            id: item.id,
            symbol: item.symbol,
            name: item.name,
            quantity: item.quantity,
            avg_price: item.avgPrice,
            current_price: item.currentPrice,
            total_value: item.totalValue,
            pnl: item.pnl,
            pnl_percentage: item.pnlPercentage,
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Erro ao atualizar no Supabase:', error)
        }
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">P&L Total</p>
                <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(stats.totalPnL)}
                </p>
                <p className={`text-sm ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(stats.totalPnLPercentage)}
                </p>
              </div>
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Melhor Performance</p>
              {stats.bestPerformer ? (
                <>
                  <p className="text-xl font-bold">{stats.bestPerformer.symbol}</p>
                  <p className="text-sm text-green-500">
                    {formatPercentage(stats.bestPerformer.pnlPercentage)}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">-</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pior Performance</p>
              {stats.worstPerformer ? (
                <>
                  <p className="text-xl font-bold">{stats.worstPerformer.symbol}</p>
                  <p className="text-sm text-red-500">
                    {formatPercentage(stats.worstPerformer.pnlPercentage)}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">-</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="add">Adicionar Asset</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meu Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum asset no portfolio. Adicione alguns assets para começar.
                </p>
              ) : (
                <div className="space-y-4">
                  {portfolio.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold">{item.symbol}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} @ {formatCurrency(item.avgPrice)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.totalValue)}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={item.pnl >= 0 ? "default" : "destructive"}>
                              {formatPercentage(item.pnlPercentage)}
                            </Badge>
                            <span className={`text-sm ${item.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {formatCurrency(item.pnl)}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAsset(item.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Asset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="symbol">Símbolo</Label>
                  <Input
                    id="symbol"
                    placeholder="BTC, ETH, etc."
                    value={newAsset.symbol}
                    onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={newAsset.quantity}
                    onChange={(e) => setNewAsset({...newAsset, quantity: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="avgPrice">Preço Médio (USD)</Label>
                  <Input
                    id="avgPrice"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={newAsset.avgPrice}
                    onChange={(e) => setNewAsset({...newAsset, avgPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={addAsset} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar ao Portfolio
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}