import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import PokemonDetail from '../../src/pages/PokemonDetail'

// Mock the services
vi.mock('../../src/services/pokeApi', () => ({
  pokeApi: {
    getPokemon: vi.fn().mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'sprite.png' },
      types: [{ type: { name: 'grass' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }],
      height: 7,
      weight: 69,
      abilities: [{ ability: { name: 'overgrow' } }],
      species: { url: 'species-url' },
    }),
  },
}))

vi.mock('../../src/services/localStorage', () => ({
  localStorageService: {
    isFavorite: vi.fn().mockReturnValue(false),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

describe('Favorites Integration Test', () => {
  it('should allow adding and removing favorites', async () => {
    const queryClient = createTestQueryClient()
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PokemonDetail />
        </QueryClientProvider>
      </BrowserRouter>
    )

    // Wait for Pokemon details to load
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    })

    // This test will be expanded when FavoriteButton is implemented
    // For now, it verifies the page loads with Pokemon data
    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
  })
})