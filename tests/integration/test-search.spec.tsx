import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Home from '../../src/pages/Home'

vi.mock('../../src/services/pokeApi', () => ({
  pokeApi: {
    getPokemonList: vi.fn().mockResolvedValue({
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    }),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

describe('Search Integration Test', () => {
  it('should render search bar and display results', async () => {
    const queryClient = createTestQueryClient()
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </BrowserRouter>
    )

    expect(await screen.findByPlaceholderText('Search Pokemon...')).toBeInTheDocument()
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument()
  })
})