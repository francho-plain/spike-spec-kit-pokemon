import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { localStorageService } from '../services/localStorage'
import PokemonCard from '../components/PokemonCard'
import styles from './Favorites.module.css'

function Favorites() {
  const [favorites, setFavorites] = useState(localStorageService.getFavorites())
  const navigate = useNavigate()

  useEffect(() => {
    const updateFavorites = () => {
      setFavorites(localStorageService.getFavorites())
    }

    // Listen for storage changes (in case favorites are updated in another tab)
    window.addEventListener('storage', updateFavorites)
    return () => window.removeEventListener('storage', updateFavorites)
  }, [])

  const handlePokemonClick = (id: number) => {
    navigate(`/pokemon/${id}`)
  }

  return (
    <main id="main-content">
      <div className={styles.favorites}>
        <h1>My Favorites</h1>
        {favorites.length === 0 ? (
          <p>You haven't added any favorites yet. Go explore some Pokemon!</p>
        ) : (
          <section className={styles.grid} aria-label="Your favorite Pokemon">
            {favorites.map(favorite => (
              <PokemonCard
                key={favorite.pokemonId}
                pokemon={{
                  id: favorite.pokemonId,
                  name: favorite.pokemonName,
                  imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${favorite.pokemonId}.png`,
                  types: []
                }}
                onClick={() => handlePokemonClick(favorite.pokemonId)}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

export default Favorites