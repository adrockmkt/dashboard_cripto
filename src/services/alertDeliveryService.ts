import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface AlertDeliveryRecord {
  id: string;
  alertId: string;
  alertName: string;
  channel: "browser" | "visual" | "sound" | "webhook" | "email";
  status: "pending" | "delivered" | "failed";
  message: string;
  metricValues: Record<string, number | null>;
  createdAt: string;
  deliveredAt?: string;
  error?: string;
}

const DELIVERY_QUEUE_KEY = "advanced-alerts-delivery-queue";
const DELIVERY_HISTORY_KEY = "advanced-alerts-delivery-history";

const loadRecords = (key: string): AlertDeliveryRecord[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRecords = (key: string, records: AlertDeliveryRecord[]) => {
  localStorage.setItem(key, JSON.stringify(records.slice(0, 100)));
};

const syncToSupabase = async (table: string, record: AlertDeliveryRecord) => {
  if (!isSupabaseConfigured() || !supabase) return;

  try {
    const { error } = await supabase.from(table).upsert({
      id: record.id,
      alert_id: record.alertId,
      alert_name: record.alertName,
      channel: record.channel,
      status: record.status,
      message: record.message,
      metric_values: record.metricValues,
      created_at: record.createdAt,
      delivered_at: record.deliveredAt || null,
      error: record.error || null,
    });

    if (error) {
      console.error(`Erro ao sincronizar ${table}:`, error);
    }
  } catch (syncError) {
    console.error(`Falha ao sincronizar ${table}:`, syncError);
  }
};

export const enqueueAlertDelivery = async (record: AlertDeliveryRecord) => {
  const queue = loadRecords(DELIVERY_QUEUE_KEY);
  saveRecords(DELIVERY_QUEUE_KEY, [record, ...queue]);
  await syncToSupabase("alert_delivery_queue", record);
};

export const finalizeAlertDelivery = async (record: AlertDeliveryRecord) => {
  const queue = loadRecords(DELIVERY_QUEUE_KEY).filter((item) => item.id !== record.id);
  const history = loadRecords(DELIVERY_HISTORY_KEY);

  saveRecords(DELIVERY_QUEUE_KEY, queue);
  saveRecords(DELIVERY_HISTORY_KEY, [record, ...history]);

  await syncToSupabase("alert_delivery_queue", record);
  await syncToSupabase("alert_delivery_history", record);
};

export const getPendingAlertDeliveries = () => loadRecords(DELIVERY_QUEUE_KEY);
export const getAlertDeliveryHistory = () => loadRecords(DELIVERY_HISTORY_KEY);
