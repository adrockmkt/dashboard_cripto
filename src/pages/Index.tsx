import { useState, lazy, Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlobalSearch } from "@/components/GlobalSearch";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { OnboardingTour } from "@/components/OnboardingTour";
import { LanguageSelector } from "@/components/LanguageSelector";
import { DashboardSkeleton, ChartSkeleton, CardSkeleton } from "@/components/LoadingSkeleton";
import { useCryptoAnalysis } from "@/hooks/useCryptoAnalysis";
import { Menu, RefreshCw } from "lucide-react";

// Eager load critical components
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { CryptoNewsFeed } from "@/components/CryptoNewsFeed";
import MarketStats from "@/components/MarketStats";
import CryptoList from "@/components/CryptoList";
import { NotificationCenter } from "@/components/NotificationCenter";
import { CustomAlertsPanel } from "@/components/CustomAlertsPanel";
import { AdvancedTechnicalIndicators } from "@/components/AdvancedTechnicalIndicators";
import { CandlestickChart } from "@/components/advanced/CandlestickChart";
import { OnChainMetrics } from "@/components/advanced/OnChainMetrics";
import { DCASimulator } from "@/components/advanced/DCASimulator";
import { StockToFlowModel } from "@/components/advanced/StockToFlowModel";
import { AdvancedAlertsSystem } from "@/components/advanced/AdvancedAlertsSystem";

// Lazy load heavy components
const AdvancedCharts = lazy(() => import("@/components/AdvancedCharts"));
const AlertsPanel = lazy(() => import("@/components/AlertsPanel"));
const PortfolioCard = lazy(() => import("@/components/PortfolioCard"));
const DailyReport = lazy(() => import("@/components/DailyReport"));
const CryptoTable = lazy(() => import("@/components/CryptoTable"));
const CryptoChart = lazy(() => import("@/components/CryptoChart"));
const PortfolioManager = lazy(() => import("@/components/PortfolioManager").then(m => ({ default: m.PortfolioManager })));

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
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <FavoritesPanel />
              <CryptoNewsFeed />
            </div>
            
            <MarketStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <CryptoList />
              <Suspense fallback={<CardSkeleton />}>
                <AlertsPanel technicalIndicators={technicalIndicators} />
              </Suspense>
            </div>
            
            <Suspense fallback={<CardSkeleton />}>
              <PortfolioCard />
            </Suspense>
          </div>
        );

      case "trading":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <CandlestickChart />
          </div>
        );

      case "onchain":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <OnChainMetrics />
          </div>
        );

      case "models":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold mb-4">📊 Modelos Disponíveis</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm md:text-base"
                      onClick={() => setActiveTab('dca')}
                    >
                      🔄 Simulador DCA
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm md:text-base"
                      onClick={() => setActiveTab('s2f')}
                    >
                      📈 Modelo Stock-to-Flow
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold mb-4">ℹ️ Sobre os Modelos</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>DCA:</strong> Simule estratégias de investimento periódico</p>
                    <p><strong>S2F:</strong> Modelo de escassez baseado em oferta/demanda</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "dca":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <DCASimulator />
          </div>
        );

      case "s2f":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <StockToFlowModel />
          </div>
        );

      case "portfolio":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <Suspense fallback={<CardSkeleton />}>
              <PortfolioManager />
            </Suspense>
          </div>
        );

      case "charts":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            {/* Bitcoin Chart - Full Width */}
            <Card className="glass-card">
              <CardContent className="p-0">
                <Suspense fallback={<ChartSkeleton />}>
                  <CryptoChart />
                </Suspense>
              </CardContent>
            </Card>
            
            {/* Advanced Charts - Pie Charts and Other Visuals */}
            <Suspense fallback={<ChartSkeleton />}>
              <AdvancedCharts />
            </Suspense>
            
            {/* Technical Indicators Grid - Below Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
              <Suspense fallback={<CardSkeleton />}>
                <CustomAlertsPanel />
              </Suspense>
            </div>
          </div>
        );

      case "report":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <Suspense fallback={<CardSkeleton />}>
              <DailyReport />
            </Suspense>
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <AdvancedAlertsSystem />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Suspense fallback={<CardSkeleton />}>
                <CustomAlertsPanel />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                <AlertsPanel technicalIndicators={technicalIndicators} />
              </Suspense>
            </div>
          </div>
        );

      case "legacy":
        return (
          <div className="space-y-4 md:space-y-6 pb-20 md:pb-4">
            <MarketStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <CryptoList />
              <Suspense fallback={<CardSkeleton />}>
                <AlertsPanel technicalIndicators={technicalIndicators} />
              </Suspense>
            </div>

            <Suspense fallback={<CardSkeleton />}>
              <PortfolioCard />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Suspense fallback={<ChartSkeleton />}>
                <CryptoChart />
              </Suspense>
              <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
            </div>

            <Suspense fallback={<CardSkeleton />}>
              <CryptoTable />
            </Suspense>
          </div>
        );

      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
        <div className="p-3 md:p-4 flex items-center justify-between gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0">
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
          
          <div className="flex-1 min-w-0 px-2">
            <GlobalSearch onNavigate={(tab) => {
              setActiveTab(tab);
            }} />
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {!isLoading && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={refreshData}
                className="h-9 w-9"
                aria-label="Atualizar dados"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <NotificationCenter />
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Desktop Header with Search */}
          <div className="hidden lg:flex justify-between items-center p-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-xl whitespace-nowrap">CryptoTracker Pro - {activeTab === "dashboard" ? "Dashboard" : 
                activeTab === "trading" ? "Trading Pro" :
                activeTab === "onchain" ? "Métricas On-Chain" :
                activeTab === "models" ? "Modelos Preditivos" :
                activeTab === "dca" ? "Simulador DCA" :
                activeTab === "s2f" ? "Stock-to-Flow" :
                activeTab === "portfolio" ? "Portfolio" : 
                activeTab === "charts" ? "Gráficos" : 
                activeTab === "report" ? "Relatório" : 
                activeTab === "alerts" ? "Alertas" : "Visão Clássica"}</h1>
              <GlobalSearch onNavigate={(tab) => setActiveTab(tab)} />
            </div>
            <div className="flex items-center gap-2">
              {!isLoading && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={refreshData}
                  title="Atualizar dados"
                  aria-label="Atualizar dados"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              <NotificationCenter />
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
          
          <div className="p-3 md:p-4 lg:p-6">
            {isLoading && <DashboardSkeleton />}
            {!isLoading && renderContent()}
            {error && (
              <Card className="border-destructive">
                <CardContent className="p-6 text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={refreshData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar novamente
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Onboarding Tour */}
      <OnboardingTour />
      
      <Toaster />
    </div>
  );
};

export default Index;