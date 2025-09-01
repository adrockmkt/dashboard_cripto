
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, RefreshCw, Clock } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: Date
  category: 'bitcoin' | 'ethereum' | 'market' | 'regulation' | 'technology'
}

export function CryptoNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulated news data - in a real app, this would come from a news API
  const generateMockNews = (): NewsItem[] => {
    const mockNews = [
      {
        id: '1',
        title: 'Bitcoin atinge nova resistência em $45,000',
        description: 'O preço do Bitcoin encontrou resistência técnica importante na faixa dos $45,000, com volume de negociação aumentando significativamente.',
        url: '#',
        source: 'CryptoNews',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        category: 'bitcoin' as const
      },
      {
        id: '2',
        title: 'Ethereum 2.0: Próximas atualizações prometem maior eficiência',
        description: 'A rede Ethereum continua sua evolução com melhorias significativas em escalabilidade e redução de taxas de transação.',
        url: '#',
        source: 'EthereumDaily',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        category: 'ethereum' as const
      },
      {
        id: '3',
        title: 'Regulamentação cripto: Novidades do mercado brasileiro',
        description: 'Banco Central anuncia novas diretrizes para exchanges de criptomoedas no Brasil, visando maior segurança para investidores.',
        url: '#',
        source: 'CriptoFacil',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        category: 'regulation' as const
      },
      {
        id: '4',
        title: 'Análise: Mercado cripto mostra sinais de recuperação',
        description: 'Indicadores técnicos sugerem possível reversão de tendência, com aumento do interesse institucional.',
        url: '#',
        source: 'MarketWatch',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        category: 'market' as const
      },
      {
        id: '5',
        title: 'Inovação em DeFi: Novos protocolos ganham destaque',
        description: 'Protocolos de finanças descentralizadas apresentam soluções inovadoras para yield farming e staking.',
        url: '#',
        source: 'DeFiPulse',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        category: 'technology' as const
      }
    ]
    return mockNews
  }

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setIsLoading(true)
    // Simulate API delay
    setTimeout(() => {
      setNews(generateMockNews())
      setIsLoading(false)
    }, 1000)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) {
      return `${minutes}m atrás`
    } else if (hours < 24) {
      return `${hours}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bitcoin': return 'bg-orange-500'
      case 'ethereum': return 'bg-blue-500'
      case 'market': return 'bg-green-500'
      case 'regulation': return 'bg-red-500'
      case 'technology': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'bitcoin': return 'Bitcoin'
      case 'ethereum': return 'Ethereum'
      case 'market': return 'Mercado'
      case 'regulation': return 'Regulação'
      case 'technology': return 'Tecnologia'
      default: return 'Geral'
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Notícias Crypto
            {news.length > 0 && (
              <Badge variant="secondary">{news.length}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadNews}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {news.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`${getCategoryColor(item.category)} text-white text-xs`}>
                    {getCategoryLabel(item.category)}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.publishedAt)}
                  </div>
                </div>
                
                <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                  {item.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.source}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ler mais
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
