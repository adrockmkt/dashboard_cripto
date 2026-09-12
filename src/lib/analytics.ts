export type AnalyticsConsent = "granted" | "denied";

export type AnalyticsEventName =
  | "view_content"
  | "select_content"
  | "search"
  | "tutorial_begin"
  | "tutorial_complete"
  | "dashboard_tab_view"
  | "chart_timeframe_change"
  | "export_data"
  | "create_alert"
  | "consent_update";

type AnalyticsEventParams = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const EVENT_PARAMETERS: Record<AnalyticsEventName, string[]> = {
  view_content: ["content_type", "content_slug"],
  select_content: ["content_type", "content_slug", "destination"],
  search: ["search_scope"],
  tutorial_begin: ["tutorial_name"],
  tutorial_complete: ["tutorial_name"],
  dashboard_tab_view: ["tab_name"],
  chart_timeframe_change: ["timeframe"],
  export_data: ["export_format", "export_scope"],
  create_alert: ["alert_type"],
  consent_update: ["analytics_consent"],
};

let measurementId = "";
let consent: AnalyticsConsent = "denied";
let isLoaded = false;
const isDebugMode = import.meta.env.VITE_GA_DEBUG_MODE === "true";

function ensureGtagQueue() {
  window.dataLayer = window.dataLayer ?? [];

  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      // The gtag loader consumes the native Arguments object queued by its standard snippet.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
}

function gtag(...args: unknown[]) {
  ensureGtagQueue();
  window.gtag?.(...args);
}

function loadGoogleTag() {
  if (isLoaded || !measurementId || typeof document === "undefined") {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.ga4MeasurementId = measurementId;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: true,
    ...(isDebugMode ? { debug_mode: true } : {}),
  });
  isLoaded = true;
}

function sanitizeParams(name: AnalyticsEventName, params: AnalyticsEventParams) {
  const allowed = EVENT_PARAMETERS[name];
  const publicRoutes = [
    "/sobre",
    "/metodologia",
    "/contato",
    "/privacidade",
    "/termos",
    "/politica-de-ia",
    "/aviso-de-risco",
  ];
  const cleanParams: Record<string, string> = {
    app_surface: publicRoutes.some((route) => window.location.pathname.endsWith(route)) ? "public" : "dashboard",
    page_path: window.location.pathname,
  };

  for (const key of allowed) {
    if (params[key]) {
      cleanParams[key] = params[key];
    }
  }

  return cleanParams;
}

export function initializeAnalytics(id: string) {
  measurementId = id.trim();
  consent = "denied";
  isLoaded = false;
}

export function updateAnalyticsConsent(nextConsent: AnalyticsConsent) {
  consent = nextConsent;

  if (consent === "granted") {
    loadGoogleTag();
    gtag("consent", "update", { analytics_storage: "granted" });
  }
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams) {
  if (consent !== "granted" || !measurementId) {
    return false;
  }

  gtag("event", name, sanitizeParams(name, params));
  return true;
}
