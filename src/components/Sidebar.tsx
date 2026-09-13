import { useState, type ReactNode } from "react"
import { ChartBar as BarChart3, TrendingUp, TriangleAlert as AlertTriangle, Settings, ChartPie as PieChart, ChevronLeft, ChevronRight, Chrome as Home, FileText, Activity, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import adRockLogo from "@/assets/adrock-logo.png"
import { useTranslation } from "react-i18next"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  footerActions?: ReactNode
}

export function Sidebar({ activeTab, onTabChange, footerActions }: SidebarProps) {
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
        "min-h-screen bg-card/95 border-r border-border/80 transition-all duration-300 flex flex-col shadow-xl",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand header */}
      <header aria-label="Ad Rock" className={cn("border-b border-border/80 flex items-center", collapsed ? "justify-center p-3" : "justify-between gap-3 px-4 py-5")}>
        <img
          src={adRockLogo}
          alt="Ad Rock Digital MKT"
          className={cn("h-auto object-contain", collapsed ? "w-9" : "w-36")}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir navegação" : "Recolher navegação"}
          className={cn("h-8 w-8 text-muted-foreground hover:bg-accent hover:text-primary", collapsed && "absolute -right-10 top-4 border border-border bg-card")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </header>

      {/* Navigation Items */}
      <nav aria-label={t("nav.navigation")} className="flex-1 space-y-1 p-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground",
                isActive && "adrock-active",
                collapsed ? "px-2" : "px-3"
              )}
              aria-current={isActive ? "page" : undefined}
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

      {footerActions && (
        <div className="border-t border-border/80 p-3">
          {footerActions}
        </div>
      )}

      {/* About Footer */}
      {!collapsed && (
        <div className="border-t border-border/80 p-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold uppercase tracking-[0.14em] text-primary">Ad Rock Digital Mkt</p>
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
