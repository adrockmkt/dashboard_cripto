import { useState } from "react";
import { Button } from "@/components/ui/button";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import CryptoTable from "@/components/CryptoTable";
import DailyReport from "@/components/DailyReport";
import AdvancedCharts from "@/components/AdvancedCharts";
import AlertsPanel from "@/components/AlertsPanel";
import ApiKeyConfig from "@/components/ApiKeyConfig";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PortfolioManager } from "@/components/PortfolioManager";
import { AdvancedTechnicalIndicators } from "@/components/AdvancedTechnicalIndicators";
import { useCryptoAnalysis, useCryptoAlerts } from "@/hooks/useCryptoAnalysis";
import { RefreshCw, TrendingUp, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const { technicalIndicators, isLoading, refreshData, lastUpdate } = useCryptoAnalysis();
  const { alerts } = useCryptoAlerts(technicalIndicators);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <MarketStats />
            <DailyReport />
            <CryptoTable />
          </div>
        );
      case "portfolio":
        return <PortfolioManager />;
      case "charts":
        return (
          <div className="space-y-6">
            <AdvancedCharts />
            <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
          </div>
        );
      case "report":
        return <DailyReport />;
      case "alerts":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel technicalIndicators={technicalIndicators} />
            <ApiKeyConfig />
          </div>
        );
      case "legacy":
        return (
          <div className="space-y-6">
            <MarketStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CryptoChart />
              </div>
              <div>
                <PortfolioCard />
              </div>
            </div>
            <CryptoList />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="flex h-16 items-center px-4 gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2 flex-1">
              <img 
                src="./lovable-uploads/f9adaae1-4eb9-43b8-9d30-50c6204dd06b.png" 
                alt="Ad Rock Digital MKT Logo" 
                className="w-8 h-8 object-contain"
              />
              <TrendingUp className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold hidden sm:block">
                Análise Cripto Avançada
              </h1>
              <h1 className="text-lg font-bold sm:hidden">
                Cripto
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <NotificationCenter />
              <ThemeToggle />
              <Button 
                onClick={refreshData} 
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
          
          {/* Status bar */}
          <div className="px-4 py-2 bg-muted/50 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {lastUpdate ? `Última atualização: ${lastUpdate.toLocaleString('pt-BR')}` : 'Carregando...'}
              </span>
              {alerts.length > 0 && (
                <span className="text-orange-500 font-medium">
                  🚨 {alerts.length} alerta(s) ativo(s)
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
            <Footer />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Index;