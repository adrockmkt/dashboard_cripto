export interface BrowserNotificationPayload {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export const supportsBrowserNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

export const getBrowserNotificationPermission = (): NotificationPermission | "unsupported" => {
  if (!supportsBrowserNotifications()) {
    return "unsupported";
  }

  return Notification.permission;
};

export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission | "unsupported"> => {
  if (!supportsBrowserNotifications()) {
    return "unsupported";
  }

  return Notification.requestPermission();
};

export const showBrowserNotification = async (payload: BrowserNotificationPayload) => {
  if (!supportsBrowserNotifications() || Notification.permission !== "granted") {
    return false;
  }

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(payload.title, {
          body: payload.body,
          icon: `${import.meta.env.BASE_URL}icon-192.png`,
          badge: `${import.meta.env.BASE_URL}favicon.ico`,
          tag: payload.tag,
          data: payload.data,
        });
        return true;
      }
    }

    new Notification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      data: payload.data,
    });
    return true;
  } catch (error) {
    console.error("Erro ao exibir notificação do navegador:", error);
    return false;
  }
};
