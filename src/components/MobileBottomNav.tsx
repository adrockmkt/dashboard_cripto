import { Chrome as Home, TrendingUp, Activity, PieChart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const { t } = useTranslation();

  const navItems = [
    { id: "dashboard", label: t("nav.home"), icon: Home },
    { id: "trading", label: t("nav.trading"), icon: TrendingUp },
    { id: "onchain", label: t("nav.onchain"), icon: Activity },
    { id: "portfolio", label: t("nav.portfolio"), icon: PieChart },
    { id: "alerts", label: t("nav.alerts"), icon: Bell },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-card/95 shadow-[0_-12px_32px_rgb(0_0_0_/_0.24)] backdrop-blur md:hidden safe-area-bottom">
      <div className="flex h-[4.5rem] items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-col h-14 w-full gap-1 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground",
                isActive && "bg-primary/15 text-primary"
              )}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
