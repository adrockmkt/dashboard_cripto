import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AboutPage } from "./pages/public/AboutPage";
import { AiPolicyPage } from "./pages/public/AiPolicyPage";
import { ContactPage } from "./pages/public/ContactPage";
import { MethodologyPage } from "./pages/public/MethodologyPage";
import { PrivacyPage } from "./pages/public/PrivacyPage";
import { RiskDisclosurePage } from "./pages/public/RiskDisclosurePage";
import { TermsPage } from "./pages/public/TermsPage";
import { SeoHead } from "./components/public/SeoHead";
import { BitcoinTodayPage } from "./pages/public/BitcoinTodayPage";
import { EthereumTodayPage } from "./pages/public/EthereumTodayPage";
import { FearGreedPage } from "./pages/public/FearGreedPage";
import { DcaGuidePage } from "./pages/public/DcaGuidePage";
import { GlossaryIndexPage } from "./pages/public/GlossaryIndexPage";

const Index = lazy(() => import("./pages/Index"));

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <SeoHead />
      <Routes>
        <Route path="/" element={<Suspense fallback={<main className="min-h-screen bg-background" aria-busy="true" />}><Index /></Suspense>} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/metodologia" element={<MethodologyPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/politica-de-ia" element={<AiPolicyPage />} />
        <Route path="/aviso-de-risco" element={<RiskDisclosurePage />} />
        <Route path="/bitcoin-hoje" element={<BitcoinTodayPage />} />
        <Route path="/ethereum-hoje" element={<EthereumTodayPage />} />
        <Route path="/fear-greed-cripto" element={<FearGreedPage />} />
        <Route path="/guia-dca-cripto" element={<DcaGuidePage />} />
        <Route path="/glossario-cripto" element={<GlossaryIndexPage />} />
      </Routes>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
