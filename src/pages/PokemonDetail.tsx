import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { pokeApi } from '../services/pokeApi'
import FavoriteButton from '../components/FavoriteButton'
import PokemonDetailSkeleton from '../components/PokemonDetailSkeleton'
import styles from './PokemonDetail.module.css'

function PokemonDetail() {
  const { id } = useParams<{ id: string }>()
  const pokemonId = parseInt(id || '1')

  // Validate Pokemon ID
  if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 1010) {
    return (
      <main id="main-content">
        <div className={styles.error}>
          <h2>Invalid Pokemon ID</h2>
          <p>The Pokemon ID must be a number between 1 and 1010.</p>
          <button onClick={() => window.history.back()} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </main>
    )
  }

  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => pokeApi.getPokemon(pokemonId),
  })

  if (isLoading) return <PokemonDetailSkeleton />
  if (error) return (
    <main id="main-content">
      <div className={styles.error}>
        <h2>Unable to load Pokemon details</h2>
        <p>This Pokemon might not exist or there might be a connection issue. Please try again or go back to explore other Pokemon.</p>
        <div className={styles.errorActions}>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Try Again
          </button>
          <button onClick={() => window.history.back()} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    </main>
  )
  if (!pokemon) return (
    <main id="main-content">
      <div className={styles.error}>
        <h2>Pokemon not found</h2>
        <p>The Pokemon you're looking for doesn't exist in our database.</p>
        <button onClick={() => window.history.back()} className={styles.backButton}>
          Go Back
        </button>
      </div>
    </main>
  )

  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default ||
                   pokemon.sprites.front_default

  return (
    <main id="main-content">
      <div className={styles.detail}>
        <div className={styles.header}>
          <h1 className={styles.name}>{pokemon.name}</h1>
          <FavoriteButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
        </div>
        <img
          src={imageUrl}
          alt={pokemon.name}
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-pokemon.png' // Fallback image
            target.alt = `Image not available for ${pokemon.name} Pokemon`
          }}
        />
        <div className={styles.info}>
          <section className={styles.types} aria-labelledby="types-heading">
            <h2 id="types-heading">Types</h2>
            {pokemon.types.map(({ type }) => (
              <span key={type.name} className={styles.type}>
                {type.name}
              </span>
            ))}
          </section>
          <section className={styles.stats} aria-labelledby="stats-heading">
            <h3 id="stats-heading">Stats</h3>
            {pokemon.stats.map(({ stat, base_stat }) => (
              <div key={stat.name} className={styles.stat}>
                <span>{stat.name}: </span>
                <span>{base_stat}</span>
              </div>
            ))}
          </section>
          <section className={styles.details}>
            <p>Height: {pokemon.height / 10} m</p>
            <p>Weight: {pokemon.weight / 10} kg</p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default PokemonDetail