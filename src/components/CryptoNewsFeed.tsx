import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, RefreshCw, Clock } from "lucide-react"
import { fetchCryptoNews } from "@/services/newsService"
import type { CryptoNewsItem, DataSource } from "@/services/types"
import { useTranslation } from "react-i18next"

export function CryptoNewsFeed() {
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState<CryptoNewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [source, setSource] = useState<DataSource>("fallback")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setIsLoading(true)
    const result = await fetchCryptoNews(10)
    setNews(result.data || [])
    setSource(result.source)
    setError(result.error || null)
    setIsLoading(false)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 60) {
      return i18n.resolvedLanguage === "en"
        ? `${minutes}m ago`
        : i18n.resolvedLanguage === "es"
          ? `hace ${minutes}m`
          : `${minutes}m atrás`
    } else if (hours < 24) {
      return i18n.resolvedLanguage === "en"
        ? `${hours}h ago`
        : i18n.resolvedLanguage === "es"
          ? `hace ${hours}h`
          : `${hours}h atrás`
    } else {
      return date.toLocaleDateString(
        i18n.resolvedLanguage === "en" ? "en-US" : i18n.resolvedLanguage === "es" ? "es-ES" : "pt-BR"
      )
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
      case 'market': return t("cards.marketCategory")
      case 'regulation': return t("cards.regulationCategory")
      case 'technology': return t("cards.technologyCategory")
      default: return t("cards.generalCategory")
    }
  }

  const getSourceLabel = (currentSource: DataSource) => {
    switch (currentSource) {
      case "real":
        return t("cards.sourceReal")
      case "simulated":
        return t("cards.sourceSimulated")
      default:
        return t("cards.sourceFallback")
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            {t("cards.cryptoNews")}
            <Badge variant={source === "real" ? "default" : "secondary"}>
              {getSourceLabel(source)}
            </Badge>
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
        ) : news.length === 0 ? (
          <div className="py-6 text-sm text-muted-foreground">
            <p>{t("cards.noNews")}</p>
            {error && <p className="mt-2 text-xs">{t("cards.details")}: {error}</p>}
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
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="sm" className="h-8">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {t("cards.readMore")}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
