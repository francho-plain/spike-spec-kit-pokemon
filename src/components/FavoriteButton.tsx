import { useState, useEffect } from 'react'
import { localStorageService } from '../services/localStorage'
import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  pokemonId: number
  pokemonName: string
}

function FavoriteButton({ pokemonId, pokemonName }: FavoriteButtonProps) {
  // Validate inputs
  if (!pokemonId || pokemonId < 1 || !pokemonName || pokemonName.trim() === '') {
    console.error('FavoriteButton: Invalid pokemonId or pokemonName provided')
    return null
  }

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsFavorite(localStorageService.isFavorite(pokemonId))
  }, [pokemonId])

  const handleToggleFavorite = () => {
    if (isFavorite) {
      localStorageService.removeFavorite(pokemonId)
      setIsFavorite(false)
    } else {
      localStorageService.addFavorite(pokemonId, pokemonName)
      setIsFavorite(true)
    }
  }

  return (
    <button
      className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? `Remove ${pokemonName} from favorites` : `Add ${pokemonName} to favorites`}
      aria-pressed={isFavorite}
      data-testid="favorite-button"
    >
      <span aria-hidden="true">
        {isFavorite ? '❤️' : '🤍'}
      </span>
      <span className={styles.srOnly}>
        {isFavorite ? 'Favorited' : 'Not favorited'}
      </span>
    </button>
  )
}

export default FavoriteButton