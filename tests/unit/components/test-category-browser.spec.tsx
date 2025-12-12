import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { axe } from 'jest-axe'
import CategoryBrowser from '../../../src/components/CategoryBrowser'
import { pokeApi } from '../../../src/services/pokeApi'

// Mock the pokeApi service
vi.mock('../../../src/services/pokeApi', () => ({
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
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('CategoryBrowser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render type and generation browsing sections', () => {
    renderWithProviders(<CategoryBrowser />)

    expect(screen.getByText('Browse by Type')).toBeInTheDocument()
    expect(screen.getByText('Browse by Generation')).toBeInTheDocument()

    // Check that all type buttons are rendered
    const typeButtons = ['fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'normal', 'fighting', 'poison', 'ground', 'flying', 'bug', 'rock', 'ghost', 'steel']
    typeButtons.forEach(type => {
      expect(screen.getByRole('button', { name: `Browse ${type} type Pokemon` })).toBeInTheDocument()
    })

    // Check that generation buttons are rendered
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByRole('button', { name: `Browse Generation ${i} Pokemon` })).toBeInTheDocument()
    }
  })

  it('should select type when type button is clicked', async () => {
    const mockTypeData = {
      pokemon: [
        { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
        { pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
      ],
    }

    mockPokeApi.getPokemonByType.mockResolvedValue(mockTypeData)

    renderWithProviders(<CategoryBrowser />)

    const fireButton = screen.getByRole('button', { name: 'Browse fire type Pokemon' })
    fireEvent.click(fireButton)

    expect(fireButton).toHaveAttribute('aria-pressed', 'true')

    await waitFor(() => {
      expect(mockPokeApi.getPokemonByType).toHaveBeenCalledWith('fire')
    })

    await waitFor(() => {
      expect(screen.getByText('Fire Type Pokemon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'View details for charmander' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'View details for charmeleon' })).toBeInTheDocument()
    })
  })

  it('should select generation when generation button is clicked', async () => {
    const mockGenerationData = {
      pokemon_species: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' },
      ],
    }

    mockPokeApi.getPokemonByGeneration.mockResolvedValue(mockGenerationData)

    renderWithProviders(<CategoryBrowser />)

    const gen1Button = screen.getByRole('button', { name: 'Browse Generation 1 Pokemon' })
    fireEvent.click(gen1Button)

    expect(gen1Button).toHaveAttribute('aria-pressed', 'true')

    await waitFor(() => {
      expect(mockPokeApi.getPokemonByGeneration).toHaveBeenCalledWith(1)
    })

    await waitFor(() => {
      expect(screen.getByText('Generation 1 Pokemon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'View details for bulbasaur' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'View details for charmander' })).toBeInTheDocument()
    })
  })

  it('should clear generation selection when type is selected', async () => {
    mockPokeApi.getPokemonByType.mockResolvedValue({
      pokemon: [{ pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } }],
    })

    renderWithProviders(<CategoryBrowser />)

    // Select generation first
    const gen1Button = screen.getByRole('button', { name: 'Browse Generation 1 Pokemon' })
    fireEvent.click(gen1Button)
    expect(gen1Button).toHaveAttribute('aria-pressed', 'true')

    // Then select type
    const grassButton = screen.getByRole('button', { name: 'Browse grass type Pokemon' })
    fireEvent.click(grassButton)

    expect(gen1Button).toHaveAttribute('aria-pressed', 'false')
    expect(grassButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should clear type selection when generation is selected', async () => {
    mockPokeApi.getPokemonByGeneration.mockResolvedValue({
      pokemon_species: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }],
    })

    renderWithProviders(<CategoryBrowser />)

    // Select type first
    const grassButton = screen.getByRole('button', { name: 'Browse grass type Pokemon' })
    fireEvent.click(grassButton)
    expect(grassButton).toHaveAttribute('aria-pressed', 'true')

    // Then select generation
    const gen1Button = screen.getByRole('button', { name: 'Browse Generation 1 Pokemon' })
    fireEvent.click(gen1Button)

    expect(grassButton).toHaveAttribute('aria-pressed', 'false')
    expect(gen1Button).toHaveAttribute('aria-pressed', 'true')
  })

  it('should call onPokemonClick when pokemon button is clicked', async () => {
    const mockOnPokemonClick = vi.fn()

    mockPokeApi.getPokemonByType.mockResolvedValue({
      pokemon: [{ pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } }],
    })

    renderWithProviders(<CategoryBrowser onPokemonClick={mockOnPokemonClick} />)

    const fireButton = screen.getByRole('button', { name: 'Browse fire type Pokemon' })
    fireEvent.click(fireButton)

    await waitFor(() => {
      const pokemonButton = screen.getByRole('button', { name: 'View details for bulbasaur' })
      fireEvent.click(pokemonButton)
    })

    expect(mockOnPokemonClick).toHaveBeenCalledWith(1)
  })

  it('should disable pokemon buttons when no onPokemonClick provided', async () => {
    mockPokeApi.getPokemonByType.mockResolvedValue({
      pokemon: [{ pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } }],
    })

    renderWithProviders(<CategoryBrowser />)

    const fireButton = screen.getByRole('button', { name: 'Browse fire type Pokemon' })
    fireEvent.click(fireButton)

    await waitFor(() => {
      const pokemonButton = screen.getByRole('button', { name: 'View details for bulbasaur' })
      expect(pokemonButton).toBeDisabled()
    })
  })

  it('should show loading message while fetching data', () => {
    // Mock a slow response
    mockPokeApi.getPokemonByType.mockImplementation(() => new Promise(() => {}))

    renderWithProviders(<CategoryBrowser />)

    const fireButton = screen.getByRole('button', { name: 'Browse fire type Pokemon' })
    fireEvent.click(fireButton)

    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument()
  })

  it('should show error message when query fails', async () => {
    mockPokeApi.getPokemonByType.mockRejectedValue(new Error('API Error'))

    renderWithProviders(<CategoryBrowser />)

    const fireButton = screen.getByRole('button', { name: 'Browse fire type Pokemon' })
    fireEvent.click(fireButton)

    await waitFor(() => {
      expect(screen.getByText('Unable to load Pokemon for this category. Please check your connection and try again.')).toBeInTheDocument()
    })
  })

  it('should show no results message when empty data', async () => {
    mockPokeApi.getPokemonByType.mockResolvedValue({
      pokemon: [],
    })

    renderWithProviders(<CategoryBrowser />)

    const fireButton = screen.getByRole('button', { name: 'Browse fire type Pokemon' })
    fireEvent.click(fireButton)

    await waitFor(() => {
      expect(screen.getByText('No Pokemon found for this type.')).toBeInTheDocument()
    })
  })

  it('should have no accessibility violations', async () => {
    const { container } = renderWithProviders(<CategoryBrowser />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})