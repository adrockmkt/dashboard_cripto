
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import CryptoList from "@/components/CryptoList";
import PortfolioCard from "@/components/PortfolioCard";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import CryptoTable from "@/components/CryptoTable";
import { AdvancedTechnicalIndicators } from "@/components/AdvancedTechnicalIndicators";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { AlertsPanel } from "@/components/AlertsPanel";
import { NotificationCenter } from "@/components/NotificationCenter";
import { PortfolioManager } from "@/components/PortfolioManager";
import { DailyReport } from "@/components/DailyReport";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { CustomAlertsPanel } from "@/components/CustomAlertsPanel";
import { CryptoNewsFeed } from "@/components/CryptoNewsFeed";
import { useCryptoAnalysis } from "@/hooks/useCryptoAnalysis";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard Crypto</h1>
              <NotificationCenter />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FavoritesPanel />
              <CryptoNewsFeed />
            </div>
            
            <MarketStats 
              cryptoList={cryptoList} 
              fearGreed={fearGreed} 
              dominance={dominance} 
            />
            
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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Gerenciamento de Portfolio</h1>
              <NotificationCenter />
            </div>
            <PortfolioManager />
          </div>
        );

      case "charts":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Análise Técnica Avançada</h1>
              <NotificationCenter />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdvancedCharts />
              </div>
              <div>
                <CustomAlertsPanel />
              </div>
            </div>
            
            <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
          </div>
        );

      case "report":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Relatório Diário</h1>
              <NotificationCenter />
            </div>
            <DailyReport 
              cryptoList={cryptoList}
              fearGreed={fearGreed}
              technicalIndicators={technicalIndicators}
            />
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Central de Alertas</h1>
              <NotificationCenter />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomAlertsPanel />
              <AlertsPanel technicalIndicators={technicalIndicators} />
            </div>
          </div>
        );

      case "legacy":
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] text-[#E6E4DD]">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8989DE] to-[#6B73FF] bg-clip-text text-transparent">
                  CryptoTracker Pro - Visão Clássica
                </h1>
                <NotificationCenter />
              </div>

              <MarketStats 
                cryptoList={cryptoList} 
                fearGreed={fearGreed} 
                dominance={dominance} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CryptoList />
                <AlertsPanel technicalIndicators={technicalIndicators} />
              </div>

              <PortfolioCard />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <CryptoChart />
                <AdvancedTechnicalIndicators technicalIndicators={technicalIndicators} />
              </div>

              <CryptoTable cryptoList={cryptoList} />
            </div>
          </div>
        );

      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
