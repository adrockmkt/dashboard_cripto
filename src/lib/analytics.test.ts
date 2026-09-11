import { afterEach, describe, expect, it, vi } from "vitest";
import {
  initializeAnalytics,
  trackEvent,
  updateAnalyticsConsent,
} from "./analytics";

describe("analytics", () => {
  afterEach(() => {
    document.head.querySelectorAll("script[data-ga4-measurement-id]").forEach((script) => script.remove());
    delete (window as Window & { gtag?: unknown }).gtag;
  });

  it("does not load GA4 or send events before analytics consent", () => {
    const gtag = vi.fn();
    (window as Window & { gtag?: typeof gtag }).gtag = gtag;

    initializeAnalytics("G-TEST123");

    expect(trackEvent("dashboard_tab_view", { tab_name: "trading" })).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
    expect(document.head.querySelector("script[data-ga4-measurement-id]")).toBeNull();
  });

  it("loads GA4 and sends only approved event parameters after consent", () => {
    const gtag = vi.fn();
    (window as Window & { gtag?: typeof gtag }).gtag = gtag;

    initializeAnalytics("G-TEST123");
    updateAnalyticsConsent("granted");

    expect(trackEvent("dashboard_tab_view", { tab_name: "trading" })).toBe(true);
    expect(document.head.querySelector("script[data-ga4-measurement-id]")).not.toBeNull();
    expect(gtag).toHaveBeenCalledWith("event", "dashboard_tab_view", {
      app_surface: "dashboard",
      page_path: "/",
      tab_name: "trading",
    });
  });

  it("creates the standard gtag queue when the Google script has not loaded yet", () => {
    delete (window as Window & { gtag?: unknown }).gtag;
    window.dataLayer = [];

    initializeAnalytics("G-TEST123");
    updateAnalyticsConsent("granted");

    expect(window.gtag).toEqual(expect.any(Function));
    expect(window.dataLayer).toHaveLength(3);
  });
});
