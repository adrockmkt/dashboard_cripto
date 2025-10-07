import { useState } from "react"
import { ChartBar as BarChart3, TrendingUp, TriangleAlert as AlertTriangle, Settings, ChartPie as PieChart, ChevronLeft, ChevronRight, Chrome as Home, FileText, Activity, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import adRockLogo from "@/assets/adrock-logo.png"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "trading", label: "Trading Pro", icon: BarChart3 },
  { id: "onchain", label: "On-Chain", icon: Activity },
  { id: "models", label: "Modelos", icon: TrendingUp },
  { id: "portfolio", label: "Portfolio", icon: PieChart },
  { id: "charts", label: "Gráficos", icon: BarChart3 },
  { id: "report", label: "Relatório", icon: FileText },
  { id: "alerts", label: "Alertas", icon: AlertTriangle },
  { id: "legacy", label: "Clássica", icon: TrendingUp },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

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
          <h2 className="font-semibold text-sm">Navigation</h2>
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