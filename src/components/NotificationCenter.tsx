import { useState, useEffect } from "react"
import { Bell, X, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load notifications from Supabase
  useEffect(() => {
    loadNotifications()
    
    // Listen for real-time notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const newNotification = {
          id: payload.new.id,
          type: payload.new.type,
          title: payload.new.title,
          message: payload.new.message,
          timestamp: new Date(payload.new.created_at),
          read: payload.new.read
        }
        setNotifications(prev => [newNotification, ...prev].slice(0, 50))
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Erro ao carregar notificações:', error)
        // Fallback para localStorage
        const saved = localStorage.getItem("crypto-notifications")
        if (saved) {
          const parsed = JSON.parse(saved).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
          setNotifications(parsed)
        }
        return
      }

      if (data) {
        const notifications = data.map(item => ({
          id: item.id,
          type: item.type,
          title: item.title,
          message: item.message,
          timestamp: new Date(item.created_at),
          read: item.read
        }))
        setNotifications(notifications)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
      // Fallback para localStorage
      const saved = localStorage.getItem("crypto-notifications")
      if (saved) {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(parsed)
      }
    }
  }

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("crypto-notifications", JSON.stringify(notifications))
  }, [notifications])

  const addNotification = async (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('notifications')
        .insert({
          id: newNotification.id,
          type: newNotification.type,
          title: newNotification.title,
          message: newNotification.message,
          read: newNotification.read
        })

      if (error) {
        console.error('Erro ao salvar notificação:', error)
        // Fallback to local state only if Supabase fails
        setNotifications(prev => [newNotification, ...prev].slice(0, 50))
        localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications].slice(0, 50)))
      }
      // If successful, the realtime listener will handle the update
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
      // Fallback to local state only if Supabase fails
      setNotifications(prev => [newNotification, ...prev].slice(0, 50))
      localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications].slice(0, 50)))
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  // Generate sample notifications for demo and real alerts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length === 0) {
        addNotification({
          type: "info",
          title: "Bem-vindo!",
          message: "Central de notificações ativada. Você receberá alertas importantes aqui."
        })
      }
    }, 2000)

    // Generate periodic market alerts
    const marketTimer = setInterval(() => {
      const alerts = [
        { type: "warning" as const, title: "Bitcoin Alert", message: "BTC quebrou resistência de $45,000!" },
        { type: "success" as const, title: "Ethereum Rally", message: "ETH subiu 5% nas últimas 2 horas" },
        { type: "info" as const, title: "Market Update", message: "Volume de trading aumentou 20% hoje" },
        { type: "error" as const, title: "Risk Alert", message: "High volatility detected nos últimos 30min" }
      ]
      
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)]
      addNotification(randomAlert)
    }, 30000) // Nova notificação a cada 30 segundos

    return () => {
      clearTimeout(timer)
      clearInterval(marketTimer)
    }
  }, [])

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
                    Marcar todas
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
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
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
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="w-full text-xs"
                >
                  Limpar todas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Export function to add notifications from other components
export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const event = new CustomEvent("add-notification", { detail: notification })
    window.dispatchEvent(event)
  }

  return { addNotification }
}