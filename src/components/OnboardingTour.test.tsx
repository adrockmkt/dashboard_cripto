import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OnboardingTour } from "./OnboardingTour";

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

describe("OnboardingTour", () => {
  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("presents the first visit as a non-blocking introduction", () => {
    vi.useFakeTimers();
    render(<OnboardingTour />);

    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByRole("complementary", { name: "Introdução ao Cripto Dashboard" })).toBeVisible();
    expect(screen.getByRole("group", { name: "Etapa 1 de 6" })).toBeVisible();
    expect(screen.queryByTestId("onboarding-backdrop")).not.toBeInTheDocument();
  });
});
