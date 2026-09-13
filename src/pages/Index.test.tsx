import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Index from "./Index";

vi.mock("@/hooks/useCryptoAnalysis", () => ({
  useCryptoAnalysis: () => ({
    cryptoList: [],
    fearGreed: undefined,
    dominance: undefined,
    technicalIndicators: undefined,
    isLoading: false,
    error: null,
    refreshData: vi.fn(),
  }),
}));

vi.mock("@/components/FavoritesPanel", () => ({ FavoritesPanel: () => <div>Favoritos</div> }));
vi.mock("@/components/CryptoNewsFeed", () => ({ CryptoNewsFeed: () => <div>Notícias</div> }));
vi.mock("@/components/MarketStats", () => ({ default: () => <div>Estatísticas</div> }));
vi.mock("@/components/CryptoList", () => ({ default: () => <div>Mercados</div> }));
vi.mock("@/components/NotificationCenter", () => ({ NotificationCenter: () => <button aria-label="Notificações">Notificações</button> }));
vi.mock("@/components/CustomAlertsPanel", () => ({ CustomAlertsPanel: () => <div>Alertas personalizados</div> }));
vi.mock("@/components/AdvancedTechnicalIndicators", () => ({ AdvancedTechnicalIndicators: () => <div>Indicadores</div> }));
vi.mock("@/components/OnboardingTour", () => ({ OnboardingTour: () => null }));
vi.mock("@/components/GlobalSearch", () => ({ GlobalSearch: () => <input aria-label="Buscar" /> }));
vi.mock("@/components/LanguageSelector", () => ({ LanguageSelector: () => <button aria-label="Idioma">Idioma</button> }));
vi.mock("@/components/ThemeToggle", () => ({ ThemeToggle: () => <button aria-label="Tema">Tema</button> }));

describe("Index mobile navigation", () => {
  it("opens a named navigation dialog from the mobile menu", () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Abrir navegação" }));

    expect(screen.getByRole("dialog", { name: "Navegação" })).toBeVisible();
    expect(screen.getByText("Acesse as ferramentas e preferências do dashboard.")).toBeVisible();
  });
});
