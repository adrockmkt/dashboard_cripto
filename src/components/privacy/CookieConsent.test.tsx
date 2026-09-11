import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CookieConsent } from "./CookieConsent";

describe("CookieConsent", () => {
  afterEach(() => {
    localStorage.clear();
    document.head.querySelectorAll("script[data-ga4-measurement-id]").forEach((script) => script.remove());
  });

  it("persists an analytics refusal without loading GA4", () => {
    render(<CookieConsent measurementId="G-TEST123" />);

    fireEvent.click(screen.getByRole("button", { name: /recusar analíticos/i }));

    expect(localStorage.getItem("crypto-dashboard-analytics-consent")).toBe("denied");
    expect(document.head.querySelector("script[data-ga4-measurement-id]")).toBeNull();
  });
});
