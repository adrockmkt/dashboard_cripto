import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./index.css";
import "./i18n/config";

// Configuração otimizada do QueryClient para máxima performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos - dados ficam "frescos"
      gcTime: 1000 * 60 * 30, // 30 minutos - cache mantido na memória
      refetchOnWindowFocus: false, // Não refetch ao focar na janela
      refetchOnMount: false, // Não refetch ao montar componente se tiver cache
      refetchOnReconnect: true, // Refetch apenas ao reconectar
      retry: 1, // Apenas 1 retry em caso de erro
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="crypto-dashboard-theme">
        <BrowserRouter basename="/cripto-dashboard">
          <App />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);