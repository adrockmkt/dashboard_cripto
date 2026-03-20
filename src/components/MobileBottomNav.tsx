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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-col h-14 w-full gap-1",
                isActive && "text-primary"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
