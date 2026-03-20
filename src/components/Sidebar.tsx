import { useState } from "react"
import { ChartBar as BarChart3, TrendingUp, TriangleAlert as AlertTriangle, Settings, ChartPie as PieChart, ChevronLeft, ChevronRight, Chrome as Home, FileText, Activity, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import adRockLogo from "@/assets/adrock-logo.png"
import { useTranslation } from "react-i18next"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation()

  const sidebarItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: Home },
    { id: "trading", label: t("nav.trading"), icon: BarChart3 },
    { id: "onchain", label: t("nav.onchain"), icon: Activity },
    { id: "models", label: t("nav.models"), icon: TrendingUp },
    { id: "portfolio", label: t("nav.portfolio"), icon: PieChart },
    { id: "charts", label: t("nav.charts"), icon: BarChart3 },
    { id: "report", label: t("nav.report"), icon: FileText },
    { id: "alerts", label: t("nav.alerts"), icon: AlertTriangle },
    { id: "legacy", label: t("nav.legacy"), icon: TrendingUp },
  ]

  return (
    <div 
      className={cn(
        "h-full bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <h2 className="font-semibold text-sm">{t("nav.navigation")}</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Logo */}
      <div className="p-4 border-t border-border flex items-center justify-center">
        {!collapsed ? (
          <img 
            src={adRockLogo} 
            alt="Ad Rock Digital MKT" 
            className="w-32 h-auto object-contain"
          />
        ) : (
          <img 
            src={adRockLogo} 
            alt="Ad Rock Digital MKT" 
            className="w-10 h-auto object-contain"
          />
        )}
      </div>

      {/* About Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">About</p>
          <p>Um produto Ad Rock Digital Mkt por Rafael Marques Lins</p>
          <div className="space-y-1">
            <a 
              href="https://adrock.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              adrock.com.br
            </a>
            <a 
              href="mailto:contato@adrock.com.br"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              contato@adrock.com.br
            </a>
            <a 
              href="https://github.com/adrockmkt/dashboard_cripto" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              GitHub
            </a>
            <a 
              href="https://wa.me/5541991255859" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              WhatsApp: +55 41 99125-5859
            </a>
          </div>
        </div>
      )}

    </div>
  )
}
