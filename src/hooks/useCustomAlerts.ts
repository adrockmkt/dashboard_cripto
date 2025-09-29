
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface CustomAlert {
  id: string
  cryptoId: string
  symbol: string
  name: string
  type: 'price_above' | 'price_below' | 'change_above' | 'change_below'
  value: number
  isActive: boolean
  triggered: boolean
  createdAt: Date
}

export const useCustomAlerts = () => {
  const [alerts, setAlerts] = useState<CustomAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        const saved = localStorage.getItem('custom-alerts')
        if (saved) {
          const parsed = JSON.parse(saved).map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt)
          }))
          setAlerts(parsed)
        }
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('custom_alerts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar alertas:', error)
        const saved = localStorage.getItem('custom-alerts')
        if (saved) {
          const parsed = JSON.parse(saved).map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt)
          }))
          setAlerts(parsed)
        }
      } else if (data) {
        const alertsData = data.map(item => ({
          id: item.id,
          cryptoId: item.crypto_id,
          symbol: item.symbol,
          name: item.name,
          type: item.type,
          value: item.value,
          isActive: item.is_active,
          triggered: item.triggered,
          createdAt: new Date(item.created_at)
        }))
        setAlerts(alertsData)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
      const saved = localStorage.getItem('custom-alerts')
      if (saved) {
        const parsed = JSON.parse(saved).map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt)
        }))
        setAlerts(parsed)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const createAlert = async (alert: Omit<CustomAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: CustomAlert = {
      ...alert,
      id: Date.now().toString(),
      triggered: false,
      createdAt: new Date()
    }

    if (!isSupabaseConfigured() || !supabase) {
      const updatedAlerts = [newAlert, ...alerts]
      setAlerts(updatedAlerts)
      localStorage.setItem('custom-alerts', JSON.stringify(updatedAlerts))
      return
    }

    try {
      const { error } = await supabase
        .from('custom_alerts')
        .insert({
          id: newAlert.id,
          crypto_id: newAlert.cryptoId,
          symbol: newAlert.symbol,
          name: newAlert.name,
          type: newAlert.type,
          value: newAlert.value,
          is_active: newAlert.isActive,
          triggered: newAlert.triggered
        })

      if (error) {
        console.error('Erro ao salvar alerta:', error)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }

    const updatedAlerts = [newAlert, ...alerts]
    setAlerts(updatedAlerts)
    localStorage.setItem('custom-alerts', JSON.stringify(updatedAlerts))
  }

  const toggleAlert = async (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId)
    if (!alert) return

    if (!isSupabaseConfigured() || !supabase) {
      const updatedAlerts = alerts.map(a => 
        a.id === alertId ? { ...a, isActive: !a.isActive } : a
      )
      setAlerts(updatedAlerts)
      localStorage.setItem('custom-alerts', JSON.stringify(updatedAlerts))
      return
    }

    const newActiveState = !alert.isActive

    try {
      const { error } = await supabase
        .from('custom_alerts')
        .update({ is_active: newActiveState })
        .eq('id', alertId)

      if (error) {
        console.error('Erro ao atualizar alerta:', error)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }

    const updatedAlerts = alerts.map(a => 
      a.id === alertId ? { ...a, isActive: newActiveState } : a
    )
    setAlerts(updatedAlerts)
    localStorage.setItem('custom-alerts', JSON.stringify(updatedAlerts))
  }

  const deleteAlert = async (alertId: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      const updatedAlerts = alerts.filter(a => a.id !== alertId)
      setAlerts(updatedAlerts)
      localStorage.setItem('custom-alerts', JSON.stringify(updatedAlerts))
      return
    }

    try {
      const { error } = await supabase
        .from('custom_alerts')
        .delete()
        .eq('id', alertId)

      if (error) {
        console.error('Erro ao deletar alerta:', error)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }

    const updatedAlerts = alerts.filter(a => a.id !== alertId)
    setAlerts(updatedAlerts)
    localStorage.setItem('custom-alerts', JSON.stringify(updatedAlerts))
  }

  return {
    alerts,
    isLoading,
    createAlert,
    toggleAlert,
    deleteAlert,
    refreshAlerts: loadAlerts
  }
}
