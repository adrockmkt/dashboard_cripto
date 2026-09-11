import { useEffect, useState } from "react";
import { initializeAnalytics, trackEvent, updateAnalyticsConsent, type AnalyticsConsent } from "@/lib/analytics";

const CONSENT_STORAGE_KEY = "crypto-dashboard-analytics-consent";

interface CookieConsentProps {
  measurementId?: string;
}

export function CookieConsent({ measurementId }: CookieConsentProps) {
  const [decision, setDecision] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent === "granted" || storedConsent === "denied") {
      setDecision(storedConsent);
      if (storedConsent === "granted" && measurementId) {
        initializeAnalytics(measurementId);
        updateAnalyticsConsent("granted");
      }
    }
  }, [measurementId]);

  const setConsent = (nextConsent: AnalyticsConsent) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextConsent);
    setDecision(nextConsent);

    if (nextConsent === "granted" && measurementId) {
      initializeAnalytics(measurementId);
      updateAnalyticsConsent("granted");
      trackEvent("consent_update", { analytics_consent: "granted" });
    }
  };

  if (!measurementId) {
    return null;
  }

  if (decision) {
    return (
      <button
        type="button"
        className="fixed bottom-3 left-3 z-50 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-md"
        onClick={() => setDecision(null)}
      >
        Preferências de cookies
      </button>
    );
  }

  return (
    <section
      aria-label="Preferências de cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-lg border border-border bg-card p-4 shadow-xl"
    >
      <p className="font-semibold text-card-foreground">Cookies analíticos</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Com sua autorização, usamos o Google Analytics para entender o uso agregado da ferramenta. Você pode
        recusar sem perder acesso ao dashboard. Saiba mais na{" "}
        <a className="underline underline-offset-4" href="/privacidade">Política de Privacidade</a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
          onClick={() => setConsent("denied")}
        >
          Recusar analíticos
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => setConsent("granted")}
        >
          Aceitar analíticos
        </button>
      </div>
    </section>
  );
}
