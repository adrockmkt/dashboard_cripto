
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { CryptoNewsFeed } from "@/components/CryptoNewsFeed";
import MarketStats from "@/components/MarketStats";
import CryptoList from "@/components/CryptoList";
import { CustomAlertsPanel } from "@/components/CustomAlertsPanel";
import { NotificationCenter } from "@/components/NotificationCenter";
import AdvancedCharts from "@/components/AdvancedCharts";
import AlertsPanel from "@/components/AlertsPanel";
import PortfolioCard from "@/components/PortfolioCard";
import { PortfolioManager } from "@/components/PortfolioManager";
import DailyReport from "@/components/DailyReport";
import CryptoTable from "@/components/CryptoTable";
import CryptoChart from "@/components/CryptoChart";
import { AdvancedTechnicalIndicators } from "@/components/AdvancedTechnicalIndicators";
import { useCryptoAnalysis } from "@/hooks/useCryptoAnalysis";
import { Menu } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    cryptoList, 
    fearGreed, 
    dominance, 
    technicalIndicators, 
    isLoading, 
    error, 
    refreshData 
  } = useCryptoAnalysis();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FavoritesPanel />
              <CryptoNewsFeed />
            </div>
            
            <MarketStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CryptoList />
              <AlertsPanel technicalIndicators={technicalIndicators} />
            </div>
            
            <PortfolioCard />
          </div>
        );

      case "portfolio":
        return (
          <div className="space-y-6">
            <PortfolioManager />
          </div>
        );

      case "charts":
        return (
          <div className="space-y-6">
            {/* Bitcoin Chart - Full Width */}
            <Card className="glass-card">
              <CardContent className="p-0">
                <CryptoChart />
              </CardContent>
            </Card>
            
            {/* Advanced Charts - Pie Charts and Other Visuals */}
            <AdvancedCharts />
            
            {/* Technical Indicators Grid - Below Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {technicalIndicators && (
                <>
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">RSI (14)</h3>
                      <div className="text-2xl font-bold">{technicalIndicators.rsi.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">
                        {technicalIndicators.rsi > 70 ? "Sobrecomprado" : 
                         technicalIndicators.rsi < 30 ? "Sobrevendido" : "Neutro"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">Momentum (10)</h3>
                      <div className={`text-2xl font-bold ${technicalIndicators.momentum >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {technicalIndicators.momentum >= 0 ? '+' : ''}{technicalIndicators.momentum.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.abs(technicalIndicators.momentum) > 5 ? "Forte" : "Fraco"}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">Bandas de Bollinger</h3>
                      <div className="space-y-1">
                        <div className="text-sm">Superior: <span className="font-mono">${technicalIndicators.bollingerUpper.toLocaleString()}</span></div>
                        <div className="text-sm">Inferior: <span className="font-mono">${technicalIndicators.bollingerLower.toLocaleString()}</span></div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Volatilidade: {((technicalIndicators.bollingerUpper - technicalIndicators.bollingerLower) / technicalIndicators.bollingerUpper * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">Médias Móveis</h3>
                      <div className="space-y-1">
                        <div className="text-sm">SMA 50: <span className="font-mono">${technicalIndicators.sma50.toLocaleString()}</span></div>
                        <div className="text-sm">SMA 200: <span className="font-mono">${technicalIndicators.sma200.toLocaleString()}</span></div>
                      </div>
                      <div className={`text-sm font-semibold mt-2 ${technicalIndicators.sma50 > technicalIndicators.sma200 ? 'text-green-500' : 'text-red-500'}`}>
                        {technicalIndicators.sma50 > technicalIndicators.sma200 ? "Tendência Bullish" : "Tendência Bearish"}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            
            {/* Additional Technical Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
              <CustomAlertsPanel />
            </div>
          </div>
        );

      case "report":
        return (
          <div className="space-y-6">
            <DailyReport />
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomAlertsPanel />
              <AlertsPanel technicalIndicators={technicalIndicators} />
            </div>
          </div>
        );

      case "legacy":
        return (
          <div className="space-y-6">
            <MarketStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CryptoList />
              <AlertsPanel technicalIndicators={technicalIndicators} />
            </div>

            <PortfolioCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CryptoChart />
              <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
            </div>

            <CryptoTable />
          </div>
        );

      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar activeTab={activeTab} onTabChange={(tab) => {
              setActiveTab(tab);
              setMobileMenuOpen(false);
            }} />
          </SheetContent>
        </Sheet>
        
        <h1 className="font-bold text-lg">CryptoTracker Pro</h1>
        
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <ThemeToggle />
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Desktop Header with Theme Toggle */}
          <div className="hidden lg:flex justify-between items-center p-4 border-b border-border bg-card">
            <h1 className="font-bold text-xl">CryptoTracker Pro - {activeTab === "dashboard" ? "Dashboard" : 
              activeTab === "portfolio" ? "Portfolio" : 
              activeTab === "charts" ? "Gráficos" : 
              activeTab === "report" ? "Relatório" : 
              activeTab === "alerts" ? "Alertas" : "Visão Clássica"}</h1>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <ThemeToggle />
            </div>
          </div>
          
          <div className="p-4">
            {renderContent()}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
