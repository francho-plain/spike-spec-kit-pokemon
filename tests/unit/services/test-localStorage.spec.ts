import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { localStorageService } from '@/services/localStorage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Local Storage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  describe('getFavorites', () => {
    it('should return empty array when no favorites exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const result = localStorageService.getFavorites()
      expect(result).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('mypokedex-favorites')
    })

    it('should return parsed favorites from localStorage', () => {
      const mockFavorites = [
        { pokemonId: 1, pokemonName: 'bulbasaur', addedAt: '2025-12-11T10:00:00.000Z' },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockFavorites))
      const result = localStorageService.getFavorites()
      expect(result).toEqual(mockFavorites)
    })

    it('should return empty array on JSON parse error', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      const result = localStorageService.getFavorites()
      expect(result).toEqual([])
    })
  })

  describe('addFavorite', () => {
    it('should add new favorite to localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[]')
      localStorageService.addFavorite(1, 'bulbasaur')
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'mypokedex-favorites',
        expect.stringContaining('"pokemonId":1')
      )
    })

    it('should not add duplicate favorites', () => {
      const existingFavorites = [{ pokemonId: 1, pokemonName: 'bulbasaur', addedAt: '2025-12-11T10:00:00.000Z' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingFavorites))
      localStorageService.addFavorite(1, 'bulbasaur')
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(0)
    })
  })

  describe('removeFavorite', () => {
    it('should remove favorite from localStorage', () => {
      const existingFavorites = [
        { pokemonId: 1, pokemonName: 'bulbasaur', addedAt: '2025-12-11T10:00:00.000Z' },
        { pokemonId: 2, pokemonName: 'ivysaur', addedAt: '2025-12-11T11:00:00.000Z' },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingFavorites))
      localStorageService.removeFavorite(1)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'mypokedex-favorites',
        JSON.stringify([existingFavorites[1]])
      )
    })
  })

  describe('isFavorite', () => {
    it('should return true if pokemon is favorite', () => {
      const existingFavorites = [{ pokemonId: 1, pokemonName: 'bulbasaur', addedAt: '2025-12-11T10:00:00.000Z' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingFavorites))
      const result = localStorageService.isFavorite(1)
      expect(result).toBe(true)
    })

    it('should return false if pokemon is not favorite', () => {
      localStorageMock.getItem.mockReturnValue('[]')
      const result = localStorageService.isFavorite(1)
      expect(result).toBe(false)
    })
  })
})