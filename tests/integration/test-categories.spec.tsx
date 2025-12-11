import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import CategoryBrowser from '../../src/components/CategoryBrowser'
import { pokeApi } from '../../src/services/pokeApi'

// Mock the pokeApi service
vi.mock('../../src/services/pokeApi', () => ({
  pokeApi: {
    getPokemonByType: vi.fn(),
    getPokemonByGeneration: vi.fn(),
  },
}))

const mockPokeApi = vi.mocked(pokeApi)

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}

function renderWithProviders(component: React.ReactElement) {
  const queryClient = createTestQueryClient()
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </BrowserRouter>
  )
}

describe('Category Browsing Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Type Browsing', () => {
    it('should display Pokemon filtered by type', async () => {
      const mockTypeData = {
        pokemon: [
          { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
          { pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
        ],
      }

      mockPokeApi.getPokemonByType.mockResolvedValueOnce(mockTypeData)

      renderWithProviders(<CategoryBrowser />)

      // Wait for the component to load and display categories
      await waitFor(() => {
        expect(screen.getByText('Browse by Type')).toBeInTheDocument()
      })

      // Click on fire type
      const fireButton = screen.getByText('fire')
      fireButton.click()

      // Verify API was called
      await waitFor(() => {
        expect(mockPokeApi.getPokemonByType).toHaveBeenCalledWith('fire')
      })

      // Check that Pokemon are displayed
      await waitFor(() => {
        expect(screen.getByText('charmander')).toBeInTheDocument()
        expect(screen.getByText('charmeleon')).toBeInTheDocument()
      })
    })

    it('should handle empty type results', async () => {
      const mockEmptyData = {
        pokemon: [],
      }

      mockPokeApi.getPokemonByType.mockResolvedValueOnce(mockEmptyData)

      renderWithProviders(<CategoryBrowser />)

      await waitFor(() => {
        expect(screen.getByText('Browse by Type')).toBeInTheDocument()
      })

      const fireButton = screen.getByText('fire')
      fireButton.click()

      await waitFor(() => {
        expect(mockPokeApi.getPokemonByType).toHaveBeenCalledWith('fire')
      })

      // Should show empty state message
      await waitFor(() => {
        expect(screen.getByText('No Pokemon found for this type.')).toBeInTheDocument()
      })
    })
  })

  describe('Generation Browsing', () => {
    it('should display Pokemon filtered by generation', async () => {
      const mockGenerationData = {
        pokemon_species: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
        ],
      }

      mockPokeApi.getPokemonByGeneration.mockResolvedValueOnce(mockGenerationData)

      renderWithProviders(<CategoryBrowser />)

      await waitFor(() => {
        expect(screen.getByText('Browse by Generation')).toBeInTheDocument()
      })

      // Click on generation 1
      const gen1Button = screen.getByText('Generation 1')
      gen1Button.click()

      await waitFor(() => {
        expect(mockPokeApi.getPokemonByGeneration).toHaveBeenCalledWith(1)
      })

      // Check that Pokemon are displayed
      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument()
        expect(screen.getByText('ivysaur')).toBeInTheDocument()
      })
    })

    it('should handle API errors gracefully', async () => {
      mockPokeApi.getPokemonByType.mockRejectedValueOnce(new Error('API Error'))

      renderWithProviders(<CategoryBrowser />)

      await waitFor(() => {
        expect(screen.getByText('Browse by Type')).toBeInTheDocument()
      })

      const fireButton = screen.getByText('fire')
      fireButton.click()

      await waitFor(() => {
        expect(screen.getByText('Failed to load Pokemon. Please try again.')).toBeInTheDocument()
      })
    })
  })
})