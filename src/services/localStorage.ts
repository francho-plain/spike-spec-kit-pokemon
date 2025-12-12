import type { UserFavorite } from '../types'

const FAVORITES_KEY = 'mypokedex-favorites'

export const localStorageService = {
  // Get all favorites
  getFavorites(): UserFavorite[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error)
      return []
    }
  },

  // Add a favorite
  addFavorite(pokemonId: number, pokemonName: string): void {
    try {
      const favorites = this.getFavorites()
      const exists = favorites.some(f => f.pokemonId === pokemonId)
      if (!exists) {
        favorites.push({
          pokemonId,
          pokemonName,
          addedAt: new Date().toISOString(),
        })
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      }
    } catch (error) {
      console.error('Error adding favorite to localStorage:', error)
    }
  },

  // Remove a favorite
  removeFavorite(pokemonId: number): void {
    try {
      const favorites = this.getFavorites().filter(f => f.pokemonId !== pokemonId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Error removing favorite from localStorage:', error)
    }
  },

  // Check if Pokemon is favorite
  isFavorite(pokemonId: number): boolean {
    return this.getFavorites().some(f => f.pokemonId === pokemonId)
  },
}