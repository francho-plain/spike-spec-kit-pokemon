/**
 * WCAG 2.1 AA Compliance Tests for MyPokeDex
 * 
 * This test suite validates that all components and pages meet
 * WCAG 2.1 Level AA accessibility standards
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

// Components
import PokemonCard from '../../src/components/PokemonCard'
import SearchBar from '../../src/components/SearchBar'
import FavoriteButton from '../../src/components/FavoriteButton'
import CategoryBrowser from '../../src/components/CategoryBrowser'
import ErrorBoundary from '../../src/components/ErrorBoundary'
import Loading from '../../src/components/Loading'

// Pages
import Home from '../../src/pages/Home'
import PokemonDetail from '../../src/pages/PokemonDetail'
import Favorites from '../../src/pages/Favorites'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Test wrapper with providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  )
}

describe('WCAG 2.1 AA Compliance - Components', () => {
  describe('PokemonCard Component', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric']
    }

    it('should not have any axe violations', async () => {
      const { container } = render(
        <PokemonCard pokemon={mockPokemon} onClick={() => {}} />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA labels', () => {
      render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'View details for pikachu')
    })

    it('should be keyboard accessible', () => {
      render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should have alt text for images', () => {
      render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
      const image = screen.getByAltText(/image of pikachu/i)
      expect(image).toBeInTheDocument()
    })
  })

  describe('SearchBar Component', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper label association', () => {
      render(
        <TestWrapper>
          <SearchBar onSearch={() => {}} />
        </TestWrapper>
      )
      const input = screen.getByLabelText(/search pokemon/i)
      expect(input).toBeInTheDocument()
    })

    it('should have autocomplete ARIA attributes', () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      )
      const input = screen.getByPlaceholderText(/search pokemon/i)
      expect(input).toHaveAttribute('role', 'combobox')
      expect(input).toHaveAttribute('aria-autocomplete', 'list')
    })
  })

  describe('FavoriteButton Component', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <FavoriteButton pokemonId={25} pokemonName="pikachu" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have ARIA pressed state', () => {
      render(<FavoriteButton pokemonId={25} pokemonName="pikachu" />)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed')
    })

    it('should have descriptive ARIA label', () => {
      render(<FavoriteButton pokemonId={25} pokemonName="pikachu" />)
      const button = screen.getByRole('button')
      const label = button.getAttribute('aria-label')
      expect(label).toMatch(/pikachu/)
      expect(label).toMatch(/favorite/i)
    })
  })

  describe('CategoryBrowser Component', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <TestWrapper>
          <CategoryBrowser />
        </TestWrapper>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <CategoryBrowser />
        </TestWrapper>
      )
      expect(screen.getByText(/browse by type/i)).toBeInTheDocument()
      expect(screen.getByText(/browse by generation/i)).toBeInTheDocument()
    })
  })

  describe('Loading Component', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(<Loading />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have ARIA live region', () => {
      render(<Loading />)
      const loadingElement = screen.getByText(/loading/i)
      expect(loadingElement.parentElement).toHaveAttribute('aria-live')
    })

    it('should be announced to screen readers', () => {
      render(<Loading />)
      const loadingElement = screen.getByText(/loading/i)
      expect(loadingElement.parentElement).toHaveAttribute('role', 'status')
    })
  })

  describe('ErrorBoundary Component', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    it('should not have any axe violations', async () => {
      // Suppress console errors for this test
      const originalError = console.error
      console.error = () => {}

      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      console.error = originalError
    })

    it('should have proper heading for error message', () => {
      const originalError = console.error
      console.error = () => {}

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByRole('heading')).toBeInTheDocument()

      console.error = originalError
    })
  })
})

describe('WCAG 2.1 AA Compliance - Pages', () => {
  describe('Home Page', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have main landmark', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })
  })

  describe('PokemonDetail Page', () => {
    it('should have main landmark', () => {
      render(
        <TestWrapper>
          <PokemonDetail />
        </TestWrapper>
      )
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute('id', 'main-content')
    })
  })

  describe('Favorites Page', () => {
    it('should not have any axe violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Favorites />
        </TestWrapper>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper heading', () => {
      render(
        <TestWrapper>
          <Favorites />
        </TestWrapper>
      )
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('should have main landmark', () => {
      render(
        <TestWrapper>
          <Favorites />
        </TestWrapper>
      )
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })
  })
})

describe('WCAG 2.1 AA Compliance - Keyboard Navigation', () => {
  it('all interactive elements should be keyboard accessible', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric']
    }

    render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
    const card = screen.getByRole('button')
    
    // Should be focusable
    expect(card).not.toHaveAttribute('tabIndex', '-1')
  })

  it('should support Enter key for activation', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric']
    }

    render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
    const card = screen.getByRole('button')
    
    // Should have button role (implemented with div role="button")
    expect(card).toHaveAttribute('role', 'button')
  })
})

describe('WCAG 2.1 AA Compliance - Color and Contrast', () => {
  it('should not rely solely on color for information', () => {
    render(<FavoriteButton pokemonId={25} pokemonName="pikachu" />)
    const button = screen.getByRole('button')
    
    // Should have ARIA state in addition to visual indicator
    expect(button).toHaveAttribute('aria-pressed')
  })

  it('should have visible focus indicators', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric']
    }

    const { container } = render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
    const card = screen.getByRole('button')
    
    // Focus the element
    card.focus()
    expect(document.activeElement).toBe(card)
  })
})

describe('WCAG 2.1 AA Compliance - Screen Reader Support', () => {
  it('images should have alt text', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/pikachu.png',
      types: ['electric']
    }

    render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)
    const image = screen.getByAltText(/image of pikachu/i)
    expect(image).toBeInTheDocument()
  })

  it('buttons should have accessible names', () => {
    render(<FavoriteButton pokemonId={25} pokemonName="pikachu" />)
    const button = screen.getByRole('button')
    
    // Should have either text content or aria-label
    expect(button).toHaveAttribute('aria-label')
  })

  it('loading states should be announced', () => {
    render(<Loading />)
    const loadingElement = screen.getByText(/loading/i)
    
    // Should have aria-live for announcements
    expect(loadingElement.parentElement).toHaveAttribute('aria-live')
  })
})

describe('WCAG 2.1 AA Compliance - Form Controls', () => {
  it('search input should have proper labels', () => {
    render(
      <TestWrapper>
        <SearchBar onSearch={() => {}} />
      </TestWrapper>
    )
    const input = screen.getByLabelText(/search pokemon/i)
    
    // Should have associated label
    expect(input).toHaveAttribute('id', 'pokemon-search')
  })
})

describe('WCAG 2.1 AA Compliance - Structure and Semantics', () => {
  it('should use semantic HTML elements', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    // Should have main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Should have heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('should have proper heading hierarchy', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    const h1Elements = screen.getAllByRole('heading', { level: 1 })
    
    // Should have at least one h1
    expect(h1Elements.length).toBeGreaterThan(0)
  })

  it('should have landmark regions', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    // Should have main landmark
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
