import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import { AboutPage } from "./pages/public/AboutPage";
import { AiPolicyPage } from "./pages/public/AiPolicyPage";
import { ContactPage } from "./pages/public/ContactPage";
import { MethodologyPage } from "./pages/public/MethodologyPage";
import { PrivacyPage } from "./pages/public/PrivacyPage";
import { RiskDisclosurePage } from "./pages/public/RiskDisclosurePage";
import { TermsPage } from "./pages/public/TermsPage";
import { SeoHead } from "./components/public/SeoHead";

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <SeoHead />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/metodologia" element={<MethodologyPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/politica-de-ia" element={<AiPolicyPage />} />
        <Route path="/aviso-de-risco" element={<RiskDisclosurePage />} />
      </Routes>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
