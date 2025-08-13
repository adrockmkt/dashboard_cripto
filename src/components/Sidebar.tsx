import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  PieChart,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
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

    </div>
  )
}