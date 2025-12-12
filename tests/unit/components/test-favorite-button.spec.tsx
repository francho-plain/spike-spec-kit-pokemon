import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import FavoriteButton from '../../../src/components/FavoriteButton'
import { localStorageService } from '../../../src/services/localStorage'

// Mock the localStorage service
vi.mock('../../../src/services/localStorage', () => ({
  localStorageService: {
    isFavorite: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}))

const mockLocalStorageService = vi.mocked(localStorageService)

describe('FavoriteButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render as not favorited when pokemon is not in favorites', () => {
    mockLocalStorageService.isFavorite.mockReturnValue(false)

    render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-label', 'Add bulbasaur to favorites')
    expect(screen.getByText('🤍')).toBeInTheDocument()
    expect(screen.getByText('Not favorited')).toBeInTheDocument()
  })

  it('should render as favorited when pokemon is in favorites', () => {
    mockLocalStorageService.isFavorite.mockReturnValue(true)

    render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('aria-label', 'Remove bulbasaur from favorites')
    expect(screen.getByText('❤️')).toBeInTheDocument()
    expect(screen.getByText('Favorited')).toBeInTheDocument()
  })

  it('should call addFavorite when clicking unfavorited button', () => {
    mockLocalStorageService.isFavorite.mockReturnValue(false)

    render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockLocalStorageService.addFavorite).toHaveBeenCalledWith(1, 'bulbasaur')
    expect(mockLocalStorageService.removeFavorite).not.toHaveBeenCalled()
  })

  it('should call removeFavorite when clicking favorited button', () => {
    mockLocalStorageService.isFavorite.mockReturnValue(true)

    render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockLocalStorageService.removeFavorite).toHaveBeenCalledWith(1)
    expect(mockLocalStorageService.addFavorite).not.toHaveBeenCalled()
  })

  it('should check favorite status on mount', () => {
    mockLocalStorageService.isFavorite.mockReturnValue(false)

    render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    expect(mockLocalStorageService.isFavorite).toHaveBeenCalledWith(1)
  })

  it('should re-check favorite status when pokemonId changes', () => {
    mockLocalStorageService.isFavorite.mockReturnValue(false)

    const { rerender } = render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    expect(mockLocalStorageService.isFavorite).toHaveBeenCalledWith(1)

    mockLocalStorageService.isFavorite.mockReturnValue(true)
    rerender(<FavoriteButton pokemonId={2} pokemonName="charmander" />)

    expect(mockLocalStorageService.isFavorite).toHaveBeenCalledWith(2)
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<FavoriteButton pokemonId={1} pokemonName="bulbasaur" />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})