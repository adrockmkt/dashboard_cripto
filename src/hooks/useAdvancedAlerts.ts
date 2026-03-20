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

interface GlobalAlertSettings {
  soundEnabled: boolean;
  visualEnabled: boolean;
  emailEnabled: boolean;
  webhookEnabled: boolean;
}

const ALERTS_STORAGE_KEY = "advanced-alerts";
const ALERTS_HISTORY_STORAGE_KEY = "advanced-alerts-history";
const ALERTS_SETTINGS_STORAGE_KEY = "advanced-alerts-settings";

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
  const [globalSettings, setGlobalSettings] = useState<GlobalAlertSettings>({
    soundEnabled: true,
    visualEnabled: true,
    emailEnabled: false,
    webhookEnabled: false,
  });
  const [snapshot, setSnapshot] = useState<AlertEvaluationSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const previousSnapshotRef = useRef<AlertEvaluationSnapshot | null>(null);

  useEffect(() => {
    setAlerts(loadJson<AdvancedAlert[]>(ALERTS_STORAGE_KEY, []));
    setHistory(loadJson<AlertHistoryEntry[]>(ALERTS_HISTORY_STORAGE_KEY, []));
    setGlobalSettings(loadJson<GlobalAlertSettings>(ALERTS_SETTINGS_STORAGE_KEY, {
      soundEnabled: true,
      visualEnabled: true,
      emailEnabled: false,
      webhookEnabled: false,
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(ALERTS_HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(ALERTS_SETTINGS_STORAGE_KEY, JSON.stringify(globalSettings));
  }, [globalSettings]);

  const executeAction = useCallback(
    async (alert: AdvancedAlert, action: AlertAction, message: string, metricValues: Record<string, number | null>) => {
      switch (action.type) {
        case "sound":
          if (globalSettings.soundEnabled) {
            playAlertSound();
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
            } catch (webhookError) {
              console.error("Erro ao chamar webhook:", webhookError);
            }
          }
          break;
        case "email":
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
        if (!evaluation.passed) continue;

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
    refreshSnapshot();
    const interval = setInterval(refreshSnapshot, 30000);
    return () => clearInterval(interval);
  }, [refreshSnapshot]);

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
