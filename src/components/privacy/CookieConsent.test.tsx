import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { CookieConsent } from "./CookieConsent";

describe("CookieConsent", () => {
  afterEach(() => {
    localStorage.clear();
    document.head.querySelectorAll("script[data-ga4-measurement-id]").forEach((script) => script.remove());
  });

  it("persists an analytics refusal without loading GA4", () => {
    render(<MemoryRouter basename="/cripto-dashboard" initialEntries={["/cripto-dashboard/"]}><CookieConsent measurementId="G-TEST123" /></MemoryRouter>);

    fireEvent.click(screen.getByRole("button", { name: /recusar analíticos/i }));

    expect(localStorage.getItem("crypto-dashboard-analytics-consent")).toBe("denied");
    expect(document.head.querySelector("script[data-ga4-measurement-id]")).toBeNull();
  });

  it("keeps the privacy-policy link inside the application base path", () => {
    render(<MemoryRouter basename="/cripto-dashboard" initialEntries={["/cripto-dashboard/"]}><CookieConsent measurementId="G-TEST123" /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /política de privacidade/i })).toHaveAttribute(
      "href",
      "/cripto-dashboard/privacidade",
    );
  });
});
