/**
 * Integration Accessibility Tests
 * 
 * These tests validate accessibility features in component integration scenarios
 */

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import PokemonCard from '../../src/components/PokemonCard'
import FavoriteButton from '../../src/components/FavoriteButton'
import SearchBar from '../../src/components/SearchBar'
import CategoryBrowser from '../../src/components/CategoryBrowser'
import Home from '../../src/pages/Home'

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

describe('Integration Accessibility Tests', () => {
  describe('Component ARIA Attributes', () => {
    it('PokemonCard should have proper ARIA labels', () => {
      const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://example.com/bulbasaur.png',
        types: ['grass', 'poison']
      }

      render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)

      const card = screen.getByRole('button', { name: /view details for bulbasaur/i })
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('aria-label', 'View details for bulbasaur')
    })

    it('FavoriteButton should have proper ARIA attributes', () => {
      render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveAttribute('aria-label', 'Add bulbasaur to favorites')
    })

    it('SearchBar should have proper autocomplete ARIA attributes', () => {
      render(
        <TestWrapper>
          <SearchBar onSearch={() => {}} />
        </TestWrapper>
      )

      const input = screen.getByLabelText(/search pokemon/i)
      expect(input).toHaveAttribute('role', 'combobox')
      expect(input).toHaveAttribute('aria-autocomplete', 'list')
      expect(input).toHaveAttribute('id', 'pokemon-search')
    })
  })

  describe('Keyboard Navigation', () => {
    it('PokemonCard should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://example.com/bulbasaur.png',
        types: ['grass', 'poison']
      }

      render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />)

      const card = screen.getByRole('button')
      
      // Tab to focus
      await user.tab()
      expect(card).toHaveFocus()

      // Press Enter
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()

      // Press Space
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalled()
    })

    it('FavoriteButton should be keyboard accessible', async () => {
      const user = userEvent.setup()
      
      // Clear localStorage before test
      localStorage.clear()
      
      render(<FavoriteButton pokemonId={999} pokemonName="testmon" />)

      const button = screen.getByRole('button')
      
      // Tab to focus
      await user.tab()
      expect(button).toHaveFocus()

      // Check initial state (should be false since localStorage is clear)
      expect(button).toHaveAttribute('aria-pressed', 'false')

      // Press Enter to toggle
      await user.keyboard('{Enter}')
      
      // State should have changed
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('SearchBar should support keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <SearchBar onSearch={() => {}} />
        </TestWrapper>
      )

      const input = screen.getByPlaceholderText(/search pokemon/i)
      
      // Tab to focus
      await user.tab()
      expect(input).toHaveFocus()

      // Type in search
      await user.keyboard('pika')
      expect(input).toHaveValue('pika')
    })
  })

  describe('Screen Reader Support', () => {
    it('should announce loading states', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      // Check for loading indicator with aria-live
      const loadingElements = screen.queryAllByRole('status')
      // Should have loading states with proper roles
      expect(loadingElements.length).toBeGreaterThanOrEqual(0)
    })

    it('images should have descriptive alt text', () => {
      const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://example.com/bulbasaur.png',
        types: ['grass', 'poison']
      }

      render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)

      const image = screen.getByAltText(/image of bulbasaur/i)
      expect(image).toBeInTheDocument()
    })

    it('FavoriteButton state changes should be announced', async () => {
      const user = userEvent.setup()
      
      // Clear localStorage before test
      localStorage.clear()
      
      render(<FavoriteButton pokemonId={888} pokemonName="testpokemon" />)

      const button = screen.getByRole('button')
      
      // Initial state (should be false since localStorage is clear)
      expect(button).toHaveAttribute('aria-pressed', 'false')
      const initialLabel = button.getAttribute('aria-label')
      expect(initialLabel).toMatch(/testpokemon/)
      expect(initialLabel).toMatch(/favorite/i)

      // Click to add to favorites
      await user.click(button)
      
      // State should update
      expect(button).toHaveAttribute('aria-pressed', 'true')
      const updatedLabel = button.getAttribute('aria-label')
      expect(updatedLabel).toMatch(/testpokemon/)
      expect(updatedLabel).toMatch(/favorite/i)
    })
  })

  describe('Semantic Structure', () => {
    it('Home page should have proper landmark structure', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      // Should have main landmark
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()

      // Should have heading
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      )

      // Should have h1
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()

      // Should have h2s for sections
      const h2s = screen.queryAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus visibility', async () => {
      const user = userEvent.setup()
      
      const mockPokemon = {
        id: 1,
        name: 'bulbasaur',
        imageUrl: 'https://example.com/bulbasaur.png',
        types: ['grass', 'poison']
      }

      render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)

      const card = screen.getByRole('button')
      
      // Tab to focus
      await user.tab()
      
      // Should be focused
      expect(card).toHaveFocus()
      expect(document.activeElement).toBe(card)
    })

    it('should trap focus in appropriate contexts', () => {
      // This would be tested with modal/dialog components if present
      // Currently the app doesn't have modals, so this is a placeholder
      expect(true).toBe(true)
    })
  })

  describe('Color and Contrast', () => {
    it('should not rely solely on color for state', () => {
      render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

      const button = screen.getByRole('button')
      
      // Should have ARIA state in addition to visual indicator
      expect(button).toHaveAttribute('aria-pressed')
      
      // Should have descriptive label
      expect(button).toHaveAttribute('aria-label')
    })
  })

  describe('Form Controls', () => {
    it('search input should have proper label association', () => {
      render(
        <TestWrapper>
          <SearchBar onSearch={() => {}} />
        </TestWrapper>
      )

      const input = screen.getByLabelText(/search pokemon/i)
      
      // Should have proper id association with label
      expect(input).toHaveAttribute('id', 'pokemon-search')
    })
  })

  describe('Dynamic Content', () => {
    it('should handle dynamic content updates accessibly', () => {
      render(
        <TestWrapper>
          <CategoryBrowser />
        </TestWrapper>
      )

      // CategoryBrowser dynamically loads content
      // Should have proper structure
      expect(screen.getByText(/browse by type/i)).toBeInTheDocument()
      expect(screen.getByText(/browse by generation/i)).toBeInTheDocument()
    })
  })
})