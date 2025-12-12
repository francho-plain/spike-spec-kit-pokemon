import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import PokemonCard from '@/components/PokemonCard'

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'https://example.com/bulbasaur.png',
  types: ['grass', 'poison']
}

describe('PokemonCard Component', () => {
  it('should render pokemon information correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    expect(screen.getByAltText('Image of bulbasaur Pokemon')).toBeInTheDocument()
    expect(screen.getByAltText('Image of bulbasaur Pokemon')).toHaveAttribute('src', 'https://example.com/bulbasaur.png')
    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByText('poison')).toBeInTheDocument()
  })

  it('should render as a div when no onClick provided', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    const card = screen.getByTestId('pokemon-card')
    expect(card.tagName).toBe('DIV')
    expect(card).not.toHaveAttribute('role')
    expect(card).toHaveAttribute('tabIndex', '-1')
  })

  it('should render as a button when onClick provided', () => {
    const mockOnClick = vi.fn()
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveAttribute('aria-label', 'View details for bulbasaur')
  })

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn()
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should call onClick when Enter key is pressed', () => {
    const mockOnClick = vi.fn()
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should call onClick when Space key is pressed', () => {
    const mockOnClick = vi.fn()
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: ' ' })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick for other keys', () => {
    const mockOnClick = vi.fn()
    render(<PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'A' })

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('should have proper accessibility attributes', () => {
    render(<PokemonCard pokemon={mockPokemon} onClick={() => {}} />)

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label', 'View details for bulbasaur')

    const typesContainer = screen.getByLabelText('Pokemon types')
    expect(typesContainer).toBeInTheDocument()

    const typeElements = screen.getAllByLabelText(/^Type: /)
    expect(typeElements).toHaveLength(2)
    expect(typeElements[0]).toHaveAttribute('aria-label', 'Type: grass')
    expect(typeElements[1]).toHaveAttribute('aria-label', 'Type: poison')
  })

  it('should have lazy loading on images', () => {
    render(<PokemonCard pokemon={mockPokemon} />)

    const image = screen.getByAltText('Image of bulbasaur Pokemon')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})