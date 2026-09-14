import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdvancedAlertsSystem } from "./AdvancedAlertsSystem";

const setGlobalSettings = vi.fn();

vi.mock("@/hooks/useAdvancedAlerts", () => ({
  useAdvancedAlerts: () => ({
    alerts: [],
    activeAlerts: [],
    history: [],
    snapshot: null,
    loading: false,
    error: null,
    globalSettings: {
      soundEnabled: true,
      visualEnabled: true,
      emailEnabled: false,
      webhookEnabled: false,
      browserNotificationsEnabled: false,
    },
    setGlobalSettings,
    createAlert: vi.fn(),
    toggleAlert: vi.fn(),
    removeAlert: vi.fn(),
    dismissActiveAlert: vi.fn(),
    refreshSnapshot: vi.fn(),
  }),
}));

vi.mock("@/services/browserNotifications", () => ({
  getBrowserNotificationPermission: () => "unsupported",
  requestBrowserNotificationPermission: vi.fn(),
}));

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

describe("AdvancedAlertsSystem", () => {
  afterEach(() => vi.clearAllMocks());

  it("stacks its header actions on narrow screens and keeps both actions available", () => {
    render(<AdvancedAlertsSystem />);

    expect(screen.getByTestId("alerts-header-actions")).toHaveClass("flex-col", "sm:flex-row");
    expect(screen.getByRole("button", { name: /Atualizar/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /Novo alerta/i })).toBeVisible();
  });

  it("does not offer browser-side email or webhook delivery", () => {
    render(<AdvancedAlertsSystem />);

    expect(screen.getByText("Email")).toBeVisible();
    expect(screen.getAllByText("Indisponível")).toHaveLength(2);
    expect(screen.queryByLabelText(/Webhook URL/i)).not.toBeInTheDocument();
  });
});
