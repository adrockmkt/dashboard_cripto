
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface FavoriteCrypto {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  addedAt: Date
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCrypto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false })

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar favoritos:', error)
        // Fallback para localStorage
        const saved = localStorage.getItem('crypto-favorites')
        if (saved) {
          const parsed = JSON.parse(saved).map((f: any) => ({
            ...f,
            addedAt: new Date(f.addedAt)
          }))
          setFavorites(parsed)
        }
      } else if (data) {
        const favoritesData = data.map(item => ({
          id: item.crypto_id,
          symbol: item.symbol,
          name: item.name,
          price: item.price,
          change24h: item.change_24h,
          addedAt: new Date(item.created_at)
        }))
        setFavorites(favoritesData)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
      const saved = localStorage.getItem('crypto-favorites')
      if (saved) {
        const parsed = JSON.parse(saved).map((f: any) => ({
          ...f,
          addedAt: new Date(f.addedAt)
        }))
        setFavorites(parsed)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addToFavorites = async (crypto: Omit<FavoriteCrypto, 'addedAt'>) => {
    const newFavorite: FavoriteCrypto = {
      ...crypto,
      addedAt: new Date()
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          crypto_id: crypto.id,
          symbol: crypto.symbol,
          name: crypto.name,
          price: crypto.price,
          change_24h: crypto.change24h
        })

      if (error) {
        console.error('Erro ao salvar favorito:', error)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }

    const updatedFavorites = [newFavorite, ...favorites]
    setFavorites(updatedFavorites)
    localStorage.setItem('crypto-favorites', JSON.stringify(updatedFavorites))
  }

  const removeFromFavorites = async (cryptoId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('crypto_id', cryptoId)

      if (error) {
        console.error('Erro ao remover favorito:', error)
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error)
    }

    const updatedFavorites = favorites.filter(f => f.id !== cryptoId)
    setFavorites(updatedFavorites)
    localStorage.setItem('crypto-favorites', JSON.stringify(updatedFavorites))
  }

  const isFavorite = (cryptoId: string) => {
    return favorites.some(f => f.id === cryptoId)
  }

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites: loadFavorites
  }
}
