import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useCryptoAnalysis, useCryptoAlerts } from "@/hooks/useCryptoAnalysis";
import { RefreshCw, TrendingUp } from "lucide-react";

const Index = () => {
  const { technicalIndicators, isLoading, refreshData, lastUpdate } = useCryptoAnalysis();
  const { alerts } = useCryptoAlerts(technicalIndicators);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                Análise Cripto Avançada
              </h1>
              <p className="text-muted-foreground">
                Relatórios técnicos e fundamentalistas do mercado de criptomoedas
              </p>
              {lastUpdate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Última atualização: {lastUpdate.toLocaleString('pt-BR')}
                </p>
              )}
            </div>
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
          
          {/* Alertas rápidos */}
          {alerts.length > 0 && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm font-medium">🚨 {alerts.length} alerta(s) ativo(s)</p>
              <p className="text-xs text-muted-foreground">
                {alerts[alerts.length - 1]?.message}
              </p>
            </div>
          )}
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="report">Relatório Diário</TabsTrigger>
            <TabsTrigger value="charts">Gráficos Avançados</TabsTrigger>
            <TabsTrigger value="alerts">Alertas & Config</TabsTrigger>
            <TabsTrigger value="legacy">Visão Clássica</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MarketStats />
            <DailyReport />
            <CryptoTable />
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <DailyReport />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <AdvancedCharts />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsPanel technicalIndicators={technicalIndicators} />
              <ApiKeyConfig />
            </div>
          </TabsContent>

          <TabsContent value="legacy" className="space-y-6">
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
          </TabsContent>
        </Tabs>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;