import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { axe } from 'jest-axe'
import SearchBar from '../../../src/components/SearchBar'
import { pokeApi } from '../../../src/services/pokeApi'

// Mock the pokeApi service
vi.mock('../../../src/services/pokeApi', () => ({
  pokeApi: {
    getPokemonList: vi.fn(),
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

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render search input with proper accessibility attributes', () => {
    const mockOnSearch = vi.fn()

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: [],
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search Pokemon')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Search Pokemon...')
    expect(input).toHaveAttribute('aria-describedby', 'search-help')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveAttribute('role', 'combobox')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('should display help text', () => {
    const mockOnSearch = vi.fn()

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: [],
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    expect(screen.getByText('Type to search for Pokemon by name')).toBeInTheDocument()
  })

  it('should call onSearch when input changes', async () => {
    const mockOnSearch = vi.fn()

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search Pokemon')
    fireEvent.change(input, { target: { value: 'bulb' } })

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('bulb')
    })
  })

  it('should show suggestions when typing', async () => {
    const mockOnSearch = vi.fn()

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
      ],
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search Pokemon')
    fireEvent.change(input, { target: { value: 'b' } })

    await waitFor(() => {
      const datalist = document.getElementById('pokemon-suggestions')
      expect(datalist).toBeInTheDocument()
      expect(datalist?.children).toHaveLength(1) // Only bulbasaur matches
      expect(datalist?.children[0]).toHaveAttribute('value', 'bulbasaur')
    })

    // Check aria-expanded is true when suggestions exist
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('should limit suggestions to 10 results', async () => {
    const mockOnSearch = vi.fn()

    // Create 15 pokemon names that start with 'p'
    const pokemonResults = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }))

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: pokemonResults,
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search Pokemon')
    fireEvent.change(input, { target: { value: 'p' } })

    await waitFor(() => {
      const datalist = document.getElementById('pokemon-suggestions')
      expect(datalist?.children).toHaveLength(10) // Limited to 10
    })
  })

  it('should clear suggestions when input is empty', async () => {
    const mockOnSearch = vi.fn()

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search Pokemon')

    // Type something
    fireEvent.change(input, { target: { value: 'b' } })

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'true')
    })

    // Clear input
    fireEvent.change(input, { target: { value: '' } })

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('should filter suggestions case-insensitively', async () => {
    const mockOnSearch = vi.fn()

    mockPokeApi.getPokemonList.mockResolvedValue({
      results: [
        { name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    })

    renderWithProviders(<SearchBar onSearch={mockOnSearch} />)

    const input = screen.getByLabelText('Search Pokemon')
    fireEvent.change(input, { target: { value: 'bulb' } })

    await waitFor(() => {
      const datalist = document.getElementById('pokemon-suggestions')
      expect(datalist?.children).toHaveLength(1)
      expect(datalist?.children[0]).toHaveAttribute('value', 'Bulbasaur')
    })
  })

  it('should have no accessibility violations', async () => {
    const { container } = renderWithProviders(<SearchBar />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})