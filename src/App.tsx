import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
