import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AdvancedAlert,
  type AlertAction,
  type AlertEvaluationSnapshot,
  type AlertHistoryEntry,
  buildAlertMessage,
  buildAlertSnapshot,
  evaluateAlert,
} from "@/services/advancedAlertsEngine";
import { showBrowserNotification } from "@/services/browserNotifications";
import { enqueueAlertDelivery, finalizeAlertDelivery } from "@/services/alertDeliveryService";

interface GlobalAlertSettings {
  soundEnabled: boolean;
  visualEnabled: boolean;
  emailEnabled: boolean;
  webhookEnabled: boolean;
  browserNotificationsEnabled: boolean;
}

const ALERTS_STORAGE_KEY = "advanced-alerts";
const ALERTS_HISTORY_STORAGE_KEY = "advanced-alerts-history";
const ALERTS_SETTINGS_STORAGE_KEY = "advanced-alerts-settings";

const defaultGlobalSettings: GlobalAlertSettings = {
  soundEnabled: true,
  visualEnabled: true,
  emailEnabled: false,
  webhookEnabled: false,
  browserNotificationsEnabled: false,
};

const playAlertSound = () => {
  if (typeof window === "undefined") return;

  const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.05;

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
};

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const useAdvancedAlerts = () => {
  const [alerts, setAlerts] = useState<AdvancedAlert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [history, setHistory] = useState<AlertHistoryEntry[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalAlertSettings>(defaultGlobalSettings);
  const [snapshot, setSnapshot] = useState<AlertEvaluationSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const previousSnapshotRef = useRef<AlertEvaluationSnapshot | null>(null);

  useEffect(() => {
    setAlerts(loadJson<AdvancedAlert[]>(ALERTS_STORAGE_KEY, []));
    setHistory(loadJson<AlertHistoryEntry[]>(ALERTS_HISTORY_STORAGE_KEY, []));
    const persistedSettings = loadJson<Partial<GlobalAlertSettings>>(ALERTS_SETTINGS_STORAGE_KEY, {});
    setGlobalSettings({
      ...defaultGlobalSettings,
      ...persistedSettings,
    });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(ALERTS_HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(ALERTS_SETTINGS_STORAGE_KEY, JSON.stringify(globalSettings));
  }, [globalSettings, isHydrated]);

  const executeAction = useCallback(
    async (alert: AdvancedAlert, action: AlertAction, message: string, metricValues: Record<string, number | null>) => {
      const deliveryBase = {
        id: `${alert.id}-${action.type}-${Date.now()}`,
        alertId: alert.id,
        alertName: alert.name,
        channel: action.type === "visual" ? "visual" : action.type,
        status: "pending" as const,
        message,
        metricValues,
        createdAt: new Date().toISOString(),
      };

      await enqueueAlertDelivery(deliveryBase);

      switch (action.type) {
        case "sound":
          if (globalSettings.soundEnabled) {
            playAlertSound();
            await finalizeAlertDelivery({
              ...deliveryBase,
              status: "delivered",
              deliveredAt: new Date().toISOString(),
            });
          } else {
            await finalizeAlertDelivery({
              ...deliveryBase,
              status: "failed",
              deliveredAt: new Date().toISOString(),
              error: "Canal de som desativado",
            });
          }
          break;
        case "visual":
          if (globalSettings.visualEnabled) {
            setActiveAlerts((prev) => [
              {
                id: `${alert.id}-${Date.now()}`,
                alertId: alert.id,
                message,
                timestamp: new Date(),
                type: alert.type,
              },
              ...prev,
            ].slice(0, 10));

            window.dispatchEvent(
              new CustomEvent("add-notification", {
                detail: {
                  type: alert.type === "sentiment" ? "info" : "warning",
                  title: alert.name,
                  message,
                },
              })
            );

            await finalizeAlertDelivery({
              ...deliveryBase,
              status: "delivered",
              deliveredAt: new Date().toISOString(),
            });
          } else {
            await finalizeAlertDelivery({
              ...deliveryBase,
              status: "failed",
              deliveredAt: new Date().toISOString(),
              error: "Canal visual desativado",
            });
          }

          if (globalSettings.browserNotificationsEnabled) {
            const sent = await showBrowserNotification({
              title: alert.name,
              body: message,
              tag: alert.id,
              data: {
                alertId: alert.id,
              },
            });

            await finalizeAlertDelivery({
              ...deliveryBase,
              channel: "browser",
              status: sent ? "delivered" : "failed",
              deliveredAt: sent ? new Date().toISOString() : undefined,
              error: sent ? undefined : "Permissão ausente ou service worker indisponível",
            });
          }
          break;
        case "webhook":
          if (globalSettings.webhookEnabled && action.config?.url) {
            try {
              await fetch(action.config.url, {
                method: action.config.method || "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(action.config.headers || {}),
                },
                body: JSON.stringify({
                  alertId: alert.id,
                  alertName: alert.name,
                  type: alert.type,
                  message,
                  triggeredAt: new Date().toISOString(),
                  metricValues,
                }),
              });
              await finalizeAlertDelivery({
                ...deliveryBase,
                status: "delivered",
                deliveredAt: new Date().toISOString(),
              });
            } catch (webhookError) {
              console.error("Erro ao chamar webhook:", webhookError);
              await finalizeAlertDelivery({
                ...deliveryBase,
                status: "failed",
                deliveredAt: new Date().toISOString(),
                error: webhookError instanceof Error ? webhookError.message : "Falha no webhook",
              });
            }
          } else {
            await finalizeAlertDelivery({
              ...deliveryBase,
              status: "failed",
              deliveredAt: new Date().toISOString(),
              error: "Webhook desativado ou sem URL",
            });
          }
          break;
        case "email":
          await finalizeAlertDelivery({
            ...deliveryBase,
            status: globalSettings.emailEnabled ? "pending" : "failed",
            deliveredAt: new Date().toISOString(),
            error: globalSettings.emailEnabled ? "Entrega por email depende de backend dedicado" : "Email desativado",
          });
          break;
      }
    },
    [globalSettings]
  );

  const refreshSnapshot = useCallback(async () => {
    setLoading(true);
    try {
      const nextSnapshot = await buildAlertSnapshot();
      setSnapshot(nextSnapshot);
      setError(null);

      const previousSnapshot = previousSnapshotRef.current;

      for (const alert of alerts) {
        if (!alert.isActive) continue;

        const evaluation = evaluateAlert(alert, nextSnapshot, previousSnapshot);
        if (!evaluation.passed) {
          if (alert.triggered) {
            setAlerts((prev) =>
              prev.map((current) =>
                current.id === alert.id
                  ? { ...current, triggered: false }
                  : current
              )
            );
          }
          continue;
        }

        if (alert.triggered) {
          continue;
        }

        const triggeredAt = new Date().toISOString();
        const message = buildAlertMessage(alert, evaluation.metrics);

        setAlerts((prev) =>
          prev.map((current) =>
            current.id === alert.id
              ? { ...current, triggered: true, lastTriggered: triggeredAt }
              : current
          )
        );

        setHistory((prev) => [
          {
            id: `${alert.id}-${Date.now()}`,
            alertId: alert.id,
            alertName: alert.name,
            message,
            triggeredAt,
            metricValues: evaluation.metrics,
          },
          ...prev,
        ].slice(0, 50));

        for (const action of alert.actions) {
          await executeAction(alert, action, message, evaluation.metrics);
        }
      }

      previousSnapshotRef.current = nextSnapshot;
    } catch (snapshotError) {
      setError(snapshotError instanceof Error ? snapshotError.message : "Falha ao avaliar alertas");
    } finally {
      setLoading(false);
    }
  }, [alerts, executeAction]);

  useEffect(() => {
    if (!isHydrated) return;
    refreshSnapshot();
    const interval = setInterval(refreshSnapshot, 30000);
    return () => clearInterval(interval);
  }, [refreshSnapshot, isHydrated]);

  const createAlert = (alert: Omit<AdvancedAlert, "id" | "triggered" | "createdAt" | "lastTriggered">) => {
    const nextAlert: AdvancedAlert = {
      ...alert,
      id: Date.now().toString(),
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [nextAlert, ...prev]);
  };

  const toggleAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const removeAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const dismissActiveAlert = (activeAlertId: string) => {
    setActiveAlerts((prev) => prev.filter((alert) => alert.id !== activeAlertId));
  };

  return {
    alerts,
    activeAlerts,
    history,
    snapshot,
    loading,
    error,
    globalSettings,
    setGlobalSettings,
    createAlert,
    toggleAlert,
    removeAlert,
    dismissActiveAlert,
    refreshSnapshot,
  };
};
