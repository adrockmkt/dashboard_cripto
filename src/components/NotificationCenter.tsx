import { useEffect, useState } from "react";
import { Bell, X, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const STORAGE_KEY = "crypto-notifications";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();

    const handleAddNotification = (event: Event) => {
      const customEvent = event as CustomEvent<Omit<Notification, "id" | "timestamp" | "read">>;
      addNotification(customEvent.detail);
    };

    let channel = null;
    if (isSupabaseConfigured() && supabase) {
      channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const newNotification: Notification = {
              id: payload.new.id,
              type: payload.new.type,
              title: payload.new.title,
              message: payload.new.message,
              timestamp: new Date(payload.new.created_at),
              read: payload.new.read,
            };

            setNotifications((prev) => {
              const alreadyExists = prev.some((notification) => notification.id === newNotification.id);
              return alreadyExists ? prev : [newNotification, ...prev].slice(0, 50);
            });
          }
        )
        .subscribe();
    }

    window.addEventListener("add-notification", handleAddNotification as EventListener);

    return () => {
      window.removeEventListener("add-notification", handleAddNotification as EventListener);
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const loadNotifications = async () => {
    const loadLocal = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setNotifications([]);
        return;
      }

      const parsed = JSON.parse(saved).map((notification: any) => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
      }));
      setNotifications(parsed);
    };

    if (!isSupabaseConfigured() || !supabase) {
      loadLocal();
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Erro ao carregar notificações:", error);
        loadLocal();
        return;
      }

      const nextNotifications: Notification[] = (data || []).map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        timestamp: new Date(item.created_at),
        read: item.read,
      }));

      setNotifications(nextNotifications);
    } catch (error) {
      console.error("Erro ao conectar com Supabase:", error);
      loadLocal();
    }
  };

  const addNotification = async (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));

    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase.from("notifications").insert({
        id: newNotification.id,
        type: newNotification.type,
        title: newNotification.title,
        message: newNotification.message,
        read: newNotification.read,
      });

      if (error) {
        console.error("Erro ao salvar notificação:", error);
      }
    } catch (error) {
      console.error("Erro ao sincronizar notificação:", error);
    }
  };

  const updateReadStatus = async (ids: string[], read: boolean) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        ids.includes(notification.id) ? { ...notification, read } : notification
      )
    );

    if (!isSupabaseConfigured() || !supabase || ids.length === 0) return;

    try {
      const { error } = await supabase.from("notifications").update({ read }).in("id", ids);
      if (error) {
        console.error("Erro ao atualizar notificações:", error);
      }
    } catch (error) {
      console.error("Erro ao sincronizar leitura:", error);
    }
  };

  const markAsRead = (id: string) => {
    updateReadStatus([id], true);
  };

  const markAllAsRead = () => {
    const unreadIds = notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) return;
    updateReadStatus(unreadIds, true);
  };

  const removeNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));

    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) {
        console.error("Erro ao remover notificação:", error);
      }
    } catch (error) {
      console.error("Erro ao sincronizar remoção:", error);
    }
  };

  const clearAll = async () => {
    const ids = notifications.map((notification) => notification.id);
    setNotifications([]);

    if (!isSupabaseConfigured() || !supabase || ids.length === 0) return;

    try {
      const { error } = await supabase.from("notifications").delete().in("id", ids);
      if (error) {
        console.error("Erro ao limpar notificações:", error);
      }
    } catch (error) {
      console.error("Erro ao sincronizar limpeza:", error);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            variant="destructive"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 w-80 max-h-96 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Notificações</CardTitle>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Nenhuma notificação
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b border-border hover:bg-muted/50 cursor-pointer",
                          !notification.read && "bg-primary/5"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 flex-1">
                            {getIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(event) => {
                              event.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 opacity-50 hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" onClick={clearAll} className="w-full text-xs">
                    Limpar todas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const event = new CustomEvent("add-notification", { detail: notification });
    window.dispatchEvent(event);
  };

  return { addNotification };
};
